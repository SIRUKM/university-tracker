package com.upkar.unitracker.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "applications")
@Data
public class Application {

    public Application() {
    }

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    private String userEmail;

    @Column(nullable = false)
    private String universityName;

    @Column(nullable = false)
    private String course;

    private String status;
    private String priority;
    
    private LocalDate openingDate;
    private LocalDate dateApplied;
    private LocalDate deadline;

    private String portal;
    private String vpdRequired;
    private String vpdStatus;
    private String greRequired;
    private String applicationFee;
    private String feeStatus;

    private String reminderType;
    private Boolean reminderSent;

    @Column(columnDefinition = "TEXT")
    private String checklistJson;

    @Column(columnDefinition = "TEXT")
    private String courseLink;

    @Column(columnDefinition = "TEXT")
    private String remarks;
}
