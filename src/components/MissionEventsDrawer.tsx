// DHRUVA-TWIN Mission Events Timeline & Audit Trail
// Minimal & Friendly Luxury Design: Stores all mission events, actions, simulations, and human approvals

import React from 'react';
import { MissionEvent } from '../types';
import {
  Clock,
  X,
  AlertTriangle,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Activity,
  Layers,
  ShieldAlert,
  Zap
} from 'lucide-react';

interface MissionEventsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  events: MissionEvent[];
}

export const MissionEventsDrawer: React.FC<MissionEventsDrawerProps> = ({
  isOpen,
  onClose,
  events
}) => {
  if (!isOpen) return null;

  const getEventBadge = (type: MissionEvent['type']) => {
    switch (type) {
      case 'anomaly':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />,
          color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
        };
      case 'simulation':
        return {
          icon: <Zap className="w-3.5 h-3.5 text-sky-500" />,
          color: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
        };
      case 'recommendation':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
          color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
        };
      case 'human_approval':
        return {
          icon: <UserCheck className="w-3.5 h-3.5 text-emerald-500" />,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
        };
      case 'operational_action':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />,
          color: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800'
        };
      default:
        return {
          icon: <Activity className="w-3.5 h-3.5 text-slate-500" />,
          color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none transition-all">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Top Header */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Mission Event Timeline & Audit Log
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                NCPOR verified chronological mission sequence and human-in-the-loop decisions
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

        {/* Modal Body: Timeline List */}
        <div className="p-6 flex flex-col gap-3 overflow-y-auto max-h-[75vh]">
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {events.map((evt) => {
              const badge = getEventBadge(evt.type);

              return (
                <div key={evt.id} className="relative group">
                  {/* Timeline Bullet */}
                  <div className="absolute -left-6 top-2 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-sky-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  </div>

                  {/* Event Card */}
                  <div className="bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 transition flex flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sky-600 dark:text-sky-400 font-bold text-xs font-mono">{evt.timestamp}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${badge.color}`}>
                          {badge.icon}
                          <span className="capitalize">{evt.type.replace('_', ' ')}</span>
                        </span>
                        <span className="text-slate-400 text-xs font-medium">({evt.subsystem})</span>
                      </div>

                      {evt.operator && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-800 font-medium">
                          Operator: {evt.operator}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                      {evt.description}
                    </p>

                    {evt.outcome && (
                      <div className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                        <span>Outcome: {evt.outcome}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">
            Total events recorded: {events.length} • Compliance: ISO/IEC 27001
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
