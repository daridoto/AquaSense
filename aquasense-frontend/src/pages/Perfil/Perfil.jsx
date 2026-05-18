import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import s from './Perfil.module.css';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

function Section({ title, children }) {
  return (
    <div className={s.card}>
      <span className={s.cardTitle}>{title}</span>
      {children}
    </div>
  );
}

function Feedback({ msg }) {
  if (!msg) return null;
  return (
    <p className={`${s.feedback} ${msg.type === 'ok' ? s.feedbackOk : s.feedbackErr}`}>
      {msg.text}
    </p>
  );
}

export default function Perfil() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, changeEmail, deleteAccount } = useAuth();
  const { t } = useLanguage();

  // Perfil
  const [nombre, setNombre] = useState(user?.nombre ?? '');
  const [language, setLanguage] = useState(user?.language ?? 'en');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Contraseña
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

  // Email
  const [newEmail, setNewEmail] = useState('');
  const [emailPwd, setEmailPwd] = useState('');
  const [changingEmail, setChangingEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState(null);

  // Eliminar cuenta
  const [deletePwd, setDeletePwd] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true); setProfileMsg(null);
    try {
      await updateProfile(nombre.trim(), language);
      setProfileMsg({ type: 'ok', text: t('profile_saved_ok') });
    } catch {
      setProfileMsg({ type: 'err', text: t('notif_save_error') });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg(null);
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: 'err', text: t('error_passwords_mismatch') });
      return;
    }
    setChangingPwd(true);
    try {
      await changePassword(currentPwd, newPwd);
      setPwdMsg({ type: 'ok', text: t('password_changed_ok') });
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (err) {
      const msg = err?.response?.status === 401
        ? t('error_wrong_password')
        : t('notif_save_error');
      setPwdMsg({ type: 'err', text: msg });
    } finally {
      setChangingPwd(false);
    }
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setChangingEmail(true); setEmailMsg(null);
    try {
      await changeEmail(newEmail.trim(), emailPwd);
      setEmailMsg({ type: 'ok', text: t('email_changed_ok') });
    } catch (err) {
      const status = err?.response?.status;
      const msg = status === 401
        ? t('error_wrong_password')
        : status === 409
          ? t('error_email_taken')
          : t('notif_save_error');
      setEmailMsg({ type: 'err', text: msg });
    } finally {
      setChangingEmail(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true); setDeleteMsg(null);
    try {
      await deleteAccount(deletePwd);
      navigate('/login');
    } catch (err) {
      const msg = err?.response?.status === 401
        ? t('error_wrong_password')
        : t('notif_save_error');
      setDeleteMsg({ type: 'err', text: msg });
      setDeleting(false);
    }
  };

  return (
    <div className={s.root}>
      <header className={s.header}>
        <button className={s.back} onClick={() => navigate('/proyectos')}>
          {t('back_to_projects')}
        </button>
        <div className={s.sep} />
        <span className={s.title}>{t('my_account')}</span>
      </header>

      <div className={s.body}>
        {/* Perfil */}
        <Section title={t('profile_heading')}>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className={s.field}>
              <label className={s.label}>{t('change_name_label')}</label>
              <input className={s.input} value={nombre}
                onChange={e => setNombre(e.target.value)} required />
            </div>
            <div className={s.field}>
              <label className={s.label}>{t('preferred_language')}</label>
              <select className={s.select} value={language} onChange={e => setLanguage(e.target.value)}>
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            <Feedback msg={profileMsg} />
            <button className={s.saveBtn} type="submit" disabled={savingProfile}>
              {savingProfile ? t('saving_btn') : t('save_profile_btn')}
            </button>
          </form>
        </Section>

        {/* Cambiar contraseña */}
        <Section title={t('change_password_heading')}>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className={s.field}>
              <label className={s.label}>{t('current_password_label')}</label>
              <input className={s.input} type="password" value={currentPwd}
                onChange={e => setCurrentPwd(e.target.value)} required />
            </div>
            <div className={s.field}>
              <label className={s.label}>{t('new_password_label')}</label>
              <input className={s.input} type="password" value={newPwd}
                onChange={e => setNewPwd(e.target.value)} required minLength={8} />
            </div>
            <div className={s.field}>
              <label className={s.label}>{t('confirm_new_password_label')}</label>
              <input className={s.input} type="password" value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)} required />
            </div>
            <Feedback msg={pwdMsg} />
            <button className={s.saveBtn} type="submit" disabled={changingPwd}>
              {changingPwd ? t('changing_btn') : t('change_password_btn')}
            </button>
          </form>
        </Section>

        {/* Cambiar email */}
        <Section title={t('change_email_heading')}>
          <form onSubmit={handleChangeEmail} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className={s.field}>
              <label className={s.label}>{t('new_email_label')}</label>
              <input className={s.input} type="email" value={newEmail}
                onChange={e => setNewEmail(e.target.value)} required />
            </div>
            <div className={s.field}>
              <label className={s.label}>{t('password_for_email_label')}</label>
              <input className={s.input} type="password" value={emailPwd}
                onChange={e => setEmailPwd(e.target.value)} required />
            </div>
            <Feedback msg={emailMsg} />
            <button className={s.saveBtn} type="submit" disabled={changingEmail}>
              {changingEmail ? t('changing_btn') : t('change_email_btn')}
            </button>
          </form>
        </Section>

        {/* Zona de peligro */}
        <div className={s.dangerCard}>
          <span className={s.dangerTitle}>{t('danger_zone_heading')}</span>
          <span className={s.cardTitle}>{t('delete_account_heading')}</span>
          <p className={s.dangerDesc}>{t('delete_account_desc')}</p>
          <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className={s.field}>
              <label className={s.label}>{t('password_for_email_label')}</label>
              <input className={s.input} type="password" value={deletePwd}
                onChange={e => setDeletePwd(e.target.value)} required />
            </div>
            <div className={s.field}>
              <label className={s.label}>{t('type_delete_label')}</label>
              <input className={s.input} value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="DELETE" />
            </div>
            <Feedback msg={deleteMsg} />
            <button className={s.deleteBtn} type="submit"
              disabled={deleting || deleteConfirm !== 'DELETE' || !deletePwd}>
              {deleting ? t('deleting_btn') : t('delete_account_btn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
