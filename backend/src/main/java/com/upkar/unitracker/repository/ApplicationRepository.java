package com.upkar.unitracker.repository;

import com.upkar.unitracker.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {
    
    // Find all applications belonging to a specific user
    List<Application> findByUserId(String userId);

    // Verify ownership when modifying or deleting an application
    Optional<Application> findByIdAndUserId(String id, String userId);
}
