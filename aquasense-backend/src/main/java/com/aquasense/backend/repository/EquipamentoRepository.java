package com.aquasense.backend.repository;

import com.aquasense.backend.model.Equipamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EquipamentoRepository extends JpaRepository<Equipamento, Long> {
    List<Equipamento> findByProjetoId(Long projetoId);
    Optional<Equipamento> findByProjetoIdAndComponenteId(Long projetoId, String componenteId);
    void deleteByProjetoId(Long projetoId);
}
