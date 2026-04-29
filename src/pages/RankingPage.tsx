import { useState } from 'react';
import { Trophy, MapPin, Calendar } from 'lucide-react';
import { globalRanking, machines } from '../data/mock';
import type { RankEntry } from '../types';

function formatScore(n: number) {
  return n.toLocaleString('pt-BR');
}

function PodiumCard({ entry }: { entry: RankEntry }) {
  const configs = [
    { medal: '🥇', ringClass: 'border-yellow-500/50', glowClass: 'shadow-yellow-500/20', labelClass: 'text-yellow-400', bgClass: 'from-yellow-500/8' },
    { medal: '🥈', ringClass: 'border-slate-400/40', glowClass: 'shadow-slate-400/15', labelClass: 'text-slate-400', bgClass: 'from-slate-400/5' },
    { medal: '🥉', ringClass: 'border-orange-600/40', glowClass: 'shadow-orange-600/15', labelClass: 'text-orange-500', bgClass: 'from-orange-700/5' },
  ];
  const c = configs[entry.position - 1];
  return (
    <div
      className={`rounded-2xl border ${c.ringClass} bg-gradient-to-b ${c.bgClass} to-transparent p-6 text-center shadow-lg ${c.glowClass} backdrop-blur-sm`}
      style={{ background: undefined }}
    >
      <div className="text-5xl mb-4">{c.medal}</div>
      <div className={`font-game font-bold text-xl mb-1 ${c.labelClass}`} style={{ textShadow: entry.position === 1 ? '0 0 12px rgba(251,191,36,0.6)' : undefined }}>
        {entry.nickname}
      </div>
      <div className="text-3xl font-black text-white tabular-nums mb-1">
        {formatScore(entry.score)}
      </div>
      <p className="text-xs text-slate-500 mt-1">{entry.bar}</p>
      <p className="text-[10px] text-slate-600 mt-0.5">{entry.date}</p>
      {entry.wonPrize && (
        <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/25 text-xs text-yellow-400 font-semibold">
          🏆 Prêmio garantido
        </div>
      )}
    </div>
  );
}

export function RankingPage() {
  const [tab, setTab] = useState<'global' | string>('global');

  const selectedMachine = tab === 'global' ? null : machines.find((m) => m.id === tab);
  const displayRanking = tab === 'global'
    ? globalRanking
    : globalRanking
        .filter((e) => e.machineId === tab)
        .map((e, i) => ({ ...e, position: i + 1 }));

  const top3 = displayRanking.slice(0, 3);
  const rest = displayRanking.slice(3);

  return (
    <div className="min-h-screen bg-dots py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy size={28} className="text-yellow-400" style={{ filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.6))' }} />
            <h1 className="font-game font-bold text-white text-3xl sm:text-4xl">Ranking</h1>
          </div>
          <p className="text-slate-400 text-sm">Top jogadores de São Paulo • Atualizado ao vivo</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          <button
            onClick={() => setTab('global')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              tab === 'global'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'bg-white/5 text-slate-400 border border-purple-900/30 hover:text-white'
            }`}
          >
            🌎 Global
          </button>
          {machines.map((m) => (
            <button
              key={m.id}
              onClick={() => setTab(m.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                tab === m.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                  : 'bg-white/5 text-slate-400 border border-purple-900/30 hover:text-white'
              }`}
            >
              {m.neighborhood}
            </button>
          ))}
        </div>

        {/* Machine context */}
        {selectedMachine && (
          <div className="mb-8 p-4 rounded-xl card-neon flex items-center gap-3">
            <MapPin size={16} className="text-purple-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">{selectedMachine.bar}</p>
              <p className="text-xs text-slate-500">{selectedMachine.address} · {selectedMachine.neighborhood}</p>
            </div>
          </div>
        )}

        {displayRanking.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-4xl mb-4">🕹️</p>
            <p>Ainda não há partidas registradas nesta máquina hoje.</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            {top3.length >= 3 && (
              <div className="grid grid-cols-3 gap-3 mb-8">
                {/* Silver */}
                <div className="mt-8"><PodiumCard entry={top3[1]} /></div>
                {/* Gold — elevated */}
                <div className="-mt-4"><PodiumCard entry={top3[0]} /></div>
                {/* Bronze */}
                <div className="mt-12"><PodiumCard entry={top3[2]} /></div>
              </div>
            )}

            {/* Rest of ranking */}
            {rest.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 uppercase tracking-widest text-center mb-4 font-semibold">
                  Outros classificados
                </p>
                {rest.map((entry) => (
                  <div
                    key={entry.nickname + entry.position}
                    className="flex items-center gap-4 p-4 rounded-xl card-neon hover:border-purple-500/30 transition-all"
                  >
                    <span className="w-8 text-center font-game font-bold text-slate-500 text-sm shrink-0">
                      {entry.position}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm truncate">{entry.nickname}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-slate-500 truncate">{entry.bar}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <Calendar size={10} className="text-slate-600" />
                          <span className="text-[10px] text-slate-600">{entry.date}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-black text-white tabular-nums text-sm shrink-0">
                      {formatScore(entry.score)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-12">
          Ranking atualizado em tempo real. Apenas nickname exibido — sem dados pessoais.
        </p>
      </div>
    </div>
  );
}
