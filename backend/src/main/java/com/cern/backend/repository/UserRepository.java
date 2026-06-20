package com.cern.backend.repository;

import com.cern.backend.entity.User;
import com.cern.backend.entity.UserRole;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    long countByRole(UserRole role);
    
}