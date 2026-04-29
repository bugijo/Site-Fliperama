import { useState } from 'react';
import { Trophy, TrendingUp, Gamepad2 } from 'lucide-react';
import { machines } from '../data/mock';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/Badge';
import { formatCurrency } from '../lib/format';

type RankBy = 'revenue' | 'plays';

const medals = ['🥇', '🥈', '🥉'];

export function Ranking() {
  const [rankBy, setRankBy] = useState<RankBy>('revenue');

  const sorted = [...machines].sort((a, b) =>
    rankBy === 'revenue'
      ? b.monthlyRevenue - a.monthlyRevenue
      : b.totalPlays - a.totalPlays
  );

  const topValue = rankBy === 'revenue' ? sorted[0].monthlyRevenue : sorted[0].totalPlays;

  return (
    <div className="p-8">
      <PageHeader
        title="Ranking de Máquinas"
        subtitle="Desempenho comparativo mensal"
        actions={
          <div className="flex gap-1.5 p-1 bg-[#111118] rounded-lg border border-[#1e1e2e]">
            <button
              onClick={() => setRankBy('revenue')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                rankBy === 'revenue'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp size={12} />
              Faturamento
            </button>
            <button
              onClick={() => setRankBy('plays')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                rankBy === 'plays'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gamepad2 size={12} />
              Jogadas
            </button>
          </div>
        }
      />

      {/* Top 3 highlight */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {sorted.slice(0, 3).map((machine, i) => (
          <Card
            key={machine.id}
            className={`text-center ${i === 0 ? 'border-amber-500/30 bg-gradient-to-b from-amber-500/5' : ''}`}
          >
            <div className="text-3xl mb-2">{medals[i]}</div>
            <div className={`text-xs font-bold mb-1 ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-400' : 'text-orange-700'}`}>
              {i + 1}º lugar
            </div>
            <p className="text-sm font-semibold text-white mb-0.5">{machine.name}</p>
            <p className="text-[11px] text-slate-500 mb-3 truncate px-2">{machine.location}</p>
            <div className="text-xl font-bold text-white tabular-nums">
              {rankBy === 'revenue'
                ? formatCurrency(machine.monthlyRevenue)
                : machine.totalPlays.toLocaleString('pt-BR')}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {rankBy === 'revenue' ? 'no mês' : 'jogadas totais'}
            </p>
          </Card>
        ))}
      </div>

      {/* Full ranking */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Trophy size={16} className="text-violet-400" />
          <h2 className="text-sm font-semibold text-white">
            Ranking por {rankBy === 'revenue' ? 'Faturamento Mensal' : 'Total de Jogadas'}
          </h2>
        </div>

        <div className="space-y-2">
          {sorted.map((machine, i) => {
            const value = rankBy === 'revenue' ? machine.monthlyRevenue : machine.totalPlays;
            const pct = (value / topValue) * 100;

            return (
              <div key={machine.id} className="flex items-center gap-4">
                <span className="w-6 text-xs text-slate-500 text-center font-medium shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium text-slate-200 truncate">{machine.name}</span>
                      <StatusBadge status={machine.status} />
                    </div>
                    <span className="text-sm font-semibold text-white tabular-nums ml-4 shrink-0">
                      {rankBy === 'revenue'
                        ? formatCurrency(value)
                        : value.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#1a1a28] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        i === 0
                          ? 'bg-gradient-to-r from-violet-600 to-blue-500'
                          : 'bg-violet-600/40'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1 truncate">{machine.location}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
