// DHRUVA-TWIN Cascading Risk Engine Modal
// Minimal & Friendly Luxury Design: Visualizes causal propagation across Environment -> HVAC -> Power -> Fuel -> Mission Risk

import React, { useState } from 'react';
import { CascadingRiskState, CascadingRiskNode } from '../types';
import {
  Activity,
  ArrowRight,
  AlertTriangle,
  X,
  Sparkles,
  Layers,
  ChevronRight,
  Flame,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface CascadingRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  cascadingRisk: CascadingRiskState;
  onOpenRecommendation: () => void;
  hasPendingRecommendation: boolean;
}

export const CascadingRiskModal: React.FC<CascadingRiskModalProps> = ({
  isOpen,
  onClose,
  cascadingRisk,
  onOpenRecommendation,
  hasPendingRecommendation
}) => {
  if (!isOpen) return null;

  const [selectedNode, setSelectedNode] = useState<CascadingRiskNode | null>(
    cascadingRisk.causalChain[cascadingRisk.causalChain.length - 1] || null
  );

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800';
      case 'WATCH':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none transition-all">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Modal Top Header */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Cascading Risk Analysis Engine
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-physics thermodynamic & electrical dependency model
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-2 ${getRiskBadge(cascadingRisk.level)}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span>Overall Risk: {cascadingRisk.overallScore}/100 ({cascadingRisk.level})</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
          {/* Executive Summary Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Primary Risk Factor</span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {cascadingRisk.primaryRiskFactor}
              </p>
            </div>

            {hasPendingRecommendation && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRecommendation();
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold px-4 py-2 rounded-full text-xs flex items-center gap-2 shrink-0 shadow-sm transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Evaluate AI Recommendation</span>
              </button>
            )}
          </div>

          {/* Quantitative Cascading Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">HVAC Load Delta</span>
              <span className={`text-base font-bold ${cascadingRisk.impactSummary.hvacDeltaPct > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {cascadingRisk.impactSummary.hvacDeltaPct > 0 ? `+${cascadingRisk.impactSummary.hvacDeltaPct}%` : '0%'}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">Power Demand</span>
              <span className={`text-base font-bold ${cascadingRisk.impactSummary.powerDeltaKW > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {cascadingRisk.impactSummary.powerDeltaKW > 0 ? `+${cascadingRisk.impactSummary.powerDeltaKW} kW` : '0 kW'}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">Gen 2 Stress</span>
              <span className={`text-base font-bold ${cascadingRisk.impactSummary.generatorStressPct > 70 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {cascadingRisk.impactSummary.generatorStressPct}%
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">Fuel Burn Rate</span>
              <span className={`text-base font-bold ${cascadingRisk.impactSummary.fuelBurnDeltaPct > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {cascadingRisk.impactSummary.fuelBurnDeltaPct > 0 ? `+${cascadingRisk.impactSummary.fuelBurnDeltaPct}%` : '0%'}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">Autonomy Impact</span>
              <span className={`text-base font-bold ${cascadingRisk.impactSummary.autonomyLossDays > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {cascadingRisk.impactSummary.autonomyLossDays > 0 ? `-${cascadingRisk.impactSummary.autonomyLossDays}d` : 'Nominal'}
              </span>
            </div>
          </div>

          {/* CASCADING CAUSAL CHAIN VISUAL FLOW */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Propagation Sequence</span>
              <span className="text-slate-400 text-[11px]">Select any stage for detailed telemetry insight</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              {cascadingRisk.causalChain.map((node, index) => {
                const isSelected = selectedNode?.id === node.id;
                const isCritical = node.status === 'critical';
                const isWarning = node.status === 'warning';

                return (
                  <React.Fragment key={node.id}>
                    <div
                      onClick={() => setSelectedNode(node)}
                      className={`cursor-pointer rounded-2xl p-3 border transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 ring-2 ring-sky-500/20 shadow-sm'
                          : isCritical
                          ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 hover:border-rose-400'
                          : isWarning
                          ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 hover:border-amber-400'
                          : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>Stage 0{index + 1}</span>
                        <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-rose-500 animate-pulse' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      </div>

                      <div className="my-2">
                        <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">{node.subsystem}</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block leading-tight">{node.label}</span>
                      </div>

                      <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-1 text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                        {node.value}
                      </div>
                    </div>

                    {index < cascadingRisk.causalChain.length - 1 && (
                      <div className="hidden md:flex items-center justify-center text-slate-300 dark:text-slate-600 -mx-1">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Node Inspector Detailed View */}
          {selectedNode && (
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Selected Stage:</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedNode.label}</span>
                  <span className="text-xs text-slate-500">({selectedNode.subsystem})</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                  selectedNode.status === 'critical' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  Status: {selectedNode.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-medium block mb-1">Causal Impact Description</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    {selectedNode.description}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-medium block mb-1">Telemetry Observation</span>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Observed Value:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{selectedNode.value}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Relative Delta:</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">{selectedNode.impactDelta}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Layers className="w-4 h-4 text-sky-500" />
            <span>Deterministic physics model verified against Bharati telemetry logs</span>
          </div>

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
