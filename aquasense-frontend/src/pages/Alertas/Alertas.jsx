import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import AlertaModal from '../../components/AlertaModal/AlertaModal';
import s from './Alertas.module.css';

const NIVEL_COLOR = { CRITICA: 'critica', ADVERTENCIA: 'advertencia', INFO: 'info' };

function NivelBadge({ nivel, t }) {
  const label = nivel === 'CRITICA'
    ? t('critical_level')
    : nivel === 'ADVERTENCIA'
      ? t('warning_level')
      : nivel;
  return <span className={`${s.badge} ${s[NIVEL_COLOR[nivel] ?? 'info']}`}>{label}</span>;
}

function EstadoBadge({ alerta, t }) {
  if (!alerta.ativa) return <span className={`${s.badge} ${s.resolved}`}>{t('status_resolved')}</span>;
  if (alerta.silenciadaHasta && new Date(alerta.silenciadaHasta) > new Date())
    return <span className={`${s.badge} ${s.silenced}`}>{t('status_silenced')}</span>;
  if (alerta.reconocidaPor) return <span className={`${s.badge} ${s.acked}`}>{t('status_ack')}</span>;
  return <span className={`${s.badge} ${s.active}`}>{t('status_active')}</span>;
}

export default function Alertas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, localeCode } = useLanguage();

  const fmt = ts => ts
    ? new Date(ts).toLocaleString(localeCode, { dateStyle: 'short', timeStyle: 'short' })
    : '—';

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

  const nivelFilters = [
    { value: 'TODOS', label: t('filter_all') },
    { value: 'CRITICA', label: t('filter_critical') },
    { value: 'ADVERTENCIA', label: t('warning_level') },
    { value: 'INFO', label: 'INFO' },
  ];

  const estadoFilters = [
    { value: 'TODOS', label: t('filter_all') },
    { value: 'ACTIVA', label: t('status_active') },
    { value: 'RESUELTA', label: t('status_resolved') },
  ];

  return (
    <div className={s.root}>
      <header className={s.header}>
        <div className={s.headerLeft}>
          <button className={s.back} onClick={() => navigate(`/proyectos/${id}`)}>{t('back_to_dashboard')}</button>
          <div className={s.sep} />
          <span className={s.title}>{t('alerts_title')}</span>
          {activeCount > 0 && (
            <span className={s.countBadge}>{activeCount} {t('active_count_suffix')}</span>
          )}
        </div>
        <button className={s.refreshBtn} onClick={load}>{t('refresh_btn')}</button>
      </header>

      <div className={s.filters}>
        <div className={s.filterGroup}>
          <span className={s.filterLabel}>{t('filter_level')}</span>
          {nivelFilters.map(({ value, label }) => (
            <button key={value} className={`${s.filterBtn} ${filterNivel === value ? s.active : ''}`}
              onClick={() => setFilterNivel(value)}>{label}</button>
          ))}
        </div>
        <div className={s.filterGroup}>
          <span className={s.filterLabel}>{t('filter_status')}</span>
          {estadoFilters.map(({ value, label }) => (
            <button key={value} className={`${s.filterBtn} ${filterEstado === value ? s.active : ''}`}
              onClick={() => setFilterEstado(value)}>{label}</button>
          ))}
        </div>
        <div className={s.filterGroup}>
          <span className={s.filterLabel}>{t('filter_component_label')}</span>
          <select className={s.select} value={filterComp} onChange={e => setFilterComp(e.target.value)}>
            {componentes.map(c => (
              <option key={c} value={c}>
                {c === 'TODOS' ? t('filter_all') : c.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={s.tableWrap}>
        {loading ? (
          <p className={s.loading}>{t('loading')}</p>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>{t('col_level')}</th>
                <th>{t('col_component')}</th>
                <th>{t('col_message')}</th>
                <th>{t('col_created_at')}</th>
                <th>{t('filter_status')}</th>
                <th>{t('col_acknowledged')}</th>
                <th>{t('col_assigned_to')}</th>
                <th>{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr><td colSpan={8} className={s.empty}>{t('no_alerts_filtered')}</td></tr>
              ) : visible.map(a => (
                <>
                  <tr key={a.id} className={`${s.row} ${!a.ativa ? s.resolved : ''}`}
                    onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    style={{ cursor: 'pointer' }}>
                    <td><NivelBadge nivel={a.nivel} t={t} /></td>
                    <td className={s.comp}>{a.componente?.replace(/_/g, ' ')}</td>
                    <td className={s.msg}>{a.mensagem}</td>
                    <td className={s.ts}>{fmt(a.creadaEn)}</td>
                    <td><EstadoBadge alerta={a} t={t} /></td>
                    <td className={s.meta}>
                      {a.reconocidaPor ? `${a.reconocidaPor.split('@')[0]} ${fmt(a.reconocidaEn)}` : '—'}
                    </td>
                    <td className={s.meta}>{a.asignadaA ?? '—'}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className={s.actions}>
                        {!a.reconocidaPor && a.ativa && (
                          <button className={s.actionBtn} onClick={() => openModal('ack', a)}>
                            {t('status_ack')}
                          </button>
                        )}
                        {a.ativa && (
                          <button className={s.actionBtn} onClick={() => openModal('silence', a)}>
                            {t('silence_btn')}
                          </button>
                        )}
                        <button className={s.actionBtn} onClick={() => openModal('assign', a)}>
                          {t('assign_btn')}
                        </button>
                        {a.ativa && (
                          <button className={`${s.actionBtn} ${s.resolve}`} onClick={() => openModal('resolve', a)}>
                            {t('resolve_btn')}
                          </button>
                        )}
                        <button className={s.actionBtn} onClick={() => openModal('comment', a)}>
                          {t('note_btn')}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === a.id && (
                    <tr key={`${a.id}-exp`} className={s.expandedRow}>
                      <td colSpan={8}>
                        <div className={s.expandedInner}>
                          <span className={s.expandLabel}>{t('comments_header')}</span>
                          {(!a.comentarios || a.comentarios.length === 0) ? (
                            <span className={s.noComments}>{t('no_comments')}</span>
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
                              {t('resolved_by_prefix')} <strong>{a.resueltaPor}</strong>{' '}
                              {t('resolved_on_prefix')} {fmt(a.resueltaEn)}
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
        <AlertaModal title={t('modal_ack_title')} confirmLabel={t('status_ack')}
          fields={[{ key: 'comentario', label: t('field_comment_opt'), type: 'textarea', placeholder: t('field_action_taken') }]}
          onConfirm={vals => doAck(modal.alerta, vals)} onClose={closeModal} />
      )}
      {modal?.type === 'silence' && (
        <AlertaModal title={t('modal_silence_title')} confirmLabel={t('btn_silence')}
          fields={[{ key: 'hasta', label: t('field_silence_until'), type: 'datetime-local',
            defaultValue: new Date(Date.now() + 3600000).toISOString().slice(0, 16) }]}
          onConfirm={vals => doSilence(modal.alerta, vals)} onClose={closeModal} />
      )}
      {modal?.type === 'assign' && (
        <AlertaModal title={t('modal_assign_title')} confirmLabel={t('btn_assign')}
          fields={[{ key: 'email', label: t('field_technician_email'), type: 'email', placeholder: 'tecnico@empresa.com' }]}
          onConfirm={vals => doAssign(modal.alerta, vals)} onClose={closeModal} />
      )}
      {modal?.type === 'resolve' && (
        <AlertaModal title={t('modal_resolve_title')} confirmLabel={t('btn_resolve')}
          fields={[{ key: 'comentario', label: t('field_comment_opt'), type: 'textarea', placeholder: t('field_how_resolved') }]}
          onConfirm={vals => doResolve(modal.alerta, vals)} onClose={closeModal} />
      )}
      {modal?.type === 'comment' && (
        <AlertaModal title={t('modal_comment_title')} confirmLabel={t('btn_save')}
          fields={[{ key: 'texto', label: t('field_note'), type: 'textarea', placeholder: t('field_observation') }]}
          onConfirm={vals => doComment(modal.alerta, vals)} onClose={closeModal} />
      )}
    </div>
  );
}
