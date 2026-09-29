package com.upkar.unitracker.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false)
    private String universityName;

    private String course;
    private String status;
    private String priority;
    
    private LocalDate openingDate;
    private LocalDate dateApplied;
    private LocalDate deadline;

    private String portal;
    private String vpdRequired;
    private String vpdStatus;
    private String applicationFee;
    private String feeStatus;

    @Column(columnDefinition = "TEXT")
    private String courseLink;

    @Column(columnDefinition = "TEXT")
    private String remarks;
}
