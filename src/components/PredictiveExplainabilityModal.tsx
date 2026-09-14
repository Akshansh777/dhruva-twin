// DHRUVA-TWIN Predictive Anomaly Explainability Modal
// Minimal & Friendly Luxury Design: Answers "Why is Generator 2 at risk?" with telemetry sensor breakdown and degradation curves

import React from 'react';
import { GeneratorState } from '../types';
import {
  HelpCircle,
  AlertTriangle,
  X,
  TrendingUp,
  Cpu,
  Activity,
  CheckCircle2,
  Gauge,
  Thermometer,
  Clock,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface PredictiveExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  generator: GeneratorState;
  onSimulateIsolation: () => void;
}

export const PredictiveExplainabilityModal: React.FC<PredictiveExplainabilityModalProps> = ({
  isOpen,
  onClose,
  generator,
  onSimulateIsolation
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none transition-all">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Top Header */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Predictive Diagnostic Explainability
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Equipment Root Cause Analysis: Generator 2 Drive-End Bearing
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

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
          {/* Main Question & Alert Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold uppercase block">
                  Root Cause Diagnosis
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Why is Generator 2 at critical risk of failure?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  High failure probability (82%) driven by micro-crack spalling detected on the drive shaft roller element raceway.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 px-4 py-2 rounded-2xl text-center shrink-0">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">Failure Horizon</span>
              <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400">
                ~{generator.estimatedFailureDays.toFixed(1)} Days
              </span>
            </div>
          </div>

          {/* Structured Factors Breakdown */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Observable Sensor Contributing Factors
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Factor 1: Vibration */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500" />
                    1. Harmonic Vibration Trend
                  </span>
                  <span className="text-rose-700 dark:text-rose-300 font-semibold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full text-[10px] border border-rose-200 dark:border-rose-800">
                    Critical (+166%)
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Drive shaft accelerometer reports <strong className="text-rose-600 dark:text-rose-400">{generator.vibrationMmS} mm/s RMS</strong> vibration (ISO 10816-3 alert threshold is 2.8 mm/s). FFT reveals a 120 Hz peak harmonic.
                </p>
              </div>

              {/* Factor 2: Bearing Temp */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-rose-500" />
                    2. Bearing Temperature Trend
                  </span>
                  <span className="text-rose-700 dark:text-rose-300 font-semibold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full text-[10px] border border-rose-200 dark:border-rose-800">
                    84.5°C (+19.5°C)
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Thermocouple probe T-42 records elevated temperature of <strong className="text-rose-600 dark:text-rose-400">{generator.bearingTempC}°C</strong> against 65.0°C baseline. Lubricant viscosity breakdown from friction heat.
                </p>
              </div>

              {/* Factor 3: Operating Hours */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    3. Accumulated Operating Hours
                  </span>
                  <span className="text-amber-700 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full text-[10px] border border-amber-200 dark:border-amber-800">
                    4,210 Hours
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Unit has logged <strong className="text-amber-600 dark:text-amber-400">4,210 continuous hours</strong> since depot overhaul in Goa. Bearing rated fatigue MTBF is 4,500 hours under Antarctic winter loading.
                </p>
              </div>

              {/* Factor 4: Efficiency Drop */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    4. Mechanical Efficiency Decline
                  </span>
                  <span className="text-amber-700 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full text-[10px] border border-amber-200 dark:border-amber-800">
                    86.1% (-8.1%)
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Specific fuel consumption increased by 0.04 L/kWh due to parasitic friction drag in the drive assembly, indicating physical mechanical resistance.
                </p>
              </div>
            </div>
          </div>

          {/* Mathematical Degradation Calculation */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Weibull Failure Rate Calculation Model
            </span>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs">
              <code className="text-sky-600 dark:text-sky-400 font-mono block">
                P_fail(t) = 1 - exp(-(t / η)^β) · [ 1 + α · (v_vib / v_limit)^2 + γ · (T_bearing / T_limit) ]
              </code>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1.5">
                Characteristic life η = 4,500 hrs, shape parameter β = 3.2, vibration penalty α = 1.45, and thermal penalty γ = 1.22.
              </p>
            </div>
          </div>

          {/* Action Recommendation */}
          <div className="bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-sky-700 dark:text-sky-400 font-semibold uppercase">Prescribed Response</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Isolate Generator 2 & balance load across Generator 1 / Standby
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Prevents catastrophic roller bearing seizure and protects station grid integrity.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onSimulateIsolation();
              }}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs rounded-full shadow-sm shadow-sky-500/20 transition flex items-center gap-2 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Isolate in Simulator</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">
            NCPOR Rule PRD-GEN-02 • Deterministic sensor verification
          </span>
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
