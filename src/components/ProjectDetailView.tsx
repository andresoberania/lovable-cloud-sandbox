import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Bot, FileText, Upload, Settings, Plus, Lock, Users, Send, Sparkles, Trash2, FolderOutput, FolderInput, Edit, Download, Share2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { projectsChat, chats as allChatsData, assistants, artifacts, projectFiles, groups } from '@/data/mockData';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ProjectDetailViewProps {
  projectId: string;
  onBack: () => void;
  onOpenChat: (chatId: string) => void;
}

type Tab = 'chats' | 'assistentes' | 'artefatos' | 'arquivos' | 'config';

export function ProjectDetailView({ projectId, onBack, onOpenChat }: ProjectDetailViewProps) {
  const [tab, setTab] = useState<Tab>('chats');
  const [chatInput, setChatInput] = useState('');
  const [inlineMessages, setInlineMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([]);
  const [projectChatsState, setProjectChatsState] = useState(allChatsData);
  const [chatVisibility, setChatVisibility] = useState<'private' | 'shared'>('private');
  const [uploadedFiles, setUploadedFiles] = useState(projectFiles);
  const [accessGroups, setAccessGroups] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const project = projectsChat.find(p => p.id === projectId);

  useEffect(() => {
    if (project) setAccessGroups(project.groups);
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [inlineMessages.length]);

  if (!project) return null;

  const projectChats = projectChatsState.filter(c => c.projectId === projectId);
  const privateChats = projectChats.filter(c => c.visibility === 'private' || c.isPrivate);
  const sharedChats = projectChats.filter(c => c.visibility === 'shared' || (!c.isPrivate && c.visibility !== 'private'));
  const projectAssistants = assistants.filter(a => a.projectId === projectId);
  const projectArtifacts = artifacts.filter(a => a.projectId === projectId);
  const projectFilesData = uploadedFiles.filter(f => f.projectId === projectId);
  const projectGroups = groups.filter(g => accessGroups.includes(g.id));
  const otherProjects = projectsChat.filter(p => p.id !== projectId && p.status === 'ativo');

  const handleSendInline = () => {
    if (!chatInput.trim()) return;
    const userMsg = { id: `im-${Date.now()}`, role: 'user' as const, content: chatInput.trim() };
    const aiMsg = { id: `im-${Date.now() + 1}`, role: 'assistant' as const, content: `Com base no contexto do projeto "${project.name}", aqui está minha análise:\n\nEntendido! Analisei sua solicitação considerando os dados e arquivos do projeto. Posso elaborar mais detalhes se necessário.` };
    setInlineMessages(prev => [...prev, userMsg, aiMsg]);
    setChatInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendInline(); }
  };

  const handleNewChat = () => {
    if (inlineMessages.length > 0) {
      // Save current chat to list
      const newChat = {
        id: `c${Date.now()}`,
        title: inlineMessages[0]?.content.slice(0, 40) + '...',
        projectId,
        isPrivate: chatVisibility === 'private',
        createdBy: 'u1',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: inlineMessages.map((m, i) => ({ ...m, timestamp: new Date() })),
        visibility: chatVisibility,
      };
      setProjectChatsState(prev => [newChat, ...prev]);
    }
    setInlineMessages([]);
    setChatInput('');
  };

  const handleRemoveChat = (chatId: string) => {
    setProjectChatsState(prev => prev.filter(c => c.id !== chatId));
  };

  const handleMoveOutOfProject = (chatId: string) => {
    setProjectChatsState(prev => prev.map(c => c.id === chatId ? { ...c, projectId: undefined } : c));
  };

  const handleMoveToProject = (chatId: string, targetProjectId: string) => {
    setProjectChatsState(prev => prev.map(c => c.id === chatId ? { ...c, projectId: targetProjectId } : c));
  };

  const handleToggleChatVisibility = (chatId: string) => {
    setProjectChatsState(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      const isCurrentlyPrivate = c.visibility === 'private' || c.isPrivate;
      return { ...c, visibility: isCurrentlyPrivate ? 'shared' : 'private', isPrivate: !isCurrentlyPrivate };
    }));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map((f, i) => ({
      id: `f${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      type: f.type || 'application/octet-stream',
      projectId,
      uploadedBy: 'u1',
      uploadedAt: new Date(),
    }));
    setUploadedFiles(prev => [...newFiles, ...prev]);
    e.target.value = '';
  };

  const handleDownloadArtifact = (name: string, content?: string) => {
    const blob = new Blob([content || `Conteúdo do artefato: ${name}\n\nEste é um conteúdo mockado para simulação de download.`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'chats' as Tab, label: 'Chats', icon: MessageSquare, count: projectChats.length },
    { id: 'assistentes' as Tab, label: 'Assistentes', icon: Bot, count: projectAssistants.length },
    { id: 'artefatos' as Tab, label: 'Artefatos', icon: FileText, count: projectArtifacts.length },
    { id: 'arquivos' as Tab, label: 'Arquivos', icon: Upload, count: projectFilesData.length },
    { id: 'config' as Tab, label: 'Configurações', icon: Settings },
  ];

  const renderChatItem = (chat: typeof projectChatsState[0]) => {
    const isPrivate = chat.visibility === 'private' || chat.isPrivate;
    return (
      <div key={chat.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-all">
        <button onClick={() => onOpenChat(chat.id)} className="flex items-center gap-3 flex-1 text-left min-w-0">
          <MessageSquare size={16} className="text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{chat.title}</p>
              {isPrivate ? (
                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-warning/10 text-warning shrink-0">
                  <Lock size={10} /> Privado
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-info/10 text-info shrink-0">
                  <Users size={10} /> Compartilhado
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{chat.messages.length} mensagens · {chat.updatedAt.toLocaleDateString('pt-BR')}</p>
          </div>
        </button>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button onClick={() => onOpenChat(chat.id)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Continuar/Editar">
            <Edit size={13} />
          </button>

          <button onClick={() => handleToggleChatVisibility(chat.id)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title={isPrivate ? 'Tornar Compartilhado' : 'Tornar Privado'}>
            {isPrivate ? <Share2 size={13} /> : <Lock size={13} />}
          </button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Remover">
                <Trash2 size={13} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover Chat</AlertDialogTitle>
                <AlertDialogDescription>Tem certeza que deseja remover "{chat.title}"? Esta ação não pode ser desfeita.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleRemoveChat(chat.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remover</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Mover para fora do projeto">
                <FolderOutput size={13} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mover para fora do projeto</AlertDialogTitle>
                <AlertDialogDescription>Tem certeza que deseja mover "{chat.title}" para fora deste projeto?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleMoveOutOfProject(chat.id)}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Mover para outro projeto">
                <FolderInput size={13} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-2" align="end">
              <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Mover para:</p>
              {otherProjects.map(p => (
                <AlertDialog key={p.id}>
                  <AlertDialogTrigger asChild>
                    <button className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-secondary transition-colors">
                      {p.name}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Mover Chat</AlertDialogTitle>
                      <AlertDialogDescription>Mover "{chat.title}" para o projeto "{p.name}"?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleMoveToProject(chat.id, p.id)}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  };

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
                tab === t.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
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
          <div className="space-y-6">
            {/* Inline Chat */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    <p className="text-sm font-medium">Chat com IA — Contexto do Projeto</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Visibility toggle */}
                    <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
                      <button
                        onClick={() => setChatVisibility('private')}
                        className={cn('flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors', chatVisibility === 'private' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground')}
                      >
                        <Lock size={10} /> Privado
                      </button>
                      <button
                        onClick={() => setChatVisibility('shared')}
                        className={cn('flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors', chatVisibility === 'shared' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground')}
                      >
                        <Users size={10} /> Compartilhado
                      </button>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
                          <Plus size={14} /> Novo Chat
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Iniciar Novo Chat</AlertDialogTitle>
                          <AlertDialogDescription>
                            {inlineMessages.length > 0
                              ? 'O chat atual será finalizado e salvo na lista. Deseja continuar?'
                              : 'Deseja iniciar um novo chat?'}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleNewChat}>Confirmar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                {inlineMessages.length > 0 && (
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {inlineMessages.map(msg => (
                      <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : '')}>
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                            <Sparkles size={13} className="text-primary" />
                          </div>
                        )}
                        <div className={cn(
                          'rounded-xl px-3 py-2 text-sm max-w-[80%]',
                          msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                        )}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
                <div className="flex items-end gap-2 bg-secondary rounded-xl px-3 py-2">
                  <textarea
                    ref={textareaRef}
                    value={chatInput}
                    onChange={e => { setChatInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
                    onKeyDown={handleKeyDown}
                    placeholder="Pergunte algo sobre este projeto..."
                    rows={1}
                    className="flex-1 bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground max-h-[120px]"
                  />
                  <button
                    onClick={handleSendInline}
                    disabled={!chatInput.trim()}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors shrink-0',
                      chatInput.trim() ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                    )}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat List - Separated by type */}
            {privateChats.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={14} className="text-warning" />
                  <p className="text-sm font-medium">Chats Privados ({privateChats.length})</p>
                </div>
                <div className="space-y-2">
                  {privateChats.map(renderChatItem)}
                </div>
              </div>
            )}

            {sharedChats.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={14} className="text-info" />
                  <p className="text-sm font-medium">Chats Compartilhados no Projeto ({sharedChats.length})</p>
                </div>
                <div className="space-y-2">
                  {sharedChats.map(renderChatItem)}
                </div>
              </div>
            )}

            {projectChats.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum chat neste projeto.</p>
            )}
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
            <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
              <Eye size={14} />
              Artefatos são documentos gerados pela conversa que você tem com a IA neste projeto.
            </p>
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
                <button
                  onClick={() => handleDownloadArtifact(art.name, art.content)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Download size={13} /> Download
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'arquivos' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">Arquivos que alimentam o contexto da IA</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
              >
                <Upload size={14} /> Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleUpload}
              />
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
            {projectFilesData.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum arquivo enviado.</p>
            )}
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
              <div className="space-y-2 mb-3">
                {projectGroups.map(g => (
                  <div key={g.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{g.name}</p>
                      <p className="text-xs text-muted-foreground">{g.memberCount} membros · Coords: {g.coordinators.join(', ')}</p>
                    </div>
                    <button
                      onClick={() => setAccessGroups(prev => prev.filter(id => id !== g.id))}
                      className="text-xs text-destructive hover:text-destructive/80 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Plus size={12} /> Adicionar Grupo
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="start">
                  <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Selecionar Grupo</p>
                  {groups.filter(g => !accessGroups.includes(g.id)).map(g => (
                    <button
                      key={g.id}
                      onClick={() => setAccessGroups(prev => [...prev, g.id])}
                      className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-secondary transition-colors"
                    >
                      {g.name} — {g.memberCount} membros
                    </button>
                  ))}
                  {groups.filter(g => !accessGroups.includes(g.id)).length === 0 && (
                    <p className="text-xs text-muted-foreground px-2 py-1">Todos os grupos já adicionados.</p>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
