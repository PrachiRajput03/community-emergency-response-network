package com.cern.backend.service;

import com.cern.backend.dto.DashboardStats;
import com.cern.backend.dto.DepartmentStats;
import com.cern.backend.entity.Emergency;
import com.cern.backend.entity.UserRole;
import com.cern.backend.enums.EmergencyCategory;
import com.cern.backend.enums.EmergencySeverity;
import com.cern.backend.enums.EmergencyStatus;
import com.cern.backend.repository.EmergencyRepository;
import com.cern.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmergencyRepository emergencyRepository;
    private final UserRepository userRepository;

    public DashboardStats getStats() {

        Map<String, Long> severityCounts = Map.of(
                "LOW", emergencyRepository.countBySeverity(EmergencySeverity.LOW),
                "MEDIUM", emergencyRepository.countBySeverity(EmergencySeverity.MEDIUM),
                "HIGH", emergencyRepository.countBySeverity(EmergencySeverity.HIGH),
                "CRITICAL", emergencyRepository.countBySeverity(EmergencySeverity.CRITICAL)
        );

        List<Emergency> acceptedEmergencies =
                emergencyRepository.findByAcceptedAtIsNotNull();

        double avgResponseTime = 0;

        if (!acceptedEmergencies.isEmpty()) {
            avgResponseTime = acceptedEmergencies.stream()
                    .mapToLong(e ->
                            Duration.between(
                                    e.getCreatedAt(),
                                    e.getAcceptedAt()
                            ).toMinutes()
                    )
                    .average()
                    .orElse(0);
        }

        List<DepartmentStats> departmentStats = List.of(
                buildDepartmentStats(
                        "MEDICAL",
                        Arrays.asList(
                                EmergencyCategory.MEDICAL,
                                EmergencyCategory.ROAD_ACCIDENT
                        ),
                        UserRole.MEDICAL_RESPONDER
                ),
                buildDepartmentStats(
                        "FIRE",
                        Arrays.asList(EmergencyCategory.FIRE),
                        UserRole.FIRE_RESPONDER
                ),
                buildDepartmentStats(
                        "POLICE",
                        Arrays.asList(
                                EmergencyCategory.WOMEN_SAFETY,
                                EmergencyCategory.CRIME
                        ),
                        UserRole.POLICE_RESPONDER
                ),
                buildDepartmentStats(
                        "COMMUNITY",
                        Arrays.asList(
                                EmergencyCategory.GENERAL_HELP,
                                EmergencyCategory.NATURAL_DISASTER
                        ),
                        UserRole.VOLUNTEER
                )
        );

        return new DashboardStats(
                emergencyRepository.count(),
                emergencyRepository.countByStatus(EmergencyStatus.OPEN),
                emergencyRepository.countByStatus(EmergencyStatus.IN_PROGRESS),
                emergencyRepository.countByStatus(EmergencyStatus.RESOLVED),
                userRepository.countByRole(UserRole.VOLUNTEER),
                userRepository.countByRole(UserRole.CITIZEN),
                severityCounts,
                avgResponseTime,
                departmentStats
        );
    }

    private DepartmentStats buildDepartmentStats(
            String department,
            List<EmergencyCategory> categories,
            UserRole responderRole) {

        return new DepartmentStats(
                department,
                emergencyRepository.countByCategoryIn(categories),
                emergencyRepository.countByCategoryInAndStatus(categories, EmergencyStatus.OPEN),
                emergencyRepository.countByCategoryInAndStatus(categories, EmergencyStatus.IN_PROGRESS),
                emergencyRepository.countByCategoryInAndStatus(categories, EmergencyStatus.RESOLVED),
                userRepository.countByRole(responderRole)
        );
    }
}