package com.aquasense.backend.service;

import com.aquasense.backend.dto.LoginRequest;
import com.aquasense.backend.dto.LoginResponse;
import com.aquasense.backend.dto.RegisterRequest;
import com.aquasense.backend.model.Usuario;
import com.aquasense.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditoriaService auditoriaService;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(userDetails);

        auditoriaService.registrar(null, request.getEmail(), "LOGIN",
                "Usuario:" + request.getEmail(), null, null, null);

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElseThrow();

        return LoginResponse.builder()
                .token(token)
                .expiresIn(28800)
                .usuario(LoginResponse.UsuarioDTO.builder()
                        .id(usuario.getId())
                        .email(usuario.getEmail())
                        .nombre(usuario.getNombre())
                        .language(usuario.getLanguage())
                        .build())
                .build();
    }

    public LoginResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email já registado");
        }
        String lang = request.getLanguage() != null ? request.getLanguage() : "en";
        Usuario usuario = usuarioRepository.save(Usuario.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nombre(request.getNombre())
                .language(lang)
                .build());

        UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getEmail());
        String token = jwtService.generateToken(userDetails);

        return LoginResponse.builder()
                .token(token)
                .expiresIn(28800)
                .usuario(LoginResponse.UsuarioDTO.builder()
                        .id(usuario.getId())
                        .email(usuario.getEmail())
                        .nombre(usuario.getNombre())
                        .language(usuario.getLanguage())
                        .build())
                .build();
    }

    public void logout(String token) {
        jwtService.invalidateToken(token);
    }
}
