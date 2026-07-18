package com.cern.backend.dto;

import com.cern.backend.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateResponderRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Temporary password is required")
    @Size(
        min = 6,
        message = "Temporary password must contain at least 6 characters"
    )
    private String password;

    @NotNull(message = "Responder role is required")
    private UserRole role;
}