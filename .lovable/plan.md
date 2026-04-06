

## Plano: Melhorias em Organização, Analytics e Projetos Chat

### Resumo
Renomear "Configurações" para "Organização" com gestão de membros interativa, adicionar seções de API Keys e Gestão de Acesso no Analytics, filtro de data custom na Análise Detalhada, opção "Todos" nos filtros, botão deletar projeto, e reformular a aba Chats do projeto com chat inline, tipos privado/compartilhado e ações por chat.

---

### 1. Dados Mockados (`src/data/mockData.ts` + `src/data/types.ts`)

- Criar array `allUsers: User[]` com 6 usuários (já existem em USERS_DATA mas não como `User[]`)
- Criar mapa `groupMembers: Record<string, {userId, role}[]>` associando usuários a grupos
- Criar mapa `projectAPIMembers: Record<string, {userId, role}[]>` associando usuários a projetos API
- Criar tipo `APIKey` mockado: `{ id, maskedKey, userId, projectId, status, createdAt }`
- Gerar array `apiKeys: APIKey[]` com ~8 keys mockadas

### 2. Página Organização (`src/components/SettingsView.tsx`)

**Renomear**: "Configurações" → "Organização" (título + sidebar + header do Index)

**Grupos expandíveis**: Cada grupo vira um accordion/collapsible. Ao clicar, mostra lista de membros com:
- Nome, cargo (badge Admin/Coordenador/Membro)
- Botão de ações (dropdown) por membro com:
  - "Mudar cargo" → sub-menu com os 3 cargos
  - "Atribuir grupo" → multi-select com checkboxes dos grupos (toggle)
  - "Projetos de Chat" → lista dos projetos de chat que pertence

**Projetos API expandíveis**: Ao clicar, mostra membros com:
- Nome, cargo
- Botão "Atribuir Projeto de API" → multi-select com projetos API (adicionar/remover)

### 3. Analytics (`src/components/AnalyticsDashboard.tsx`)

**Visão Geral — Botão Deletar Projeto**: Na aba "Por Projeto", adicionar botão de deletar (ícone Trash2) ao lado de cada projeto no detalhamento, com dialog de confirmação.

**Análise Detalhada — Filtro de Data Custom**: Adicionar os mesmos botões de período (Hoje/7d/Mês/Custom) na seção de Análise Detalhada, com estado independente `detailedPeriod` e `detailedCustomRange`. Os eventos da análise detalhada passam por este filtro de data antes dos filtros de projeto/usuário/modelo/endpoint.

**Opção "Todos" nos filtros**: Em cada `MultiSelectDropdown`, adicionar item "Todos" no topo da lista que limpa a seleção (equivalente a "sem filtro").

**Seção Gestão de Acesso**: Botão/link que navega para a página Organização (seção Projetos API). Receber `onNavigate` como prop.

**Seção API Keys**: Nova seção no final do Analytics com:
- Tabela listando todas as API keys da org: usuário, projeto, status (ativa/revogada), data de criação, key mascarada
- Admin pode revogar qualquer key (botão)
- Usuário atual pode regenerar sua própria key (botão)
- Ninguém vê a key completa de outro usuário

### 4. Projetos Chat — Aba Chats (`src/components/ProjectDetailView.tsx`)

**Chat inline**: Campo de input no topo da aba para conversar diretamente (reutilizar lógica do ChatView). Mostra as últimas mensagens inline.

**Tipos de chat**: Cada chat tem badge visual:
- "Privado" (Lock icon) — só o criador vê
- "Compartilhado" (Users icon) — todos com acesso ao projeto veem

**Ações por chat** (botões visíveis em cada card):
- Continuar/Editar (abre o chat)
- Remover (dialog de confirmação)
- Mover para fora do projeto (remove vínculo)
- Mover para outro projeto (dropdown com lista de projetos)

### 5. Navegação (`src/pages/Index.tsx` + `src/components/AppSidebar.tsx`)

- Renomear label "Configurações" → "Organização" na sidebar
- Renomear no header "Configurações" → "Organização"
- Passar `onNavigate` para `AnalyticsDashboard` para permitir link para página Organização

### Arquivos modificados
- `src/data/types.ts` — novos tipos
- `src/data/mockData.ts` — novos dados mockados (membros, API keys)
- `src/components/SettingsView.tsx` — reescrever com accordions e ações
- `src/components/AnalyticsDashboard.tsx` — deletar projeto, filtro data na análise detalhada, "Todos", seções Gestão de Acesso e API Keys
- `src/components/ProjectDetailView.tsx` — reformular aba Chats
- `src/pages/Index.tsx` — renomear, passar props
- `src/components/AppSidebar.tsx` — renomear label

