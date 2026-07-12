package com.cern.backend.service;

import com.cern.backend.dto.LoginRequest;
import com.cern.backend.dto.LoginResponse;
import com.cern.backend.dto.RegisterRequest;
import com.cern.backend.entity.User;
import com.cern.backend.entity.UserRole;
import com.cern.backend.repository.UserRepository;
import com.cern.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        if (request.getRole() != UserRole.CITIZEN &&
                request.getRole() != UserRole.VOLUNTEER) {
            return "Only citizens and volunteers can self-register";
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail());

       return new LoginResponse(
        token,
        user.getRole().name(),
        user.getName(),
        user.getEmail(),
        user.getPhone()
);
    }
}