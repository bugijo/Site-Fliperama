import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  RotateCcw,
  WrenchIcon,
  Upload,
  DollarSign,
  Thermometer,
  Cpu,
  Monitor,
  Clock,
  MapPin,
  Wifi,
} from 'lucide-react';
import { machines } from '../data/mock';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { formatCurrency, formatDate } from '../lib/format';

type ActionState = 'idle' | 'loading' | 'done';

export function MachineDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const machine = machines.find((m) => m.id === id);

  const [actions, setActions] = useState<Record<string, ActionState>>({});

  if (!machine) {
    return (
      <div className="p-8 text-center text-slate-500">
        Máquina não encontrada.{' '}
        <button onClick={() => navigate('/machines')} className="text-violet-400 hover:underline">
          Voltar
        </button>
      </div>
    );
  }

  function runAction(key: string, duration = 2000) {
    setActions((prev) => ({ ...prev, [key]: 'loading' }));
    setTimeout(() => {
      setActions((prev) => ({ ...prev, [key]: 'done' }));
      setTimeout(() => setActions((prev) => ({ ...prev, [key]: 'idle' })), 2000);
    }, duration);
  }

  const a = (key: string) => actions[key] ?? 'idle';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/machines')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} />
          Voltar para Máquinas
        </button>
        <PageHeader
          title={machine.name}
          subtitle={machine.location}
          actions={<StatusBadge status={machine.status} />}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left column - Info */}
        <div className="col-span-2 space-y-4">
          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Financeiro</p>
              <div className="space-y-2.5">
                <InfoRow label="Fat. Hoje" value={formatCurrency(machine.dailyRevenue)} accent />
                <InfoRow label="Fat. Mês" value={formatCurrency(machine.monthlyRevenue)} />
                <InfoRow label="Jogadas Hoje" value={String(machine.dailyPlays)} />
                <InfoRow label="Total de Jogadas" value={machine.totalPlays.toLocaleString('pt-BR')} />
                <InfoRow label="Preço/Jogada" value={formatCurrency(machine.pricePerPlay)} />
                <InfoRow label="Prêmio Diário Máx." value={formatCurrency(machine.maxDailyPrize)} />
              </div>
            </Card>

            <Card>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">Hardware</p>
              <div className="space-y-2.5">
                <InfoRow
                  label="IP"
                  value={machine.ip}
                  icon={<Wifi size={13} className="text-slate-500" />}
                />
                <InfoRow
                  label="Firmware"
                  value={machine.firmwareVersion}
                  icon={<Cpu size={13} className="text-slate-500" />}
                />
                <InfoRow
                  label="Temperatura"
                  value={machine.temperature > 0 ? `${machine.temperature}°C` : '—'}
                  icon={<Thermometer size={13} className="text-slate-500" />}
                  valueClass={machine.temperature > 43 ? 'text-rose-400' : machine.temperature > 38 ? 'text-amber-400' : 'text-emerald-400'}
                />
                <InfoRow
                  label="Mecanismo Moeda"
                  value={machine.coinMechStatus === 'ok' ? 'OK' : 'ERRO'}
                  valueClass={machine.coinMechStatus === 'ok' ? 'text-emerald-400' : 'text-rose-400'}
                />
                <InfoRow
                  label="Display"
                  value={machine.displayStatus === 'ok' ? 'OK' : 'ERRO'}
                  icon={<Monitor size={13} className="text-slate-500" />}
                  valueClass={machine.displayStatus === 'ok' ? 'text-emerald-400' : 'text-rose-400'}
                />
                <InfoRow
                  label="Uptime"
                  value={`${machine.uptimePercent}%`}
                  valueClass={machine.uptimePercent >= 90 ? 'text-emerald-400' : 'text-amber-400'}
                />
              </div>
            </Card>
          </div>

          {/* Location */}
          <Card>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin size={13} className="text-violet-400 shrink-0" />
              <span>{machine.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
              <Clock size={13} />
              <span>Última sincronização: {formatDate(machine.lastSync)}</span>
            </div>
          </Card>
        </div>

        {/* Right column - Remote actions */}
        <div className="space-y-4">
          <Card>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-4">Ações Remotas</p>
            <div className="space-y-2.5">
              <RemoteAction
                icon={<RefreshCw size={14} />}
                label="Forçar Sync"
                description="Sincronizar dados agora"
                loading={a('sync') === 'loading'}
                done={a('sync') === 'done'}
                onClick={() => runAction('sync', 1500)}
              />
              <RemoteAction
                icon={<RotateCcw size={14} />}
                label="Reiniciar Máquina"
                description="Soft reset remoto"
                loading={a('restart') === 'loading'}
                done={a('restart') === 'done'}
                onClick={() => runAction('restart', 3000)}
                danger
              />
              <RemoteAction
                icon={<WrenchIcon size={14} />}
                label={machine.status === 'maintenance' ? 'Desativar Manutenção' : 'Modo Manutenção'}
                description={machine.status === 'maintenance' ? 'Retomar operação normal' : 'Bloquear operação temporariamente'}
                loading={a('maintenance') === 'loading'}
                done={a('maintenance') === 'done'}
                onClick={() => runAction('maintenance')}
              />
              <RemoteAction
                icon={<Upload size={14} />}
                label="Atualizar Config"
                description="Enviar configurações remotas"
                loading={a('config') === 'loading'}
                done={a('config') === 'done'}
                onClick={() => runAction('config')}
              />
            </div>
          </Card>

          <Card>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-4">Parâmetros Financeiros</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Preço por Jogada (R$)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    defaultValue={machine.pricePerPlay}
                    step="0.5"
                    min="1"
                    className="flex-1 bg-[#0d0d15] border border-[#2a2a3a] rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-violet-600/60 transition-colors"
                  />
                  <Button size="sm" variant="primary" onClick={() => runAction('price')}>
                    <DollarSign size={12} />
                    {a('price') === 'loading' ? 'Enviando...' : a('price') === 'done' ? 'Salvo!' : 'Salvar'}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Prêmio Diário Máx. (R$)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    defaultValue={machine.maxDailyPrize}
                    step="50"
                    min="50"
                    className="flex-1 bg-[#0d0d15] border border-[#2a2a3a] rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-violet-600/60 transition-colors"
                  />
                  <Button size="sm" variant="primary" onClick={() => runAction('prize')}>
                    <DollarSign size={12} />
                    {a('prize') === 'loading' ? 'Enviando...' : a('prize') === 'done' ? 'Salvo!' : 'Salvar'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
  accent,
  valueClass,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  accent?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <span className={`text-xs font-medium tabular-nums ${valueClass ?? (accent ? 'text-violet-300' : 'text-slate-200')}`}>
        {value}
      </span>
    </div>
  );
}

function RemoteAction({
  icon,
  label,
  description,
  loading,
  done,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  loading: boolean;
  done: boolean;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer disabled:cursor-not-allowed text-left ${
        done
          ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
          : danger
          ? 'border-[#2a2a3a] bg-[#0d0d15] hover:border-rose-500/40 hover:bg-rose-500/5 text-slate-300 hover:text-rose-300'
          : 'border-[#2a2a3a] bg-[#0d0d15] hover:border-violet-600/40 hover:bg-violet-600/5 text-slate-300 hover:text-violet-300'
      } disabled:opacity-50`}
    >
      <div className={`shrink-0 ${done ? 'text-emerald-400' : ''}`}>
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin block" />
        ) : (
          icon
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium leading-none mb-1">
          {done ? 'Concluído!' : label}
        </p>
        <p className="text-[10px] text-slate-500 leading-none">{description}</p>
      </div>
    </button>
  );
}
