package com.aquasense.backend.dto;

import com.aquasense.backend.model.NivelAlerta;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertaDTO {

    private Long id;
    private String componente;
    private String tipo;
    private NivelAlerta nivel;
    private String mensagem;
    private boolean ativa;
    private String accionAutomatica;
    private LocalDateTime creadaEn;

    // Lifecycle fields
    private String reconocidaPor;
    private LocalDateTime reconocidaEn;
    private LocalDateTime silenciadaHasta;
    private String asignadaA;
    private String resueltaPor;
    private LocalDateTime resueltaEn;

    private List<ComentarioDTO> comentarios;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComentarioDTO {
        private Long id;
        private String texto;
        private String autorEmail;
        private LocalDateTime creadoEn;
    }
}
