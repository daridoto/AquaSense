package com.aquasense.backend.controller;

import com.aquasense.backend.dto.TuberiaDTO;
import com.aquasense.backend.service.TuberiaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proyectos/{projetoId}/tuberias")
@RequiredArgsConstructor
public class TuberiaController {

    private final TuberiaService tuberiaService;

    // GET /api/proyectos/:id/tuberias
    @GetMapping
    public ResponseEntity<List<TuberiaDTO>> list(
            @PathVariable Long projetoId,
            Authentication auth) {
        return ResponseEntity.ok(tuberiaService.listByProjeto(projetoId, auth.getName()));
    }

    // POST /api/proyectos/:id/tuberias
    @PostMapping
    public ResponseEntity<TuberiaDTO> create(
            @PathVariable Long projetoId,
            @Valid @RequestBody TuberiaDTO dto,
            Authentication auth) {
        TuberiaDTO created = tuberiaService.create(projetoId, dto, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // GET /api/proyectos/:id/tuberias/:tid
    @GetMapping("/{tuberiaId}")
    public ResponseEntity<TuberiaDTO> getById(
            @PathVariable Long projetoId,
            @PathVariable Long tuberiaId,
            Authentication auth) {
        return ResponseEntity.ok(tuberiaService.getById(projetoId, tuberiaId, auth.getName()));
    }

    // DELETE /api/proyectos/:id/tuberias/:tid
    @DeleteMapping("/{tuberiaId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long projetoId,
            @PathVariable Long tuberiaId,
            Authentication auth) {
        tuberiaService.delete(projetoId, tuberiaId, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
