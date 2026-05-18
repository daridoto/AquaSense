import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePolling } from '../../hooks/usePolling';
import { useProject } from '../../context/ProjectContext';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../hooks/useRole';
import api from '../../services/api';
import Topbar from '../../components/Topbar/Topbar';
import Sinoptico from '../../components/Sinoptico/Sinoptico';
import AlertasList from '../../components/AlertasList/AlertasList';
import ReadingsBar from '../../components/ReadingsBar/ReadingsBar';
import s from './Dashboard.module.css';

export default function Dashboard() {
  const { id } = useParams();
  const { currentProject } = useProject();
  const { t } = useLanguage();

  const [simulacaoAtiva, setSimulacaoAtiva] = useState(false);
  const [simLoading, setSimLoading] = useState(false);

  const { isAdmin, canEdit } = useRole(id);
  const { data: estado, error: estadoErr } = usePolling(`/api/proyectos/${id}/estado`, 5000);
  const { data: alertasRaw, error: alertasErr } = usePolling(`/api/proyectos/${id}/alertas?activas=true`, 5000);

  const alertas = alertasRaw ?? [];
  const alertCount = alertas.filter(a => a.ativa).length;
  const hasError = estadoErr || alertasErr;

  // Carga el estado de simulación al montar
  useEffect(() => {
    api.get(`/api/proyectos/${id}/simulacao/status`)
      .then(r => setSimulacaoAtiva(r.data.status === 'RUNNING'))
      .catch(() => {});
  }, [id]);

  const handleToggleSimulacao = useCallback(async () => {
    setSimLoading(true);
    try {
      if (simulacaoAtiva) {
        await api.post(`/api/proyectos/${id}/simulacao/stop`);
        setSimulacaoAtiva(false);
      } else {
        await api.post(`/api/proyectos/${id}/simulacao/start`);
        setSimulacaoAtiva(true);
      }
    } catch {
      // ignorar silenciosamente — el estado no cambia
    } finally {
      setSimLoading(false);
    }
  }, [id, simulacaoAtiva]);

  return (
    <div className={s.root}>
      <Topbar
        projectName={currentProject?.nombre ?? `Project ${id}`}
        alertCount={alertCount}
        simulacaoAtiva={simulacaoAtiva}
        simLoading={simLoading}
        onToggleSimulacao={handleToggleSimulacao}
      />
      {hasError && (
        <div className={s.errorBanner}>{t('backend_error')}</div>
      )}
      {isAdmin && (
        <div style={{ display: 'flex', gap: '8px', padding: '6px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', flexShrink: 0 }}>
          <Link to={`/proyectos/${id}/equipa`} style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '1px', color: 'var(--text3)', textDecoration: 'none', padding: '3px 8px', border: '1px solid var(--border2)', borderRadius: '2px' }}>
            Equipa
          </Link>
          <Link to={`/proyectos/${id}/auditoria`} style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '1px', color: 'var(--text3)', textDecoration: 'none', padding: '3px 8px', border: '1px solid var(--border2)', borderRadius: '2px' }}>
            Auditoria
          </Link>
          <Link to={`/proyectos/${id}/notificaciones`} style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '1px', color: 'var(--text3)', textDecoration: 'none', padding: '3px 8px', border: '1px solid var(--border2)', borderRadius: '2px' }}>
            Notificações
          </Link>
        </div>
      )}
      <div className={s.body}>
        <main className={s.main}>
          <Sinoptico
            projectId={id}
            estado={estado}
            alertas={alertas}
            simulacaoAtiva={simulacaoAtiva}
            canEdit={canEdit}
          />
        </main>
        <AlertasList alertas={alertas} />
      </div>
      <ReadingsBar estado={estado} alertas={alertas} />
    </div>
  );
}
