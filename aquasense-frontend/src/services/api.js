import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('aquasense_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    // Solo redirige al login en caso de 401 en rutas protegidas.
    // NO redirige cuando la propia llamada de login/register falla con 401.
    const isAuthEndpoint = err.config?.url?.includes('/auth/');
    if (err.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('aquasense_token');
      localStorage.removeItem('aquasense_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
