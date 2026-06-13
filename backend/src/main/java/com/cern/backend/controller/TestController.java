package com.cern.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/v1/test")
    public String test(HttpServletRequest request) {

        String email =
                (String) request.getAttribute("email");

        return "JWT valid for: " + email;
    }
}