package com.aquasense.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjetoDTO {

    private Long id;

    @NotBlank
    private String nombre;

    private String ubicacion;

    private String descripcion;

    private LocalDateTime creadoEn;

    // Campos computados — preenchidos pelo backend, ignorados no request body
    private String estado;
    private Long alertasAtivas;
    private LocalDateTime ultimaLeitura;
    private ResumenSensores resumenSensores;
    private Boolean simulacaoAtiva;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResumenSensores {
        private Double pH;
        private Double cloroResidual;
        private Double nivelReservorio;
    }
}
