package com.aquasense.backend.repository;

import com.aquasense.backend.model.Tuberia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TuberiaRepository extends JpaRepository<Tuberia, Long> {

    List<Tuberia> findByProjetoId(Long projetoId);

    Optional<Tuberia> findByIdAndProjetoId(Long id, Long projetoId);

    void deleteByProjetoId(Long projetoId);
}
