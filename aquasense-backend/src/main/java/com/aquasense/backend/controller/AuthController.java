package com.aquasense.backend.controller;

import com.aquasense.backend.config.JwtConfig;
import com.aquasense.backend.dto.LoginRequest;
import com.aquasense.backend.dto.LoginResponse;
import com.aquasense.backend.dto.RegisterRequest;
import com.aquasense.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtConfig jwtConfig;

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        LoginResponse body = authService.register(request);
        httpResponse.addHeader("Set-Cookie", buildSessionCookie(body.getToken(), httpRequest).toString());
        return ResponseEntity.status(201).body(body);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        LoginResponse body = authService.login(request);
        httpResponse.addHeader("Set-Cookie", buildSessionCookie(body.getToken(), httpRequest).toString());
        return ResponseEntity.ok(body);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        String token = extractTokenFromCookie(request);
        if (token == null) {
            // fallback: Authorization header (compatibilidad con clientes no-browser)
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }
        if (token != null) {
            authService.logout(token);
        }
        response.addHeader("Set-Cookie", clearSessionCookie().toString());
        return ResponseEntity.noContent().build();
    }

    private ResponseCookie buildSessionCookie(String token, HttpServletRequest request) {
        boolean secure = request.isSecure();
        return ResponseCookie.from("aquasense_session", token)
                .httpOnly(true)
                .secure(secure)
                .path("/")
                .maxAge(Duration.ofMillis(jwtConfig.getExpiration()))
                .sameSite(secure ? "None" : "Lax")
                .build();
    }

    private ResponseCookie clearSessionCookie() {
        return ResponseCookie.from("aquasense_session", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
    }

    private String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
            if ("aquasense_session".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
