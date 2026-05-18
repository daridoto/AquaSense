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
public class EventoAuditoriaDTO {
    private Long id;
    private String usuario;
    private String accion;
    private String entidade;
    private String valorAntes;
    private String valorDespues;
    private LocalDateTime timestamp;
    private String ip;
}
