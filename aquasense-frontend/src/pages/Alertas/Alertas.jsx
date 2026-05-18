import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AlertaModal from '../../components/AlertaModal/AlertaModal';
import s from './Alertas.module.css';

const NIVEL_COLOR = { CRITICA: 'critica', ADVERTENCIA: 'advertencia', INFO: 'info' };

const fmt = ts => ts ? new Date(ts).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' }) : '—';

function NivelBadge({ nivel }) {
  return <span className={`${s.badge} ${s[NIVEL_COLOR[nivel] ?? 'info']}`}>{nivel}</span>;
}

function EstadoBadge({ alerta }) {
  if (!alerta.ativa) return <span className={`${s.badge} ${s.resolved}`}>RESOLVIDA</span>;
  if (alerta.silenciadaHasta && new Date(alerta.silenciadaHasta) > new Date())
    return <span className={`${s.badge} ${s.silenced}`}>SILENCIADA</span>;
  if (alerta.reconocidaPor) return <span className={`${s.badge} ${s.acked}`}>ACK</span>;
  return <span className={`${s.badge} ${s.active}`}>ACTIVA</span>;
}

export default function Alertas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterNivel, setFilterNivel] = useState('TODOS');
  const [filterEstado, setFilterEstado] = useState('TODOS');
  const [filterComp, setFilterComp] = useState('TODOS');
  const [expanded, setExpanded] = useState(null);
  const [modal, setModal] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.get(`/api/proyectos/${id}/alertas`)
      .then(r => setAlertas(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const componentes = ['TODOS', ...new Set(alertas.map(a => a.componente))];

  const visible = alertas.filter(a => {
    if (filterNivel !== 'TODOS' && a.nivel !== filterNivel) return false;
    if (filterComp !== 'TODOS' && a.componente !== filterComp) return false;
    if (filterEstado === 'ACTIVA' && !a.ativa) return false;
    if (filterEstado === 'RESUELTA' && a.ativa) return false;
    return true;
  });

  const activeCount = alertas.filter(a => a.ativa).length;

  const openModal = (type, alerta) => setModal({ type, alerta });
  const closeModal = () => { setModal(null); load(); };

  const doAck = async (alerta, vals) => {
    await api.post(`/api/proyectos/${id}/alertas/${alerta.id}/ack`,
      vals.comentario ? { comentario: vals.comentario } : {});
  };
  const doSilence = async (alerta, vals) => {
    await api.post(`/api/proyectos/${id}/alertas/${alerta.id}/silence`, { hasta: vals.hasta });
  };
  const doAssign = async (alerta, vals) => {
    await api.post(`/api/proyectos/${id}/alertas/${alerta.id}/assign`, { email: vals.email });
  };
  const doResolve = async (alerta, vals) => {
    await api.post(`/api/proyectos/${id}/alertas/${alerta.id}/resolve`,
      vals.comentario ? { comentario: vals.comentario } : {});
  };
  const doComment = async (alerta, vals) => {
    await api.post(`/api/proyectos/${id}/alertas/${alerta.id}/comentarios`, { texto: vals.texto });
  };

  return (
    <div className={s.root}>
      <header className={s.header}>
        <div className={s.headerLeft}>
          <button className={s.back} onClick={() => navigate(`/proyectos/${id}`)}>← Dashboard</button>
          <div className={s.sep} />
          <span className={s.title}>ALERTAS</span>
          {activeCount > 0 && <span className={s.countBadge}>{activeCount} activas</span>}
        </div>
        <button className={s.refreshBtn} onClick={load}>↻ Actualizar</button>
      </header>

      <div className={s.filters}>
        <div className={s.filterGroup}>
          <span className={s.filterLabel}>NÍVEL</span>
          {['TODOS', 'CRITICA', 'ADVERTENCIA', 'INFO'].map(v => (
            <button key={v} className={`${s.filterBtn} ${filterNivel === v ? s.active : ''}`}
              onClick={() => setFilterNivel(v)}>{v}</button>
          ))}
        </div>
        <div className={s.filterGroup}>
          <span className={s.filterLabel}>ESTADO</span>
          {['TODOS', 'ACTIVA', 'RESUELTA'].map(v => (
            <button key={v} className={`${s.filterBtn} ${filterEstado === v ? s.active : ''}`}
              onClick={() => setFilterEstado(v)}>{v}</button>
          ))}
        </div>
        <div className={s.filterGroup}>
          <span className={s.filterLabel}>COMPONENTE</span>
          <select className={s.select} value={filterComp} onChange={e => setFilterComp(e.target.value)}>
            {componentes.map(c => <option key={c} value={c}>{c === 'TODOS' ? 'Todos' : c.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
      </div>

      <div className={s.tableWrap}>
        {loading ? (
          <p className={s.loading}>A carregar...</p>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Nível</th>
                <th>Componente</th>
                <th>Mensagem</th>
                <th>Criada em</th>
                <th>Estado</th>
                <th>Reconhecida</th>
                <th>Atribuída</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr><td colSpan={8} className={s.empty}>Sem alertas para os filtros seleccionados.</td></tr>
              ) : visible.map(a => (
                <>
                  <tr key={a.id} className={`${s.row} ${!a.ativa ? s.resolved : ''}`}
                    onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    style={{ cursor: 'pointer' }}>
                    <td><NivelBadge nivel={a.nivel} /></td>
                    <td className={s.comp}>{a.componente?.replace(/_/g, ' ')}</td>
                    <td className={s.msg}>{a.mensagem}</td>
                    <td className={s.ts}>{fmt(a.creadaEn)}</td>
                    <td><EstadoBadge alerta={a} /></td>
                    <td className={s.meta}>{a.reconocidaPor ? `${a.reconocidaPor.split('@')[0]} ${fmt(a.reconocidaEn)}` : '—'}</td>
                    <td className={s.meta}>{a.asignadaA ?? '—'}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className={s.actions}>
                        {!a.reconocidaPor && a.ativa && (
                          <button className={s.actionBtn} onClick={() => openModal('ack', a)}>ACK</button>
                        )}
                        {a.ativa && (
                          <button className={s.actionBtn} onClick={() => openModal('silence', a)}>✕ Silenciar</button>
                        )}
                        <button className={s.actionBtn} onClick={() => openModal('assign', a)}>→ Atribuir</button>
                        {a.ativa && (
                          <button className={`${s.actionBtn} ${s.resolve}`} onClick={() => openModal('resolve', a)}>✓ Resolver</button>
                        )}
                        <button className={s.actionBtn} onClick={() => openModal('comment', a)}>+ Nota</button>
                      </div>
                    </td>
                  </tr>
                  {expanded === a.id && (
                    <tr key={`${a.id}-exp`} className={s.expandedRow}>
                      <td colSpan={8}>
                        <div className={s.expandedInner}>
                          <span className={s.expandLabel}>COMENTÁRIOS</span>
                          {(!a.comentarios || a.comentarios.length === 0) ? (
                            <span className={s.noComments}>Sem comentários</span>
                          ) : (
                            <div className={s.comments}>
                              {a.comentarios.map(c => (
                                <div key={c.id} className={s.comment}>
                                  <span className={s.commentAuthor}>{c.autorEmail}</span>
                                  <span className={s.commentTs}>{fmt(c.creadoEn)}</span>
                                  <span className={s.commentText}>{c.texto}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {a.resueltaPor && (
                            <div className={s.resolvedBy}>
                              Resolvida por <strong>{a.resueltaPor}</strong> em {fmt(a.resueltaEn)}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal?.type === 'ack' && (
        <AlertaModal title="RECONHECER ALERTA" confirmLabel="ACK"
          fields={[{ key: 'comentario', label: 'Comentário (opcional)', type: 'textarea', placeholder: 'Acção tomada...' }]}
          onConfirm={vals => doAck(modal.alerta, vals)} onClose={closeModal} />
      )}
      {modal?.type === 'silence' && (
        <AlertaModal title="SILENCIAR ATÉ" confirmLabel="SILENCIAR"
          fields={[{ key: 'hasta', label: 'Silenciar até', type: 'datetime-local',
            defaultValue: new Date(Date.now() + 3600000).toISOString().slice(0,16) }]}
          onConfirm={vals => doSilence(modal.alerta, vals)} onClose={closeModal} />
      )}
      {modal?.type === 'assign' && (
        <AlertaModal title="ATRIBUIR A TÉCNICO" confirmLabel="ATRIBUIR"
          fields={[{ key: 'email', label: 'Email do técnico', type: 'email', placeholder: 'tecnico@empresa.com' }]}
          onConfirm={vals => doAssign(modal.alerta, vals)} onClose={closeModal} />
      )}
      {modal?.type === 'resolve' && (
        <AlertaModal title="RESOLVER ALERTA" confirmLabel="RESOLVER"
          fields={[{ key: 'comentario', label: 'Comentário (opcional)', type: 'textarea', placeholder: 'Como foi resolvida...' }]}
          onConfirm={vals => doResolve(modal.alerta, vals)} onClose={closeModal} />
      )}
      {modal?.type === 'comment' && (
        <AlertaModal title="ADICIONAR NOTA" confirmLabel="GUARDAR"
          fields={[{ key: 'texto', label: 'Nota', type: 'textarea', placeholder: 'Observação...' }]}
          onConfirm={vals => doComment(modal.alerta, vals)} onClose={closeModal} />
      )}
    </div>
  );
}
