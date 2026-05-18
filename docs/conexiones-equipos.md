# Mapa de Conexões Físicas — AquaSense ETAP

Documento técnico descrevendo o fluxo hidráulico e as conexões entre os equipamentos do processo de tratamento de água. Fonte de verdade para renderização de tubulações (tarefas 2 e 3).

**Versão**: 1.0 | **Data**: 2026-04-21
**Fonte**: Análise de simulator.py, AlertaService, Sinoptico.jsx, paletaItems.jsx

---

## Fluxo Principal: Água Bruta → Água Tratada

| Seq | fromComponenteId | toComponenteId | Tipo | Porto Origem | Porto Destino | Parâmetro Origem | Parâmetro Destino | Notas |
|-----|------------------|----------------|------|--------------|---------------|------------------|-------------------|-------|
| 1 | bomba_captacao | reja_tamiz | aguaCruda | descarga | alimentacao | caudal (12 m³/h) | turbidezEntrada (25–60 NTU) | Sucção da fonte; presionSuccion monitora cavitação |
| 2 | reja_tamiz | coagulacion | aguaCruda | salida | entrada | turbidez (10–60 NTU) | turbidez (5–15 NTU) | diferencialPresion indica colmatação |
| 3 | coagulacion | decantador | aguaCruda+PAC | salida | entrada | phPostCoagulacion (~6.8) | nivelLodo (40%) | Floculação e sedimentação |
| 4 | decantador | filtracion | aguaPartialmenteTratada | salida | entrada | caudalSalida (~11 m³/h) | turbidezSalida (0.8 NTU) | Clarificação prévia |
| 5 | filtracion | desinfeccion | aguaTratada | salida | entrada | turbidezSalida (0.1–3 NTU) | cloroResidual (0.3–1.5 mg/L) | Leito de areia; perdidaCarga monitora entupimento |
| 6 | desinfeccion | reservorio | aguaTratada | salida | entrada | cloroResidual (mg/L) | nivel (~50%) | Câmara UV + injeção de cloro |
| 7 | reservorio | bomba_distribucion | aguaTratada | salida | succion | nivel (20–98%) | caudal (10 m³/h) | Pressurização final para rede de consumo |

---

## Ligações Secundárias: Química, Purga e Venteo

| Seq | fromComponenteId | toComponenteId | Tipo | Porto Origem | Porto Destino | Parâmetro | Notas |
|-----|------------------|----------------|------|--------------|---------------|-----------|-------|
| 8 | tanque_pac | coagulacion | dosificacionQuimica | salida | entrada_pac | caudalDosificacion (2.5 L/h) | Bomba dosificadora; nivelTanquePAC crítico < 20% |
| 9 | tanque_cloro | desinfeccion | dosificacionQuimica | salida | entrada_cloro | nivelTanqueCloro | Bomba dosificadora; crítico < 10% → alerta CRITICA |
| 10 | decantador | tanque_lodos | purgaLodo | salida_lodos | entrada | nivelLodo | Descarga de sedimento; > 80% dispara limpeza |
| 11 | filtracion | tanque_lodos | retorno | salida_lavado | entrada | horasDesdelavado | Água de lavagem retrógrada (ciclo 24–48 h) |
| 12 | filtracion | exterior | venteo | ar_escape | exterior | — | Descompressão durante lavagem retrógrada |

---

## Portos por Geometria Real (para tarefa 3)

| Equipamento | Porto | Posição geométrica | Direção |
|---|---|---|---|
| bomba_captacao | succion | lateral esquerdo | entrada |
| bomba_captacao | descarga | lateral direito ou superior | saída |
| reja_tamiz | alimentacao | lateral esquerdo | entrada |
| reja_tamiz | salida | lateral direito | saída |
| coagulacion | entrada | lateral esquerdo | entrada |
| coagulacion | entrada_pac | superior | entrada (química) |
| coagulacion | salida | lateral direito | saída |
| decantador | entrada | superior | entrada |
| decantador | salida | lateral (rebose) | saída clarificada |
| decantador | salida_lodos | fundo | saída (purga) |
| filtracion | entrada | superior | entrada |
| filtracion | salida | inferior | saída (filtrada) |
| filtracion | salida_lavado | lateral | saída (retrolavado) |
| filtracion | ar_escape | topo | venteo |
| desinfeccion | entrada | lateral esquerdo | entrada |
| desinfeccion | entrada_cloro | superior | entrada (química) |
| desinfeccion | salida | lateral direito | saída |
| reservorio | entrada | lateral superior | entrada |
| reservorio | salida | fundo ou lateral inferior | saída |
| bomba_distribucion | succion | lateral esquerdo | entrada |
| bomba_distribucion | descarga | lateral direito ou superior | saída |

---

## Tipos de Fluido — Referência de Renderização (para tarefa 2)

| Tipo | Cor sugerida | Grosor SVG | Textura | Exemplo |
|---|---|---|---|---|
| aguaCruda | `#00d4ff` (azul claro) | 4px | nenhuma | bomba_captacao → reja_tamiz |
| aguaTratada | `#00e87a` (verde) | 4px | nenhuma | filtracion → desinfeccion → reservorio |
| dosificacionQuimica | `#f5a623` (âmbar) | 2px | tracejado curto | tanque_pac → coagulacion |
| purgaLodo | `#8aaec8` (cinza-azul) | 3px | nenhuma | decantador → tanque_lodos |
| retorno | `#8aaec8` (cinza-azul) | 2px | tracejado longo | filtracion → tanque_lodos |
| venteo | `#ffffff` (branco) | 1px | pontilhado | filtracion → exterior |

---

## Parâmetros Críticos por Conexão

| Conexão | Parâmetro | Limiar | Ação associada |
|---|---|---|---|
| bomba_captacao → reja_tamiz | presionSuccion | < 0.8 bar | Verificar obstrução de entrada |
| reja_tamiz → coagulacion | diferencialPresion | > 0.5 bar | Limpeza / retrolavado da reja |
| coagulacion → decantador | phPostCoagulacion | < 6.0 | Aumentar dosagem PAC |
| decantador → filtracion | turbidezSalida | > 10 NTU | Limpeza do decantador |
| filtracion → desinfeccion | perdidaCarga | > 2.5 m | Lavagem retrógrada do filtro |
| desinfeccion → reservorio | cloroResidual | < 0.5 mg/L | Aumentar dosagem de cloro |
| reservorio → bomba_distribucion | nivel | > 95% | Fechar válvula de entrada |
