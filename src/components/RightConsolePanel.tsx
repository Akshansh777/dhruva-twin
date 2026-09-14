// DHRUVA-TWIN Right Console Panel
// Minimal & Friendly Luxury Design: Station Life Support & Interactive Crisis Scenarios

import React from 'react';
import { LifeSupportState, WhatIfScenarioResult } from '../types';
import {
  HeartPulse,
  Thermometer,
  Droplets,
  Gauge,
  Zap,
  Snowflake,
  Package,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame
} from 'lucide-react';

interface RightConsolePanelProps {
  lifeSupport: LifeSupportState;
  activeScenario: WhatIfScenarioResult | null;
  onRunBlizzard: () => void;
  onRunGeneratorFailure: () => void;
  onRunResupplyDelay: () => void;
  onResetSimulation: () => void;
  onOpenWhatIfModal: () => void;
}

export const RightConsolePanel: React.FC<RightConsolePanelProps> = ({
  lifeSupport,
  activeScenario,
  onRunBlizzard,
  onRunGeneratorFailure,
  onRunResupplyDelay,
  onResetSimulation,
  onOpenWhatIfModal
}) => {
  // Mini SVG Sparkline generator
  const renderSparkline = (data: number[], color: string) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 64;
    const height = 18;

    const points = data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg className="w-16 h-4 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="w-full lg:w-76 xl:w-80 flex flex-col gap-4 select-none">
      {/* 1. LIFE SUPPORT HEALTH CARD */}
      <div
        id="panel-life-support-health"
        className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm flex flex-col gap-3 transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold text-xs tracking-wide">
            <HeartPulse className="w-4 h-4 text-emerald-500" />
            <span>Habitation & Life Support</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
            All Systems Optimal
          </span>
        </div>

        {/* Telemetry Metrics */}
        <div className="flex flex-col gap-2 pt-1 text-xs">
          {/* Habitat Heat */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 px-3 py-2 rounded-xl">
            <div className="flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Habitat Comfort</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {lifeSupport.habitatHeatC > 0 ? `+${lifeSupport.habitatHeatC}` : lifeSupport.habitatHeatC}°C
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] text-slate-400">Target 21°C</span>
              {renderSparkline(lifeSupport.historyHeat, '#10b981')}
            </div>
          </div>

          {/* O2 Levels */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 px-3 py-2 rounded-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 flex items-center justify-center text-[9px] font-bold">
                O₂
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Oxygen Quality</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {lifeSupport.o2LevelPct}%
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] text-slate-400">Target 20.9%</span>
              {renderSparkline(lifeSupport.historyO2, '#0ea5e9')}
            </div>
          </div>

          {/* Water Reserve */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 px-3 py-2 rounded-xl">
            <div className="flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-blue-500" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Potable Water Reserve</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {lifeSupport.waterReservePct}%
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] text-slate-400">184 Days</span>
              {renderSparkline(lifeSupport.historyWater, '#3b82f6')}
            </div>
          </div>

          {/* Cabin Pressure */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 px-3 py-2 rounded-xl">
            <div className="flex items-center gap-2.5">
              <Gauge className="w-4 h-4 text-indigo-500" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Cabin Pressure</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {lifeSupport.cabinPressureKPa} kPa
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] text-slate-400">1.0 Atm</span>
              {renderSparkline(lifeSupport.historyPressure, '#6366f1')}
            </div>
          </div>
        </div>

        {/* Environmental Control Footer */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
          <span className="text-emerald-900 dark:text-emerald-200 font-medium">Atmospheric Loop</span>
          <span className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Recycling 98.4%
          </span>
        </div>
      </div>

      {/* 2. CRISIS SIMULATOR & WHAT-IF CONTROLS */}
      <div
        id="panel-crisis-simulator"
        className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm flex flex-col gap-3 transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold text-xs tracking-wide">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Scenario Stress Testing</span>
          </div>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
            activeScenario
              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            {activeScenario ? 'Scenario Active' : 'Virtual Sandbox'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          {/* SIMULATE BLIZZARD */}
          <button
            id="btn-simulate-blizzard"
            onClick={onRunBlizzard}
            className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between text-xs font-semibold transition shadow-sm ${
              activeScenario?.scenarioId === 'blizzard'
                ? 'bg-rose-500 text-white shadow-rose-500/20 ring-2 ring-rose-300'
                : 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <Snowflake className="w-4 h-4 text-rose-500" />
              <span>Simulate Severe Blizzard</span>
            </div>
            <span className="text-[10px] font-medium opacity-80">-48°C / 110 km/h</span>
          </button>

          {/* SIMULATE POWER CUT */}
          <button
            onClick={onRunGeneratorFailure}
            className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-semibold transition border ${
              activeScenario?.scenarioId === 'generator_failure'
                ? 'bg-sky-500 text-white shadow-sky-500/20 ring-2 ring-sky-300'
                : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Simulate Generator 2 Trip</span>
            </div>
            <span className="text-[10px] text-slate-400">Load Test</span>
          </button>

          {/* RESUPPLY DELAY */}
          <button
            onClick={onRunResupplyDelay}
            className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-semibold transition border ${
              activeScenario?.scenarioId === 'resupply_delay'
                ? 'bg-purple-500 text-white shadow-purple-500/20 ring-2 ring-purple-300'
                : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-500" />
              <span>10-Day Ship Resupply Delay</span>
            </div>
            <span className="text-[10px] text-slate-400">Fuel & Food</span>
          </button>
        </div>

        {/* Active Scenario Comparison Banner */}
        {activeScenario && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-700 dark:text-rose-300 font-semibold">Projected Impact</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                Health {activeScenario.before.stationHealth}% → {activeScenario.after.stationHealth}%
              </span>
            </div>

            <button
              onClick={onOpenWhatIfModal}
              className="w-full bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-700 hover:border-rose-400 text-rose-700 dark:text-rose-300 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <span>Explore Comparative Impact</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Footer & Reset */}
        <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800/80 pt-2 text-xs">
          <span className="text-slate-400">
            {activeScenario ? 'Scenario in progress' : 'Baseline nominal'}
          </span>
          <button
            onClick={onResetSimulation}
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
