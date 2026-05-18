package com.aquasense.backend.repository;

import com.aquasense.backend.model.UsuarioProyectoRol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioProyectoRolRepository extends JpaRepository<UsuarioProyectoRol, Long> {

    Optional<UsuarioProyectoRol> findByUsuarioEmailAndProjetoId(String email, Long projetoId);

    List<UsuarioProyectoRol> findByProjetoId(Long projetoId);

    List<UsuarioProyectoRol> findByUsuarioId(Long usuarioId);

    void deleteByProjetoIdAndUsuarioId(Long projetoId, Long usuarioId);
}
