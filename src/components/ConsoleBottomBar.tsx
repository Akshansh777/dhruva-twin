// DHRUVA-TWIN Bottom Bar Console
// Minimal & Friendly Luxury Design: Station Status & Expedition Telemetry (Desktop & Mobile Zero Overlaps)

import React from 'react';
import { StationConfig, AIRecommendation } from '../types';
import {
  Users,
  Globe2,
  Mountain,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface ConsoleBottomBarProps {
  station: StationConfig;
  pendingRecommendation: AIRecommendation | null;
  onOpenRecommendation: () => void;
}

export const ConsoleBottomBar: React.FC<ConsoleBottomBarProps> = ({
  station,
  pendingRecommendation,
  onOpenRecommendation
}) => {
  return (
    <footer className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-6 py-2 text-slate-600 dark:text-slate-300 text-xs flex flex-wrap items-center justify-between gap-2 select-none transition-colors duration-300 z-30 shrink-0">
      {/* Telemetry metadata cells */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Mission Day */}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Mission</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Day {station.missionDay}</span>
          </div>
        </div>

        {/* Crew Count */}
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Crew</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{station.crewCount} Onsite</span>
          </div>
        </div>

        {/* Coordinates: Latitude & Longitude */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <div className="flex items-baseline gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{station.lat}</span>
            <span>,</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{station.lon}</span>
          </div>
        </div>

        {/* Elevation */}
        <div className="hidden md:flex items-center gap-1.5">
          <Mountain className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] text-slate-400 font-medium">Altitude</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{station.elevationM} m</span>
          </div>
        </div>

        {/* System Health */}
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Sync</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">99.98%</span>
          </div>
        </div>
      </div>

      {/* Right side: AI Decision Support Alert CTA if recommendation is pending */}
      {pendingRecommendation && pendingRecommendation.status !== 'approved' && (
        <button
          onClick={onOpenRecommendation}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2 shadow-sm transition transform hover:scale-[1.02] shrink-0 animate-pulse"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Optimization Recommendation Available</span>
          <span className="sm:hidden">AI Advisory Pending</span>
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      )}
    </footer>
  );
};
