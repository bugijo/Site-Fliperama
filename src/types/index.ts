export type MachineStatus = 'online' | 'offline' | 'maintenance' | 'error';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Machine {
  id: string;
  name: string;
  location: string;
  status: MachineStatus;
  ip: string;
  firmwareVersion: string;
  lastSync: string;
  dailyRevenue: number;
  monthlyRevenue: number;
  dailyPlays: number;
  totalPlays: number;
  pricePerPlay: number;
  maxDailyPrize: number;
  uptimePercent: number;
  temperature: number;
  coinMechStatus: 'ok' | 'error';
  displayStatus: 'ok' | 'error';
}

export interface Alert {
  id: string;
  machineId: string;
  machineName: string;
  severity: AlertSeverity;
  message: string;
  createdAt: string;
  resolved: boolean;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  plays: number;
}

export interface FinancialSummary {
  dailyRevenue: number;
  monthlyRevenue: number;
  totalRevenue: number;
  estimatedProfit: number;
  revenueByMachine: { machineId: string; machineName: string; revenue: number }[];
}
