package com.aquasense.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LecturaTuberiaDTO {

    private Long tuberiaId;

    private LocalDateTime timestamp;

    private Double caudalM3h;

    private Double presionBarEntrada;

    private Double presionBarSaida;

    private Double velocidadMs;
}
