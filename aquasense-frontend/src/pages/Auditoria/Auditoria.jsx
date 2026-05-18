import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import s from './Auditoria.module.css';

const fmt = ts => ts ? new Date(ts).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' }) : '—';
const truncate = (str, n = 50) => !str ? '—' : str.length > n ? str.slice(0, n) + '…' : str;

export default function Auditoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ accion: '', usuario: '', desde: '', hasta: '' });
  const [applied, setApplied] = useState(filters);

  const load = useCallback((pg, f) => {
    setLoading(true);
    const params = { page: pg, size: 50 };
    if (f.accion) params.accion = f.accion;
    if (f.usuario) params.usuario = f.usuario;
    if (f.desde) params.desde = f.desde;
    if (f.hasta) params.hasta = f.hasta;
    api.get(`/api/proyectos/${id}/auditoria`, { params })
      .then(r => {
        setRows(r.data.content ?? []);
        setTotalPages(r.data.totalPages ?? 1);
        setTotal(r.data.totalElements ?? 0);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSearch = () => {
    setApplied(filters);
    setPage(0);
    load(0, filters);
  };

  const goPage = (pg) => {
    setPage(pg);
    load(pg, applied);
  };

  return (
    <div className={s.root}>
      <header className={s.header}>
        <div className={s.headerLeft}>
          <button className={s.back} onClick={() => navigate(`/proyectos/${id}`)}>← Dashboard</button>
          <div className={s.sep} />
          <span className={s.title}>AUDITORIA</span>
        </div>
      </header>

      <div className={s.filters}>
        <div className={s.field}>
          <span className={s.label}>Acção</span>
          <input className={s.input} placeholder="CONTROL_MANUAL..." value={filters.accion}
            onChange={e => setFilters(f => ({ ...f, accion: e.target.value }))} />
        </div>
        <div className={s.field}>
          <span className={s.label}>Utilizador</span>
          <input className={s.input} placeholder="email@..." value={filters.usuario}
            onChange={e => setFilters(f => ({ ...f, usuario: e.target.value }))} />
        </div>
        <div className={s.field}>
          <span className={s.label}>Desde</span>
          <input className={s.input} type="date" value={filters.desde}
            onChange={e => setFilters(f => ({ ...f, desde: e.target.value }))} />
        </div>
        <div className={s.field}>
          <span className={s.label}>Até</span>
          <input className={s.input} type="date" value={filters.hasta}
            onChange={e => setFilters(f => ({ ...f, hasta: e.target.value }))} />
        </div>
        <button className={s.searchBtn} onClick={handleSearch}>Pesquisar</button>
      </div>

      <div className={s.tableWrap}>
        {loading ? (
          <p className={s.loading}>A carregar...</p>
        ) : rows.length === 0 ? (
          <p className={s.empty}>Clique em Pesquisar para carregar eventos de auditoria.</p>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Utilizador</th>
                <th>Acção</th>
                <th>Entidade</th>
                <th>Valor depois</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className={s.ts}>{fmt(r.timestamp)}</td>
                  <td>{r.usuario}</td>
                  <td className={s.accion}>{r.accion}</td>
                  <td>{r.entidade}</td>
                  <td className={s.val}>{truncate(r.valorDespues)}</td>
                  <td className={s.ip}>{r.ip ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className={s.pagination}>
          <span className={s.pageInfo}>{total} eventos · Pág. {page + 1} / {totalPages}</span>
          <button className={s.pageBtn} onClick={() => goPage(page - 1)} disabled={page === 0}>← Anterior</button>
          <button className={s.pageBtn} onClick={() => goPage(page + 1)} disabled={page >= totalPages - 1}>Próxima →</button>
        </div>
      )}
    </div>
  );
}
