package com.aquasense.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreferenciasNotificacionDTO {
    private boolean notificarCritica;
    private boolean notificarAdvertencia;
    private String emailDestino;
}
