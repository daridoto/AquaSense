package com.aquasense.backend.service;

import com.aquasense.backend.dto.EventoAuditoriaDTO;
import com.aquasense.backend.model.EventoAuditoria;
import com.aquasense.backend.model.Projeto;
import com.aquasense.backend.repository.EventoAuditoriaRepository;
import com.aquasense.backend.repository.ProjetoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditoriaService {

    private final EventoAuditoriaRepository eventoAuditoriaRepository;
    private final ProjetoRepository projetoRepository;

    /**
     * Registra un evento de auditoría de forma asíncrona para no bloquear el flujo principal.
     * Usa REQUIRES_NEW para garantizar que persiste aunque falle la transacción llamadora.
     */
    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void registrar(Long projetoId, String usuario, String accion,
                          String entidade, String valorAntes, String valorDespues, String ip) {
        try {
            Projeto projeto = projetoId != null
                    ? projetoRepository.findById(projetoId).orElse(null)
                    : null;

            EventoAuditoria evento = EventoAuditoria.builder()
                    .usuario(usuario)
                    .accion(accion)
                    .entidade(entidade)
                    .valorAntes(valorAntes)
                    .valorDespues(valorDespues)
                    .ip(ip)
                    .projeto(projeto)
                    .build();

            eventoAuditoriaRepository.save(evento);
        } catch (Exception e) {
            log.warn("[AUDITORIA] Falha ao registar evento: accion={}, entidade={}", accion, entidade, e);
        }
    }

    public Page<EventoAuditoriaDTO> getAuditoria(Long projetoId, String usuario, String accion,
                                                  LocalDateTime desde, LocalDateTime hasta,
                                                  int page, int size) {
        var pageable = PageRequest.of(page, size);
        return eventoAuditoriaRepository
                .findByProjetoIdWithFilters(projetoId, usuario, accion, desde, hasta, pageable)
                .map(this::toDTO);
    }

    private EventoAuditoriaDTO toDTO(EventoAuditoria e) {
        return EventoAuditoriaDTO.builder()
                .id(e.getId())
                .usuario(e.getUsuario())
                .accion(e.getAccion())
                .entidade(e.getEntidade())
                .valorAntes(e.getValorAntes())
                .valorDespues(e.getValorDespues())
                .timestamp(e.getTimestamp())
                .ip(e.getIp())
                .build();
    }
}
