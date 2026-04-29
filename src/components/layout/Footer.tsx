import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-purple-900/20 bg-[#060010]/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-game font-bold text-white text-sm tracking-widest">
                PLAY<span className="text-purple-400">PRIZE</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Arcade com prêmios reais nos melhores bares de São Paulo.
              Jogue, bata o recorde, ganhe.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 text-sm">
            <div className="space-y-2">
              <p className="text-purple-400 font-semibold text-xs uppercase tracking-widest mb-3">Explore</p>
              {[
                { to: '/mapa', label: 'Onde Jogar' },
                { to: '/ranking', label: 'Ranking' },
                { to: '/premios', label: 'Prêmios' },
                { to: '/como-funciona', label: 'Como Funciona' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="block text-slate-400 hover:text-purple-300 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="text-purple-400 font-semibold text-xs uppercase tracking-widest mb-3">Siga a gente</p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-purple-900/30 flex items-center justify-center text-slate-400 hover:text-purple-300 hover:border-purple-500/40 transition-all text-xs font-bold">
                IG
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-purple-900/30 flex items-center justify-center text-slate-400 hover:text-purple-300 hover:border-purple-500/40 transition-all text-xs font-bold">
                𝕏
              </a>
            </div>
          </div>
        </div>

        <div className="neon-divider my-8" />

        <p className="text-center text-xs text-slate-600">
          © 2026 PlayPrize. Todos os direitos reservados. Válido para maiores de 18 anos.
        </p>
      </div>
    </footer>
  );
}
