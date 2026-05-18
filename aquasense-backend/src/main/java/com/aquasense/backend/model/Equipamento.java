package com.aquasense.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "equipamentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Projeto projeto;

    @Column(nullable = false)
    private String componenteId;

    @Column(nullable = false)
    private String estado;

    @Column(columnDefinition = "TEXT")
    private String configuracion;

    private LocalDateTime ultimaActualizacion;

    @PrePersist
    @PreUpdate
    public void preUpdate() {
        ultimaActualizacion = LocalDateTime.now();
    }
}
