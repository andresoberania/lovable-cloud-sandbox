import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Chat } from '@/data/types';

interface ChatViewProps {
  chat?: Chat;
  onSendMessage: (content: string) => void;
}

export function ChatView({ chat, onSendMessage }: ChatViewProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages.length]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-semibold">SoberanIA</h2>
          <p className="text-muted-foreground text-sm max-w-md">Selecione um chat ou crie um novo para começar a interagir com a IA.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {chat.messages.length === 0 && (
            <div className="flex items-center justify-center pt-20">
              <div className="text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles size={28} className="text-primary" />
                </div>
                <h3 className="text-lg font-medium">Como posso ajudar?</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Faça qualquer pergunta ou peça ajuda com suas tarefas.
                </p>
              </div>
            </div>
          )}
          {chat.messages.map((msg) => (
            <div key={msg.id} className={cn('flex gap-4', msg.role === 'user' ? 'justify-end' : '')}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles size={16} className="text-primary" />
                </div>
              )}
              <div
                className={cn(
                  'rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%]',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-chat-ai'
                )}
              >
                <div className="whitespace-pre-wrap">{renderMarkdown(msg.content)}</div>
                {msg.model && (
                  <p className="text-[10px] text-muted-foreground mt-2 opacity-60">{msg.model}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 bg-chat-input rounded-2xl border border-border px-4 py-3">
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <Paperclip size={18} />
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Envie uma mensagem..."
              rows={1}
              className="flex-1 bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground max-h-[200px]"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className={cn(
                'p-2 rounded-lg transition-colors shrink-0',
                input.trim()
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'text-muted-foreground'
              )}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            SoberanIA pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
}

function renderMarkdown(text: string) {
  // Simple markdown-like rendering
  const parts = text.split(/(```[\s\S]*?```|\*\*[^*]+\*\*|##?\s.+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const code = part.replace(/```\w*\n?/g, '').trim();
      return (
        <pre key={i} className="bg-background/50 rounded-lg p-3 my-2 overflow-x-auto font-mono text-xs">
          <code>{code}</code>
        </pre>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('## ')) {
      return <h3 key={i} className="text-base font-semibold mt-3 mb-1">{part.slice(3)}</h3>;
    }
    if (part.startsWith('# ')) {
      return <h2 key={i} className="text-lg font-semibold mt-3 mb-1">{part.slice(2)}</h2>;
    }
    return <span key={i}>{part}</span>;
  });
}
