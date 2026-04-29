import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import { alerts as initialAlerts } from '../data/mock';
import type { Alert, AlertSeverity } from '../types';
import { Card } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { formatDate } from '../lib/format';

const severityFilters: { label: string; value: AlertSeverity | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Crítico', value: 'critical' },
  { label: 'Aviso', value: 'warning' },
  { label: 'Info', value: 'info' },
];

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [filter, setFilter] = useState<AlertSeverity | 'all'>('all');
  const [showResolved, setShowResolved] = useState(false);

  function resolveAlert(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  }

  function resolveAll() {
    setAlerts((prev) => prev.map((a) => ({ ...a, resolved: true })));
  }

  const active = alerts.filter((a) => !a.resolved);
  const criticalCount = active.filter((a) => a.severity === 'critical').length;
  const warningCount = active.filter((a) => a.severity === 'warning').length;

  const filtered = alerts.filter((a) => {
    const matchesSeverity = filter === 'all' || a.severity === filter;
    const matchesResolved = showResolved ? true : !a.resolved;
    return matchesSeverity && matchesResolved;
  });

  return (
    <div className="p-8">
      <PageHeader
        title="Alertas"
        subtitle="Monitoramento de eventos do sistema"
        actions={
          active.length > 0 ? (
            <Button variant="secondary" size="sm" onClick={resolveAll}>
              <CheckCircle2 size={13} />
              Resolver todos
            </Button>
          ) : undefined
        }
      />

      {/* Summary */}
      <div className="flex gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-sm">
          <ShieldAlert size={14} className="text-rose-400" />
          <span className="text-rose-300 font-medium">{criticalCount} crítico{criticalCount !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm">
          <AlertTriangle size={14} className="text-amber-400" />
          <span className="text-amber-300 font-medium">{warningCount} aviso{warningCount !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-500/10 border border-slate-500/20 text-sm">
          <Info size={14} className="text-slate-400" />
          <span className="text-slate-300 font-medium">{active.length - criticalCount - warningCount} info</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1.5">
          {severityFilters.map((f) => (
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
        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="rounded accent-violet-600"
          />
          Mostrar resolvidos
        </label>
      </div>

      {/* Alert list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3 opacity-60" />
            <p className="text-sm text-slate-500">Nenhum alerta para exibir.</p>
          </div>
        )}

        {filtered.map((alert) => (
          <Card
            key={alert.id}
            className={`transition-all ${
              alert.resolved
                ? 'opacity-40'
                : alert.severity === 'critical'
                ? 'border-rose-500/20 bg-rose-500/[0.03]'
                : alert.severity === 'warning'
                ? 'border-amber-500/20 bg-amber-500/[0.03]'
                : ''
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`mt-0.5 shrink-0 ${
                alert.severity === 'critical'
                  ? 'text-rose-400'
                  : alert.severity === 'warning'
                  ? 'text-amber-400'
                  : 'text-blue-400'
              }`}>
                {alert.severity === 'critical' ? (
                  <ShieldAlert size={18} />
                ) : alert.severity === 'warning' ? (
                  <AlertTriangle size={18} />
                ) : (
                  <Info size={18} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <SeverityBadge severity={alert.severity} />
                  <span className="text-xs font-medium text-slate-300">{alert.machineName}</span>
                  {alert.resolved && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Resolvido
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed mb-1">{alert.message}</p>
                <p className="text-xs text-slate-500">{formatDate(alert.createdAt)}</p>
              </div>

              {/* Action */}
              {!alert.resolved && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resolveAlert(alert.id)}
                  className="shrink-0 text-slate-500 hover:text-emerald-400"
                >
                  <CheckCircle2 size={14} />
                  Resolver
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
