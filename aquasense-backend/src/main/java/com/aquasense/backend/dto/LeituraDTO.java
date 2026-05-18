package com.aquasense.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeituraDTO {

    @NotBlank
    private String componente;

    @NotNull
    private Map<String, Double> valores;

    private LocalDateTime timestamp;

    /** Origem da leitura: "AUTO" (simulador) ou "MANUAL" (operador). Default: "AUTO" */
    private String origen;
}
