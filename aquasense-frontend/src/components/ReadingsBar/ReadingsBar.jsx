import { useLanguage } from '../../context/LanguageContext.jsx';
import s from './ReadingsBar.module.css';

const COMP_LABELS = {
  bomba_captacao:     'B.CAPT.',
  reja_tamiz:         'TAMIZ',
  coagulacion:        'COAG.',
  decantador:         'DECAN.',
  filtracion:         'FILTR.',
  desinfeccion:       'DESINF.',
  reservorio:         'RESERV.',
  bomba_distribucion: 'B.DIST.',
};

// Campos a mostrar por componente, en el orden definido
const FIELDS = {
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

const MAIN_KEY = {
  bomba_captacao:     'caudal',
  reja_tamiz:         'diferencialPresion',
  coagulacion:        'phPostCoagulacion',
  decantador:         'turbidezSalida',
  filtracion:         'turbidezSalida',
  desinfeccion:       'cloroResidual',
  reservorio:         'nivel',
  bomba_distribucion: 'caudal',
};

const MAIN_MAX = {
  bomba_captacao: 20, reja_tamiz: 1, coagulacion: 14, decantador: 10,
  filtracion: 3, desinfeccion: 2, reservorio: 100, bomba_distribucion: 20,
};

function getState(id, alertas) {
  const mine = alertas.filter(a => a.componente === id && a.ativa);
  if (!mine.length) return 'ok';
  if (mine.some(a => a.nivel === 'CRITICA')) return 'err';
  return 'warn';
}

const DOT_COLOR = { ok: '#00e87a', warn: '#f5a623', err: '#ff3d5a' };

const COMP_ORDER = [
  'bomba_captacao','reja_tamiz','coagulacion','decantador',
  'filtracion','desinfeccion','reservorio','bomba_distribucion',
];

function fmt(val) {
  if (val == null || (typeof val === 'number' && isNaN(val))) return '—';
  if (typeof val === 'number') return val.toFixed(2);
  return String(val);
}

export default function ReadingsBar({ estado, alertas = [] }) {
  const { t } = useLanguage();

  return (
    <div className={s.bar}>
      {COMP_ORDER.map(id => {
        // datos están en estado.componentes[id].valores
        const comp = estado?.componentes?.[id];
        const state = getState(id, alertas);
        const valores = comp?.valores ?? {};
        const mainKey = MAIN_KEY[id];
        const mainVal = valores[mainKey];
        const max = MAIN_MAX[id] || 100;
        const pct = mainVal != null ? Math.min(100, (mainVal / max) * 100) : 0;
        const fields = FIELDS[id] ?? Object.keys(valores);

        return (
          <div key={id} className={`${s.cell} ${s[state]}`}>
            <div className={s.cellHeader}>
              <span className={s.name}>{t('synoptic_label_' + id)}</span>
              <span className={s.dot} style={{ background: DOT_COLOR[state] }} />
            </div>
            <div className={s.rows}>
              {fields.map(k => {
                const v = valores[k];
                const unit = UNITS[k] ?? '';
                const display = v != null ? `${fmt(v)} ${unit}`.trim() : '—';
                return (
                  <div key={k} className={`${s.row} ${k === mainKey && state !== 'ok' ? s.alert : ''}`}>
                    <span className={s.key}>{t('param_' + k)}</span>
                    <span className={s.val}>{display}</span>
                  </div>
                );
              })}
            </div>
            <div className={s.progress}>
              <div className={s.progressFill} style={{ width: `${pct}%`, background: DOT_COLOR[state] }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
