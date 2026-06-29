package com.cern.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class DashboardStats {

    private long totalEmergencies;
    private long openEmergencies;
    private long inProgressEmergencies;
    private long resolvedEmergencies;
    private long totalVolunteers;
    private long totalCitizens;
    private Map<String, Long> severityCounts;
}