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
      setMsg({ type: 'success', text: 'Preferências guardadas.' });
    } catch {
      setMsg({ type: 'error', text: 'Erro ao guardar. Tenta novamente.' });
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
        <span className={s.title}>NOTIFICAÇÕES</span>
      </header>
      <div className={s.body}>
        <div className={s.card}>
          <span className={s.cardTitle}>Preferências de alertas por email</span>

          <div className={s.toggle}>
            <div className={s.toggleInfo}>
              <span className={s.toggleLabel}>Alertas CRÍTICAS</span>
              <span className={s.toggleDesc}>Receber email imediato quando uma alerta crítica for criada</span>
            </div>
            <label className={s.switch}>
              <input type="checkbox" checked={prefs.notificarCritica}
                onChange={e => setPrefs(p => ({ ...p, notificarCritica: e.target.checked }))} />
              <span className={s.slider} />
            </label>
          </div>

          <div className={s.toggle}>
            <div className={s.toggleInfo}>
              <span className={s.toggleLabel}>Alertas de ADVERTÊNCIA</span>
              <span className={s.toggleDesc}>Receber email para alertas de advertência</span>
            </div>
            <label className={s.switch}>
              <input type="checkbox" checked={prefs.notificarAdvertencia}
                onChange={e => setPrefs(p => ({ ...p, notificarAdvertencia: e.target.checked }))} />
              <span className={s.slider} />
            </label>
          </div>

          <div className={s.field}>
            <label className={s.label}>Email de destino (opcional)</label>
            <input className={s.input} type="email" placeholder="Deixa vazio para usar o email da conta"
              value={prefs.emailDestino ?? ''}
              onChange={e => setPrefs(p => ({ ...p, emailDestino: e.target.value }))} />
          </div>

          {msg && <p className={msg.type === 'success' ? s.success : s.error}>{msg.text}</p>}

          <button className={s.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'A guardar...' : 'Guardar preferências'}
          </button>
        </div>
      </div>
    </div>
  );
}
