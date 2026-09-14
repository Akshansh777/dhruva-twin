// DHRUVA-TWIN Guided Mentor Demo Tour Modal
// Minimal & Friendly Luxury Design: 7-step guided walkthrough for evaluators and jury members

import React, { useState, useEffect } from 'react';
import {
  PlayCircle,
  Pause,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Zap,
  Activity,
  Sparkles,
  Compass,
  Layers,
  RotateCcw
} from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunBlizzard: () => void;
  onOpenCascadingRisk: () => void;
  onOpenRecommendation: () => void;
  onApproveResponse: () => void;
  onSwitchView: (view: 'twin' | 'home') => void;
  onResetSimulation: () => void;
}

interface TourStep {
  title: string;
  badge: string;
  description: string;
  actionText: string;
  onExecute: () => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onRunBlizzard,
  onOpenCascadingRisk,
  onOpenRecommendation,
  onApproveResponse,
  onSwitchView,
  onResetSimulation
}) => {
  if (!isOpen) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps: TourStep[] = [
    {
      title: 'Step 1: Mission Control Overview',
      badge: 'Station Monitoring',
      description:
        'Start at the national mission control dashboard. View India’s two operational polar bases: Bharati (Larsemann Hills) and Maitri (Schirmacher Oasis). Check aggregate mission readiness across energy, logistics, life support, and communications.',
      actionText: 'View Mission Overview',
      onExecute: () => {
        onSwitchView('home');
      }
    },
    {
      title: 'Step 2: Inspect Bharati Digital Twin',
      badge: '3D Virtual Twin',
      description:
        'Switch to the 3D Digital Twin of Bharati Station. Interact with the 3D aerodynamic habitat pod structure, inspect live polar weather (-43.2°C, 112 km/h winds), and observe the life support metrics (heat, O2, water, cabin pressure).',
      actionText: 'Open 3D Twin Console',
      onExecute: () => {
        onSwitchView('twin');
      }
    },
    {
      title: 'Step 3: Trigger Extreme Blizzard Crisis',
      badge: 'Stress Simulation',
      description:
        'Click "Simulate Blizzard" in the Crisis Simulator. This initiates an Antarctic Category 4 Blizzard with -43.2°C ambient chill and 112 km/h katabatic gale winds, spiking habitat convective heat loss.',
      actionText: 'Trigger Blizzard Scenario',
      onExecute: () => {
        onSwitchView('twin');
        onRunBlizzard();
      }
    },
    {
      title: 'Step 4: Observe Cascading Risk Propagation',
      badge: 'Core Innovation',
      description:
        'Open the Cascading Risk Engine. Watch the causal chain ripple through: Blizzard → HVAC Surge (+36.5%) → Power Demand (+31 kW) → Generator 02 Stress (92%) → Fuel Burn Surge (+37.7%) → Fuel Margin Deficit (-9.6d) → Mission Risk Critical (84/100).',
      actionText: 'Inspect Cascading Chain',
      onExecute: () => {
        onOpenCascadingRisk();
      }
    },
    {
      title: 'Step 5: View AI Predictive Anomaly & Recommendation',
      badge: 'Decision Support',
      description:
        'Examine the Predictive AI alert: Generator 2 bearing harmonic vibration (4.8 mm/s) indicates catastrophic fatigue failure in 3.2 days under blizzard load. The AI recommends load shedding and isolation.',
      actionText: 'Evaluate AI Recommendation',
      onExecute: () => {
        onOpenRecommendation();
      }
    },
    {
      title: 'Step 6: Execute Human-in-the-Loop Action',
      badge: 'Governance Protocol',
      description:
        'No AI acts autonomously. The human operator reviews the expected impact (Risk: 84 → 44, Fuel endurance: 18.2d → 25.8d) and authorizes the simulated response.',
      actionText: 'Approve & Execute Action',
      onExecute: () => {
        onApproveResponse();
      }
    },
    {
      title: 'Step 7: Re-evaluate Station Health & Mission Readiness',
      badge: 'Closed Loop Recovery',
      description:
        'Observe the closed loop: Generator 02 is isolated, secondary diesel generators pick up essential loads, non-critical heaters are shed, and overall station health recovers from critical to nominal.',
      actionText: 'Review Closed Loop State',
      onExecute: () => {
        onSwitchView('twin');
      }
    }
  ];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            steps[prev + 1].onExecute();
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps]);

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      steps[nextIdx].onExecute();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      steps[prevIdx].onExecute();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none transition-all">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center justify-center">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                SIH 2026 Interactive Tour
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                End-to-End Mission Scenario: Observation → Crisis → Causal Risk → AI Action → Closed-Loop Recovery
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
        <div className="p-6 flex flex-col gap-5">
          {/* Progress Indicators */}
          <div className="flex items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  step.onExecute();
                }}
                className={`flex-1 h-2 rounded-full transition ${
                  idx === currentStepIndex
                    ? 'bg-sky-500 ring-2 ring-sky-300 dark:ring-sky-700'
                    : idx < currentStepIndex
                    ? 'bg-sky-300 dark:bg-sky-800'
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
                title={step.title}
              />
            ))}
          </div>

          {/* Current Step Card */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 px-3 py-0.5 rounded-full">
                {currentStep.badge}
              </span>
              <span className="text-slate-400 text-xs font-medium">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {currentStep.title}
            </h3>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800">
              {currentStep.description}
            </p>

            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => currentStep.onExecute()}
                className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{currentStep.actionText}</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                  isPlaying
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                    : 'bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Auto-Tour' : 'Auto-Play Tour'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => {
              onResetSimulation();
              setCurrentStepIndex(0);
              steps[0].onExecute();
            }}
            className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition text-xs font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-4 py-2 bg-slate-200/80 disabled:opacity-40 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentStepIndex < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-full text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-full text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Complete Tour</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
