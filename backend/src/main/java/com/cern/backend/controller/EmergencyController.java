package com.cern.backend.controller;

import com.cern.backend.dto.CreateEmergencyRequest;
import com.cern.backend.service.EmergencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.cern.backend.entity.Emergency;
import java.util.List;

@RestController
@RequestMapping("/api/v1/emergencies")
@RequiredArgsConstructor
public class EmergencyController {

    private final EmergencyService emergencyService;

    @PostMapping
    public String createEmergency(
            @RequestBody CreateEmergencyRequest request) {

        return emergencyService.createEmergency(request);
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
}