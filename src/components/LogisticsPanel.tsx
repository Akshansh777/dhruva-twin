// DHRUVA-TWIN Logistics & Resupply Intelligence Panel
// Minimal & Friendly Luxury Design: Monitors Fuel, Water, Food, Medical, and Spares + Resupply Delay Analysis

import React from 'react';
import { ResourceInventory, RiskLevel } from '../types';
import {
  Package,
  X,
  AlertTriangle,
  Droplet,
  Fuel,
  Utensils,
  Stethoscope,
  Wrench,
  Ship,
  TrendingDown,
  Calendar,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface LogisticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: ResourceInventory;
  onRunResupplyDelay: () => void;
}

export const LogisticsPanel: React.FC<LogisticsPanelProps> = ({
  isOpen,
  onClose,
  inventory,
  onRunResupplyDelay
}) => {
  if (!isOpen) return null;

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
      case 'HIGH':
        return 'text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800';
      case 'WATCH':
        return 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    }
  };

  const fuelDeficit = inventory.daysToNextResupply - inventory.fuelDaysAutonomy;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none transition-all">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Top Header */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Logistics & Resupply Intelligence
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bharati Station polar supply chain, resource reserves, and autonomy buffer
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
          {/* Resupply Ship Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Ship className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-wider block">
                  Chartered Polar Expedition Vessel
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  MV Vasiliy Golovnin (Resupply Cruise #45)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Expected Arrival: <strong className="text-slate-900 dark:text-white font-semibold">{inventory.daysToNextResupply} Days</strong> in Prydz Bay (Larsemann Hills anchorage).
                </p>
              </div>
            </div>

            <button
              onClick={onRunResupplyDelay}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm transition shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Simulate +10-Day Ship Delay</span>
            </button>
          </div>

          {/* Critical Deficit Alert */}
          {fuelDeficit > 0 && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-4 flex items-center justify-between gap-3 text-rose-800 dark:text-rose-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <span className="font-bold text-xs block">
                    Critical Logistics Margin Deficit Detected
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    Station fuel autonomy ({inventory.fuelDaysAutonomy.toFixed(1)} days) will deplete before the scheduled resupply ship arrives. Conservation measures required.
                  </span>
                </div>
              </div>
              <span className="bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-200 px-3 py-1 rounded-full text-[11px] font-bold shrink-0">
                Deficit: -{fuelDeficit.toFixed(1)}d
              </span>
            </div>
          )}

          {/* Resources Grid */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Active Resource Reserves & Autonomy
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* 1. Fuel */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-amber-500" />
                    Diesel / Jet A-1 Fuel
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getRiskBadge(inventory.resupplyRisk)}`}>
                    {inventory.resupplyRisk}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Stock:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{inventory.fuelLiters.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Capacity:</span>
                    <span className="text-slate-700 dark:text-slate-300">{inventory.fuelCapacityLiters.toLocaleString()} L (73.5%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Burn Rate:</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">48.5 L/hr</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 font-medium">Autonomy Margin:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{inventory.fuelDaysAutonomy.toFixed(1)} Days</span>
                  </div>
                </div>
              </div>

              {/* 2. Water */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-sky-500" />
                    Potable & Melt Water
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Nominal
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Stock:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{inventory.waterLiters.toLocaleString()} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Capacity:</span>
                    <span className="text-slate-700 dark:text-slate-300">{inventory.waterCapacityLiters.toLocaleString()} L (85.3%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Daily Demand:</span>
                    <span className="font-semibold text-sky-600 dark:text-sky-400">45 L / person / day</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 font-medium">Autonomy Margin:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{inventory.waterDaysAutonomy} Days</span>
                  </div>
                </div>
              </div>

              {/* 3. Food */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-500" />
                    Provisions & Rations
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Secure
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Stock:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{inventory.foodKg.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Safety Buffer:</span>
                    <span className="text-slate-700 dark:text-slate-300">120 Days Required</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Crew Size:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">12 Personnel</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 font-medium">Autonomy Margin:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{inventory.foodDaysAutonomy} Days</span>
                  </div>
                </div>
              </div>

              {/* 4. Medical Supplies */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-rose-500" />
                    Medical Station
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Nominal
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Trauma Kits:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{inventory.medicalKits} Standard Units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">O2 Cylinders:</span>
                    <span className="text-slate-700 dark:text-slate-300">8 High-Pressure Bottles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Physician:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">1 Medical Officer Onsite</span>
                  </div>
                </div>
              </div>

              {/* 5. Generator Spares */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-500" />
                    Generator Spares & Bearings
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300">
                    Limited
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Certified Bearings:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{inventory.generatorSparesCount} Kits in Cold Store</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fuel Injectors:</span>
                    <span className="text-slate-700 dark:text-slate-300">6 Sets Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lubricant Drums:</span>
                    <span className="text-slate-700 dark:text-slate-300">14 Drums (ISO VG 68)</span>
                  </div>
                </div>
              </div>

              {/* 6. Pump Spares */}
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-sky-500" />
                    Water Pumps & HVAC
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Healthy
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Circulation Pumps:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{inventory.pumpSparesCount} Ready Replacements</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Heating Elements:</span>
                    <span className="text-slate-700 dark:text-slate-300">4 Spare Heaters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Heat Tracing:</span>
                    <span className="text-slate-700 dark:text-slate-300">120m Insulated Cable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">
            NCPOR Polar Logistics Dashboard: Synchronized telemetry
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
