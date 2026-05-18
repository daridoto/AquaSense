package com.aquasense.backend.service;

import com.aquasense.backend.dto.*;
import com.aquasense.backend.model.Usuario;
import com.aquasense.backend.repository.ProjetoRepository;
import com.aquasense.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UsuarioRepository usuarioRepository;
    private final ProjetoRepository projetoRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditoriaService auditoriaService;

    public UserProfileDTO getProfile(String email) {
        Usuario u = findByEmail(email);
        return toDTO(u);
    }

    @Transactional
    public UserProfileDTO updateProfile(String email, UpdateProfileRequest request) {
        Usuario u = findByEmail(email);
        u.setNombre(request.getNombre());
        if (request.getLanguage() != null && !request.getLanguage().isBlank()) {
            u.setLanguage(request.getLanguage());
        }
        usuarioRepository.save(u);
        auditoriaService.registrar(null, email, "UPDATE_PROFILE", "Usuario:" + email, null, request.getNombre(), null);
        return toDTO(u);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        Usuario u = findByEmail(email);
        if (!passwordEncoder.matches(request.getCurrentPassword(), u.getPassword())) {
            throw new BadCredentialsException("Contraseña actual incorrecta");
        }
        u.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usuarioRepository.save(u);
        auditoriaService.registrar(null, email, "CHANGE_PASSWORD", "Usuario:" + email, null, null, null);
    }

    @Transactional
    public void changeEmail(String currentEmail, ChangeEmailRequest request) {
        Usuario u = findByEmail(currentEmail);
        if (!passwordEncoder.matches(request.getPassword(), u.getPassword())) {
            throw new BadCredentialsException("Contraseña incorrecta");
        }
        if (usuarioRepository.existsByEmail(request.getNewEmail())) {
            throw new IllegalStateException("Email ya registrado");
        }
        u.setEmail(request.getNewEmail());
        usuarioRepository.save(u);
        auditoriaService.registrar(null, currentEmail, "CHANGE_EMAIL", "Usuario:" + currentEmail, null, request.getNewEmail(), null);
    }

    @Transactional
    public void deleteAccount(String email, DeleteAccountRequest request) {
        Usuario u = findByEmail(email);
        if (!passwordEncoder.matches(request.getPassword(), u.getPassword())) {
            throw new BadCredentialsException("Contraseña incorrecta");
        }
        projetoRepository.findByUsuarioId(u.getId()).forEach(p -> projetoRepository.delete(p));
        usuarioRepository.delete(u);
    }

    private Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }

    private UserProfileDTO toDTO(Usuario u) {
        return UserProfileDTO.builder()
                .id(u.getId())
                .email(u.getEmail())
                .nombre(u.getNombre())
                .language(u.getLanguage())
                .build();
    }
}
