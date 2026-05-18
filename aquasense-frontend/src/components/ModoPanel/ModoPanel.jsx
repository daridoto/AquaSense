import { useState } from 'react';
import api from '../../services/api';
import s from './ModoPanel.module.css';

// Parámetros editables por componente (camelCase exacto del contrato)
const PARAMS = {
  bomba_captacao:     ['caudal', 'presionSuccion', 'temperaturaMotor'],
  reja_tamiz:         ['diferencialPresion', 'turbidezEntrada'],
  coagulacion:        ['phPostCoagulacion', 'turbidezSalida', 'nivelTanquePAC', 'caudalDosificacion'],
  decantador:         ['turbidezSalida', 'nivelLodo', 'caudalSalida'],
  filtracion:         ['turbidezSalida', 'perdidaCarga', 'horasDesdelavado'],
  desinfeccion:       ['cloroResidual', 'ph', 'orp', 'nivelTanqueCloro'],
  reservorio:         ['nivel', 'cloroResidual', 'temperatura', 'turbidez'],
  bomba_distribucion: ['presionSalida', 'caudal', 'corrienteMotor'],
};

const UNITS = {
  caudal:             'm³/h',
  presionSuccion:     'bar',
  temperaturaMotor:   '°C',
  diferencialPresion: 'mbar',
  turbidezEntrada:    'NTU',
  phPostCoagulacion:  'pH',
  turbidezSalida:     'NTU',
  nivelTanquePAC:     '%',
  caudalDosificacion: 'L/h',
  nivelLodo:          '%',
  caudalSalida:       'm³/h',
  perdidaCarga:       'mca',
  horasDesdelavado:   'h',
  cloroResidual:      'mg/L',
  ph:                 'pH',
  orp:                'mV',
  nivelTanqueCloro:   '%',
  nivel:              '%',
  temperatura:        '°C',
  turbidez:           'NTU',
  presionSalida:      'bar',
  corrienteMotor:     'A',
};

/**
 * Panel de detalle de un componente con toggle AUTO/MANUAL.
 *
 * Props:
 *   projectId   — ID del proyecto
 *   componenteId — ID del componente (ej: "bomba_captacao")
 *   modoAtual   — "AUTO" | "MANUAL"
 *   valoresAtuais — Map<string, number> con los valores actuales del estado
 *   onClose     — callback para cerrar el panel
 *   onModoChanged — callback llamado tras cambiar modo (para forzar re-render)
 */
export default function ModoPanel({
  projectId,
  componenteId,
  modoAtual = 'AUTO',
  valoresAtuais = {},
  onClose,
  onModoChanged,
}) {
  const params = PARAMS[componenteId] ?? Object.keys(valoresAtuais);

  // Inicializa el formulario con valores actuales (redondeados a 2 decimales)
  const [form, setForm] = useState(() => {
    const init = {};
    params.forEach(p => {
      const v = valoresAtuais[p];
      init[p] = v != null ? String(parseFloat(v.toFixed(4))) : '';
    });
    return init;
  });

  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'ok'|'err', msg: string }

  // ── Cambia modo AUTO ↔ MANUAL ───────────────────────────────────────────────
  async function handleToggleModo() {
    const novoModo = modoAtual === 'AUTO' ? 'MANUAL' : 'AUTO';
    setToggling(true);
    setFeedback(null);
    try {
      await api.post(`/api/proyectos/${projectId}/control`, {
        componenteId,
        modo: novoModo,
      });
      setFeedback({ type: 'ok', msg: `Modo cambiado a ${novoModo}` });
      if (onModoChanged) onModoChanged(componenteId, novoModo);
    } catch {
      setFeedback({ type: 'err', msg: 'Error al cambiar modo. Inténtalo de nuevo.' });
    } finally {
      setToggling(false);
    }
  }

  // ── Envía lectura manual ──────────────────────────────────────────────────
  async function handleGuardar(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    // Convierte form (strings) a Map<string, number>
    const valores = {};
    for (const [k, v] of Object.entries(form)) {
      const num = parseFloat(v);
      if (!isNaN(num)) valores[k] = num;
    }

    if (Object.keys(valores).length === 0) {
      setFeedback({ type: 'err', msg: 'Rellena al menos un campo antes de guardar.' });
      setSaving(false);
      return;
    }

    try {
      // El frontend envía al endpoint público autenticado (con JWT)
      // El backend persiste con origen:"MANUAL"
      await api.post(`/api/proyectos/${projectId}/lecturas`, {
        componente: componenteId,
        valores,
        origen: 'MANUAL',
      });
      setFeedback({ type: 'ok', msg: 'Lectura manual guardada con éxito.' });
    } catch {
      setFeedback({ type: 'err', msg: 'Error al guardar lectura. Verifica la conexión.' });
    } finally {
      setSaving(false);
    }
  }

  const isManual = modoAtual === 'MANUAL';

  return (
    <div className={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={s.panel}>
        {/* Cabecera */}
        <div className={s.header}>
          <span className={s.title}>{componenteId.replace(/_/g, ' ').toUpperCase()}</span>
          <button className={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Toggle AUTO / MANUAL */}
        <div className={s.modoRow}>
          <span className={s.modoLabel}>MODO:</span>
          <div className={s.toggleWrap}>
            <button
              className={`${s.modeBtn} ${!isManual ? s.modeBtnActive : ''}`}
              onClick={isManual ? handleToggleModo : undefined}
              disabled={toggling || !isManual}
            >
              AUTO
            </button>
            <button
              className={`${s.modeBtn} ${isManual ? s.modeBtnManual : ''}`}
              onClick={!isManual ? handleToggleModo : undefined}
              disabled={toggling || isManual}
            >
              MANUAL
            </button>
          </div>
          {toggling && <span className={s.toggling}>...</span>}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`${s.feedback} ${feedback.type === 'ok' ? s.feedbackOk : s.feedbackErr}`}>
            {feedback.msg}
          </div>
        )}

        {/* Formulario de lectura manual — solo visible en modo MANUAL */}
        {isManual && (
          <form className={s.form} onSubmit={handleGuardar}>
            <p className={s.formHint}>
              Introduce los valores medidos manualmente. El simulador no enviará lecturas
              automáticas a este componente mientras esté en modo MANUAL.
            </p>
            <div className={s.fields}>
              {params.map(p => (
                <div key={p} className={s.field}>
                  <label className={s.fieldLabel}>
                    {p}
                    {UNITS[p] ? <span className={s.unit}> ({UNITS[p]})</span> : null}
                  </label>
                  <input
                    className={s.fieldInput}
                    type="number"
                    step="any"
                    value={form[p] ?? ''}
                    onChange={e => setForm(prev => ({ ...prev, [p]: e.target.value }))}
                    placeholder="—"
                  />
                </div>
              ))}
            </div>
            <button className={s.saveBtn} type="submit" disabled={saving}>
              {saving ? 'GUARDANDO...' : 'GUARDAR LECTURA MANUAL'}
            </button>
          </form>
        )}

        {/* En modo AUTO: muestra valores actuales en lectura */}
        {!isManual && (
          <div className={s.readOnly}>
            <p className={s.readOnlyHint}>
              Componente en modo AUTO. El simulador gestiona las lecturas automáticamente.
            </p>
            <div className={s.fields}>
              {params.map(p => {
                const v = valoresAtuais[p];
                return (
                  <div key={p} className={s.field}>
                    <span className={s.fieldLabel}>
                      {p}
                      {UNITS[p] ? <span className={s.unit}> ({UNITS[p]})</span> : null}
                    </span>
                    <span className={s.fieldValue}>
                      {v != null ? v.toFixed(2) : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
