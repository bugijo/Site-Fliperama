import { useState, useCallback } from 'react';
import { User, Trophy, Gamepad2, Gift, Search, MapPin } from 'lucide-react';
import { api } from '../lib/api';
import { globalRanking, prizes as mockPrizes } from '../data/mock';
import type { Prize } from '../types';
import { Link } from 'react-router-dom';

function formatScore(n: number) {
  return n.toLocaleString('pt-BR');
}

interface ProfileData {
  nickname: string;
  bar?: string;
  globalPosition: number;
  totalScore: number;
  gamesPlayed?: number;
  prizesWon: Prize[];
  machineName?: string;
  date?: string;
}

function mockFallback(query: string): ProfileData | null {
  const entry = globalRanking.find(
    (r) => r.nickname.toLowerCase() === query.toLowerCase()
  );
  if (!entry) return null;
  return {
    nickname: entry.nickname,
    bar: entry.bar,
    globalPosition: entry.position,
    totalScore: entry.score,
    prizesWon: mockPrizes.filter(
      (p) => p.holderNickname?.toLowerCase() === query.toLowerCase()
    ),
    machineName: entry.machineName,
    date: entry.date,
  };
}

export function Profile() {
  const [nickname, setNickname] = useState('');
  const [searched, setSearched] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const query = nickname.trim();
      if (!query) return;
      setLoading(true);
      setNotFound(false);
      setProfile(null);
      try {
        const data = await api.player(query);
        setProfile({
          nickname: data.nickname,
          globalPosition: data.globalPosition,
          totalScore: data.totalScore,
          gamesPlayed: data.gamesPlayed,
          prizesWon: data.prizesWon,
        });
        setNotFound(false);
      } catch {
        const fallback = mockFallback(query);
        if (fallback) {
          setProfile(fallback);
          setNotFound(false);
        } else {
          setProfile(null);
          setNotFound(true);
        }
      } finally {
        setSearched(query);
        setLoading(false);
      }
    },
    [nickname]
  );

  return (
    <div className="min-h-screen py-16 bg-dots">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4"
            style={{ boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}
          >
            <User size={28} className="text-white" />
          </div>
          <h1 className="font-game font-bold text-white text-2xl sm:text-3xl mb-2">Meu Perfil</h1>
          <p className="text-slate-400 text-sm">
            Digite seu nickname para ver sua posição no ranking e prêmios conquistados.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-10">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Seu nickname (ex: XxNeonKingxX)"
                className="w-full bg-[#0d0020] border border-purple-900/40 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500/60 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !nickname.trim()}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search size={16} />
              )}
              Buscar
            </button>
          </div>
        </form>

        {/* Not found */}
        {notFound && (
          <div className="text-center py-12 card-neon rounded-2xl">
            <p className="text-4xl mb-4">🕹️</p>
            <p className="text-white font-semibold mb-1">Nickname não encontrado</p>
            <p className="text-slate-500 text-sm mb-6">
              "{searched}" ainda não está no ranking. Jogue uma partida e apareça aqui!
            </p>
            <Link
              to="/mapa"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white btn-primary"
            >
              <MapPin size={14} />
              Encontrar uma máquina
            </Link>
          </div>
        )}

        {/* Profile results */}
        {profile && (
          <div className="space-y-5 animate-fade-up">
            {/* Stats */}
            <div className="card-neon rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-game font-bold text-white text-sm">
                  {profile.nickname.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-game font-bold text-white text-lg">{profile.nickname}</h2>
                  {profile.bar && <p className="text-xs text-slate-500">{profile.bar}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-purple-900/20">
                  <div className="text-2xl font-black text-white tabular-nums">
                    #{profile.globalPosition}
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Posição</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-purple-900/20">
                  <div className="text-2xl font-black text-white tabular-nums">
                    {formatScore(profile.totalScore)}
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Score</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-purple-900/20">
                  <div className="text-2xl font-black text-white tabular-nums">
                    {profile.gamesPlayed ?? profile.prizesWon.length}
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                    {profile.gamesPlayed != null ? 'Partidas' : 'Prêmios'}
                  </p>
                </div>
              </div>
            </div>

            {/* Ranking position detail */}
            <div className="card-neon rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={16} className="text-yellow-400" />
                <h3 className="font-semibold text-white text-sm">Posição no Ranking</h3>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="text-5xl font-game font-black"
                  style={{
                    background:
                      profile.globalPosition === 1
                        ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                        : 'linear-gradient(135deg, #a855f7, #60a5fa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  #{profile.globalPosition}
                </div>
                <div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {profile.globalPosition === 1
                      ? '🏆 Você está em primeiro! Mantenha a liderança até o prazo encerrar.'
                      : 'Continue jogando para subir no ranking e garantir seu prêmio!'}
                  </p>
                  {(profile.machineName || profile.date) && (
                    <div className="flex items-center gap-2 mt-2">
                      <Gamepad2 size={12} className="text-slate-500" />
                      <span className="text-xs text-slate-500">
                        {[profile.machineName, profile.date].filter(Boolean).join(' · ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Prizes */}
            {profile.prizesWon.length > 0 && (
              <div className="card-neon rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Gift size={16} className="text-purple-400" />
                  <h3 className="font-semibold text-white text-sm">Prêmios em Aberto</h3>
                </div>
                <div className="space-y-3">
                  {profile.prizesWon.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-purple-900/20"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{p.label}</p>
                        <p className="text-xs text-slate-500">
                          {p.bar} · {p.deadline}
                        </p>
                      </div>
                      <span className="font-black text-yellow-400 text-lg">R$ {p.amount}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-600 mt-3">
                  Para retirar, mostre este perfil ao barman ou aguarde o contato via site.
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="text-center pt-2">
              <Link
                to="/mapa"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white btn-primary"
              >
                <MapPin size={16} />
                Jogar mais e melhorar score
              </Link>
            </div>
          </div>
        )}

        {/* No search yet */}
        {!searched && (
          <div className="text-center py-8 opacity-50">
            <p className="text-slate-500 text-sm">
              Nicknames aparecem no ranking após a primeira partida.
              <br />Sem cadastro necessário para jogar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
