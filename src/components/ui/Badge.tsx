import type { MachineStatus, AlertSeverity } from '../../types';

interface StatusBadgeProps {
  status: MachineStatus;
}

const statusConfig: Record<MachineStatus, { label: string; className: string; dot: string }> = {
  online: {
    label: 'Online',
    className: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    dot: 'bg-emerald-400 animate-pulse',
  },
  offline: {
    label: 'Offline',
    className: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
    dot: 'bg-slate-400',
  },
  maintenance: {
    label: 'Manutenção',
    className: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    dot: 'bg-amber-400',
  },
  error: {
    label: 'Erro',
    className: 'bg-rose-500/15 text-rose-400 border border-rose-500/20',
    dot: 'bg-rose-400 animate-pulse',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

interface SeverityBadgeProps {
  severity: AlertSeverity;
}

const severityConfig: Record<AlertSeverity, { label: string; className: string }> = {
  info: {
    label: 'INFO',
    className: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  },
  warning: {
    label: 'AVISO',
    className: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  },
  critical: {
    label: 'CRÍTICO',
    className: 'bg-rose-500/15 text-rose-400 border border-rose-500/20',
  },
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest ${config.className}`}>
      {config.label}
    </span>
  );
}
