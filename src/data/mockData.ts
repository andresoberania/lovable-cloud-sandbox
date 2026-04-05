import type { User, Organization, Group, Chat, ChatMessage, Assistant, Artifact, ProjectFile, ProjectChat, ProjectAPI, AnalyticsData } from './types';

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
      ['Quais artigos do Código Civil se aplicam?', 'Os artigos relevantes do Código Civil brasileiro são:\n\n- **Art. 473** — Resilição unilateral (rescisão sem justa causa)\n- **Art. 474** — Cláusula resolutiva expressa\n- **Art. 475** — Resolução por inadimplemento\n- **Art. 393** — Caso fortuito e força maior\n\nA cláusula 8.1 do contrato está alinhada com o Art. 473, mas sugiro adicionar referência explícita para fortalecer a posição jurídica.'],
    ]),
  },
  {
    id: 'c2', title: 'Estratégia de Conteúdo Maio', projectId: 'p2', isPrivate: false, createdBy: 'u1',
    createdAt: new Date(2026, 3, 2), updatedAt: new Date(2026, 3, 4),
    messages: makeMessages([
      ['Crie um calendário editorial para maio focado em IA generativa.', '## Calendário Editorial — Maio 2026\n\n**Semana 1 (4-8 Mai)**\n- Blog: "5 Formas de Usar IA no Marketing"\n- LinkedIn: Carrossel com estatísticas de adoção de IA\n- Newsletter: Introdução à série sobre IA\n\n**Semana 2 (11-15 Mai)**\n- Blog: "Case Study: Como a TechCorp usa IA"\n- Instagram: Reels com dicas rápidas\n- Webinar: "IA para Não-Técnicos"\n\n**Semana 3 (18-22 Mai)**\n- Blog: "Prompt Engineering para Marketers"\n- LinkedIn: Artigo thought-leadership do CEO\n\n**Semana 4 (25-29 Mai)**\n- Blog: "O Futuro do Marketing com IA"\n- Todas as redes: Compilação do mês'],
    ]),
  },
  {
    id: 'c3', title: 'Refatoração Microserviços', projectId: 'p1', isPrivate: false, createdBy: 'u1',
    createdAt: new Date(2026, 2, 28), updatedAt: new Date(2026, 3, 5),
    messages: makeMessages([
      ['Sugira uma arquitetura para migrar nosso monolito para microserviços.', '## Proposta de Arquitetura de Microserviços\n\n### Fase 1 — Strangler Fig Pattern\nComece extraindo os bounded contexts mais independentes:\n\n1. **Auth Service** — Autenticação e autorização (JWT + OAuth2)\n2. **User Service** — Gestão de perfis e preferências\n3. **Billing Service** — Faturamento e pagamentos\n\n### Fase 2 — Core Business\n4. **Chat Service** — Gestão de conversas e mensagens\n5. **AI Gateway** — Proxy para modelos de IA com rate limiting\n6. **Analytics Service** — Coleta e processamento de métricas\n\n### Infraestrutura\n- **API Gateway**: Kong ou AWS API Gateway\n- **Message Queue**: RabbitMQ para comunicação assíncrona\n- **Service Mesh**: Istio para observabilidade\n- **Database per Service**: PostgreSQL + Redis por serviço'],
    ]),
  },
  {
    id: 'c4', title: 'Brainstorm produto v3', projectId: undefined, isPrivate: false, createdBy: 'u1',
    createdAt: new Date(2026, 3, 4), updatedAt: new Date(2026, 3, 5),
    messages: makeMessages([
      ['Quais features devemos priorizar para a v3?', 'Com base nas tendências de mercado e feedback de clientes, recomendo priorizar:\n\n🔥 **Alta prioridade**\n1. **Multimodal** — Suporte a imagens e documentos no chat\n2. **Workflows automatizados** — Encadeamento de prompts\n3. **RAG avançado** — Busca semântica em documentos da empresa\n\n⚡ **Média prioridade**\n4. **Templates de assistentes** — Galeria compartilhável\n5. **Integrações nativas** — Slack, Teams, Google Workspace\n\n📊 **Backlog**\n6. **API pública de analytics**\n7. **Previsão de custos com ML**'],
    ]),
  },
  {
    id: 'c5', title: 'Rascunho NDA', projectId: 'p3', isPrivate: true, createdBy: 'u1',
    createdAt: new Date(2026, 3, 5), updatedAt: new Date(2026, 3, 5),
    messages: makeMessages([
      ['Me ajude a rascunhar um NDA bilateral.', 'Aqui está um modelo de NDA bilateral:\n\n---\n\n**ACORDO DE CONFIDENCIALIDADE BILATERAL**\n\nPelo presente instrumento, as Partes abaixo identificadas acordam:\n\n**1. DEFINIÇÃO DE INFORMAÇÃO CONFIDENCIAL**\nConsidera-se confidencial toda informação técnica, comercial, financeira ou estratégica...\n\n**2. OBRIGAÇÕES**\nAs Partes se comprometem a não divulgar, copiar ou utilizar as Informações Confidenciais para fins diversos...\n\n**3. PRAZO**\nEste acordo vigorará por 2 (dois) anos a partir da assinatura...\n\n**4. EXCEÇÕES**\nNão serão consideradas confidenciais informações que sejam de domínio público...'],
    ]),
  },
];

export const projectsChat: ProjectChat[] = [
  {
    id: 'p1', name: 'Plataforma v2 — Engenharia', description: 'Desenvolvimento da nova versão da plataforma SoberanIA',
    orgId: 'org1', ownerId: 'u1', status: 'ativo',
    systemContext: 'Você é um assistente técnico especializado em arquitetura de software, microserviços e cloud. Sempre sugira boas práticas e padrões de design.',
    isShared: true, groups: ['g1', 'g4'], createdAt: new Date(2026, 1, 15), updatedAt: new Date(2026, 3, 5),
  },
  {
    id: 'p2', name: 'Marketing Digital Q2', description: 'Campanhas e conteúdo para o segundo trimestre',
    orgId: 'org1', ownerId: 'u1', status: 'ativo',
    systemContext: 'Você é um especialista em marketing digital com foco em B2B SaaS. Sempre inclua métricas e KPIs relevantes nas sugestões.',
    isShared: true, groups: ['g2'], createdAt: new Date(2026, 2, 1), updatedAt: new Date(2026, 3, 4),
  },
  {
    id: 'p3', name: 'Análise Jurídica — Contratos', description: 'Revisão e análise de contratos empresariais',
    orgId: 'org1', ownerId: 'u1', status: 'ativo',
    systemContext: 'Você é um assistente jurídico especializado em contratos empresariais brasileiros. Sempre cite artigos do Código Civil quando relevante.',
    isShared: true, groups: ['g3'], createdAt: new Date(2026, 2, 10), updatedAt: new Date(2026, 3, 5),
  },
  {
    id: 'p4', name: 'Pesquisa Pessoal', description: 'Meu espaço de pesquisa individual',
    orgId: 'org1', ownerId: 'u1', status: 'ativo', systemContext: '',
    isShared: false, groups: [], createdAt: new Date(2026, 3, 1), updatedAt: new Date(2026, 3, 5),
  },
  {
    id: 'p5', name: 'Onboarding Novos Clientes', description: 'Projeto arquivado de onboarding',
    orgId: 'org1', ownerId: 'u1', status: 'arquivado', systemContext: '',
    isShared: true, groups: ['g4'], createdAt: new Date(2025, 10, 1), updatedAt: new Date(2026, 1, 15),
  },
];

export const projectsAPI: ProjectAPI[] = [
  { id: 'api1', name: 'Produção — Chat API', description: 'API principal de chat em produção', orgId: 'org1', status: 'ativo', groups: ['g1'], memberCount: 10, monthlyCost: 5420.30, createdAt: new Date(2026, 0, 10) },
  { id: 'api2', name: 'Staging — Testes', description: 'Ambiente de testes', orgId: 'org1', status: 'ativo', groups: ['g1', 'g4'], memberCount: 6, monthlyCost: 1230.50, createdAt: new Date(2026, 1, 5) },
  { id: 'api3', name: 'Marketing Bot', description: 'Bot para automação de marketing', orgId: 'org1', status: 'ativo', groups: ['g2'], memberCount: 4, monthlyCost: 890.00, createdAt: new Date(2026, 2, 1) },
];

export const assistants: Assistant[] = [
  { id: 'a1', name: 'Arquiteto de Software', instructions: 'Foque em arquitetura escalável, microserviços e cloud-native.', projectId: 'p1', createdBy: 'u1', preferredModel: 'SoberanIA-4o', status: 'ativo', icon: '🏗️' },
  { id: 'a2', name: 'Code Reviewer', instructions: 'Revise código com foco em qualidade, segurança e performance.', projectId: 'p1', createdBy: 'u1', preferredModel: 'SoberanIA-4o', status: 'ativo', icon: '🔍' },
  { id: 'a3', name: 'Redator de Copy', instructions: 'Escreva textos persuasivos para B2B SaaS.', projectId: 'p2', createdBy: 'u1', status: 'ativo', icon: '✍️' },
  { id: 'a4', name: 'Analista de Métricas', instructions: 'Interprete dados de campanha e sugira otimizações.', projectId: 'p2', createdBy: 'u1', status: 'ativo', icon: '📊' },
  { id: 'a5', name: 'Consultor Jurídico', instructions: 'Analise contratos e cite legislação brasileira relevante.', projectId: 'p3', createdBy: 'u1', preferredModel: 'SoberanIA-4o', status: 'ativo', icon: '⚖️' },
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

const generateDailyCosts = () => {
  const days: { date: string; cost: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(2026, 3, 5);
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split('T')[0],
      cost: Math.round((200 + Math.random() * 400) * 100) / 100,
    });
  }
  return days;
};

export const analyticsData: AnalyticsData = {
  totalCost: 12450.80,
  totalInputTokens: 45200000,
  totalOutputTokens: 28700000,
  totalRequests: 156420,
  costByDay: generateDailyCosts(),
  costByModel: [
    { model: 'SoberanIA-4o', cost: 7200, tokens: 42000000, requests: 85000, percentage: 57.8 },
    { model: 'SoberanIA-4o-mini', cost: 2800, tokens: 18000000, requests: 45000, percentage: 22.5 },
    { model: 'SoberanIA-3.5', cost: 1650, tokens: 9500000, requests: 20000, percentage: 13.3 },
    { model: 'SoberanIA-Vision', cost: 800, tokens: 4400000, requests: 6420, percentage: 6.4 },
  ],
  costByProject: [
    { project: 'Produção — Chat API', cost: 5420.30, tokens: 32000000, requests: 89000, percentage: 43.5 },
    { project: 'Staging — Testes', cost: 1230.50, tokens: 8500000, requests: 32000, percentage: 9.9 },
    { project: 'Marketing Bot', cost: 890.00, tokens: 5200000, requests: 15420, percentage: 7.1 },
  ],
  costByUser: [
    { user: 'André Silva', email: 'andre@empresa.com', role: 'Admin', cost: 3200, tokens: 18000000, requests: 42000, avgCostPerRequest: 0.076 },
    { user: 'Carlos Mendes', email: 'carlos@empresa.com', role: 'Coordenador', cost: 2800, tokens: 15000000, requests: 38000, avgCostPerRequest: 0.074 },
    { user: 'Ana Costa', email: 'ana@empresa.com', role: 'Coordenador', cost: 1950, tokens: 11000000, requests: 28000, avgCostPerRequest: 0.070 },
    { user: 'Rafael Santos', email: 'rafael@empresa.com', role: 'Membro', cost: 1500, tokens: 8500000, requests: 22000, avgCostPerRequest: 0.068 },
    { user: 'Juliana Pereira', email: 'juliana@empresa.com', role: 'Membro', cost: 1200, tokens: 7000000, requests: 18000, avgCostPerRequest: 0.067 },
    { user: 'Pedro Almeida', email: 'pedro@empresa.com', role: 'Membro', cost: 890, tokens: 5200000, requests: 14000, avgCostPerRequest: 0.064 },
  ],
};
