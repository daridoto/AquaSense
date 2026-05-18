/**
 * equipShapes.jsx
 * Formas SVG nativas para os 8 componenteIds canónicos do AquaSense.
 * Cada shape é renderizada dentro de um <g transform="translate(x,y)"> externo.
 * Portos anatómicos definidos por conexiones-equipos.md.
 *
 * API pública:
 *   getShapeDef(componenteId)  → { width, height, ports, render(color, strokeW) }
 *   CANONICAL_IDS              → Set dos 8 ids canónicos
 */

// ── Dimensões padrão ──────────────────────────────────────────────────────────
// Cada equipamento define as suas próprias dimensões.
// A bounding box é [0,0,width,height]; portos são {x,y} nesse espaço.

// ── bomba_captacao / bomba_distribucion ──────────────────────────────────────
// Símbolo ISA de bomba centrífuga: círculo com pás radiais.
// Bounding box: 72×72. Centro em (36,36), raio 28.
// Portos: succion=(0,36) esquerda, descarga=(36,0) topo
function shapeBomba(color, sw) {
  const R = 28;   // raio do corpo — deixa margem para os stubs de tubo
  const cx = 36;
  const cy = 36;
  return (
    <>
      {/* Corpo circular */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth={sw} />
      {/* Núcleo central */}
      <circle cx={cx} cy={cy} r={5} fill={color} />
      {/* Pás radiais — 3 pás a 120° separação, símbolo ISA bomba centrífuga */}
      <line x1={cx} y1={cy} x2={cx} y2={cy - R + 6} stroke={color} strokeWidth={sw} />
      <line x1={cx} y1={cy}
            x2={cx + (R - 6) * Math.sin((2 * Math.PI) / 3)}
            y2={cy + (R - 6) * Math.cos((2 * Math.PI) / 3) * -1 + (R - 6) * 0.5}
            stroke={color} strokeWidth={sw} />
      <line x1={cx} y1={cy}
            x2={cx - (R - 6) * Math.sin((2 * Math.PI) / 3)}
            y2={cy + (R - 6) * Math.cos((2 * Math.PI) / 3) * -1 + (R - 6) * 0.5}
            stroke={color} strokeWidth={sw} />
      {/* Stub de sucção — da borda esquerda da caixa até ao círculo */}
      <line x1={0} y1={cy} x2={cx - R} y2={cy} stroke={color} strokeWidth={sw} />
      {/* Stub de descarga — do topo da caixa até ao círculo */}
      <line x1={cx} y1={0} x2={cx} y2={cy - R} stroke={color} strokeWidth={sw} />
    </>
  );
}

// ── reja_tamiz ────────────────────────────────────────────────────────────────
// Retângulo com linhas horizontais paralelas (barras de reja).
// Portos: alimentacao=esquerda, salida=direita
function shapeRejaTamiz(color, sw) {
  const W = 48;
  const H = 80;
  const barCount = 7;
  const gap = H / (barCount + 1);
  return (
    <>
      {/* Moldura */}
      <rect x={0} y={0} width={W} height={H} rx="2" fill="none" stroke={color} strokeWidth={sw} />
      {/* Barras horizontais */}
      {Array.from({ length: barCount }).map((_, i) => (
        <line
          key={i}
          x1={4} y1={gap * (i + 1)}
          x2={W - 4} y2={gap * (i + 1)}
          stroke={color} strokeWidth={sw * 1.2}
        />
      ))}
      {/* Tubo entrada esquerda */}
      <line x1={-12} y1={H / 2} x2={0} y2={H / 2} stroke={color} strokeWidth={sw} />
      {/* Tubo saída direita */}
      <line x1={W} y1={H / 2} x2={W + 12} y2={H / 2} stroke={color} strokeWidth={sw} />
    </>
  );
}

// ── coagulacion ───────────────────────────────────────────────────────────────
// Tanque cilíndrico com hélice de mistura e entradas.
// Portos: entrada=esquerda, entrada_pac=topo, salida=direita
function shapeCoagulacion(color, sw) {
  const W = 72;
  const H = 80;
  const cx = W / 2;
  const eH = 10; // altura da elipse topo/fundo
  return (
    <>
      {/* Corpo cilíndrico lateral */}
      <line x1={0} y1={eH} x2={0} y2={H - eH} stroke={color} strokeWidth={sw} />
      <line x1={W} y1={eH} x2={W} y2={H - eH} stroke={color} strokeWidth={sw} />
      {/* Elipse topo */}
      <ellipse cx={cx} cy={eH} rx={W / 2} ry={eH}
        fill="none" stroke={color} strokeWidth={sw} />
      {/* Elipse fundo (sólida) */}
      <ellipse cx={cx} cy={H - eH} rx={W / 2} ry={eH}
        fill="none" stroke={color} strokeWidth={sw} />
      {/* Linha de nível de fluido */}
      <line x1={0} y1={H * 0.55} x2={W} y2={H * 0.55}
        stroke={color} strokeWidth={sw * 0.4} strokeDasharray="4 3" opacity="0.5" />
      {/* Hélice de mistura — eixo vertical + 2 pás */}
      <line x1={cx} y1={eH} x2={cx} y2={H - eH} stroke={color} strokeWidth={sw * 0.8} />
      <path d={`M ${cx - 14} ${H * 0.45} Q ${cx} ${H * 0.35} ${cx + 14} ${H * 0.45}`}
        fill="none" stroke={color} strokeWidth={sw} />
      <path d={`M ${cx - 14} ${H * 0.58} Q ${cx} ${H * 0.48} ${cx + 14} ${H * 0.58}`}
        fill="none" stroke={color} strokeWidth={sw} />
      {/* Entrada lateral esquerda */}
      <line x1={-12} y1={H * 0.4} x2={0} y2={H * 0.4} stroke={color} strokeWidth={sw} />
      {/* Entrada PAC pelo topo */}
      <line x1={cx * 0.6} y1={0} x2={cx * 0.6} y2={eH} stroke={color} strokeWidth={sw}
        strokeDasharray="3 2" />
      {/* Saída lateral direita */}
      <line x1={W} y1={H * 0.4} x2={W + 12} y2={H * 0.4} stroke={color} strokeWidth={sw} />
    </>
  );
}

// ── decantador ────────────────────────────────────────────────────────────────
// Trapézio invertido (cone de sedimentação) com linha de nível de lodo.
// Portos: entrada=topo centro, salida=lateral direito, salida_lodos=fundo
function shapeDecantador(color, sw) {
  const TW = 80;    // largura topo
  const BW = 28;   // largura fundo
  const H = 80;
  const offL = (TW - BW) / 2;  // offset horizontal do fundo
  const cx = TW / 2;
  return (
    <>
      {/* Corpo trapezoidal */}
      <path
        d={`M 0,0 L ${TW},0 L ${TW - offL},${H} L ${offL},${H} Z`}
        fill="none" stroke={color} strokeWidth={sw}
      />
      {/* Linha de nível de lodo — 65% da altura */}
      {(() => {
        const frac = 0.65;
        const wAtFrac = TW - (TW - BW) * frac;
        const xL = (TW - wAtFrac) / 2;
        return (
          <line
            x1={xL} y1={H * frac}
            x2={TW - xL} y2={H * frac}
            stroke={color} strokeWidth={sw * 0.8}
            strokeDasharray="5 3" opacity="0.7"
          />
        );
      })()}
      {/* Entrada topo centro */}
      <line x1={cx} y1={-12} x2={cx} y2={0} stroke={color} strokeWidth={sw} />
      {/* Saída lateral direita (rebose) */}
      <line x1={TW} y1={H * 0.25} x2={TW + 12} y2={H * 0.25} stroke={color} strokeWidth={sw} />
      {/* Saída lodos pelo fundo — ponto central inferior */}
      <line x1={cx} y1={H} x2={cx} y2={H + 12} stroke={color} strokeWidth={sw}
        strokeDasharray="3 2" />
    </>
  );
}

// ── filtracion ────────────────────────────────────────────────────────────────
// Cilindro vertical com camadas internas (areia/antracita).
// Portos: entrada=topo, salida=fundo, salida_lavado=lateral, ar_escape=topo lateral
function shapeFiltracion(color, sw) {
  const W = 56;
  const H = 88;
  const cx = W / 2;
  const eH = 10;
  return (
    <>
      {/* Corpo cilíndrico */}
      <line x1={0} y1={eH} x2={0} y2={H - eH} stroke={color} strokeWidth={sw} />
      <line x1={W} y1={eH} x2={W} y2={H - eH} stroke={color} strokeWidth={sw} />
      {/* Elipse topo */}
      <ellipse cx={cx} cy={eH} rx={W / 2} ry={eH} fill="none" stroke={color} strokeWidth={sw} />
      {/* Elipse fundo */}
      <ellipse cx={cx} cy={H - eH} rx={W / 2} ry={eH} fill="none" stroke={color} strokeWidth={sw} />

      {/* Camada 1 — antracita (superior) */}
      <rect x={4} y={H * 0.28} width={W - 8} height={H * 0.18}
        fill="none" stroke={color} strokeWidth={sw * 0.6} />
      {/* Camada 2 — areia (inferior) */}
      <rect x={4} y={H * 0.50} width={W - 8} height={H * 0.22}
        fill="none" stroke={color} strokeWidth={sw * 0.6} />
      {/* Pontos de areia */}
      {[[10, H * 0.60], [18, H * 0.63], [26, H * 0.58], [34, H * 0.62], [42, H * 0.59]].map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={2} fill={color} opacity="0.6" />
      ))}

      {/* Entrada topo */}
      <line x1={cx} y1={0} x2={cx} y2={eH} stroke={color} strokeWidth={sw} />
      {/* Saída fundo */}
      <line x1={cx} y1={H - eH} x2={cx} y2={H} stroke={color} strokeWidth={sw} />
      {/* Saída retrolavado lateral direito */}
      <line x1={W} y1={H * 0.38} x2={W + 12} y2={H * 0.38}
        stroke={color} strokeWidth={sw} strokeDasharray="4 2" />
      {/* Ar escape — topo lateral esquerdo */}
      <line x1={cx * 0.4} y1={0} x2={cx * 0.4} y2={eH}
        stroke={color} strokeWidth={sw * 0.8} strokeDasharray="2 2" opacity="0.6" />
    </>
  );
}

// ── desinfeccion ──────────────────────────────────────────────────────────────
// Cilindro horizontal com símbolo UV (raios) e tubo de cloro.
// Portos: entrada=esquerda, entrada_cloro=superior, salida=direita
function shapeDesinfeccion(color, sw) {
  const W = 88;
  const H = 48;
  const cy = H / 2;
  const eW = 10;   // largura das elipses laterais
  return (
    <>
      {/* Corpo cilíndrico horizontal */}
      <line x1={eW} y1={0} x2={W - eW} y2={0} stroke={color} strokeWidth={sw} />
      <line x1={eW} y1={H} x2={W - eW} y2={H} stroke={color} strokeWidth={sw} />
      {/* Elipse esquerda */}
      <ellipse cx={eW} cy={cy} rx={eW} ry={H / 2} fill="none" stroke={color} strokeWidth={sw} />
      {/* Elipse direita */}
      <ellipse cx={W - eW} cy={cy} rx={eW} ry={H / 2} fill="none" stroke={color} strokeWidth={sw} />

      {/* Lâmpada UV — cilindro interno */}
      <rect x={eW + 6} y={cy - 4} width={W - 2 * eW - 12} height={8} rx="3"
        fill="none" stroke={color} strokeWidth={sw * 0.6} opacity="0.8" />
      {/* Raios UV — 4 linhas curtas acima e abaixo */}
      {[W * 0.3, W * 0.42, W * 0.54, W * 0.66].map((px, i) => (
        <g key={i}>
          <line x1={px} y1={cy - 4} x2={px - 2} y2={cy - 11} stroke={color} strokeWidth={sw * 0.7} opacity="0.7" />
          <line x1={px} y1={cy + 4} x2={px - 2} y2={cy + 11} stroke={color} strokeWidth={sw * 0.7} opacity="0.7" />
        </g>
      ))}

      {/* Entrada esquerda */}
      <line x1={0} y1={cy} x2={eW} y2={cy} stroke={color} strokeWidth={sw} />
      {/* Entrada cloro pelo topo */}
      <line x1={W * 0.6} y1={0} x2={W * 0.6} y2={-12}
        stroke={color} strokeWidth={sw} strokeDasharray="3 2" />
      {/* Saída direita */}
      <line x1={W - eW} y1={cy} x2={W} y2={cy} stroke={color} strokeWidth={sw} />

      {/* Label Cl abreviado */}
      <text x={W * 0.78} y={cy + 4} textAnchor="middle" fontSize="8"
        fontWeight="bold" fill={color} fontFamily="monospace" opacity="0.85">Cl</text>
    </>
  );
}

// ── reservorio ────────────────────────────────────────────────────────────────
// Tanque cilíndrico grande com indicador de nível.
// Portos: entrada=lateral superior esquerdo, salida=fundo lateral
function shapeReservorio(color, sw) {
  const W = 72;
  const H = 96;
  const cx = W / 2;
  const eH = 12;
  return (
    <>
      {/* Corpo cilíndrico */}
      <line x1={0} y1={eH} x2={0} y2={H - eH} stroke={color} strokeWidth={sw} />
      <line x1={W} y1={eH} x2={W} y2={H - eH} stroke={color} strokeWidth={sw} />
      {/* Elipse topo */}
      <ellipse cx={cx} cy={eH} rx={W / 2} ry={eH} fill="none" stroke={color} strokeWidth={sw} />
      {/* Elipse fundo */}
      <ellipse cx={cx} cy={H - eH} rx={W / 2} ry={eH} fill="none" stroke={color} strokeWidth={sw} />

      {/* Indicador de nível — barra lateral interna */}
      <line x1={W - 10} y1={eH + 4} x2={W - 10} y2={H - eH - 4}
        stroke={color} strokeWidth={sw * 0.6} opacity="0.4" />
      {/* Nível a 60% */}
      <line x1={W - 14} y1={eH + 4 + (H - 2 * eH - 8) * 0.4}
            x2={W - 6}  y2={eH + 4 + (H - 2 * eH - 8) * 0.4}
        stroke={color} strokeWidth={sw * 1.2} />

      {/* Linhas de água */}
      {[0.4, 0.6, 0.75].map((frac, i) => (
        <line key={i}
          x1={6} y1={eH + (H - 2 * eH) * frac}
          x2={W - 6} y2={eH + (H - 2 * eH) * frac}
          stroke={color} strokeWidth={sw * 0.4} strokeDasharray="5 4" opacity="0.35" />
      ))}

      {/* Entrada lateral superior esquerdo */}
      <line x1={-12} y1={H * 0.25} x2={0} y2={H * 0.25} stroke={color} strokeWidth={sw} />
      {/* Saída fundo lateral */}
      <line x1={W} y1={H - eH * 1.2} x2={W + 12} y2={H - eH * 1.2} stroke={color} strokeWidth={sw} />
    </>
  );
}

// ── Tabela de shapes canónicas ────────────────────────────────────────────────
/**
 * ports: lista de { id, x, y, dir }
 *   id  → nome do porto (conforme conexiones-equipos.md)
 *   x,y → posição relativa dentro da bounding box [0,0,width,height]
 *   dir → 'in' | 'out' | 'io'
 */
const SHAPES = {
  bomba_captacao: {
    width: 72,
    height: 72,
    ports: [
      { id: 'succion',  x: 0,  y: 36, dir: 'in'  },
      { id: 'descarga', x: 36, y: 0,  dir: 'out' },
    ],
    render: shapeBomba,
  },
  bomba_distribucion: {
    width: 72,
    height: 72,
    ports: [
      { id: 'succion',  x: 0,  y: 36, dir: 'in'  },
      { id: 'descarga', x: 36, y: 0,  dir: 'out' },
    ],
    render: shapeBomba,
  },
  reja_tamiz: {
    width: 48,
    height: 80,
    ports: [
      { id: 'alimentacao', x: -12, y: 40, dir: 'in'  },
      { id: 'salida',      x: 60,  y: 40, dir: 'out' },
    ],
    render: shapeRejaTamiz,
  },
  coagulacion: {
    width: 72,
    height: 80,
    ports: [
      { id: 'entrada',     x: -12, y: 32, dir: 'in'  },
      { id: 'entrada_pac', x: 22,  y: 0,  dir: 'in'  },
      { id: 'salida',      x: 84,  y: 32, dir: 'out' },
    ],
    render: shapeCoagulacion,
  },
  decantador: {
    width: 80,
    height: 80,
    ports: [
      { id: 'entrada',      x: 40,  y: -12, dir: 'in'  },
      { id: 'salida',       x: 92,  y: 20,  dir: 'out' },
      { id: 'salida_lodos', x: 40,  y: 92,  dir: 'out' },
    ],
    render: shapeDecantador,
  },
  filtracion: {
    width: 56,
    height: 88,
    ports: [
      { id: 'entrada',      x: 28,  y: 0,   dir: 'in'  },
      { id: 'salida',       x: 28,  y: 88,  dir: 'out' },
      { id: 'salida_lavado',x: 68,  y: 33,  dir: 'out' },
      { id: 'ar_escape',    x: 11,  y: 0,   dir: 'out' },
    ],
    render: shapeFiltracion,
  },
  desinfeccion: {
    width: 88,
    height: 48,
    ports: [
      { id: 'entrada',      x: 0,   y: 24, dir: 'in'  },
      { id: 'entrada_cloro',x: 53,  y: -12,dir: 'in'  },
      { id: 'salida',       x: 88,  y: 24, dir: 'out' },
    ],
    render: shapeDesinfeccion,
  },
  reservorio: {
    width: 72,
    height: 96,
    ports: [
      { id: 'entrada', x: -12, y: 24,  dir: 'in'  },
      { id: 'salida',  x: 84,  y: 84,  dir: 'out' },
    ],
    render: shapeReservorio,
  },
};

// IDs canónicos dos 8 equipamentos principais
export const CANONICAL_IDS = new Set(Object.keys(SHAPES));

/**
 * Devolve a definição de forma para um componenteId.
 * Se não for canónico, devolve null (usa fallback genérico).
 */
export function getShapeDef(componenteId) {
  return SHAPES[componenteId] ?? null;
}

/**
 * Devolve as posições de porto para um componenteId, mapeadas para o espaço
 * do canvas. Combina portos anatómicos (canónicos) com os 4 genéricos.
 *
 * @param {string} componenteId
 * @returns {Array<{id: string, x: number, y: number, dir: string}>}
 */
export function getPortPositions(componenteId) {
  const shape = SHAPES[componenteId];
  if (!shape) return null;
  return shape.ports;
}

/**
 * Renderiza a forma SVG nativa dentro de um <g> externo.
 * Não inclui o <g> em si — o caller faz translate(x,y).
 */
export function renderShape(componenteId, color, strokeW = 2) {
  const shape = SHAPES[componenteId];
  if (!shape) return null;
  return shape.render(color, strokeW);
}

/**
 * Devolve {width, height} da bounding box de um componenteId.
 * Para não-canónicos usa dimensões genéricas do editor.
 */
export function getShapeSize(componenteId) {
  const shape = SHAPES[componenteId];
  if (shape) return { width: shape.width, height: shape.height };
  return { width: 80, height: 72 }; // fallback = dimensões do CanvasEditor
}
