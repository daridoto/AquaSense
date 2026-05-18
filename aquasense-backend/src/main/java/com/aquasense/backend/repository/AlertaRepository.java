package com.aquasense.backend.repository;

import com.aquasense.backend.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    List<Alerta> findByProjetoIdOrderByCreadaEnDesc(Long projetoId);

    List<Alerta> findByProjetoIdAndAtivaOrderByCreadaEnDesc(Long projetoId, boolean ativa);

    // Deduplication check: one active alert per (project, component, tipo)
    Optional<Alerta> findByProjetoIdAndComponenteAndTipoAndAtivaTrue(
            Long projetoId, String componente, String tipo);

    // Used by resolverAlertasSi to close all active alerts for a component
    List<Alerta> findByProjetoIdAndComponenteAndAtivaTrue(Long projetoId, String componente);

    void deleteByProjetoId(Long projetoId);

    // Lifecycle: find specific alert belonging to a project
    Optional<Alerta> findByProjetoIdAndId(Long projetoId, Long alertaId);
}
