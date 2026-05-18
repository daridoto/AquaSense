package com.aquasense.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "evento_auditoria",
        indexes = {
            @Index(name = "idx_auditoria_proyecto_ts", columnList = "proyecto_id, timestamp DESC")
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventoAuditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String usuario;

    @Column(nullable = false)
    private String accion;

    @Column(nullable = false)
    private String entidade;

    @Column(columnDefinition = "TEXT")
    private String valorAntes;

    @Column(columnDefinition = "TEXT")
    private String valorDespues;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String ip;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "proyecto_id", nullable = true)
    private Projeto projeto;

    @PrePersist
    public void prePersist() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
