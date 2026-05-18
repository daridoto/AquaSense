import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import s from './Topbar.module.css';

export default function Topbar({ projectName, alertCount, simulacaoAtiva, simLoading, onToggleSimulacao }) {
  const { t } = useLanguage();
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = n => String(n).padStart(2, '0');
  const clock = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  return (
    <header className={s.bar}>
      <div className={s.left}>
        <button className={s.back} onClick={() => navigate('/proyectos')}>{t('back_to_projects')}</button>
        <div className={s.sep} />
        <span className={s.name}>{projectName ?? '—'}</span>
        <span className={`${s.dot} ${simulacaoAtiva ? s.dotOnline : s.dotOffline}`} />
        <span className={simulacaoAtiva ? s.online : s.offline}>
          {simulacaoAtiva ? t('online') : t('offline')}
        </span>
      </div>
      <div className={s.right}>
        {/* Botón de toggle de simulación */}
        <button
          className={simulacaoAtiva ? s.simBtnStop : s.simBtnStart}
          onClick={onToggleSimulacao}
          disabled={simLoading}
        >
          {simLoading
            ? '...'
            : simulacaoAtiva
              ? t('stop_simulation')
              : t('start_simulation')}
        </button>

        {alertCount > 0 && (
          <button className={s.alertBadge} onClick={() => navigate(`/proyectos/${id}/alertas`)}>
            ⚠ {alertCount} {t('alerts_nav')}
          </button>
        )}
        <button className={s.navBtn} onClick={() => navigate(`/proyectos/${id}/alertas`)}>{t('alerts_nav')}</button>
        <button className={s.navBtn} onClick={() => navigate(`/proyectos/${id}/historico`)}>{t('history_nav')}</button>
        <span className={s.clock}>{clock}</span>
      </div>
    </header>
  );
}
