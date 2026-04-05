import { useState } from 'react';
import { BarChart3, DollarSign, Zap, Activity, Download, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsData, projectsAPI } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

type Period = 'today' | '7d' | 'month' | 'custom';
type AnalyticsTab = 'overview' | 'models' | 'projects' | 'users';

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<Period>('month');
  const [tab, setTab] = useState<AnalyticsTab>('overview');

  const periods = [
    { id: 'today' as Period, label: 'Hoje' },
    { id: '7d' as Period, label: '7 dias' },
    { id: 'month' as Period, label: 'Mês' },
    { id: 'custom' as Period, label: 'Custom' },
  ];

  const tabs = [
    { id: 'overview' as AnalyticsTab, label: 'Visão Geral' },
    { id: 'models' as AnalyticsTab, label: 'Por Modelo' },
    { id: 'projects' as AnalyticsTab, label: 'Por Projeto' },
    { id: 'users' as AnalyticsTab, label: 'Por Usuário' },
  ];

  const COLORS = ['hsl(210, 100%, 56%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)'];

  const formatCurrency = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  const formatTokens = (v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toString();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Analytics — API</h1>
            <p className="text-sm text-muted-foreground mt-1">Visibilidade completa de custos, tokens e consumo.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              {periods.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    period === p.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Download size={14} /> CSV
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard icon={DollarSign} label="Custo Total" value={formatCurrency(analyticsData.totalCost)} color="primary" />
          <KPICard icon={Zap} label="Input Tokens" value={formatTokens(analyticsData.totalInputTokens)} color="info" />
          <KPICard icon={Zap} label="Output Tokens" value={formatTokens(analyticsData.totalOutputTokens)} color="success" />
          <KPICard icon={Activity} label="Total Requests" value={formatTokens(analyticsData.totalRequests)} color="warning" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                tab === t.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-sm font-medium mb-4">Custo por Dia</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.costByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 20%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} tickFormatter={v => `R$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(220, 13%, 13%)', border: '1px solid hsl(220, 13%, 20%)', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: 'hsl(210, 20%, 92%)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Custo']}
                />
                <Area type="monotone" dataKey="cost" stroke="hsl(210, 100%, 56%)" fill="hsl(210, 100%, 56%)" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === 'models' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-sm font-medium mb-4">Distribuição por Modelo</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={analyticsData.costByModel} dataKey="cost" nameKey="model" cx="50%" cy="50%" outerRadius={80} label={({ model, percentage }) => `${model} (${percentage}%)`}>
                    {analyticsData.costByModel.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 13%, 13%)', border: '1px solid hsl(220, 13%, 20%)', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => [formatCurrency(v), 'Custo']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-sm font-medium mb-4">Detalhamento</h3>
              <div className="space-y-3">
                {analyticsData.costByModel.map((m, i) => (
                  <div key={m.model} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <div>
                        <p className="text-sm font-medium">{m.model}</p>
                        <p className="text-xs text-muted-foreground">{formatTokens(m.tokens)} tokens · {formatTokens(m.requests)} requests</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(m.cost)}</p>
                      <p className="text-xs text-muted-foreground">{m.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'projects' && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-sm font-medium mb-4">Comparativo entre Projetos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.costByProject}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 20%)" />
                <XAxis dataKey="project" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} tickFormatter={v => `R$${v}`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 13%, 13%)', border: '1px solid hsl(220, 13%, 20%)', borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => [formatCurrency(v), 'Custo']} />
                <Bar dataKey="cost" fill="hsl(210, 100%, 56%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2">
              {analyticsData.costByProject.map(p => (
                <div key={p.project} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{p.project}</p>
                    <p className="text-xs text-muted-foreground">{formatTokens(p.tokens)} tokens · {formatTokens(p.requests)} requests</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(p.cost)}</p>
                    <p className="text-xs text-muted-foreground">{p.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-sm font-medium mb-4">Consumo por Usuário</h3>
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
                  {analyticsData.costByUser.map(u => (
                    <tr key={u.email} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-2">
                        <p className="font-medium">{u.user}</p>
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
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
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
    </div>
  );
}
