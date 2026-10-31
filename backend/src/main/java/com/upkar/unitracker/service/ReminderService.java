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

    @Value("${RESEND_FROM_EMAIL:UniTracker <reminder@unitracker.live>}")
    private String fromEmail;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    // Runs automatically every day at 8:00 AM UTC
    @Scheduled(cron = "0 0 8 * * *")
    public int processDailyReminders() {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            System.out.println("Skipping daily reminders: RESEND_API_KEY is not configured.");
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

            if ("OPENING".equalsIgnoreCase(app.getReminderType()) && app.getOpeningDate() != null) {
                if (!today.isBefore(app.getOpeningDate())) {
                    shouldSend = true;
                    subject = "Applications Open: " + app.getUniversityName();
                    headline = "Applications are now open for <strong>" + app.getUniversityName()
                            + "</strong> (" + (app.getCourse() != null ? app.getCourse() : "Master's")
                            + "). Opening date: <strong>" + app.getOpeningDate() + "</strong>.";
                }
            } else if ("15_DAYS".equalsIgnoreCase(app.getReminderType()) && app.getDeadline() != null) {
                LocalDate triggerDate = app.getDeadline().minusDays(15);
                if (!today.isBefore(triggerDate) && !today.isAfter(app.getDeadline())) {
                    shouldSend = true;
                    subject = "15 Days Left to Apply: " + app.getUniversityName();
                    headline = "You have <strong>15 days or less</strong> remaining until the application deadline (<strong>"
                            + app.getDeadline() + "</strong>) for <strong>" + app.getUniversityName()
                            + "</strong> (" + (app.getCourse() != null ? app.getCourse() : "Master's") + ").";
                }
            } else if ("10_DAYS".equalsIgnoreCase(app.getReminderType()) && app.getDeadline() != null) {
                LocalDate triggerDate = app.getDeadline().minusDays(10);
                if (!today.isBefore(triggerDate) && !today.isAfter(app.getDeadline())) {
                    shouldSend = true;
                    subject = "Urgent — 10 Days Left: " + app.getUniversityName();
                    headline = "Only <strong>10 days or less remaining</strong> before the deadline (<strong>"
                            + app.getDeadline() + "</strong>) for <strong>" + app.getUniversityName()
                            + "</strong> (" + (app.getCourse() != null ? app.getCourse() : "Master's") + ").";
                }
            }

            if (shouldSend && sendEmail(app.getUserEmail(), subject, headline, app)) {
                app.setReminderSent(true);
                repository.save(app);
                sentCount++;
            }
        }
        return sentCount;
    }

    // Sends an immediate confirmation or test email when a user sets a reminder preset
    public boolean sendConfirmationOrTestEmail(Application app) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            System.err.println("Cannot send reminder: RESEND_API_KEY environment variable is not configured.");
            return false;
        }

        if (app.getUserEmail() == null || app.getUserEmail().isBlank()) {
            System.err.println("Cannot send reminder: user email is missing on application " + app.getId());
            return false;
        }

        String presetLabel = switch (app.getReminderType() != null ? app.getReminderType() : "NONE") {
            case "OPENING" -> "on the Opening Date (" + (app.getOpeningDate() != null ? app.getOpeningDate() : "TBD") + ")";
            case "15_DAYS" -> "15 days before the Deadline (" + (app.getDeadline() != null ? app.getDeadline().minusDays(15) : "TBD") + ")";
            case "10_DAYS" -> "10 days before the Deadline (" + (app.getDeadline() != null ? app.getDeadline().minusDays(10) : "TBD") + ")";
            default -> "for your upcoming deadline";
        };

        String course = (app.getCourse() != null && !app.getCourse().isBlank()) ? app.getCourse() : "Master's Program";
        String subject = "Reminder Confirmed: " + app.getUniversityName();
        String headline = "Your automated email alert is active for <strong>" + app.getUniversityName()
                + "</strong> (" + course + "). We will email you <strong>" + presetLabel + "</strong>.";

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

            String courseName = (app.getCourse() != null && !app.getCourse().isBlank())
                    ? app.getCourse()
                    : "Master's Program";

            String html = "<div style='font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;max-width:540px;margin:auto;padding:28px;border:1px solid #e5e7eb;border-radius:16px;background:#ffffff;'>"
                    + "<div style='display:inline-block;padding:4px 10px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:9999px;font-size:11px;font-weight:700;color:#065f46;margin-bottom:12px;'>UniTracker Alert</div>"
                    + "<h2 style='margin:0 0 12px 0;color:#111827;font-size:20px;font-weight:700;'>Admissions Reminder</h2>"
                    + "<p style='color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px 0;'>" + headline + "</p>"
                    + "<div style='background:#f9fafb;padding:16px;border-radius:12px;margin:0 0 20px 0;font-size:13px;color:#4b5563;border:1px solid #f3f4f6;'>"
                    + "<div style='margin-bottom:6px;'><strong>University:</strong> " + app.getUniversityName() + "</div>"
                    + "<div style='margin-bottom:6px;'><strong>Course:</strong> " + courseName + "</div>"
                    + "<div style='margin-bottom:6px;'><strong>Portal:</strong> " + (app.getPortal() != null ? app.getPortal() : "Direct Portal") + "</div>"
                    + "<div><strong>Deadline:</strong> " + (app.getDeadline() != null ? app.getDeadline() : "Not set") + "</div>"
                    + "</div>"
                    + "<div style='display:flex;gap:10px;'>"
                    + "<a href='https://unitracker.live' style='display:inline-block;padding:10px 18px;background:#000000;color:#ffffff;text-decoration:none;border-radius:10px;font-size:13px;font-weight:600;'>Open UniTracker</a>"
                    + "<a href='" + courseUrl + "' style='display:inline-block;padding:10px 18px;background:#f3f4f6;color:#111827;text-decoration:none;border-radius:10px;font-size:13px;font-weight:600;margin-left:8px;'>Course Website</a>"
                    + "</div>"
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
            boolean success = response.statusCode() >= 200 && response.statusCode() < 300;

            if (!success) {
                System.err.println("Resend API Email Failed (Status " + response.statusCode() + "): " + response.body());
            } else {
                System.out.println("Reminder Email Sent Successfully to: " + toEmail + " (" + subject + ")");
            }

            return success;
        } catch (Exception e) {
            System.err.println("Exception sending email: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
