package com.cern.backend.dto;

import lombok.Data;

import com.cern.backend.enums.EmergencyCategory;
import com.cern.backend.enums.EmergencySeverity;
import com.cern.backend.enums.EmergencyCategory;


@Data
public class CreateEmergencyRequest {

    private String title;

    private String description;

    private String location;
    private EmergencyCategory category;
    private EmergencySeverity severity;
    private Double latitude;

    private Double longitude;
    
}