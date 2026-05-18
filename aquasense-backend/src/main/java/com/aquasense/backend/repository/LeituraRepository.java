package com.aquasense.backend.repository;

import com.aquasense.backend.model.LeituraSensor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LeituraRepository extends JpaRepository<LeituraSensor, Long> {

    Optional<LeituraSensor> findTopByProjetoIdAndComponenteOrderByTimestampDesc(
            Long projetoId, String componente);

    Optional<LeituraSensor> findTopByProjetoIdOrderByTimestampDesc(Long projetoId);

    void deleteByProjetoId(Long projetoId);

    // Versões paginadas para /historico (evita retornar 100k+ rows)
    List<LeituraSensor> findByProjetoIdAndComponenteAndTimestampBetweenOrderByTimestampAsc(
            Long projetoId, String componente, LocalDateTime desde, LocalDateTime hasta, Pageable pageable);

    List<LeituraSensor> findByProjetoIdAndTimestampBetweenOrderByTimestampAsc(
            Long projetoId, LocalDateTime desde, LocalDateTime hasta, Pageable pageable);

    // DESC variants — returns the N most recent rows (used by getHistorico)
    @Query("SELECT l FROM LeituraSensor l WHERE l.projeto.id = :projetoId AND l.componente = :componente AND l.timestamp BETWEEN :desde AND :hasta ORDER BY l.timestamp DESC")
    List<LeituraSensor> findRecentByProjetoIdAndComponenteAndTimestampBetween(
            @Param("projetoId") Long projetoId, @Param("componente") String componente,
            @Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta, Pageable pageable);

    @Query("SELECT l FROM LeituraSensor l WHERE l.projeto.id = :projetoId AND l.timestamp BETWEEN :desde AND :hasta ORDER BY l.timestamp DESC")
    List<LeituraSensor> findRecentByProjetoIdAndTimestampBetween(
            @Param("projetoId") Long projetoId,
            @Param("desde") LocalDateTime desde, @Param("hasta") LocalDateTime hasta, Pageable pageable);

    @Query("SELECT DISTINCT l.componente FROM LeituraSensor l WHERE l.projeto.id = :projetoId")
    List<String> findDistinctComponentesByProjetoId(@Param("projetoId") Long projetoId);

    // 1 query para /estado em vez de 8 (fix N+1)
    @Query("""
        SELECT l FROM LeituraSensor l
        WHERE l.projeto.id = :projetoId
        AND l.timestamp = (
            SELECT MAX(l2.timestamp) FROM LeituraSensor l2
            WHERE l2.projeto.id = :projetoId AND l2.componente = l.componente
        )
        """)
    List<LeituraSensor> findLatestPerComponente(@Param("projetoId") Long projetoId);
}
