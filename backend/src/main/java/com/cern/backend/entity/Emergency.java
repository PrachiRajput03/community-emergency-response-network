package com.cern.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import com.cern.backend.enums.EmergencySeverity;
import com.cern.backend.enums.EmergencyStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "emergencies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Emergency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String location;
    private Double latitude;

    private Double longitude;

    @Enumerated(EnumType.STRING)
    private EmergencySeverity severity; 

    @Enumerated(EnumType.STRING)
    private EmergencyStatus status;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    @JsonIgnoreProperties({
        "password",
        "createdAt"
})
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "assigned_volunteer")
    @JsonIgnoreProperties({
        "password",
        "createdAt"
})
    private User assignedVolunteer;
}