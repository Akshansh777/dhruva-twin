// DHRUVA-TWIN Mission Control Home Screen
// Minimal & Friendly Luxury Design: National Antarctic Operations, Station Switcher, and Mission Readiness

import React from 'react';
import { StationOperationalState, StationId, MissionEvent } from '../types';
import {
  Compass,
  ArrowRight,
  Shield,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Database,
  Clock,
  ExternalLink,
  Users,
  Wind,
  Thermometer,
  Zap,
  Activity
} from 'lucide-react';

interface MissionControlHomeProps {
  bharatiStation: StationOperationalState;
  maitriStation: StationOperationalState;
  activeStationId: StationId;
  onEnterStationTwin: (stationId: StationId) => void;
  onOpenCascadingRisk: () => void;
  onOpenDemoTour: () => void;
  onOpenDataLineage: () => void;
  events: MissionEvent[];
}

export const MissionControlHome: React.FC<MissionControlHomeProps> = ({
  bharatiStation,
  maitriStation,
  activeStationId,
  onEnterStationTwin,
  onOpenCascadingRisk,
  onOpenDemoTour,
  onOpenDataLineage,
  events
}) => {
  const bharatiHealth = bharatiStation.stationHealthPct;
  const bharatiRisk = bharatiStation.cascadingRisk.overallScore;
  const maitriHealth = maitriStation.stationHealthPct;

  return (
    <div className="w-full flex-1 p-4 sm:p-8 flex flex-col gap-6 overflow-y-auto select-none bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Hero Welcome & National Mission Banner */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-colors duration-300">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 shrink-0">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                SIH 2026 • SIH26060
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                Ministry of Earth Sciences • NCPOR
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1.5">
              Antarctic Mission Digital Twin
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time remote surveillance, multi-physics digital models, and AI-assisted predictive diagnostics for India's polar research stations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={onOpenDemoTour}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold px-5 py-2.5 rounded-full text-xs flex items-center gap-2 shadow-sm shadow-sky-500/25 transition transform hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>5-Minute Guided Tour</span>
          </button>
          <button
            onClick={onOpenDataLineage}
            className="bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-full text-xs font-medium transition"
          >
            Data Provenance
          </button>
        </div>
      </div>

      {/* Two Antarctic Station Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: BHARATI STATION (Primary 3D Twin) */}
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-sky-200 dark:border-sky-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-5 transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  33rd Indian Expedition • Primary Base
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Bharati Station
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Larsemann Hills (69°24′S 76°11′E)</span>
              </div>

              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  bharatiRisk > 70
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}>
                  Health: {bharatiHealth}%
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Environment</span>
                <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5">
                  {bharatiStation.weather.ambientTemp}°C
                </div>
                <span className="text-[10px] text-slate-400">{bharatiStation.weather.windSpeed} km/h wind</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Expedition Crew</span>
                <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5">
                  {bharatiStation.config.crewCount} Personnel
                </div>
                <span className="text-[10px] text-slate-400">Overwinter Team</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Power Grid</span>
                <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5">
                  2x Generators
                </div>
                <span className="text-[10px] text-amber-500 font-medium">Gen 2 Advisory</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Fuel Buffer</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                  {bharatiStation.logistics.fuelDaysAutonomy.toFixed(0)} Days
                </div>
                <span className="text-[10px] text-slate-400">Reserves Secure</span>
              </div>
            </div>

            {/* Diagnostic Alert Callout */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Predictive Diagnostic: Generator 2 bearing harmonic vibration flagged by AI engine</span>
              </div>
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">Action Suggested</span>
            </div>
          </div>

          <button
            onClick={() => onEnterStationTwin('bharati')}
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm shadow-sky-500/20 transition"
          >
            <Layers className="w-4 h-4" />
            <span>Open Bharati Interactive 3D Twin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* CARD 2: MAITRI STATION (Schirmacher Oasis) */}
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-5 transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Established 1989 • Oasis Base
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Maitri Station
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Schirmacher Oasis (70°46′S 11°44′E)</span>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Health: {maitriHealth}%
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Freshwater</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                  Lake Priyadarshini
                </div>
                <span className="text-[10px] text-slate-400">Pumps active</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Expedition Crew</span>
                <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5">
                  {maitriStation.config.crewCount} Personnel
                </div>
                <span className="text-[10px] text-slate-400">Winter Staff</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Power Grid</span>
                <div className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5">
                  Nominal
                </div>
                <span className="text-[10px] text-emerald-500 font-medium">Redundancy OK</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Fuel Buffer</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                  {maitriStation.logistics.fuelDaysAutonomy.toFixed(0)} Days
                </div>
                <span className="text-[10px] text-slate-400">Reserves Secure</span>
              </div>
            </div>

            {/* Status Callout */}
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Station telemetry nominal. Lake Priyadarshini water pumps operating within normal parameters.</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Steady</span>
            </div>
          </div>

          <button
            onClick={() => onEnterStationTwin('maitri')}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 transition"
          >
            <Layers className="w-4 h-4 text-sky-500" />
            <span>Open Maitri Station Telemetry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mission Readiness Matrix */}
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-sky-500" />
            <span className="text-base font-bold text-slate-900 dark:text-white">
              All-India Antarctic Mission Readiness Matrix
            </span>
          </div>
          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            Readiness Index: 91.8%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Environment</span>
            <div className="my-1.5 text-lg font-bold text-amber-500">84%</div>
            <span className="text-[10px] text-slate-400">Polar Eve (-43°C)</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Power Grid</span>
            <div className="my-1.5 text-lg font-bold text-emerald-500">92%</div>
            <span className="text-[10px] text-slate-400">2x Gensets Online</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Infrastructure</span>
            <div className="my-1.5 text-lg font-bold text-emerald-500">96%</div>
            <span className="text-[10px] text-slate-400">Stilt Foundations OK</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Life Support</span>
            <div className="my-1.5 text-lg font-bold text-emerald-500">98%</div>
            <span className="text-[10px] text-slate-400">+21°C / 20.9% O2</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Logistics Buffer</span>
            <div className="my-1.5 text-lg font-bold text-amber-500">82%</div>
            <span className="text-[10px] text-slate-400">Fuel 27.8d Autonomy</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Communication</span>
            <div className="my-1.5 text-lg font-bold text-sky-500">99%</div>
            <span className="text-[10px] text-slate-400">GSAT / Inmarsat Live</span>
          </div>
        </div>
      </div>

      {/* Recent Mission Events Stream */}
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-500" />
            <span className="text-base font-bold text-slate-900 dark:text-white">
              Live Operations & Telemetry Audit Log
            </span>
          </div>
          <span className="text-xs text-slate-400">Synchronized via satellite</span>
        </div>

        <div className="space-y-2.5">
          {events.slice(0, 4).map((evt) => (
            <div
              key={evt.id}
              className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-sky-600 dark:text-sky-400 font-semibold font-mono shrink-0">{evt.timestamp}</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{evt.description}</span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shrink-0">
                {evt.subsystem}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
