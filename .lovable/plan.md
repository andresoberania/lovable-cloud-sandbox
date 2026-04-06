

## Plano: Melhorias em Organização, Projetos Chat, Detalhes do Projeto e Analytics

### 1. Página Organização (`src/components/SettingsView.tsx`)

**StatCards clicáveis:**
- "Grupos" → scroll até a seção de Grupos (`scrollIntoView`)
- "Custo Mensal" → navegar para Analytics (`onNavigate('analytics')`)
- Receber prop `onNavigate` do `Index.tsx`

**Botão "+ Novo Grupo":**
- Acima da lista de grupos, botão que abre Dialog
- Campos: Nome, Descrição, multi-select de membros com campo de busca (filtrar `allUsers` por nome)
- Ao criar, adiciona grupo ao estado local

### 2. Página Projetos Chat (`src/components/ProjectsListView.tsx`)

**Ações por projeto (tornar privado, compartilhar, arquivar):**
- Adicionar dropdown/menu de 3 pontos em cada `ProjectCard` com opções: Tornar Privado, Compartilhar, Arquivar
- Estado local `projectsState` para permitir mutação dos projetos
- Funciona em todas as abas (Todos, Privados, Compartilhados, Arquivados)

**Popup "+ Novo Projeto":**
- Dialog com: Nome, Descrição, Contexto de Sistema, toggle Privado/Compartilhado
- Se compartilhado → multi-select de grupos da organização
- Ao criar, adiciona ao estado local

### 3. Detalhes do Projeto Chat (`src/components/ProjectDetailView.tsx`)

**Aba Chats:**
- Adicionar toggle Privado/Compartilhado no campo de chat inline (define visibilidade do chat que está sendo criado)
- Botão "+ Novo Chat" → AlertDialog confirmando que o chat atual será finalizado; ao confirmar, salva chat atual na lista e limpa o campo
- Separar lista de chats em duas seções: "Chats Privados" e "Chats Compartilhados"
- Botão para converter chat privado → compartilhado (e vice-versa)
- Botões Mover e Deletar → AlertDialog de confirmação antes da ação

**Aba Configurações:**
- Na seção "Grupos com Acesso", adicionar multi-select para adicionar/remover grupos (lista de todos os grupos com checkboxes)

**Aba Arquivos:**
- Botão Upload funcional: abre `<input type="file" multiple>` escondido, aceita todos os tipos
- Ao selecionar arquivos, adiciona-os ao estado local `uploadedFiles` e mostra na lista

**Aba Artefatos:**
- Adicionar texto explicativo: "Artefatos são documentos gerados pela conversa com a IA neste projeto."
- Adicionar botão Download em cada artefato (simula download com `Blob` + `URL.createObjectURL`)

### 4. Analytics API (`src/components/AnalyticsDashboard.tsx`)

**Popup "+ Novo Projeto API":**
- Adicionar campo multi-select com busca para escolher membros da organização que terão acesso ao projeto

### 5. Navegação (`src/pages/Index.tsx`)

- Passar `onNavigate` para `SettingsView` para permitir navegação ao Analytics
- Passar `onNavigate` para `ProjectsListView` se necessário

### Arquivos modificados
- `src/components/SettingsView.tsx` — StatCards clicáveis, botão Novo Grupo com Dialog
- `src/components/ProjectsListView.tsx` — ações por projeto, popup Novo Projeto completo
- `src/components/ProjectDetailView.tsx` — toggle visibilidade no chat, confirmações, seções separadas, upload funcional, download artefatos, grupos editáveis
- `src/components/AnalyticsDashboard.tsx` — multi-select de membros no Novo Projeto API
- `src/pages/Index.tsx` — passar props de navegação

