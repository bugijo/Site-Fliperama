import { useState } from 'react';
import { Gift, Clock, MapPin, Star, Lock, ChevronRight } from 'lucide-react';
import { useQuery } from '../hooks/useQuery';
import { api } from '../lib/api';
import { prizes as mockPrizes } from '../data/mock';
import { SkeletonPrizeCard, Skeleton, StatusBadge } from '../components/ui/Skeleton';
import type { Prize } from '../types';
import { Link } from 'react-router-dom';

const typeConfig = {
  daily: {
    label: 'Diário',
    emoji: '⚡',
    border: 'border-blue-500/30',
    bg: 'from-blue-500/8',
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    glow: 'rgba(59,130,246,0.15)',
  },
  weekly: {
    label: 'Semanal',
    emoji: '🔥',
    border: 'border-purple-500/30',
    bg: 'from-purple-500/10',
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
    glow: 'rgba(168,85,247,0.15)',
  },
  monthly: {
    label: 'Grand Prize',
    emoji: '👑',
    border: 'border-yellow-500/40',
    bg: 'from-yellow-500/10',
    badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    glow: 'rgba(234,179,8,0.2)',
  },
};

function PrizeCard({ prize }: { prize: Prize }) {
  const cfg = typeConfig[prize.type];
  return (
    <div
      className={`rounded-2xl border ${cfg.border} bg-gradient-to-b ${cfg.bg} to-transparent p-6 transition-all hover:-translate-y-1 duration-200 relative overflow-hidden`}
      style={{ boxShadow: `0 0 30px ${cfg.glow}, 0 8px 32px rgba(0,0,0,0.4)` }}
    >
      {prize.type === 'monthly' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(234,179,8,0.08) 0%, transparent 70%)' }}
        />
      )}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-wider ${cfg.badge}`}>
            {cfg.emoji} {cfg.label}
          </span>
          {prize.claimed && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Lock size={11} /> Reivindicado
            </span>
          )}
        </div>

        <div
          className="font-game font-black mb-1"
          style={{
            fontSize: prize.type === 'monthly' ? '3rem' : '2.25rem',
            lineHeight: 1,
            background:
              prize.type === 'monthly'
                ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                : prize.type === 'weekly'
                ? 'linear-gradient(135deg, #a855f7, #60a5fa)'
                : 'linear-gradient(135deg, #60a5fa, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          R$ {prize.amount.toLocaleString('pt-BR')}
        </div>
        <p className="text-sm text-slate-300 mb-4">{prize.description}</p>

        <div className="neon-divider mb-4" />

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin size={13} className="shrink-0 text-purple-400" />
            <span className="truncate">{prize.bar}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={13} className="shrink-0 text-blue-400" />
            <span>Encerra: {prize.deadline}</span>
          </div>
          {prize.holderNickname && (
            <div className="flex items-center gap-2">
              <Star size={13} className="shrink-0 text-yellow-500" />
              <span className="text-slate-400">Líder atual:</span>
              <span className="font-bold text-yellow-400">{prize.holderNickname}</span>
            </div>
          )}
        </div>

        {!prize.claimed ? (
          <Link
            to="/mapa"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white btn-primary"
          >
            Quero ganhar <ChevronRight size={14} />
          </Link>
        ) : (
          <div className="py-3 rounded-xl text-sm text-center text-slate-500 bg-white/5 border border-white/5">
            Prêmio já reivindicado
          </div>
        )}
      </div>
    </div>
  );
}

export function PrizesPage() {
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');

  const { data: prizes, loading, isDemo, isRefreshing } = useQuery(
    (sig) => api.prizes(sig),
    mockPrizes,
    { interval: 60_000 } // refresh every minute — prize state can change
  );

  const filtered = prizes.filter((p) => filter === 'all' || p.type === filter);
  const grandPrize = prizes.find((p) => p.type === 'monthly');

  return (
    <div className="min-h-screen py-12">
      {/* Grand Prize Hero */}
      {loading ? (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center space-y-4 mb-16">
          <Skeleton className="h-16 w-16 rounded-2xl mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-20 w-56 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <Skeleton className="h-4 w-52 mx-auto" />
        </div>
      ) : grandPrize ? (
        <div
          className="relative overflow-hidden mb-16"
          style={{ background: 'linear-gradient(180deg, rgba(234,179,8,0.08) 0%, transparent 100%)' }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
            <div className="text-6xl mb-5 animate-float">👑</div>
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">
              {grandPrize.label}
            </p>
            <h1
              className="font-game font-black mb-3"
              style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fde68a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(251,191,36,0.4))',
              }}
            >
              R$ {grandPrize.amount.toLocaleString('pt-BR')}
            </h1>
            <p className="text-slate-300 text-lg mb-2">{grandPrize.description}</p>
            <p className="text-slate-500 text-sm mb-8">
              Encerra {grandPrize.deadline} · {grandPrize.bar}
            </p>
            {grandPrize.holderNickname && (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <Star size={14} className="text-yellow-500" />
                Líder atual:
                <span className="font-bold text-yellow-400">{grandPrize.holderNickname}</span>
                <span className="text-slate-600">— você pode bater!</span>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* All prizes */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="font-game font-bold text-white text-2xl">Todos os Prêmios</h2>
              <p className="text-slate-500 text-sm mt-1">Prêmios ativos agora em São Paulo</p>
            </div>
            <StatusBadge isDemo={isDemo} isRefreshing={isRefreshing} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {([
              { v: 'all', label: '🎁 Todos' },
              { v: 'daily', label: '⚡ Diários' },
              { v: 'weekly', label: '🔥 Semanais' },
              { v: 'monthly', label: '👑 Grand' },
            ] as const).map(({ v, label }) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  filter === v
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-slate-400 border border-purple-900/30 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonPrizeCard key={i} />)
            : filtered.map((prize) => <PrizeCard key={prize.id} prize={prize} />)}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-slate-500">
            <p className="text-3xl mb-3">🎁</p>
            <p>Nenhum prêmio nesta categoria no momento.</p>
          </div>
        )}

        {/* How to claim */}
        <div className="mt-16 p-8 rounded-2xl card-neon text-center">
          <Gift size={32} className="text-purple-400 mx-auto mb-4" />
          <h3 className="font-game font-bold text-white text-xl mb-3">Como retirar seu prêmio?</h3>
          <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed mb-4">
            Se você está na liderança quando o prazo encerrar, a máquina exibe uma mensagem de vitória.
            Mostre a tela para o barman e informe seu nickname — nenhum CPF necessário.
          </p>
          <p className="text-xs text-slate-600">
            Para prêmios em dinheiro (Grand Prize), o resgate é feito via PIX. Um atendente entrará em contato.
          </p>
        </div>
      </div>
    </div>
  );
}
