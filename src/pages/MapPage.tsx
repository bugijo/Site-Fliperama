import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Wifi, WifiOff, Trophy, Gamepad2, ChevronRight } from 'lucide-react';
import { machines } from '../data/mock';
import type { Machine } from '../types';
import { Link } from 'react-router-dom';

// Fix default icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createNeonIcon(status: Machine['status']) {
  const online = status === 'active';
  return L.divIcon({
    className: '',
    html: `<div class="pp-marker"><div class="pp-marker-ring${online ? ' online' : ''}"><div class="pp-marker-dot"></div></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

function FlyTo({ machine }: { machine: Machine | null }) {
  const map = useMap();
  useEffect(() => {
    if (machine) {
      map.flyTo([machine.lat, machine.lng], 15, { duration: 1 });
    }
  }, [machine, map]);
  return null;
}

function formatScore(n: number) {
  return n.toLocaleString('pt-BR');
}

export function MapPage() {
  const [selected, setSelected] = useState<Machine | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'offline'>('all');

  const filtered = machines.filter((m) => filter === 'all' || m.status === filter);
  const activeCount = machines.filter((m) => m.status === 'active').length;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100svh-64px)] overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-full lg:w-80 shrink-0 flex flex-col bg-[#0a0015] border-r border-purple-900/20 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-purple-900/20">
          <h1 className="font-game font-bold text-white text-lg mb-1">Mapa de Máquinas</h1>
          <p className="text-xs text-slate-500 mb-4">São Paulo — {activeCount} ativas agora</p>

          {/* Filters */}
          <div className="flex gap-1.5">
            {([
              { v: 'all', label: 'Todas' },
              { v: 'active', label: 'Online' },
              { v: 'offline', label: 'Offline' },
            ] as const).map(({ v, label }) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filter === v
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-purple-900/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Machine list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className={`w-full text-left p-4 border-b border-purple-900/10 transition-all cursor-pointer hover:bg-purple-500/5 ${
                selected?.id === m.id ? 'bg-purple-500/10 border-l-2 border-l-purple-500' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${m.status === 'active' ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {m.status === 'active' ? <Wifi size={16} /> : <WifiOff size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{m.bar}</p>
                  <p className="text-xs text-slate-500 truncate mb-2">{m.neighborhood} — {m.address}</p>
                  {m.status === 'active' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Trophy size={11} className="text-yellow-500" />
                        <span className="text-xs text-slate-400 truncate max-w-[90px]">{m.currentTopPlayer}</span>
                      </div>
                      <span className="text-xs font-bold text-white tabular-nums">{formatScore(m.currentTopScore)}</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ── Map ── */}
      <div className="flex-1 relative">
        <MapContainer
          center={[-23.5729, -46.6728]}
          zoom={12}
          className="w-full h-full"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <FlyTo machine={selected} />
          {filtered.map((m) => (
            <Marker
              key={m.id}
              position={[m.lat, m.lng]}
              icon={createNeonIcon(m.status)}
              eventHandlers={{ click: () => setSelected(m) }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${m.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    <span className="text-xs font-semibold text-purple-300">{m.name}</span>
                  </div>
                  <p className="font-bold text-white text-sm mb-0.5">{m.bar}</p>
                  <p className="text-xs text-slate-400 mb-3">{m.address}</p>
                  {m.status === 'active' && (
                    <>
                      <div className="border-t border-purple-900/30 pt-3 mb-3 space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Líder:</span>
                          <span className="font-bold text-purple-300">{m.currentTopPlayer}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Score:</span>
                          <span className="font-bold text-white">{formatScore(m.currentTopScore)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Prêmio dia:</span>
                          <span className="font-bold text-yellow-400">R$ {m.dailyPrize}</span>
                        </div>
                        <div className="flex items-center gap-1 justify-end text-xs text-slate-500 mt-1">
                          <Gamepad2 size={10} />
                          <span>{m.playersToday} partidas hoje</span>
                        </div>
                      </div>
                    </>
                  )}
                  {m.status === 'offline' && (
                    <p className="text-xs text-slate-500 italic">Máquina temporariamente offline</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Selected machine panel */}
        {selected && (
          <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-72 z-[400]">
            <div className="card-neon rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-widest mb-0.5">{selected.name}</p>
                  <h3 className="font-bold text-white text-base">{selected.bar}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-slate-500" />
                    <span className="text-xs text-slate-500">{selected.address}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white text-lg leading-none cursor-pointer ml-2">×</button>
              </div>

              {selected.status === 'active' ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Líder</span>
                    <span className="font-bold text-purple-300">{selected.currentTopPlayer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Score líder</span>
                    <span className="font-bold text-white tabular-nums">{formatScore(selected.currentTopScore)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prêmio dia</span>
                    <span className="font-black text-yellow-400">R$ {selected.dailyPrize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prêmio semana</span>
                    <span className="font-black text-yellow-400">R$ {selected.weeklyPrize}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">Máquina temporariamente offline.</p>
              )}

              <Link
                to="/ranking"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white btn-primary"
              >
                Ver ranking <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
