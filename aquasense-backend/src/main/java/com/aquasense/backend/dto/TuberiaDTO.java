package com.aquasense.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TuberiaDTO {

    private Long id;

    private Long proyectoId;

    @NotBlank
    private String fromComponenteId;

    @NotBlank
    private String toComponenteId;

    @NotNull
    @Positive
    private Double diametroMm;

    @NotBlank
    private String materialTuberia;

    @NotNull
    @Positive
    private Double longitudM;

    private LocalDateTime createdAt;
}
