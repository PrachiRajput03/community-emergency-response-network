package com.cern.backend.controller;

import com.cern.backend.dto.CreateEmergencyRequest;
import com.cern.backend.service.EmergencyService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cern.backend.entity.Emergency;
import com.cern.backend.enums.EmergencySeverity;
import com.cern.backend.enums.EmergencyStatus;

import java.util.List;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/emergencies")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyService emergencyService;

    @PostMapping
public String createEmergency(
        @RequestBody CreateEmergencyRequest request,
        HttpServletRequest httpRequest) {

    String email =
            (String) httpRequest.getAttribute("email");

    return emergencyService.createEmergency(
            request,
            email
    );
}

    @GetMapping
public List<Emergency> getAllEmergencies() {
    return emergencyService.getAllEmergencies();
}

@PutMapping("/{id}/status")
public String updateStatus(
        @PathVariable Long id,
        @RequestParam String status) {

    return emergencyService.updateStatus(id, status);
}

@GetMapping("/{id}")
public Emergency getEmergencyById(
        @PathVariable Long id) {

    return emergencyService.getEmergencyById(id);
}

@PostMapping("/{id}/accept")
public String acceptEmergency(
        @PathVariable Long id,
        HttpServletRequest request) {

    String email =
            (String) request.getAttribute("email");

    return emergencyService.acceptEmergency(
            id,
            email
    );
}

@PostMapping("/{id}/resolve")
public ResponseEntity<String> resolveEmergency(
        @PathVariable Long id) {

    return ResponseEntity.ok(
            emergencyService.resolveEmergency(id)
    );
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
}