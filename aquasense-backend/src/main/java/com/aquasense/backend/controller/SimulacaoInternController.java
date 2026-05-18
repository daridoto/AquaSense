package com.aquasense.backend.controller;

import com.aquasense.backend.service.ProjetoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Endpoint interno — llamado exclusivamente por el motor de simulación Python.
 * No se requiere JWT (la ruta está permitida en SecurityConfig bajo /interno/**).
 */
@RestController
@RequestMapping("/interno/simulacao")
@RequiredArgsConstructor
public class SimulacaoInternController {

    private final ProjetoService projetoService;

    // GET /interno/simulacao/projetos-ativos
    // Devuelve la lista de IDs de proyectos con simulacaoAtiva = true
    @GetMapping("/projetos-ativos")
    public ResponseEntity<List<Long>> getProjetosAtivos() {
        return ResponseEntity.ok(projetoService.getProjetosAtivos());
    }

    // GET /interno/simulacao/projetos/:id/modos
    // Devuelve el modo (AUTO|MANUAL) de cada componente del proyecto — usado por el simulador Python
    // para saber qué componentes debe saltarse en este ciclo.
    @GetMapping("/projetos/{id}/modos")
    public ResponseEntity<Map<String, String>> getModosPorProjeto(@PathVariable Long id) {
        return ResponseEntity.ok(projetoService.getModoComponentes(id));
    }
}
