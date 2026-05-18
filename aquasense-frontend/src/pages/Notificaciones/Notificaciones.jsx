import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import s from './Notificaciones.module.css';

export default function Notificaciones() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      setMsg({ type: 'success', text: 'Preferencias guardadas.' });
    } catch {
      setMsg({ type: 'error', text: 'Error al guardar. Inténtalo de nuevo.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className={s.root}>
      <header className={s.header}>
        <button className={s.back} onClick={() => navigate(`/proyectos/${id}`)}>← Dashboard</button>
        <div className={s.sep} />
        <span className={s.title}>NOTIFICACIONES</span>
      </header>
      <div className={s.body}>
        <div className={s.card}>
          <span className={s.cardTitle}>Preferencias de alertas por email</span>

          <div className={s.toggle}>
            <div className={s.toggleInfo}>
              <span className={s.toggleLabel}>Alertas CRÍTICAS</span>
              <span className={s.toggleDesc}>Recibir email inmediato cuando se cree una alerta crítica</span>
            </div>
            <label className={s.switch}>
              <input type="checkbox" checked={prefs.notificarCritica}
                onChange={e => setPrefs(p => ({ ...p, notificarCritica: e.target.checked }))} />
              <span className={s.slider} />
            </label>
          </div>

          <div className={s.toggle}>
            <div className={s.toggleInfo}>
              <span className={s.toggleLabel}>Alertas de ADVERTENCIA</span>
              <span className={s.toggleDesc}>Recibir email para alertas de advertencia</span>
            </div>
            <label className={s.switch}>
              <input type="checkbox" checked={prefs.notificarAdvertencia}
                onChange={e => setPrefs(p => ({ ...p, notificarAdvertencia: e.target.checked }))} />
              <span className={s.slider} />
            </label>
          </div>

          <div className={s.field}>
            <label className={s.label}>Email de destino (opcional)</label>
            <input className={s.input} type="email" placeholder="Deja vacío para usar el email de la cuenta"
              value={prefs.emailDestino ?? ''}
              onChange={e => setPrefs(p => ({ ...p, emailDestino: e.target.value }))} />
          </div>

          {msg && <p className={msg.type === 'success' ? s.success : s.error}>{msg.text}</p>}

          <button className={s.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar preferencias'}
          </button>
        </div>
      </div>
    </div>
  );
}
