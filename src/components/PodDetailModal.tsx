// DHRUVA-TWIN 3D Pod & Module Inspector Modal
// Minimal & Friendly Luxury Design: Shows detailed subsystem telemetry when an operator clicks any pod on the 3D digital twin

import React from 'react';
import { StationPod } from '../types';
import {
  Layers,
  X,
  Thermometer,
  Zap,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Cpu
} from 'lucide-react';

interface PodDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pod: StationPod | null;
}

export const PodDetailModal: React.FC<PodDetailModalProps> = ({ isOpen, onClose, pod }) => {
  if (!isOpen || !pod) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none transition-all">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center justify-center font-bold text-xs">
              {pod.id.split('-')[1]?.toUpperCase() || 'POD'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{pod.name}</h3>
              <span className="text-[11px] text-slate-400 font-medium uppercase">{pod.type} Module</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
              pod.status === 'nominal'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                : pod.status === 'warning'
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
            }`}>
              {pod.status}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pod Description */}
        <p className="text-slate-600 dark:text-slate-300 text-xs bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 leading-relaxed">
          {pod.description}
        </p>

        {/* Real-time Telemetry Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <Thermometer className="w-4 h-4 text-emerald-500" />
              <span>Internal Temp</span>
            </div>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{pod.tempC}°C</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <Zap className="w-4 h-4 text-sky-500" />
              <span>Power Draw</span>
            </div>
            <span className="text-sm font-bold text-sky-600 dark:text-sky-400">{pod.powerDrawKW} kW</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <Wind className="w-4 h-4 text-sky-500" />
              <span>HVAC Airflow</span>
            </div>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{pod.hvacAirflowM3H} m³/h</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <Activity className="w-4 h-4 text-sky-500" />
              <span>Structural Strain</span>
            </div>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{pod.structuralStrainUe} µε</span>
          </div>
        </div>

        {/* Structural Spec / Container Design */}
        <div className="bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
          <div className="flex justify-between">
            <span>Container Shell Spec:</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Corten-A Weathering Steel</span>
          </div>
          <div className="flex justify-between">
            <span>Thermal Insulation:</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">200mm Polyurethane Core (U = 0.11 W/m²K)</span>
          </div>
          <div className="flex justify-between">
            <span>Stilt Clearance:</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">4.2 meters above hard ice</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-full text-xs font-semibold transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
