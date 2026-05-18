/**
 * equipShapes.jsx
 * Formas SVG nativas para los 8 componenteIds canónicos de AquaSense.
 * Cada shape se renderiza dentro de un <g transform="translate(x,y)"> externo.
 * Puertos anatómicos definidos por conexiones-equipos.md.
 *
 * API pública:
 *   getShapeDef(componenteId)  → { width, height, ports, render(color, strokeW) }
 *   CANONICAL_IDS              → Set de los 8 ids canónicos
 */

// ── Dimensiones por defecto ───────────────────────────────────────────────────
// Cada equipamiento define sus propias dimensiones.
// La bounding box es [0,0,width,height]; los puertos son {x,y} en ese espacio.

// ── bomba_captacao / bomba_distribucion ──────────────────────────────────────
// Símbolo ISA de bomba centrífuga: círculo con paletas radiales.
// Bounding box: 72×72. Centro en (36,36), radio 28.
// Puertos: succion=(0,36) izquierda, descarga=(36,0) arriba
function shapeBomba(color, sw) {
  const R = 28;   // radio del cuerpo — deja margen para los stubs de tubo
  const cx = 36;
  const cy = 36;
  return (
    <>
      {/* Cuerpo circular */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth={sw} />
      {/* Núcleo central */}
      <circle cx={cx} cy={cy} r={5} fill={color} />
      {/* Paletas radiales — 3 paletas a 120° de separación, símbolo ISA bomba centrífuga */}
      <line x1={cx} y1={cy} x2={cx} y2={cy - R + 6} stroke={color} strokeWidth={sw} />
      <line x1={cx} y1={cy}
            x2={cx + (R - 6) * Math.sin((2 * Math.PI) / 3)}
            y2={cy + (R - 6) * Math.cos((2 * Math.PI) / 3) * -1 + (R - 6) * 0.5}
            stroke={color} strokeWidth={sw} />
      <line x1={cx} y1={cy}
            x2={cx - (R - 6) * Math.sin((2 * Math.PI) / 3)}
            y2={cy + (R - 6) * Math.cos((2 * Math.PI) / 3) * -1 + (R - 6) * 0.5}
            stroke={color} strokeWidth={sw} />
      {/* Stub de succión — desde el borde izquierdo de la caja hasta el círculo */}
      <line x1={0} y1={cy} x2={cx - R} y2={cy} stroke={color} strokeWidth={sw} />
      {/* Stub de descarga — desde la parte superior de la caja hasta el círculo */}
      <line x1={cx} y1={0} x2={cx} y2={cy - R} stroke={color} strokeWidth={sw} />
    </>
  );
}

// ── reja_tamiz ────────────────────────────────────────────────────────────────
// Rectángulo con líneas horizontales paralelas (barras de reja).
// Puertos: alimentacao=izquierda, salida=derecha
function shapeRejaTamiz(color, sw) {
  const W = 48;
  const H = 80;
  const barCount = 7;
  const gap = H / (barCount + 1);
  return (
    <>
      {/* Marco */}
      <rect x={0} y={0} width={W} height={H} rx="2" fill="none" stroke={color} strokeWidth={sw} />
      {/* Barras horizontales */}
      {Array.from({ length: barCount }).map((_, i) => (
        <line
          key={i}
          x1={4} y1={gap * (i + 1)}
          x2={W - 4} y2={gap * (i + 1)}
          stroke={color} strokeWidth={sw * 1.2}
        />
      ))}
      {/* Tubo entrada izquierda */}
      <line x1={-12} y1={H / 2} x2={0} y2={H / 2} stroke={color} strokeWidth={sw} />
      {/* Tubo salida derecha */}
      <line x1={W} y1={H / 2} x2={W + 12} y2={H / 2} stroke={color} strokeWidth={sw} />
    </>
  );
}

// ── coagulacion ───────────────────────────────────────────────────────────────
// Tanque cilíndrico con hélice de mezcla y entradas.
// Puertos: entrada=izquierda, entrada_pac=arriba, salida=derecha
function shapeCoagulacion(color, sw) {
  const W = 72;
  const H = 80;
  const cx = W / 2;
  const eH = 10; // altura de la elipse superior/inferior
  return (
    <>
      {/* Cuerpo cilíndrico lateral */}
      <line x1={0} y1={eH} x2={0} y2={H - eH} stroke={color} strokeWidth={sw} />
      <line x1={W} y1={eH} x2={W} y2={H - eH} stroke={color} strokeWidth={sw} />
      {/* Elipse superior */}
      <ellipse cx={cx} cy={eH} rx={W / 2} ry={eH}
        fill="none" stroke={color} strokeWidth={sw} />
      {/* Elipse inferior (sólida) */}
      <ellipse cx={cx} cy={H - eH} rx={W / 2} ry={eH}
        fill="none" stroke={color} strokeWidth={sw} />
      {/* Línea de nivel de fluido */}
      <line x1={0} y1={H * 0.55} x2={W} y2={H * 0.55}
        stroke={color} strokeWidth={sw * 0.4} strokeDasharray="4 3" opacity="0.5" />
      {/* Hélice de mezcla — eje vertical + 2 paletas */}
      <line x1={cx} y1={eH} x2={cx} y2={H - eH} stroke={color} strokeWidth={sw * 0.8} />
      <path d={`M ${cx - 14} ${H * 0.45} Q ${cx} ${H * 0.35} ${cx + 14} ${H * 0.45}`}
        fill="none" stroke={color} strokeWidth={sw} />
      <path d={`M ${cx - 14} ${H * 0.58} Q ${cx} ${H * 0.48} ${cx + 14} ${H * 0.58}`}
        fill="none" stroke={color} strokeWidth={sw} />
      {/* Entrada lateral izquierda */}
      <line x1={-12} y1={H * 0.4} x2={0} y2={H * 0.4} stroke={color} strokeWidth={sw} />
      {/* Entrada PAC por la parte superior */}
      <line x1={cx * 0.6} y1={0} x2={cx * 0.6} y2={eH} stroke={color} strokeWidth={sw}
        strokeDasharray="3 2" />
      {/* Salida lateral derecha */}
      <line x1={W} y1={H * 0.4} x2={W + 12} y2={H * 0.4} stroke={color} strokeWidth={sw} />
    </>
  );
}

// ── decantador ────────────────────────────────────────────────────────────────
// Trapecio invertido (cono de sedimentación) con línea de nivel de lodo.
// Puertos: entrada=arriba centro, salida=lateral derecho, salida_lodos=abajo
function shapeDecantador(color, sw) {
  const TW = 80;    // anchura superior
  const BW = 28;   // anchura inferior
  const H = 80;
  const offL = (TW - BW) / 2;  // offset horizontal del fondo
  const cx = TW / 2;
  return (
    <>
      {/* Cuerpo trapezoidal */}
      <path
        d={`M 0,0 L ${TW},0 L ${TW - offL},${H} L ${offL},${H} Z`}
        fill="none" stroke={color} strokeWidth={sw}
      />
      {/* Línea de nivel de lodo — 65% de la altura */}
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
      {/* Entrada arriba centro */}
      <line x1={cx} y1={-12} x2={cx} y2={0} stroke={color} strokeWidth={sw} />
      {/* Salida lateral derecha (rebose) */}
      <line x1={TW} y1={H * 0.25} x2={TW + 12} y2={H * 0.25} stroke={color} strokeWidth={sw} />
      {/* Salida de lodos por el fondo — punto central inferior */}
      <line x1={cx} y1={H} x2={cx} y2={H + 12} stroke={color} strokeWidth={sw}
        strokeDasharray="3 2" />
    </>
  );
}

// ── filtracion ────────────────────────────────────────────────────────────────
// Cilindro vertical con capas internas (arena/antracita).
// Puertos: entrada=arriba, salida=abajo, salida_lavado=lateral, ar_escape=lateral superior
function shapeFiltracion(color, sw) {
  const W = 56;
  const H = 88;
  const cx = W / 2;
  const eH = 10;
  return (
    <>
      {/* Cuerpo cilíndrico */}
      <line x1={0} y1={eH} x2={0} y2={H - eH} stroke={color} strokeWidth={sw} />
      <line x1={W} y1={eH} x2={W} y2={H - eH} stroke={color} strokeWidth={sw} />
      {/* Elipse superior */}
      <ellipse cx={cx} cy={eH} rx={W / 2} ry={eH} fill="none" stroke={color} strokeWidth={sw} />
      {/* Elipse inferior */}
      <ellipse cx={cx} cy={H - eH} rx={W / 2} ry={eH} fill="none" stroke={color} strokeWidth={sw} />

      {/* Capa 1 — antracita (superior) */}
      <rect x={4} y={H * 0.28} width={W - 8} height={H * 0.18}
        fill="none" stroke={color} strokeWidth={sw * 0.6} />
      {/* Capa 2 — arena (inferior) */}
      <rect x={4} y={H * 0.50} width={W - 8} height={H * 0.22}
        fill="none" stroke={color} strokeWidth={sw * 0.6} />
      {/* Puntos de arena */}
      {[[10, H * 0.60], [18, H * 0.63], [26, H * 0.58], [34, H * 0.62], [42, H * 0.59]].map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={2} fill={color} opacity="0.6" />
      ))}

      {/* Entrada superior */}
      <line x1={cx} y1={0} x2={cx} y2={eH} stroke={color} strokeWidth={sw} />
      {/* Salida inferior */}
      <line x1={cx} y1={H - eH} x2={cx} y2={H} stroke={color} strokeWidth={sw} />
      {/* Salida retrolavado lateral derecho */}
      <line x1={W} y1={H * 0.38} x2={W + 12} y2={H * 0.38}
        stroke={color} strokeWidth={sw} strokeDasharray="4 2" />
      {/* Escape de aire — lateral superior izquierdo */}
      <line x1={cx * 0.4} y1={0} x2={cx * 0.4} y2={eH}
        stroke={color} strokeWidth={sw * 0.8} strokeDasharray="2 2" opacity="0.6" />
    </>
  );
}

// ── desinfeccion ──────────────────────────────────────────────────────────────
// Cilindro horizontal con símbolo UV (rayos) y tubo de cloro.
// Puertos: entrada=izquierda, entrada_cloro=superior, salida=derecha
function shapeDesinfeccion(color, sw) {
  const W = 88;
  const H = 48;
  const cy = H / 2;
  const eW = 10;   // anchura de las elipses laterales
  return (
    <>
      {/* Cuerpo cilíndrico horizontal */}
      <line x1={eW} y1={0} x2={W - eW} y2={0} stroke={color} strokeWidth={sw} />
      <line x1={eW} y1={H} x2={W - eW} y2={H} stroke={color} strokeWidth={sw} />
      {/* Elipse izquierda */}
      <ellipse cx={eW} cy={cy} rx={eW} ry={H / 2} fill="none" stroke={color} strokeWidth={sw} />
      {/* Elipse derecha */}
      <ellipse cx={W - eW} cy={cy} rx={eW} ry={H / 2} fill="none" stroke={color} strokeWidth={sw} />

      {/* Lámpara UV — cilindro interno */}
      <rect x={eW + 6} y={cy - 4} width={W - 2 * eW - 12} height={8} rx="3"
        fill="none" stroke={color} strokeWidth={sw * 0.6} opacity="0.8" />
      {/* Rayos UV — 4 líneas cortas arriba y abajo */}
      {[W * 0.3, W * 0.42, W * 0.54, W * 0.66].map((px, i) => (
        <g key={i}>
          <line x1={px} y1={cy - 4} x2={px - 2} y2={cy - 11} stroke={color} strokeWidth={sw * 0.7} opacity="0.7" />
          <line x1={px} y1={cy + 4} x2={px - 2} y2={cy + 11} stroke={color} strokeWidth={sw * 0.7} opacity="0.7" />
        </g>
      ))}

      {/* Entrada izquierda */}
      <line x1={0} y1={cy} x2={eW} y2={cy} stroke={color} strokeWidth={sw} />
      {/* Entrada de cloro por la parte superior */}
      <line x1={W * 0.6} y1={0} x2={W * 0.6} y2={-12}
        stroke={color} strokeWidth={sw} strokeDasharray="3 2" />
      {/* Salida derecha */}
      <line x1={W - eW} y1={cy} x2={W} y2={cy} stroke={color} strokeWidth={sw} />

      {/* Etiqueta Cl abreviada */}
      <text x={W * 0.78} y={cy + 4} textAnchor="middle" fontSize="8"
        fontWeight="bold" fill={color} fontFamily="monospace" opacity="0.85">Cl</text>
    </>
  );
}

// ── reservorio ────────────────────────────────────────────────────────────────
// Tanque cilíndrico grande con indicador de nivel.
// Puertos: entrada=lateral superior izquierdo, salida=lateral inferior
function shapeReservorio(color, sw) {
  const W = 72;
  const H = 96;
  const cx = W / 2;
  const eH = 12;
  return (
    <>
      {/* Cuerpo cilíndrico */}
      <line x1={0} y1={eH} x2={0} y2={H - eH} stroke={color} strokeWidth={sw} />
      <line x1={W} y1={eH} x2={W} y2={H - eH} stroke={color} strokeWidth={sw} />
      {/* Elipse superior */}
      <ellipse cx={cx} cy={eH} rx={W / 2} ry={eH} fill="none" stroke={color} strokeWidth={sw} />
      {/* Elipse inferior */}
      <ellipse cx={cx} cy={H - eH} rx={W / 2} ry={eH} fill="none" stroke={color} strokeWidth={sw} />

      {/* Indicador de nivel — barra lateral interna */}
      <line x1={W - 10} y1={eH + 4} x2={W - 10} y2={H - eH - 4}
        stroke={color} strokeWidth={sw * 0.6} opacity="0.4" />
      {/* Nivel al 60% */}
      <line x1={W - 14} y1={eH + 4 + (H - 2 * eH - 8) * 0.4}
            x2={W - 6}  y2={eH + 4 + (H - 2 * eH - 8) * 0.4}
        stroke={color} strokeWidth={sw * 1.2} />

      {/* Líneas de agua */}
      {[0.4, 0.6, 0.75].map((frac, i) => (
        <line key={i}
          x1={6} y1={eH + (H - 2 * eH) * frac}
          x2={W - 6} y2={eH + (H - 2 * eH) * frac}
          stroke={color} strokeWidth={sw * 0.4} strokeDasharray="5 4" opacity="0.35" />
      ))}

      {/* Entrada lateral superior izquierdo */}
      <line x1={-12} y1={H * 0.25} x2={0} y2={H * 0.25} stroke={color} strokeWidth={sw} />
      {/* Salida lateral inferior */}
      <line x1={W} y1={H - eH * 1.2} x2={W + 12} y2={H - eH * 1.2} stroke={color} strokeWidth={sw} />
    </>
  );
}

// ── Tabla de shapes canónicas ─────────────────────────────────────────────────
/**
 * ports: lista de { id, x, y, dir }
 *   id  → nombre del puerto (según conexiones-equipos.md)
 *   x,y → posición relativa dentro de la bounding box [0,0,width,height]
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

// IDs canónicos de los 8 equipamientos principales
export const CANONICAL_IDS = new Set(Object.keys(SHAPES));

/**
 * Devuelve la definición de forma para un componenteId.
 * Si no es canónico, devuelve null (usa fallback genérico).
 */
export function getShapeDef(componenteId) {
  return SHAPES[componenteId] ?? null;
}

/**
 * Devuelve las posiciones de puerto para un componenteId, mapeadas al espacio
 * del canvas. Combina puertos anatómicos (canónicos) con los 4 genéricos.
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
 * Renderiza la forma SVG nativa dentro de un <g> externo.
 * No incluye el <g> en sí — el caller hace translate(x,y).
 */
export function renderShape(componenteId, color, strokeW = 2) {
  const shape = SHAPES[componenteId];
  if (!shape) return null;
  return shape.render(color, strokeW);
}

/**
 * Devuelve {width, height} de la bounding box de un componenteId.
 * Para no canónicos usa dimensiones genéricas del editor.
 */
export function getShapeSize(componenteId) {
  const shape = SHAPES[componenteId];
  if (shape) return { width: shape.width, height: shape.height };
  return { width: 80, height: 72 }; // fallback = dimensiones del CanvasEditor
}
