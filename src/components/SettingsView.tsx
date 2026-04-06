import { useState } from 'react';
import { Building2, Users, FolderOpen, Shield, ChevronDown, ChevronRight, MoreHorizontal, Check } from 'lucide-react';
import { organization, groups, currentUser, projectsAPI, allUsers, groupMembers, projectAPIMembers, projectsChat } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import type { UserRole } from '@/data/types';

const ROLE_LABELS: Record<UserRole, string> = { admin: 'Admin', coordenador: 'Coordenador', membro: 'Membro' };
const ROLE_STYLES: Record<UserRole, string> = {
  admin: 'bg-primary/10 text-primary',
  coordenador: 'bg-warning/10 text-warning',
  membro: 'bg-secondary text-muted-foreground',
};

export function SettingsView() {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedAPIs, setExpandedAPIs] = useState<Set<string>>(new Set());
  const [memberRoles, setMemberRoles] = useState<Record<string, Record<string, UserRole>>>(() => {
    const init: Record<string, Record<string, UserRole>> = {};
    Object.entries(groupMembers).forEach(([gId, members]) => {
      init[gId] = {};
      members.forEach(m => { init[gId][m.userId] = m.role; });
    });
    return init;
  });
  const [memberGroupAssignments, setMemberGroupAssignments] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    allUsers.forEach(u => {
      init[u.id] = Object.entries(groupMembers)
        .filter(([, members]) => members.some(m => m.userId === u.id))
        .map(([gId]) => gId);
    });
    return init;
  });
  const [apiMemberAssignments, setApiMemberAssignments] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    Object.entries(projectAPIMembers).forEach(([pId, members]) => {
      init[pId] = {};
      members.forEach(m => { init[pId][m.userId] = true; });
    });
    return init;
  });

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAPI = (id: string) => {
    setExpandedAPIs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const changeRole = (groupId: string, userId: string, newRole: UserRole) => {
    setMemberRoles(prev => ({ ...prev, [groupId]: { ...prev[groupId], [userId]: newRole } }));
  };

  const toggleGroupAssignment = (userId: string, groupId: string) => {
    setMemberGroupAssignments(prev => {
      const current = prev[userId] || [];
      return { ...prev, [userId]: current.includes(groupId) ? current.filter(g => g !== groupId) : [...current, groupId] };
    });
  };

  const toggleApiMember = (projectId: string, userId: string) => {
    setApiMemberAssignments(prev => ({
      ...prev,
      [projectId]: { ...prev[projectId], [userId]: !prev[projectId]?.[userId] },
    }));
  };

  const getUserChatProjects = (userId: string) => {
    return projectsChat.filter(p => p.ownerId === userId || p.isShared);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-2">Organização</h1>
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
            {groups.map(g => {
              const isExpanded = expandedGroups.has(g.id);
              const members = groupMembers[g.id] || [];
              return (
                <div key={g.id} className="rounded-xl bg-card border border-border overflow-hidden">
                  <button
                    onClick={() => toggleGroup(g.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Users size={16} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{g.name}</p>
                        <p className="text-xs text-muted-foreground">{g.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{members.length} membros</p>
                      <p className="text-xs text-muted-foreground">{g.projectsLinked} projetos vinculados</p>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-border px-4 py-3 space-y-2">
                      {members.map(member => {
                        const user = allUsers.find(u => u.id === member.userId);
                        if (!user) return null;
                        const role = memberRoles[g.id]?.[user.id] || member.role;
                        return (
                          <div key={user.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                              <span className={cn('text-[10px] px-2 py-0.5 rounded-full', ROLE_STYLES[role])}>
                                {ROLE_LABELS[role]}
                              </span>
                            </div>
                            <MemberActions
                              userId={user.id}
                              currentRole={role}
                              onChangeRole={(newRole) => changeRole(g.id, user.id, newRole)}
                              userGroups={memberGroupAssignments[user.id] || []}
                              onToggleGroup={(gId) => toggleGroupAssignment(user.id, gId)}
                              chatProjects={getUserChatProjects(user.id)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* API Projects */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <FolderOpen size={14} /> Projetos API ({projectsAPI.length})
          </h2>
          <div className="space-y-2">
            {projectsAPI.map(p => {
              const isExpanded = expandedAPIs.has(p.id);
              const members = projectAPIMembers[p.id] || [];
              return (
                <div key={p.id} className="rounded-xl bg-card border border-border overflow-hidden">
                  <button
                    onClick={() => toggleAPI(p.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">R$ {p.monthlyCost.toLocaleString('pt-BR')}/mês</p>
                      <p className="text-xs text-muted-foreground">{members.length} membros</p>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-border px-4 py-3 space-y-2">
                      {members.map(member => {
                        const user = allUsers.find(u => u.id === member.userId);
                        if (!user) return null;
                        return (
                          <div key={user.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                              <span className={cn('text-[10px] px-2 py-0.5 rounded-full', ROLE_STYLES[member.role])}>
                                {ROLE_LABELS[member.role]}
                              </span>
                            </div>
                            <APIProjectMemberActions
                              userId={user.id}
                              currentProjectId={p.id}
                              apiMemberAssignments={apiMemberAssignments}
                              onToggle={toggleApiMember}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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

function MemberActions({ userId, currentRole, onChangeRole, userGroups, onToggleGroup, chatProjects }: {
  userId: string;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  userGroups: string[];
  onToggleGroup: (groupId: string) => void;
  chatProjects: { id: string; name: string }[];
}) {
  const roles: UserRole[] = ['admin', 'coordenador', 'membro'];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-1.5 rounded-md hover:bg-secondary transition-colors">
          <MoreHorizontal size={16} className="text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        {/* Change Role */}
        <div className="p-3 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Mudar Cargo</p>
          <div className="space-y-1">
            {roles.map(role => (
              <button
                key={role}
                onClick={() => onChangeRole(role)}
                className={cn(
                  'w-full flex items-center justify-between px-2 py-1.5 rounded text-xs hover:bg-secondary transition-colors',
                  currentRole === role && 'bg-secondary'
                )}
              >
                <span className={cn('px-2 py-0.5 rounded-full', ROLE_STYLES[role])}>{ROLE_LABELS[role]}</span>
                {currentRole === role && <Check size={12} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Assign Groups */}
        <div className="p-3 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Atribuir Grupo</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {groups.map(g => (
              <button
                key={g.id}
                onClick={() => onToggleGroup(g.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-secondary transition-colors"
              >
                <Checkbox checked={userGroups.includes(g.id)} className="pointer-events-none" />
                <span>{g.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Projects */}
        <div className="p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Projetos de Chat</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {chatProjects.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2">Nenhum projeto</p>
            ) : (
              chatProjects.map(p => (
                <div key={p.id} className="px-2 py-1.5 rounded text-xs bg-secondary/50">
                  {p.name}
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function APIProjectMemberActions({ userId, currentProjectId, apiMemberAssignments, onToggle }: {
  userId: string;
  currentProjectId: string;
  apiMemberAssignments: Record<string, Record<string, boolean>>;
  onToggle: (projectId: string, userId: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-1.5 rounded-md hover:bg-secondary transition-colors">
          <MoreHorizontal size={16} className="text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <p className="text-xs font-medium text-muted-foreground mb-2">Atribuir Projeto de API</p>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {projectsAPI.map(p => (
            <button
              key={p.id}
              onClick={() => onToggle(p.id, userId)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-secondary transition-colors"
            >
              <Checkbox checked={!!apiMemberAssignments[p.id]?.[userId]} className="pointer-events-none" />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
