package com.aquasense.backend.repository;

import com.aquasense.backend.model.PreferenciasNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PreferenciasNotificacionRepository extends JpaRepository<PreferenciasNotificacion, Long> {

    Optional<PreferenciasNotificacion> findByUsuarioEmailAndProjetoId(String email, Long projetoId);

    List<PreferenciasNotificacion> findByProjetoId(Long projetoId);
}
