import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import s from './Login.module.css';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

function extractError(err, fallback) {
  if (!err.response) {
    return null; // gestionado por el llamador con clave t()
  }
  const data = err.response.data;
  return data?.detail ?? data?.message ?? data?.error ?? fallback;
}

export default function Login() {
  const { login, register } = useAuth();
  const { t, setLang } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [rNome, setRNome] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [rConfirm, setRConfirm] = useState('');
  const [rLang, setRLang] = useState('en');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = m => { setError(''); setMode(m); };

  const handleLangChange = e => {
    setRLang(e.target.value);
    setLang(e.target.value);
  };

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/proyectos');
    } catch (err) {
      if (!err.response) {
        setError(t('error_no_server'));
      } else {
        setError(extractError(err, t('error_invalid_credentials')));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setError('');
    if (rPassword !== rConfirm) {
      setError(t('error_passwords_mismatch'));
      return;
    }
    setLoading(true);
    try {
      await register(rNome, rEmail, rPassword, rLang);
      navigate('/proyectos');
    } catch (err) {
      if (!err.response) {
        setError(t('error_no_server'));
      } else {
        setError(extractError(err, t('error_create_account')));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.root}>
      <div className={s.grid} aria-hidden="true" />
      <div className={s.card}>
        <div className={s.badge}>{t('system_online')}</div>
        <h1 className={s.title}>
          AQUA<span className={s.accent}>SENSE</span>
        </h1>
        <p className={s.subtitle}>{t('subtitle')}</p>

        {mode === 'login' ? (
          <form className={s.form} onSubmit={handleLogin}>
            <div className={s.field}>
              <label className={s.label}>{t('email')}</label>
              <input className={s.input} type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder={t('email_placeholder')} required />
            </div>
            <div className={s.field}>
              <label className={s.label}>{t('password')}</label>
              <input className={s.input} type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <p className={s.error}>{error}</p>}
            <button className={s.btn} type="submit" disabled={loading}>
              {loading ? t('signing_in') : t('sign_in')}
            </button>
            <p className={s.toggle}>
              {t('no_account')}{' '}
              <button type="button" className={s.toggleLink} onClick={() => switchMode('register')}>
                {t('create_account_link')}
              </button>
            </p>
          </form>
        ) : (
          <form className={s.form} onSubmit={handleRegister}>
            <div className={s.field}>
              <label className={s.label}>{t('full_name')}</label>
              <input className={s.input} type="text" value={rNome}
                onChange={e => setRNome(e.target.value)} placeholder="João Silva" required />
            </div>
            <div className={s.field}>
              <label className={s.label}>{t('email')}</label>
              <input className={s.input} type="email" value={rEmail}
                onChange={e => setREmail(e.target.value)} placeholder="email@example.com" required />
            </div>
            <div className={s.field}>
              <label className={s.label}>{t('password')}</label>
              <input className={s.input} type="password" value={rPassword}
                onChange={e => setRPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className={s.field}>
              <label className={s.label}>{t('confirm_password')}</label>
              <input className={s.input} type="password" value={rConfirm}
                onChange={e => setRConfirm(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className={s.field}>
              <label className={s.label}>{t('preferred_language')}</label>
              <select className={s.input} value={rLang} onChange={handleLangChange}>
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            {error && <p className={s.error}>{error}</p>}
            <button className={s.btn} type="submit" disabled={loading}>
              {loading ? t('creating') : t('create_account_btn')}
            </button>
            <p className={s.toggle}>
              {t('have_account')}{' '}
              <button type="button" className={s.toggleLink} onClick={() => switchMode('login')}>
                {t('sign_in_link')}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
