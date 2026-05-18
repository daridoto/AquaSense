import os
import time
import requests

from config import INTERVALO_CICLO, URL_BACKEND
from simulator import inicializar_estado, actualizar_estado
from automation import validacion
from client import enviar_para_projeto
from tuberias import simular_ciclo_tuberias

BACKEND_URL = os.getenv("BACKEND_URL", URL_BACKEND)
INTERVALO_POLL = 10  # segundos entre verificações de projetos ativos
INTERVALO_MODOS = 5  # segundos entre refrescamento dos modos AUTO/MANUAL


def _get_headers():
    """Devolve headers com o token interno, ou {} se a variável não estiver definida."""
    token = os.environ.get("X_INTERNAL_TOKEN")
    if not token:
        return {}
    return {"X-Internal-Token": token}


def get_active_projects():
    """Pergunta ao backend quais projetos têm simulacaoAtiva = true."""
    try:
        res = requests.get(
            f"{BACKEND_URL}/interno/simulacao/projetos-ativos",
            headers=_get_headers(),
            timeout=5,
        )
        if res.status_code == 200:
            return res.json()  # lista de IDs de projeto
        return []
    except Exception:
        return []


def get_modos_componentes(project_id):
    """
    Consulta os modos (AUTO|MANUAL) de cada componente do projeto.
    Devolve dicionário: { "bomba_captacao": "AUTO", "reservorio": "MANUAL", ... }
    Em caso de erro, devolve dicionário vazio (todos tratados como AUTO).
    """
    try:
        res = requests.get(
            f"{BACKEND_URL}/interno/simulacao/projetos/{project_id}/modos",
            headers=_get_headers(),
            timeout=4,
        )
        if res.status_code == 200:
            return res.json()
        return {}
    except Exception:
        return {}


def main():
    # Aviso de arranque se o token não estiver configurado
    if not os.environ.get("X_INTERNAL_TOKEN"):
        print("[main] WARNING: X_INTERNAL_TOKEN não definido — "
              "envio de leituras ao backend ficará desativado até a variável ser configurada.")

    # Estado por projeto: { project_id: estado_dict }
    estados = {}
    last_poll = 0
    active_ids = []
    # Cache de tubulações: { project_id: { "tuberias": [...], "ts": float } }
    cache_tuberias = {}
    # Modos por projeto: { project_id: { componente_id: "AUTO"|"MANUAL" } }
    modos_por_projeto = {}
    last_modos_refresh = {}

    print(f"[main] Motor de simulação iniciado. Backend: {BACKEND_URL}")

    while True:
        now = time.time()

        # Re-poll de projetos ativos a cada INTERVALO_POLL segundos
        if now - last_poll >= INTERVALO_POLL:
            new_active = get_active_projects()
            if set(new_active) != set(active_ids):
                added = set(new_active) - set(active_ids)
                removed = set(active_ids) - set(new_active)
                for pid in added:
                    print(f"[main] Projeto {pid} ativado — a inicializar estado")
                    estados[pid] = inicializar_estado()
                    modos_por_projeto[pid] = get_modos_componentes(pid)
                    last_modos_refresh[pid] = now
                for pid in removed:
                    print(f"[main] Projeto {pid} desativado — a parar")
                    estados.pop(pid, None)
                    modos_por_projeto.pop(pid, None)
                    last_modos_refresh.pop(pid, None)
                active_ids = new_active
            last_poll = now

        # Envia um ciclo de leituras para cada projeto ativo
        for project_id in list(active_ids):
            if project_id not in estados:
                estados[project_id] = inicializar_estado()

            # Refresca modos a cada INTERVALO_MODOS segundos
            if now - last_modos_refresh.get(project_id, 0) >= INTERVALO_MODOS:
                modos = get_modos_componentes(project_id)
                if modos:
                    modos_por_projeto[project_id] = modos
                last_modos_refresh[project_id] = now

            modos = modos_por_projeto.get(project_id, {})

            # Componentes em modo MANUAL: o simulador não envia leituras automáticas
            manuais = {comp for comp, modo in modos.items() if modo == "MANUAL"}
            if manuais:
                print(f"[main] Projeto {project_id} — componentes em MANUAL (sem envio AUTO): {manuais}")

            estados[project_id] = actualizar_estado(estados[project_id])
            estado_validado = validacion(estados[project_id])

            # Envia leituras, passando a lista de componentes a ignorar (MANUAL)
            enviar_para_projeto(estado_validado, project_id, modos_manual=manuais)

            # Simula e envia leituras hidráulicas de tubulações (falha silenciosa)
            simular_ciclo_tuberias(project_id, estados[project_id], cache_tuberias)

        time.sleep(INTERVALO_CICLO)


main()
