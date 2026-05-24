import { Link } from 'react-router-dom';
import { MapPin, Trophy, ChevronRight, Gamepad2, Wifi, Star } from 'lucide-react';
import { useQuery } from '../hooks/useQuery';
import { api } from '../lib/api';
import {
  Skeleton,
  SkeletonMachineCard,
  StatusBadge,
} from '../components/ui/Skeleton';
import {
  machines as mockMachines,
  globalRanking as mockRanking,
  prizes as mockPrizes,
  tickerItems as mockTicker,
} from '../data/mock';

function formatScore(n: number) {
  return n.toLocaleString('pt-BR');
}

export function Home() {
  const { data: machines, loading: machinesLoading, isDemo: machinesDemo, isRefreshing } =
    useQuery((sig) => api.machines(sig), mockMachines);

  const { data: ranking, loading: rankingLoading } =
    useQuery((sig) => api.globalRanking(sig), mockRanking);

  const { data: prizes, loading: prizesLoading } =
    useQuery((sig) => api.prizes(sig), mockPrizes);

  const activeMachines = machines.filter((m) => m.status === 'active');
  const grandPrize = prizes.find((p) => p.type === 'monthly');
  const top3 = ranking.slice(0, 3);

  // Generate live ticker from real machine data when available
  const ticker = machinesLoading
    ? mockTicker
    : [
        ...activeMachines.map(
          (m) =>
            `🏆 ${m.currentTopPlayer} lidera em ${m.bar} com ${formatScore(m.currentTopScore)} pts`
        ),
        ...mockTicker.slice(activeMachines.length),
      ];

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[90svh] flex items-center justify-center bg-dots overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', animation: 'orb-drift 8s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)', animation: 'orb-drift 11s ease-in-out infinite reverse' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold tracking-wider mb-8 animate-glow-border">
            {machinesLoading ? (
              <Skeleton className="h-3 w-40" />
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {activeMachines.length} máquinas ativas agora em SP
              </>
            )}
          </div>

          <h1 className="font-game font-black text-white leading-tight tracking-tight mb-6">
            <span className="block text-4xl sm:text-6xl lg:text-7xl glow-purple" style={{ textShadow: '0 0 40px rgba(168,85,247,0.6), 0 0 80px rgba(168,85,247,0.3)' }}>
              JOGUE.
            </span>
            <span className="block text-4xl sm:text-6xl lg:text-7xl glow-blue mt-1" style={{ textShadow: '0 0 40px rgba(96,165,250,0.6), 0 0 80px rgba(96,165,250,0.3)' }}>
              VENÇA.
            </span>
            <span className="block text-4xl sm:text-6xl lg:text-7xl mt-1" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.5))' }}>
              GANHE.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-xl mx-auto leading-relaxed mb-10">
            Máquinas de arcade nos melhores bares de SP.
            O maior score do dia leva <strong className="text-white">prêmios reais</strong>.
            Sem cadastro. Só talento.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/mapa" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white btn-primary">
              <MapPin size={18} /> Encontrar Máquina
            </Link>
            <Link to="/ranking" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-purple-300 btn-outline">
              <Trophy size={18} /> Ver Ranking
            </Link>
          </div>

          {!prizesLoading && grandPrize && (
            <div className="mt-12 inline-flex items-center gap-3 px-6 py-3 rounded-2xl card-neon-gold">
              <Star size={18} className="text-yellow-400 shrink-0" style={{ filter: 'drop-shadow(0 0 8px #fbbf24)' }} />
              <span className="text-sm text-slate-300">
                Grand Prize de{' '}
                <strong className="text-gradient-gold text-base font-black">
                  R$ {grandPrize.amount.toLocaleString('pt-BR')}
                </strong>
                {' '}ainda disponível
              </span>
            </div>
          )}
          {prizesLoading && <Skeleton className="h-12 w-72 rounded-2xl mx-auto mt-12" />}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 animate-float">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-purple-500" />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
        </div>
      </section>

      {/* ── Live Ticker ── */}
      <div className="py-3 border-y border-purple-900/30 bg-[#0d0020] overflow-hidden relative">
        {ticker.length > 0 && (
          <div className="flex gap-0 animate-ticker whitespace-nowrap">
            {[...ticker, ...ticker].map((item, i) => (
              <span key={i} className="text-sm text-slate-300 px-8 border-r border-purple-900/30 last:border-r-0">
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Top 3 Ranking ── */}
      <section className="py-20 bg-grid">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-2">Ao vivo</p>
              <h2 className="font-game font-bold text-white text-2xl sm:text-3xl">Top Jogadores</h2>
            </div>
            <Link to="/ranking" className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors">
              Ranking completo <ChevronRight size={16} />
            </Link>
          </div>

          {rankingLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl card-neon p-6 space-y-3 text-center">
                  <Skeleton className="h-12 w-12 rounded-xl mx-auto" />
                  <Skeleton className="h-5 w-28 mx-auto" />
                  <Skeleton className="h-8 w-20 mx-auto" />
                  <Skeleton className="h-3 w-24 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {top3.map((entry, i) => {
                const medals = ['🥇', '🥈', '🥉'];
                const glows = [
                  'from-yellow-500/10 border-yellow-500/25',
                  'from-slate-400/8 border-slate-400/20',
                  'from-orange-700/10 border-orange-700/20',
                ];
                return (
                  <div key={entry.nickname} className={`relative rounded-2xl border bg-gradient-to-b p-6 text-center card-neon ${glows[i]}`}>
                    <div className="text-4xl mb-3">{medals[i]}</div>
                    <div className={`font-game font-bold text-lg mb-1 ${['rank-1', 'rank-2', 'rank-3'][i]}`}>
                      {entry.nickname}
                    </div>
                    <div className="text-2xl font-black text-white tabular-nums mb-1">
                      {formatScore(entry.score)}
                    </div>
                    <p className="text-xs text-slate-500">{entry.bar}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Machines ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Onde jogar</p>
                <h2 className="font-game font-bold text-white text-2xl sm:text-3xl">Máquinas em Destaque</h2>
              </div>
              <StatusBadge isDemo={machinesDemo} isRefreshing={isRefreshing} />
            </div>
            <Link to="/mapa" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Ver todas <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {machinesLoading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonMachineCard key={i} />)
              : activeMachines.slice(0, 6).map((machine) => (
                  <Link key={machine.id} to="/mapa" className="rounded-2xl p-5 card-neon card-neon-blue transition-all duration-200 hover:-translate-y-1 group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-game text-xs text-blue-400 mb-1">{machine.name}</p>
                        <h3 className="font-semibold text-white text-base leading-tight">{machine.bar}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin size={11} className="text-slate-500 shrink-0" />
                          <span className="text-xs text-slate-500">{machine.neighborhood}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 shrink-0">
                        <Wifi size={11} className="text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-semibold">Online</span>
                      </div>
                    </div>
                    <div className="neon-divider mb-4" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Líder atual</p>
                        <p className="text-sm font-bold text-purple-300">{machine.currentTopPlayer}</p>
                        <p className="text-xs font-black text-white tabular-nums">{formatScore(machine.currentTopScore)} pts</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Prêmio do dia</p>
                        <p className="text-xl font-black text-gradient-gold">R${machine.dailyPrize}</p>
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          <Gamepad2 size={10} className="text-slate-500" />
                          <span className="text-[10px] text-slate-500">{machine.playersToday} hoje</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ── How it works teaser ── */}
      <section className="py-20 bg-[#0a0018]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-3">Simples assim</p>
          <h2 className="font-game font-bold text-white text-2xl sm:text-3xl mb-12">Como Funciona</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
            {[
              { emoji: '📍', title: 'Ache a máquina', sub: 'Num bar parceiro perto de você' },
              { emoji: '🪙', title: 'Jogue', sub: 'Insira a ficha e dê o seu melhor' },
              { emoji: '🏆', title: 'Bata o recorde', sub: 'Maior score do dia ou semana' },
              { emoji: '🎁', title: 'Ganhe', sub: 'Retire seu prêmio sem burocracia' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl card-neon flex items-center justify-center text-3xl animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
                    {step.emoji}
                  </div>
                  {i < 3 && <div className="hidden sm:block absolute top-1/2 -right-7 w-6 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />}
                </div>
                <h3 className="font-semibold text-white text-sm leading-tight">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.sub}</p>
              </div>
            ))}
          </div>
          <Link to="/como-funciona" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-purple-300 btn-outline">
            Saber mais <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Grand Prize CTA ── */}
      <section className="py-20 bg-dots relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 100%)' }} />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-6xl mb-6 animate-float">🎰</div>
          <h2 className="font-game font-black text-white text-3xl sm:text-4xl mb-4">
            <span className="text-gradient">Grand Prize</span>
          </h2>
          {prizesLoading ? (
            <div className="space-y-3 mb-10">
              <Skeleton className="h-6 w-48 mx-auto" />
              <Skeleton className="h-16 w-40 mx-auto" />
              <Skeleton className="h-4 w-56 mx-auto" />
            </div>
          ) : grandPrize ? (
            <>
              <p className="text-slate-300 text-lg mb-3">O maior score global do mês leva</p>
              <p className="font-game font-black text-5xl sm:text-6xl mb-2 animate-neon-pulse"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 30px rgba(251,191,36,0.4))' }}>
                R$ {grandPrize.amount.toLocaleString('pt-BR')}
              </p>
              <p className="text-slate-500 text-sm mb-10">{grandPrize.description} • Encerra {grandPrize.deadline}</p>
            </>
          ) : null}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/mapa" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white btn-primary">
              <MapPin size={18} /> Quero jogar agora
            </Link>
            <Link to="/premios" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-purple-300 btn-outline">
              <Trophy size={18} /> Ver todos os prêmios
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
