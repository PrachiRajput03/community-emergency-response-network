package com.cern.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DepartmentStats {

    private String department;
    private long totalEmergencies;
    private long openEmergencies;
    private long inProgressEmergencies;
    private long resolvedEmergencies;
    private long responders;
}