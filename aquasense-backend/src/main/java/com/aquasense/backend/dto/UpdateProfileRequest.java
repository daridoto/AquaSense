package com.aquasense.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank
    @Size(min = 2, max = 100)
    private String nombre;

    @Size(min = 2, max = 5)
    private String language;
}
