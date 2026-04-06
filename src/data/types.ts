export type UserRole = 'admin' | 'coordenador' | 'membro';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  totalGroups: number;
  totalProjects: number;
  totalUsers: number;
  monthlyCost: number;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  orgId: string;
  memberCount: number;
  coordinators: string[];
  projectsLinked: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

export interface Chat {
  id: string;
  title: string;
  projectId?: string;
  isPrivate: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
  assistantId?: string;
}

export interface Assistant {
  id: string;
  name: string;
  instructions: string;
  projectId: string;
  createdBy: string;
  preferredModel?: string;
  status: 'ativo' | 'inativo';
  icon?: string;
}

export interface Artifact {
  id: string;
  name: string;
  type: 'document' | 'code' | 'report' | 'diagram';
  projectId: string;
  version: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  content?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: number;
  type: string;
  projectId: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ProjectChat {
  id: string;
  name: string;
  description?: string;
  orgId: string;
  ownerId: string;
  status: 'ativo' | 'arquivado';
  systemContext?: string;
  isShared: boolean;
  groups: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectAPI {
  id: string;
  name: string;
  description?: string;
  orgId: string;
  status: 'ativo' | 'arquivado';
  groups: string[];
  memberCount: number;
  monthlyCost: number;
  createdAt: Date;
}

export interface APIKey {
  id: string;
  key: string;
  userId: string;
  projectId: string;
  status: 'ativa' | 'revogada';
  createdAt: Date;
}

export type Endpoint = 'chat' | 'file-ingestion' | 'web-search';

export interface UsageEvent {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  projectId: string;
  projectName: string;
  model: string;
  endpoint: Endpoint;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  timestamp: Date;
}

export interface AnalyticsData {
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalRequests: number;
  costByDay: { date: string; cost: number }[];
  costByModel: { model: string; cost: number; tokens: number; requests: number; percentage: number }[];
  costByProject: { project: string; cost: number; tokens: number; requests: number; percentage: number }[];
  costByUser: { user: string; email: string; role: string; cost: number; tokens: number; requests: number; avgCostPerRequest: number }[];
}
