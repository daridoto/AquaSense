# Simulador de planta de tratamento de água com drift gradual.
# Cada sensor tem um valor actual que muda suavemente a cada ciclo.
# Os valores não saltam aleatoriamente — derivam devagar como um sistema físico real.

import random


class SensorSimulator:
    """Mantém o estado de um sensor e aplica pequenas variações incrementais."""

    def __init__(self, base, min_val, max_val, drift_rate=0.02, noise=0.005):
        self.value = base
        self.min = min_val
        self.max = max_val
        self.drift_rate = drift_rate   # variação máxima por ciclo como fracção do range
        self.noise = noise             # ruído estocástico mínimo

    def next(self):
        range_size = self.max - self.min
        drift = (random.random() - 0.5) * self.drift_rate * range_size
        noise = (random.random() - 0.5) * self.noise * range_size
        self.value = max(self.min, min(self.max, self.value + drift + noise))
        return round(self.value, 3)

    def push_toward(self, target, step_fraction=0.1):
        """Move o valor gradualmente em direcção a um alvo (para anomalias)."""
        self.value += (target - self.value) * step_fraction
        self.value = max(self.min, min(self.max, self.value))
        return round(self.value, 3)


# ── Definição dos sensores ────────────────────────────────────────────────────
# Chaves em camelCase para compatibilidade com client.py

_sensors = {
    "bombaCaptacao": {
        "caudal":           SensorSimulator(12.0, 8.0,  16.0, 0.01, 0.002),
        "presionSuccion":   SensorSimulator(1.5,  0.8,  2.5,  0.01, 0.002),
        "temperaturaMotor": SensorSimulator(45.0, 35.0, 65.0, 0.005, 0.001),
    },
    "rejaTamiz": {
        "diferencialPresion": SensorSimulator(0.3, 0.1, 0.8, 0.02, 0.005),
        "turbidezEntrada":    SensorSimulator(25.0, 10.0, 60.0, 0.015, 0.003),
    },
    "coagulacion": {
        "phPostCoagulacion":  SensorSimulator(6.8, 6.0, 7.5, 0.008, 0.002),
        "turbidezSalida":     SensorSimulator(5.0, 1.0, 15.0, 0.012, 0.003),
        "nivelTanquePAC":     SensorSimulator(60.0, 20.0, 95.0, 0.003, 0.001),
        "caudalDosificacion": SensorSimulator(2.5, 1.0, 5.0, 0.008, 0.002),
    },
    "decantador": {
        "turbidezSalida": SensorSimulator(3.0, 0.5, 10.0, 0.01, 0.002),
        "nivelLodo":      SensorSimulator(40.0, 20.0, 80.0, 0.005, 0.001),
        "caudalSalida":   SensorSimulator(11.0, 7.0, 15.0, 0.008, 0.002),
    },
    "filtracion": {
        "turbidezSalida":   SensorSimulator(0.8, 0.1, 3.0, 0.01, 0.002),
        "perdidaCarga":     SensorSimulator(0.9, 0.2, 2.5, 0.008, 0.002),
        "horasDesdelavado": SensorSimulator(6.0, 0.0, 24.0, 0.004, 0.0),
    },
    "desinfeccion": {
        "cloroResidual":    SensorSimulator(0.8, 0.3, 1.5, 0.01, 0.002),
        "ph":               SensorSimulator(7.0, 6.0, 7.8, 0.006, 0.001),   # min=6.0 permite anomalias abaixo de 6.5
        "orp":              SensorSimulator(700, 600, 800, 0.008, 0.002),
        "nivelTanqueCloro": SensorSimulator(60.0, 10.0, 95.0, 0.003, 0.0),
    },
    "reservorio": {
        "nivel":         SensorSimulator(50.0, 20.0, 98.0, 0.004, 0.001),   # max=98 permite anomalias acima de 90
        "cloroResidual": SensorSimulator(0.6, 0.2, 1.2, 0.008, 0.002),
        "temperatura":   SensorSimulator(18.0, 10.0, 28.0, 0.003, 0.001),
        "turbidez":      SensorSimulator(0.5, 0.1, 2.0, 0.008, 0.002),
    },
    "bombaDistribucion": {
        "presionSalida":  SensorSimulator(3.5, 2.0, 5.0, 0.008, 0.002),
        "caudal":         SensorSimulator(10.0, 6.0, 14.0, 0.01, 0.002),
        "corrienteMotor": SensorSimulator(55.0, 35.0, 75.0, 0.006, 0.001),
    },
}

# Grupos de actualização — simula que não tudo muda ao mesmo tempo
_UPDATE_GROUPS = [
    ["bombaCaptacao", "rejaTamiz"],           # caudal de entrada
    ["coagulacion", "decantador"],            # cadeia de tratamento
    ["filtracion", "desinfeccion"],           # pós-tratamento
    ["reservorio", "bombaDistribucion"],      # distribuição
]

# Anomalias programadas — eventos realistas que disparam alertas
_ANOMALIES = [
    # target abaixo de 0.5 dispara cloro_bajo (ADVERTENCIA) no AlertaService
    {"sensor": ("reservorio",    "cloroResidual"),     "target": 0.35, "duration": 6},
    # target acima de 0.5 dispara diferencial_alto (ADVERTENCIA)
    {"sensor": ("rejaTamiz",     "diferencialPresion"), "target": 0.70, "duration": 4},
    # target abaixo de 6.5 dispara ph_bajo (ADVERTENCIA) — sensor min=6.0
    {"sensor": ("desinfeccion",  "ph"),                "target": 6.20, "duration": 3},
    # target acima de 90 dispara nivel_alto (ADVERTENCIA) — sensor max=98
    {"sensor": ("reservorio",    "nivel"),             "target": 92.0, "duration": 8},
]

# Estado interno do ciclo de anomalia
_anomaly_state = {
    "next_in": random.randint(60, 120),  # ciclos até próxima anomalia
    "active": None,                      # anomalia activa actual
    "cycles_left": 0,                    # ciclos restantes na anomalia
    "recovering": False,
}


def _tick_anomaly(estado):
    """Gere o ciclo de anomalia: dispara, mantém e recupera."""
    a = _anomaly_state
    a["next_in"] -= 1

    if a["active"] is None and a["next_in"] <= 0:
        # Iniciar nova anomalia
        a["active"] = random.choice(_ANOMALIES)
        a["cycles_left"] = a["active"]["duration"]
        a["recovering"] = False
        a["next_in"] = random.randint(60, 120)
        print(f"[simulator] ANOMALIA: {a['active']['sensor']} -> {a['active']['target']}")

    if a["active"] is not None:
        comp_key, sensor_key = a["active"]["sensor"]
        target = a["active"]["target"]
        sensor_obj = _sensors[comp_key][sensor_key]

        if not a["recovering"]:
            sensor_obj.push_toward(target, step_fraction=0.15)
            a["cycles_left"] -= 1
            if a["cycles_left"] <= 0:
                a["recovering"] = True
        else:
            # Recupera em direcção ao centro do range
            mid = (sensor_obj.min + sensor_obj.max) / 2
            sensor_obj.push_toward(mid, step_fraction=0.05)
            # Considera recuperado quando está a menos de 5% do range do centro
            if abs(sensor_obj.value - mid) < 0.05 * (sensor_obj.max - sensor_obj.min):
                a["active"] = None
                a["recovering"] = False


def inicializar_estado() -> dict:
    """Retorna o estado actual (os sensores já estão inicializados no módulo)."""
    return {comp: {k: s.next() for k, s in sensors.items()}
            for comp, sensors in _sensors.items()}


def actualizar_estado(estado) -> dict:
    """
    Actualiza um subconjunto de grupos de sensores por ciclo.
    Simula que não tudo muda simultaneamente.
    Aplica anomalias quando programadas.
    """
    # Escolher 1-2 grupos para actualizar neste ciclo
    groups_to_update = random.sample(_UPDATE_GROUPS, k=random.randint(1, 2))
    comps_to_update = {comp for group in groups_to_update for comp in group}

    estado_novo = {}
    for comp, sensors in _sensors.items():
        if comp in comps_to_update:
            estado_novo[comp] = {k: s.next() for k, s in sensors.items()}
        else:
            # Mantém valores do ciclo anterior
            estado_novo[comp] = estado.get(comp, {k: s.value for k, s in sensors.items()})

    # Tick de anomalias
    _tick_anomaly(estado_novo)

    return estado_novo
