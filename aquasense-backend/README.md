# aquasense-backend

API REST del *backend* para **AquaSense**, una plataforma SaaS de monitorización de plantas de tratamiento de agua. Desarrollada con Spring Boot 3 como parte de un proyecto final de tres módulos.

> **Módulos:** [aquasense-frontend](../aquasense-frontend) (React) · **aquasense-backend** (este) · [aquasense-python](../aquasense-python) (motor de simulación)

---

## Qué hace este módulo

- Autenticación basada en JWT (inicio y cierre de sesión con lista negra de tokens)
- Gestión de proyectos — cada usuario autenticado gestiona uno o más proyectos ETAP
- Persistencia de lecturas de sensores — almacena lecturas con marca temporal para los 8 componentes de la planta
- Motor de alertas — evalúa las lecturas entrantes respecto a los umbrales por componente, genera alertas `ADVERTENCIA` / `CRITICA` y ejecuta acciones automáticas (p. ej. `aumentarCloro`, `cerrarValvulaEntrada`, `dosificarNaOH`)
- Control de equipos — acepta comandos del *frontend* y registra el estado de los componentes
- Almacenamiento del layout del sinóptico — persiste layouts JSON arbitrarios por proyecto (usado por el canvas React)
- *Endpoint* interno para el motor de simulación Python — recibe lecturas sin CORS ni JWT

---

## *Stack* tecnológico

| Capa | Tecnología |
|---|---|
| Idioma | Java 21 |
| Marco de trabajo | Spring Boot 3.3.4 |
| Seguridad | Spring Security 6 + jjwt 0.12.3 |
| Persistencia | Spring Data JPA + Hibernate |
| Base de datos (dev) | H2 en memoria |
| Reducción de código repetitivo | Lombok |
| Compilación | Maven (wrapper mvnw incluido) |

---

## Estructura del proyecto

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

## Ejecución local

### Requisitos previos

- Java 21 (`java -version`)
- No es necesario instalar Maven — el wrapper `mvnw` está incluido

### Iniciar el servidor

**Windows:**
```cmd
.\mvnw.cmd spring-boot:run
```

**macOS / Linux:**
```bash
./mvnw spring-boot:run
```

El servidor arranca en **http://localhost:8080** en ~6 segundos.

### Consola H2

Disponible en **http://localhost:8080/h2-console**

| Campo | Valor |
|---|---|
| JDBC URL | `jdbc:h2:mem:aquasense` |
| Nombre de usuario | `sa` |
| Contraseña | *(dejar en blanco)* |

### Usuario de demostración

Se crean automáticamente un usuario y un proyecto de ejemplo en el arranque:

| Campo | Valor |
|---|---|
| Email | `admin@aquasense.com` |
| Contraseña | `password` |

---

## Variables de entorno

Copia `.env.example` a `.env` y establece tus valores antes de desplegar:

```bash
cp .env.example .env
```

`.env.example`:
```
JWT_SECRET=change_me_in_production
JWT_EXPIRATION=28800000
```

| Variable | Valor por defecto (dev) | Descripción |
|---|---|---|
| `JWT_SECRET` | `dev_secret_key_aquasense_...` | Clave de firma HMAC-SHA. Debe tener ≥ 32 caracteres. **Cambia antes de cualquier despliegue público.** |
| `JWT_EXPIRATION` | `28800000` | Duración del token en milisegundos (por defecto: 8 horas) |

`application.properties` los lee mediante:
```properties
jwt.secret=${JWT_SECRET:dev_secret_key_aquasense_change_in_production_32chars}
jwt.expiration=28800000
```

---

## *Endpoints* de la API

### Autenticación

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/auth/login` | Público | Recibe `{ email, password }`, devuelve `{ token, expiresIn: 28800, usuario }` |
| `POST` | `/auth/logout` | Público | Invalida el token Bearer actual (lista negra en memoria) |

### Proyectos

Todos los *endpoints* de proyecto requieren `Authorization: Bearer <token>`. Cada *endpoint* valida que el proyecto solicitado pertenece al usuario autenticado.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/proyectos` | Lista todos los proyectos del usuario autenticado |
| `POST` | `/api/proyectos` | Crea un nuevo proyecto (inicializa automáticamente los equipos de los 8 componentes) |
| `GET` | `/api/proyectos/:id` | Detalles del proyecto |
| `GET` | `/api/proyectos/:id/estado` | Estado actual de los 8 componentes (última lectura por componente) |
| `GET` | `/api/proyectos/:id/historico` | Historial de lecturas. Parámetros: `componente`, `desde` (datetime ISO), `hasta` (datetime ISO) |
| `GET` | `/api/proyectos/:id/alertas` | Lista de alertas. Parámetro: `activas=true` para filtrar solo las alertas activas |
| `POST` | `/api/proyectos/:id/control` | Envía un comando a un componente: `{ componente, comando }` |
| `GET` | `/api/proyectos/:id/equipos` | Estado actual de los equipos de todos los componentes |
| `GET` | `/api/proyectos/:id/layout` | Recupera el JSON del layout del sinóptico |
| `POST` | `/api/proyectos/:id/layout` | Guarda el JSON del layout del sinóptico |

### Interno (solo motor Python)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/interno/proyectos/:id/lecturas` | Ninguna | Persiste una lectura de sensor y dispara la evaluación de umbrales |

Cuerpo de la petición:
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

## IDs de componentes y campos

Los 8 componentes monitorizados y sus nombres de campo exactos en camelCase:

| ID de componente | Campos |
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

## Motor de alertas

`AlertaService` evalúa cada lectura entrante respecto a los umbrales y persiste las alertas sin duplicar las que ya están activas. Reglas principales:

| Condición | Nivel | Acción automática |
|---|---|---|
| `cloroResidual` < 0.5 mg/L | `ADVERTENCIA` | `aumentarCloro` |
| `cloroResidual` < 0.2 mg/L | `CRITICA` | `aumentarCloro` |
| `ph` < 6.0 | `CRITICA` | `dosificarNaOH` |
| `ph` < 6.5 | `ADVERTENCIA` | `dosificarNaOH` |
| `nivel` (reservorio) > 90% | `ADVERTENCIA` | `cerrarValvulaEntrada` |
| `nivel` (reservorio) > 95% | `CRITICA` | `cerrarValvulaEntrada` |
| `temperaturaMotor` > 70°C | `ADVERTENCIA` | — |
| `diferencialPresion` > 0.5 bar | `ADVERTENCIA` | — |

Las acciones automáticas actualizan el campo `Equipamento.estado` del componente afectado.

---

## CORS

Solo los siguientes orígenes están permitidos en `/auth/**` y `/api/**`:

- `http://localhost:5173` (*frontend* React — Vite por defecto)
- `http://localhost:3000` (*frontend* React — CRA por defecto)

La ruta `/interno/**` no tiene configuración CORS — está destinada únicamente a llamadas servidor a servidor desde el motor Python.

---

## Integración con otros módulos

| Módulo | Rol | Puerto por defecto |
|---|---|---|
| `aquasense-frontend` | Interfaz React, llama a `/auth/**` y `/api/**` con token Bearer | 5173 |
| `aquasense-backend` | Este módulo | 8080 |
| `aquasense-python` | Motor de simulación, llama a `/interno/proyectos/:id/lecturas` | — |

La integración completa de los tres módulos se completó en la semana 3 del proyecto.

---

## Reglas de Git

Los siguientes elementos están en `.gitignore` y no deben confirmarse nunca:

```
target/
*.jar
*.class
.env
```

Nunca confirmes un `JWT_SECRET` real. Usa `.env.example` como plantilla y mantén `.env` solo en local.
