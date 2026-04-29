import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  accent?: 'violet' | 'blue' | 'emerald' | 'amber' | 'rose';
  trend?: 'up' | 'down' | 'neutral';
}

const accentMap = {
  violet: 'from-violet-600/20 to-violet-600/5 border-violet-600/20 text-violet-400',
  blue: 'from-blue-600/20 to-blue-600/5 border-blue-600/20 text-blue-400',
  emerald: 'from-emerald-600/20 to-emerald-600/5 border-emerald-600/20 text-emerald-400',
  amber: 'from-amber-600/20 to-amber-600/5 border-amber-600/20 text-amber-400',
  rose: 'from-rose-600/20 to-rose-600/5 border-rose-600/20 text-rose-400',
};

export function StatCard({ label, value, sub, icon, accent = 'violet' }: StatCardProps) {
  const styles = accentMap[accent];
  return (
    <div className={`rounded-xl border bg-gradient-to-br p-5 ${styles}`}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
        <div className="opacity-80">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}
