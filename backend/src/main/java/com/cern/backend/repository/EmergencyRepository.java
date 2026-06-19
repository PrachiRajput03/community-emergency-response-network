package com.cern.backend.repository;

import com.cern.backend.entity.Emergency;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface EmergencyRepository
        extends JpaRepository<Emergency, Long> {
                List<Emergency> findByCreatedById(UUID userId);
}
