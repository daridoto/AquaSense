# aquasense-python

Motor de simulación hidráulica para **AquaSense**. Genera datos de sensores realistas para un ciclo de tratamiento de agua y los envía al *backend* cada 5 segundos.

> **Módulos:** [aquasense-frontend](../aquasense-frontend) (React) · [aquasense-backend](../aquasense-backend) (API REST) · **aquasense-python** (este)

---

## Qué hace este módulo

- Simula lecturas de sensores para 8 componentes de la planta con valores físicamente plausibles
- Detecta valores fuera de rango y establece indicadores de automatización
- Envía las lecturas al *backend* mediante `POST /interno/proyectos/:id/lecturas` (sin JWT)
- Envía datos hidráulicos por tubería mediante `POST /interno/proyectos/:id/tuberias/:tid/lecturas`
- Almacena en caché los datos de tuberías durante 60 segundos para evitar recálculos redundantes

---

## Descripción de archivos

| Archivo | Función |
|---|---|
| `config.py` | Rangos de valores iniciales, umbrales de alerta y configuración general |
| `simulator.py` | Genera y actualiza el estado de los 8 componentes |
| `automation.py` | Detecta valores fuera de rango y añade indicadores de automatización |
| `tuberias.py` | Calcula los datos hidráulicos por tubería (caudal, pérdida de presión) |
| `client.py` | Envía las cargas útiles al *backend* mediante POST |
| `main.py` | Bucle principal — orquesta el ciclo completo cada 5 segundos |

---

## Componentes simulados

| ID de componente | Parámetros principales |
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

## Ejecución local

### Requisitos previos

- Python 3.11+
- *Backend* ejecutándose en `http://localhost:8080`

### Configuración y ejecución

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
python main.py
```

Si el *backend* no es accesible, las lecturas se imprimen en stdout en lugar de enviarse.

---

## Variables de entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `BACKEND_URL` | URL base del *backend* | `http://localhost:8080` |
| `X_INTERNAL_TOKEN` | Token de autenticación interno (debe coincidir con el *backend*) | — |
| `PROJECT_ID` | ID del proyecto a simular (modo heredado de proyecto único) | `1` |

El valor de `X_INTERNAL_TOKEN` debe coincidir con el establecido en el `.env` del *backend*. El *backend* lo valida en cada petición a `/interno/**`.
