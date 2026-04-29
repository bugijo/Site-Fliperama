import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/mapa', label: 'Mapa' },
  { to: '/ranking', label: 'Ranking' },
  { to: '/premios', label: 'Prêmios' },
  { to: '/como-funciona', label: 'Como Funciona' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-purple-900/30 bg-[#080010]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-900/50 group-hover:shadow-purple-700/60 transition-all">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-game font-bold text-white text-sm tracking-widest glow-purple">
              PLAY<span className="text-purple-400">PRIZE</span>
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-purple-300 bg-purple-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <NavLink
              to="/perfil"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white btn-primary"
            >
              Meu Perfil
            </NavLink>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 pt-16">
          <div className="absolute inset-0 bg-[#080010]/95 backdrop-blur-xl" onClick={() => setOpen(false)} />
          <nav className="relative z-10 p-4 space-y-1 border-b border-purple-900/30">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'text-purple-300 bg-purple-500/15 border border-purple-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/perfil"
              onClick={() => setOpen(false)}
              className="block mt-3 px-4 py-3 rounded-xl text-center font-semibold text-white btn-primary"
            >
              Meu Perfil
            </NavLink>
          </nav>
        </div>
      )}
    </>
  );
}
