package com.aquasense.backend.dto;

import com.aquasense.backend.model.RolProyecto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RolAssignmentDTO {
    private Long usuarioId;
    private String email;
    private String nombre;
    private RolProyecto rol;
}
