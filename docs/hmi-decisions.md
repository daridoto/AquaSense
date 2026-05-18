# AquaSense — Decisiones de HMI (ISA 101)

> ISA 101-2015: *Human Machine Interfaces for Process Automation Systems*
> Este documento registra las decisiones de diseño de la interfaz HMI de AquaSense y las justifica
> según la norma ISA 101 y las buenas prácticas de ergonomía industrial.

---

## 1. Filosofía de diseño (ISA 101 §5)

ISA 101 define 4 niveles de prioridad de información en la HMI:

| Nivel ISA 101 | Prioridad | Aplicación en AquaSense |
|---|---|---|
| Nivel 1 — Overview | Estado general de la planta | Dashboard `/proyectos/:id` — sinóptico + *badges* de estado |
| Nivel 2 — Unit | Estado de cada unidad de proceso | *Cards* de componente con valor primario + color de alerta |
| Nivel 3 — Equipment | Detalle de equipo individual | Panel de telemetría en `/estado` (todos los parámetros) |
| Nivel 4 — Diagnostic | Diagnóstico y mantenimiento | `/alertas` — historial con *timestamps* y severidad |

---

## 2. Jerarquía de alarmas (ISA 18.2 adaptada)

ISA 101 hace referencia a ISA 18.2 para la gestión de alarmas. AquaSense implementa 3 niveles:

### Nivel 1 — CRÍTICO (rojo `#ff3d5a`)

Condición que requiere intervención inmediata. La planta puede detenerse o causar daños.

| Parámetro | Límite crítico | Componente |
|---|---|---|
| `nivelTanqueCloro` | < 10% | `desinfeccion` |
| `temperaturaMotor` | > 60 °C | `bomba_captacao`, `bomba_distribucion` |
| `nivel` (reservorio) | < 30% o > 90% | `reservorio` |
| `ph` | < 5.5 o > 8.0 | `desinfeccion` |
| `cloroResidual` | < 0.1 mg/L | `desinfeccion` |

**Respuesta en la HMI**: trazo rojo `#ff3d5a`, fill `rgba(255,61,90,0.08)`, alerta activa en el *badge* del componente.

### Nivel 2 — ALERTA (amarillo `#f5a623`)

Condición fuera de los límites de operación normal. Requiere atención en minutos o horas.

| Parámetro | Límite de alerta | Componente |
|---|---|---|
| `ph` | 6.0–7.5 (fuera de este intervalo) | `coagulacion`, `desinfeccion` |
| `cloroResidual` | 0.2–2.0 mg/L (fuera de este intervalo) | `desinfeccion` |
| `presionSuccion` | 0.5–2.0 bar (fuera de este intervalo) | `bomba_captacao` |
| `turbidezSalida` | > 1.0 NTU | `filtracion` |
| `orp` | 650–750 mV (fuera de este intervalo) | `desinfeccion` |
| `nivelTanqueCloro` | 10–20% | `desinfeccion` |

**Respuesta en la HMI**: trazo amarillo `#f5a623`, fill `rgba(245,166,35,0.08)`.

### Nivel 3 — OK (verde `#00e87a`)

Todos los parámetros dentro de los límites de operación normal.

**Respuesta en la HMI**: trazo verde `#00e87a`, fill `rgba(0,232,122,0.06)`.

### Estado sin datos (gris `#00c8e8`)

Componente sin lecturas activas (simulación inactiva o componente no mapeado en el estado).

**Respuesta en la HMI**: trazo cian `#00c8e8` (color base de la aplicación), sin fill de alerta.

---

## 3. Paleta de colores ISA 101

ISA 101 §6.3 define principios de color para la HMI industrial:

> «Los colores deben usarse para transmitir información, no como decoración. El color de fondo debe ser neutro.»

### 3.1 Colores de estado (alarma)

| Estado | Hex | Uso |
|---|---|---|
| Crítico | `#ff3d5a` | Trazo + texto de componentes en fallo crítico |
| Alerta | `#f5a623` | Trazo + texto de componentes en aviso |
| Normal | `#00e87a` | Trazo + texto de componentes operacionales |
| Inactivo / sin datos | `#00c8e8` | Trazo base cuando no hay estado |

**Conformidad ISA 101**: rojo = emergencia, amarillo/ámbar = aviso, verde = normal. El azul/cian (`#00c8e8`) se reserva como color neutro de interfaz (no tiene significado de estado).

### 3.2 Fondo y contexto

| Elemento | Color | Justificación ISA 101 |
|---|---|---|
| Fondo de la aplicación | `#0a1628` (azul oscuro casi negro) | ISA 101 §6.3: los fondos oscuros reducen la fatiga visual en operaciones 24/7 y aumentan el contraste con los elementos de estado |
| Fondo de *cards* | `#0d1f35` / `#1a2d45` | Tonos neutros para no interferir con el color de estado |
| Texto principal | `#e2e8f0` (casi blanco) | Contraste WCAG AA mínimo 4.5:1 sobre fondos oscuros |
| Texto secundario | `#8aaec8` | Información de baja prioridad (etiquetas, unidades) |
| Canalizaciones / tuberías | `#00c8e8` con opacidad 0.35–0.6 | Color neutro para la estructura — no confundir con estados de alarma |

### 3.3 Colores disponibles para tuberías en el editor

```
#00d4ff  — azul agua (estándar para líneas de proceso)
#00e87a  — verde (líneas de efluente tratado)
#f5a623  — ámbar (líneas de reactivos químicos)
#ff3d5a  — rojo (líneas de emergencia / bypass)
#ffffff  — blanco (líneas auxiliares / instrumentación)
#8aaec8  — gris azulado (líneas de retorno / drenaje)
```

ISA 5.1 §6: el color de las tuberías en P&ID indica el tipo de fluido. AquaSense expone estos colores al operador en el editor de layout.

---

## 4. Tiempo de respuesta de *polling* — justificación

### 4.1 Intervalo adoptado: 5000 ms (5 s)

El componente `Sinoptico.jsx` hace *polling* al *endpoint* `/api/proyectos/:id/estado` cada 5 segundos con limpieza al desmontar:

```javascript
// Polling /estado a 5000ms, com cleanup no unmount
useEffect(() => {
  const interval = setInterval(() => fetchEstado(), 5000);
  return () => clearInterval(interval);
}, [projectId]);
```

### 4.2 Justificación técnica

| Criterio | Valor | Fuente |
|---|---|---|
| Tiempo de respuesta del simulador Python | 5 s (intervalo de publicación) | `python/main.py` — bucle con sleep 5s |
| Latencia de persistencia en el *backend* | < 100 ms | H2 (dev) / PostgreSQL (prod) |
| Umbral de percepción humana para cambios de estado | 1–3 s | ISA 101 §7.2: «la frecuencia de actualización de la pantalla debe coincidir con la dinámica del proceso» |
| Dinámica del proceso de tratamiento de agua | Minutos a horas | Las ETAPs operan en régimen cuasi-estacionario |
| Coste de *polling* HTTP por cliente | ~1 req/5s = 720 req/h | Aceptable para 1-10 clientes simultáneos |

**Conclusión**: 5 s es el mínimo útil alineado con el intervalo del simulador. Valores menores no aportarían datos más recientes; valores mayores crearían un *lag* perceptible entre el evento y la visualización.

### 4.3 Comparación de alternativas

| Alternativa | Ventaja | Desventaja | Motivo de rechazo |
|---|---|---|---|
| WebSocket | Tiempo real verdadero, sin sobrecarga HTTP | Complejidad de infraestructura (Railway WebSocket, CORS, reconexión) | Fuera del alcance del TFG; 5 s es suficiente para ETAPs |
| Server-Sent Events (SSE) | Unidireccional, más simple que WS | Sigue requiriendo soporte de infraestructura adicional | Ídem |
| *Polling* de 1 s | Apariencia más «en vivo» | 5× más carga en el servidor sin datos nuevos | El simulador publica cada 5 s — datos repetidos |
| *Polling* de 30 s | Carga mínima | *Lag* de hasta 30 s en un fallo crítico | Inaceptable para alarmas de nivel 1 |

---

## 5. Layout del sinóptico — decisiones de diseño

### 5.1 Flujo de izquierda a derecha

ISA 101 §8 y EEMUA 201 recomiendan que el flujo de proceso se represente de izquierda a derecha, de acuerdo con la convención occidental de lectura.

El sinóptico estático (fallback) respeta esta convención:

```
Captação → Reja/Tamiz → Coagulação → Decantação → Filtração → Desinfeção → Reservório → Distribuição
  (60px)     (175px)     (295px)      (415px)      (535px)     (655px)       (775px)       (900px)
```

Las coordenadas X aumentan de izquierda a derecha, representando el avance del tratamiento desde el agua bruta hasta el agua tratada.

### 5.2 Editor de layout libre (CanvasEditor)

El operador puede reposicionar componentes libremente en el `CanvasEditor`. El sistema no impone posiciones — solo sugiere el flujo estándar como punto de partida.

**Decisión**: no forzar layout automático (auto-layout) porque:
- Las ETAPs reales tienen geometrías variables (lineal, anular, paralela)
- El operador conoce mejor el P&ID físico de su instalación
- ISA 101 §8: «el layout debe reflejar la disposición física del proceso»

### 5.3 Conexiones bézier

Las tuberías se dibujan como curvas cúbicas de Bézier (`C` en SVG path):

```
d = `M p1.x p1.y C cx p1.y, cx p2.y, p2.x p2.y`
onde cx = (p1.x + p2.x) / 2
```

**Justificación**: las curvas bézier evitan colisiones visuales entre líneas paralelas y producen un diagrama más legible que las líneas ortogonales cuando los componentes están en posiciones arbitrarias.

### 5.4 Puertos de conexión

Cada componente expone 4 puertos: `left`, `right`, `top`, `bottom`. El operador elige los puertos de origen y destino al crear una tubería.

**Justificación ISA 5.1**: las líneas de proceso entran y salen de los símbolos por los lados, no por los vértices. Los 4 puertos cubren todas las direcciones posibles sin ambigüedad.

---

## 6. *Overlay* de simulación inactiva

Cuando `simulacaoAtiva === false`, el sinóptico muestra un *overlay* semitransparente con:
- Icono `◉` (indicador de estado detenido)
- Mensaje explicativo

**Justificación ISA 101 §9**: la HMI debe indicar claramente cuándo los datos mostrados pueden no estar actualizados. El *overlay* evita que el operador interprete datos estáticos como el estado real de la planta.

---

## 7. Internacionalización

AquaSense admite múltiples idiomas mediante `LanguageContext`. Todos los textos de la HMI pasan por la función `t()`. Los identificadores de componentes (`componenteId`) están siempre en español (snake_case) — nunca se traducen — para mantener la coherencia con el contrato de la API.

**Justificación**: ISA 101 §5 señala que los identificadores de equipo (tags) no deben traducirse; solo las etiquetas mostradas al operador pueden cambiar con el idioma.

---

## 8. Accesibilidad (WCAG 2.1 AA)

Además de la ISA 101, AquaSense aplica las siguientes reglas de accesibilidad:

| Regla | Implementación |
|---|---|
| Contraste mínimo 4.5:1 para texto normal | Verificado en la Fase 1 — `index.css`, `Sinoptico.jsx`, `Topbar`, `Historico` |
| Contraste mínimo 3:1 para elementos gráficos grandes | Los colores de estado (`#ff3d5a`, `#f5a623`, `#00e87a`) sobre fondos oscuros cumplen este requisito |
| No usar el color como único indicador | El estado de alerta se indica mediante color + etiqueta de texto + *badge* de conteo |
| Texto redimensionable | Interfaz en `rem` / `em`; SVG con `viewBox` escalable |
