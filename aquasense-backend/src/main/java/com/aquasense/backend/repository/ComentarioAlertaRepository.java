package com.aquasense.backend.repository;

import com.aquasense.backend.model.ComentarioAlerta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioAlertaRepository extends JpaRepository<ComentarioAlerta, Long> {

    List<ComentarioAlerta> findByAlertaIdOrderByCreadoEnAsc(Long alertaId);
}
