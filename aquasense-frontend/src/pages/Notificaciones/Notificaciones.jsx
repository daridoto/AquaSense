import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import s from './Notificaciones.module.css';

export default function Notificaciones() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [prefs, setPrefs] = useState({ notificarCritica: true, notificarAdvertencia: false, emailDestino: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api.get(`/api/proyectos/${id}/notificaciones`)
      .then(r => setPrefs(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true); setMsg(null);
    try {
      await api.put(`/api/proyectos/${id}/notificaciones`, prefs);
      setMsg({ type: 'success', text: t('notif_saved_ok') });
    } catch {
      setMsg({ type: 'error', text: t('notif_save_error') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className={s.root}>
      <header className={s.header}>
        <button className={s.back} onClick={() => navigate(`/proyectos/${id}`)}>{t('back_to_dashboard')}</button>
        <div className={s.sep} />
        <span className={s.title}>{t('notificaciones_title')}</span>
      </header>
      <div className={s.body}>
        <div className={s.card}>
          <span className={s.cardTitle}>{t('notif_prefs_heading')}</span>

          <div className={s.toggle}>
            <div className={s.toggleInfo}>
              <span className={s.toggleLabel}>{t('notif_critical_label')}</span>
              <span className={s.toggleDesc}>{t('notif_critical_desc')}</span>
            </div>
            <label className={s.switch}>
              <input type="checkbox" checked={prefs.notificarCritica}
                onChange={e => setPrefs(p => ({ ...p, notificarCritica: e.target.checked }))} />
              <span className={s.slider} />
            </label>
          </div>

          <div className={s.toggle}>
            <div className={s.toggleInfo}>
              <span className={s.toggleLabel}>{t('notif_warning_label')}</span>
              <span className={s.toggleDesc}>{t('notif_warning_desc')}</span>
            </div>
            <label className={s.switch}>
              <input type="checkbox" checked={prefs.notificarAdvertencia}
                onChange={e => setPrefs(p => ({ ...p, notificarAdvertencia: e.target.checked }))} />
              <span className={s.slider} />
            </label>
          </div>

          <div className={s.field}>
            <label className={s.label}>{t('email_dest_label')}</label>
            <input className={s.input} type="email" placeholder={t('email_dest_placeholder')}
              value={prefs.emailDestino ?? ''}
              onChange={e => setPrefs(p => ({ ...p, emailDestino: e.target.value }))} />
          </div>

          {msg && <p className={msg.type === 'success' ? s.success : s.error}>{msg.text}</p>}

          <button className={s.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? t('saving_prefs') : t('save_prefs_btn')}
          </button>
        </div>
      </div>
    </div>
  );
}
