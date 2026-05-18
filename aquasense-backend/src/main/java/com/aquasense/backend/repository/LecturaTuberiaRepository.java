package com.aquasense.backend.repository;

import com.aquasense.backend.model.LecturaTuberia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LecturaTuberiaRepository extends JpaRepository<LecturaTuberia, Long> {

    // Ordered by timestamp DESC — matches the composite index (tuberia_id, timestamp DESC)
    List<LecturaTuberia> findByTuberiaIdOrderByTimestampDesc(Long tuberiaId);

    List<LecturaTuberia> findByTuberiaIdAndTimestampBetweenOrderByTimestampDesc(
            Long tuberiaId, LocalDateTime desde, LocalDateTime hasta);

    Optional<LecturaTuberia> findTopByTuberiaIdOrderByTimestampDesc(Long tuberiaId);

    void deleteByTuberiaId(Long tuberiaId);
}
