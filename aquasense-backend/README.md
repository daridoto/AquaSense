# aquasense-backend

REST API backend for **AquaSense**, a water treatment plant monitoring SaaS platform. Built with Spring Boot 3 as part of a three-module final course project.

> **Modules:** [aquasense-frontend](../aquasense-frontend) (React) · **aquasense-backend** (this) · [aquasense-python](../aquasense-python) (simulation engine)

---

## What this module does

- JWT-based authentication (login / logout with token blacklisting)
- Project management — each authenticated user owns one or more ETAP projects
- Sensor reading persistence — stores timestamped readings for 8 plant components
- Alert engine — evaluates incoming readings against per-component thresholds, generates `ADVERTENCIA` / `CRITICA` alerts, fires automatic actions (e.g. `aumentarCloro`, `cerrarValvulaEntrada`, `dosificarNaOH`)
- Equipment control — accepts commands from the frontend and tracks component state
- Synoptic layout storage — persists arbitrary JSON layouts per project (used by the React canvas)
- Internal endpoint for the Python simulation engine — receives readings without CORS or JWT

---

## Tech stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.3.4 |
| Security | Spring Security 6 + jjwt 0.12.3 |
| Persistence | Spring Data JPA + Hibernate |
| Database (dev) | H2 in-memory |
| Boilerplate reduction | Lombok |
| Build | Maven (mvnw wrapper included) |

---

## Project structure

```
src/main/java/com/aquasense/backend/
│
├── config/
│   ├── SecurityConfig.java          # SecurityFilterChain, auth provider, password encoder
│   ├── CorsConfig.java              # CORS rules (localhost:5173 and localhost:3000 only)
│   └── JwtConfig.java               # Binds jwt.* properties from application.properties
│
├── controller/
│   ├── AuthController.java          # POST /auth/login, POST /auth/logout
│   ├── ProjetoController.java       # All /api/proyectos/** endpoints
│   └── LeituraController.java       # POST /interno/proyectos/:id/lecturas (Python only)
│
├── service/
│   ├── AuthService.java             # Login orchestration, logout (token invalidation)
│   ├── JwtService.java              # Token generation, validation, in-memory blacklist
│   ├── ProjetoService.java          # Project CRUD, estado, historico, layout, control
│   └── AlertaService.java           # Threshold evaluation, alert deduplication, auto-actions
│
├── model/
│   ├── Usuario.java                 # User entity
│   ├── Projeto.java                 # Project entity (stores layout as TEXT column)
│   ├── LeituraSensor.java           # Sensor reading entity (valores stored as JSON string)
│   ├── Alerta.java                  # Alert entity with level and optional auto-action
│   ├── Equipamento.java             # Equipment state per component per project
│   └── NivelAlerta.java             # Enum: ADVERTENCIA | CRITICA
│
├── repository/
│   ├── UsuarioRepository.java
│   ├── ProjetoRepository.java
│   ├── LeituraRepository.java       # Includes latest-per-component and range queries
│   ├── AlertaRepository.java        # Active-alert deduplication query
│   └── EquipamentoRepository.java
│
├── dto/
│   ├── LoginRequest.java            # { email, password }
│   ├── LoginResponse.java           # { token, expiresIn, usuario: { id, email, nombre } }
│   ├── ProjetoDTO.java
│   ├── LeituraDTO.java              # { componente, valores: Map<String,Double>, timestamp }
│   ├── AlertaDTO.java
│   └── EstadoDTO.java               # { componentes: Map<id, { valores, timestamp }> }
│
├── security/
│   ├── JwtFilter.java               # OncePerRequestFilter — extracts and validates Bearer token
│   └── UserDetailsServiceImpl.java  # Loads user by email for Spring Security
│
├── exception/
│   ├── ResourceNotFoundException.java
│   └── GlobalExceptionHandler.java  # Returns RFC 9457 ProblemDetail for all errors
│
├── DataInitializer.java             # Creates demo user + project on first startup
└── BackendApplication.java
```

---

## Running locally

### Prerequisites

- Java 21 (`java -version`)
- No Maven installation needed — the `mvnw` wrapper is included

### Start the server

**Windows:**
```cmd
.\mvnw.cmd spring-boot:run
```

**macOS / Linux:**
```bash
./mvnw spring-boot:run
```

The server starts on **http://localhost:8080** in ~6 seconds.

### H2 console

Available at **http://localhost:8080/h2-console**

| Field | Value |
|---|---|
| JDBC URL | `jdbc:h2:mem:aquasense` |
| User name | `sa` |
| Password | *(leave blank)* |

### Demo user

A user and a sample project are created automatically on startup:

| Field | Value |
|---|---|
| Email | `admin@aquasense.com` |
| Password | `password` |

---

## Environment variables

Copy `.env.example` to `.env` and set your values before deploying:

```bash
cp .env.example .env
```

`.env.example`:
```
JWT_SECRET=change_me_in_production
JWT_EXPIRATION=28800000
```

| Variable | Default (dev fallback) | Description |
|---|---|---|
| `JWT_SECRET` | `dev_secret_key_aquasense_...` | HMAC-SHA signing key. Must be ≥ 32 chars. **Change before any public deployment.** |
| `JWT_EXPIRATION` | `28800000` | Token lifetime in milliseconds (default: 8 hours) |

`application.properties` reads these via:
```properties
jwt.secret=${JWT_SECRET:dev_secret_key_aquasense_change_in_production_32chars}
jwt.expiration=28800000
```

---

## API endpoints

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Receives `{ email, password }`, returns `{ token, expiresIn: 28800, usuario }` |
| `POST` | `/auth/logout` | Public | Invalidates the current Bearer token (in-memory blacklist) |

### Projects

All project endpoints require `Authorization: Bearer <token>`. Every endpoint validates that the requested project belongs to the authenticated user.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/proyectos` | List all projects for the authenticated user |
| `POST` | `/api/proyectos` | Create a new project (auto-initialises equipment for all 8 components) |
| `GET` | `/api/proyectos/:id` | Project details |
| `GET` | `/api/proyectos/:id/estado` | Current state of all 8 components (latest reading per component) |
| `GET` | `/api/proyectos/:id/historico` | Reading history. Query params: `componente`, `desde` (ISO datetime), `hasta` (ISO datetime) |
| `GET` | `/api/proyectos/:id/alertas` | Alert list. Query param: `activas=true` to filter active alerts only |
| `POST` | `/api/proyectos/:id/control` | Send a command to a component: `{ componente, comando }` |
| `GET` | `/api/proyectos/:id/equipos` | Current equipment state for all components |
| `GET` | `/api/proyectos/:id/layout` | Retrieve the synoptic layout JSON |
| `POST` | `/api/proyectos/:id/layout` | Save the synoptic layout JSON |

### Internal (Python engine only)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/interno/proyectos/:id/lecturas` | None | Persist a sensor reading and trigger threshold evaluation |

Request body:
```json
{
  "componente": "desinfeccion",
  "valores": {
    "cloroResidual": 0.3,
    "ph": 6.8,
    "orp": 680,
    "nivelTanqueCloro": 75.0
  },
  "timestamp": "2024-06-01T10:00:00"
}
```

---

## Component IDs and fields

The 8 monitored components and their exact camelCase field names:

| Component ID | Fields |
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

## Alert engine

`AlertaService` evaluates every incoming reading against thresholds and persists alerts without duplicating already-active ones. Key rules:

| Condition | Level | Auto-action |
|---|---|---|
| `cloroResidual` < 0.5 mg/L | `ADVERTENCIA` | `aumentarCloro` |
| `cloroResidual` < 0.2 mg/L | `CRITICA` | `aumentarCloro` |
| `ph` < 6.0 | `CRITICA` | `dosificarNaOH` |
| `ph` < 6.5 | `ADVERTENCIA` | `dosificarNaOH` |
| `nivel` (reservorio) > 90% | `ADVERTENCIA` | `cerrarValvulaEntrada` |
| `nivel` (reservorio) > 95% | `CRITICA` | `cerrarValvulaEntrada` |
| `temperaturaMotor` > 70°C | `ADVERTENCIA` | — |
| `diferencialPresion` > 0.5 bar | `ADVERTENCIA` | — |

Auto-actions update the `Equipamento.estado` field for the affected component.

---

## CORS

Only the following origins are allowed on `/auth/**` and `/api/**`:

- `http://localhost:5173` (React frontend — Vite default)
- `http://localhost:3000` (React frontend — CRA default)

The `/interno/**` path has no CORS configuration — it is intended for server-to-server calls from the Python engine only.

---

## Integration with other modules

| Module | Role | Default port |
|---|---|---|
| `aquasense-frontend` | React UI, calls `/auth/**` and `/api/**` with Bearer token | 5173 |
| `aquasense-backend` | This module | 8080 |
| `aquasense-python` | Simulation engine, calls `/interno/proyectos/:id/lecturas` | — |

Full integration of all three modules was completed in week 3 of the project.

---

## Git rules

The following are in `.gitignore` and must never be committed:

```
target/
*.jar
*.class
.env
```

Never commit a real `JWT_SECRET`. Use `.env.example` as the template and keep `.env` local only.
