"""
Módulo de simulación hidráulica de tuberías.

Consulta las tuberías de cada proyecto y envía LecturaTuberia en cada ciclo.
Falla silenciosamente si el endpoint no está disponible.
"""

import math
import os
import random
import time

import requests

from config import URL_BACKEND

_BACKEND_URL = os.getenv("BACKEND_URL", URL_BACKEND)


def _get_headers():
    """Devuelve headers con el token interno, o {} si la variable no está definida."""
    token = os.environ.get("X_INTERNAL_TOKEN")
    if not token:
        return {}
    return {"X-Internal-Token": token}

# Componentes que tienen lecturas de caudal relevantes para tuberías adyacentes
# Mapeo: clave Python (simulator.py) -> nombre mostrado en el log
_CAUDAL_POR_COMPONENTE = {
    "bombaCaptacao":    "caudal",
    "decantador":       "caudalSalida",
    "bombaDistribucion": "caudal",
}

# Diámetro interno estándar de las tuberías (metros) cuando no especificado por el backend
_DIAMETRO_DEFAULT_M = 0.2


def _caudal_medio_m3h(estado: dict) -> float:
    """
    Calcula el caudal medio en m³/h en base a los componentes que tienen sensores de caudal.
    Convierte a m³/s internamente para los cálculos hidráulicos.
    """
    valores = []
    for comp_key, sensor_key in _CAUDAL_POR_COMPONENTE.items():
        comp_data = estado.get(comp_key, {})
        val = comp_data.get(sensor_key)
        if val is not None:
            valores.append(float(val))
    if not valores:
        return 12.0  # valor de fallback razonable
    return sum(valores) / len(valores)


def _calcular_leitura_hidraulica(tuberia: dict, estado: dict) -> dict:
    """
    Calcula los datos hidráulicos de una tubería en base al estado de los componentes.

    Fórmulas:
    - caudal: media de los caudales adyacentes + ruido ±2%
    - velocidad: Q / A  (ecuación de continuidad),  A = π*(d/2)²
    - pérdida de presión: K * L * v²  (simplificado, sin Darcy-Weisbach completo)
    - presión entrada y salida: basadas en presionSuccion de la bomba y la pérdida calculada

    Args:
        tuberia: dict con campos del backend (id, diametroM, comprimentoM, etc.)
        estado: estado actual de los sensores del simulador

    Returns:
        dict compatible con LecturaTuberia: caudalM3h, presionBarEntrada,
        presionBarSaida, velocidadMs
    """
    diametro_m = float(tuberia.get("diametroM") or _DIAMETRO_DEFAULT_M)
    comprimento_m = float(tuberia.get("comprimentoM") or 50.0)

    # ── Caudal ────────────────────────────────────────────────────────────────
    caudal_m3h = _caudal_medio_m3h(estado)
    # Ruido gaussiano ±2% para realismo
    caudal_m3h *= 1.0 + random.gauss(0, 0.02 / 3)  # 3-sigma = 2%
    caudal_m3h = max(0.5, round(caudal_m3h, 3))

    # ── Velocidad (ecuación de continuidad) ───────────────────────────────────
    # Q (m³/s) = caudal_m3h / 3600
    # A (m²)   = π * (d/2)²
    # v (m/s)  = Q / A
    caudal_m3s = caudal_m3h / 3600.0
    area_m2 = math.pi * (diametro_m / 2.0) ** 2
    if area_m2 > 0:
        velocidade_ms = caudal_m3s / area_m2
    else:
        velocidade_ms = 0.0
    velocidade_ms = round(max(0.0, velocidade_ms), 3)

    # ── Presión de entrada (referencia: presionSuccion de la bomba de captación) ─
    presion_succao = float(
        estado.get("bombaCaptacao", {}).get("presionSuccion", 1.5)
    )
    # Ruido ±2%
    presion_entrada = presion_succao * (1.0 + random.gauss(0, 0.02 / 3))
    presion_entrada = round(max(0.1, presion_entrada), 3)

    # ── Pérdida de presión (Darcy-Weisbach simplificado) ─────────────────────
    # ΔP_bar ≈ K * L * v²    donde K = 0.002 bar·s²/(m³) — coeficiente empírico
    K = 0.002
    delta_p = K * comprimento_m * (velocidade_ms ** 2)
    # Ruido ±2%
    delta_p *= 1.0 + random.gauss(0, 0.02 / 3)
    delta_p = max(0.0, delta_p)

    presion_saida = round(max(0.05, presion_entrada - delta_p), 3)

    return {
        "caudalM3h":         caudal_m3h,
        "presionBarEntrada": presion_entrada,
        "presionBarSaida":   presion_saida,
        "velocidadMs":       velocidade_ms,
    }


def obter_tuberias(project_id) -> list:
    """
    Consulta las tuberías de un proyecto vía endpoint interno del backend.
    Retorna lista vacía y registra WARN si el endpoint no está disponible.
    """
    url = f"{_BACKEND_URL}/interno/proyectos/{project_id}/tuberias"
    try:
        res = requests.get(url, headers=_get_headers(), timeout=5)
        if res.status_code == 200:
            dados = res.json()
            if isinstance(dados, list):
                return dados
            return []
        if res.status_code == 404:
            # Endpoint aún no implementado — fallo silencioso
            return []
        print(f"[tuberias] WARN proj {project_id}: GET tuberias -> HTTP {res.status_code}")
        return []
    except requests.exceptions.ConnectionError:
        # Backend no disponible — se reintentará en el próximo ciclo
        return []
    except Exception as e:
        print(f"[tuberias] WARN proj {project_id}: erro ao consultar tuberias: {e}")
        return []


def enviar_leitura_tuberia(project_id, tuberia_id, payload: dict) -> bool:
    """
    Envía una LecturaTuberia al backend.
    Retorna True si enviada con éxito, False en caso contrario.
    """
    url = f"{_BACKEND_URL}/interno/proyectos/{project_id}/tuberias/{tuberia_id}/lecturas"
    try:
        r = requests.post(url, json=payload, headers=_get_headers(), timeout=4)
        if r.status_code in (200, 201):
            return True
        print(
            f"[tuberias] WARN proj {project_id} tuberia {tuberia_id} "
            f"-> HTTP {r.status_code}: {r.text[:120]}"
        )
        return False
    except requests.exceptions.ConnectionError:
        print(f"[tuberias] WARN proj {project_id} tuberia {tuberia_id}: backend não disponível")
        return False
    except Exception as e:
        print(f"[tuberias] WARN proj {project_id} tuberia {tuberia_id}: {e}")
        return False


def simular_ciclo_tuberias(project_id, estado: dict, cache_tuberias: dict) -> None:
    """
    Punto de entrada principal para un ciclo de simulación de tuberías.

    Consulta las tuberías (con caché por proyecto), calcula datos hidráulicos
    y envía LecturaTuberia para cada tubería. Los fallos individuales no
    interrumpen el ciclo — el loop principal continúa a 5s.

    Args:
        project_id: ID del proyecto activo
        estado: estado actual de los sensores (salida de actualizar_estado)
        cache_tuberias: dict mutable { project_id: { "tuberias": [...], "ts": float } }
                        compartido entre ciclos para evitar polling excesivo
    """
    # Caché de tuberías con TTL de 60s para no sobrecargar el backend
    CACHE_TTL = 60.0
    now = time.time()
    entrada_cache = cache_tuberias.get(project_id)

    if entrada_cache is None or (now - entrada_cache["ts"]) >= CACHE_TTL:
        tuberias = obter_tuberias(project_id)
        cache_tuberias[project_id] = {"tuberias": tuberias, "ts": now}
    else:
        tuberias = entrada_cache["tuberias"]

    if not tuberias:
        return  # sin tuberías — continúa silenciosamente

    for tuberia in tuberias:
        tuberia_id = tuberia.get("id")
        if tuberia_id is None:
            continue

        try:
            payload = _calcular_leitura_hidraulica(tuberia, estado)
            enviado = enviar_leitura_tuberia(project_id, tuberia_id, payload)
            if enviado:
                print(
                    f"[tuberias] proj {project_id} tuberia {tuberia_id}: "
                    f"caudal={payload['caudalM3h']} m³/h "
                    f"vel={payload['velocidadMs']} m/s "
                    f"ΔP={round(payload['presionBarEntrada'] - payload['presionBarSaida'], 3)} bar"
                )
        except Exception as e:
            # Nunca dejar que una tubería rompa el ciclo entero
            print(f"[tuberias] WARN proj {project_id} tuberia {tuberia_id}: erro no cálculo: {e}")
