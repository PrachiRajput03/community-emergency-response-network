package com.cern.backend.service;

import com.cern.backend.dto.CreateEmergencyRequest;
import com.cern.backend.entity.Emergency;
import com.cern.backend.repository.EmergencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.cern.backend.enums.EmergencyStatus;
import com.cern.backend.entity.User;
import com.cern.backend.repository.UserRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final EmergencyRepository emergencyRepository;
    private final UserRepository userRepository;

    public String acceptEmergency(Long emergencyId, String email) {

    Emergency emergency = emergencyRepository
            .findById(emergencyId)
            .orElseThrow(() ->
                    new RuntimeException("Emergency not found"));

    User volunteer = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found"));

    emergency.setAssignedVolunteer(volunteer);
    emergency.setStatus(EmergencyStatus.IN_PROGRESS);

    emergencyRepository.save(emergency);

    return "Emergency accepted successfully";
}

    public String createEmergency(CreateEmergencyRequest request, String email) {

        User user = userRepository.findByEmail(email)
        .orElseThrow(() ->
                new RuntimeException("User not found"));
        Emergency emergency = Emergency.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .severity(request.getSeverity())
                .status(EmergencyStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .createdBy(user)
                .build();

        emergencyRepository.save(emergency);
        return "Emergency created successfully";


    }

    public List<Emergency> getAllEmergencies() {
    return emergencyRepository.findAll();
}

public String updateStatus(Long id, String status) {

    Emergency emergency = emergencyRepository
            .findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Emergency not found"));

    emergency.setStatus(
    EmergencyStatus.valueOf(status)
);

    emergencyRepository.save(emergency);

    return "Status updated successfully";
}

public Emergency getEmergencyById(Long id) {

    return emergencyRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Emergency not found"));
}
}