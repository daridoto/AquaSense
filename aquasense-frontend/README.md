# aquasense-frontend

React frontend for **AquaSense**, a water treatment plant monitoring SaaS platform. Part of a three-module final course project.

> **Modules:** **aquasense-frontend** (this) · [aquasense-backend](../aquasense-backend) (REST API) · [aquasense-python](../python) (simulation engine)

---

## What this module does

- JWT-based login / logout with token stored in `localStorage`
- Project list and creation
- Real-time synoptic view — SVG canvas with ISA 5.1 symbols, polled every 5 seconds
- Drag-and-drop layout editor with a 40+ component palette
- Sensor history with Chart.js charts and CSV export
- Alert management — acknowledge, silence, assign, and resolve alerts
- Team management with per-project roles (ADMIN / OPERADOR / MANTENIMIENTO / VISUALIZADOR)
- Audit log with filters
- Email notification preferences per project

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Routing | React Router v6 |
| HTTP client | Axios (with JWT interceptor) |
| Charts | Chart.js + react-chartjs-2 |
| Synoptic | Native SVG — no diagram library |

---

## Project structure

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

## Running locally

### Prerequisites

- Node.js 18+ (`node -v`)

### Start the dev server

```bash
npm install
npm run dev
```

The app starts on **http://localhost:5173**.

> The backend must be running on `http://localhost:8080` for API calls to work.

### Build for production

```bash
npm run build
```

Output goes to `dist/`. Deploy the `dist/` folder to any static host (Vercel, Netlify, etc.).

---

## Environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default (dev) |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend | `http://localhost:8080` |

---

## Authentication

- Token is stored in `localStorage["aquasense_token"]`
- An Axios interceptor automatically attaches `Authorization: Bearer <token>` to every request
- On 401, the user is redirected to `/login`

---

## Synoptic editor

The layout editor renders an SVG canvas where plant engineers can place and connect components. Symbols follow the ISA 5.1-2009 standard. Layout is persisted via `POST /api/proyectos/:id/layout`.
