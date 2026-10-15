package com.upkar.unitracker.controller;

import com.upkar.unitracker.model.Application;
import com.upkar.unitracker.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository repository;

    @GetMapping
    public List<Application> getAllApplications(Principal principal) {
        return repository.findByUserId(principal.getName());
    }

    @PostMapping
    public Application saveApplication(@RequestBody Application application, Principal principal) {
        application.setUserId(principal.getName());
        return repository.save(application);
    }

    @PutMapping("/{id}")
    public Application updateApplication(@PathVariable String id, @RequestBody Application updatedApp, Principal principal) {
        String userId = principal.getName();
        
        // Ensure the record exists and belongs to the authenticated user
        Application existing = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        updatedApp.setId(id);
        updatedApp.setUserId(userId);
        return repository.save(updatedApp);
    }

    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable String id, Principal principal) {
        String userId = principal.getName();
        
        // Ensure the record exists and belongs to the authenticated user before deletion
        Application existing = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        repository.delete(existing);
    }
}
