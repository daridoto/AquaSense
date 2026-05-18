"""
Módulo de simulação hidráulica de tubulações.

Consulta as tubulações de cada projeto e envia LecturaTuberia a cada ciclo.
Falha silenciosamente se o endpoint não estiver disponível.
"""

import math
import os
import random
import time

import requests

from config import URL_BACKEND

_BACKEND_URL = os.getenv("BACKEND_URL", URL_BACKEND)


def _get_headers():
    """Devolve headers com o token interno, ou {} se a variável não estiver definida."""
    token = os.environ.get("X_INTERNAL_TOKEN")
    if not token:
        return {}
    return {"X-Internal-Token": token}

# Componentes que têm leituras de caudal relevantes para tubulações adjacentes
# Mapeamento: chave Python (simulator.py) -> nome exibido no log
_CAUDAL_POR_COMPONENTE = {
    "bombaCaptacao":    "caudal",
    "decantador":       "caudalSalida",
    "bombaDistribucion": "caudal",
}

# Diâmetro interno padrão das tubulações (metros) quando não especificado pelo backend
_DIAMETRO_DEFAULT_M = 0.2


def _caudal_medio_m3h(estado: dict) -> float:
    """
    Calcula o caudal médio em m³/h com base nos componentes que têm sensores de caudal.
    Converte para m³/s internamente para os cálculos hidráulicos.
    """
    valores = []
    for comp_key, sensor_key in _CAUDAL_POR_COMPONENTE.items():
        comp_data = estado.get(comp_key, {})
        val = comp_data.get(sensor_key)
        if val is not None:
            valores.append(float(val))
    if not valores:
        return 12.0  # valor de fallback razoável
    return sum(valores) / len(valores)


def _calcular_leitura_hidraulica(tuberia: dict, estado: dict) -> dict:
    """
    Calcula os dados hidráulicos de uma tubulação com base no estado dos componentes.

    Fórmulas:
    - caudal: média dos caudais adjacentes + ruído ±2%
    - velocidade: Q / A  (equação de continuidade),  A = π*(d/2)²
    - perda de pressão: K * L * v²  (simplificado, sem Darcy-Weisbach completo)
    - pressão entrada e saída: baseadas na presionSuccion da bomba e na perda calculada

    Args:
        tuberia: dict com campos do backend (id, diametroM, comprimentoM, etc.)
        estado: estado actual dos sensores do simulador

    Returns:
        dict compatível com LecturaTuberia: caudalM3h, presionBarEntrada,
        presionBarSaida, velocidadMs
    """
    diametro_m = float(tuberia.get("diametroM") or _DIAMETRO_DEFAULT_M)
    comprimento_m = float(tuberia.get("comprimentoM") or 50.0)

    # ── Caudal ────────────────────────────────────────────────────────────────
    caudal_m3h = _caudal_medio_m3h(estado)
    # Ruído gaussiano ±2% para realismo
    caudal_m3h *= 1.0 + random.gauss(0, 0.02 / 3)  # 3-sigma = 2%
    caudal_m3h = max(0.5, round(caudal_m3h, 3))

    # ── Velocidade (equação de continuidade) ──────────────────────────────────
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

    # ── Pressão de entrada (referência: presionSuccion da bomba de captação) ──
    presion_succao = float(
        estado.get("bombaCaptacao", {}).get("presionSuccion", 1.5)
    )
    # Ruído ±2%
    presion_entrada = presion_succao * (1.0 + random.gauss(0, 0.02 / 3))
    presion_entrada = round(max(0.1, presion_entrada), 3)

    # ── Perda de pressão (Darcy-Weisbach simplificado) ────────────────────────
    # ΔP_bar ≈ K * L * v²    onde K = 0.002 bar·s²/(m³) — coeficiente empírico
    K = 0.002
    delta_p = K * comprimento_m * (velocidade_ms ** 2)
    # Ruído ±2%
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
    Consulta as tubulações de um projeto via endpoint interno do backend.
    Retorna lista vazia e regista WARN se o endpoint não estiver disponível.
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
            # Endpoint ainda não implementado — falha silenciosa
            return []
        print(f"[tuberias] WARN proj {project_id}: GET tuberias -> HTTP {res.status_code}")
        return []
    except requests.exceptions.ConnectionError:
        # Backend não disponível — será retentado no próximo ciclo
        return []
    except Exception as e:
        print(f"[tuberias] WARN proj {project_id}: erro ao consultar tuberias: {e}")
        return []


def enviar_leitura_tuberia(project_id, tuberia_id, payload: dict) -> bool:
    """
    Envia uma LecturaTuberia ao backend.
    Retorna True se enviada com sucesso, False caso contrário.
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
    Ponto de entrada principal para um ciclo de simulação de tubulações.

    Consulta as tubulações (com cache por projeto), calcula dados hidráulicos
    e envia LecturaTuberia para cada tubulação. Falhas individuais não
    interrompem o ciclo — loop principal continua a 5s.

    Args:
        project_id: ID do projeto ativo
        estado: estado atual dos sensores (saída de actualizar_estado)
        cache_tuberias: dict mutável { project_id: { "tuberias": [...], "ts": float } }
                        partilhado entre ciclos para evitar polling excessivo
    """
    # Cache de tubulações com TTL de 60s para não sobrecarregar o backend
    CACHE_TTL = 60.0
    now = time.time()
    entrada_cache = cache_tuberias.get(project_id)

    if entrada_cache is None or (now - entrada_cache["ts"]) >= CACHE_TTL:
        tuberias = obter_tuberias(project_id)
        cache_tuberias[project_id] = {"tuberias": tuberias, "ts": now}
    else:
        tuberias = entrada_cache["tuberias"]

    if not tuberias:
        return  # sem tubulações — continua silenciosamente

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
            # Nunca deixar uma tubulação quebrar o ciclo inteiro
            print(f"[tuberias] WARN proj {project_id} tuberia {tuberia_id}: erro no cálculo: {e}")
