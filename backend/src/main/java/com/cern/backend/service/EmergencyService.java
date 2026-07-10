package com.cern.backend.service;
import java.util.Arrays;

import com.cern.backend.dto.CreateEmergencyRequest;
import com.cern.backend.entity.Emergency;
import com.cern.backend.entity.User;
import com.cern.backend.entity.UserRole;
import com.cern.backend.enums.EmergencySeverity;
import com.cern.backend.enums.EmergencyStatus;
import com.cern.backend.repository.EmergencyRepository;
import com.cern.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.cern.backend.enums.EmergencyCategory;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final EmergencyRepository emergencyRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public String createEmergency(CreateEmergencyRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != UserRole.CITIZEN) {
            throw new RuntimeException("Only citizens can create emergencies");
        }

        Emergency emergency = Emergency.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .category(request.getCategory())
                .severity(request.getSeverity())
                .status(EmergencyStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .createdBy(user)
                .build();

        Emergency savedEmergency = emergencyRepository.save(emergency);

        notificationService.notifyNewEmergency(savedEmergency);

        return "Emergency created successfully";
    }

    public String acceptEmergency(Long emergencyId, String email) {

        Emergency emergency = emergencyRepository
                .findById(emergencyId)
                .orElseThrow(() -> new RuntimeException("Emergency not found"));

        User volunteer = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (volunteer.getRole() != UserRole.VOLUNTEER && volunteer.getRole() != UserRole.MEDICAL_RESPONDER && volunteer.getRole() != UserRole.FIRE_RESPONDER && volunteer.getRole() != UserRole.POLICE_RESPONDER) {
                throw new RuntimeException("Only responders can accept emergencies");
        }

        emergency.setAssignedVolunteer(volunteer);
        emergency.setStatus(EmergencyStatus.IN_PROGRESS);
        emergency.setAcceptedAt(LocalDateTime.now());

        emergencyRepository.save(emergency);

        return "Emergency accepted successfully";
    }

    public String resolveEmergency(Long id, String email) {

        Emergency emergency = emergencyRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != UserRole.VOLUNTEER && user.getRole() != UserRole.MEDICAL_RESPONDER && user.getRole() != UserRole.FIRE_RESPONDER && user.getRole() != UserRole.POLICE_RESPONDER && user.getRole() != UserRole.ADMIN) {
                throw new RuntimeException("Only responders or admins can resolve emergencies");
        }               

        emergency.setStatus(EmergencyStatus.RESOLVED);
        emergency.setResolvedAt(LocalDateTime.now());

        emergencyRepository.save(emergency);

        return "Emergency resolved successfully";
    }

    public List<Emergency> getAllEmergencies() {
        return emergencyRepository.findAll();
    }

    public Emergency getEmergencyById(Long id) {
        return emergencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency not found"));
    }

    public String updateStatus(Long id, String status) {

        Emergency emergency = emergencyRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency not found"));

        emergency.setStatus(EmergencyStatus.valueOf(status));

        emergencyRepository.save(emergency);

        return "Status updated successfully";
    }

    public List<Emergency> getEmergenciesByStatus(EmergencyStatus status) {
        return emergencyRepository.findByStatus(status);
    }

    public List<Emergency> getEmergenciesBySeverity(EmergencySeverity severity) {
        return emergencyRepository.findBySeverity(severity);
    }

    public List<Emergency> getMyEmergencies(String email) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    return emergencyRepository.findByCreatedBy(user);
}

public List<Emergency> getMyAssignedEmergencies(
        String email) {

    User volunteer = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    return emergencyRepository
            .findByAssignedVolunteer(volunteer);


}

public List<Emergency> getMedicalEmergencies() {
    return emergencyRepository.findByCategoryIn(
            Arrays.asList(
                    EmergencyCategory.MEDICAL,
                    EmergencyCategory.ROAD_ACCIDENT
            )
    );
}

public List<Emergency> getFireEmergencies() {
    return emergencyRepository.findByCategory(
            EmergencyCategory.FIRE
    );
}

public List<Emergency> getPoliceEmergencies() {
    return emergencyRepository.findByCategoryIn(
            Arrays.asList(
                    EmergencyCategory.WOMEN_SAFETY,
                    EmergencyCategory.CRIME
            )
    );
}

public List<Emergency> getVolunteerEmergencies() {
    return emergencyRepository.findByCategoryIn(
            Arrays.asList(
                    EmergencyCategory.GENERAL_HELP,
                    EmergencyCategory.NATURAL_DISASTER
            )
    );
}

public List<Emergency> getMyActiveMissions(String email) {

    User responder = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    return emergencyRepository.findByAssignedVolunteerAndStatus(
            responder,
            EmergencyStatus.IN_PROGRESS
    );
}
}