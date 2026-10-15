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

        if (!"NONE".equals(saved.getReminderType())) {
            reminderService.sendConfirmationOrTestEmail(saved);
        }
        return saved;
    }

    @PutMapping("/{id}")
    public Application updateApplication(@PathVariable String id, @RequestBody Application updatedApp, Principal principal) {
        String userId = principal.getName();
        
        Application existing = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        boolean reminderChanged = !Objects.equals(existing.getReminderType(), updatedApp.getReminderType())
                && updatedApp.getReminderType() != null
                && !"NONE".equals(updatedApp.getReminderType());

        if (reminderChanged) {
            updatedApp.setReminderSent(false);
        }

        updatedApp.setId(id);
        updatedApp.setUserId(userId);
        Application saved = repository.save(updatedApp);

        // Send immediate confirmation email when user activates a new reminder preset
        if (reminderChanged) {
            reminderService.sendConfirmationOrTestEmail(saved);
        }

        return saved;
    }

    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable String id, Principal principal) {
        String userId = principal.getName();
        
        Application existing = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        repository.delete(existing);
    }
}
