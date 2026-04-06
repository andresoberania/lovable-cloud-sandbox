

## Plano: Cargo no Novo Grupo, Editar Grupo, Confirmação API Keys e Redesign Visual

### 1. Página Organização — Novo Grupo com Cargo (`src/components/SettingsView.tsx`)

No dialog de "+ Novo Grupo", ao selecionar um membro na lista, mostrar um dropdown/select ao lado do nome para escolher o cargo (Admin, Coordenador, Membro). O estado `newGroupMembers` passa de `string[]` para `{ userId: string; role: UserRole }[]`. Ao criar o grupo, os cargos são usados no `memberRoles`.

### 2. Página Organização — Botão Editar Grupo (`src/components/SettingsView.tsx`)

Adicionar um botão "Editar" (ícone Pencil) no header de cada grupo expandível, ao lado do nome. Ao clicar, abre um Dialog com os campos Nome e Descrição pré-preenchidos. Ao salvar, atualiza o estado `groups`.

### 3. API Keys — Confirmação antes de Revogar/Regenerar (`src/components/AnalyticsDashboard.tsx`)

Envolver os botões de "Revogar" e "Regenerar" em `AlertDialog` com mensagem de confirmação antes de executar a ação. Ex: "Tem certeza que deseja revogar esta API Key?" / "Tem certeza que deseja regenerar sua API Key?"

### 4. Redesign Visual — Estilo inspirado na referência (`src/index.css`)

A imagem mostra um layout escuro estilo ChatGPT/Claude com:
- Fundo mais escuro e quente (tons de cinza-escuro com leve tom quente)
- Sidebar quase preta com itens de cor neutra
- Cards e inputs com bordas sutis
- Texto principal claro, secundário em cinza médio
- Input de chat com fundo ligeiramente mais claro que o background
- Badge/tags com cores suaves

Ajustes nas CSS variables em `src/index.css`:
- `--background`: tom mais escuro (~`220 14% 8%`)
- `--card`: tom ligeiramente mais claro (`220 14% 11%`)
- `--sidebar-background`: quase preto (`220 14% 6%`)
- `--border`: mais sutil (`220 13% 15%`)
- `--chat-input`: input mais destacado (`220 13% 12%`)
- Revisar fontes e espaçamentos para ficarem mais limpos

### Arquivos modificados
- `src/components/SettingsView.tsx` — cargo no novo grupo + botão editar grupo
- `src/components/AnalyticsDashboard.tsx` — AlertDialog em revogar/regenerar API Keys
- `src/index.css` — ajuste de palette de cores para estilo mais escuro/elegante

