package com.cern.backend.controller;

import com.cern.backend.dto.UpdateProfileRequest;
import com.cern.backend.entity.User;
import com.cern.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/profile")
    public User updateProfile(
            @RequestBody UpdateProfileRequest request,
            HttpServletRequest httpRequest) {

        String email =
                (String) httpRequest.getAttribute("email");

        return userService.updateProfile(email, request);
    }
}