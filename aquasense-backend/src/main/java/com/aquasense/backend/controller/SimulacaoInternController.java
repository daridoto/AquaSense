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
 * Internal endpoint — called exclusively by the Python simulation engine.
 * No JWT required (route is permitted in SecurityConfig under /interno/**).
 */
@RestController
@RequestMapping("/interno/simulacao")
@RequiredArgsConstructor
public class SimulacaoInternController {

    private final ProjetoService projetoService;

    // GET /interno/simulacao/projetos-ativos
    // Returns the list of project IDs that have simulacaoAtiva = true
    @GetMapping("/projetos-ativos")
    public ResponseEntity<List<Long>> getProjetosAtivos() {
        return ResponseEntity.ok(projetoService.getProjetosAtivos());
    }

    // GET /interno/simulacao/projetos/:id/modos
    // Devolve o modo (AUTO|MANUAL) de cada componente do projeto — usado pelo simulador Python
    // para saber quais componentes deve saltar neste ciclo.
    @GetMapping("/projetos/{id}/modos")
    public ResponseEntity<Map<String, String>> getModosPorProjeto(@PathVariable Long id) {
        return ResponseEntity.ok(projetoService.getModoComponentes(id));
    }
}
