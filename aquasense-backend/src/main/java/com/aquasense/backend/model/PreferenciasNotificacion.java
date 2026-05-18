package com.aquasense.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "preferencias_notificacion",
        uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "proyecto_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreferenciasNotificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Projeto projeto;

    @Builder.Default
    private boolean notificarCritica = true;

    @Builder.Default
    private boolean notificarAdvertencia = false;

    /** Se null, usa o email do utilizador */
    private String emailDestino;
}
