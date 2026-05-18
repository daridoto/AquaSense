package com.aquasense.backend.service;

import com.aquasense.backend.dto.PreferenciasNotificacionDTO;
import com.aquasense.backend.exception.ResourceNotFoundException;
import com.aquasense.backend.model.NivelAlerta;
import com.aquasense.backend.model.PreferenciasNotificacion;
import com.aquasense.backend.model.Projeto;
import com.aquasense.backend.model.Usuario;
import com.aquasense.backend.model.UsuarioProyectoRol;
import com.aquasense.backend.repository.PreferenciasNotificacionRepository;
import com.aquasense.backend.repository.ProjetoRepository;
import com.aquasense.backend.repository.UsuarioProyectoRolRepository;
import com.aquasense.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificacionService {

    private final PreferenciasNotificacionRepository preferenciasRepository;
    private final UsuarioProyectoRolRepository usuarioProyectoRolRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProjetoRepository projetoRepository;
    private final EmailService emailService;

    /**
     * Envía notificaciones por email a todos los usuarios con acceso al proyecto
     * que tienen notificarCritica=true. Llamado de forma asíncrona desde AlertaService.
     */
    @Async
    public void notificarAlertaCritica(Projeto projeto, String componente, String mensagem) {
        if (!emailService.isEnabled()) {
            return;
        }

        // Recopilar todos los usuarios con acceso: propietario + usuarios con rol
        List<Usuario> destinatarios = new ArrayList<>();
        destinatarios.add(projeto.getUsuario());
        usuarioProyectoRolRepository.findByProjetoId(projeto.getId())
                .stream()
                .map(UsuarioProyectoRol::getUsuario)
                .forEach(destinatarios::add);

        for (Usuario usuario : destinatarios) {
            try {
                var prefOpt = preferenciasRepository.findByUsuarioEmailAndProjetoId(
                        usuario.getEmail(), projeto.getId());

                boolean notificar = prefOpt.map(PreferenciasNotificacion::isNotificarCritica).orElse(true);
                if (!notificar) continue;

                String emailDestino = prefOpt
                        .map(PreferenciasNotificacion::getEmailDestino)
                        .filter(e -> e != null && !e.isBlank())
                        .orElse(usuario.getEmail());

                emailService.enviarAlertaCritica(emailDestino, projeto.getNombre(),
                        componente, mensagem, projeto.getId());
            } catch (Exception e) {
                log.warn("[NOTIFICACION] Error al notificar usuario {}: {}", usuario.getEmail(), e.getMessage());
            }
        }
    }

    public PreferenciasNotificacionDTO getPreferencias(Long projetoId, String email) {
        return preferenciasRepository.findByUsuarioEmailAndProjetoId(email, projetoId)
                .map(p -> PreferenciasNotificacionDTO.builder()
                        .notificarCritica(p.isNotificarCritica())
                        .notificarAdvertencia(p.isNotificarAdvertencia())
                        .emailDestino(p.getEmailDestino())
                        .build())
                .orElse(PreferenciasNotificacionDTO.builder()
                        .notificarCritica(true)
                        .notificarAdvertencia(false)
                        .emailDestino(null)
                        .build());
    }

    @Transactional
    public PreferenciasNotificacionDTO savePreferencias(Long projetoId, String email,
                                                         PreferenciasNotificacionDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + email));
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado: " + projetoId));

        PreferenciasNotificacion prefs = preferenciasRepository
                .findByUsuarioEmailAndProjetoId(email, projetoId)
                .orElseGet(() -> PreferenciasNotificacion.builder()
                        .usuario(usuario)
                        .projeto(projeto)
                        .build());

        prefs.setNotificarCritica(dto.isNotificarCritica());
        prefs.setNotificarAdvertencia(dto.isNotificarAdvertencia());
        prefs.setEmailDestino(dto.getEmailDestino());
        preferenciasRepository.save(prefs);

        return dto;
    }
}
