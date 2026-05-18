# aquasense-python

Hydraulic simulation engine for **AquaSense**. Generates realistic sensor data for a water treatment cycle and pushes it to the backend every 5 seconds.

> **Modules:** [aquasense-frontend](../aquasense-frontend) (React) · [aquasense-backend](../aquasense-backend) (REST API) · **aquasense-python** (this)

---

## What this module does

- Simulates sensor readings for 8 plant components with physically plausible values
- Detects out-of-range values and sets automation flags
- Pushes readings to the backend via `POST /interno/proyectos/:id/lecturas` (no JWT required)
- Pushes hydraulic data per pipe via `POST /interno/proyectos/:id/tuberias/:tid/lecturas`
- Caches pipe data for 60 seconds to avoid redundant recalculation

---

## File overview

| File | Role |
|---|---|
| `config.py` | Initial value ranges, alert thresholds, and general settings |
| `simulator.py` | Generates and updates state for all 8 components |
| `automation.py` | Detects out-of-range values and adds automation flags |
| `tuberias.py` | Computes hydraulic data per pipe (flow, pressure drop) |
| `client.py` | Sends payloads to the backend via POST |
| `main.py` | Main loop — orchestrates the full cycle every 5 seconds |

---

## Simulated components

| Component ID | Key parameters |
|---|---|
| `bomba_captacao` | `caudal`, `presionSuccion`, `temperaturaMotor` |
| `reja_tamiz` | `diferencialPresion`, `turbidezEntrada` |
| `coagulacion` | `phPostCoagulacion`, `turbidezSalida`, `nivelTanquePAC`, `caudalDosificacion` |
| `decantador` | `turbidezSalida`, `nivelLodo`, `caudalSalida` |
| `filtracion` | `turbidezSalida`, `perdidaCarga`, `horasDesdelavado` |
| `desinfeccion` | `cloroResidual`, `ph`, `orp`, `nivelTanqueCloro` |
| `reservorio` | `nivel`, `cloroResidual`, `temperatura`, `turbidez` |
| `bomba_distribucion` | `presionSalida`, `caudal`, `corrienteMotor` |

---

## Running locally

### Prerequisites

- Python 3.11+
- Backend running on `http://localhost:8080`

### Setup and run

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
python main.py
```

If the backend is not reachable, readings are printed to stdout instead of being sent.

---

## Environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `BACKEND_URL` | Backend base URL | `http://localhost:8080` |
| `X_INTERNAL_TOKEN` | Internal auth token (must match backend) | — |
| `PROJECT_ID` | Project ID to simulate (legacy single-project mode) | `1` |

The `X_INTERNAL_TOKEN` must match the value set in the backend `.env`. The backend validates it on every `/interno/**` request.
