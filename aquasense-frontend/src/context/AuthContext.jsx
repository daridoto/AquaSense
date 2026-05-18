import { createContext, useContext, useState } from 'react';
import api from '../services/api';
import { useLanguage } from './LanguageContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { setLang } = useLanguage();
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('aquasense_user');
    return u ? JSON.parse(u) : null;
  });

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('aquasense_token', res.data.token);
    localStorage.setItem('aquasense_user', JSON.stringify(res.data.usuario));
    setUser(res.data.usuario);
    if (res.data.usuario?.language) setLang(res.data.usuario.language);
    return res.data;
  };

  const register = async (nombre, email, password, language = 'en') => {
    const res = await api.post('/auth/register', { email, password, nombre, language });
    localStorage.setItem('aquasense_token', res.data.token);
    localStorage.setItem('aquasense_user', JSON.stringify(res.data.usuario));
    setUser(res.data.usuario);
    if (res.data.usuario?.language) setLang(res.data.usuario.language);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {
      // fallo silencioso — logout local continúa
    } finally {
      localStorage.removeItem('aquasense_token');
      localStorage.removeItem('aquasense_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
