import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { ChatView } from '@/components/ChatView';
import { ProjectsListView } from '@/components/ProjectsListView';
import { ProjectDetailView } from '@/components/ProjectDetailView';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { SettingsView } from '@/components/SettingsView';
import { chats as initialChats } from '@/data/mockData';
import type { Chat } from '@/data/types';

export type AppView = 'chat' | 'projects' | 'project-detail' | 'analytics' | 'settings';

const Index = () => {
  const [view, setView] = useState<AppView>('chat');
  const [activeChatId, setActiveChatId] = useState<string>('c1');
  const [activeProjectId, setActiveProjectId] = useState<string>('p1');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [allChats, setAllChats] = useState<Chat[]>(initialChats);

  const activeChat = allChats.find(c => c.id === activeChatId);

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setView('chat');
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: `c${Date.now()}`,
      title: 'Novo Chat',
      isPrivate: false,
      createdBy: 'u1',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
    setAllChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setView('chat');
  };

  const handleOpenProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setView('project-detail');
  };

  const handleSendMessage = (content: string) => {
    setAllChats(prev => prev.map(chat => {
      if (chat.id !== activeChatId) return chat;
      const userMsg = { id: `m${Date.now()}`, role: 'user' as const, content, timestamp: new Date() };
      const aiMsg = {
        id: `m${Date.now() + 1}`, role: 'assistant' as const,
        content: generateMockResponse(content),
        timestamp: new Date(), model: 'SoberanIA-4o',
      };
      const title = chat.messages.length === 0 ? content.slice(0, 40) + (content.length > 40 ? '...' : '') : chat.title;
      return { ...chat, title, messages: [...chat.messages, userMsg, aiMsg], updatedAt: new Date() };
    }));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        chats={allChats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        currentView={view}
        onNavigate={setView}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-12 flex items-center px-4 border-b border-border shrink-0">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="mr-3 p-1.5 rounded-md hover:bg-secondary transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
          )}
          <span className="text-sm font-medium text-muted-foreground truncate">
            {view === 'chat' && activeChat?.title}
            {view === 'projects' && 'Projetos'}
            {view === 'project-detail' && 'Detalhes do Projeto'}
            {view === 'analytics' && 'Analytics — API'}
            {view === 'settings' && 'Configurações'}
          </span>
        </header>

        {view === 'chat' && (
          <ChatView chat={activeChat} onSendMessage={handleSendMessage} />
        )}
        {view === 'projects' && (
          <ProjectsListView onOpenProject={handleOpenProject} />
        )}
        {view === 'project-detail' && (
          <ProjectDetailView projectId={activeProjectId} onBack={() => setView('projects')} onOpenChat={handleSelectChat} />
        )}
        {view === 'analytics' && <AnalyticsDashboard />}
        {view === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};

function generateMockResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('código') || q.includes('code') || q.includes('função'))
    return "Aqui está uma implementação sugerida:\n\n```typescript\nfunction processData(input: string[]): Result {\n  return input\n    .filter(item => item.length > 0)\n    .map(item => transform(item))\n    .reduce((acc, val) => merge(acc, val), initialState);\n}\n```\n\nEssa abordagem utiliza composição funcional para manter o código limpo e testável.";
  if (q.includes('contrato') || q.includes('jurídic'))
    return "Do ponto de vista jurídico, recomendo atenção aos seguintes pontos:\n\n1. **Cláusula de rescisão** — Verifique se está alinhada com o Art. 473 do Código Civil\n2. **Responsabilidade** — Delimite claramente o escopo de obrigações\n3. **Confidencialidade** — Inclua NDA anexo com prazo de 2 anos\n\nPosso redigir um modelo para qualquer uma dessas cláusulas.";
  if (q.includes('marketing') || q.includes('campanha'))
    return "Para uma campanha eficaz, sugiro a seguinte estratégia:\n\n📈 **Awareness** — Content marketing no LinkedIn + SEO\n🎯 **Consideration** — Webinars e case studies\n💰 **Conversion** — Free trial + onboarding personalizado\n\nKPIs recomendados: CAC < R$150, LTV/CAC > 3x, MQL→SQL > 25%";
  return "Entendido! Analisei sua solicitação e aqui estão minhas considerações:\n\n1. **Contexto** — Com base nas informações disponíveis, posso elaborar uma análise detalhada\n2. **Recomendação** — Sugiro abordarmos em etapas para garantir qualidade\n3. **Próximos passos** — Posso aprofundar em qualquer um dos pontos acima\n\nGostaria que eu detalhasse algum aspecto específico?";
}

export default Index;
