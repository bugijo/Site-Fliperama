import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, Gamepad2, Monitor, AlertTriangle } from 'lucide-react';
import { machines, alerts, weeklyRevenue } from '../data/mock';
import { StatCard, Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/Badge';
import { formatCurrency, formatNumber } from '../lib/format';

export function Dashboard() {
  const totalDailyRevenue = machines.reduce((s, m) => s + m.dailyRevenue, 0);
  const totalMonthlyRevenue = machines.reduce((s, m) => s + m.monthlyRevenue, 0);
  const totalDailyPlays = machines.reduce((s, m) => s + m.dailyPlays, 0);
  const onlineCount = machines.filter((m) => m.status === 'online').length;
  const activeAlerts = alerts.filter((a) => !a.resolved).length;

  const recentAlerts = alerts.filter((a) => !a.resolved).slice(0, 4);

  return (
    <div className="p-8">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do dia — 29 de abril de 2026"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Faturamento do Dia"
          value={formatCurrency(totalDailyRevenue)}
          sub="Todas as máquinas"
          icon={<DollarSign size={20} />}
          accent="violet"
        />
        <StatCard
          label="Faturamento do Mês"
          value={formatCurrency(totalMonthlyRevenue)}
          sub="Abril 2026"
          icon={<DollarSign size={20} />}
          accent="blue"
        />
        <StatCard
          label="Jogadas Hoje"
          value={formatNumber(totalDailyPlays)}
          sub="Em todas as máquinas"
          icon={<Gamepad2 size={20} />}
          accent="emerald"
        />
        <StatCard
          label="Máquinas Online"
          value={`${onlineCount}/${machines.length}`}
          sub={`${machines.length - onlineCount} offline/manutenção`}
          icon={<Monitor size={20} />}
          accent={onlineCount < machines.length ? 'amber' : 'emerald'}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Chart */}
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-white">Faturamento — Últimos 7 dias</h2>
              <p className="text-xs text-slate-500 mt-0.5">Receita diária consolidada</p>
            </div>
            <span className="text-xs text-slate-500 bg-[#1a1a28] px-3 py-1 rounded-full border border-[#2a2a3a]">
              Total: {formatCurrency(weeklyRevenue.reduce((s, d) => s + d.revenue, 0))}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyRevenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R$${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: '#111118',
                  border: '1px solid #2a2a3a',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#e2e8f0',
                }}
                formatter={(value) => [formatCurrency(Number(value)), 'Receita']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#7c3aed', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Alerts panel */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Alertas Ativos</h2>
            {activeAlerts > 0 && (
              <span className="flex items-center gap-1 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                <AlertTriangle size={11} />
                {activeAlerts}
              </span>
            )}
          </div>
          <div className="space-y-3">
            {recentAlerts.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">Nenhum alerta ativo</p>
            ) : (
              recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border text-xs ${
                    alert.severity === 'critical'
                      ? 'bg-rose-500/5 border-rose-500/20'
                      : alert.severity === 'warning'
                      ? 'bg-amber-500/5 border-amber-500/20'
                      : 'bg-blue-500/5 border-blue-500/20'
                  }`}
                >
                  <p className="font-medium text-slate-200 mb-0.5">{alert.machineName}</p>
                  <p className="text-slate-400 leading-relaxed">{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Machine quick overview */}
      <Card className="mt-4">
        <h2 className="text-sm font-semibold text-white mb-4">Status das Máquinas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-[#1e1e2e]">
                <th className="text-left pb-3 font-medium">Máquina</th>
                <th className="text-left pb-3 font-medium">Localização</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-right pb-3 font-medium">Fat. Dia</th>
                <th className="text-right pb-3 font-medium">Jogadas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a28]">
              {machines.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-medium text-slate-200">{m.name}</td>
                  <td className="py-3 text-slate-400 text-xs">{m.location}</td>
                  <td className="py-3">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="py-3 text-right text-slate-200 font-medium tabular-nums">
                    {formatCurrency(m.dailyRevenue)}
                  </td>
                  <td className="py-3 text-right text-slate-400 tabular-nums">{m.dailyPlays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
