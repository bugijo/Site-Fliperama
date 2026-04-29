import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Wifi, WifiOff } from 'lucide-react';
import { machines as allMachines } from '../data/mock';
import type { MachineStatus } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { formatCurrency } from '../lib/format';

const statusFilters: { label: string; value: MachineStatus | 'all' }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'Manutenção', value: 'maintenance' },
  { label: 'Erro', value: 'error' },
];

export function Machines() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MachineStatus | 'all'>('all');

  const filtered = allMachines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || m.status === filter;
    return matchesSearch && matchesFilter;
  });

  const onlineCount = allMachines.filter((m) => m.status === 'online').length;
  const offlineCount = allMachines.filter((m) => m.status !== 'online').length;

  return (
    <div className="p-8">
      <PageHeader
        title="Máquinas"
        subtitle={`${allMachines.length} máquinas cadastradas`}
      />

      {/* Summary row */}
      <div className="flex gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm">
          <Wifi size={14} className="text-emerald-400" />
          <span className="text-emerald-300 font-medium">{onlineCount} online</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-500/10 border border-slate-500/20 text-sm">
          <WifiOff size={14} className="text-slate-400" />
          <span className="text-slate-300 font-medium">{offlineCount} offline/manutenção</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nome ou local..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-600/60 transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filter === f.value
                  ? 'bg-violet-600 text-white'
                  : 'bg-[#111118] border border-[#1e1e2e] text-slate-400 hover:text-slate-200 hover:border-violet-600/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Machine list */}
      <div className="space-y-2">
        {filtered.map((machine) => (
          <Card
            key={machine.id}
            className="hover:border-violet-600/30 cursor-pointer transition-all duration-150 group"
          >
            <button
              onClick={() => navigate(`/machines/${machine.id}`)}
              className="w-full text-left"
            >
              <div className="flex items-center gap-4">
                {/* Status indicator */}
                <div
                  className={`w-1 h-12 rounded-full shrink-0 ${
                    machine.status === 'online'
                      ? 'bg-emerald-500'
                      : machine.status === 'offline'
                      ? 'bg-slate-600'
                      : machine.status === 'maintenance'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-slate-100 text-sm">{machine.name}</span>
                    <StatusBadge status={machine.status} />
                  </div>
                  <p className="text-xs text-slate-500 truncate">{machine.location}</p>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-8 text-right">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Fat. Dia</p>
                    <p className="text-sm font-semibold text-slate-100 tabular-nums">
                      {formatCurrency(machine.dailyRevenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Jogadas</p>
                    <p className="text-sm font-semibold text-slate-100 tabular-nums">{machine.dailyPlays}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Uptime</p>
                    <p className={`text-sm font-semibold tabular-nums ${machine.uptimePercent >= 90 ? 'text-emerald-400' : machine.uptimePercent >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {machine.uptimePercent}%
                    </p>
                  </div>
                </div>

                <ChevronRight size={16} className="text-slate-600 group-hover:text-violet-400 transition-colors ml-2 shrink-0" />
              </div>
            </button>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-slate-500 text-sm">
            Nenhuma máquina encontrada para os filtros selecionados.
          </div>
        )}
      </div>
    </div>
  );
}
