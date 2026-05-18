package com.aquasense.backend.repository;

import com.aquasense.backend.model.EventoAuditoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface EventoAuditoriaRepository extends JpaRepository<EventoAuditoria, Long> {

    @Query("""
        SELECT e FROM EventoAuditoria e
        WHERE e.projeto.id = :projetoId
          AND (:usuario IS NULL OR e.usuario = :usuario)
          AND (:accion IS NULL OR e.accion = :accion)
          AND (:desde IS NULL OR e.timestamp >= :desde)
          AND (:hasta IS NULL OR e.timestamp <= :hasta)
        ORDER BY e.timestamp DESC
        """)
    Page<EventoAuditoria> findByProjetoIdWithFilters(
            @Param("projetoId") Long projetoId,
            @Param("usuario") String usuario,
            @Param("accion") String accion,
            @Param("desde") LocalDateTime desde,
            @Param("hasta") LocalDateTime hasta,
            Pageable pageable);
}
