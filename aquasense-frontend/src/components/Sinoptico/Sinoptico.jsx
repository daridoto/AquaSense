import { useEffect, useState, useCallback, memo } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import CanvasEditor from './CanvasEditor';
import { getShapeDef, getShapeSize, renderShape } from './equipShapes.jsx';
import { PALETA_MAP } from './paletaItems.jsx';
import ModoPanel from '../ModoPanel/ModoPanel';
import s from './Sinoptico.module.css';

// ── Dados de telemetria por componenteId ─────────────────────────────────────
const PRIMARY = {
  bomba_captacao:     { key: 'caudal',            unit: 'm³/h' },
  reja_tamiz:         { key: 'diferencialPresion', unit: 'mbar' },
  coagulacion:        { key: 'phPostCoagulacion',  unit: 'pH'   },
  decantador:         { key: 'turbidezSalida',     unit: 'NTU'  },
  filtracion:         { key: 'turbidezSalida',     unit: 'NTU'  },
  desinfeccion:       { key: 'cloroResidual',      unit: 'mg/L' },
  reservorio:         { key: 'nivel',              unit: '%'    },
  bomba_distribucion: { key: 'caudal',             unit: 'm³/h' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getAlertState(type, alertas) {
  const mine = alertas.filter(a => a.componente === type && a.ativa);
  if (!mine.length) return 'ok';
  if (mine.some(a => a.nivel === 'CRITICA')) return 'err';
  return 'warn';
}

const STATE_STROKE = { ok: '#00e87a', warn: '#f5a623', err: '#ff3d5a' };

// Sistema de tipos de tubagem — espelho de CanvasEditor (sem importar para evitar acoplamento)
const PIPE_TYPES = {
  aguaCruda:           { color: '#00d4ff', width: 4, dasharray: 'none' },
  aguaTratada:         { color: '#00e87a', width: 4, dasharray: 'none' },
  dosificacionQuimica: { color: '#f5a623', width: 2, dasharray: '6 3'  },
  purgaLodo:           { color: '#8aaec8', width: 3, dasharray: 'none' },
  retorno:             { color: '#8aaec8', width: 2, dasharray: '12 4' },
  venteo:              { color: '#ffffff', width: 1, dasharray: '2 4'  },
};
const PIPE_TYPE_KEYS = Object.keys(PIPE_TYPES);

// Migração legacy: style antigo → pipeType
const LEGACY_STYLE_MAP = {
  solid:  'aguaCruda',
  dashed: 'dosificacionQuimica',
  dotted: 'retorno',
};

function resolvePipeType(conn) {
  if (conn.pipeType && PIPE_TYPES[conn.pipeType]) return conn.pipeType;
  if (conn.style && LEGACY_STYLE_MAP[conn.style]) return LEGACY_STYLE_MAP[conn.style];
  return 'aguaCruda';
}

function parseLayout(raw) {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!parsed) return { cards: {}, connections: [] };
    // Novo formato (CanvasEditor)
    if (parsed.componentes !== undefined || parsed.tuberias !== undefined) {
      return {
        componentes: parsed.componentes ?? [],
        tuberias: parsed.tuberias ?? [],
        zoom: parsed.zoom ?? 1,
        panX: parsed.panX ?? 0,
        panY: parsed.panY ?? 0,
      };
    }
    // Formato antigo
    return {
      cards: parsed.cards ?? {},
      connections: parsed.connections ?? [],
    };
  } catch {
    return { cards: {}, connections: [] };
  }
}

// ── Sinóptico estático (fallback quando não há layout guardado) ────────────────
// Posições calculadas para acomodar as bounding boxes ISA reais de cada shape.
const STATIC_LAYOUT = [
  { id: 'bomba_captacao',    label: 'B. Captação',     x: 20,  y: 86 },
  { id: 'reja_tamiz',        label: 'Reja/Tamiz',      x: 140, y: 78 },
  { id: 'coagulacion',       label: 'Coagulação',      x: 258, y: 80 },
  { id: 'decantador',        label: 'Decantador',      x: 400, y: 80 },
  { id: 'filtracion',        label: 'Filtração',       x: 560, y: 62 },
  { id: 'desinfeccion',      label: 'Desinfeção',      x: 668, y: 94 },
  { id: 'reservorio',        label: 'Reservório',      x: 818, y: 50 },
  { id: 'bomba_distribucion',label: 'B. Distribuição', x: 968, y: 86 },
];

// Fluxo principal — portos anatómicos conforme conexiones-equipos.md
const STATIC_CONEXOES = [
  { from: 'bomba_captacao',    fp: 'descarga',   to: 'reja_tamiz',        tp: 'alimentacao', tipo: 'aguaCruda'   },
  { from: 'reja_tamiz',        fp: 'salida',     to: 'coagulacion',       tp: 'entrada',     tipo: 'aguaCruda'   },
  { from: 'coagulacion',       fp: 'salida',     to: 'decantador',        tp: 'entrada',     tipo: 'aguaCruda'   },
  { from: 'decantador',        fp: 'salida',     to: 'filtracion',        tp: 'entrada',     tipo: 'aguaTratada' },
  { from: 'filtracion',        fp: 'salida',     to: 'desinfeccion',      tp: 'entrada',     tipo: 'aguaTratada' },
  { from: 'desinfeccion',      fp: 'salida',     to: 'reservorio',        tp: 'entrada',     tipo: 'aguaTratada' },
  { from: 'reservorio',        fp: 'salida',     to: 'bomba_distribucion', tp: 'succion',    tipo: 'aguaTratada' },
];

const StaticSinoptico = memo(function StaticSinoptico({ estado, alertas, modosLocais = {}, onComponenteClick }) {
  const posMap = Object.fromEntries(STATIC_LAYOUT.map(c => [c.id, c]));

  function getAbsPort(id, portId) {
    const pos = posMap[id];
    const shape = getShapeDef(id);
    if (!pos || !shape) return { x: 0, y: 0 };
    const port = shape.ports.find(p => p.id === portId);
    return port ? { x: pos.x + port.x, y: pos.y + port.y } : { x: pos.x, y: pos.y };
  }

  function getPrimary(id) {
    const cfg = PRIMARY[id];
    if (!cfg) return null;
    const comp = estado?.componentes?.[id];
    if (!comp) return null;
    const val = comp.valores?.[cfg.key];
    if (val == null) return null;
    return `${val.toFixed(1)} ${cfg.unit}`;
  }

  return (
    <svg viewBox="0 0 1100 260" className={s.svg} preserveAspectRatio="xMidYMid meet">
      <defs>
        {PIPE_TYPE_KEYS.map(pt => (
          <marker key={pt} id={`sArr_${pt}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={PIPE_TYPES[pt].color} opacity="0.8" />
          </marker>
        ))}
      </defs>

      {/* Tubagens com curvas bézier entre portos anatómicos */}
      {STATIC_CONEXOES.map((cx, i) => {
        const p1 = getAbsPort(cx.from, cx.fp);
        const p2 = getAbsPort(cx.to, cx.tp);
        const mx = (p1.x + p2.x) / 2;
        const d = `M ${p1.x} ${p1.y} C ${mx} ${p1.y}, ${mx} ${p2.y}, ${p2.x} ${p2.y}`;
        const cfg = PIPE_TYPES[cx.tipo];
        const dash = cfg.dasharray === 'none' ? undefined : cfg.dasharray;
        return (
          <g key={i} pointerEvents="none">
            <path d={d} fill="none" stroke={cfg.color} strokeWidth={cfg.width + 3} opacity="0.10" />
            <path d={d} fill="none" stroke={cfg.color} strokeWidth={cfg.width}
              strokeDasharray={dash} markerEnd={`url(#sArr_${cx.tipo})`} opacity="0.75" />
          </g>
        );
      })}

      {/* Equipamentos — ISA shapes, sem rect de fundo */}
      {STATIC_LAYOUT.map(({ id, label, x, y }) => {
        const alertState = getAlertState(id, alertas);
        const isManual = modosLocais[id] === 'MANUAL';
        const stroke = isManual ? '#f5a623' : (STATE_STROKE[alertState] ?? '#00e87a');
        const { width: shW, height: shH } = getShapeSize(id);
        const primary = getPrimary(id);
        return (
          <g key={id} transform={`translate(${x},${y})`}
            onClick={() => onComponenteClick?.(id)}
            style={{ cursor: 'pointer' }}>
            {renderShape(id, stroke, 1.8)}
            <text x={shW / 2} y={shH + 14} textAnchor="middle" className={s.compLabel} fill={stroke}>
              {label}
            </text>
            {primary && (
              <text x={shW / 2} y={shH + 26} textAnchor="middle" className={s.compValue} fill={stroke}>
                {primary}
              </text>
            )}
            {isManual && (
              <text x={shW / 2} y={shH + 38} textAnchor="middle"
                style={{ fontSize: '11px', fontFamily: 'monospace', fill: '#f5a623', fontWeight: 700, letterSpacing: '1px' }}>
                MANUAL
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
});

// ── View sinóptico com layout do novo editor ──────────────────────────────────
const VIEW_W = 80;   // fallback para não-canónicos
const VIEW_H = 72;   // fallback para não-canónicos

function viewPortCenter(inst, port) {
  const shapeDef = getShapeDef(inst.componenteId);
  if (shapeDef) {
    const p = shapeDef.ports.find(pt => pt.id === port);
    if (p) return { x: inst.x + p.x, y: inst.y + p.y };
    const { width: W, height: H } = shapeDef;
    switch (port) {
      case 'left':   return { x: inst.x,         y: inst.y + H / 2 };
      case 'right':  return { x: inst.x + W,     y: inst.y + H / 2 };
      case 'top':    return { x: inst.x + W / 2, y: inst.y };
      case 'bottom': return { x: inst.x + W / 2, y: inst.y + H };
      default:       return { x: inst.x + W / 2, y: inst.y + H / 2 };
    }
  }
  switch (port) {
    case 'left':   return { x: inst.x,              y: inst.y + VIEW_H / 2 };
    case 'right':  return { x: inst.x + VIEW_W,     y: inst.y + VIEW_H / 2 };
    case 'top':    return { x: inst.x + VIEW_W / 2, y: inst.y };
    case 'bottom': return { x: inst.x + VIEW_W / 2, y: inst.y + VIEW_H };
    default:       return { x: inst.x + VIEW_W / 2, y: inst.y + VIEW_H / 2 };
  }
}

const ViewSinoptico = memo(function ViewSinoptico({ instances, connections, estado, alertas, modosLocais = {}, onComponenteClick }) {
  if (!instances.length) return null;

  // Bounding box para viewBox automático — respeita dimensões variáveis por shape
  const pad = 30;
  let bMinX = Infinity, bMinY = Infinity, bMaxX = -Infinity, bMaxY = -Infinity;
  instances.forEach(inst => {
    const { width: W, height: H } = getShapeSize(inst.componenteId);
    if (inst.x - 16 < bMinX) bMinX = inst.x - 16;
    if (inst.y - 16 < bMinY) bMinY = inst.y - 16;
    if (inst.x + W + 16 > bMaxX) bMaxX = inst.x + W + 16;
    if (inst.y + H + 30 > bMaxY) bMaxY = inst.y + H + 30;  // +30 para label + valor
  });
  if (!isFinite(bMinX)) { bMinX = 0; bMinY = 0; bMaxX = 400; bMaxY = 300; }
  const vx = bMinX - pad;
  const vy = bMinY - pad;
  const vw = bMaxX - bMinX + 2 * pad;
  const vh = bMaxY - bMinY + 2 * pad;

  return (
    <svg
      viewBox={`${vx} ${vy} ${vw} ${vh}`}
      width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      className={s.svg}
    >
      <defs>
        {/* Setas por tipo de tubagem */}
        {PIPE_TYPE_KEYS.map(pt => (
          <marker key={pt} id={`viewArr_${pt}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={PIPE_TYPES[pt].color} opacity="0.8" />
          </marker>
        ))}
      </defs>

      {/* Conexões */}
      {connections.map((conn, i) => {
        const fromInst = instances.find(inst => inst.id === (conn.fromInstanceId ?? conn.from?.cardId));
        const toInst   = instances.find(inst => inst.id === (conn.toInstanceId   ?? conn.to?.cardId));
        if (!fromInst || !toInst) return null;
        const pt = resolvePipeType(conn);
        const cfg = PIPE_TYPES[pt];
        const p1 = viewPortCenter(fromInst, conn.fromPort ?? conn.from?.port ?? 'right');
        const p2 = viewPortCenter(toInst,   conn.toPort   ?? conn.to?.port   ?? 'left');
        const cx = (p1.x + p2.x) / 2;
        const d = `M ${p1.x} ${p1.y} C ${cx} ${p1.y}, ${cx} ${p2.y}, ${p2.x} ${p2.y}`;
        const dashVal = cfg.dasharray === 'none' ? undefined : cfg.dasharray;
        return (
          <g key={i}>
            {/* Sombra sutil */}
            <path d={d} fill="none"
              stroke={cfg.color}
              strokeWidth={cfg.width + 3}
              strokeDasharray={dashVal}
              opacity="0.10"
              pointerEvents="none"
            />
            {/* Tubagem principal */}
            <path d={d} fill="none"
              stroke={cfg.color}
              strokeWidth={cfg.width}
              strokeDasharray={dashVal}
              markerEnd={`url(#viewArr_${pt})`}
              opacity="0.75"
            />
          </g>
        );
      })}

      {/* Instâncias */}
      {instances.map(inst => {
        const alertState = getAlertState(inst.componenteId, alertas);
        const isManual = modosLocais[inst.componenteId] === 'MANUAL';
        const baseStroke = STATE_STROKE[alertState] ?? '#00c8e8';
        // Em modo MANUAL, o contorno fica laranja para indicar controlo manual
        const stroke = isManual ? '#f5a623' : baseStroke;
        const fill = alertState === 'err'
          ? 'rgba(255,61,90,0.08)'
          : alertState === 'warn'
          ? 'rgba(245,166,35,0.08)'
          : isManual
          ? 'rgba(245,166,35,0.06)'
          : 'rgba(0,232,122,0.06)';

        const cfg = PRIMARY[inst.componenteId];
        const comp = estado?.componentes?.[inst.componenteId];
        let primary = null;
        if (comp && cfg) {
          const val = comp.valores?.[cfg.key];
          if (val != null) primary = `${val.toFixed(1)} ${cfg.unit}`;
        }

        const shapeDef = getShapeDef(inst.componenteId);
        const { width: shW, height: shH } = getShapeSize(inst.componenteId);

        return (
          <g key={inst.id} transform={`translate(${inst.x},${inst.y})`}
            onClick={() => onComponenteClick?.(inst.componenteId)}
            style={{ cursor: 'pointer' }}>
            {shapeDef ? (
              /* Forma canónica: SVG nativo, sem rect de fundo */
              <>
                {renderShape(inst.componenteId, stroke, 1.8)}
                <text
                  x={shW / 2} y={shH + 14}
                  textAnchor="middle"
                  className={s.compLabel}
                  fill={stroke}
                >
                  {inst.label ?? inst.componenteId}
                </text>
                {primary && (
                  <text
                    x={shW / 2} y={shH + 26}
                    textAnchor="middle"
                    className={s.compValue}
                    fill={stroke}
                  >
                    {primary}
                  </text>
                )}
                {isManual && (
                  <text x={shW / 2} y={shH + 38} textAnchor="middle"
                    style={{ fontSize: '11px', fontFamily: 'monospace', fill: '#f5a623', fontWeight: 700, letterSpacing: '1px' }}>
                    MANUAL
                  </text>
                )}
              </>
            ) : (
              /* Fallback não-canónico: ícone inline escalonado, sem rect de fundo */
              <>
                {(() => {
                  const sx = shW / 48;
                  const sy = shH / 48;
                  const compensatedSw = 1.8 / Math.min(sx, sy);
                  const item = PALETA_MAP[inst.componenteId];
                  return (
                    <g transform={`scale(${sx},${sy})`}>
                      {item
                        ? item.renderIcon(stroke, compensatedSw)
                        : <>
                            <rect x="4" y="4" width="40" height="40" rx="4" fill="none" stroke={stroke} strokeWidth={compensatedSw} />
                            <text x="24" y="30" textAnchor="middle" fontSize={18 / Math.min(sx, sy)} fontWeight="bold" fill={stroke} fontFamily="monospace">
                              {(inst.componenteId || '?')[0].toUpperCase()}
                            </text>
                          </>
                      }
                    </g>
                  );
                })()}
                <text x={shW / 2} y={shH + 14} textAnchor="middle"
                  className={s.compLabel} fill={stroke}>
                  {inst.label ?? inst.componenteId}
                </text>
                {primary && (
                  <text x={shW / 2} y={shH + 26} textAnchor="middle"
                    className={s.compValue} fill={stroke}>
                    {primary}
                  </text>
                )}
                {isManual && (
                  <text x={shW / 2} y={shH + 38} textAnchor="middle"
                    style={{ fontSize: '11px', fontFamily: 'monospace', fill: '#f5a623', fontWeight: 700, letterSpacing: '1px' }}>
                    MANUAL
                  </text>
                )}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
});

// ── Componente principal ──────────────────────────────────────────────────────
export default function Sinoptico({ projectId, estado, alertas = [], simulacaoAtiva = false }) {
  const [editMode, setEditMode] = useState(false);
  const [layout, setLayout] = useState(null);
  const [layoutLoaded, setLayoutLoaded] = useState(false);

  // Estado do painel de modo manual
  const [modoPanelComp, setModoPanelComp] = useState(null); // componenteId seleccionado

  // Cache local de modos (sobreposto pelo polling do /estado)
  const [modosLocais, setModosLocais] = useState({});

  const { t } = useLanguage();

  // Carregar layout guardado
  useEffect(() => {
    if (!projectId) return;
    api.get(`/api/proyectos/${projectId}/layout`)
      .then(r => {
        const parsed = parseLayout(r.data);
        setLayout(parsed);
      })
      .catch(() => { setLayout({ cards: {}, connections: [] }); })
      .finally(() => setLayoutLoaded(true));
  }, [projectId]);

  // Sincroniza modos locais com o estado vindo do polling
  useEffect(() => {
    if (estado?.modoComponentes) {
      setModosLocais(prev => ({ ...prev, ...estado.modoComponentes }));
    }
  }, [estado?.modoComponentes]);

  // Callback chamado pelo ModoPanel ao mudar modo — actualiza estado local imediatamente
  const handleModoChanged = useCallback((componenteId, novoModo) => {
    setModosLocais(prev => ({ ...prev, [componenteId]: novoModo }));
  }, []);

  // ── Callbacks do CanvasEditor ─────────────────────────────────────────────
  function handleEditorSave(newLayout) {
    setLayout(newLayout);
    setEditMode(false);
  }

  function handleEditorCancel() {
    setEditMode(false);
  }

  // ── VIEW MODE — sem layout ─────────────────────────────────────────────────
  if (!layoutLoaded) {
    return <div className={s.wrap}><p className={s.hint}>{t('loading_synoptic')}</p></div>;
  }

  // ── EDIT MODE — CanvasEditor SVG ──────────────────────────────────────────
  if (editMode) {
    return (
      <CanvasEditor
        projectId={projectId}
        initialLayout={layout}
        estado={estado}
        alertas={alertas}
        onSave={handleEditorSave}
        onCancel={handleEditorCancel}
      />
    );
  }

  // ── VIEW MODE — sinóptico de leitura ──────────────────────────────────────
  // Determina se existe layout no novo formato ou no antigo
  const hasLayout = (
    (layout?.componentes?.length > 0) ||
    (layout?.cards && Object.keys(layout.cards).length > 0)
  );

  // Converte instâncias para renderizar em view mode
  const viewInstances = layout?.componentes ?? (
    layout?.cards
      ? Object.entries(layout.cards).map(([id, c]) => ({
          id, componenteId: c.type, x: c.x, y: c.y, label: c.type,
        }))
      : []
  );

  const viewConnections = layout?.tuberias ?? layout?.connections ?? [];

  // Componente aberto no painel de modo
  const panelComp = modoPanelComp;
  const panelModo = panelComp ? (modosLocais[panelComp] ?? 'AUTO') : 'AUTO';
  const panelValores = panelComp ? (estado?.componentes?.[panelComp]?.valores ?? {}) : {};

  return (
    <div className={s.wrap}>
      {/* Toolbar view mode */}
      <div className={s.toolbar}>
        <span className={s.toolbarTitle}>{t('synoptic_title')}</span>
        {/* Badges de componentes em MANUAL */}
        {Object.entries(modosLocais)
          .filter(([, modo]) => modo === 'MANUAL')
          .map(([comp]) => (
            <span key={comp} className={s.badgeManual} title={`${comp} em modo MANUAL`}>
              {comp.replace(/_/g, ' ').toUpperCase()} — MANUAL
            </span>
          ))}
        <button className={s.btnEdit} onClick={() => setEditMode(true)}>{t('edit_layout')}</button>
      </div>

      <div className={s.editorBody}>
        <div className={s.canvas}>
          {/* Fallback VIEW: sinóptico estático se não há layout */}
          {!hasLayout && (
            <div className={s.staticWrap}>
              <StaticSinoptico
                estado={estado}
                alertas={alertas}
                modosLocais={modosLocais}
                onComponenteClick={setModoPanelComp}
              />
            </div>
          )}

          {/* VIEW: sinóptico com instâncias do novo editor */}
          {hasLayout && (
            <ViewSinoptico
              instances={viewInstances}
              connections={viewConnections}
              estado={estado}
              alertas={alertas}
              modosLocais={modosLocais}
              onComponenteClick={setModoPanelComp}
            />
          )}

          {/* Inactive overlay — shown when simulation is not running */}
          {!simulacaoAtiva && (
            <div className={s.inactiveOverlay}>
              <span className={s.inactiveIcon}>◉</span>
              <p className={s.inactiveTitle}>{t('simulation_inactive')}</p>
              <p className={s.inactiveMsg}>{t('simulation_inactive_msg')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Painel de modo manual — abre sobre o sinóptico */}
      {panelComp && (
        <ModoPanel
          projectId={projectId}
          componenteId={panelComp}
          modoAtual={panelModo}
          valoresAtuais={panelValores}
          onClose={() => setModoPanelComp(null)}
          onModoChanged={handleModoChanged}
        />
      )}
    </div>
  );
}
