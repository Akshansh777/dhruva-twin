// DHRUVA-TWIN What-If Scenario Comparison Modal
// Minimal & Friendly Luxury Design: Before vs After comparison matrix across operational metrics + Timeline Projections

import React from 'react';
import { WhatIfScenarioResult } from '../types';
import {
  GitCompare,
  X,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Droplets,
  HeartPulse
} from 'lucide-react';

interface WhatIfComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: WhatIfScenarioResult | null;
  onOpenRecommendation: () => void;
}

export const WhatIfComparisonModal: React.FC<WhatIfComparisonModalProps> = ({
  isOpen,
  onClose,
  scenario,
  onOpenRecommendation
}) => {
  if (!isOpen || !scenario) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none transition-all">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        {/* Top Header */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center justify-center">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Scenario Impact Evaluation: {scenario.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Non-destructive twin simulation: Baseline State vs Projected Stress State
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh] text-xs">
          {/* Critical Threshold Breach Callout */}
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shrink-0">
                !
              </div>
              <div>
                <span className="text-[11px] uppercase font-semibold text-rose-700 dark:text-rose-300 block">
                  Earliest Critical Threshold Breach
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {scenario.firstCriticalMetric}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenRecommendation();
              }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold px-4 py-2 rounded-full text-xs flex items-center gap-2 shadow-sm transition shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply AI Mitigation</span>
            </button>
          </div>

          {/* BEFORE vs AFTER Comparison Table */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Metric Impact Comparison Matrix (Baseline vs Simulated Stress)
            </span>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-4 bg-slate-50 dark:bg-slate-800/60 px-5 py-3 text-[11px] text-slate-400 font-semibold uppercase border-b border-slate-100 dark:border-slate-800">
                <span>Operational Metric</span>
                <span className="text-center text-sky-600 dark:text-sky-400">Baseline (Before)</span>
                <span className="text-center text-rose-600 dark:text-rose-400">Simulated (After)</span>
                <span className="text-right">Projected Delta</span>
              </div>

              {/* Row 1: Station Health */}
              <div className="grid grid-cols-4 px-5 py-3.5 items-center border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Station Health</span>
                <span className="text-center font-bold text-emerald-600 dark:text-emerald-400">{scenario.before.stationHealth}%</span>
                <span className="text-center font-bold text-rose-600 dark:text-rose-400">{scenario.after.stationHealth}%</span>
                <span className="text-right font-semibold text-rose-600 dark:text-rose-400">
                  {scenario.after.stationHealth - scenario.before.stationHealth}%
                </span>
              </div>

              {/* Row 2: Power Demand */}
              <div className="grid grid-cols-4 px-5 py-3.5 items-center border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Total Power Demand</span>
                <span className="text-center font-semibold text-slate-600 dark:text-slate-300">{scenario.before.powerLoadKW} kW</span>
                <span className="text-center font-bold text-rose-600 dark:text-rose-400">{scenario.after.powerLoadKW} kW</span>
                <span className="text-right font-semibold text-rose-600 dark:text-rose-400">
                  +{scenario.after.powerLoadKW - scenario.before.powerLoadKW} kW
                </span>
              </div>

              {/* Row 3: Generator Utilization */}
              <div className="grid grid-cols-4 px-5 py-3.5 items-center border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Generator Utilization</span>
                <span className="text-center font-bold text-emerald-600 dark:text-emerald-400">{scenario.before.generatorUtilizationPct}%</span>
                <span className="text-center font-bold text-rose-600 dark:text-rose-400">{scenario.after.generatorUtilizationPct}%</span>
                <span className="text-right font-semibold text-rose-600 dark:text-rose-400">
                  +{scenario.after.generatorUtilizationPct - scenario.before.generatorUtilizationPct}% (High Stress)
                </span>
              </div>

              {/* Row 4: Fuel Endurance */}
              <div className="grid grid-cols-4 px-5 py-3.5 items-center border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Fuel Autonomy Buffer</span>
                <span className="text-center font-semibold text-slate-600 dark:text-slate-300">{scenario.before.fuelAutonomyDays} Days</span>
                <span className="text-center font-bold text-rose-600 dark:text-rose-400">{scenario.after.fuelAutonomyDays} Days</span>
                <span className="text-right font-semibold text-rose-600 dark:text-rose-400">
                  -{(scenario.before.fuelAutonomyDays - scenario.after.fuelAutonomyDays).toFixed(1)} Days
                </span>
              </div>

              {/* Row 5: Water Reserve */}
              <div className="grid grid-cols-4 px-5 py-3.5 items-center border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Water Reserve Buffer</span>
                <span className="text-center font-semibold text-sky-600 dark:text-sky-400">{scenario.before.waterReservePct}%</span>
                <span className="text-center font-semibold text-sky-600 dark:text-sky-400">{scenario.after.waterReservePct}%</span>
                <span className="text-right font-medium text-slate-400">Stable Buffer</span>
              </div>

              {/* Row 6: Overall Mission Risk */}
              <div className="grid grid-cols-4 px-5 py-3.5 items-center border-b border-slate-100 dark:border-slate-800/60 bg-rose-50/40 dark:bg-rose-950/20">
                <span className="font-bold text-slate-900 dark:text-white">Overall Mission Risk Score</span>
                <span className="text-center font-bold text-emerald-600 dark:text-emerald-400">{scenario.before.missionRiskScore}/100 [Nominal]</span>
                <span className="text-center font-bold text-rose-600 dark:text-rose-400">{scenario.after.missionRiskScore}/100 [Critical]</span>
                <span className="text-right font-bold text-rose-600 dark:text-rose-400">
                  +{scenario.after.missionRiskScore - scenario.before.missionRiskScore} Points Escalation
                </span>
              </div>

              {/* Row 7: Aggregate Readiness */}
              <div className="grid grid-cols-4 px-5 py-3.5 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Aggregate Readiness</span>
                <span className="text-center font-bold text-emerald-600 dark:text-emerald-400">{scenario.before.readinessScore}%</span>
                <span className="text-center font-bold text-amber-600 dark:text-amber-400">{scenario.after.readinessScore}%</span>
                <span className="text-right font-semibold text-amber-600 dark:text-amber-400">
                  {scenario.after.readinessScore - scenario.before.readinessScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Multi-Timeframe Projections */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Multi-Timeframe Cascading Forecast (Now → +7 Days)
            </span>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5">
              {scenario.timelineProjections.map((step) => (
                <div
                  key={step.timeframe}
                  className={`rounded-2xl p-3 border flex flex-col justify-between transition ${
                    step.criticalBreach
                      ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-slate-200/60 dark:border-slate-700/60 font-medium">
                    <span className="font-bold text-sky-600 dark:text-sky-400">{step.timeframe}</span>
                    <Clock className="w-3 h-3 text-slate-400" />
                  </div>

                  <div className="my-2 flex flex-col gap-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Health:</span>
                      <span className={`font-bold ${step.stationHealth < 50 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-200'}`}>
                        {step.stationHealth}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Load:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{step.powerLoadKW} kW</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Fuel:</span>
                      <span className={`font-semibold ${step.fuelDays < 20 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-200'}`}>
                        {step.fuelDays}d
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-400">Risk:</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">{step.riskScore}/100</span>
                    </div>
                  </div>

                  {step.criticalBreach && (
                    <div className="text-[10px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 p-1.5 rounded-lg leading-tight mt-1">
                      {step.criticalBreach}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">
            Digital Twin Cloning: Non-destructive forward projection verified
          </span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onClose();
                onOpenRecommendation();
              }}
              className="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-4 py-2 rounded-full text-xs transition"
            >
              Proceed to AI Recommendations
            </button>
            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold px-4 py-2 rounded-full text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
