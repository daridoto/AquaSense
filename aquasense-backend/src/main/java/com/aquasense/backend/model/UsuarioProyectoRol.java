package com.aquasense.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuario_proyecto_rol",
        uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "proyecto_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioProyectoRol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Projeto projeto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolProyecto rol;
}
