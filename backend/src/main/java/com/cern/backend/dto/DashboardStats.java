package com.cern.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {

    private long totalEmergencies;
    private long openEmergencies;
    private long inProgressEmergencies;
    private long resolvedEmergencies;
    private long totalVolunteers;
}