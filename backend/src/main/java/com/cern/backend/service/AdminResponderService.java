package com.cern.backend.service;

import com.cern.backend.dto.CreateResponderRequest;
import com.cern.backend.dto.ResponderResponse;
import com.cern.backend.entity.User;
import com.cern.backend.entity.UserRole;
import com.cern.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminResponderService {

    private static final Set<UserRole> ALLOWED_RESPONDER_ROLES = Set.of(
        UserRole.MEDICAL_RESPONDER,
        UserRole.FIRE_RESPONDER,
        UserRole.POLICE_RESPONDER
    );

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public ResponderResponse createResponder(
        CreateResponderRequest request
    ) {
        if (!ALLOWED_RESPONDER_ROLES.contains(request.getRole())) {
            throw new IllegalArgumentException(
                "Only medical, fire, or police responder accounts can be created"
            );
        }

        String normalizedEmail = request
            .getEmail()
            .trim()
            .toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException(
                "An account with this email already exists"
            );
        }

        User responder = new User();
        responder.setName(request.getName().trim());
        responder.setEmail(normalizedEmail);
        responder.setPhone(request.getPhone().trim());
        responder.setPassword(
            passwordEncoder.encode(request.getPassword())
        );
        responder.setRole(request.getRole());

        User savedResponder = userRepository.save(responder);

        return mapToResponse(savedResponder);
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
            .map(this::mapToResponse)
            .toList();
    }

    private ResponderResponse mapToResponse(User user) {
        return new ResponderResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            user.getRole()
        );
    }
}