# AquaSense — Decisões de HMI (ISA 101)

> ISA 101-2015: *Human Machine Interfaces for Process Automation Systems*
> Este documento regista as decisões de design da interface HMI do AquaSense e justifica-as
> segundo a norma ISA 101 e boas práticas de ergonomia industrial.

---

## 1. Filosofia de design (ISA 101 §5)

ISA 101 define 4 níveis de prioridade de informação na HMI:

| Nível ISA 101 | Prioridade | Aplicação no AquaSense |
|---|---|---|
| Nível 1 — Overview | Estado geral da planta | Dashboard `/proyectos/:id` — sinóptico + badges de estado |
| Nível 2 — Unit | Estado de cada unidade de processo | Cards de componente com valor primário + cor de alerta |
| Nível 3 — Equipment | Detalhe de equipamento individual | Painel de telemetria em `/estado` (todos os parâmetros) |
| Nível 4 — Diagnostic | Diagnóstico e manutenção | `/alertas` — histórico com timestamps e severidade |

---

## 2. Hierarquia de alarmes (ISA 18.2 adaptada)

ISA 101 refere ISA 18.2 para gestão de alarmes. O AquaSense implementa 3 níveis:

### Nível 1 — CRÍTICO (vermelho `#ff3d5a`)

Condição que exige intervenção imediata. A planta pode parar ou causar dano.

| Parâmetro | Limite crítico | Componente |
|---|---|---|
| `nivelTanqueCloro` | < 10% | `desinfeccion` |
| `temperaturaMotor` | > 60 °C | `bomba_captacao`, `bomba_distribucion` |
| `nivel` (reservório) | < 30% ou > 90% | `reservorio` |
| `ph` | < 5.5 ou > 8.0 | `desinfeccion` |
| `cloroResidual` | < 0.1 mg/L | `desinfeccion` |

**Resposta na HMI**: stroke vermelho `#ff3d5a`, fill `rgba(255,61,90,0.08)`, alerta activa no badge do componente.

### Nível 2 — ALERTA (amarelo `#f5a623`)

Condição fora dos limites de operação normal. Requer atenção em minutos a horas.

| Parâmetro | Limite de alerta | Componente |
|---|---|---|
| `ph` | 6.0–7.5 (fora deste intervalo) | `coagulacion`, `desinfeccion` |
| `cloroResidual` | 0.2–2.0 mg/L (fora deste intervalo) | `desinfeccion` |
| `presionSuccion` | 0.5–2.0 bar (fora deste intervalo) | `bomba_captacao` |
| `turbidezSalida` | > 1.0 NTU | `filtracion` |
| `orp` | 650–750 mV (fora deste intervalo) | `desinfeccion` |
| `nivelTanqueCloro` | 10–20% | `desinfeccion` |

**Resposta na HMI**: stroke amarelo `#f5a623`, fill `rgba(245,166,35,0.08)`.

### Nível 3 — OK (verde `#00e87a`)

Todos os parâmetros dentro dos limites de operação normal.

**Resposta na HMI**: stroke verde `#00e87a`, fill `rgba(0,232,122,0.06)`.

### Estado sem dados (cinza `#00c8e8`)

Componente sem leituras activas (simulação inactiva ou componente não mapeado no estado).

**Resposta na HMI**: stroke ciano `#00c8e8` (cor base da aplicação), sem fill de alerta.

---

## 3. Paleta de cores ISA 101

ISA 101 §6.3 define princípios de cor para HMI industrial:

> "Colors shall be used to convey information, not as decoration. Background color shall be neutral."

### 3.1 Cores de estado (alarme)

| Estado | Hex | Uso |
|---|---|---|
| Crítico | `#ff3d5a` | Stroke + texto de componentes em falha crítica |
| Alerta | `#f5a623` | Stroke + texto de componentes em aviso |
| Normal | `#00e87a` | Stroke + texto de componentes operacionais |
| Inactivo / sem dados | `#00c8e8` | Stroke base quando não há estado |

**Conformidade ISA 101**: vermelho = emergência, amarelo/âmbar = aviso, verde = normal. O azul/ciano (`#00c8e8`) é reservado para cor neutra de interface (não tem significado de estado).

### 3.2 Fundo e contexto

| Elemento | Cor | Justificação ISA 101 |
|---|---|---|
| Fundo da aplicação | `#0a1628` (azul escuro quase negro) | ISA 101 §6.3: fundos escuros reduzem fadiga visual em operações 24/7 e aumentam contraste com elementos de estado |
| Fundo de cards | `#0d1f35` / `#1a2d45` | Tons neutros para não interferir com a cor de estado |
| Texto principal | `#e2e8f0` (quase branco) | Contraste WCAG AA mínimo 4.5:1 sobre fundos escuros |
| Texto secundário | `#8aaec8` | Informação de baixa prioridade (labels, unidades) |
| Canalizações / tubagens | `#00c8e8` com opacidade 0.35–0.6 | Cor neutra para estrutura — não confundir com estados de alarme |

### 3.3 Cores disponíveis para tubagens no editor

```
#00d4ff  — azul água (padrão para linhas de processo)
#00e87a  — verde (linhas de efluente tratado)
#f5a623  — âmbar (linhas de reagentes químicos)
#ff3d5a  — vermelho (linhas de emergência / bypass)
#ffffff  — branco (linhas auxiliares / instrumentação)
#8aaec8  — cinza-azul (linhas de retorno / drenagem)
```

ISA 5.1 §6: a cor das tubagens em P&ID indica o tipo de fluido. O AquaSense expõe estas cores ao operador no editor de layout.

---

## 4. Tempo de resposta de polling — justificação

### 4.1 Intervalo adoptado: 5000 ms (5 s)

O componente `Sinoptico.jsx` faz polling ao endpoint `/api/proyectos/:id/estado` a cada 5 segundos com cleanup no unmount:

```javascript
// Polling /estado a 5000ms, com cleanup no unmount
useEffect(() => {
  const interval = setInterval(() => fetchEstado(), 5000);
  return () => clearInterval(interval);
}, [projectId]);
```

### 4.2 Justificação técnica

| Critério | Valor | Fonte |
|---|---|---|
| Tempo de resposta do simulador Python | 5 s (intervalo de publicação) | `python/main.py` — loop com sleep 5s |
| Latência de persistência no backend | < 100 ms | H2 (dev) / PostgreSQL (prod) |
| Limiar de percepção humana para mudanças de estado | 1–3 s | ISA 101 §7.2: "display update rate shall match process dynamics" |
| Dinâmica do processo de tratamento de água | Minutos a horas | ETAs operam em regime quasi-estacionário |
| Custo de polling HTTP por cliente | ~1 req/5s = 720 req/h | Aceitável para 1–10 clientes simultâneos |

**Conclusão**: 5 s é o mínimo útil alinhado com o intervalo do simulador. Valores menores não trariam dados mais frescos; valores maiores criariam lag perceptível entre evento e visualização.

### 4.3 Comparação de alternativas

| Alternativa | Vantagem | Desvantagem | Motivo de rejeição |
|---|---|---|---|
| WebSocket | Tempo real verdadeiro, sem overhead de HTTP | Complexidade de infra (Railway WebSocket, CORS, reconnect) | Fora de escopo do TFG; 5 s é suficiente para ETAs |
| Server-Sent Events (SSE) | Unidireccional, mais simples que WS | Ainda requer suporte de infra adicional | Idem |
| Polling 1 s | Aparência mais "ao vivo" | 5× mais carga no servidor sem dados novos | Simulador publica de 5 em 5 s — dados repetidos |
| Polling 30 s | Mínima carga | Lag de até 30 s numa falha crítica | Inaceitável para alarmes de nível 1 |

---

## 5. Layout do sinóptico — decisões de design

### 5.1 Fluxo da esquerda para a direita

ISA 101 §8 e EEMUA 201 recomendam que o fluxo de processo seja representado da esquerda para a direita, de acordo com a convenção ocidental de leitura.

O sinóptico estático (fallback) respeita esta convenção:

```
Captação → Reja/Tamiz → Coagulação → Decantação → Filtração → Desinfeção → Reservório → Distribuição
  (60px)     (175px)     (295px)      (415px)      (535px)     (655px)       (775px)       (900px)
```

As coordenadas X aumentam da esquerda para a direita, representando o avanço do tratamento da água bruta para a água tratada.

### 5.2 Editor de layout livre (CanvasEditor)

O operador pode reposicionar componentes livremente no `CanvasEditor`. O sistema não impõe posições — apenas sugere o fluxo padrão como ponto de partida.

**Decisão**: não forçar layout automático (auto-layout) porque:
- ETAs reais têm geometrias variáveis (linha, anel, paralela)
- O operador conhece melhor o P&ID físico da sua instalação
- ISA 101 §8: "the layout shall reflect the physical arrangement of the process"

### 5.3 Conexões bézier

As tubagens são desenhadas como curvas cúbicas de Bézier (`C` em SVG path):

```
d = `M p1.x p1.y C cx p1.y, cx p2.y, p2.x p2.y`
onde cx = (p1.x + p2.x) / 2
```

**Justificação**: curvas bézier evitam colisões visuais entre linhas paralelas e produzem um diagrama mais legível que linhas ortogonais quando os componentes estão em posições arbitrárias.

### 5.4 Portos de conexão

Cada componente expõe 4 portos: `left`, `right`, `top`, `bottom`. O operador escolhe os portos de origem e destino ao criar uma tubagem.

**Justificação ISA 5.1**: as linhas de processo entram e saem dos símbolos pelos lados, não pelos vértices. Os 4 portos cobrem todas as direcções possíveis sem ambiguidade.

---

## 6. Overlay de simulação inactiva

Quando `simulacaoAtiva === false`, o sinóptico mostra um overlay semitransparente com:
- Ícone `◉` (indicador de estado parado)
- Mensagem explicativa

**Justificação ISA 101 §9**: a HMI deve indicar claramente quando os dados exibidos podem não ser actuais. O overlay previne que o operador interprete dados estáticos como estado real da planta.

---

## 7. Internacionalização

O AquaSense suporta múltiplos idiomas via `LanguageContext`. Todos os textos da HMI passam pela função `t()`. Os identificadores de componentes (`componenteId`) são sempre em espanhol (snake_case) — nunca traduzidos — para manter consistência com o contrato da API.

**Justificação**: ISA 101 §5 nota que os identificadores de equipamento (tags) não devem ser traduzidos; apenas os labels apresentados ao operador podem mudar com o idioma.

---

## 8. Acessibilidade (WCAG 2.1 AA)

Complementando a ISA 101, o AquaSense aplica as seguintes regras de acessibilidade:

| Regra | Implementação |
|---|---|
| Contraste mínimo 4.5:1 para texto normal | Verificado em Fase 1 — `index.css`, `Sinoptico.jsx`, `Topbar`, `Historico` |
| Contraste mínimo 3:1 para elementos gráficos grandes | Cores de estado (`#ff3d5a`, `#f5a623`, `#00e87a`) sobre fundos escuros cumprem este requisito |
| Não usar cor como único indicador | O estado de alerta é indicado por cor + label de texto + badge de count |
| Texto redimensionável | Interface em `rem` / `em`; SVG com `viewBox` escalável |
