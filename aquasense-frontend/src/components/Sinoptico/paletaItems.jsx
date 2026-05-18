/**
 * paletaItems.js
 * Defines the 40 palette components with SVG icon render functions.
 * Icons are pure SVG geometry — no PNGs, no external libs.
 *
 * renderIcon(color, strokeW) → JSX SVG children (rendered inside <svg viewBox="0 0 48 48">)
 */

// ── Bombagem (6) ─────────────────────────────────────────────────────────────
function iconBombaCentrifuga(c, sw) {
  return (
    <>
      <circle cx="24" cy="24" r="14" fill="none" stroke={c} strokeWidth={sw} />
      <circle cx="24" cy="24" r="5" fill={c} />
      <line x1="24" y1="10" x2="24" y2="17" stroke={c} strokeWidth={sw} />
      <line x1="34.9" y1="17" x2="30" y2="21.3" stroke={c} strokeWidth={sw} />
      <line x1="34.9" y1="31" x2="30" y2="26.7" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconBombaDosificadora(c, sw) {
  return (
    <>
      <rect x="8" y="14" width="20" height="20" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      <circle cx="18" cy="24" r="5" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="28" y1="20" x2="40" y2="20" stroke={c} strokeWidth={sw} />
      <line x1="28" y1="28" x2="40" y2="28" stroke={c} strokeWidth={sw} />
      <line x1="36" y1="16" x2="36" y2="32" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconBombaVacio(c, sw) {
  return (
    <>
      <ellipse cx="24" cy="24" rx="14" ry="10" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="10" y1="24" x2="38" y2="24" stroke={c} strokeWidth={sw} strokeDasharray="3 2" />
      <line x1="24" y1="8" x2="24" y2="14" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="34" x2="24" y2="40" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconBombaSumergible(c, sw) {
  return (
    <>
      <rect x="14" y="8" width="20" height="28" rx="4" fill="none" stroke={c} strokeWidth={sw} />
      <circle cx="24" cy="22" r="5" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="8" x2="24" y2="4" stroke={c} strokeWidth={sw} />
      <line x1="14" y1="36" x2="34" y2="36" stroke={c} strokeWidth={sw} />
      <line x1="8" y1="40" x2="40" y2="40" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconBombaPeristaltica(c, sw) {
  return (
    <>
      <circle cx="24" cy="24" r="12" fill="none" stroke={c} strokeWidth={sw} />
      <circle cx="18" cy="20" r="3" fill={c} />
      <circle cx="30" cy="20" r="3" fill={c} />
      <circle cx="24" cy="30" r="3" fill={c} />
      <line x1="8" y1="24" x2="12" y2="24" stroke={c} strokeWidth={sw} />
      <line x1="36" y1="24" x2="40" y2="24" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconBombaTornillo(c, sw) {
  return (
    <>
      <rect x="6" y="20" width="36" height="8" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      <path d="M10,20 Q16,16 22,20 Q28,24 34,20 Q38,17 42,20" fill="none" stroke={c} strokeWidth={sw} />
      <path d="M10,28 Q16,32 22,28 Q28,24 34,28 Q38,31 42,28" fill="none" stroke={c} strokeWidth={sw} />
    </>
  );
}

// ── Filtragem (6) ─────────────────────────────────────────────────────────────
function iconFiltroArena(c, sw) {
  return (
    <>
      <rect x="10" y="8" width="28" height="32" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="10" y1="20" x2="38" y2="20" stroke={c} strokeWidth={sw} />
      <circle cx="17" cy="26" r="2" fill={c} />
      <circle cx="24" cy="28" r="2" fill={c} />
      <circle cx="31" cy="25" r="2" fill={c} />
      <circle cx="20" cy="32" r="2" fill={c} />
      <circle cx="28" cy="31" r="2" fill={c} />
    </>
  );
}

function iconFiltroAntracita(c, sw) {
  return (
    <>
      <rect x="10" y="8" width="28" height="32" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="10" y1="18" x2="38" y2="18" stroke={c} strokeWidth={sw} />
      <line x1="10" y1="26" x2="38" y2="26" stroke={c} strokeWidth={sw} />
      <rect x="14" y="20" width="6" height="4" rx="1" fill={c} />
      <rect x="22" y="20" width="6" height="4" rx="1" fill={c} />
      <rect x="30" y="20" width="4" height="4" rx="1" fill={c} />
    </>
  );
}

function iconFiltroCartucho(c, sw) {
  return (
    <>
      <rect x="16" y="4" width="16" height="40" rx="6" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="16" y1="14" x2="32" y2="14" stroke={c} strokeWidth={sw} />
      <line x1="16" y1="20" x2="32" y2="20" stroke={c} strokeWidth={sw} />
      <line x1="16" y1="26" x2="32" y2="26" stroke={c} strokeWidth={sw} />
      <line x1="16" y1="32" x2="32" y2="32" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconFiltroManga(c, sw) {
  return (
    <>
      <path d="M14,4 L14,36 Q14,44 24,44 Q34,44 34,36 L34,4 Z" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="14" y1="4" x2="34" y2="4" stroke={c} strokeWidth={sw} />
      <path d="M18,4 Q18,20 18,36" fill="none" stroke={c} strokeWidth={sw} strokeDasharray="2 2" />
      <path d="M30,4 Q30,20 30,36" fill="none" stroke={c} strokeWidth={sw} strokeDasharray="2 2" />
    </>
  );
}

function iconFiltroUV(c, sw) {
  return (
    <>
      <rect x="12" y="10" width="24" height="28" rx="3" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="4" x2="24" y2="10" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="38" x2="24" y2="44" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="14" x2="24" y2="34" stroke={c} strokeWidth={sw} strokeDasharray="2 2" opacity="0.7" />
      <text x="24" y="27" textAnchor="middle" fontSize="8" fontWeight="bold" fill={c} fontFamily="monospace">UV</text>
    </>
  );
}

function iconMembranaUF(c, sw) {
  return (
    <>
      <rect x="8" y="10" width="32" height="28" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      {[14, 18, 22, 26, 30, 34].map(x => (
        <line key={x} x1={x} y1="10" x2={x} y2="38" stroke={c} strokeWidth={sw * 0.6} opacity="0.7" />
      ))}
      <line x1="8" y1="24" x2="40" y2="24" stroke={c} strokeWidth={sw} />
    </>
  );
}

// ── Tanques (6) ───────────────────────────────────────────────────────────────
function iconTanqueAguaCruda(c, sw) {
  return (
    <>
      <rect x="8" y="12" width="32" height="28" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      <ellipse cx="24" cy="12" rx="16" ry="4" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="4" x2="24" y2="12" stroke={c} strokeWidth={sw} />
      <line x1="8" y1="40" x2="40" y2="40" stroke={c} strokeWidth={sw * 0.5} opacity="0.5" />
      <line x1="8" y1="32" x2="40" y2="32" stroke={c} strokeWidth={sw * 0.5} opacity="0.5" />
    </>
  );
}

function iconTanquePAC(c, sw) {
  return (
    <>
      <rect x="10" y="10" width="28" height="30" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      <ellipse cx="24" cy="10" rx="14" ry="3" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="4" x2="24" y2="10" stroke={c} strokeWidth={sw} />
      <text x="24" y="30" textAnchor="middle" fontSize="7" fontWeight="bold" fill={c} fontFamily="monospace">PAC</text>
    </>
  );
}

function iconTanqueCloro(c, sw) {
  return (
    <>
      <circle cx="24" cy="26" r="16" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="4" x2="24" y2="10" stroke={c} strokeWidth={sw} />
      <text x="24" y="29" textAnchor="middle" fontSize="8" fontWeight="bold" fill={c} fontFamily="monospace">Cl₂</text>
    </>
  );
}

function iconTanqueLodos(c, sw) {
  return (
    <>
      <path d="M8,12 L8,36 Q8,42 24,42 Q40,42 40,36 L40,12 Z" fill="none" stroke={c} strokeWidth={sw} />
      <ellipse cx="24" cy="12" rx="16" ry="4" fill="none" stroke={c} strokeWidth={sw} />
      <path d="M8,30 Q16,34 24,30 Q32,26 40,30" fill="none" stroke={c} strokeWidth={sw} strokeDasharray="2 2" />
    </>
  );
}

function iconReservorio(c, sw) {
  return (
    <>
      <rect x="4" y="16" width="40" height="26" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="4" y1="30" x2="44" y2="30" stroke={c} strokeWidth={sw * 0.5} opacity="0.5" />
      <line x1="24" y1="4" x2="24" y2="16" stroke={c} strokeWidth={sw} />
      <line x1="4" y1="42" x2="44" y2="42" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconCisterna(c, sw) {
  return (
    <>
      <ellipse cx="24" cy="28" rx="18" ry="12" fill="none" stroke={c} strokeWidth={sw} />
      <ellipse cx="24" cy="20" rx="18" ry="6" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="6" y1="20" x2="6" y2="28" stroke={c} strokeWidth={sw} />
      <line x1="42" y1="20" x2="42" y2="28" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="8" x2="24" y2="14" stroke={c} strokeWidth={sw} />
    </>
  );
}

// ── Tratamento (6) ────────────────────────────────────────────────────────────
function iconCoagulador(c, sw) {
  return (
    <>
      <rect x="8" y="10" width="32" height="28" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="16" y1="10" x2="16" y2="38" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="10" x2="24" y2="38" stroke={c} strokeWidth={sw} />
      <line x1="32" y1="10" x2="32" y2="38" stroke={c} strokeWidth={sw} />
      <line x1="8" y1="4" x2="8" y2="10" stroke={c} strokeWidth={sw} />
      <line x1="40" y1="38" x2="40" y2="44" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconFloculador(c, sw) {
  return (
    <>
      <rect x="8" y="8" width="32" height="32" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      <path d="M24,14 L24,34" stroke={c} strokeWidth={sw} />
      <path d="M18,18 Q24,22 30,18" fill="none" stroke={c} strokeWidth={sw} />
      <path d="M18,24 Q24,28 30,24" fill="none" stroke={c} strokeWidth={sw} />
      <path d="M18,30 Q24,34 30,30" fill="none" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconDecantadorLaminar(c, sw) {
  return (
    <>
      <path d="M6,10 L42,10 L36,38 L12,38 Z" fill="none" stroke={c} strokeWidth={sw} />
      {[16, 20, 24, 28, 32].map((y, i) => (
        <line key={i} x1={6 + i * 3} y1={y} x2={42 - i * 3} y2={y} stroke={c} strokeWidth={sw * 0.6} opacity="0.6" />
      ))}
    </>
  );
}

function iconDecantadorCircular(c, sw) {
  return (
    <>
      <circle cx="24" cy="24" r="18" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="6" x2="24" y2="42" stroke={c} strokeWidth={sw * 0.6} />
      <line x1="6" y1="24" x2="42" y2="24" stroke={c} strokeWidth={sw * 0.6} />
      <circle cx="24" cy="24" r="4" fill="none" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconReactorBiologico(c, sw) {
  return (
    <>
      <rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke={c} strokeWidth={sw} />
      <circle cx="18" cy="22" r="4" fill="none" stroke={c} strokeWidth={sw} />
      <circle cx="30" cy="22" r="4" fill="none" stroke={c} strokeWidth={sw} />
      <circle cx="24" cy="32" r="4" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="8" y1="4" x2="8" y2="8" stroke={c} strokeWidth={sw} />
      <line x1="40" y1="40" x2="40" y2="44" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconTorreAireacion(c, sw) {
  return (
    <>
      <rect x="12" y="4" width="24" height="38" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      {[12, 18, 24, 30].map(y => (
        <line key={y} x1="12" y1={y} x2="36" y2={y} stroke={c} strokeWidth={sw * 0.5} opacity="0.5" />
      ))}
      <path d="M16,36 Q20,30 24,36 Q28,30 32,36" fill="none" stroke={c} strokeWidth={sw} />
    </>
  );
}

// ── Medição (6) ───────────────────────────────────────────────────────────────
function iconCaudalimetro(c, sw) {
  return (
    <>
      <circle cx="24" cy="24" r="16" fill="none" stroke={c} strokeWidth={sw} />
      <path d="M14,32 Q19,16 24,24 Q29,32 34,16" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="8" x2="24" y2="12" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="36" x2="24" y2="40" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconManometro(c, sw) {
  return (
    <>
      <circle cx="24" cy="26" r="16" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="10" x2="24" y2="8" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="26" x2="32" y2="18" stroke={c} strokeWidth={sw} />
      <circle cx="24" cy="26" r="2" fill={c} />
      <line x1="12" y1="26" x2="16" y2="26" stroke={c} strokeWidth={sw * 0.7} />
      <line x1="32" y1="26" x2="36" y2="26" stroke={c} strokeWidth={sw * 0.7} />
    </>
  );
}

function iconPhSensor(c, sw) {
  return (
    <>
      <rect x="16" y="8" width="16" height="30" rx="6" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="4" x2="24" y2="8" stroke={c} strokeWidth={sw} />
      <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="bold" fill={c} fontFamily="monospace">pH</text>
    </>
  );
}

function iconOrpSensor(c, sw) {
  return (
    <>
      <rect x="16" y="8" width="16" height="30" rx="6" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="4" x2="24" y2="8" stroke={c} strokeWidth={sw} />
      <text x="24" y="27" textAnchor="middle" fontSize="7" fontWeight="bold" fill={c} fontFamily="monospace">ORP</text>
    </>
  );
}

function iconTurbidimetro(c, sw) {
  return (
    <>
      <circle cx="24" cy="24" r="14" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="10" y1="24" x2="20" y2="24" stroke={c} strokeWidth={sw} />
      <path d="M20,24 L28,16" stroke={c} strokeWidth={sw} />
      <path d="M24,24 L30,30" stroke={c} strokeWidth={sw} strokeDasharray="2 1" />
      <circle cx="20" cy="24" r="2" fill={c} />
    </>
  );
}

function iconNivelSensor(c, sw) {
  return (
    <>
      <rect x="10" y="4" width="8" height="36" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="18" y1="12" x2="24" y2="12" stroke={c} strokeWidth={sw * 0.7} />
      <line x1="18" y1="20" x2="28" y2="20" stroke={c} strokeWidth={sw * 0.7} />
      <line x1="18" y1="28" x2="24" y2="28" stroke={c} strokeWidth={sw * 0.7} />
      <line x1="18" y1="36" x2="32" y2="36" stroke={c} strokeWidth={sw} />
      <circle cx="32" cy="36" r="3" fill={c} />
    </>
  );
}

// ── Controlo (5) ─────────────────────────────────────────────────────────────
function iconValvulaManual(c, sw) {
  return (
    <>
      <path d="M8,18 L24,30 L40,18" fill="none" stroke={c} strokeWidth={sw} />
      <path d="M8,30 L24,18 L40,30" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="18" x2="24" y2="10" stroke={c} strokeWidth={sw} />
      <line x1="18" y1="8" x2="30" y2="8" stroke={c} strokeWidth={sw * 1.5} />
    </>
  );
}

function iconValvulaMotorizada(c, sw) {
  return (
    <>
      <path d="M8,22 L24,34 L40,22" fill="none" stroke={c} strokeWidth={sw} />
      <path d="M8,34 L24,22 L40,34" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="22" x2="24" y2="14" stroke={c} strokeWidth={sw} />
      <rect x="18" y="8" width="12" height="8" rx="2" fill="none" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconValvulaSolenoide(c, sw) {
  return (
    <>
      <path d="M8,22 L24,34 L40,22" fill="none" stroke={c} strokeWidth={sw} />
      <path d="M8,34 L24,22 L40,34" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="22" x2="24" y2="14" stroke={c} strokeWidth={sw} />
      <ellipse cx="24" cy="10" rx="6" ry="4" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="21" y1="10" x2="27" y2="10" stroke={c} strokeWidth={sw * 0.6} />
    </>
  );
}

function iconVariadorFrequencia(c, sw) {
  return (
    <>
      <rect x="6" y="8" width="36" height="32" rx="3" fill="none" stroke={c} strokeWidth={sw} />
      <path d="M12,32 Q16,16 20,24 Q24,32 28,16 Q32,8 36,24" fill="none" stroke={c} strokeWidth={sw} />
      <text x="24" y="44" textAnchor="middle" fontSize="6" fill={c} fontFamily="monospace">VFD</text>
    </>
  );
}

function iconPLC(c, sw) {
  return (
    <>
      <rect x="6" y="10" width="36" height="28" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      <rect x="10" y="14" width="10" height="8" rx="1" fill="none" stroke={c} strokeWidth={sw * 0.7} />
      <rect x="28" y="14" width="10" height="8" rx="1" fill="none" stroke={c} strokeWidth={sw * 0.7} />
      <line x1="10" y1="28" x2="38" y2="28" stroke={c} strokeWidth={sw * 0.5} />
      <line x1="14" y1="30" x2="14" y2="34" stroke={c} strokeWidth={sw * 0.7} />
      <line x1="20" y1="30" x2="20" y2="34" stroke={c} strokeWidth={sw * 0.7} />
      <line x1="26" y1="30" x2="26" y2="34" stroke={c} strokeWidth={sw * 0.7} />
      <line x1="32" y1="30" x2="32" y2="34" stroke={c} strokeWidth={sw * 0.7} />
    </>
  );
}

// ── Estrutura (5) ─────────────────────────────────────────────────────────────
function iconRejaGruesa(c, sw) {
  return (
    <>
      <line x1="8" y1="6" x2="8" y2="42" stroke={c} strokeWidth={sw * 1.5} />
      <line x1="16" y1="8" x2="14" y2="42" stroke={c} strokeWidth={sw * 1.5} />
      <line x1="24" y1="6" x2="22" y2="42" stroke={c} strokeWidth={sw * 1.5} />
      <line x1="32" y1="8" x2="30" y2="42" stroke={c} strokeWidth={sw * 1.5} />
      <line x1="40" y1="6" x2="38" y2="42" stroke={c} strokeWidth={sw * 1.5} />
      <line x1="4" y1="42" x2="44" y2="42" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconRejaFina(c, sw) {
  return (
    <>
      {[8, 13, 18, 23, 28, 33, 38].map((x, i) => (
        <line key={i} x1={x} y1="6" x2={x - 2} y2="42" stroke={c} strokeWidth={sw} />
      ))}
      <line x1="4" y1="42" x2="44" y2="42" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconCanalEntrada(c, sw) {
  return (
    <>
      <path d="M4,12 L4,36 L44,36 L44,12" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="4" y1="12" x2="44" y2="12" stroke={c} strokeWidth={sw * 0.5} strokeDasharray="3 3" />
      <path d="M10,28 Q18,22 26,28 Q34,34 42,28" fill="none" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconPozoBombeo(c, sw) {
  return (
    <>
      <ellipse cx="24" cy="16" rx="16" ry="6" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="8" y1="16" x2="8" y2="36" stroke={c} strokeWidth={sw} />
      <line x1="40" y1="16" x2="40" y2="36" stroke={c} strokeWidth={sw} />
      <ellipse cx="24" cy="36" rx="16" ry="6" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="4" x2="24" y2="10" stroke={c} strokeWidth={sw} />
    </>
  );
}

function iconCaixaDistribuicao(c, sw) {
  return (
    <>
      <rect x="10" y="10" width="28" height="28" rx="2" fill="none" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="10" x2="24" y2="4" stroke={c} strokeWidth={sw} />
      <line x1="10" y1="24" x2="4" y2="24" stroke={c} strokeWidth={sw} />
      <line x1="38" y1="24" x2="44" y2="24" stroke={c} strokeWidth={sw} />
      <line x1="24" y1="38" x2="24" y2="44" stroke={c} strokeWidth={sw} />
      <circle cx="24" cy="24" r="4" fill="none" stroke={c} strokeWidth={sw} />
    </>
  );
}

// ── Catálogo completo ─────────────────────────────────────────────────────────
export const PALETA_GRUPOS = [
  {
    id: 'bombagem',
    label: 'Bombagem',
    items: [
      { id: 'bomba_captacao',      label: 'B. Captação',    renderIcon: iconBombaCentrifuga },
      { id: 'bomba_centrifuga',    label: 'B. Centrífuga',  renderIcon: iconBombaCentrifuga },
      { id: 'bomba_dosificadora',  label: 'B. Doseadora',   renderIcon: iconBombaDosificadora },
      { id: 'bomba_vacio',         label: 'B. Vácuo',       renderIcon: iconBombaVacio },
      { id: 'bomba_sumergible',    label: 'B. Submersa',    renderIcon: iconBombaSumergible },
      { id: 'bomba_peristaltica',  label: 'B. Peristáltica',renderIcon: iconBombaPeristaltica },
      { id: 'bomba_tornillo',      label: 'B. Parafuso',    renderIcon: iconBombaTornillo },
    ],
  },
  {
    id: 'filtragem',
    label: 'Filtragem',
    items: [
      { id: 'filtracion',         label: 'Filtração',      renderIcon: iconFiltroArena },
      { id: 'filtro_arena',       label: 'F. Areia',       renderIcon: iconFiltroArena },
      { id: 'filtro_antracita',   label: 'F. Antracite',   renderIcon: iconFiltroAntracita },
      { id: 'filtro_cartucho',    label: 'F. Cartucho',    renderIcon: iconFiltroCartucho },
      { id: 'filtro_manga',       label: 'F. Manga',       renderIcon: iconFiltroManga },
      { id: 'filtro_uv',          label: 'F. UV',          renderIcon: iconFiltroUV },
      { id: 'membrana_uf',        label: 'Membrana UF',    renderIcon: iconMembranaUF },
    ],
  },
  {
    id: 'tanques',
    label: 'Tanques',
    items: [
      { id: 'reservorio',          label: 'Reservório',     renderIcon: iconReservorio },
      { id: 'tanque_agua_cruda',   label: 'T. Água Bruta',  renderIcon: iconTanqueAguaCruda },
      { id: 'tanque_pac',          label: 'T. PAC',         renderIcon: iconTanquePAC },
      { id: 'tanque_cloro',        label: 'T. Cloro',       renderIcon: iconTanqueCloro },
      { id: 'tanque_lodos',        label: 'T. Lodos',       renderIcon: iconTanqueLodos },
      { id: 'cisterna',            label: 'Cisterna',       renderIcon: iconCisterna },
    ],
  },
  {
    id: 'tratamento',
    label: 'Tratamento',
    items: [
      { id: 'coagulacion',         label: 'Coagulação',     renderIcon: iconCoagulador },
      { id: 'decantador',          label: 'Decantador',     renderIcon: iconDecantadorCircular },
      { id: 'coagulador',          label: 'Coagulador',     renderIcon: iconCoagulador },
      { id: 'floculador',          label: 'Floculador',     renderIcon: iconFloculador },
      { id: 'decantador_laminar',  label: 'Dec. Laminar',   renderIcon: iconDecantadorLaminar },
      { id: 'decantador_circular', label: 'Dec. Circular',  renderIcon: iconDecantadorCircular },
      { id: 'reactor_biologico',   label: 'Reator Bio.',    renderIcon: iconReactorBiologico },
      { id: 'torre_aireacion',     label: 'Torre Aeração',  renderIcon: iconTorreAireacion },
    ],
  },
  {
    id: 'medicao',
    label: 'Medição',
    items: [
      { id: 'caudalimetro',   label: 'Caudalímetro',  renderIcon: iconCaudalimetro },
      { id: 'manometro',      label: 'Manómetro',     renderIcon: iconManometro },
      { id: 'ph_sensor',      label: 'Sensor pH',     renderIcon: iconPhSensor },
      { id: 'orp_sensor',     label: 'Sensor ORP',    renderIcon: iconOrpSensor },
      { id: 'turbidimetro',   label: 'Turbidímetro',  renderIcon: iconTurbidimetro },
      { id: 'nivel_sensor',   label: 'Sensor Nível',  renderIcon: iconNivelSensor },
    ],
  },
  {
    id: 'controlo',
    label: 'Controlo',
    items: [
      { id: 'desinfeccion',          label: 'Desinfeção',   renderIcon: iconFiltroUV },
      { id: 'bomba_distribucion',    label: 'B. Distribuição', renderIcon: iconBombaCentrifuga },
      { id: 'valvula_manual',        label: 'V. Manual',    renderIcon: iconValvulaManual },
      { id: 'valvula_motorizada',    label: 'V. Motorizada',renderIcon: iconValvulaMotorizada },
      { id: 'valvula_solenoide',     label: 'V. Solenóide', renderIcon: iconValvulaSolenoide },
      { id: 'variador_frequencia',   label: 'Variador Freq',renderIcon: iconVariadorFrequencia },
      { id: 'plc',                   label: 'PLC',          renderIcon: iconPLC },
    ],
  },
  {
    id: 'estrutura',
    label: 'Estrutura',
    items: [
      { id: 'reja_tamiz',          label: 'Reja/Tamiz',     renderIcon: iconRejaFina },
      { id: 'reja_gruesa',         label: 'Reja Grossa',    renderIcon: iconRejaGruesa },
      { id: 'reja_fina',           label: 'Reja Fina',      renderIcon: iconRejaFina },
      { id: 'canal_entrada',       label: 'Canal Entrada',  renderIcon: iconCanalEntrada },
      { id: 'pozo_bombeo',         label: 'Poço Bombagem',  renderIcon: iconPozoBombeo },
      { id: 'caixa_distribuicao',  label: 'Cx. Distribuição',renderIcon: iconCaixaDistribuicao },
    ],
  },
];

// Flat map for quick lookup by componenteId
export const PALETA_MAP = Object.fromEntries(
  PALETA_GRUPOS.flatMap(g => g.items).map(item => [item.id, item])
);
