package com.cern.backend.controller;

import com.cern.backend.dto.RegisterRequest;
import com.cern.backend.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/responders")
    public String createResponder(
            @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest) {

        String email = (String) httpRequest.getAttribute("email");

        return adminService.createResponder(request, email);
    }
}