import type { User, Organization, Group, Chat, ChatMessage, Assistant, Artifact, ProjectFile, ProjectChat, ProjectAPI, UsageEvent, Endpoint } from './types';

export const currentUser: User = {
  id: 'u1',
  name: 'André Silva',
  email: 'andre@empresa.com',
  role: 'admin',
};

export const organization: Organization = {
  id: 'org1',
  name: 'TechCorp Brasil',
  description: 'Empresa de tecnologia líder em IA',
  totalGroups: 4,
  totalProjects: 8,
  totalUsers: 32,
  monthlyCost: 12450.80,
};

export const groups: Group[] = [
  { id: 'g1', name: 'Engenharia', description: 'Time de engenharia de software', orgId: 'org1', memberCount: 12, coordinators: ['Carlos Mendes'], projectsLinked: 3 },
  { id: 'g2', name: 'Marketing', description: 'Equipe de marketing digital', orgId: 'org1', memberCount: 8, coordinators: ['Ana Costa'], projectsLinked: 2 },
  { id: 'g3', name: 'Jurídico', description: 'Departamento jurídico', orgId: 'org1', memberCount: 5, coordinators: ['Dr. Roberto Lima'], projectsLinked: 2 },
  { id: 'g4', name: 'Produto', description: 'Gestão de produto', orgId: 'org1', memberCount: 7, coordinators: ['Mariana Souza'], projectsLinked: 3 },
];

const makeMessages = (pairs: [string, string][]): ChatMessage[] => {
  const msgs: ChatMessage[] = [];
  let i = 0;
  for (const [q, a] of pairs) {
    msgs.push({ id: `m${i++}`, role: 'user', content: q, timestamp: new Date(2026, 3, 3, 10 + i, 0) });
    msgs.push({ id: `m${i++}`, role: 'assistant', content: a, timestamp: new Date(2026, 3, 3, 10 + i, 1), model: 'SoberanIA-4o' });
  }
  return msgs;
};

export const chats: Chat[] = [
  {
    id: 'c1', title: 'Análise de Contratos Q1', projectId: 'p3', isPrivate: false, createdBy: 'u1',
    createdAt: new Date(2026, 3, 1), updatedAt: new Date(2026, 3, 3),
    messages: makeMessages([
      ['Analise as cláusulas de rescisão do contrato anexo.', 'Com base no contrato fornecido, identifiquei 3 cláusulas de rescisão principais:\n\n**Cláusula 8.1** — Rescisão sem justa causa com aviso prévio de 30 dias e multa de 10%.\n\n**Cláusula 8.2** — Rescisão por justa causa em caso de descumprimento, sem multa.\n\n**Cláusula 8.3** — Rescisão por força maior, com suspensão de obrigações por até 90 dias.\n\nRecomendo revisar a Cláusula 8.1, pois a multa de 10% está abaixo do padrão de mercado (15-20%).'],
      ['Quais artigos do Código Civil se aplicam?', 'Os artigos relevantes do Código Civil brasileiro são:\n\n- **Art. 473** — Resilição unilateral\n- **Art. 474** — Cláusula resolutiva expressa\n- **Art. 475** — Resolução por inadimplemento\n- **Art. 393** — Caso fortuito e força maior'],
    ]),
  },
  {
    id: 'c2', title: 'Estratégia de Conteúdo Maio', projectId: 'p2', isPrivate: false, createdBy: 'u1',
    createdAt: new Date(2026, 3, 2), updatedAt: new Date(2026, 3, 4),
    messages: makeMessages([
      ['Crie um calendário editorial para maio focado em IA generativa.', '## Calendário Editorial — Maio 2026\n\n**Semana 1**: Blog + LinkedIn\n**Semana 2**: Case Study + Webinar\n**Semana 3**: Prompt Engineering\n**Semana 4**: Compilação'],
    ]),
  },
  {
    id: 'c3', title: 'Refatoração Microserviços', projectId: 'p1', isPrivate: false, createdBy: 'u1',
    createdAt: new Date(2026, 2, 28), updatedAt: new Date(2026, 3, 5),
    messages: makeMessages([
      ['Sugira uma arquitetura para migrar nosso monolito para microserviços.', '## Proposta\n\n### Fase 1 — Strangler Fig\n1. Auth Service\n2. User Service\n3. Billing Service\n\n### Fase 2 — Core\n4. Chat Service\n5. AI Gateway\n6. Analytics Service'],
    ]),
  },
  {
    id: 'c4', title: 'Brainstorm produto v3', projectId: undefined, isPrivate: false, createdBy: 'u1',
    createdAt: new Date(2026, 3, 4), updatedAt: new Date(2026, 3, 5),
    messages: makeMessages([
      ['Quais features devemos priorizar para a v3?', '🔥 Alta: Multimodal, Workflows, RAG avançado\n⚡ Média: Templates, Integrações\n📊 Backlog: API analytics, Previsão de custos'],
    ]),
  },
  {
    id: 'c5', title: 'Rascunho NDA', projectId: 'p3', isPrivate: true, createdBy: 'u1',
    createdAt: new Date(2026, 3, 5), updatedAt: new Date(2026, 3, 5),
    messages: makeMessages([
      ['Me ajude a rascunhar um NDA bilateral.', '**ACORDO DE CONFIDENCIALIDADE BILATERAL**\n\n1. Definição de Informação Confidencial\n2. Obrigações\n3. Prazo: 2 anos\n4. Exceções'],
    ]),
  },
];

export const projectsChat: ProjectChat[] = [
  { id: 'p1', name: 'Plataforma v2 — Engenharia', description: 'Desenvolvimento da nova versão', orgId: 'org1', ownerId: 'u1', status: 'ativo', systemContext: 'Você é um assistente técnico especializado em arquitetura de software.', isShared: true, groups: ['g1', 'g4'], createdAt: new Date(2026, 1, 15), updatedAt: new Date(2026, 3, 5) },
  { id: 'p2', name: 'Marketing Digital Q2', description: 'Campanhas e conteúdo para o Q2', orgId: 'org1', ownerId: 'u1', status: 'ativo', systemContext: 'Você é um especialista em marketing digital B2B SaaS.', isShared: true, groups: ['g2'], createdAt: new Date(2026, 2, 1), updatedAt: new Date(2026, 3, 4) },
  { id: 'p3', name: 'Análise Jurídica — Contratos', description: 'Revisão de contratos empresariais', orgId: 'org1', ownerId: 'u1', status: 'ativo', systemContext: 'Você é um assistente jurídico especializado em contratos.', isShared: true, groups: ['g3'], createdAt: new Date(2026, 2, 10), updatedAt: new Date(2026, 3, 5) },
  { id: 'p4', name: 'Pesquisa Pessoal', description: 'Espaço individual', orgId: 'org1', ownerId: 'u1', status: 'ativo', systemContext: '', isShared: false, groups: [], createdAt: new Date(2026, 3, 1), updatedAt: new Date(2026, 3, 5) },
  { id: 'p5', name: 'Onboarding Novos Clientes', description: 'Projeto arquivado', orgId: 'org1', ownerId: 'u1', status: 'arquivado', systemContext: '', isShared: true, groups: ['g4'], createdAt: new Date(2025, 10, 1), updatedAt: new Date(2026, 1, 15) },
];

export const projectsAPI: ProjectAPI[] = [
  { id: 'api1', name: 'Produção — Chat API', description: 'API principal de chat em produção', orgId: 'org1', status: 'ativo', groups: ['g1'], memberCount: 10, monthlyCost: 5420.30, createdAt: new Date(2026, 0, 10) },
  { id: 'api2', name: 'Staging — Testes', description: 'Ambiente de testes', orgId: 'org1', status: 'ativo', groups: ['g1', 'g4'], memberCount: 6, monthlyCost: 1230.50, createdAt: new Date(2026, 1, 5) },
  { id: 'api3', name: 'Marketing Bot', description: 'Bot para automação de marketing', orgId: 'org1', status: 'ativo', groups: ['g2'], memberCount: 4, monthlyCost: 890.00, createdAt: new Date(2026, 2, 1) },
];

export const assistants: Assistant[] = [
  { id: 'a1', name: 'Arquiteto de Software', instructions: 'Foque em arquitetura escalável.', projectId: 'p1', createdBy: 'u1', preferredModel: 'SoberanIA-4o', status: 'ativo', icon: '🏗️' },
  { id: 'a2', name: 'Code Reviewer', instructions: 'Revise código com foco em qualidade.', projectId: 'p1', createdBy: 'u1', preferredModel: 'SoberanIA-4o', status: 'ativo', icon: '🔍' },
  { id: 'a3', name: 'Redator de Copy', instructions: 'Escreva textos persuasivos B2B.', projectId: 'p2', createdBy: 'u1', status: 'ativo', icon: '✍️' },
  { id: 'a4', name: 'Analista de Métricas', instructions: 'Interprete dados de campanha.', projectId: 'p2', createdBy: 'u1', status: 'ativo', icon: '📊' },
  { id: 'a5', name: 'Consultor Jurídico', instructions: 'Analise contratos e cite legislação.', projectId: 'p3', createdBy: 'u1', preferredModel: 'SoberanIA-4o', status: 'ativo', icon: '⚖️' },
];

export const artifacts: Artifact[] = [
  { id: 'art1', name: 'Arquitetura Microserviços v2', type: 'diagram', projectId: 'p1', version: 3, createdBy: 'u1', createdAt: new Date(2026, 2, 20), updatedAt: new Date(2026, 3, 5) },
  { id: 'art2', name: 'Relatório de Performance Q1', type: 'report', projectId: 'p1', version: 1, createdBy: 'u1', createdAt: new Date(2026, 3, 1), updatedAt: new Date(2026, 3, 1) },
  { id: 'art3', name: 'Calendário Editorial Maio', type: 'document', projectId: 'p2', version: 2, createdBy: 'u1', createdAt: new Date(2026, 3, 2), updatedAt: new Date(2026, 3, 4) },
  { id: 'art4', name: 'Template NDA Bilateral', type: 'document', projectId: 'p3', version: 1, createdBy: 'u1', createdAt: new Date(2026, 3, 5), updatedAt: new Date(2026, 3, 5) },
  { id: 'art5', name: 'Script de Migração DB', type: 'code', projectId: 'p1', version: 5, createdBy: 'u1', createdAt: new Date(2026, 2, 15), updatedAt: new Date(2026, 3, 3) },
];

export const projectFiles: ProjectFile[] = [
  { id: 'f1', name: 'contrato-fornecedor-2026.pdf', size: 2400000, type: 'application/pdf', projectId: 'p3', uploadedBy: 'u1', uploadedAt: new Date(2026, 3, 1) },
  { id: 'f2', name: 'termos-servico-v3.docx', size: 580000, type: 'application/docx', projectId: 'p3', uploadedBy: 'u1', uploadedAt: new Date(2026, 3, 2) },
  { id: 'f3', name: 'arquitetura-atual.png', size: 1200000, type: 'image/png', projectId: 'p1', uploadedBy: 'u1', uploadedAt: new Date(2026, 2, 20) },
  { id: 'f4', name: 'metricas-campanha-q1.csv', size: 340000, type: 'text/csv', projectId: 'p2', uploadedBy: 'u1', uploadedAt: new Date(2026, 3, 3) },
  { id: 'f5', name: 'brand-guidelines.pdf', size: 8900000, type: 'application/pdf', projectId: 'p2', uploadedBy: 'u1', uploadedAt: new Date(2026, 2, 15) },
];

// ========== USAGE EVENTS (granular mock data) ==========

const USERS_DATA = [
  { id: 'u1', name: 'André Silva', email: 'andre@empresa.com', role: 'Admin' },
  { id: 'u2', name: 'Carlos Mendes', email: 'carlos@empresa.com', role: 'Coordenador' },
  { id: 'u3', name: 'Ana Costa', email: 'ana@empresa.com', role: 'Coordenador' },
  { id: 'u4', name: 'Rafael Santos', email: 'rafael@empresa.com', role: 'Membro' },
  { id: 'u5', name: 'Juliana Pereira', email: 'juliana@empresa.com', role: 'Membro' },
  { id: 'u6', name: 'Pedro Almeida', email: 'pedro@empresa.com', role: 'Membro' },
];

const MODELS = ['SoberanIA-4o', 'SoberanIA-4o-mini', 'SoberanIA-3.5', 'SoberanIA-Vision'];
const ENDPOINTS: Endpoint[] = ['chat', 'file-ingestion', 'web-search'];
const PROJECTS_API_DATA = projectsAPI;

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateUsageEvents(): UsageEvent[] {
  const events: UsageEvent[] = [];
  let id = 0;
  const baseDate = new Date(2026, 3, 6); // April 6, 2026

  for (let dayOffset = 0; dayOffset < 45; dayOffset++) {
    const day = new Date(baseDate);
    day.setDate(day.getDate() - dayOffset);

    const eventsPerDay = 4 + Math.floor(seededRandom(dayOffset * 7) * 6);

    for (let e = 0; e < eventsPerDay; e++) {
      const seed = dayOffset * 100 + e;
      const user = USERS_DATA[Math.floor(seededRandom(seed) * USERS_DATA.length)];
      const project = PROJECTS_API_DATA[Math.floor(seededRandom(seed + 1) * PROJECTS_API_DATA.length)];
      const model = MODELS[Math.floor(seededRandom(seed + 2) * MODELS.length)];
      const endpoint = ENDPOINTS[Math.floor(seededRandom(seed + 3) * ENDPOINTS.length)];

      const inputTokens = Math.floor(500 + seededRandom(seed + 4) * 15000);
      const outputTokens = Math.floor(200 + seededRandom(seed + 5) * 8000);

      const costPerInputToken = model === 'SoberanIA-4o' ? 0.00003 : model === 'SoberanIA-4o-mini' ? 0.000015 : model === 'SoberanIA-Vision' ? 0.00004 : 0.00001;
      const costPerOutputToken = costPerInputToken * 2;
      const cost = Math.round((inputTokens * costPerInputToken + outputTokens * costPerOutputToken) * 100) / 100;

      const timestamp = new Date(day);
      timestamp.setHours(8 + Math.floor(seededRandom(seed + 6) * 12), Math.floor(seededRandom(seed + 7) * 60));

      events.push({
        id: `evt-${id++}`,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        projectId: project.id,
        projectName: project.name,
        model,
        endpoint,
        inputTokens,
        outputTokens,
        cost,
        timestamp,
      });
    }
  }

  return events;
}

export const usageEvents: UsageEvent[] = generateUsageEvents();

// ========== AGGREGATION UTILITIES ==========

export function filterEventsByPeriod(events: UsageEvent[], period: 'today' | '7d' | 'month' | 'custom', customRange?: { from: Date; to: Date }): UsageEvent[] {
  const now = new Date(2026, 3, 6); // Fixed "now" for mock data
  let start: Date;
  let end = new Date(now);
  end.setHours(23, 59, 59, 999);

  switch (period) {
    case 'today':
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      break;
    case '7d':
      start = new Date(now);
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start = new Date(now);
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      break;
    case 'custom':
      if (customRange) {
        start = new Date(customRange.from);
        start.setHours(0, 0, 0, 0);
        end = new Date(customRange.to);
        end.setHours(23, 59, 59, 999);
      } else {
        start = new Date(now);
        start.setDate(start.getDate() - 29);
        start.setHours(0, 0, 0, 0);
      }
      break;
  }

  return events.filter(e => e.timestamp >= start && e.timestamp <= end);
}

export function filterEventsByProjects(events: UsageEvent[], projectIds: string[]): UsageEvent[] {
  if (projectIds.length === 0) return events;
  return events.filter(e => projectIds.includes(e.projectId));
}

export function aggregateKPIs(events: UsageEvent[]) {
  return {
    totalCost: events.reduce((s, e) => s + e.cost, 0),
    totalInputTokens: events.reduce((s, e) => s + e.inputTokens, 0),
    totalOutputTokens: events.reduce((s, e) => s + e.outputTokens, 0),
    totalRequests: events.length,
  };
}

export function aggregateByDay(events: UsageEvent[], metric: 'cost' | 'inputTokens' | 'outputTokens' | 'requests') {
  const map = new Map<string, number>();
  for (const e of events) {
    const key = e.timestamp.toISOString().split('T')[0];
    const val = metric === 'cost' ? e.cost : metric === 'inputTokens' ? e.inputTokens : metric === 'outputTokens' ? e.outputTokens : 1;
    map.set(key, (map.get(key) || 0) + val);
  }
  return Array.from(map.entries()).map(([date, value]) => ({ date, value })).sort((a, b) => a.date.localeCompare(b.date));
}

export function aggregateByModel(events: UsageEvent[], metric: 'cost' | 'inputTokens' | 'outputTokens' | 'requests') {
  const map = new Map<string, { value: number; tokens: number; requests: number; cost: number }>();
  for (const e of events) {
    const prev = map.get(e.model) || { value: 0, tokens: 0, requests: 0, cost: 0 };
    const val = metric === 'cost' ? e.cost : metric === 'inputTokens' ? e.inputTokens : metric === 'outputTokens' ? e.outputTokens : 1;
    map.set(e.model, {
      value: prev.value + val,
      tokens: prev.tokens + e.inputTokens + e.outputTokens,
      requests: prev.requests + 1,
      cost: prev.cost + e.cost,
    });
  }
  const total = Array.from(map.values()).reduce((s, v) => s + v.value, 0);
  return Array.from(map.entries()).map(([model, d]) => ({
    model,
    value: d.value,
    tokens: d.tokens,
    requests: d.requests,
    cost: d.cost,
    percentage: total > 0 ? Math.round((d.value / total) * 1000) / 10 : 0,
  }));
}

export function aggregateByProject(events: UsageEvent[], metric: 'cost' | 'inputTokens' | 'outputTokens' | 'requests') {
  const map = new Map<string, { value: number; tokens: number; requests: number; cost: number }>();
  for (const e of events) {
    const prev = map.get(e.projectName) || { value: 0, tokens: 0, requests: 0, cost: 0 };
    const val = metric === 'cost' ? e.cost : metric === 'inputTokens' ? e.inputTokens : metric === 'outputTokens' ? e.outputTokens : 1;
    map.set(e.projectName, {
      value: prev.value + val,
      tokens: prev.tokens + e.inputTokens + e.outputTokens,
      requests: prev.requests + 1,
      cost: prev.cost + e.cost,
    });
  }
  const total = Array.from(map.values()).reduce((s, v) => s + v.value, 0);
  return Array.from(map.entries()).map(([project, d]) => ({
    project,
    value: d.value,
    tokens: d.tokens,
    requests: d.requests,
    cost: d.cost,
    percentage: total > 0 ? Math.round((d.value / total) * 1000) / 10 : 0,
  }));
}

export function aggregateByUser(events: UsageEvent[], metric: 'cost' | 'inputTokens' | 'outputTokens' | 'requests') {
  const map = new Map<string, { name: string; email: string; role: string; value: number; tokens: number; requests: number; cost: number }>();
  for (const e of events) {
    const prev = map.get(e.userId) || { name: e.userName, email: e.userEmail, role: e.userRole, value: 0, tokens: 0, requests: 0, cost: 0 };
    const val = metric === 'cost' ? e.cost : metric === 'inputTokens' ? e.inputTokens : metric === 'outputTokens' ? e.outputTokens : 1;
    map.set(e.userId, {
      ...prev,
      value: prev.value + val,
      tokens: prev.tokens + e.inputTokens + e.outputTokens,
      requests: prev.requests + 1,
      cost: prev.cost + e.cost,
    });
  }
  return Array.from(map.values()).map(u => ({
    ...u,
    avgCostPerRequest: u.requests > 0 ? Math.round((u.cost / u.requests) * 1000) / 1000 : 0,
  }));
}

export function aggregateByEndpoint(events: UsageEvent[], metric: 'cost' | 'inputTokens' | 'outputTokens' | 'requests') {
  const map = new Map<string, { value: number; tokens: number; requests: number; cost: number }>();
  for (const e of events) {
    const prev = map.get(e.endpoint) || { value: 0, tokens: 0, requests: 0, cost: 0 };
    const val = metric === 'cost' ? e.cost : metric === 'inputTokens' ? e.inputTokens : metric === 'outputTokens' ? e.outputTokens : 1;
    map.set(e.endpoint, {
      value: prev.value + val,
      tokens: prev.tokens + e.inputTokens + e.outputTokens,
      requests: prev.requests + 1,
      cost: prev.cost + e.cost,
    });
  }
  const total = Array.from(map.values()).reduce((s, v) => s + v.value, 0);
  const labelMap: Record<string, string> = { 'chat': 'Chat', 'file-ingestion': 'Ingestão de Arquivos', 'web-search': 'Busca na Web' };
  return Array.from(map.entries()).map(([endpoint, d]) => ({
    endpoint,
    label: labelMap[endpoint] || endpoint,
    value: d.value,
    tokens: d.tokens,
    requests: d.requests,
    cost: d.cost,
    percentage: total > 0 ? Math.round((d.value / total) * 1000) / 10 : 0,
  }));
}

// Keep backward compat for analyticsData (used nowhere else now but just in case)
export const analyticsData = {
  totalCost: 12450.80,
  totalInputTokens: 45200000,
  totalOutputTokens: 28700000,
  totalRequests: 156420,
  costByDay: [] as { date: string; cost: number }[],
  costByModel: [] as any[],
  costByProject: [] as any[],
  costByUser: [] as any[],
};
