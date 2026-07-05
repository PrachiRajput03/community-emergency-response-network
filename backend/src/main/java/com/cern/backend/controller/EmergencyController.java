package com.cern.backend.controller;

import com.cern.backend.dto.CreateEmergencyRequest;
import com.cern.backend.entity.Emergency;
import com.cern.backend.enums.EmergencySeverity;
import com.cern.backend.enums.EmergencyStatus;
import com.cern.backend.service.EmergencyService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/emergencies")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyService emergencyService;

    @PostMapping
    public String createEmergency(
            @RequestBody CreateEmergencyRequest request,
            HttpServletRequest httpRequest) {

        String email = (String) httpRequest.getAttribute("email");

        return emergencyService.createEmergency(request, email);
    }

    @GetMapping
    public List<Emergency> getAllEmergencies() {
        return emergencyService.getAllEmergencies();
    }

    @GetMapping("/{id}")
    public Emergency getEmergencyById(@PathVariable Long id) {
        return emergencyService.getEmergencyById(id);
    }

    @PutMapping("/{id}/status")
    public String updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return emergencyService.updateStatus(id, status);
    }

    @PostMapping("/{id}/accept")
    public String acceptEmergency(
            @PathVariable Long id,
            HttpServletRequest request) {

        String email = (String) request.getAttribute("email");

        return emergencyService.acceptEmergency(id, email);
    }

    @PostMapping("/{id}/resolve")
    public String resolveEmergency(
            @PathVariable Long id,
            HttpServletRequest request) {

        String email = (String) request.getAttribute("email");

        return emergencyService.resolveEmergency(id, email);
    }

    @GetMapping("/status/{status}")
    public List<Emergency> getByStatus(
            @PathVariable EmergencyStatus status) {

        return emergencyService.getEmergenciesByStatus(status);
    }

    @GetMapping("/severity/{severity}")
    public List<Emergency> getBySeverity(
            @PathVariable EmergencySeverity severity) {

        return emergencyService.getEmergenciesBySeverity(severity);
    }

    @GetMapping("/my")
public List<Emergency> getMyEmergencies(
        HttpServletRequest request) {

    String email =
            (String) request.getAttribute("email");

    return emergencyService.getMyEmergencies(email);
}

@GetMapping("/my-assigned")
public List<Emergency> getMyAssignedEmergencies(
        HttpServletRequest request) {

    String email =
            (String) request.getAttribute("email");

    return emergencyService
            .getMyAssignedEmergencies(email);
}

@GetMapping("/medical")
public List<Emergency> getMedicalEmergencies() {
    return emergencyService.getMedicalEmergencies();
}

@GetMapping("/fire")
public List<Emergency> getFireEmergencies() {
    return emergencyService.getFireEmergencies();
}

@GetMapping("/police")
public List<Emergency> getPoliceEmergencies() {
    return emergencyService.getPoliceEmergencies();
}

@GetMapping("/volunteer")
public List<Emergency> getVolunteerEmergencies() {
    return emergencyService.getVolunteerEmergencies();
}
}