package com.aquasense.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lecturas_sensor",
        indexes = {
            @Index(name = "idx_lectura_proyecto_componente", columnList = "proyecto_id, componente"),
            @Index(name = "idx_lectura_timestamp", columnList = "timestamp")
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeituraSensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Projeto projeto;

    @Column(nullable = false)
    private String componente;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String valores;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    /** Origem da leitura: "AUTO" (simulador Python) ou "MANUAL" (operador via UI) */
    @Column(nullable = false)
    @Builder.Default
    private String origen = "AUTO";

    @PrePersist
    public void prePersist() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
        if (origen == null) {
            origen = "AUTO";
        }
    }
}
