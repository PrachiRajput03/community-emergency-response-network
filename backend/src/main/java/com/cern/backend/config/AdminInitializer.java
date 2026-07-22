package com.cern.backend.config;

import com.cern.backend.entity.User;
import com.cern.backend.entity.UserRole;
import com.cern.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${admin.bootstrap.enabled:false}")
    private boolean bootstrapEnabled;

    @Value("${admin.email:}")
    private String adminEmail;

    @Value("${admin.password:}")
    private String adminPassword;

    @Value("${admin.name:CERN Administrator}")
    private String adminName;

    @Value("${admin.phone:}")
    private String adminPhone;

    @Override
    public void run(String... args) {

        if (!bootstrapEnabled) {
            System.out.println("Admin bootstrap is disabled.");
            return;
        }

        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            throw new IllegalStateException(
                    "ADMIN_EMAIL and ADMIN_PASSWORD must be provided when admin bootstrap is enabled."
            );
        }

        if (userRepository.existsByEmail(adminEmail)) {
            System.out.println("Admin account already exists. Bootstrap skipped.");
            return;
        }

        User admin = User.builder()
                .name(adminName)
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .phone(adminPhone)
                .role(UserRole.ADMIN)
                .build();

        userRepository.save(admin);

        System.out.println("Initial admin account created successfully.");
    }
}