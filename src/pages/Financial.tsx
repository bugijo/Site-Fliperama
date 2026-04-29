import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { DollarSign, TrendingUp, Percent } from 'lucide-react';
import { machines, weeklyRevenue } from '../data/mock';
import { StatCard, Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { formatCurrency } from '../lib/format';

const COST_RATE = 0.35; // 35% custo estimado

export function Financial() {
  const totalDaily = machines.reduce((s, m) => s + m.dailyRevenue, 0);
  const totalMonthly = machines.reduce((s, m) => s + m.monthlyRevenue, 0);
  const estimatedProfit = totalMonthly * (1 - COST_RATE);

  const revenueByMachine = [...machines]
    .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
    .map((m) => ({
      name: m.name.replace('Fliperama ', ''),
      revenue: m.monthlyRevenue,
      profit: m.monthlyRevenue * (1 - COST_RATE),
    }));

  const maxRevenue = Math.max(...revenueByMachine.map((r) => r.revenue));

  return (
    <div className="p-8">
      <PageHeader
        title="Financeiro"
        subtitle="Análise de receita e lucratividade — Abril 2026"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Receita do Dia"
          value={formatCurrency(totalDaily)}
          sub="Todas as máquinas"
          icon={<DollarSign size={20} />}
          accent="violet"
        />
        <StatCard
          label="Receita do Mês"
          value={formatCurrency(totalMonthly)}
          sub="Abril 2026"
          icon={<TrendingUp size={20} />}
          accent="blue"
        />
        <StatCard
          label="Lucro Estimado"
          value={formatCurrency(estimatedProfit)}
          sub={`Margem de ${Math.round((1 - COST_RATE) * 100)}% após custos`}
          icon={<Percent size={20} />}
          accent="emerald"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Weekly chart */}
        <Card>
          <h2 className="text-sm font-semibold text-white mb-1">Receita — Últimos 7 dias</h2>
          <p className="text-xs text-slate-500 mb-5">Receita diária consolidada</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyRevenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
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
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]} fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue by machine */}
        <Card>
          <h2 className="text-sm font-semibold text-white mb-1">Receita por Máquina</h2>
          <p className="text-xs text-slate-500 mb-5">Faturamento mensal individual</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={revenueByMachine}
              layout="vertical"
              margin={{ top: 0, right: 10, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={60}
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
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {revenueByMachine.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.revenue === maxRevenue ? '#7c3aed' : '#3730a3'}
                    fillOpacity={entry.revenue === maxRevenue ? 1 : 0.6}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Breakdown table */}
      <Card className="mt-4">
        <h2 className="text-sm font-semibold text-white mb-4">Detalhamento por Máquina</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-[#1e1e2e]">
                <th className="text-left pb-3 font-medium">Máquina</th>
                <th className="text-right pb-3 font-medium">Fat. Dia</th>
                <th className="text-right pb-3 font-medium">Fat. Mês</th>
                <th className="text-right pb-3 font-medium">Lucro Est.</th>
                <th className="text-right pb-3 font-medium">% do Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a28]">
              {[...machines].sort((a, b) => b.monthlyRevenue - a.monthlyRevenue).map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-medium text-slate-200">{m.name}</td>
                  <td className="py-3 text-right text-slate-300 tabular-nums">{formatCurrency(m.dailyRevenue)}</td>
                  <td className="py-3 text-right text-slate-200 font-medium tabular-nums">{formatCurrency(m.monthlyRevenue)}</td>
                  <td className="py-3 text-right text-emerald-400 tabular-nums">{formatCurrency(m.monthlyRevenue * (1 - COST_RATE))}</td>
                  <td className="py-3 text-right text-slate-400 tabular-nums">
                    {((m.monthlyRevenue / totalMonthly) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#2a2a3a]">
                <td className="pt-3 text-sm font-semibold text-white">Total</td>
                <td className="pt-3 text-right font-semibold text-white tabular-nums">{formatCurrency(totalDaily)}</td>
                <td className="pt-3 text-right font-semibold text-white tabular-nums">{formatCurrency(totalMonthly)}</td>
                <td className="pt-3 text-right font-semibold text-emerald-400 tabular-nums">{formatCurrency(estimatedProfit)}</td>
                <td className="pt-3 text-right text-slate-400">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}
