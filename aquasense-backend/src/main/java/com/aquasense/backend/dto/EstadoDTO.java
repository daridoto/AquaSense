package com.aquasense.backend.dto;

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
public class EstadoDTO {

    private Map<String, ComponenteEstado> componentes;
    private LocalDateTime ultimaActualizacion;

    /** Modo de cada componente: "AUTO" ou "MANUAL". Ex: {"bomba_captacao":"AUTO",...} */
    private Map<String, String> modoComponentes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComponenteEstado {
        private Map<String, Double> valores;
        private LocalDateTime timestamp;
        /** Origem da última leitura deste componente: "AUTO" ou "MANUAL" */
        private String origen;
        /** Modo atual do componente: "AUTO" ou "MANUAL" */
        private String modo;
    }
}
