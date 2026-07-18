package com.cern.backend.service;

import com.cern.backend.dto.RegisterRequest;
import com.cern.backend.dto.ResponderResponse;
import com.cern.backend.entity.User;
import com.cern.backend.entity.UserRole;
import com.cern.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public String createResponder(RegisterRequest request, String adminEmail) {

        User admin = userRepository.findByEmail(adminEmail)
        .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Only admins can create responders");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        if (request.getRole() != UserRole.MEDICAL_RESPONDER &&
                request.getRole() != UserRole.FIRE_RESPONDER &&
                request.getRole() != UserRole.POLICE_RESPONDER) {
            return "Admin can only create professional responders";
        }

        User responder = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .build();

        userRepository.save(responder);

        return "Responder created successfully";
    }

    public List<ResponderResponse> getAllResponders() {

    List<UserRole> responderRoles = List.of(
            UserRole.MEDICAL_RESPONDER,
            UserRole.FIRE_RESPONDER,
            UserRole.POLICE_RESPONDER
    );

    return userRepository
            .findAllByRoleIn(responderRoles)
            .stream()
            .map(user -> new ResponderResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getRole()
            ))
            .toList();
}
}