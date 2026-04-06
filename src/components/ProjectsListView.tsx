import { useState } from 'react';
import { FolderOpen, Users, Clock, Archive, Plus, Search, Share2, Lock, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { projectsChat as initialProjects, groups } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { ProjectChat } from '@/data/types';

interface ProjectsListViewProps {
  onOpenProject: (id: string) => void;
}

export function ProjectsListView({ onOpenProject }: ProjectsListViewProps) {
  const [filter, setFilter] = useState<'all' | 'private' | 'shared' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<ProjectChat[]>(initialProjects);

  // New Project Dialog
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [npName, setNpName] = useState('');
  const [npDesc, setNpDesc] = useState('');
  const [npContext, setNpContext] = useState('');
  const [npIsShared, setNpIsShared] = useState(false);
  const [npGroups, setNpGroups] = useState<string[]>([]);

  const filtered = projects.filter(p => {
    if (filter === 'private') return !p.isShared && p.status === 'ativo';
    if (filter === 'shared') return p.isShared && p.status === 'ativo';
    if (filter === 'archived') return p.status === 'arquivado';
    return p.status === 'ativo';
  }).filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const myProjects = filtered.filter(p => p.ownerId === 'u1');
  const sharedWithMe = filtered.filter(p => p.ownerId !== 'u1');

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'private', label: 'Privados' },
    { id: 'shared', label: 'Compartilhados' },
    { id: 'archived', label: 'Arquivados' },
  ] as const;

  const handleAction = (projectId: string, action: 'private' | 'share' | 'archive') => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      if (action === 'private') return { ...p, isShared: false, groups: [] };
      if (action === 'share') return { ...p, isShared: true };
      if (action === 'archive') return { ...p, status: p.status === 'arquivado' ? 'ativo' as const : 'arquivado' as const };
      return p;
    }));
  };

  const handleCreateProject = () => {
    if (!npName.trim()) return;
    const newProject: ProjectChat = {
      id: `p${Date.now()}`,
      name: npName.trim(),
      description: npDesc.trim() || undefined,
      orgId: 'org1',
      ownerId: 'u1',
      status: 'ativo',
      systemContext: npContext.trim() || undefined,
      isShared: npIsShared,
      groups: npIsShared ? npGroups : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects(prev => [newProject, ...prev]);
    setNpName(''); setNpDesc(''); setNpContext(''); setNpIsShared(false); setNpGroups([]);
    setNewProjectOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Projetos Chat</h1>
            <p className="text-sm text-muted-foreground mt-1">Organize seu trabalho com IA em projetos com contexto persistente.</p>
          </div>
          <button
            onClick={() => setNewProjectOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> Novo Projeto
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                  filter === f.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex-1 max-w-xs flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
            <Search size={14} className="text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar projetos..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* My Projects */}
        {myProjects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <FolderOpen size={14} /> Meus Projetos ({myProjects.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProjects.map(project => (
                <ProjectCard key={project.id} project={project} onClick={() => onOpenProject(project.id)} onAction={handleAction} />
              ))}
            </div>
          </section>
        )}

        {/* Shared */}
        {sharedWithMe.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Share2 size={14} /> Compartilhados Comigo ({sharedWithMe.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sharedWithMe.map(project => (
                <ProjectCard key={project.id} project={project} onClick={() => onOpenProject(project.id)} onAction={handleAction} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* New Project Dialog */}
      <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium">Nome do Projeto</label>
              <input value={npName} onChange={e => setNpName(e.target.value)} className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm outline-none focus:border-primary" placeholder="Ex: Plataforma v3" />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <textarea value={npDesc} onChange={e => setNpDesc(e.target.value)} className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm outline-none focus:border-primary resize-none" rows={2} placeholder="Descreva o projeto..." />
            </div>
            <div>
              <label className="text-sm font-medium">Contexto de Sistema (System Prompt)</label>
              <textarea value={npContext} onChange={e => setNpContext(e.target.value)} className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm outline-none focus:border-primary resize-none" rows={3} placeholder="Ex: Você é um assistente especializado em..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Visibilidade</label>
              <div className="flex gap-2">
                <button
                  onClick={() => { setNpIsShared(false); setNpGroups([]); }}
                  className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors', !npIsShared ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground')}
                >
                  <Lock size={12} /> Privado
                </button>
                <button
                  onClick={() => setNpIsShared(true)}
                  className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors', npIsShared ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground')}
                >
                  <Users size={12} /> Compartilhado
                </button>
              </div>
            </div>
            {npIsShared && (
              <div>
                <label className="text-sm font-medium mb-1 block">Grupos com Acesso</label>
                <div className="space-y-1 border border-border rounded-lg p-2 max-h-32 overflow-y-auto">
                  {groups.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setNpGroups(prev => prev.includes(g.id) ? prev.filter(id => id !== g.id) : [...prev, g.id])}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-secondary transition-colors"
                    >
                      <Checkbox checked={npGroups.includes(g.id)} className="pointer-events-none" />
                      <span>{g.name}</span>
                      <span className="text-muted-foreground ml-auto">{g.memberCount} membros</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={handleCreateProject}
              disabled={!npName.trim()}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              Criar Projeto
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectCard({ project, onClick, onAction }: { project: ProjectChat; onClick: () => void; onAction: (id: string, action: 'private' | 'share' | 'archive') => void }) {
  return (
    <div className="relative text-left p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <button onClick={onClick} className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FolderOpen size={18} className="text-primary" />
        </button>
        <div className="flex items-center gap-1.5">
          {project.isShared ? (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              <Users size={10} /> {project.groups.length} grupos
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              <Lock size={10} /> Privado
            </span>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 rounded-md hover:bg-secondary transition-colors" onClick={e => e.stopPropagation()}>
                <MoreHorizontal size={14} className="text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-1" align="end">
              {project.isShared ? (
                <button onClick={() => onAction(project.id, 'private')} className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs hover:bg-secondary transition-colors">
                  <Lock size={12} /> Tornar Privado
                </button>
              ) : (
                <button onClick={() => onAction(project.id, 'share')} className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs hover:bg-secondary transition-colors">
                  <Share2 size={12} /> Compartilhar
                </button>
              )}
              <button onClick={() => onAction(project.id, 'archive')} className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs hover:bg-secondary transition-colors">
                <Archive size={12} /> {project.status === 'arquivado' ? 'Desarquivar' : 'Arquivar'}
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <button onClick={onClick} className="text-left w-full">
        <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">{project.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
        <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
          <Clock size={10} />
          <span>{project.updatedAt.toLocaleDateString('pt-BR')}</span>
          {project.status === 'arquivado' && (
            <span className="flex items-center gap-1 bg-warning/10 text-warning px-1.5 py-0.5 rounded">
              <Archive size={10} /> Arquivado
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
