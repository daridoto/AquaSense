# AquaSense — Simbología ISA 5.1

> ISA 5.1-2009: *Instrumentation Symbols and Identification*
> Este documento mapea cada componente de la paleta del CanvasEditor al símbolo ISA 5.1 más cercano,
> describe la forma SVG implementada y justifica la decisión cuando no existe equivalente directo.

---

## 1. Componentes canónicos (8 IDs del contrato)

| componenteId | Etiqueta UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificación |
|---|---|---|---|---|
| `bomba_captacao` | B. Captación | Pump — centrifugal (círculo con rotor) | Círculo con punto central + 3 paletas radiales | ISA 5.1 §5.3: bomba centrífuga representada por un círculo con indicación del sentido de rotación. Las paletas radiales indican movimiento rotatorio. |
| `reja_tamiz` | Reja/Tamiz | Screen / Strainer (líneas paralelas verticales) | 7 líneas verticales ligeramente inclinadas + base horizontal | ISA 5.1 §5.6: filtro de partículas gruesas representado por un conjunto de barras paralelas. La inclinación sugiere la posición de una rejilla de entrada. |
| `coagulacion` | Coagulación | Mixer / Inline mixer (cámara con agitador) | Rectángulo con 3 divisiones verticales, entrada en la parte superior, salida en la base | ISA 5.1 no define la coagulación como símbolo autónomo. Aproximación: cámara de mezcla *(mixing vessel)* con canales de flujo interno. |
| `decantador` | Decantador | Vessel — gravity separator | Círculo con 2 ejes de simetría + círculo central de recogida de lodos | ISA 5.1 §5.7: separador de fases por gravedad. La forma circular indica decantador circular (Dortmund/Imhoff). El círculo interior representa el cono de extracción de lodos. |
| `filtracion` | Filtración | Filter vessel (rectángulo con medio filtrante) | Rectángulo con línea de separación + 5 círculos que representan granos de arena | ISA 5.1 §5.6: vessel de filtración. Los círculos en el interior representan el lecho filtrante de arena/antracita. |
| `desinfeccion` | Desinfección | Chemical injection point / UV reactor | Rectángulo con indicación "UV" y línea discontinua (radiación) | ISA 5.1 no define la desinfección UV como símbolo propio. Aproximación: cámara de reacción con identificación de agente (UV). La línea discontinua representa la radiación ultravioleta. |
| `reservorio` | Reservorio | Storage vessel — open top | Rectángulo ancho con línea de nivel medio | ISA 5.1 §5.7: tanque de almacenamiento abierto. El ancho mayor que el alto indica gran capacidad de reserva. La línea interna representa el nivel nominal de operación. |
| `bomba_distribucion` | B. Distribución | Pump — centrifugal | Idéntico a `bomba_captacao` | ISA 5.1 §5.3: misma forma que cualquier bomba centrífuga. La distinción entre captación y distribución se hace por posición en el diagrama y etiqueta, no por forma — conforme a ISA 5.1. |

---

## 2. Grupo de Bombeo (paleta expandida)

| componenteId | Etiqueta UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificación |
|---|---|---|---|---|
| `bomba_centrifuga` | B. Centrífuga | Pump — centrifugal | Círculo + punto central + 3 paletas | ISA 5.1 §5.3 — símbolo canónico. |
| `bomba_dosificadora` | B. Dosificadora | Pump — positive displacement / metering | Rectángulo con círculo interno + dos salidas laterales + línea de dosificación | ISA 5.1 §5.3: bomba de desplazamiento positivo indicada por forma rectangular con elemento de pistón. Las líneas laterales representan las conexiones de aspiración y descarga. |
| `bomba_vacio` | B. Vacío | Pump — vacuum / liquid ring | Elipse con línea discontinua horizontal (vacío) + conexiones superior/inferior | ISA 5.1 no distingue la bomba de vacío con símbolo propio. Aproximación: elipse (diferencia de la centrífuga) con discontinuo que indica la fase gaseosa aspirada. |
| `bomba_sumergible` | B. Sumergible | Pump — submersible | Rectángulo vertical (carcasa estanca) + círculo interior + línea de fondo doble | ISA 5.1 §5.3: nota de campo — bomba sumergible representada con carcasa cerrada. Las líneas dobles en la base indican lámina de agua. |
| `bomba_peristaltica` | B. Peristáltica | Pump — peristaltic | Círculo con 3 rodillos (rellenos) + conexiones izquierda/derecha | ISA 5.1 no tiene símbolo específico. Aproximación: rueda peristáltica con 3 rodillos de compresión, conforme a la práctica común en P&ID de la industria farmacéutica. |
| `bomba_tornillo` | B. Tornillo | Pump — screw / progressive cavity | Rectángulo horizontal con curva sinusoidal doble (tornillo de Arquímedes) | ISA 5.1 §5.3: bomba de cavidad progresiva. La sinusoide representa el perfil del tornillo helicoidal. |

---

## 3. Grupo de Filtración

| componenteId | Etiqueta UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificación |
|---|---|---|---|---|
| `filtro_arena` | F. Arena | Filter vessel — granular media | Rectángulo + línea divisoria + 5 granos (círculos) | ISA 5.1 §5.6: lecho filtrante granular. Idéntico al `filtracion` canónico. |
| `filtro_antracita` | F. Antracita | Filter vessel — dual media | Rectángulo + 2 líneas de separación + bloques rectangulares de antracita | ISA 5.1 §5.6: filtro de doble medio (arena + antracita). Las 2 líneas de separación distinguen las capas. |
| `filtro_cartucho` | F. Cartucho | Filter — cartridge | Rectángulo estrecho y alto (cartucho) + 4 líneas horizontales (plisados) | ISA 5.1 §5.6: filtro de cartucho *pleated*. Las líneas horizontales representan los pliegues filtrantes. |
| `filtro_manga` | F. Manga | Filter — bag/sock | Forma trapezoidal cerrada en la parte inferior (manga) + 2 costuras discontinuas | ISA 5.1 §5.6: filtro de manga. La forma redondeada en la base indica bolsa colectora. |
| `filtro_uv` | F. UV | UV disinfection chamber | Rectángulo con etiqueta "UV" + línea discontinua central (haz UV) | ISA 5.1 no define. Práctica común en P&ID de ETAPs: cámara rectangular con indicación de radiación (discontinuo). |
| `membrana_uf` | Membrana UF | Membrane separator — ultrafiltration | Rectángulo con 6 líneas verticales (fibras huecas) + línea horizontal de separación | ISA 5.1 §5.6: separador por membrana. Las líneas verticales representan las fibras huecas de la UF. La línea horizontal indica la barrera de presión transmembrana. |

---

## 4. Grupo de Tanques

| componenteId | Etiqueta UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificación |
|---|---|---|---|---|
| `tanque_agua_cruda` | T. Agua Bruta | Storage vessel — open, with inlet | Rectángulo con elipse en la parte superior (entrada abierta) + 2 líneas de nivel | ISA 5.1 §5.7: tanque de agua bruta (entrada en la parte superior). Las líneas de nivel indican las marcas de operación. |
| `tanque_pac` | T. PAC | Chemical storage vessel — reagent | Rectángulo con elipse en la parte superior + etiqueta "PAC" | ISA 5.1 §5.7: tanque de reactivo químico identificado por etiqueta. El PAC (Policloruro de Aluminio) es el coagulante. |
| `tanque_cloro` | T. Cloro | Pressure vessel — gas/liquid chlorine | Círculo (presurizado) + etiqueta "Cl₂" | ISA 5.1 §5.7: recipiente presurizado (cilindro de gas o tanque de hipoclorito). El círculo (frente al rectángulo) indica contenedor presurizado conforme a ISA 5.1. |
| `tanque_lodos` | T. Lodos | Sludge vessel — conical bottom | Forma trapezoidal invertida (cono de lodos) + elipse en la parte superior + nivel discontinuo | ISA 5.1 §5.7: tanque de lodos con fondo cónico para extracción gravitacional. La línea discontinua indica la interfaz lodo/sobrenadante. |
| `reservorio` | Reservorio | Storage vessel — open top | Ver sección 1. | — |
| `cisterna` | Cisterna | Underground storage vessel | Forma cilíndrica (elipses superior e inferior + laterales) | ISA 5.1 §5.7: cisterna enterrada o cisterna horizontal. La forma elíptica en la parte superior e inferior indica recipiente cilíndrico tumbado o enterrado. |

---

## 5. Grupo de Tratamiento

| componenteId | Etiqueta UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificación |
|---|---|---|---|---|
| `coagulador` | Coagulador | Mixing vessel — rapid mix | Rectángulo con 3 cámaras + entrada superior + salida inferior | ISA 5.1 no tiene símbolo directo. Aproximación: cámara de mezcla rápida con divisiones de flujo en *plug-flow*. |
| `floculador` | Floculador | Mixing vessel — slow mix / flocculation | Rectángulo con agitador central (línea vertical) + 3 curvas de flujo | ISA 5.1 §5.4: agitador en cámara cerrada. Las curvas representan flujo laminar de baja velocidad (floculación suave). |
| `decantador_laminar` | Dec. Laminar | Settler — lamella / tube settler | Trapecio (perfil de decantador) + 5 líneas de láminas inclinadas | ISA 5.1 §5.7: decantador con módulos lamelares. Las líneas inclinadas son la representación canónica de láminas en P&ID. |
| `decantador_circular` | Dec. Circular | Settler — circular clarifier | Círculo + ejes de simetría + círculo central | ISA 5.1 §5.7: clarificador circular (Dortmund). Idéntico al `decantador` canónico. |
| `reactor_biologico` | Reactor Bio. | Bioreactor — aerobic | Rectángulo redondeado + 3 círculos (biomasa) + conexiones superior/inferior | ISA 5.1 no define reactor biológico. Aproximación: *vessel* con indicación de fase biológica (círculos = flóculos de biomasa). |
| `torre_aireacion` | Torre de Aireación | Cooling tower / aeration tower | Rectángulo alto + rejillas horizontales internas + curva de salpicadura | ISA 5.1 §5.7: torre de aireación. Las rejillas internas representan los distribuidores de agua; la curva en la base representa la salpicadura/dispersión. |

---

## 6. Grupo de Medición

| componenteId | Etiqueta UI | Tag ISA 5.1 | Forma SVG implementada | Justificación |
|---|---|---|---|---|
| `caudalimetro` | Caudalímetro | FE / FT (Flow Element / Transmitter) | Círculo + curva sinusoidal (forma de onda de caudal) + conexiones superior/inferior | ISA 5.1 §4: instrumentos de medición representados por un círculo. La sinusoide indica variable de caudal (Flow). Tag recomendado: FIT (Flow Indicator Transmitter). |
| `manometro` | Manómetro | PI / PT (Pressure Indicator / Transmitter) | Círculo + puntero (línea diagonal) + punto de pivote + marcas de escala | ISA 5.1 §4: manómetro — círculo con puntero. Forma directamente derivada de ISA 5.1 Fig. 4-1. Tag recomendado: PIT. |
| `ph_sensor` | Sensor pH | AT (Analyzer Transmitter) — pH | Elipse vertical (electrodo) + conexión superior + etiqueta "pH" | ISA 5.1 §4: analizador de calidad representado por elipse. La etiqueta "pH" identifica la variable. Tag: AIT-pH. |
| `orp_sensor` | Sensor ORP | AT (Analyzer Transmitter) — ORP | Elipse vertical + conexión superior + etiqueta "ORP" | ISA 5.1 §4: ídem al pH. ORP (Oxidation Reduction Potential) es variable de calidad. Tag: AIT-ORP. |
| `turbidimetro` | Turbidímetro | AT (Analyzer Transmitter) — turbidity | Círculo + haz incidente (línea sólida) + haz disperso (línea discontinua) + punto de dispersión | ISA 5.1 §4: analizador óptico. El haz reflejado a 90° representa el principio nefelométrico (NTU). Tag: AIT-NTU. |
| `nivel_sensor` | Sensor de Nivel | LE / LT (Level Element / Transmitter) | Regla vertical (rectángulo estrecho) + marcas de nivel + punto de flotador | ISA 5.1 §4: instrumento de nivel. La regla con punto de contacto representa un sensor de nivel por flotador o ultrasónico. Tag: LIT. |

---

## 7. Grupo de Control

| componenteId | Etiqueta UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificación |
|---|---|---|---|---|
| `valvula_manual` | V. Manual | Valve — globe / manual | Dos flechas en V (mariposa) + vástago + volante (línea horizontal gruesa) | ISA 5.1 §5.1: válvula manual representada por dos triángulos en V con volante en la parte superior. Forma canónica ISA. |
| `valvula_motorizada` | V. Motorizada | Valve — motor operated (MOV) | Dos triángulos en V + vástago + rectángulo de actuador eléctrico | ISA 5.1 §5.1: válvula con actuador eléctrico indicado por rectángulo sobre el vástago. |
| `valvula_solenoide` | V. Solenoide | Valve — solenoid operated (SOV) | Dos triángulos en V + vástago + elipse de solenoide con bobina | ISA 5.1 §5.1: válvula con actuador electromagnético indicado por elipse (solenoide). |
| `variador_frequencia` | Variador Freq. | VFD (Variable Frequency Drive) | Rectángulo con curva de frecuencia variable + etiqueta "VFD" | ISA 5.1 no define el VFD como símbolo de proceso. Práctica común en P&ID: rectángulo con onda de frecuencia variable. |
| `plc` | PLC | Control system / shared controller | Rectángulo con dos bloques de E/S + línea de bus + terminales de I/O | ISA 5.1 §4 / ISA 88: controlador compartido representado por rectángulo con bloques de módulos de E/S. |

---

## 8. Grupo de Estructura

| componenteId | Etiqueta UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificación |
|---|---|---|---|---|
| `reja_tamiz` | Reja/Tamiz | Screen (ver sección 1) | Ver sección 1 | — |
| `reja_gruesa` | Reja Gruesa | Coarse screen | 5 barras verticales gruesas + base horizontal | ISA 5.1 §5.6: reja de desbaste. Barras más gruesas y espaciadas que la reja fina. |
| `reja_fina` | Reja Fina | Fine screen / microscreen | 7 barras verticales finas + base horizontal | ISA 5.1 §5.6: reja de prefiltración. Más barras y más finas que la reja gruesa. |
| `canal_entrada` | Canal de Entrada | Open channel — flow | Perfil en U abierto + curva de superficie libre | ISA 5.1 no define canal abierto. Aproximación: perfil trapezoidal de canal con indicación de superficie libre (curva sinusoidal). |
| `pozo_bombeo` | Pozo de Bombeo | Wet well / pump sump | Cilindro vertical (elipses superior e inferior + laterales) + conexión de entrada | ISA 5.1 §5.7: pozo húmedo de estación de bombeo. La forma cilíndrica vertical lo distingue de la cisterna horizontal. |
| `caixa_distribuicao` | Cx. Distribución | Distribution box / splitter | Cuadrado con 4 conexiones (superior, izquierda, derecha, inferior) + círculo central de distribución | ISA 5.1 no define caja de distribución. Aproximación: *junction box* con 4 salidas simétricas, conforme a la práctica en P&ID de redes de distribución. |

---

## Notas generales

1. **Escala de visualización**: todos los iconos se renderizan en `viewBox="0 0 48 48"` dentro de una celda de `80 × 72 px` en el canvas SVG.
2. **Color y estado**: el color del trazo de cada símbolo refleja el estado de alerta (`#00e87a` OK, `#f5a623` aviso, `#ff3d5a` crítico), conforme a ISA 101 — ver `docs/hmi-decisions.md`.
3. **Etiquetas de identificación**: ISA 5.1 §3 define las tags de instrumentación (FIT, PIT, AIT, LIT). AquaSense usa `componenteId` en lugar de tags ISA — la correspondencia está en la columna "Tag ISA 5.1" anterior.
4. **Componentes sin equivalente directo**: la coagulación, la desinfección UV, el VFD, el PLC, la caja de distribución y el canal de entrada no tienen símbolo propio en ISA 5.1-2009. La forma utilizada es la aproximación más común en P&IDs de estaciones de tratamiento de agua (ETAPs), conforme a AWWA M49 y la práctica europea EN ISO 10628.
