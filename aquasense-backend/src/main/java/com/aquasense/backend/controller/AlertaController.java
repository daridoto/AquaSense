package com.aquasense.backend.controller;

import com.aquasense.backend.dto.AlertaDTO;
import com.aquasense.backend.service.AlertaService;
import com.aquasense.backend.service.ProjetoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/proyectos/{id}/alertas")
@RequiredArgsConstructor
public class AlertaController {

    private final AlertaService alertaService;
    private final ProjetoService projetoService;

    // POST /api/proyectos/{id}/alertas/{aid}/ack
    @PostMapping("/{aid}/ack")
    public ResponseEntity<AlertaDTO> ack(
            @PathVariable Long id,
            @PathVariable Long aid,
            @RequestBody(required = false) Map<String, String> body,
            Authentication auth) {
        projetoService.findOwnedProject(id, auth.getName());
        String comentario = body != null ? body.get("comentario") : null;
        return ResponseEntity.ok(alertaService.ackAlerta(id, aid, auth.getName(), comentario));
    }

    // POST /api/proyectos/{id}/alertas/{aid}/silence
    @PostMapping("/{aid}/silence")
    public ResponseEntity<AlertaDTO> silence(
            @PathVariable Long id,
            @PathVariable Long aid,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        projetoService.findOwnedProject(id, auth.getName());
        String hastaStr = body.get("hasta");
        if (hastaStr == null || hastaStr.isBlank()) {
            throw new IllegalArgumentException("Campo 'hasta' es obligatorio");
        }
        LocalDateTime hasta = LocalDateTime.parse(hastaStr);
        return ResponseEntity.ok(alertaService.silenciarAlerta(id, aid, hasta));
    }

    // POST /api/proyectos/{id}/alertas/{aid}/assign
    @PostMapping("/{aid}/assign")
    public ResponseEntity<AlertaDTO> assign(
            @PathVariable Long id,
            @PathVariable Long aid,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        projetoService.findOwnedProject(id, auth.getName());
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Campo 'email' es obligatorio");
        }
        return ResponseEntity.ok(alertaService.asignarAlerta(id, aid, email));
    }

    // POST /api/proyectos/{id}/alertas/{aid}/resolve
    @PostMapping("/{aid}/resolve")
    public ResponseEntity<AlertaDTO> resolve(
            @PathVariable Long id,
            @PathVariable Long aid,
            @RequestBody(required = false) Map<String, String> body,
            Authentication auth) {
        projetoService.findOwnedProject(id, auth.getName());
        String comentario = body != null ? body.get("comentario") : null;
        return ResponseEntity.ok(alertaService.resolverAlerta(id, aid, auth.getName(), comentario));
    }

    // POST /api/proyectos/{id}/alertas/{aid}/comentarios
    @PostMapping("/{aid}/comentarios")
    public ResponseEntity<AlertaDTO.ComentarioDTO> comentar(
            @PathVariable Long id,
            @PathVariable Long aid,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        projetoService.findOwnedProject(id, auth.getName());
        String texto = body.get("texto");
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Campo 'texto' es obligatorio");
        }
        return ResponseEntity.ok(alertaService.comentarAlerta(id, aid, auth.getName(), texto));
    }
}
