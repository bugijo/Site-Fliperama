/**
 * API client for the PlayPrize backend.
 *
 * Base URL is read from VITE_API_URL (set via .env).
 * All functions accept an AbortSignal so callers can cancel in-flight requests.
 *
 * Shape assumption: the backend returns camelCase JSON matching the types in
 * src/types/index.ts. If the backend uses snake_case or different field names,
 * add mapping functions here — pages/hooks never need to change.
 */

import type { Machine, RankEntry, Prize, PlayerProfile } from '../types';

const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:3000';

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  /** Lista todas as máquinas com localização e status atual */
  machines: (signal?: AbortSignal) =>
    get<Machine[]>('/v1/machines', signal),

  /** Ranking global (todos os scores, todas as máquinas) */
  globalRanking: (signal?: AbortSignal) =>
    get<RankEntry[]>('/v1/ranking/global', signal),

  /** Ranking de uma máquina específica */
  machineRanking: (machineId: string, signal?: AbortSignal) =>
    get<RankEntry[]>(`/v1/ranking/machine/${encodeURIComponent(machineId)}`, signal),

  /** Lista de prêmios ativos (diários, semanais, mensais) */
  prizes: (signal?: AbortSignal) =>
    get<Prize[]>('/v1/prizes', signal),

  /** Perfil de um jogador pelo nickname */
  player: (nickname: string, signal?: AbortSignal) =>
    get<PlayerProfile>(`/v1/players/${encodeURIComponent(nickname)}`, signal),
};
