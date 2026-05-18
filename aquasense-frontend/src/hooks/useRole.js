import { useState, useEffect } from 'react';
import api from '../services/api';

const cache = {};

export function clearRoleCache() {
  Object.keys(cache).forEach(k => delete cache[k]);
}

export function useRole(projectId) {
  const [rol, setRol] = useState(cache[projectId] ?? null);
  const [loading, setLoading] = useState(!cache[projectId]);

  useEffect(() => {
    if (!projectId) return;
    if (cache[projectId]) { setRol(cache[projectId]); setLoading(false); return; }
    api.get(`/api/proyectos/${projectId}/mirol`)
      .then(r => { cache[projectId] = r.data.rol; setRol(r.data.rol); })
      .catch(() => { setRol('VISUALIZADOR'); })
      .finally(() => setLoading(false));
  }, [projectId]);

  const isAdmin        = rol === 'ADMIN';
  const isOperador     = rol === 'OPERADOR' || rol === 'ADMIN';
  const isMantenimiento= rol === 'MANTENIMIENTO' || rol === 'ADMIN';
  const canEdit        = isAdmin;
  const canControl     = isOperador;

  return { rol, loading, isAdmin, isOperador, isMantenimiento, canEdit, canControl };
}
