// DHRUVA-TWIN Left Console Panel
// Minimal & Friendly Luxury Design: Live Polar Weather & Predictive Machinery Intelligence

import React from 'react';
import { WeatherData, GeneratorState } from '../types';
import {
  Thermometer,
  Wind,
  Sun,
  AlertTriangle,
  TrendingUp,
  Cpu,
  HelpCircle,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface LeftConsolePanelProps {
  weather: WeatherData;
  generator2: GeneratorState;
  isBlizzard: boolean;
  onOpenExplainability: () => void;
  onSelectGenerator: (genId: string) => void;
}

export const LeftConsolePanel: React.FC<LeftConsolePanelProps> = ({
  weather,
  generator2,
  isBlizzard,
  onOpenExplainability,
  onSelectGenerator
}) => {
  // SVG points for 24h temp trend
  const trend = weather.tempTrend24h;
  const minTemp = -60;
  const maxTemp = -10;
  const chartWidth = 260;
  const chartHeight = 65;

  const points = trend.map((pt, i) => {
    const x = (i / (trend.length - 1)) * chartWidth;
    const y = chartHeight - ((pt.temp - minTemp) / (maxTemp - minTemp)) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const failureDays = generator2.isIsolated ? 0 : generator2.estimatedFailureDays;

  return (
    <div className="w-full lg:w-76 xl:w-80 flex flex-col gap-4 select-none">
      {/* 1. POLAR WEATHER CARD */}
      <div
        id="panel-live-polar-weather"
        className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm flex flex-col gap-3 transition-colors duration-300"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold text-xs tracking-wide">
            <Thermometer className="w-4 h-4 text-sky-500" />
            <span>Polar Weather Telemetry</span>
          </div>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
            isBlizzard
              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse'
              : 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60'
          }`}>
            {isBlizzard ? 'Blizzard Active' : weather.windCategory}
          </span>
        </div>

        {/* Big Ambient Temperature Display */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {weather.ambientTemp > 0 ? `+${weather.ambientTemp}` : weather.ambientTemp}°C
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Feels like {(weather.ambientTemp - 8).toFixed(0)}°C with wind chill
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Wind className={`w-3.5 h-3.5 ${weather.windSpeed > 80 ? 'text-rose-500' : 'text-sky-500'}`} />
              <span>{weather.windSpeed} km/h</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {weather.windCategory}
            </div>
          </div>
        </div>

        {/* Quick Weather Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Solar Radiation</span>
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {weather.sunlight} W/m²
            </div>
            <div className="text-[10px] text-slate-400">Summer Recharge</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Barometer</span>
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              986 hPa
            </div>
            <div className="text-[10px] text-slate-400">Stable Pressure</div>
          </div>
        </div>

        {/* 24-Hour Temperature Curve */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/60 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>24h Temperature Trend</span>
            <span className="text-sky-600 dark:text-sky-400 font-semibold">Min -43° / Max -20°</span>
          </div>

          <div className="relative h-14 w-full flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="friendlyTempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Shaded Area */}
              <polygon
                points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
                fill="url(#friendlyTempGradient)"
              />

              {/* Smooth Stroke */}
              <polyline
                points={points}
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Latest Point */}
              {trend.length > 0 && (
                <circle
                  cx={chartWidth}
                  cy={chartHeight - ((trend[trend.length - 1].temp - minTemp) / (maxTemp - minTemp)) * chartHeight}
                  r="3.5"
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-200/80 dark:border-slate-700/60 pt-1">
            <span>Morning</span>
            <span>Afternoon</span>
            <span>Evening</span>
            <span>Night</span>
            <span>Now</span>
          </div>
        </div>
      </div>

      {/* 2. POWER & PREDICTIVE AI HEALTH */}
      <div
        id="panel-predictive-ai-engine"
        className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-sm flex flex-col gap-3 transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold text-xs tracking-wide">
            <Cpu className="w-4 h-4 text-amber-500" />
            <span>Power & Machine Health</span>
          </div>

          <button
            onClick={onOpenExplainability}
            className="flex items-center gap-1 text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded-full transition"
            title="Inspect predictive factor breakdown"
          >
            <HelpCircle className="w-3 h-3" />
            <span>AI Reasoning</span>
          </button>
        </div>

        {/* Generator 2 Advisory Card */}
        <div className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
          generator2.isIsolated
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
            : isBlizzard
            ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
        }`}>
          <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${
            generator2.isIsolated ? 'text-emerald-600 dark:text-emerald-400' : isBlizzard ? 'text-rose-500' : 'text-amber-500'
          }`} />
          <div className="flex-1">
            <div className="text-xs font-bold leading-tight">
              {generator2.isIsolated ? (
                <span>Generator #2 Safely Isolated</span>
              ) : (
                <span>Generator #2: Bearing Advisory</span>
              )}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
              {generator2.isIsolated ? (
                <span>Load seamlessly transferred to Generators 1 & 3. Station power remains 100% nominal.</span>
              ) : (
                <span>Vibration pattern indicates potential bearing wear in <strong>{failureDays.toFixed(1)} days</strong>.</span>
              )}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Failure Timeline */}
          <div className={`p-3 rounded-xl border flex flex-col justify-center ${
            generator2.isIsolated
              ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/60'
          }`}>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">
              {generator2.isIsolated ? 'Risk State' : 'Maintenance Window'}
            </span>
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white my-0.5">
              {generator2.isIsolated ? 'Protected' : `${failureDays.toFixed(1)}d`}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {generator2.isIsolated ? 'Safe redundancy' : 'Expected service timeline'}
            </span>
          </div>

          {/* Generator 2 Quick Stats */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Vibration:</span>
              <span className={`font-semibold ${generator2.vibrationMmS > 3.0 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200'}`}>
                {generator2.vibrationMmS} mm/s
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Bearing T°:</span>
              <span className={`font-semibold ${generator2.bearingTempC > 75 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200'}`}>
                {generator2.bearingTempC}°C
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Efficiency:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {generator2.isIsolated ? 'Standby' : `${generator2.efficiencyPct}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelectGenerator('gen-02')}
          className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-100 px-3 py-2 rounded-xl flex items-center justify-between text-xs font-semibold transition"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-500" />
            <span>{generator2.isIsolated ? 'Gen 1 & 3 Supplying Power' : 'Inspect Generator 2 Telemetry'}</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
