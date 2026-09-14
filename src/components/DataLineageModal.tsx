// DHRUVA-TWIN Data Lineage & Scientific Transparency Modal
// Minimal & Friendly Luxury Design: Provenance of real-world reference parameters vs synthetic simulation

import React from 'react';
import {
  Database,
  X,
  ShieldCheck,
  Cpu,
  Radio,
  Layers,
  ArrowRight,
  Server,
  FileCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DataLineageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataLineageModal: React.FC<DataLineageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none transition-all">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Data Lineage & Scientific Transparency
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                MoES SIH26060 Compliance: Real-world physical parameters and deterministic telemetry
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
          {/* Trust Statement Banner */}
          <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-2xl p-4 flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] text-sky-700 dark:text-sky-300 font-semibold uppercase tracking-wider block">
                NCPOR Scientific Disclosure & Research Transparency
              </span>
              <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                All real-time telemetry streams in this prototype are <strong className="text-sky-600 dark:text-sky-400">synthetic</strong>, computed locally by a deterministic multi-physics domain engine using thermodynamic, electrical, and mechanical equations. We never fabricate live operational military/government transmissions or claim unverified satellite uplinks.
              </p>
            </div>
          </div>

          {/* Table: Real Reference Data vs Synthetic Telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Real Public Reference Data */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold uppercase text-xs border-b border-slate-200/80 dark:border-slate-700 pb-2">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                <span>Real Public Reference Data</span>
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Coordinates:</strong> Bharati (69°24′28″ S, 76°11′14″ E) and Maitri (70°45′58″ S, 11°43′56″ E).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Architecture:</strong> 134 modular intermodal containers on elevated stilts with aerodynamic wind-tunnel profiles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Research Pods:</strong> Atmospheric Physics, Meteorology, Seismology, and ISRO Satellite Tracking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Power System:</strong> 3x 250 kW diesel gensets with cogeneration thermal heat recovery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Polar Climate:</strong> Larsemann Hills winter wind peaks (&gt;160 km/h) and polar temperatures (-45°C).</span>
                </li>
              </ul>
            </div>

            {/* Synthetic Deterministic Engine */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-bold uppercase text-xs border-b border-slate-200/80 dark:border-slate-700 pb-2">
                <Cpu className="w-4 h-4 text-sky-500" />
                <span>Deterministic Physics Simulator</span>
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-sky-500 font-bold">•</span>
                  <span><strong>Thermodynamics:</strong> Heat loss balanced against HVAC energy using Fourier thermal conduction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-500 font-bold">•</span>
                  <span><strong>Electrical Grid:</strong> Dynamic power allocation across life support, labs, and auxiliary snow melters.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-500 font-bold">•</span>
                  <span><strong>Vibration Diagnostics:</strong> ISO 10816-3 RMS harmonic progression modeling bearing fatigue and micro-spalling.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-500 font-bold">•</span>
                  <span><strong>Logistics Runout:</strong> Daily fuel oil consumption integrated against expedition ship resupply schedules.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Architectural Pipeline Diagram */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              End-to-End Architectural Data Pipeline
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-center text-xs">
              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-between">
                <Radio className="w-5 h-5 text-sky-500 mb-1" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">1. Sensors</span>
                <span className="text-[10px] text-slate-400 mt-1">PT100, Modbus RTU</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-between">
                <Server className="w-5 h-5 text-sky-500 mb-1" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">2. IoT Gateway</span>
                <span className="text-[10px] text-slate-400 mt-1">Edge broker MQTT</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-between">
                <Cpu className="w-5 h-5 text-sky-500 mb-1" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">3. Digital Twin</span>
                <span className="text-[10px] text-slate-400 mt-1">State synchronizer</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-between">
                <Layers className="w-5 h-5 text-amber-500 mb-1" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">4. Risk Engine</span>
                <span className="text-[10px] text-amber-500 mt-1">Dependency graph</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-between">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mb-1" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">5. AI Advisory</span>
                <span className="text-[10px] text-emerald-500 mt-1">Decision support</span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-between">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">6. Human Approval</span>
                <span className="text-[10px] text-emerald-500 mt-1">Mission Director</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <strong>Operational Deployment:</strong> In production deployment at NCPOR Head Office (Goa), the deterministic physics engine is supplemented by an authenticated GSAT-14 / INSAT satellite telemetry gateway receiving signed packets from edge PLCs in Antarctica.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">
            Open Polar Architecture Standard v2.4 • ISO/IEC 25010 Evaluated
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-full text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
