import { useState } from 'react';
import { Save, DollarSign, Clock, BarChart3, Bell } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';

interface SettingGroup {
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: SettingField[];
}

interface SettingField {
  key: string;
  label: string;
  description: string;
  type: 'number' | 'text' | 'toggle';
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue: string | number | boolean;
}

const settingGroups: SettingGroup[] = [
  {
    title: 'Preços e Limites',
    description: 'Configurações padrão aplicadas a novas máquinas',
    icon: <DollarSign size={16} className="text-violet-400" />,
    fields: [
      {
        key: 'defaultPrice',
        label: 'Preço padrão por jogada',
        description: 'Valor cobrado por partida em novas máquinas',
        type: 'number',
        unit: 'R$',
        min: 1,
        max: 50,
        step: 0.5,
        defaultValue: 6,
      },
      {
        key: 'defaultMaxPrize',
        label: 'Prêmio diário máximo padrão',
        description: 'Limite de premiação diária para novas máquinas',
        type: 'number',
        unit: 'R$',
        min: 50,
        max: 1000,
        step: 50,
        defaultValue: 200,
      },
    ],
  },
  {
    title: 'Sincronização',
    description: 'Frequência de comunicação com as máquinas',
    icon: <Clock size={16} className="text-blue-400" />,
    fields: [
      {
        key: 'syncIntervalMinutes',
        label: 'Intervalo de sincronização',
        description: 'Com que frequência as máquinas enviam dados',
        type: 'number',
        unit: 'min',
        min: 1,
        max: 60,
        step: 1,
        defaultValue: 5,
      },
      {
        key: 'offlineThresholdMinutes',
        label: 'Limite para considerar offline',
        description: 'Tempo sem resposta para marcar como offline',
        type: 'number',
        unit: 'min',
        min: 5,
        max: 120,
        step: 5,
        defaultValue: 15,
      },
    ],
  },
  {
    title: 'Alertas',
    description: 'Configuração de notificações e thresholds',
    icon: <Bell size={16} className="text-amber-400" />,
    fields: [
      {
        key: 'tempAlertThreshold',
        label: 'Alerta de temperatura',
        description: 'Temperatura para gerar aviso automático',
        type: 'number',
        unit: '°C',
        min: 30,
        max: 80,
        step: 1,
        defaultValue: 43,
      },
      {
        key: 'revenueAlertEnabled',
        label: 'Alerta de baixa receita',
        description: 'Notificar quando máquina ficar sem receita por mais de 2h',
        type: 'toggle',
        defaultValue: true,
      },
    ],
  },
  {
    title: 'Relatórios',
    description: 'Exportação e consolidação de dados',
    icon: <BarChart3 size={16} className="text-emerald-400" />,
    fields: [
      {
        key: 'reportEmail',
        label: 'E-mail para relatório diário',
        description: 'Resumo financeiro enviado automaticamente às 23h',
        type: 'text',
        defaultValue: 'operador@fliperamaops.com',
      },
      {
        key: 'costRate',
        label: 'Taxa de custos operacionais',
        description: 'Percentual para cálculo de lucro estimado',
        type: 'number',
        unit: '%',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 35,
      },
    ],
  },
];

export function Settings() {
  const [values, setValues] = useState<Record<string, string | number | boolean>>(() => {
    const initial: Record<string, string | number | boolean> = {};
    settingGroups.forEach((g) => g.fields.forEach((f) => (initial[f.key] = f.defaultValue)));
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 1200);
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Configurações"
        subtitle="Parâmetros globais de operação do sistema"
        actions={
          <Button
            variant="primary"
            onClick={handleSave}
            loading={saving}
          >
            <Save size={14} />
            {saved ? 'Salvo!' : saving ? 'Salvando...' : 'Salvar configurações'}
          </Button>
        }
      />

      <div className="space-y-5">
        {settingGroups.map((group) => (
          <Card key={group.title}>
            <div className="flex items-center gap-2 mb-1">
              {group.icon}
              <h2 className="text-sm font-semibold text-white">{group.title}</h2>
            </div>
            <p className="text-xs text-slate-500 mb-5">{group.description}</p>

            <div className="space-y-5">
              {group.fields.map((field) => (
                <div key={field.key} className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <label className="text-sm font-medium text-slate-200 block mb-0.5">
                      {field.label}
                    </label>
                    <p className="text-xs text-slate-500">{field.description}</p>
                  </div>
                  <div className="shrink-0">
                    {field.type === 'toggle' ? (
                      <button
                        onClick={() =>
                          setValues((prev) => ({ ...prev, [field.key]: !prev[field.key] }))
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          values[field.key] ? 'bg-violet-600' : 'bg-[#2a2a3a]'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            values[field.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        {field.unit && (
                          <span className="text-xs text-slate-500">{field.unit}</span>
                        )}
                        <input
                          type={field.type}
                          value={values[field.key] as string | number}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          onChange={(e) =>
                            setValues((prev) => ({
                              ...prev,
                              [field.key]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value,
                            }))
                          }
                          className="w-44 bg-[#0d0d15] border border-[#2a2a3a] rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-violet-600/60 transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <p className="text-xs text-slate-600 text-center mt-6">
        Alterações de preço e parâmetros financeiros são aplicadas às máquinas na próxima sincronização.
      </p>
    </div>
  );
}
