import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import s from './AlertaModal.module.css';

export default function AlertaModal({ title, fields = [], onConfirm, onClose, confirmLabel }) {
  const { t } = useLanguage();
  const initial = Object.fromEntries(fields.map(f => [f.key, f.defaultValue ?? '']));
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm(values);
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message ?? e?.message ?? t('backend_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.box}>
        <div className={s.header}>
          <span className={s.title}>{title}</span>
          <button className={s.closeBtn} onClick={onClose}>×</button>
        </div>
        <div className={s.body}>
          {fields.map(f => (
            <div key={f.key} className={s.field}>
              <label className={s.label}>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  className={s.textarea}
                  placeholder={f.placeholder ?? ''}
                  value={values[f.key]}
                  onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                />
              ) : (
                <input
                  className={s.input}
                  type={f.type ?? 'text'}
                  placeholder={f.placeholder ?? ''}
                  value={values[f.key]}
                  onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>
        {error && <p className={s.error}>{error}</p>}
        <div className={s.footer}>
          <button className={s.btnCancel} onClick={onClose}>{t('cancel').toUpperCase()}</button>
          <button className={s.btnConfirm} onClick={handleConfirm} disabled={loading}>
            {loading ? '...' : (confirmLabel ?? t('confirm'))}
          </button>
        </div>
      </div>
    </div>
  );
}
