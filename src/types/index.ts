export interface Machine {
  id: string;
  name: string;
  bar: string;
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  status: 'active' | 'offline';
  currentTopScore: number;
  currentTopPlayer: string;
  dailyPrize: number;
  weeklyPrize: number;
  playersToday: number;
}

export interface RankEntry {
  position: number;
  nickname: string;
  score: number;
  machineId: string;
  machineName: string;
  bar: string;
  date: string;
  wonPrize: boolean;
}

export interface Prize {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  label: string;
  amount: number;
  description: string;
  machineId: string;
  bar: string;
  neighborhood: string;
  deadline: string;
  claimed: boolean;
  holderNickname?: string;
}

export interface PlayerProfile {
  nickname: string;
  globalPosition: number;
  totalScore: number;
  gamesPlayed: number;
  prizesWon: Prize[];
}
