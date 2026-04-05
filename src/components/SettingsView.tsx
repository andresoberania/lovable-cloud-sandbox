import { Building2, Users, FolderOpen, Shield } from 'lucide-react';
import { organization, groups, currentUser, projectsAPI } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function SettingsView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-2">Configurações</h1>
        <p className="text-sm text-muted-foreground mb-8">Gerencie a organização, grupos e permissões.</p>

        {/* Org Overview */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Building2 size={14} /> Organização
          </h2>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{organization.name}</h3>
                <p className="text-sm text-muted-foreground">{organization.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Grupos" value={organization.totalGroups} />
              <StatCard label="Projetos" value={organization.totalProjects} />
              <StatCard label="Usuários" value={organization.totalUsers} />
              <StatCard label="Custo Mensal" value={`R$ ${organization.monthlyCost.toLocaleString('pt-BR')}`} />
            </div>
          </div>
        </section>

        {/* Groups */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Users size={14} /> Grupos ({groups.length})
          </h2>
          <div className="space-y-2">
            {groups.map(g => (
              <div key={g.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Users size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{g.name}</p>
                    <p className="text-xs text-muted-foreground">{g.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{g.memberCount} membros</p>
                  <p className="text-xs text-muted-foreground">{g.projectsLinked} projetos vinculados</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* API Projects */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <FolderOpen size={14} /> Projetos API ({projectsAPI.length})
          </h2>
          <div className="space-y-2">
            {projectsAPI.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">R$ {p.monthlyCost.toLocaleString('pt-BR')}/mês</p>
                  <p className="text-xs text-muted-foreground">{p.memberCount} membros</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Current User */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Shield size={14} /> Seu Perfil
          </h2>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-medium text-primary">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">{currentUser.role}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 rounded-lg bg-secondary">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
