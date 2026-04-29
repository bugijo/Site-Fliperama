import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MonitorPlay,
  Trophy,
  DollarSign,
  Bell,
  Settings,
  Zap,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/machines', label: 'Máquinas', icon: MonitorPlay },
  { to: '/ranking', label: 'Ranking', icon: Trophy },
  { to: '/financial', label: 'Financeiro', icon: DollarSign },
  { to: '/alerts', label: 'Alertas', icon: Bell },
  { to: '/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-[#0d0d15] border-r border-[#1e1e2e] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#1e1e2e]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <span className="text-sm font-semibold text-white">FliperamaOps</span>
          <p className="text-[10px] text-slate-500 leading-none mt-0.5">Painel de Controle</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-violet-600/20 text-violet-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={isActive ? 'text-violet-400' : 'text-slate-500'}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#1e1e2e]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
          <span className="text-xs text-slate-500">Sistema operacional</span>
        </div>
      </div>
    </aside>
  );
}
