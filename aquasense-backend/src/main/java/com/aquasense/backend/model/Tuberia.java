package com.aquasense.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tuberias",
        indexes = {
            @Index(name = "idx_tuberia_proyecto", columnList = "proyecto_id")
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tuberia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Projeto projeto;

    @Column(nullable = false)
    private String fromComponenteId;

    @Column(nullable = false)
    private String toComponenteId;

    @Column(nullable = false)
    private Double diametroMm;

    @Column(nullable = false)
    private String materialTuberia;

    @Column(nullable = false)
    private Double longitudM;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
