package com.aquasense.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "alertas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Projeto projeto;

    @Column(nullable = false)
    private String componente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NivelAlerta nivel;

    @Column(nullable = false)
    private String mensagem;

    // Short condition identifier used for deduplication (e.g. "cloro_bajo").
    // Deduplication is checked on (projetoId, componente, tipo) so that alerts
    // are not duplicated across readings even when the live sensor value in
    // mensagem changes every cycle.
    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private boolean ativa;

    private String accionAutomatica;

    @Column(nullable = false)
    private LocalDateTime creadaEn;

    // Lifecycle fields — all nullable to avoid breaking existing data
    private String reconocidaPor;
    private LocalDateTime reconocidaEn;
    private LocalDateTime silenciadaHasta;
    private String asignadaA;
    private String resueltaPor;
    private LocalDateTime resueltaEn;

    @PrePersist
    public void prePersist() {
        if (creadaEn == null) {
            creadaEn = LocalDateTime.now();
        }
    }
}
