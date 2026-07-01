package com.cern.backend.dto;

import lombok.Data;
import com.cern.backend.enums.EmergencySeverity;

@Data
public class CreateEmergencyRequest {

    private String title;

    private String description;

    private String location;

    private EmergencySeverity severity;
    private Double latitude;

    private Double longitude;
}