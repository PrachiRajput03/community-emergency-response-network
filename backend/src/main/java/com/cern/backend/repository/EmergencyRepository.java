package com.cern.backend.repository;

import com.cern.backend.entity.Emergency;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

import com.cern.backend.enums.EmergencySeverity;
import com.cern.backend.enums.EmergencyStatus;
import com.cern.backend.entity.User;
import com.cern.backend.enums.EmergencyCategory;

public interface EmergencyRepository
        extends JpaRepository<Emergency, Long> {
                List<Emergency> findByCreatedById(UUID userId);
                long countByStatus(EmergencyStatus status);
                List<Emergency> findByStatus(EmergencyStatus status);
                List<Emergency> findBySeverity(EmergencySeverity severity);
                List<Emergency> findByCreatedBy(User user);
                List<Emergency> findByAssignedVolunteer(User user);
                long countBySeverity(EmergencySeverity severity);
                List<Emergency> findByAcceptedAtIsNotNull();
                List<Emergency> findByCategory(EmergencyCategory category);
                List<Emergency> findByCategoryIn(List<EmergencyCategory> categories);
}
