import { useState } from 'react';
import { ArrowLeft, MessageSquare, Bot, FileText, Upload, Settings, Plus, ExternalLink, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { projectsChat, chats, assistants, artifacts, projectFiles, groups } from '@/data/mockData';

interface ProjectDetailViewProps {
  projectId: string;
  onBack: () => void;
  onOpenChat: (chatId: string) => void;
}

type Tab = 'chats' | 'assistentes' | 'artefatos' | 'arquivos' | 'config';

export function ProjectDetailView({ projectId, onBack, onOpenChat }: ProjectDetailViewProps) {
  const [tab, setTab] = useState<Tab>('chats');
  const project = projectsChat.find(p => p.id === projectId);
  if (!project) return null;

  const projectChats = chats.filter(c => c.projectId === projectId);
  const projectAssistants = assistants.filter(a => a.projectId === projectId);
  const projectArtifacts = artifacts.filter(a => a.projectId === projectId);
  const projectFilesData = projectFiles.filter(f => f.projectId === projectId);
  const projectGroups = groups.filter(g => project.groups.includes(g.id));

  const tabs = [
    { id: 'chats' as Tab, label: 'Chats', icon: MessageSquare, count: projectChats.length },
    { id: 'assistentes' as Tab, label: 'Assistentes', icon: Bot, count: projectAssistants.length },
    { id: 'artefatos' as Tab, label: 'Artefatos', icon: FileText, count: projectArtifacts.length },
    { id: 'arquivos' as Tab, label: 'Arquivos', icon: Upload, count: projectFilesData.length },
    { id: 'config' as Tab, label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{project.name}</h1>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
          <span className={cn(
            'px-2.5 py-1 rounded-full text-xs font-medium',
            project.status === 'ativo' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
          )}>
            {project.status}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
                tab === t.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <t.icon size={15} />
              {t.label}
              {t.count !== undefined && (
                <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-full">{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'chats' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">Chats neste projeto</p>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
                <Plus size={14} /> Novo Chat
              </button>
            </div>
            {projectChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => onOpenChat(chat.id)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">{chat.messages.length} mensagens · {chat.updatedAt.toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {chat.isPrivate && <Lock size={12} className="text-muted-foreground" />}
                  <ExternalLink size={14} className="text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        )}

        {tab === 'assistentes' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">Assistentes especializados</p>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
                <Plus size={14} /> Novo Assistente
              </button>
            </div>
            {projectAssistants.map(ast => (
              <div key={ast.id} className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{ast.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">{ast.name}</h3>
                      <span className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full',
                        ast.status === 'ativo' ? 'bg-success/10 text-success' : 'bg-secondary text-muted-foreground'
                      )}>{ast.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{ast.instructions}</p>
                    {ast.preferredModel && (
                      <p className="text-[10px] text-muted-foreground mt-2">Modelo: {ast.preferredModel}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'artefatos' && (
          <div className="space-y-2">
            {projectArtifacts.map(art => (
              <div key={art.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-xs',
                    art.type === 'code' ? 'bg-info/10 text-info' :
                    art.type === 'diagram' ? 'bg-warning/10 text-warning' :
                    'bg-primary/10 text-primary'
                  )}>
                    {art.type === 'code' ? '< />' : art.type === 'diagram' ? '◇' : '📄'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{art.name}</p>
                    <p className="text-xs text-muted-foreground">v{art.version} · {art.updatedAt.toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'arquivos' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">Arquivos que alimentam o contexto da IA</p>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
                <Upload size={14} /> Upload
              </button>
            </div>
            {projectFilesData.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB · {file.uploadedAt.toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'config' && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Nome do Projeto</label>
              <input defaultValue={project.name} className="w-full bg-secondary rounded-lg px-4 py-2.5 text-sm outline-none border border-border focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Descrição</label>
              <input defaultValue={project.description} className="w-full bg-secondary rounded-lg px-4 py-2.5 text-sm outline-none border border-border focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Contexto de Sistema (System Prompt)</label>
              <textarea defaultValue={project.systemContext} rows={4} className="w-full bg-secondary rounded-lg px-4 py-2.5 text-sm outline-none border border-border focus:border-primary transition-colors resize-none" />
              <p className="text-xs text-muted-foreground mt-1">Este contexto é injetado em todos os chats do projeto.</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Grupos com Acesso</label>
              <div className="space-y-2">
                {projectGroups.map(g => (
                  <div key={g.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{g.name}</p>
                      <p className="text-xs text-muted-foreground">{g.memberCount} membros · Coords: {g.coordinators.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
