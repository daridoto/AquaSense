# Mapa de Conexiones Físicas — AquaSense ETAP

Documento técnico que describe el flujo hidráulico y las conexiones entre los equipos del proceso de tratamiento de agua. Fuente de verdad para el renderizado de tuberías (tareas 2 y 3).

**Versión**: 1.0 | **Fecha**: 2026-04-21
**Fuente**: Análisis de simulator.py, AlertaService, Sinoptico.jsx, paletaItems.jsx

---

## Flujo Principal: Agua Bruta → Agua Tratada

| Sec | fromComponenteId | toComponenteId | Tipo | Puerto de origen | Puerto de destino | Parámetro de origen | Parámetro de destino | Notas |
|-----|------------------|----------------|------|------------------|-------------------|---------------------|----------------------|-------|
| 1 | bomba_captacao | reja_tamiz | aguaCruda | descarga | alimentacao | caudal (12 m³/h) | turbidezEntrada (25–60 NTU) | Succión de la fuente; presionSuccion monitoriza la cavitación |
| 2 | reja_tamiz | coagulacion | aguaCruda | salida | entrada | turbidez (10–60 NTU) | turbidez (5–15 NTU) | diferencialPresion indica colmatación |
| 3 | coagulacion | decantador | aguaCruda+PAC | salida | entrada | phPostCoagulacion (~6.8) | nivelLodo (40%) | Floculación y sedimentación |
| 4 | decantador | filtracion | aguaPartialmenteTratada | salida | entrada | caudalSalida (~11 m³/h) | turbidezSalida (0.8 NTU) | Clarificación previa |
| 5 | filtracion | desinfeccion | aguaTratada | salida | entrada | turbidezSalida (0.1–3 NTU) | cloroResidual (0.3–1.5 mg/L) | Lecho de arena; perdidaCarga monitoriza la obstrucción |
| 6 | desinfeccion | reservorio | aguaTratada | salida | entrada | cloroResidual (mg/L) | nivel (~50%) | Cámara UV + inyección de cloro |
| 7 | reservorio | bomba_distribucion | aguaTratada | salida | succion | nivel (20–98%) | caudal (10 m³/h) | Presurización final para la red de distribución |

---

## Conexiones Secundarias: Química, Purga y Venteo

| Sec | fromComponenteId | toComponenteId | Tipo | Puerto de origen | Puerto de destino | Parámetro | Notas |
|-----|------------------|----------------|------|------------------|-------------------|-----------|-------|
| 8 | tanque_pac | coagulacion | dosificacionQuimica | salida | entrada_pac | caudalDosificacion (2.5 L/h) | Bomba dosificadora; nivelTanquePAC crítico < 20% |
| 9 | tanque_cloro | desinfeccion | dosificacionQuimica | salida | entrada_cloro | nivelTanqueCloro | Bomba dosificadora; crítico < 10% → alerta CRITICA |
| 10 | decantador | tanque_lodos | purgaLodo | salida_lodos | entrada | nivelLodo | Descarga de sedimento; > 80% activa la limpieza |
| 11 | filtracion | tanque_lodos | retorno | salida_lavado | entrada | horasDesdelavado | Agua de retrolavado (ciclo de 24-48 h) |
| 12 | filtracion | exterior | venteo | ar_escape | exterior | — | Descompresión durante el retrolavado |

---

## Puertos por Geometría Real (para la tarea 3)

| Equipo | Puerto | Posición geométrica | Dirección |
|---|---|---|---|
| bomba_captacao | succion | lateral izquierdo | entrada |
| bomba_captacao | descarga | lateral derecho o superior | salida |
| reja_tamiz | alimentacao | lateral izquierdo | entrada |
| reja_tamiz | salida | lateral derecho | salida |
| coagulacion | entrada | lateral izquierdo | entrada |
| coagulacion | entrada_pac | superior | entrada (química) |
| coagulacion | salida | lateral derecho | salida |
| decantador | entrada | superior | entrada |
| decantador | salida | lateral (rebose) | salida clarificada |
| decantador | salida_lodos | fondo | salida (purga) |
| filtracion | entrada | superior | entrada |
| filtracion | salida | inferior | salida (filtrada) |
| filtracion | salida_lavado | lateral | salida (retrolavado) |
| filtracion | ar_escape | parte superior | venteo |
| desinfeccion | entrada | lateral izquierdo | entrada |
| desinfeccion | entrada_cloro | superior | entrada (química) |
| desinfeccion | salida | lateral derecho | salida |
| reservorio | entrada | lateral superior | entrada |
| reservorio | salida | fondo o lateral inferior | salida |
| bomba_distribucion | succion | lateral izquierdo | entrada |
| bomba_distribucion | descarga | lateral derecho o superior | salida |

---

## Tipos de Fluido — Referencia de Renderizado (para la tarea 2)

| Tipo | Color sugerido | Grosor SVG | Textura | Ejemplo |
|---|---|---|---|---|
| aguaCruda | `#00d4ff` (azul claro) | 4px | ninguna | bomba_captacao → reja_tamiz |
| aguaTratada | `#00e87a` (verde) | 4px | ninguna | filtracion → desinfeccion → reservorio |
| dosificacionQuimica | `#f5a623` (ámbar) | 2px | trazos cortos discontinuos | tanque_pac → coagulacion |
| purgaLodo | `#8aaec8` (gris azulado) | 3px | ninguna | decantador → tanque_lodos |
| retorno | `#8aaec8` (gris azulado) | 2px | trazos largos discontinuos | filtracion → tanque_lodos |
| venteo | `#ffffff` (blanco) | 1px | punteado | filtracion → exterior |

---

## Parámetros Críticos por Conexión

| Conexión | Parámetro | Umbral | Acción asociada |
|---|---|---|---|
| bomba_captacao → reja_tamiz | presionSuccion | < 0.8 bar | Verificar obstrucción de entrada |
| reja_tamiz → coagulacion | diferencialPresion | > 0.5 bar | Limpieza / retrolavado de la reja |
| coagulacion → decantador | phPostCoagulacion | < 6.0 | Aumentar dosis de PAC |
| decantador → filtracion | turbidezSalida | > 10 NTU | Limpieza del decantador |
| filtracion → desinfeccion | perdidaCarga | > 2.5 m | Retrolavado del filtro |
| desinfeccion → reservorio | cloroResidual | < 0.5 mg/L | Aumentar dosis de cloro |
| reservorio → bomba_distribucion | nivel | > 95% | Cerrar válvula de entrada |
