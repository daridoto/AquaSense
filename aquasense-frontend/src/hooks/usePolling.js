import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const MAX_BACKOFF_MS = 30000;

export function usePolling(url, interval = 5000) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const errCount = useRef(0);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    async function tick() {
      if (cancelled) return;

      // Pausa cuando el tab está en background — reanuda al volver al primer plano
      if (document.hidden) {
        timerRef.current = setTimeout(tick, interval);
        return;
      }

      try {
        const res = await api.get(url);
        if (!cancelled) {
          setData(res.data);
          setError(null);
          errCount.current = 0;
          timerRef.current = setTimeout(tick, interval);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
          errCount.current += 1;
          // Backoff exponencial: 5s → 10s → 20s → 30s (cap)
          const delay = Math.min(interval * 2 ** (errCount.current - 1), MAX_BACKOFF_MS);
          timerRef.current = setTimeout(tick, delay);
        }
      }
    }

    function onVisibility() {
      if (!document.hidden) {
        clearTimeout(timerRef.current);
        tick();
      }
    }

    tick();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [url, interval]);

  return { data, error };
}
