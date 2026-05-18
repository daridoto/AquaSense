import { useLanguage } from '../../context/LanguageContext';
import s from './AlertasList.module.css';

export default function AlertasList({ alertas = [] }) {
  const { t } = useLanguage();
  const activas = alertas.filter(a => a.ativa);

  const nivelLabel = nivel => {
    if (nivel === 'ADVERTENCIA') return t('warning_level');
    if (nivel === 'CRITICA') return t('critical_level');
    return nivel;
  };

  return (
    <aside className={s.panel}>
      <div className={s.header}>
        <span className={s.title}>{t('alerts_title')}</span>
        {activas.length > 0 && <span className={s.count}>{activas.length}</span>}
      </div>
      <div className={s.list}>
        {activas.length === 0 ? (
          <div className={s.empty}>
            <span className={s.emptyDot} />
            {t('no_active_alerts')}
          </div>
        ) : (
          activas.map(a => (
            <div key={a.id} className={`${s.item} ${s[a.nivel?.toLowerCase()]}`}>
              <div className={s.itemHeader}>
                <span className={s.nivel}>{nivelLabel(a.nivel)}</span>
                <span className={s.comp}>{a.componente?.replace(/_/g, ' ')}</span>
              </div>
              <p className={s.msg}>{a.mensagem}</p>
              {a.valor != null && (
                <span className={s.valor}>{a.valor}</span>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
