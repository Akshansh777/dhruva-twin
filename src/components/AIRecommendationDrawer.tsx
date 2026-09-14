// DHRUVA-TWIN AI Recommendation Engine & Human-in-the-Loop Decision Support Drawer
// Minimal & Friendly Luxury Design: DETECT -> RECOMMEND -> SIMULATE -> HUMAN APPROVAL -> RE-EVALUATE

import React from 'react';
import { AIRecommendation } from '../types';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
  X,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Zap,
  Activity,
  UserCheck
} from 'lucide-react';

interface AIRecommendationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: AIRecommendation | null;
  onSimulateAction: () => void;
  onApproveResponse: () => void;
  onDismiss: () => void;
}

export const AIRecommendationDrawer: React.FC<AIRecommendationDrawerProps> = ({
  isOpen,
  onClose,
  recommendation,
  onSimulateAction,
  onApproveResponse,
  onDismiss
}) => {
  if (!isOpen || !recommendation) return null;

  const isSimulated = recommendation.status === 'simulated';
  const isApproved = recommendation.status === 'approved';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none transition-all">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        {/* Top Header */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Decision Support Engine
                </h2>
                <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                  Human-in-the-Loop
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Advisory recommendations require explicit human approval before execution
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
          {/* Human-in-the-loop Pipeline Ribbon */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs overflow-x-auto gap-3">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Detect</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">→</span>
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold shrink-0">
              <Sparkles className="w-4 h-4" />
              <span>2. Recommend</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">→</span>
            <div className={`flex items-center gap-1.5 font-semibold shrink-0 ${isSimulated || isApproved ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`}>
              <Play className="w-4 h-4" />
              <span>3. Simulate</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">→</span>
            <div className={`flex items-center gap-1.5 font-semibold shrink-0 ${isApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400 animate-pulse'}`}>
              <UserCheck className="w-4 h-4" />
              <span>4. Human Approval</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">→</span>
            <div className={`flex items-center gap-1.5 font-semibold shrink-0 ${isApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
              <ShieldCheck className="w-4 h-4" />
              <span>5. Re-evaluate</span>
            </div>
          </div>

          {/* Trigger & Recommendation Callout */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase block">
                Trigger: {recommendation.scenarioTrigger}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {recommendation.title}
              </h3>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 px-3.5 py-1.5 rounded-full text-center shrink-0">
              <span className={`text-xs font-semibold ${
                isApproved ? 'text-emerald-600 dark:text-emerald-400' : isSimulated ? 'text-sky-600 dark:text-sky-400' : 'text-amber-600 dark:text-amber-400'
              }`}>
                {isApproved ? '● Operator Approved' : isSimulated ? '● Simulation Projected' : '● Pending Review'}
              </span>
            </div>
          </div>

          {/* Expected Impact Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Risk Score Improvement */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Mission Risk Score</span>
                <TrendingDown className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="my-2.5 flex items-baseline gap-2">
                <span className="text-xl font-bold text-rose-500 line-through">
                  {recommendation.expectedImpact.riskScoreBefore}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {recommendation.expectedImpact.riskScoreAfter}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                -40 Points Risk Reduction (Watch level)
              </span>
            </div>

            {/* Fuel Endurance Improvement */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Fuel Autonomy Buffer</span>
                <TrendingDown className="w-4 h-4 text-sky-500" />
              </div>
              <div className="my-2.5 flex items-baseline gap-2">
                <span className="text-xl font-bold text-rose-500 line-through">
                  {recommendation.expectedImpact.fuelAutonomyBefore}d
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">
                  {recommendation.expectedImpact.fuelAutonomyAfter}d
                </span>
              </div>
              <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                +7.6 Days Safe Autonomy Preserved
              </span>
            </div>

            {/* Generator Stress Reduction */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Generator 2 Mechanical Load</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="my-2.5 flex items-baseline gap-2">
                <span className="text-xl font-bold text-rose-500 line-through">
                  {recommendation.expectedImpact.genStressBefore}%
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {recommendation.expectedImpact.genStressAfter}%
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Generator safely decoupled to standby
              </span>
            </div>
          </div>

          {/* Actionable Steps */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Recommended Multi-Pronged Response Protocol
            </span>

            <div className="flex flex-col gap-2">
              {recommendation.actions.map((act, idx) => (
                <div
                  key={act.id}
                  className={`border rounded-2xl p-4 flex items-start gap-3.5 transition ${
                    isApproved
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                      : isSimulated
                      ? 'bg-sky-50/60 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/60'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{act.label}</span>
                      <span className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                        isApproved ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {isApproved ? 'Executed in Twin' : 'Authorized Action'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHY (Rule-based Explainability Justifications) */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Causal Reasoning & Explainability Rationale
            </span>
            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 text-xs flex flex-col gap-1.5">
              {recommendation.justification.map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <UserCheck className="w-4 h-4 text-sky-500" />
            <span>Human-in-the-Loop safeguard: Automatic execution strictly disabled</span>
          </div>

          <div className="flex items-center gap-2.5">
            {!isApproved && (
              <>
                <button
                  onClick={onDismiss}
                  className="px-4 py-2 bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-xs font-semibold transition"
                >
                  Dismiss
                </button>

                <button
                  onClick={onSimulateAction}
                  className="px-4 py-2 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:bg-sky-100 rounded-full text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Preview Simulated Impact</span>
                </button>

                <button
                  onClick={() => {
                    onApproveResponse();
                    onClose();
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-full text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve Response Protocol</span>
                </button>
              </>
            )}

            {isApproved && (
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-full text-xs font-semibold transition"
              >
                Close (Protocol Active)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
