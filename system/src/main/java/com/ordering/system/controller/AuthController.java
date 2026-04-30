package com.ordering.system.controller;

import com.ordering.system.dto.LoginRequest;
import com.ordering.system.dto.LoginResponse;
import com.ordering.system.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService; // ← this was missing!

    // Thymeleaf login page
    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    // REST API endpoint for login
    @PostMapping("/api/auth/login")
    @ResponseBody
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }
}