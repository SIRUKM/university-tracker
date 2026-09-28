package com.upkar.unitracker.controller;

import com.upkar.unitracker.model.Application;
import com.upkar.unitracker.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173") // Connects cleanly with your React Vite frontend
public class ApplicationController {

    @Autowired
    private ApplicationRepository repository;

    @GetMapping
    public List<Application> getAllApplications() {
        return repository.findAll();
    }

    @PostMapping
    public Application saveApplication(@RequestBody Application application) {
        return repository.save(application);
    }

    @PutMapping("/{id}")
    public Application updateApplication(@PathVariable String id, @RequestBody Application updatedApp) {
        updatedApp.setId(id);
        return repository.save(updatedApp);
    }

    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable String id) {
        repository.deleteById(id);
    }
}
