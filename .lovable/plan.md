

## Plano: Reformulação da Página Analytics API

### Resumo
Reestruturar completamente o dashboard de Analytics com: seletor de projetos API no cabeçalho, filtros de período com date picker customizado, KPI cards clicáveis que alteram os gráficos, nova organização das abas como sub-visões de "Visão Geral", e seção de Análise Detalhada com filtros combinados (lógica AND).

### 1. Expandir dados mockados (`src/data/mockData.ts`)

- Gerar dados granulares com `UsageEvent[]` (cerca de 200-300 eventos) associados a projetos, usuários, modelos e **endpoints** (`chat`, `file-ingestion`, `web-search`)
- Adicionar campo `endpoint` ao tipo `UsageEvent` em `types.ts`
- Criar funções utilitárias para filtrar e agregar os eventos por período, projeto, modelo, usuário e endpoint
- Os KPIs e gráficos serão todos calculados dinamicamente a partir desses eventos filtrados

### 2. Cabeçalho com CRUD de Projetos API e Período

- **Seletor multi-projeto**: Dropdown multi-select com checkboxes listando os projetos API da organização + opção "Todos"
- **Seletor de período**: Manter os botões Hoje/7d/Mês/Custom; ao clicar "Custom", abrir popover com dois date pickers (data inicial e final) usando o componente Calendar do shadcn
- **Botão Novo Projeto API**: Abre dialog/modal com formulário de criação (nome, descrição, grupos)
- Estado: `selectedProjects: string[]`, `period`, `customDateRange: {from, to}`

### 3. KPI Cards clicáveis

- Adicionar um estado `activeMetric: 'cost' | 'inputTokens' | 'outputTokens' | 'requests'`
- Cada KPI card será clicável (estilo botão toggle); ao clicar, altera `activeMetric`
- O card ativo recebe destaque visual (borda/glow)
- Custo Total fica sempre selecionado por padrão
- Os valores dos KPIs mudam conforme período e projetos selecionados

### 4. Reestruturar abas como sub-visões de "Visão Geral"

Substituir as abas atuais por 5 sub-visões sob o título "Visão Geral":
- **Por Custo** — Gráfico de área (custo por dia) — dados mudam conforme `activeMetric`
- **Por Modelo** — Pie chart + detalhamento em lista
- **Por Projeto** — Bar chart comparativo entre projetos
- **Por Usuário** — Tabela de consumo
- **Por Endpoint** — Bar chart ou pie chart mostrando distribuição por endpoint (chat, ingestão de arquivos, busca na web)

Todos os gráficos reagem a: projetos selecionados, período, e métrica ativa (KPI clicado).

### 5. Seção "Análise Detalhada"

No final da página, nova seção com:
- **Título**: "Análise Detalhada"
- **Filtros no cabeçalho do gráfico** (lado a lado): 4 dropdowns multi-select
  - Projeto → lista de projetos API
  - Usuário → lista de usuários
  - Modelo → lista de modelos
  - Endpoint → lista de endpoints
- **Gráfico de barras** único que mostra os dados filtrados
- Lógica AND: os filtros se combinam — só aparecem eventos que atendem todos os critérios selecionados simultaneamente
- Os filtros da seção de Análise Detalhada são independentes dos filtros do cabeçalho (período/projeto)

### Detalhes técnicos

**Arquivos modificados:**
- `src/data/types.ts` — adicionar `endpoint` ao `UsageEvent`, criar tipo `Endpoint`
- `src/data/mockData.ts` — gerar array de `UsageEvent[]` granulares, criar funções de filtragem/agregação
- `src/components/AnalyticsDashboard.tsx` — reescrever com toda a lógica de estado e novos componentes
- Usar componentes existentes: `Calendar`, `Popover`, `Checkbox`, `Select` do shadcn

**Novos estados no componente:**
```text
selectedProjects: string[]      (filtro de projetos)
period: 'today' | '7d' | 'month' | 'custom'
customRange: { from: Date, to: Date }
activeMetric: 'cost' | 'inputTokens' | 'outputTokens' | 'requests'
detailedFilters: { projects, users, models, endpoints }
```

