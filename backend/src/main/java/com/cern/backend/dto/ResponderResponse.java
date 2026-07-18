package com.cern.backend.dto;

import com.cern.backend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class ResponderResponse {

    private UUID id;
    private String name;
    private String email;
    private String phone;
    private UserRole role;
}