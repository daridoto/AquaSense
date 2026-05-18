# aquasense-frontend

*Frontend* React para **AquaSense**, una plataforma SaaS de monitorización de plantas de tratamiento de agua. Parte de un proyecto final de tres módulos.

> **Módulos:** **aquasense-frontend** (este) · [aquasense-backend](../aquasense-backend) (API REST) · [aquasense-python](../python) (motor de simulación)

---

## Qué hace este módulo

- Inicio y cierre de sesión basados en JWT con token almacenado en `localStorage`
- Lista y creación de proyectos
- Vista sinóptica en tiempo real — canvas SVG con símbolos ISA 5.1, con *polling* cada 5 segundos
- Editor de layout *drag-and-drop* con una paleta de más de 40 componentes
- Historial de sensores con gráficas Chart.js y exportación CSV
- Gestión de alertas — confirmar, silenciar, asignar y resolver alertas
- Gestión de equipo con roles por proyecto (ADMIN / OPERADOR / MANTENIMIENTO / VISUALIZADOR)
- Registro de auditoría con filtros
- Preferencias de notificaciones por correo electrónico por proyecto

---

## *Stack* tecnológico

| Capa | Tecnología |
|---|---|
| Marco de trabajo | React 18 |
| Herramienta de compilación | Vite |
| Enrutamiento | React Router v6 |
| Cliente HTTP | Axios (con interceptor JWT) |
| Gráficas | Chart.js + react-chartjs-2 |
| Sinóptico | SVG nativo — sin librería de diagramas |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── sinoptico/       # SVG canvas, ISA shapes, pipe rendering
│   ├── alarmas/         # Alert table with lifecycle actions
│   ├── historico/       # Chart + CSV export
│   ├── roles/           # Team management
│   ├── auditoria/       # Audit log
│   └── notificaciones/  # Email preference toggles
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Proyectos.jsx    # Project list
│   └── Dashboard.jsx    # Per-project view
├── hooks/
│   ├── useAuth.js
│   ├── useRole.js
│   └── usePolling.js    # 5-second polling with unmount cleanup
└── api/
    └── axios.js         # Axios instance with Authorization interceptor
```

---

## Ejecución local

### Requisitos previos

- Node.js 18+ (`node -v`)

### Iniciar el servidor de desarrollo

```bash
npm install
npm run dev
```

La aplicación arranca en **http://localhost:5173**.

> El *backend* debe estar ejecutándose en `http://localhost:8080` para que las llamadas a la API funcionen.

### Compilar para producción

```bash
npm run build
```

El resultado se genera en `dist/`. Despliega la carpeta `dist/` en cualquier servidor estático (Vercel, Netlify, etc.).

---

## Variables de entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

| Variable | Descripción | Valor por defecto (dev) |
|---|---|---|
| `VITE_API_URL` | URL base del *backend* | `http://localhost:8080` |

---

## Autenticación

- El token se almacena en `localStorage["aquasense_token"]`
- Un interceptor de Axios añade automáticamente `Authorization: Bearer <token>` a cada petición
- Con un 401, el usuario es redirigido a `/login`

---

## Editor de sinópticos

El editor de layout renderiza un canvas SVG en el que los ingenieros de planta pueden colocar y conectar componentes. Los símbolos siguen la norma ISA 5.1-2009. El layout se persiste mediante `POST /api/proyectos/:id/layout`.
