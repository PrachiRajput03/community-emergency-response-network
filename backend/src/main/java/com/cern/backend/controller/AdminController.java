package com.cern.backend.controller;

import com.cern.backend.dto.RegisterRequest;
import com.cern.backend.dto.ResponderResponse;
import com.cern.backend.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/responders")
    public ResponseEntity<String> createResponder(
            @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest
    ) {
        String email =
                (String) httpRequest.getAttribute("email");

        String message =
                adminService.createResponder(request, email);

        return ResponseEntity.ok(message);
    }

    @GetMapping("/responders")
    public ResponseEntity<List<ResponderResponse>>
    getAllResponders() {

        return ResponseEntity.ok(
                adminService.getAllResponders()
        );
    }
}