# AquaSense

Plataforma SaaS para la monitorización en tiempo real y la automatización de plantas de tratamiento de agua.

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (browser)                            │
│                                                                      │
│   React 18 + Vite (:5173)                                           │
│   ┌──────────────┐  ┌───────────────┐  ┌────────────────────────┐  │
│   │  /projects   │  │   Synoptic    │  │  History / Alerts      │  │
│   │  (list +     │  │  CanvasEditor │  │  Chart.js              │  │
│   │   create)    │  │  ISA 5.1 SVG  │  │                        │  │
│   └──────┬───────┘  └──────┬────────┘  └──────────┬─────────────┘  │
│          │                 │ polling /estado 5s    │               │
└──────────┼─────────────────┼──────────────────────┼───────────────┘
           │  JWT Bearer     │                      │
           ▼                 ▼                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND Spring Boot 3 (:8080)                    │
│                                                                      │
│  /auth/**          → JWT authentication (8h tokens)                 │
│  /api/proyectos/** → project CRUD, state, layout, alerts            │
│  /api/proyectos/:id/tuberias/** → synoptic pipe CRUD                │
│  /interno/**       → no CORS, no JWT (Python engine only)           │
│                                                                      │
│  ┌─────────────┐   ┌──────────────┐   ┌────────────────────────┐   │
│  │  Spring Sec │   │   JPA/Hiber  │   │   H2 (dev)             │   │
│  │  JWT Filter │   │   Entities   │   │   PostgreSQL (prod)     │   │
│  └─────────────┘   └──────────────┘   └────────────────────────┘   │
└──────────────────────────────────────┬──────────────────────────────┘
                                       │ POST /interno/:id/lecturas
                                       │ POST /interno/:id/tuberias/:tid/lecturas
                                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SIMULATOR Python 3.11                             │
│                                                                      │
│  main.py — loop every 5s                                            │
│  ├── simulator.py   — 8 plant components + hydraulic parameters     │
│  └── tuberias.py    — hydraulic data per pipe (60s cache)           │
│                                                                      │
│  Publishes readings to /interno/** endpoints without JWT             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Inicio rápido (desarrollo local)

### Opción A — 3 comandos (sin Docker)

```bash
# 1. Backend
cd aquasense-backend && ./mvnw spring-boot:run

# 2. Frontend (nueva terminal)
cd aquasense-frontend && npm install && npm run dev

# 3. Simulador Python (nueva terminal)
cd python && pip install -r requirements.txt && python main.py
```

### Opción B — Docker Compose

```bash
cp .env.example .env
# Edita .env con tus valores
docker compose up --build
```

Servicios tras el arranque:
- *Frontend*: http://localhost:5173
- API del *backend*: http://localhost:8080
- Consola H2 (solo desarrollo): http://localhost:8080/h2-console

---

## Variables de entorno

### Raíz (`/.env`) — Docker Compose

| Variable | Descripción | Ejemplo |
|---|---|---|
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL (producción) | `change_me` |
| `DB_PASSWORD` | Igual — usada por el *backend* | `change_me` |
| `JWT_SECRET` | Clave de firma JWT (mín. 32 caracteres) | `change_me_min_32_characters_required` |
| `X_INTERNAL_TOKEN` | Token compartido para llamadas Python → *backend* | `change_me` |
| `FRONTEND_URL` | URL del *frontend* en producción | `https://aquasense.vercel.app` |
| `VITE_API_URL` | URL del *backend* para la compilación del *frontend* | `https://api.aquasense.app` |

### *Frontend* (`/aquasense-frontend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base del *backend* | `http://localhost:8080` |

### *Backend* (`/aquasense-backend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `JWT_SECRET` | Clave de firma JWT | `change_me_in_production` |
| `JWT_EXPIRATION` | Duración del token en ms (por defecto: 8 h) | `28800000` |

### Simulador (`/python/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `BACKEND_URL` | URL del *backend* | `http://localhost:8080` |
| `X_INTERNAL_TOKEN` | Token interno (debe coincidir con el *backend*) | `change_me` |
| `PROJECT_ID` | ID del proyecto a simular (modo heredado) | `1` |

Copia los ejemplos: `cp .env.example .env` en cada carpeta. **Los archivos `.env` no deben confirmarse nunca en el repositorio.**

---

## Credenciales de demostración

Se crean automáticamente un usuario de demostración y un proyecto de ejemplo en el primer arranque del *backend*:

| Campo | Valor |
|---|---|
| Email | `admin@aquasense.com` |
| Contraseña | `password` |

---

## Flujo de autenticación

1. `POST /auth/register` — crea una cuenta (nombre, email, contraseña, idioma)
2. `POST /auth/login` → devuelve un JWT válido durante 8 horas
3. El token se almacena en `localStorage["aquasense_token"]`
4. Todas las llamadas a la API incluyen `Authorization: Bearer <token>`
5. `POST /auth/logout` — invalida el token en el servidor

---

## Componentes ISA 5.1

El editor de sinópticos incluye una paleta de más de 40 componentes con iconos SVG basados en la norma ISA 5.1-2009. Consulta [docs/isa-symbology.md](docs/isa-symbology.md) para ver el mapeo completo de símbolos.

---

## Decisiones de HMI (ISA 101)

Consulta [docs/hmi-decisions.md](docs/hmi-decisions.md) para:
- Jerarquía de alarmas (crítica / advertencia / normal)
- Paleta de colores y conformidad con ISA 101
- Justificación del intervalo de *polling* de 5 segundos
- Decisiones de diseño del sinóptico

---

## *Stack* tecnológico

| Capa | Tecnología |
|---|---|
| *Frontend* | React 18, Vite, React Router v6, Axios, Chart.js |
| *Backend* | Spring Boot 3, Java 21, Spring Security + JWT, JPA/Hibernate |
| Base de datos | H2 (desarrollo) / PostgreSQL (producción) |
| Simulación | Python 3.11, requests |
| Despliegue | Vercel (*frontend*) + Railway (*backend* + Python) |

---

## Estructura del repositorio

| Carpeta | Descripción |
|---|---|
| `aquasense-frontend/` | React 18 + Vite, puerto 5173 |
| `aquasense-backend/` | Spring Boot 3 + JWT, puerto 8080 |
| `python/` | Motor de simulación hidráulica |
| `.` (raíz) | docker-compose.yml, .env.example, documentación |

---

## Documentación técnica

| Archivo | Contenido |
|---|---|
| [docs/isa-symbology.md](docs/isa-symbology.md) | Mapeo de más de 40 componentes a símbolos ISA 5.1 |
| [docs/hmi-decisions.md](docs/hmi-decisions.md) | Decisiones de HMI según ISA 101, jerarquía de alarmas, paleta de colores |
