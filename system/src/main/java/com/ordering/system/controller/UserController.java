package com.ordering.system.controller;

import com.ordering.system.dto.RegisterRequest;
import com.ordering.system.entity.User;
import com.ordering.system.repository.UserRepository;
import com.ordering.system.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class UserController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public UserController(AuthService authService,
                          UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    // Thymeleaf page
    @GetMapping("/user-management")
    public String userManagementPage() {
        return "user-management";
    }

    // REST - Get all users
    @GetMapping("/api/users")
    @ResponseBody
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // REST - Register new user
    @PostMapping("/api/users/register")
    @ResponseBody
    public ResponseEntity<Map<String, String>> register(
            @RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.ok(
                Map.of("message", "User registered successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        }
    }

    // REST - Delete user
    @DeleteMapping("/api/users/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // REST - Update user role
    @PutMapping("/api/users/{id}/role")
    @ResponseBody
    public ResponseEntity<Map<String, String>> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(body.get("role"));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Role updated successfully!"));
    }

    // REST - Change password
    @PutMapping("/api/users/{id}/password")
    @ResponseBody
    public ResponseEntity<Map<String, String>> changePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder =
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        user.setPassword(encoder.encode(body.get("password")));
        userRepository.save(user);
        return ResponseEntity.ok(
            Map.of("message", "Password changed successfully!"));
    }
}