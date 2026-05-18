import { useState } from 'react';
import api from '../../services/api';
import s from './ModoPanel.module.css';

// Parâmetros editáveis por componente (camelCase exacto do contrato)
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
 * Painel de detalhe de um componente com toggle AUTO/MANUAL.
 *
 * Props:
 *   projectId   — ID do projeto
 *   componenteId — ID do componente (ex: "bomba_captacao")
 *   modoAtual   — "AUTO" | "MANUAL"
 *   valoresAtuais — Map<string, number> com os valores actuais do estado
 *   onClose     — callback para fechar o painel
 *   onModoChanged — callback chamado após mudar modo (para forçar re-render)
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

  // Inicializa formulário com valores actuais (arredondados para 2 casas)
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

  // ── Muda modo AUTO ↔ MANUAL ───────────────────────────────────────────────
  async function handleToggleModo() {
    const novoModo = modoAtual === 'AUTO' ? 'MANUAL' : 'AUTO';
    setToggling(true);
    setFeedback(null);
    try {
      await api.post(`/api/proyectos/${projectId}/control`, {
        componenteId,
        modo: novoModo,
      });
      setFeedback({ type: 'ok', msg: `Modo alterado para ${novoModo}` });
      if (onModoChanged) onModoChanged(componenteId, novoModo);
    } catch {
      setFeedback({ type: 'err', msg: 'Erro ao mudar modo. Tenta novamente.' });
    } finally {
      setToggling(false);
    }
  }

  // ── Envia leitura manual ──────────────────────────────────────────────────
  async function handleGuardar(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    // Converte form (strings) para Map<string, number>
    const valores = {};
    for (const [k, v] of Object.entries(form)) {
      const num = parseFloat(v);
      if (!isNaN(num)) valores[k] = num;
    }

    if (Object.keys(valores).length === 0) {
      setFeedback({ type: 'err', msg: 'Preenche pelo menos um campo antes de guardar.' });
      setSaving(false);
      return;
    }

    try {
      // O frontend envia para o endpoint público autenticado (com JWT)
      // O backend persiste com origen:"MANUAL"
      await api.post(`/api/proyectos/${projectId}/lecturas`, {
        componente: componenteId,
        valores,
        origen: 'MANUAL',
      });
      setFeedback({ type: 'ok', msg: 'Leitura manual guardada com sucesso.' });
    } catch {
      setFeedback({ type: 'err', msg: 'Erro ao guardar leitura. Verifica a ligação.' });
    } finally {
      setSaving(false);
    }
  }

  const isManual = modoAtual === 'MANUAL';

  return (
    <div className={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={s.panel}>
        {/* Cabeçalho */}
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

        {/* Formulário de leitura manual — só visível em modo MANUAL */}
        {isManual && (
          <form className={s.form} onSubmit={handleGuardar}>
            <p className={s.formHint}>
              Introduz os valores medidos manualmente. O simulador não enviará leituras
              automáticas para este componente enquanto estiver em modo MANUAL.
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
              {saving ? 'A GUARDAR...' : 'GUARDAR LEITURA MANUAL'}
            </button>
          </form>
        )}

        {/* Em modo AUTO: mostra valores actuais em leitura */}
        {!isManual && (
          <div className={s.readOnly}>
            <p className={s.readOnlyHint}>
              Componente em modo AUTO. O simulador gere as leituras automaticamente.
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
