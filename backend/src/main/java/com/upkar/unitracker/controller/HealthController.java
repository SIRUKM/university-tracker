package com.upkar.unitracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    @GetMapping({"/", "/health", "/api/health"})
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "uni-tracker-api");
        response.put("timestamp", Instant.now().toString());

        boolean dbOk = false;
        if (dataSource != null) {
            try (Connection connection = dataSource.getConnection();
                 Statement stmt = connection.createStatement()) {
                stmt.execute("SELECT 1");
                dbOk = true;
            } catch (Exception e) {
                dbOk = false;
            }
        }
        response.put("database", dbOk ? "CONNECTED" : "UNAVAILABLE");

        return ResponseEntity.ok(response);
    }
}
