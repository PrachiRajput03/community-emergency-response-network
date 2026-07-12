package com.cern.backend.dto;

import com.cern.backend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String role;
    private String name;
    private String email;
    private String phone;
}