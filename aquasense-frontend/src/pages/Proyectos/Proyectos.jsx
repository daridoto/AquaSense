import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import s from './Proyectos.module.css';

function fmtRelative(isoStr, noReadings) {
  if (!isoStr) return noReadings;
  const diffMs = Date.now() - new Date(isoStr).getTime();
  if (diffMs < 0) return '0s';
  const s = Math.floor(diffMs / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const EMPTY_FORM = { nombre: '', ubicacion: '', descripcion: '' };

export default function Proyectos() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [selectedId, setSelectedId] = useState(null);

  const { setCurrentProject } = useProject();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const loadProjects = useCallback(() => {
    setLoading(true);
    api.get('/api/proyectos').then(r => setProjects(r.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const handleCreate = async e => {
    e.preventDefault();
    setFormError('');
    setCreating(true);
    try {
      await api.post('/api/proyectos', formData);
      setShowForm(false);
      setFormData(EMPTY_FORM);
      loadProjects();
    } catch (err) {
      setFormError(err.response?.data?.message ?? t('error_create_project'));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async id => {
    setDeleting(id);
    try {
      await api.delete(`/api/proyectos/${id}`);
      setDeleteConfirm(null);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch {
      setDeleteConfirm(null);
    } finally {
      setDeleting(null);
    }
  };

  const handleEnter = p => {
    setSelectedId(p.id);
    setCurrentProject(p);
    setTimeout(() => navigate(`/proyectos/${p.id}`), 300);
  };

  return (
    <div className={s.root}>
      <header className={s.header}>
        <span className={s.logo}>AQUA<span>SENSE</span></span>
        <div className={s.headerActions}>
          <button className={s.newBtn} onClick={() => { setShowForm(v => !v); setFormError(''); }}>
            {t('new_project_btn')}
          </button>
          <button className={s.logout} onClick={() => navigate('/perfil')}
            style={{ background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '1px', padding: '5px 12px', borderRadius: '2px', cursor: 'pointer' }}>
            {t('my_account')}
          </button>
          <button className={s.logout} onClick={handleLogout}>{t('sign_out')}</button>
        </div>
      </header>

      {showForm && (
        <div className={s.createForm}>
          <form onSubmit={handleCreate} className={s.createInner}>
            <h3 className={s.formTitle}>{t('new_project_title')}</h3>
            <div className={s.formRow}>
              <div className={s.formField}>
                <label className={s.formLabel}>{t('project_name_label')}</label>
                <input className={s.formInput} value={formData.nombre}
                  onChange={e => setFormData(d => ({ ...d, nombre: e.target.value }))}
                  placeholder={t('project_name_placeholder')} required />
              </div>
              <div className={s.formField}>
                <label className={s.formLabel}>{t('location_label')}</label>
                <input className={s.formInput} value={formData.ubicacion}
                  onChange={e => setFormData(d => ({ ...d, ubicacion: e.target.value }))}
                  placeholder={t('location_placeholder')} required />
              </div>
            </div>
            <div className={s.formField}>
              <label className={s.formLabel}>{t('description_label')}</label>
              <input className={s.formInput} value={formData.descripcion}
                onChange={e => setFormData(d => ({ ...d, descripcion: e.target.value }))}
                placeholder={t('description_placeholder')} />
            </div>
            {formError && <p className={s.formError}>{formError}</p>}
            <div className={s.formActions}>
              <button className={s.confirmBtn} type="submit" disabled={creating}>
                {creating ? t('creating_project') : t('create_btn')}
              </button>
              <button className={s.cancelBtn} type="button"
                onClick={() => { setShowForm(false); setFormData(EMPTY_FORM); setFormError(''); }}>
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      <main className={s.main}>
        <h2 className={s.heading}>{t('projects_heading')}</h2>
        {loading ? (
          <p className={s.loading}>{t('loading')}</p>
        ) : (
          <div className={s.grid}>
            {projects.map(p => (
              <div
                key={p.id}
                className={`${s.card} ${s[p.estado?.toLowerCase()]} ${selectedId === p.id ? s.cardSelected : ''}`}
              >
                {deleteConfirm === p.id ? (
                  <div className={s.confirmBox}>
                    <span className={s.confirmText}>{t('delete_confirm_text')}</span>
                    <div className={s.confirmActions}>
                      <button className={s.confirmDanger}
                        onClick={() => handleDelete(p.id)} disabled={deleting === p.id}>
                        {deleting === p.id ? '...' : t('confirm')}
                      </button>
                      <button className={s.confirmCancel} onClick={() => setDeleteConfirm(null)}>
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className={s.deleteBtn} onClick={() => setDeleteConfirm(p.id)} title="Delete project">
                    ×
                  </button>
                )}

                <div className={s.cardTop}>
                  <div className={s.cardTopLeft}>
                    <span className={p.simulacaoAtiva ? s.simDotActive : s.simDotInactive} />
                    {p.alertasAtivas > 0 && (
                      <span className={s.alertBadge}>
                        {p.alertasAtivas} {p.alertasAtivas !== 1 ? t('alert_plural') : t('alert_singular')}
                      </span>
                    )}
                  </div>
                  <span className={s.lastReading}>
                    {fmtRelative(p.ultimaLeitura, t('no_readings'))}
                  </span>
                </div>

                <h3 className={s.name}>{p.nombre}</h3>
                {p.ubicacion && <p className={s.location}>{p.ubicacion}</p>}

                <button className={s.enter} onClick={() => handleEnter(p)}>{t('enter')}</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
