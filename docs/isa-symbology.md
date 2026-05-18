# AquaSense — Simbologia ISA 5.1

> ISA 5.1-2009: *Instrumentation Symbols and Identification*
> Este documento mapeia cada componente da paleta do CanvasEditor ao símbolo ISA 5.1 mais próximo,
> descreve a forma SVG implementada e justifica a decisão quando não existe equivalente direto.

---

## 1. Componentes canónicos (8 IDs do contrato)

| componenteId | Label UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificação |
|---|---|---|---|---|
| `bomba_captacao` | B. Captação | Pump — centrifugal (círculo com rotor) | Círculo com ponto central + 3 pás radiais | ISA 5.1 §5.3: bomba centrífuga representada por círculo com indicação de sentido de rotação. As pás radiais indicam movimento rotatório. |
| `reja_tamiz` | Reja/Tamiz | Screen / Strainer (linhas paralelas verticais) | 7 linhas verticais ligeiramente inclinadas + base horizontal | ISA 5.1 §5.6: filtro de partículas grosseiras representado por conjunto de barras paralelas. A inclinação sugere a posição de uma grelha de entrada. |
| `coagulacion` | Coagulação | Mixer / Inline mixer (câmara com agitador) | Retângulo com 3 divisórias verticais, entrada no topo, saída na base | ISA 5.1 não define coagulação como símbolo autónomo. Aproximação: câmara de mistura (mixing vessel) com canais de fluxo interno. |
| `decantador` | Decantador | Vessel — gravity separator | Círculo com 2 eixos de simetria + círculo central de recolha de lodos | ISA 5.1 §5.7: separador de fases por gravidade. Forma circular indica decantador circular (Dortmund/Imhoff). O círculo interior representa o cone de extração de lodos. |
| `filtracion` | Filtração | Filter vessel (retângulo com meio filtrante) | Retângulo com linha de separação + 5 círculos representando grãos de areia | ISA 5.1 §5.6: vessel de filtração. Os círculos no interior representam o leito filtrante de areia/antracite. |
| `desinfeccion` | Desinfeção | Chemical injection point / UV reactor | Retângulo com indicação "UV" e linha tracejada (radiação) | ISA 5.1 não define desinfeção UV como símbolo próprio. Aproximação: câmara de reação com identificação de agente (UV). A linha tracejada representa radiação ultravioleta. |
| `reservorio` | Reservório | Storage vessel — open top | Retângulo largo com linha de nível médio | ISA 5.1 §5.7: tanque de armazenamento aberto. A largura maior que a altura indica grande capacidade de reserva. A linha interna representa o nível nominal de operação. |
| `bomba_distribucion` | B. Distribuição | Pump — centrifugal | Idêntico a `bomba_captacao` | ISA 5.1 §5.3: mesma forma que qualquer bomba centrífuga. A distinção entre captação e distribuição é feita por posição no diagrama e etiqueta, não por forma — conforme ISA 5.1. |

---

## 2. Grupo Bombagem (paleta expandida)

| componenteId | Label UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificação |
|---|---|---|---|---|
| `bomba_centrifuga` | B. Centrífuga | Pump — centrifugal | Círculo + ponto central + 3 pás | ISA 5.1 §5.3 — símbolo canónico. |
| `bomba_dosificadora` | B. Doseadora | Pump — positive displacement / metering | Retângulo com círculo interno + duas saídas laterais + linha de dosagem | ISA 5.1 §5.3: bomba de deslocamento positivo indicada por forma retangular com elemento de pistão. As linhas laterais representam as ligações de aspiração e descarga. |
| `bomba_vacio` | B. Vácuo | Pump — vacuum / liquid ring | Elipse com linha tracejada horizontal (vácuo) + conexões topo/base | ISA 5.1 não distingue bomba de vácuo com símbolo próprio. Aproximação: elipse (diferencia de centrífuga) com tracejado indicando fase gasosa aspirada. |
| `bomba_sumergible` | B. Submersa | Pump — submersible | Retângulo vertical (carcaça estanque) + círculo interior + linha de fundo dupla | ISA 5.1 §5.3: nota de campo — bomba submersa representada com carcaça fechada. As linhas duplas na base indicam lâmina de água. |
| `bomba_peristaltica` | B. Peristáltica | Pump — peristaltic | Círculo com 3 roletes (preenchidos) + conexões esquerda/direita | ISA 5.1 não tem símbolo específico. Aproximação: roda peristáltica com 3 roletes de compressão, conforme prática comum em P&ID de indústria farmacêutica. |
| `bomba_tornillo` | B. Parafuso | Pump — screw / progressive cavity | Retângulo horizontal com curva sinusoidal dupla (parafuso de Arquimedes) | ISA 5.1 §5.3: bomba de cavidade progressiva. A sinusoide representa o perfil do parafuso hélicoidal. |

---

## 3. Grupo Filtragem

| componenteId | Label UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificação |
|---|---|---|---|---|
| `filtro_arena` | F. Areia | Filter vessel — granular media | Retângulo + linha divisória + 5 grãos (círculos) | ISA 5.1 §5.6: leito filtrante granular. Idêntico ao `filtracion` canónico. |
| `filtro_antracita` | F. Antracite | Filter vessel — dual media | Retângulo + 2 linhas de separação + blocos rectangulares de antracite | ISA 5.1 §5.6: filtro de duplo meio (areia + antracite). As 2 linhas de separação distinguem as camadas. |
| `filtro_cartucho` | F. Cartucho | Filter — cartridge | Retângulo estreito e alto (cartucho) + 4 linhas horizontais (plissados) | ISA 5.1 §5.6: filtro de cartucho pleated. As linhas horizontais representam as pregas filtrantes. |
| `filtro_manga` | F. Manga | Filter — bag/sock | Forma trapeizoidal fechada em baixo (manga) + 2 costuras tracejadas | ISA 5.1 §5.6: filtro de manga. A forma arredondada na base indica saco colector. |
| `filtro_uv` | F. UV | UV disinfection chamber | Retângulo com etiqueta "UV" + linha tracejada central (feixe UV) | ISA 5.1 não define. Prática comum em P&ID de ETAs: câmara retangular com indicação de radiação (tracejado). |
| `membrana_uf` | Membrana UF | Membrane separator — ultrafiltration | Retângulo com 6 linhas verticais (fibras ocas) + linha horizontal de separação | ISA 5.1 §5.6: separador por membrana. As linhas verticais representam as fibras ocas da UF. A linha horizontal indica a barreira de pressão transmembrana. |

---

## 4. Grupo Tanques

| componenteId | Label UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificação |
|---|---|---|---|---|
| `tanque_agua_cruda` | T. Água Bruta | Storage vessel — open, with inlet | Retângulo com ellipse no topo (entrada aberta) + 2 linhas de nível | ISA 5.1 §5.7: tanque de água bruta (entrada no topo). As linhas de nível indicam as marcas de operação. |
| `tanque_pac` | T. PAC | Chemical storage vessel — reagent | Retângulo com ellipse no topo + etiqueta "PAC" | ISA 5.1 §5.7: tanque de reagente químico identificado por etiqueta. O PAC (Policloreto de Alumínio) é o coagulante. |
| `tanque_cloro` | T. Cloro | Pressure vessel — gas/liquid chlorine | Círculo (pressurizado) + etiqueta "Cl₂" | ISA 5.1 §5.7: recipiente pressurizado (cilindro de gás ou tanque de hipoclorito). O círculo (vs. retângulo) indica contentor pressurizado conforme ISA 5.1. |
| `tanque_lodos` | T. Lodos | Sludge vessel — conical bottom | Forma trapezoidal invertida (cone de lodos) + ellipse no topo + nível tracejado | ISA 5.1 §5.7: tanque de lodos com fundo cónico para extração gravitacional. A linha tracejada indica a interface lodo/sobrenadante. |
| `reservorio` | Reservório | Storage vessel — open top | Ver secção 1. | — |
| `cisterna` | Cisterna | Underground storage vessel | Forma cilíndrica (elipses topo e base + laterais) | ISA 5.1 §5.7: cisterna enterrada ou cisterna horizontal. A forma elítica em topo e base indica recipiente cilíndrico deitado ou enterrado. |

---

## 5. Grupo Tratamento

| componenteId | Label UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificação |
|---|---|---|---|---|
| `coagulador` | Coagulador | Mixing vessel — rapid mix | Retângulo com 3 câmaras + entrada topo + saída base | ISA 5.1 não tem símbolo direto. Aproximação: câmara de mistura rápida com divisórias de fluxo em plug-flow. |
| `floculador` | Floculador | Mixing vessel — slow mix / flocculation | Retângulo com agitador central (linha vertical) + 3 curvas de fluxo | ISA 5.1 §5.4: agitador em câmara fechada. As curvas representam fluxo laminar de baixa velocidade (floculação gentil). |
| `decantador_laminar` | Dec. Laminar | Settler — lamella / tube settler | Trapézio (perfil de decantador) + 5 linhas de lamelas inclinadas | ISA 5.1 §5.7: decantador com módulos lamelares. As linhas inclinadas são a representação canónica de lamelas em P&ID. |
| `decantador_circular` | Dec. Circular | Settler — circular clarifier | Círculo + eixos de simetria + círculo central | ISA 5.1 §5.7: clarificador circular (Dortmund). Idêntico ao `decantador` canónico. |
| `reactor_biologico` | Reator Bio. | Bioreactor — aerobic | Retângulo arredondado + 3 círculos (biomassa) + conexões topo/base | ISA 5.1 não define reator biológico. Aproximação: vessel com indicação de fase biológica (círculos = flocos de biomassa). |
| `torre_aireacion` | Torre Aeração | Cooling tower / aeration tower | Retângulo alto + grelhas horizontais internas + curva de respingo | ISA 5.1 §5.7: torre de aeração. As grelhas internas representam os distribuidores de água; a curva na base representa o respingo/dispersão. |

---

## 6. Grupo Medição

| componenteId | Label UI | Tag ISA 5.1 | Forma SVG implementada | Justificação |
|---|---|---|---|---|
| `caudalimetro` | Caudalímetro | FE / FT (Flow Element / Transmitter) | Círculo + curva sinusoidal (forma de onda de caudal) + conexões topo/base | ISA 5.1 §4: instrumentos de medição representados por círculo. A sinusoide indica variável de caudal (Flow). Tag recomendado: FIT (Flow Indicator Transmitter). |
| `manometro` | Manómetro | PI / PT (Pressure Indicator / Transmitter) | Círculo + ponteiro (linha diagonal) + ponto de pivô + marcas de escala | ISA 5.1 §4: manómetro — círculo com ponteiro. Forma diretamente derivada da ISA 5.1 Fig. 4-1. Tag recomendado: PIT. |
| `ph_sensor` | Sensor pH | AT (Analyzer Transmitter) — pH | Elipse vertical (eléctrodo) + conexão topo + etiqueta "pH" | ISA 5.1 §4: analisador de qualidade representado por elipse. A etiqueta "pH" identifica a variável. Tag: AIT-pH. |
| `orp_sensor` | Sensor ORP | AT (Analyzer Transmitter) — ORP | Elipse vertical + conexão topo + etiqueta "ORP" | ISA 5.1 §4: idem ao pH. ORP (Oxidation Reduction Potential) é variável de qualidade. Tag: AIT-ORP. |
| `turbidimetro` | Turbidímetro | AT (Analyzer Transmitter) — turbidity | Círculo + feixe incidente (linha sólida) + feixe disperso (linha tracejada) + ponto de dispersão | ISA 5.1 §4: analisador óptico. O feixe refletido a 90° representa o princípio nefelométrico (NTU). Tag: AIT-NTU. |
| `nivel_sensor` | Sensor Nível | LE / LT (Level Element / Transmitter) | Régua vertical (retângulo estreito) + marcas de nível + ponto de flutuador | ISA 5.1 §4: instrumento de nível. A régua com ponto de contato representa um sensor de nível por flutuador ou ultrassónico. Tag: LIT. |

---

## 7. Grupo Controlo

| componenteId | Label UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificação |
|---|---|---|---|---|
| `valvula_manual` | V. Manual | Valve — globe / manual | Duas setas em V (borboleta) + haste + volante (linha horizontal grossa) | ISA 5.1 §5.1: válvula manual representada por dois triângulos em V com volante no topo. Forma canónica ISA. |
| `valvula_motorizada` | V. Motorizada | Valve — motor operated (MOV) | Dois triângulos em V + haste + rectângulo de actuador eléctrico | ISA 5.1 §5.1: válvula com actuador eléctrico indicado por rectângulo sobre a haste. |
| `valvula_solenoide` | V. Solenóide | Valve — solenoid operated (SOV) | Dois triângulos em V + haste + elipse de solenóide com bobine | ISA 5.1 §5.1: válvula com actuador electromagnético indicado por elipse (solenóide). |
| `variador_frequencia` | Variador Freq | VFD (Variable Frequency Drive) | Rectângulo com curva de frequência variável + etiqueta "VFD" | ISA 5.1 não define VFD como símbolo de processo. Prática comum em P&ID: rectângulo com onda de frequência variável. |
| `plc` | PLC | Control system / shared controller | Rectângulo com dois blocos de E/S + linha de barramento + terminais de I/O | ISA 5.1 §4 / ISA 88: controlador partilhado representado por rectângulo com blocos de módulos de E/S. |

---

## 8. Grupo Estrutura

| componenteId | Label UI | Símbolo ISA 5.1 | Forma SVG implementada | Justificação |
|---|---|---|---|---|
| `reja_tamiz` | Reja/Tamiz | Screen (ver secção 1) | Ver secção 1 | — |
| `reja_gruesa` | Reja Grossa | Coarse screen | 5 barras verticais espessas + base horizontal | ISA 5.1 §5.6: grelha de desbaste. Barras mais espessas e espaçadas que a reja fina. |
| `reja_fina` | Reja Fina | Fine screen / microscreen | 7 barras verticais finas + base horizontal | ISA 5.1 §5.6: grelha de pré-filtração. Mais barras e mais finas que a reja grossa. |
| `canal_entrada` | Canal Entrada | Open channel — flow | Perfil em U aberto + curva de superfície livre | ISA 5.1 não define canal aberto. Aproximação: perfil trapezoidal de canal com indicação de superfície livre (curva sinusoidal). |
| `pozo_bombeo` | Poço Bombagem | Wet well / pump sump | Cilindro vertical (elipses topo e base + laterais) + conexão de entrada | ISA 5.1 §5.7: poço húmido de estação elevatória. Forma cilíndrica vertical distingue-o da cisterna horizontal. |
| `caixa_distribuicao` | Cx. Distribuição | Distribution box / splitter | Quadrado com 4 conexões (topo, esquerda, direita, base) + círculo central de distribuição | ISA 5.1 não define caixa de distribuição. Aproximação: junction box com 4 saídas simétricas, conforme prática em P&ID de redes de distribuição. |

---

## Notas gerais

1. **Escala de visualização**: todos os ícones são renderizados em `viewBox="0 0 48 48"` dentro de uma célula de `80 × 72 px` no canvas SVG.
2. **Cor e estado**: a cor do stroke de cada símbolo reflecte o estado de alerta (`#00e87a` OK, `#f5a623` aviso, `#ff3d5a` crítico), conforme ISA 101 — ver `docs/hmi-decisions.md`.
3. **Etiquetas de identificação**: ISA 5.1 §3 define as tags de instrumentação (FIT, PIT, AIT, LIT). O AquaSense usa `componenteId` em vez de tags ISA — a correspondência está na coluna "Tag ISA 5.1" acima.
4. **Componentes sem equivalente direto**: coagulação, desinfeção UV, VFD, PLC, caixa de distribuição e canal de entrada não têm símbolo próprio em ISA 5.1-2009. A forma usada é a aproximação mais comum em P&IDs de estações de tratamento de água (ETAs), conforme AWWA M49 e prática europeia EN ISO 10628.
