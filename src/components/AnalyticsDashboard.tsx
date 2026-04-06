import { useState, useMemo } from 'react';
import { BarChart3, DollarSign, Zap, Activity, Download, Plus, Check, ChevronDown, CalendarIcon, X, Trash2, Key, Shield, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  usageEvents, projectsAPI, filterEventsByPeriod, filterEventsByProjects,
  aggregateKPIs, aggregateByDay, aggregateByModel, aggregateByProject,
  aggregateByUser, aggregateByEndpoint, apiKeys as mockApiKeys, currentUser,
} from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type Period = 'today' | '7d' | 'month' | 'custom';
type ActiveMetric = 'cost' | 'inputTokens' | 'outputTokens' | 'requests';
type OverviewTab = 'cost' | 'model' | 'project' | 'user' | 'endpoint';

const COLORS = ['hsl(210, 100%, 56%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(270, 70%, 55%)'];
const METRIC_LABELS: Record<ActiveMetric, string> = { cost: 'Custo', inputTokens: 'Input Tokens', outputTokens: 'Output Tokens', requests: 'Requests' };

const formatCurrency = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
const formatTokens = (v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toString();
const formatMetricValue = (v: number, metric: ActiveMetric) => metric === 'cost' ? formatCurrency(v) : formatTokens(v);

interface AnalyticsDashboardProps {
  onNavigate?: (view: string) => void;
}

export function AnalyticsDashboard({ onNavigate }: AnalyticsDashboardProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [period, setPeriod] = useState<Period>('month');
  const [customRange, setCustomRange] = useState<{ from?: Date; to?: Date }>({});
  const [activeMetric, setActiveMetric] = useState<ActiveMetric>('cost');
  const [overviewTab, setOverviewTab] = useState<OverviewTab>('cost');
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [deletedProjects, setDeletedProjects] = useState<Set<string>>(new Set());

  // Detailed analysis filters
  const [detailedProjects, setDetailedProjects] = useState<string[]>([]);
  const [detailedUsers, setDetailedUsers] = useState<string[]>([]);
  const [detailedModels, setDetailedModels] = useState<string[]>([]);
  const [detailedEndpoints, setDetailedEndpoints] = useState<string[]>([]);
  const [detailedPeriod, setDetailedPeriod] = useState<Period>('month');
  const [detailedCustomRange, setDetailedCustomRange] = useState<{ from?: Date; to?: Date }>({});

  // API Keys state
  const [keys, setKeys] = useState(mockApiKeys);

  // Filter events by period + projects
  const filteredEvents = useMemo(() => {
    let events = filterEventsByPeriod(usageEvents, period, customRange.from && customRange.to ? { from: customRange.from, to: customRange.to } : undefined);
    events = filterEventsByProjects(events, selectedProjects);
    return events;
  }, [period, customRange, selectedProjects]);

  const kpis = useMemo(() => aggregateKPIs(filteredEvents), [filteredEvents]);
  const dailyData = useMemo(() => aggregateByDay(filteredEvents, activeMetric), [filteredEvents, activeMetric]);
  const modelData = useMemo(() => aggregateByModel(filteredEvents, activeMetric), [filteredEvents, activeMetric]);
  const projectData = useMemo(() => aggregateByProject(filteredEvents, activeMetric), [filteredEvents, activeMetric]);
  const userData = useMemo(() => aggregateByUser(filteredEvents, activeMetric), [filteredEvents, activeMetric]);
  const endpointData = useMemo(() => aggregateByEndpoint(filteredEvents, activeMetric), [filteredEvents, activeMetric]);

  // Detailed analysis: period + AND logic filters
  const detailedEvents = useMemo(() => {
    let events = filterEventsByPeriod(usageEvents, detailedPeriod, detailedCustomRange.from && detailedCustomRange.to ? { from: detailedCustomRange.from, to: detailedCustomRange.to } : undefined);
    return events.filter(e => {
      if (detailedProjects.length > 0 && !detailedProjects.includes(e.projectId)) return false;
      if (detailedUsers.length > 0 && !detailedUsers.includes(e.userId)) return false;
      if (detailedModels.length > 0 && !detailedModels.includes(e.model)) return false;
      if (detailedEndpoints.length > 0 && !detailedEndpoints.includes(e.endpoint)) return false;
      return true;
    });
  }, [detailedPeriod, detailedCustomRange, detailedProjects, detailedUsers, detailedModels, detailedEndpoints]);

  const detailedChartData = useMemo(() => aggregateByDay(detailedEvents, 'cost'), [detailedEvents]);

  // Unique values for detailed filters
  const allUsersFilter = useMemo(() => {
    const map = new Map<string, string>();
    usageEvents.forEach(e => map.set(e.userId, e.userName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, []);
  const allModels = useMemo(() => [...new Set(usageEvents.map(e => e.model))], []);
  const allEndpoints = useMemo(() => [...new Set(usageEvents.map(e => e.endpoint))], []);
  const endpointLabels: Record<string, string> = { 'chat': 'Chat', 'file-ingestion': 'Ingestão de Arquivos', 'web-search': 'Busca na Web' };

  const toggleProject = (id: string) => {
    setSelectedProjects(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleDeleteProject = (projectName: string) => {
    setDeletedProjects(prev => new Set([...prev, projectName]));
  };

  const handleRevokeKey = (keyId: string) => {
    setKeys(prev => prev.map(k => k.id === keyId ? { ...k, status: 'revogada' as const } : k));
  };

  const handleRegenerateKey = (keyId: string) => {
    setKeys(prev => prev.map(k => k.id === keyId ? { ...k, maskedKey: `sk-...${Math.random().toString(36).slice(-4)}`, status: 'ativa' as const } : k));
  };

  const periods = [
    { id: 'today' as Period, label: 'Hoje' },
    { id: '7d' as Period, label: '7 dias' },
    { id: 'month' as Period, label: 'Mês' },
    { id: 'custom' as Period, label: 'Custom' },
  ];

  const overviewTabs = [
    { id: 'cost' as OverviewTab, label: 'Por Custo' },
    { id: 'model' as OverviewTab, label: 'Por Modelo' },
    { id: 'project' as OverviewTab, label: 'Por Projeto' },
    { id: 'user' as OverviewTab, label: 'Por Usuário' },
    { id: 'endpoint' as OverviewTab, label: 'Por Endpoint' },
  ];

  const tooltipStyle = { backgroundColor: 'hsl(220, 13%, 13%)', border: '1px solid hsl(220, 13%, 20%)', borderRadius: '8px', fontSize: '12px' };

  const activeProjectData = projectData.filter(p => !deletedProjects.has(p.project));

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Analytics — API</h1>
              <p className="text-sm text-muted-foreground mt-1">Visibilidade completa de custos, tokens e consumo.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Download size={14} /> CSV
              </button>
              <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                    <Plus size={14} /> Novo Projeto API
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Projeto API</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div>
                      <label className="text-sm font-medium">Nome</label>
                      <input value={newProjectName} onChange={e => setNewProjectName(e.target.value)} className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" placeholder="Ex: Produção — API v2" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Descrição</label>
                      <textarea value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" rows={3} placeholder="Descreva o projeto..." />
                    </div>
                    <button onClick={() => setNewProjectOpen(false)} className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                      Criar Projeto
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-3 flex-wrap">
            <MultiSelectDropdown
              label="Projetos"
              items={projectsAPI.map(p => ({ id: p.id, name: p.name }))}
              selected={selectedProjects}
              onToggle={toggleProject}
              onClear={() => setSelectedProjects([])}
            />
            <PeriodSelector periods={periods} current={period} onChange={setPeriod} customRange={customRange} setCustomRange={setCustomRange} />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard icon={DollarSign} label="Custo Total" value={formatCurrency(kpis.totalCost)} color="primary" active={activeMetric === 'cost'} onClick={() => setActiveMetric('cost')} />
          <KPICard icon={Zap} label="Input Tokens" value={formatTokens(kpis.totalInputTokens)} color="info" active={activeMetric === 'inputTokens'} onClick={() => setActiveMetric('inputTokens')} />
          <KPICard icon={Zap} label="Output Tokens" value={formatTokens(kpis.totalOutputTokens)} color="success" active={activeMetric === 'outputTokens'} onClick={() => setActiveMetric('outputTokens')} />
          <KPICard icon={Activity} label="Total Requests" value={formatTokens(kpis.totalRequests)} color="warning" active={activeMetric === 'requests'} onClick={() => setActiveMetric('requests')} />
        </div>

        {/* Overview section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Visão Geral</h2>
          <div className="flex gap-1 mb-6 border-b border-border">
            {overviewTabs.map(t => (
              <button
                key={t.id}
                onClick={() => setOverviewTab(t.id)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                  overviewTab === t.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {overviewTab === 'cost' && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-sm font-medium mb-4">{METRIC_LABELS[activeMetric]} por Dia</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 20%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} tickFormatter={v => activeMetric === 'cost' ? `R$${v}` : formatTokens(Number(v))} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'hsl(210, 20%, 92%)' }} formatter={(value: number) => [formatMetricValue(value, activeMetric), METRIC_LABELS[activeMetric]]} />
                  <Area type="monotone" dataKey="value" stroke="hsl(210, 100%, 56%)" fill="hsl(210, 100%, 56%)" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {overviewTab === 'model' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-medium mb-4">Distribuição por Modelo — {METRIC_LABELS[activeMetric]}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={modelData} dataKey="value" nameKey="model" cx="50%" cy="50%" outerRadius={80} label={({ model, percentage }) => `${model} (${percentage}%)`}>
                      {modelData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatMetricValue(v, activeMetric), METRIC_LABELS[activeMetric]]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-medium mb-4">Detalhamento</h3>
                <div className="space-y-3">
                  {modelData.map((m, i) => (
                    <div key={m.model} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <div>
                          <p className="text-sm font-medium">{m.model}</p>
                          <p className="text-xs text-muted-foreground">{formatTokens(m.tokens)} tokens · {formatTokens(m.requests)} req</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatMetricValue(m.value, activeMetric)}</p>
                        <p className="text-xs text-muted-foreground">{m.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {overviewTab === 'project' && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-sm font-medium mb-4">Comparativo entre Projetos — {METRIC_LABELS[activeMetric]}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activeProjectData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 20%)" />
                  <XAxis dataKey="project" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} tickFormatter={v => activeMetric === 'cost' ? `R$${v}` : formatTokens(Number(v))} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatMetricValue(v, activeMetric), METRIC_LABELS[activeMetric]]} />
                  <Bar dataKey="value" fill="hsl(210, 100%, 56%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-6 space-y-2">
                {activeProjectData.map(p => (
                  <div key={p.project} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{p.project}</p>
                      <p className="text-xs text-muted-foreground">{formatTokens(p.tokens)} tokens · {formatTokens(p.requests)} req</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatMetricValue(p.value, activeMetric)}</p>
                        <p className="text-xs text-muted-foreground">{p.percentage}%</p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deletar Projeto</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja deletar o projeto "{p.project}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProject(p.project)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Deletar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {overviewTab === 'user' && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-sm font-medium mb-4">Consumo por Usuário — {METRIC_LABELS[activeMetric]}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs">Usuário</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs">Papel</th>
                      <th className="text-right py-3 px-2 text-muted-foreground font-medium text-xs">Tokens</th>
                      <th className="text-right py-3 px-2 text-muted-foreground font-medium text-xs">Requests</th>
                      <th className="text-right py-3 px-2 text-muted-foreground font-medium text-xs">Custo</th>
                      <th className="text-right py-3 px-2 text-muted-foreground font-medium text-xs">Custo/Req</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map(u => (
                      <tr key={u.email} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-2">
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </td>
                        <td className="py-3 px-2">
                          <span className={cn('text-xs px-2 py-0.5 rounded-full',
                            u.role === 'Admin' ? 'bg-primary/10 text-primary' :
                            u.role === 'Coordenador' ? 'bg-warning/10 text-warning' :
                            'bg-secondary text-muted-foreground'
                          )}>{u.role}</span>
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-xs">{formatTokens(u.tokens)}</td>
                        <td className="py-3 px-2 text-right font-mono text-xs">{formatTokens(u.requests)}</td>
                        <td className="py-3 px-2 text-right font-medium">{formatCurrency(u.cost)}</td>
                        <td className="py-3 px-2 text-right font-mono text-xs">{formatCurrency(u.avgCostPerRequest)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {overviewTab === 'endpoint' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-medium mb-4">Distribuição por Endpoint — {METRIC_LABELS[activeMetric]}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={endpointData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} label={({ label, percentage }) => `${label} (${percentage}%)`}>
                      {endpointData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatMetricValue(v, activeMetric), METRIC_LABELS[activeMetric]]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-medium mb-4">Detalhamento</h3>
                <div className="space-y-3">
                  {endpointData.map((ep, i) => (
                    <div key={ep.endpoint} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <div>
                          <p className="text-sm font-medium">{ep.label}</p>
                          <p className="text-xs text-muted-foreground">{formatTokens(ep.tokens)} tokens · {formatTokens(ep.requests)} req</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatMetricValue(ep.value, activeMetric)}</p>
                        <p className="text-xs text-muted-foreground">{ep.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DETAILED ANALYSIS */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Análise Detalhada</h2>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <PeriodSelector periods={periods} current={detailedPeriod} onChange={setDetailedPeriod} customRange={detailedCustomRange} setCustomRange={setDetailedCustomRange} />
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <MultiSelectDropdown
                label="Projeto"
                items={projectsAPI.map(p => ({ id: p.id, name: p.name }))}
                selected={detailedProjects}
                onToggle={id => setDetailedProjects(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                onClear={() => setDetailedProjects([])}
                compact
                showAll
              />
              <MultiSelectDropdown
                label="Usuário"
                items={allUsersFilter.map(u => ({ id: u.id, name: u.name }))}
                selected={detailedUsers}
                onToggle={id => setDetailedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                onClear={() => setDetailedUsers([])}
                compact
                showAll
              />
              <MultiSelectDropdown
                label="Modelo"
                items={allModels.map(m => ({ id: m, name: m }))}
                selected={detailedModels}
                onToggle={id => setDetailedModels(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                onClear={() => setDetailedModels([])}
                compact
                showAll
              />
              <MultiSelectDropdown
                label="Endpoint"
                items={allEndpoints.map(e => ({ id: e, name: endpointLabels[e] || e }))}
                selected={detailedEndpoints}
                onToggle={id => setDetailedEndpoints(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                onClear={() => setDetailedEndpoints([])}
                compact
                showAll
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <p className="text-xs text-muted-foreground">
                {detailedEvents.length} eventos · {formatCurrency(detailedEvents.reduce((s, e) => s + e.cost, 0))} total
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={detailedChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 20%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} tickFormatter={v => `R$${v}`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatCurrency(v), 'Custo']} />
                <Bar dataKey="value" fill="hsl(142, 76%, 36%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ACCESS MANAGEMENT */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield size={18} /> Gestão de Acesso
          </h2>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Gerencie as permissões de acesso dos usuários aos Projetos de API na página de Organização.
            </p>
            <button
              onClick={() => onNavigate?.('settings')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Shield size={14} /> Ir para Organização
            </button>
          </div>
        </div>

        {/* API KEYS */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Key size={18} /> API Keys
          </h2>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Gerencie as API Keys dos usuários da organização. Apenas o próprio usuário pode ver sua chave completa.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs">Usuário</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs">Projeto</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs">Key</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs">Criada em</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium text-xs">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map(k => (
                    <tr key={k.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-2 font-medium">{k.userName}</td>
                      <td className="py-3 px-2 text-muted-foreground">{k.projectName}</td>
                      <td className="py-3 px-2 font-mono text-xs">{k.maskedKey}</td>
                      <td className="py-3 px-2">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full',
                          k.status === 'ativa' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                        )}>{k.status}</span>
                      </td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{k.createdAt.toLocaleDateString('pt-BR')}</td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center gap-1 justify-end">
                          {k.userId === currentUser.id && (
                            <button
                              onClick={() => handleRegenerateKey(k.id)}
                              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                              title="Regenerar"
                            >
                              <RefreshCw size={13} />
                            </button>
                          )}
                          {k.status === 'ativa' && (
                            <button
                              onClick={() => handleRevokeKey(k.id)}
                              className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              title="Revogar"
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== SUB-COMPONENTS ==========

function PeriodSelector({ periods, current, onChange, customRange, setCustomRange }: {
  periods: { id: Period; label: string }[];
  current: Period;
  onChange: (p: Period) => void;
  customRange: { from?: Date; to?: Date };
  setCustomRange: (r: { from?: Date; to?: Date }) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
      {periods.map(p => (
        p.id === 'custom' ? (
          <Popover key={p.id}>
            <PopoverTrigger asChild>
              <button className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                current === 'custom' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
              )}>
                {current === 'custom' && customRange.from && customRange.to
                  ? `${format(customRange.from, 'dd/MM')} — ${format(customRange.to, 'dd/MM')}`
                  : 'Custom'}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-medium text-muted-foreground">Selecione o período</p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Início</p>
                    <Calendar
                      mode="single"
                      selected={customRange.from}
                      onSelect={d => { setCustomRange({ ...customRange, from: d }); if (d && customRange.to) onChange('custom'); }}
                      className="p-3 pointer-events-auto"
                      locale={ptBR}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Fim</p>
                    <Calendar
                      mode="single"
                      selected={customRange.to}
                      onSelect={d => { setCustomRange({ ...customRange, to: d }); if (customRange.from && d) onChange('custom'); }}
                      className="p-3 pointer-events-auto"
                      locale={ptBR}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
              current === p.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            )}
          >
            {p.label}
          </button>
        )
      ))}
    </div>
  );
}

function KPICard({ icon: Icon, label, value, color, active, onClick }: {
  icon: any; label: string; value: string; color: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-4 rounded-xl bg-card border text-left transition-all',
        active ? 'border-primary ring-1 ring-primary/30 shadow-[0_0_15px_-3px_hsl(210,100%,56%,0.2)]' : 'border-border hover:border-border/80'
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center',
          color === 'primary' ? 'bg-primary/10 text-primary' :
          color === 'info' ? 'bg-info/10 text-info' :
          color === 'success' ? 'bg-success/10 text-success' :
          'bg-warning/10 text-warning'
        )}>
          <Icon size={16} />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-semibold">{value}</p>
    </button>
  );
}

function MultiSelectDropdown({ label, items, selected, onToggle, onClear, compact, showAll }: {
  label: string;
  items: { id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
  compact?: boolean;
  showAll?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={cn(
          'flex items-center gap-1.5 rounded-lg text-xs font-medium transition-colors border',
          compact ? 'px-2.5 py-1.5' : 'px-3 py-2',
          selected.length > 0
            ? 'bg-primary/10 border-primary/30 text-primary'
            : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
        )}>
          {label} {selected.length > 0 && <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[10px] leading-none">{selected.length}</span>}
          <ChevronDown size={12} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        {showAll && (
          <button
            onClick={onClear}
            className={cn(
              'w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-secondary transition-colors text-left mb-0.5',
              selected.length === 0 && 'bg-secondary font-medium'
            )}
          >
            <Check size={12} className={selected.length === 0 ? 'text-primary' : 'text-transparent'} />
            <span>Todos</span>
          </button>
        )}
        {!showAll && selected.length > 0 && (
          <button onClick={onClear} className="w-full text-left px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 mb-1">
            <X size={12} /> Limpar seleção
          </button>
        )}
        <div className="max-h-48 overflow-y-auto space-y-0.5">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-secondary transition-colors text-left"
            >
              <Checkbox checked={selected.includes(item.id)} className="pointer-events-none" />
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
