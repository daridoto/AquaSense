package com.aquasense.backend.repository;

import com.aquasense.backend.model.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjetoRepository extends JpaRepository<Projeto, Long> {
    List<Projeto> findByUsuarioId(Long usuarioId);
    Optional<Projeto> findByIdAndUsuarioId(Long id, Long usuarioId);
    List<Projeto> findBySimulacaoAtiva(Boolean simulacaoAtiva);
}
