package com.upkar.unitracker.service;

import com.upkar.unitracker.model.Application;
import com.upkar.unitracker.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private ApplicationRepository repository;

    @Value("${RESEND_API_KEY:}")
    private String resendApiKey;

    @Value("${RESEND_FROM_EMAIL:UniTracker <reminders@unitracker.live>}")
    private String fromEmail;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    // Runs automatically every day at 8:00 AM UTC
    @Scheduled(cron = "0 0 8 * * *")
    public int processDailyReminders() {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            return 0;
        }

        LocalDate today = LocalDate.now();
        List<Application> allApps = repository.findAll();
        int sentCount = 0;

        for (Application app : allApps) {
            if (Boolean.TRUE.equals(app.getReminderSent())
                    || app.getUserEmail() == null
                    || app.getUserEmail().isBlank()
                    || app.getReminderType() == null
                    || "NONE".equalsIgnoreCase(app.getReminderType())) {
                continue;
            }

            // Skip if user already submitted, was admitted, or was rejected
            if (app.getStatus() != null && !"Drafting".equalsIgnoreCase(app.getStatus())) {
                continue;
            }

            boolean shouldSend = false;
            String subject = "";
            String headline = "";

            if ("OPENING".equals(app.getReminderType()) && today.equals(app.getOpeningDate())) {
                shouldSend = true;
                subject = "Applications Open Today: " + app.getUniversityName();
                headline = "Applications open today (<strong>" + app.getOpeningDate() + "</strong>) for <strong>"
                        + app.getUniversityName() + "</strong> — " + app.getCourse() + ".";
            } else if ("15_DAYS".equals(app.getReminderType()) && app.getDeadline() != null
                    && today.equals(app.getDeadline().minusDays(15))) {
                shouldSend = true;
                subject = "15 Days Left to Apply: " + app.getUniversityName();
                headline = "You have <strong>15 days left</strong> until the application deadline (<strong>"
                        + app.getDeadline() + "</strong>) for <strong>" + app.getUniversityName()
                        + "</strong> (" + app.getCourse() + ").";
            } else if ("10_DAYS".equals(app.getReminderType()) && app.getDeadline() != null
                    && today.equals(app.getDeadline().minusDays(10))) {
                shouldSend = true;
                subject = "Urgent — 10 Days Left: " + app.getUniversityName();
                headline = "Only <strong>10 days remaining</strong> before the deadline (<strong>"
                        + app.getDeadline() + "</strong>) for <strong>" + app.getUniversityName()
                        + "</strong> (" + app.getCourse() + ").";
            }

            if (shouldSend && sendEmail(app.getUserEmail(), subject, headline, app)) {
                app.setReminderSent(true);
                repository.save(app);
                sentCount++;
            }
        }
        return sentCount;
    }

    // Sends an immediate confirmation email when a user sets a reminder preset
    public boolean sendConfirmationOrTestEmail(Application app) {
        if (resendApiKey == null || resendApiKey.isBlank() || app.getUserEmail() == null) {
            return false;
        }

        String presetLabel = switch (app.getReminderType() != null ? app.getReminderType() : "NONE") {
            case "OPENING" -> "on the Opening Date (" + (app.getOpeningDate() != null ? app.getOpeningDate() : "TBD") + ")";
            case "15_DAYS" -> "15 days before the Deadline (" + (app.getDeadline() != null ? app.getDeadline().minusDays(15) : "TBD") + ")";
            case "10_DAYS" -> "10 days before the Deadline (" + (app.getDeadline() != null ? app.getDeadline().minusDays(10) : "TBD") + ")";
            default -> "for your upcoming deadline";
        };

        String subject = "Reminder Confirmed: " + app.getUniversityName();
        String headline = "Your automated email alert is active for <strong>" + app.getUniversityName()
                + "</strong> (" + app.getCourse() + "). We will email you <strong>" + presetLabel + "</strong>.";

        return sendEmail(app.getUserEmail(), subject, headline, app);
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "");
    }

    private boolean sendEmail(String toEmail, String subject, String headline, Application app) {
        try {
            String courseUrl = (app.getCourseLink() != null && !app.getCourseLink().isBlank())
                    ? app.getCourseLink()
                    : "https://unitracker.live";

            String html = "<div style='font-family:sans-serif;max-width:540px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;'>"
                    + "<h2 style='margin-top:0;color:#111827;'>UniTracker Admissions Alert</h2>"
                    + "<p style='color:#374151;font-size:15px;line-height:1.6;'>" + headline + "</p>"
                    + "<div style='background:#f9fafb;padding:12px 16px;border-radius:8px;margin:16px 0;font-size:13px;color:#4b5563;'>"
                    + "<div><strong>Portal:</strong> " + (app.getPortal() != null ? app.getPortal() : "Direct Portal") + "</div>"
                    + "<div><strong>Deadline:</strong> " + (app.getDeadline() != null ? app.getDeadline() : "Not set") + "</div>"
                    + "</div>"
                    + "<a href='https://unitracker.live' style='display:inline-block;margin-right:10px;padding:10px 18px;background:#000;color:#fff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:600;'>Open UniTracker</a>"
                    + "<a href='" + courseUrl + "' style='display:inline-block;padding:10px 18px;background:#f3f4f6;color:#111827;text-decoration:none;border-radius:8px;font-size:13px;font-weight:600;'>University Portal</a>"
                    + "</div>";

            String jsonBody = String.format(
                    "{\"from\":\"%s\",\"to\":[\"%s\"],\"subject\":\"%s\",\"html\":\"%s\"}",
                    escapeJson(fromEmail),
                    escapeJson(toEmail),
                    escapeJson(subject),
                    escapeJson(html)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() >= 200 && response.statusCode() < 300;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
