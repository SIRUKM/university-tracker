package com.upkar.unitracker.controller;

import com.upkar.unitracker.model.Application;
import com.upkar.unitracker.repository.ApplicationRepository;
import com.upkar.unitracker.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository repository;

    @Autowired
    private ReminderService reminderService;

    @GetMapping
    public List<Application> getAllApplications(Principal principal) {
        return repository.findByUserId(principal.getName());
    }

    @PostMapping
    public Application saveApplication(@RequestBody Application application, Principal principal) {
        application.setUserId(principal.getName());
        if (application.getReminderType() == null) {
            application.setReminderType("NONE");
        }
        if (application.getReminderSent() == null) {
            application.setReminderSent(false);
        }
        Application saved = repository.save(application);

        // Send confirmation email if a reminder is active
        if (!"NONE".equalsIgnoreCase(saved.getReminderType())) {
            reminderService.sendConfirmationOrTestEmail(saved);
        }

        return saved;
    }

    @PutMapping("/{id}")
    public Application updateApplication(@PathVariable String id, @RequestBody Application updatedApp, Principal principal) {
        String userId = principal.getName();
        
        // Ensure the record exists and belongs to the authenticated user
        Application existing = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        boolean reminderActivated = !Objects.equals(existing.getReminderType(), updatedApp.getReminderType())
                && updatedApp.getReminderType() != null
                && !"NONE".equalsIgnoreCase(updatedApp.getReminderType());

        if (reminderActivated) {
            updatedApp.setReminderSent(false);
        }

        updatedApp.setId(id);
        updatedApp.setUserId(userId);
        Application saved = repository.save(updatedApp);

        // Send confirmation email when a user sets or changes their reminder
        if (reminderActivated) {
            reminderService.sendConfirmationOrTestEmail(saved);
        }

        return saved;
    }

    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable String id, Principal principal) {
        String userId = principal.getName();
        
        // Ensure the record exists and belongs to the authenticated user before deletion
        Application existing = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        repository.delete(existing);
    }

    // Endpoint for users to manually test sending a reminder email immediately
    @PostMapping("/{id}/test-reminder")
    public boolean testReminderEmail(@PathVariable String id, Principal principal) {
        String userId = principal.getName();
        Application app = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        return reminderService.sendConfirmationOrTestEmail(app);
    }

    // Endpoint to manually or via external cron trigger daily reminder checks
    @PostMapping("/process-reminders")
    public int triggerDailyReminders() {
        return reminderService.processDailyReminders();
    }
}
