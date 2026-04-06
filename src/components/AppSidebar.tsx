import { MessageSquare, FolderOpen, BarChart3, Building2, Plus, ChevronLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Chat } from '@/data/types';
import type { AppView } from '@/pages/Index';
import { currentUser } from '@/data/mockData';

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export function AppSidebar({
  isOpen, onToggle, chats, activeChatId, onSelectChat, onNewChat, currentView, onNavigate,
}: AppSidebarProps) {
  if (!isOpen) return null;

  const recentChats = [...chats].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 15);

  const navItems = [
    { id: 'projects' as AppView, label: 'Projetos', icon: FolderOpen },
    { id: 'analytics' as AppView, label: 'Analytics API', icon: BarChart3 },
    { id: 'settings' as AppView, label: 'Organização', icon: Building2 },
  ];

  return (
    <aside className="w-72 h-full flex flex-col bg-sidebar border-r border-sidebar-border shrink-0">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-sm font-semibold text-sidebar-accent-foreground">SoberanIA</span>
        </div>
        <button onClick={onToggle} className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors text-sidebar-foreground">
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-sidebar-border hover:bg-sidebar-accent transition-colors text-sm text-sidebar-foreground"
        >
          <Plus size={16} />
          <span>Novo Chat</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-foreground">
          <Search size={14} className="text-muted-foreground" />
          <input
            placeholder="Buscar..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 pb-2 space-y-0.5">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
              currentView === item.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            )}
          >
            <item.icon size={16} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-3 py-2">
        <div className="h-px bg-sidebar-border" />
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <p className="text-xs font-medium text-muted-foreground px-2 mb-2">Chats Recentes</p>
        <div className="space-y-0.5">
          {recentChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left group',
                activeChatId === chat.id && currentView === 'chat'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <MessageSquare size={14} className="shrink-0 text-muted-foreground" />
              <span className="truncate">{chat.title}</span>
              {chat.isPrivate && <span className="ml-auto text-[10px] text-muted-foreground">🔒</span>}
            </button>
          ))}
        </div>
      </div>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
