

## Plano: Reformulação da Página Analytics API

### Resumo
Reestruturar o dashboard de Analytics com seletor multi-projeto, filtros de período com date picker, KPI cards clicáveis, sub-visões de "Visão Geral" (incluindo Endpoint), e seção de Análise Detalhada com filtros combinados (lógica AND).

### 1. Atualizar tipos e dados mockados

**`src/data/types.ts`**: Adicionar `endpoint` ao `UsageEvent`, criar tipo `Endpoint = 'chat' | 'file-ingestion' | 'web-search'`

**`src/data/mockData.ts`**: Gerar ~250 `UsageEvent[]` granulares com endpoints, e funções utilitárias de filtragem/agregação por período, projeto, modelo, usuário e endpoint.

### 2. Reescrever `src/components/AnalyticsDashboard.tsx`

- **Cabeçalho**: Seletor multi-projeto (dropdown com checkboxes), botões de período (Hoje/7d/Mês/Custom com Calendar popover), botão "Novo Projeto API" (dialog com formulário)
- **KPI Cards clicáveis**: Estado `activeMetric`, card ativo com destaque visual, valores recalculados dinamicamente
- **5 sub-visões "Visão Geral"**: Por Custo (area chart), Por Modelo (pie), Por Projeto (bar), Por Usuário (tabela), Por Endpoint (bar/pie) -- todas reativas aos filtros e métrica ativa
- **Seção "Análise Detalhada"**: 4 dropdowns multi-select independentes (Projeto, Usuário, Modelo, Endpoint) + gráfico de barras com lógica AND

### Detalhes técnicos

Arquivos modificados: `src/data/types.ts`, `src/data/mockData.ts`, `src/components/AnalyticsDashboard.tsx`

Componentes shadcn utilizados: `Calendar`, `Popover`, `Checkbox`, `Dialog`

