import { createContext, useContext, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

const LOCALE_MAP = { en: 'en-US', pt: 'pt-PT', es: 'es-ES', fr: 'fr-FR', de: 'de-DE' };

function getInitialLang() {
  try {
    const stored = localStorage.getItem('aquasense_user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u?.language && translations[u.language]) return u.language;
    }
  } catch (_) {}
  return 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);
  const t = (key) => translations[lang]?.[key] ?? translations['en'][key] ?? key;
  const localeCode = LOCALE_MAP[lang] ?? 'en-US';
  return (
    <LanguageContext.Provider value={{ lang, setLang, t, localeCode }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
