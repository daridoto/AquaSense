import os
import time
import requests
from config import URL_BACKEND

# Respeta variable de entorno BACKEND_URL (Docker) o usa el default de config
_BACKEND_URL = os.getenv("BACKEND_URL", URL_BACKEND)

_MAX_RETRIES = 3
_RETRY_DELAYS = [1, 2, 4]  # segundos de espera con backoff exponencial

# Mapeo de claves Python -> IDs de componente del backend
_COMPONENTE_MAP = {
    "bombaCaptacao":     "bomba_captacao",
    "rejaTamiz":         "reja_tamiz",
    "coagulacion":       "coagulacion",
    "decantador":        "decantador",
    "filtracion":        "filtracion",
    "desinfeccion":      "desinfeccion",
    "reservorio":        "reservorio",
    "bombaDistribucion": "bomba_distribucion",
}

_cached_token = None


def get_internal_token():
    """Lee X_INTERNAL_TOKEN de forma lazy y hace caché tras la primera lectura válida.
    Lanza RuntimeError solo cuando se llama, nunca en el import."""
    global _cached_token
    if _cached_token:
        return _cached_token
    token = os.environ.get("X_INTERNAL_TOKEN")
    if not token:
        raise RuntimeError(
            "Variável de ambiente 'X_INTERNAL_TOKEN' não encontrada. "
            "Defina a variável antes de iniciar o simulador."
        )
    _cached_token = token
    return token


def enviar_para_projeto(estado_validado, project_id, modos_manual=None):
    """
    Envía una lectura por componente al backend para el proyecto indicado.
    La clave 'flags' es ignorada — el backend tiene su propio motor de alertas.

    modos_manual: conjunto (set) de componenteId que están en modo MANUAL.
    Los componentes presentes en este conjunto se omiten — el operador envió
    la lectura manualmente vía UI y el simulador no debe sobreescribir.
    """
    if modos_manual is None:
        modos_manual = set()

    try:
        token = get_internal_token()
    except RuntimeError as e:
        print(f"[client] WARN: {e} — ciclo de envio ignorado para proj {project_id}")
        return

    url = f"{_BACKEND_URL}/interno/proyectos/{project_id}/lecturas"

    for key_python, valores in estado_validado.items():
        if key_python == "flags":
            continue

        componente_id = _COMPONENTE_MAP.get(key_python)
        if componente_id is None:
            print(f"[client] componente desconocido ignorado: {key_python}")
            continue

        # Componente en modo MANUAL: el simulador no envía lecturas automáticas
        if componente_id in modos_manual:
            continue

        payload = {
            "componente": componente_id,
            "valores": valores,
            "origen": "AUTO",
        }

        for attempt in range(_MAX_RETRIES):
            try:
                r = requests.post(url, json=payload, timeout=4,
                                  headers={"X-Internal-Token": token})
                if r.status_code == 200:
                    break
                print(f"[client] {componente_id} (proj {project_id}) -> HTTP {r.status_code}: {r.text[:120]}")
                break
            except requests.exceptions.ConnectionError:
                if attempt < _MAX_RETRIES - 1:
                    time.sleep(_RETRY_DELAYS[attempt])
                else:
                    print(f"[client] backend indisponível após {_MAX_RETRIES} tentativas — {componente_id} não enviado")
            except Exception as e:
                print(f"[client] erro ao enviar {componente_id}: {e}")
                break


# Alias heredado para compatibilidad con código anterior
def enviar(estado_validado):
    from config import PROYECTO_ID
    enviar_para_projeto(estado_validado, PROYECTO_ID)
