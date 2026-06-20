package com.cern.backend.service;

import com.cern.backend.dto.DashboardStats;
import com.cern.backend.entity.UserRole;
import com.cern.backend.enums.EmergencyStatus;
import com.cern.backend.repository.EmergencyRepository;
import com.cern.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmergencyRepository emergencyRepository;
    private final UserRepository userRepository;

    public DashboardStats getStats() {

        return new DashboardStats(
                emergencyRepository.count(),
                emergencyRepository.countByStatus(EmergencyStatus.OPEN),
                emergencyRepository.countByStatus(EmergencyStatus.IN_PROGRESS),
                emergencyRepository.countByStatus(EmergencyStatus.RESOLVED),
                userRepository.countByRole(UserRole.VOLUNTEER)
        );
    }
}