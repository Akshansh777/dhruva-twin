// DHRUVA-TWIN Mobile Twin View
// Clean, Dedicated Mobile Experience for Polar Digital Twin: Zero overlaps, touch-optimized tabs, and interactive 3D model

import React, { useState } from 'react';
import {
  StationOperationalState,
  StationPod,
  GeneratorState,
  WhatIfScenarioResult
} from '../types';
import { Station3DView } from './Station3DView';
import { LeftConsolePanel } from './LeftConsolePanel';
import { RightConsolePanel } from './RightConsolePanel';
import {
  Layers,
  Thermometer,
  Cpu,
  HeartPulse,
  Zap,
  RotateCcw,
  AlertTriangle,
  Activity,
  Sparkles,
  ChevronRight,
  Info,
  Package,
  Wind,
  ShieldCheck,
  Compass,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';

export type MobileTab = '3d' | 'weather' | 'ai' | 'lifesupport' | 'crisis' | 'stacked';

interface MobileTwinViewProps {
  currentStation: StationOperationalState;
  generator2: GeneratorState;
  isBlizzard: boolean;
  isLightMode: boolean;
  selectedPod: StationPod | null;
  onSelectPod: (pod: StationPod) => void;
  onRunBlizzard: () => void;
  onRunGeneratorFailure: () => void;
  onRunResupplyDelay: () => void;
  onResetSimulation: () => void;
  onOpenCascadingRisk: () => void;
  onOpenExplainability: () => void;
  onOpenWhatIfModal: () => void;
  onOpenLogistics: () => void;
  onOpenRecommendation: () => void;
  activeScenario: WhatIfScenarioResult | null;
}

export const MobileTwinView: React.FC<MobileTwinViewProps> = ({
  currentStation,
  generator2,
  isBlizzard,
  isLightMode,
  selectedPod,
  onSelectPod,
  onRunBlizzard,
  onRunGeneratorFailure,
  onRunResupplyDelay,
  onResetSimulation,
  onOpenCascadingRisk,
  onOpenExplainability,
  onOpenWhatIfModal,
  onOpenLogistics,
  onOpenRecommendation,
  activeScenario
}) => {
  const [mobileTab, setMobileTab] = useState<MobileTab>('3d');
  const riskScore = currentStation.cascadingRisk.overallScore;
  const failureDays = generator2.isIsolated ? 0 : generator2.estimatedFailureDays;

  return (
    <div className="flex flex-col flex-1 w-full h-full overflow-hidden select-none bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      
      {/* MOBILE SEGMENTED VIEW CONTROLLER (TOP SUB-BAR) */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-2 py-2 flex items-center justify-between gap-1 overflow-x-auto custom-scrollbar shrink-0 z-20">
        <div className="flex items-center gap-1 min-w-max mx-auto">
          <button
            onClick={() => setMobileTab('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              mobileTab === '3d'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Model</span>
          </button>

          <button
            onClick={() => setMobileTab('weather')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              mobileTab === 'weather'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Weather</span>
          </button>

          <button
            onClick={() => setMobileTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition relative ${
              mobileTab === 'ai'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Predictive AI</span>
            {generator2.vibrationMmS > 4.0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-1 right-1" />
            )}
          </button>

          <button
            onClick={() => setMobileTab('lifesupport')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              mobileTab === 'lifesupport'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Life Support</span>
          </button>

          <button
            onClick={() => setMobileTab('crisis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              mobileTab === 'crisis'
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Crisis Sim</span>
          </button>

          <button
            onClick={() => setMobileTab('stacked')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
              mobileTab === 'stacked'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>All Cards</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: GUARANTEED ZERO OVERLAP */}
      <div className="flex-1 w-full h-full overflow-hidden relative">

        {/* 1. 3D MODEL VIEW (UNOBSTRUCTED TOUCH CANVAS) */}
        {mobileTab === '3d' && (
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            {/* 3D Visualizer Canvas (Takes 100% available area) */}
            <div className="absolute inset-0 z-0">
              <Station3DView
                stationId={currentStation.config.id}
                isBlizzard={isBlizzard}
                stationHealth={currentStation.stationHealthPct}
                statusPower={currentStation.power.generators.some(g => g.status === 'critical') ? 'critical' : currentStation.power.generators.some(g => g.status === 'warning') ? 'warning' : 'nominal'}
                statusHabitation={currentStation.lifeSupport.status}
                statusFuel={currentStation.logistics.fuelStatus}
                statusWater={currentStation.lifeSupport.status}
                selectedPod={selectedPod ? selectedPod.id : null}
                isLightMode={isLightMode}
                onSelectPod={(podId) => {
                  const pod = currentStation.pods.find((p) =>
                    p.id === podId ||
                    p.id.includes(podId) ||
                    podId.includes(p.id.replace('pod-', '')) ||
                    (podId === 'power' && p.id === 'pod-pwr') ||
                    (podId === 'habitation' && p.id === 'pod-hab') ||
                    (podId === 'science' && p.id === 'pod-lab') ||
                    (podId === 'water' && p.id === 'pod-lif') ||
                    (podId === 'fuel' && p.id === 'pod-lif')
                  ) || currentStation.pods[0];
                  onSelectPod(pod);
                }}
              />
            </div>

            {/* Top Non-blocking HUD Chip */}
            <div className="absolute top-2 left-2 right-2 z-10 flex flex-col items-center gap-1.5 pointer-events-none">
              <div className="inline-flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-800 dark:text-slate-100">
                  {currentStation.config.name}
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-sky-600 dark:text-sky-400 font-mono">
                  {currentStation.weather.ambientTempC}°C
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {currentStation.stationHealthPct}% Health
                </span>
              </div>

              {/* Blizzard banner if active */}
              {isBlizzard && (
                <div className="bg-rose-600/95 text-white backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold shadow-lg flex items-center gap-2 pointer-events-auto animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-200" />
                  <span>Blizzard Active (112 km/h)</span>
                  <button
                    onClick={onOpenCascadingRisk}
                    className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition"
                  >
                    Risk Chain
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Touch-friendly Pod Selector Carousel */}
            <div className="absolute bottom-2 left-2 right-2 z-10 pointer-events-auto flex flex-col gap-2">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-2 shadow-lg">
                <div className="flex items-center justify-between px-2 pb-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <span>Tap Pod to Inspect Telemetry:</span>
                  <span className="text-slate-400">Pinch to zoom • Drag to orbit</span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                  {currentStation.pods.map((pod) => {
                    const isSelected = selectedPod?.id === pod.id;
                    return (
                      <button
                        key={pod.id}
                        onClick={() => onSelectPod(pod)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 flex items-center gap-1.5 transition ${
                          isSelected
                            ? 'bg-sky-500 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          pod.status === 'nominal' ? 'bg-emerald-400' : pod.status === 'warning' ? 'bg-amber-400' : 'bg-rose-500'
                        }`} />
                        <span>{pod.name}</span>
                        <span className="text-[10px] opacity-75 font-mono">+{pod.tempC}°C</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Floating Quick Navigation & Risk Pill */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={onOpenCascadingRisk}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transition ${
                    riskScore > 75
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  <span>Risk: {riskScore}%</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onRunBlizzard}
                    className="bg-sky-500 hover:bg-sky-400 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transition"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Simulate Blizzard</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. POLAR WEATHER TAB */}
        {mobileTab === 'weather' && (
          <div className="w-full h-full overflow-y-auto p-4 flex flex-col gap-4 pb-20">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-sky-500" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Polar Weather Telemetry</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">AWS Met Mast 01 • Larsemann Hills</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold uppercase bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800 px-2.5 py-0.5 rounded-full">
                  {currentStation.weather.windCategory}
                </span>
              </div>

              {/* Major Temperature Callout */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ambient Temp</span>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
                    {currentStation.weather.ambientTempC}°C
                  </div>
                  <span className="text-[11px] text-slate-400">Record low: -52°C</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Wind Chill</span>
                  <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono mt-1">
                    {currentStation.weather.windChillC}°C
                  </div>
                  <span className="text-[11px] text-rose-500 font-medium">Extreme Risk</span>
                </div>
              </div>

              {/* Wind Speed & Pressure Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Wind className="w-3.5 h-3.5 text-sky-500" />
                    <span>Katabatic Wind</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    {currentStation.weather.windSpeed} km/h
                  </div>
                  <span className="text-[10px] text-slate-400">Direction: {currentStation.weather.windDirection}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Activity className="w-3.5 h-3.5 text-sky-500" />
                    <span>Barometric Pressure</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    {currentStation.weather.barometricPressureHpa} hPa
                  </div>
                  <span className="text-[10px] text-slate-400">Rapid drop (-4 hPa/h)</span>
                </div>
              </div>

              {/* 24-Hour Temp History Sparkline */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200/70 dark:border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">24-Hour Temperature Curve</span>
                  <span className="text-slate-400 text-[11px]">-60°C to -10°C</span>
                </div>
                <div className="h-16 w-full flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 280 60">
                    <polyline
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      points={currentStation.weather.tempTrend24h.map((pt, i) => {
                        const x = (i / (currentStation.weather.tempTrend24h.length - 1)) * 280;
                        const y = 60 - ((pt.temp - (-60)) / (50)) * 60;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PREDICTIVE AI ENGINE TAB */}
        {mobileTab === 'ai' && (
          <div className="w-full h-full overflow-y-auto p-4 flex flex-col gap-4 pb-20">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Predictive AI Anomaly</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Generator 02 Bearing Vibration Analysis</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold uppercase bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full">
                  Fatigue Watch
                </span>
              </div>

              {/* Anomaly Highlight */}
              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-200">
                    Harmonic Bearing Vibration High
                  </span>
                  <span className="text-base font-extrabold text-amber-700 dark:text-amber-400 font-mono">
                    {generator2.vibrationMmS} mm/s
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  2.4x baseline threshold (ISO 10816 class II). AI model projects bearing seizure in{' '}
                  <span className="font-bold text-rose-600 dark:text-rose-400">{failureDays > 0 ? `${failureDays} days` : 'Offline'}</span> under continuous blizzard power demand.
                </p>
              </div>

              {/* Machinery Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-400 font-medium">Bearing Temp</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono">{generator2.temperatureC}°C</span>
                  <span className="text-[10px] text-amber-500">Max limit: 95°C</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-400 font-medium">Oil Pressure</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono">{generator2.lubeOilPressureBar} bar</span>
                  <span className="text-[10px] text-slate-400">Nominal: 3.0 bar</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onOpenExplainability}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explain Root Cause (Shapley Analysis)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 4. LIFE SUPPORT HEALTH TAB */}
        {mobileTab === 'lifesupport' && (
          <div className="w-full h-full overflow-y-auto p-4 flex flex-col gap-4 pb-20">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-emerald-500" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Habitat Life Support</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Atmospheric & Thermal Equilibrium</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                  Nominal
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-400 font-medium">Habitat Temp</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    +{currentStation.lifeSupport.internalTempC}°C
                  </span>
                  <span className="text-[10px] text-slate-400">Target: +21°C</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-400 font-medium">Oxygen Level</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    {currentStation.lifeSupport.o2Pct}%
                  </span>
                  <span className="text-[10px] text-emerald-500">Safe breathable band</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-400 font-medium">Water Reserves</span>
                  <span className="text-base font-bold text-sky-600 dark:text-sky-400 font-mono">
                    {currentStation.lifeSupport.potableWaterLiters} L
                  </span>
                  <span className="text-[10px] text-slate-400">{currentStation.lifeSupport.waterAutonomyDays} days buffer</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 flex flex-col gap-1">
                  <span className="text-slate-400 font-medium">Fuel Autonomy</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                    {currentStation.logistics.fuelDaysRemaining} days
                  </span>
                  <span className="text-[10px] text-slate-400">{currentStation.logistics.fuelReserveLiters} L remaining</span>
                </div>
              </div>

              <button
                onClick={onOpenLogistics}
                className="w-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition"
              >
                <Package className="w-3.5 h-3.5 text-sky-500" />
                <span>Open Logistics & Resupply Intelligence</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 5. CRISIS SIMULATOR TAB */}
        {mobileTab === 'crisis' && (
          <div className="w-full h-full overflow-y-auto p-4 flex flex-col gap-4 pb-20">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Crisis Stress Simulator</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Multi-Physics Dynamic Stress Scenarios</p>
                  </div>
                </div>
                <button
                  onClick={onResetSimulation}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Reset Simulation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Stress Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={onRunBlizzard}
                  className="w-full bg-rose-50 hover:bg-rose-100/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Wind className="w-4 h-4 text-rose-500" />
                    <div className="text-left">
                      <div>Category 4 Blizzard</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">112 km/h • Wind chill -43°C</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400" />
                </button>

                <button
                  onClick={onRunGeneratorFailure}
                  className="w-full bg-amber-50 hover:bg-amber-100/80 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-amber-500" />
                    <div className="text-left">
                      <div>Generator 02 Trip</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Bearing seizure • Grid deficit</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>

                <button
                  onClick={onRunResupplyDelay}
                  className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-sky-500" />
                    <div className="text-left">
                      <div>+10-Day Ship Delay</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Vasiliy Golovnin fast-ice pack</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* What-if modal trigger */}
              <button
                onClick={onOpenWhatIfModal}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open Multi-Horizon What-If Analysis</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. STACKED DASHBOARD FEED (ALL CARDS IN A VERTICALLY SCROLLING CLEAN VIEW) */}
        {mobileTab === 'stacked' && (
          <div className="w-full h-full overflow-y-auto p-4 flex flex-col gap-4 pb-20 custom-scrollbar">
            {/* Embedded 3D Model Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-3 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Interactive 3D Digital Twin</span>
                </div>
                <button
                  onClick={() => setMobileTab('3d')}
                  className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold"
                >
                  Full Screen →
                </button>
              </div>
              <div className="w-full h-52 rounded-xl overflow-hidden relative border border-slate-200/60 dark:border-slate-800">
                <Station3DView
                  stationId={currentStation.config.id}
                  isBlizzard={isBlizzard}
                  stationHealth={currentStation.stationHealthPct}
                  statusPower={currentStation.power.generators.some(g => g.status === 'critical') ? 'critical' : currentStation.power.generators.some(g => g.status === 'warning') ? 'warning' : 'nominal'}
                  statusHabitation={currentStation.lifeSupport.status}
                  statusFuel={currentStation.logistics.fuelStatus}
                  statusWater={currentStation.lifeSupport.status}
                  selectedPod={selectedPod ? selectedPod.id : null}
                  isLightMode={isLightMode}
                  onSelectPod={(podId) => {
                    const pod = currentStation.pods.find((p) => p.id.includes(podId)) || currentStation.pods[0];
                    onSelectPod(pod);
                  }}
                />
              </div>
            </div>

            {/* Weather Card */}
            <div className="w-full">
              <LeftConsolePanel
                weather={currentStation.weather}
                generator2={generator2}
                isBlizzard={isBlizzard}
                onOpenExplainability={onOpenExplainability}
                onSelectGenerator={() => onOpenExplainability()}
              />
            </div>

            {/* Systems & Crisis Card */}
            <div className="w-full">
              <RightConsolePanel
                lifeSupport={currentStation.lifeSupport}
                activeScenario={activeScenario}
                onRunBlizzard={onRunBlizzard}
                onRunGeneratorFailure={onRunGeneratorFailure}
                onRunResupplyDelay={onRunResupplyDelay}
                onResetSimulation={onResetSimulation}
                onOpenWhatIfModal={onOpenWhatIfModal}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
