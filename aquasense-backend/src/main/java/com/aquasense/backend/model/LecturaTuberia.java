package com.aquasense.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lecturas_tuberia",
        indexes = {
            @Index(name = "idx_lectura_tuberia_timestamp", columnList = "tuberia_id, timestamp DESC")
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LecturaTuberia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tuberia_id", nullable = false)
    private Tuberia tuberia;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private Double caudalM3h;

    private Double presionBarEntrada;

    private Double presionBarSaida;

    private Double velocidadMs;

    @PrePersist
    public void prePersist() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
