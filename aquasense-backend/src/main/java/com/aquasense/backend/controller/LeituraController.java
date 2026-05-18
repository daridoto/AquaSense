package com.aquasense.backend.controller;

import com.aquasense.backend.dto.LeituraDTO;
import com.aquasense.backend.model.LeituraSensor;
import com.aquasense.backend.model.Projeto;
import com.aquasense.backend.repository.LeituraRepository;
import com.aquasense.backend.service.AlertaService;
import com.aquasense.backend.service.ProjetoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Endpoint interno — llamado exclusivamente por el motor de simulación Python.
 * No se requiere CORS (Python no envía cabeceras Origin).
 * No se requiere JWT (la ruta está permitida en SecurityConfig).
 */
@RestController
@RequestMapping("/interno/proyectos")
@RequiredArgsConstructor
@Slf4j
public class LeituraController {

    private final ProjetoService projetoService;
    private final LeituraRepository leituraRepository;
    private final AlertaService alertaService;
    private final ObjectMapper objectMapper;

    // POST /interno/proyectos/:id/lecturas
    @PostMapping("/{id}/lecturas")
    public ResponseEntity<Map<String, Object>> receiveLeitura(
            @PathVariable Long id,
            @Valid @RequestBody LeituraDTO dto) {

        // Usamos findById — la comprobación de ownership no es necesaria para llamadas internas
        Projeto projeto = projetoService.findOwnedProjectById(id);

        String valoresJson;
        try {
            valoresJson = objectMapper.writeValueAsString(dto.getValores());
        } catch (Exception e) {
            throw new IllegalArgumentException("Valores JSON inválido");
        }

        LocalDateTime ts = dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now();

        String origen = (dto.getOrigen() != null && dto.getOrigen().equals("MANUAL"))
                ? "MANUAL" : "AUTO";

        LeituraSensor lectura = LeituraSensor.builder()
                .projeto(projeto)
                .componente(dto.getComponente())
                .valores(valoresJson)
                .timestamp(ts)
                .origen(origen)
                .build();

        leituraRepository.save(lectura);

        // Evaluar umbrales y generar alertas
        alertaService.evaluarUmbral(projeto, dto.getComponente(), dto.getValores());

        log.debug("Lectura guardada: proyecto={}, componente={}, ts={}",
                id, dto.getComponente(), ts);

        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "proyecto", id,
                "componente", dto.getComponente(),
                "timestamp", ts.toString()
        ));
    }
}
