// DHRUVA-TWIN Command Header
// Premium minimal design: Station Switcher, Theme Switcher (Light/Dark), View Selector, Satellite Link, and Live Clock

import React, { useState, useEffect } from 'react';
import { StationConfig, StationId } from '../types';
import {
  Compass,
  Layers,
  ChevronDown,
  Activity,
  Sun,
  Moon,
  Sparkles,
  Package,
  Calendar,
  RotateCcw,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  currentStation: StationConfig;
  activeView: 'twin' | 'home';
  onSwitchView: (view: 'twin' | 'home') => void;
  onSwitchStation: (stationId: StationId) => void;
  onOpenDataLineage: () => void;
  onOpenCascadingRisk: () => void;
  onOpenLogistics: () => void;
  onOpenTimeline: () => void;
  onOpenDemoTour: () => void;
  onResetSimulation: () => void;
  isBlizzard: boolean;
  riskScore: number;
  isLightMode?: boolean;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStation,
  activeView,
  onSwitchView,
  onSwitchStation,
  onOpenDataLineage,
  onOpenCascadingRisk,
  onOpenLogistics,
  onOpenTimeline,
  onOpenDemoTour,
  onResetSimulation,
  isBlizzard,
  riskScore,
  isLightMode = false,
  onToggleTheme = () => {}
}) => {
  const [utcTime, setUtcTime] = useState('');
  const [stationDropdownOpen, setStationDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds} UTC`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-2.5 text-slate-800 dark:text-slate-100 flex flex-wrap items-center justify-between gap-3 select-none transition-colors duration-300 z-30 sticky top-0 shadow-sm">
      {/* Left: Brand & Station Identity */}
      <div className="flex items-center gap-3">
        {/* Brand emblem */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
          <Compass className="w-5 h-5" />
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>DHRUVA</span>
              <span className="text-xs font-medium text-sky-600 dark:text-sky-400 font-sans px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60">
                Antarctic Twin
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Ministry of Earth Sciences • NCPOR
          </p>
        </div>
      </div>

      {/* Center: Navigation & Quick Views */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* View Switcher: Overview vs 3D Twin */}
        <div className="bg-slate-100 dark:bg-slate-800/70 p-1 rounded-full flex items-center border border-slate-200/80 dark:border-slate-700/60 shadow-inner">
          <button
            onClick={() => onSwitchView('home')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'home'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => onSwitchView('twin')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'twin'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-500" />
            <span>Interactive 3D</span>
          </button>
        </div>

        {/* Station Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setStationDropdownOpen(!stationDropdownOpen)}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700/60 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{currentStation.id === 'bharati' ? 'Bharati Station' : 'Maitri Station'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {stationDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-1.5 text-xs">
              <div className="px-3 py-1.5 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Select Antarctic Station
              </div>
              <button
                onClick={() => {
                  onSwitchStation('bharati');
                  setStationDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                  currentStation.id === 'bharati'
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <div className="font-medium">Bharati Station</div>
                  <div className="text-[10px] text-slate-400">Larsemann Hills (69°24′S)</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </button>

              <button
                onClick={() => {
                  onSwitchStation('maitri');
                  setStationDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition mt-1 ${
                  currentStation.id === 'maitri'
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <div className="font-medium">Maitri Station</div>
                  <div className="text-[10px] text-slate-400">Schirmacher Oasis (70°46′S)</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-sky-500" />
              </button>
            </div>
          )}
        </div>

        {/* Cascading Risk Pill */}
        <button
          onClick={onOpenCascadingRisk}
          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
            riskScore > 75
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 animate-pulse'
              : riskScore > 40
              ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300'
          }`}
          title="Inspect cascading risk chain"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Risk Index: {riskScore}%</span>
        </button>

        {/* Quick action buttons */}
        <button
          onClick={onOpenLogistics}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Package className="w-3.5 h-3.5" />
          <span>Logistics</span>
        </button>

        <button
          onClick={onOpenTimeline}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Timeline</span>
        </button>

        <button
          onClick={onOpenDemoTour}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sm shadow-sky-500/20 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demo Tour</span>
        </button>

        <button
          onClick={onResetSimulation}
          className="px-2.5 py-1.5 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Reset simulation parameters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Theme Toggle & Satellite Status */}
      <div className="flex items-center gap-2.5">
        {/* LUXURY LIGHT / DARK MODE TOGGLE BUTTON */}
        <button
          id="theme-toggle-button"
          onClick={onToggleTheme}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 shadow-sm ${
            isLightMode
              ? 'bg-amber-50 hover:bg-amber-100/80 border-amber-200 text-amber-900 ring-1 ring-amber-200/50'
              : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-sky-200 ring-1 ring-sky-400/20'
          }`}
          title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {isLightMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
              <span className="font-semibold">Daylight Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold">Polar Night</span>
            </>
          )}
        </button>

        {/* Satellite Connection Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>GSAT-7A Online</span>
        </div>

        {/* Live UTC Clock */}
        <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{utcTime || '10:24 UTC'}</span>
        </div>
      </div>
    </header>
  );
};
