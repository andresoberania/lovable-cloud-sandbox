import { useState } from 'react';
import { FolderOpen, Users, Clock, Archive, Plus, Search, Share2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { projectsChat } from '@/data/mockData';

interface ProjectsListViewProps {
  onOpenProject: (id: string) => void;
}

export function ProjectsListView({ onOpenProject }: ProjectsListViewProps) {
  const [filter, setFilter] = useState<'all' | 'private' | 'shared' | 'archived'>('all');
  const [search, setSearch] = useState('');

  const filtered = projectsChat.filter(p => {
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

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Projetos Chat</h1>
            <p className="text-sm text-muted-foreground mt-1">Organize seu trabalho com IA em projetos com contexto persistente.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={16} />
            Novo Projeto
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
              <FolderOpen size={14} />
              Meus Projetos ({myProjects.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProjects.map(project => (
                <ProjectCard key={project.id} project={project} onClick={() => onOpenProject(project.id)} />
              ))}
            </div>
          </section>
        )}

        {/* Shared */}
        {sharedWithMe.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Share2 size={14} />
              Compartilhados Comigo ({sharedWithMe.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sharedWithMe.map(project => (
                <ProjectCard key={project.id} project={project} onClick={() => onOpenProject(project.id)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: typeof projectsChat[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FolderOpen size={18} className="text-primary" />
        </div>
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
        </div>
      </div>
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
  );
}
