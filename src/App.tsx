// DHRUVA-TWIN: India's Antarctic Mission Digital Twin
// Ministry of Earth Sciences (MoES) | National Centre for Polar and Ocean Research (NCPOR)
// SIH 2026 Problem Statement: SIH26060

import React, { useState, useEffect } from 'react';
import { simulationEngine } from './simulation/engine';
import {
  StationState,
  StationId,
  StationPod,
  WhatIfScenarioResult,
  MissionEvent
} from './types';
import { Header } from './components/Header';
import { LeftConsolePanel } from './components/LeftConsolePanel';
import { RightConsolePanel } from './components/RightConsolePanel';
import { ConsoleBottomBar } from './components/ConsoleBottomBar';
import { Station3DView } from './components/Station3DView';
import { MissionControlHome } from './components/MissionControlHome';
import { CascadingRiskModal } from './components/CascadingRiskModal';
import { PredictiveExplainabilityModal } from './components/PredictiveExplainabilityModal';
import { WhatIfComparisonModal } from './components/WhatIfComparisonModal';
import { AIRecommendationDrawer } from './components/AIRecommendationDrawer';
import { LogisticsPanel } from './components/LogisticsPanel';
import { MissionEventsDrawer } from './components/MissionEventsDrawer';
import { DataLineageModal } from './components/DataLineageModal';
import { DemoTourModal } from './components/DemoTourModal';
import { PodDetailModal } from './components/PodDetailModal';
import {
  Maximize2,
  Minimize2,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

export function App() {
  const [stationState, setStationState] = useState<StationState>(simulationEngine.getState());
  const [events, setEvents] = useState<MissionEvent[]>(simulationEngine.getEvents());
  const [activeView, setActiveView] = useState<'twin' | 'home'>('twin');
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  // Sync dark class on root document element
  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [isLightMode]);

  // Modal Dialog States
  const [isCascadingRiskOpen, setIsCascadingRiskOpen] = useState(false);
  const [isExplainabilityOpen, setIsExplainabilityOpen] = useState(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);
  const [isLogisticsOpen, setIsLogisticsOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isDataLineageOpen, setIsDataLineageOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [selectedPod, setSelectedPod] = useState<StationPod | null>(null);

  // Subscribe to simulation updates
  useEffect(() => {
    const unsubState = simulationEngine.onStateChange((newState) => {
      setStationState({ ...newState });
    });
    const unsubEvents = simulationEngine.onEventsChange((newEvents) => {
      setEvents([...newEvents]);
    });

    return () => {
      unsubState();
      unsubEvents();
    };
  }, []);

  const currentStation = stationState.stations[stationState.activeStation];
  const generator2 = currentStation.power.generators.find((g) => g.id === 'gen-02') || currentStation.power.generators[1];
  const isBlizzard = stationState.activeScenario?.scenarioId === 'blizzard' || currentStation.weather.windCategory === 'Blizzard' || currentStation.weather.windSpeed > 90;

  // Scenario Handlers
  const handleRunBlizzard = () => {
    simulationEngine.runScenario('blizzard');
    setIsWhatIfOpen(true);
  };

  const handleRunGeneratorFailure = () => {
    simulationEngine.runScenario('generator_failure');
    setIsWhatIfOpen(true);
  };

  const handleRunResupplyDelay = () => {
    simulationEngine.runScenario('resupply_delay');
    setIsWhatIfOpen(true);
  };

  const handleResetSimulation = () => {
    simulationEngine.reset();
  };

  const handleSwitchStation = (stationId: StationId) => {
    simulationEngine.switchStation(stationId);
  };

  const handleSimulateAction = () => {
    simulationEngine.simulateRecommendationAction();
  };

  const handleApproveResponse = () => {
    simulationEngine.approveRecommendation();
  };

  const handleDismissRecommendation = () => {
    simulationEngine.dismissRecommendation();
    setIsRecommendationOpen(false);
  };

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden select-none transition-colors duration-300 font-sans ${
      isLightMode ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100 dark'
    }`}>
      {/* Top Universal Command Header */}
      <Header
        currentStation={currentStation.config}
        activeView={activeView}
        onSwitchView={setActiveView}
        onSwitchStation={handleSwitchStation}
        onOpenDataLineage={() => setIsDataLineageOpen(true)}
        onOpenCascadingRisk={() => setIsCascadingRiskOpen(true)}
        onOpenLogistics={() => setIsLogisticsOpen(true)}
        onOpenTimeline={() => setIsTimelineOpen(true)}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
        onResetSimulation={handleResetSimulation}
        isBlizzard={isBlizzard}
        riskScore={currentStation.cascadingRisk.overallScore}
        isLightMode={isLightMode}
        onToggleTheme={() => setIsLightMode(!isLightMode)}
      />

      {/* Main Screen Content */}
      {activeView === 'home' ? (
        /* MISSION CONTROL OVERVIEW VIEW */
        <MissionControlHome
          bharatiStation={stationState.stations.bharati}
          maitriStation={stationState.stations.maitri}
          activeStationId={stationState.activeStation}
          onEnterStationTwin={(stnId) => {
            handleSwitchStation(stnId);
            setActiveView('twin');
          }}
          onOpenCascadingRisk={() => setIsCascadingRiskOpen(true)}
          onOpenDemoTour={() => setIsDemoTourOpen(true)}
          onOpenDataLineage={() => setIsDataLineageOpen(true)}
          events={events}
        />
      ) : (
        /* 3D DIGITAL TWIN & INTEGRATED CONSOLE VIEW */
        <div className="relative flex-1 w-full h-full overflow-hidden">
          {/* Central 3D Visualizer Canvas */}
          <div className="absolute inset-0 z-0">
            <Station3DView
              stationId={stationState.activeStation}
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
                setSelectedPod(pod);
              }}
            />
          </div>

          {/* 3D Stage Overlays & Hud Indicators */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
            <div className="inline-flex items-center gap-2.5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 px-4 py-1.5 rounded-full text-xs font-medium shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {currentStation.config.name} • 3D Digital Twin
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                134 Stilt-Elevated Modular Units
              </span>
            </div>

            {/* Emergency Crisis Banner if blizzard is running */}
            {isBlizzard && (
              <div className="mt-2 bg-rose-500/90 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 pointer-events-auto animate-pulse">
                <AlertTriangle className="w-4 h-4 text-amber-200" />
                <span>Category 4 Polar Blizzard Active (112 km/h • Wind chill -43°C)</span>
                <button
                  onClick={() => setIsCascadingRiskOpen(true)}
                  className="bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full ml-1 uppercase transition"
                >
                  Inspect Risk Chain
                </button>
              </div>
            )}
          </div>

          {/* Interactive 3D Controls hint badge (Bottom Center) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden md:block">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 px-4 py-1.5 rounded-full font-sans shadow-sm">
              Left-click to orbit • Scroll to zoom • Right-click to pan • Select any pod for diagnostics
            </div>
          </div>

          {/* Left Console Panel (1. LIVE POLAR WEATHER & 4. PREDICTIVE AI ENGINE) */}
          <div className="absolute top-3 left-3 bottom-3 z-20 pointer-events-auto overflow-y-auto max-h-[calc(100vh-100px)] pr-1 custom-scrollbar">
            <LeftConsolePanel
              weather={currentStation.weather}
              generator2={generator2}
              isBlizzard={isBlizzard}
              onOpenExplainability={() => setIsExplainabilityOpen(true)}
              onSelectGenerator={() => setIsExplainabilityOpen(true)}
            />
          </div>

          {/* Right Console Panel (3. LIFE SUPPORT HEALTH & 5. CRISIS SIMULATOR) */}
          <div className="absolute top-3 right-3 bottom-3 z-20 pointer-events-auto overflow-y-auto max-h-[calc(100vh-100px)] pl-1 custom-scrollbar">
            <RightConsolePanel
              lifeSupport={currentStation.lifeSupport}
              activeScenario={stationState.activeScenario}
              onRunBlizzard={handleRunBlizzard}
              onRunGeneratorFailure={handleRunGeneratorFailure}
              onRunResupplyDelay={handleRunResupplyDelay}
              onResetSimulation={handleResetSimulation}
              onOpenWhatIfModal={() => setIsWhatIfOpen(true)}
            />
          </div>
        </div>
      )}

      {/* Bottom Status Bar (MISSION DAY: 147 • CREW: 12 • LAT • LON • ELEVATION • UTC • UPTIME) */}
      <ConsoleBottomBar
        station={currentStation.config}
        pendingRecommendation={currentStation.pendingRecommendation}
        onOpenRecommendation={() => setIsRecommendationOpen(true)}
      />

      {/* MODAL DIALOGS & DRAWERS */}
      {/* 1. Cascading Risk Engine Modal */}
      <CascadingRiskModal
        isOpen={isCascadingRiskOpen}
        onClose={() => setIsCascadingRiskOpen(false)}
        cascadingRisk={currentStation.cascadingRisk}
        onOpenRecommendation={() => setIsRecommendationOpen(true)}
        hasPendingRecommendation={!!currentStation.pendingRecommendation}
      />

      {/* 2. Predictive Anomaly Explainability Modal ("Why is Gen-02 at risk?") */}
      <PredictiveExplainabilityModal
        isOpen={isExplainabilityOpen}
        onClose={() => setIsExplainabilityOpen(false)}
        generator={generator2}
        onSimulateIsolation={() => {
          simulationEngine.isolateGenerator('gen-02');
          setIsExplainabilityOpen(false);
        }}
      />

      {/* 3. What-If Scenario Comparison Modal (Before vs After) */}
      <WhatIfComparisonModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        scenario={stationState.activeScenario}
        onOpenRecommendation={() => setIsRecommendationOpen(true)}
      />

      {/* 4. AI Recommendation & Human-in-the-Loop Drawer */}
      <AIRecommendationDrawer
        isOpen={isRecommendationOpen}
        onClose={() => setIsRecommendationOpen(false)}
        recommendation={currentStation.pendingRecommendation}
        onSimulateAction={handleSimulateAction}
        onApproveResponse={handleApproveResponse}
        onDismiss={handleDismissRecommendation}
      />

      {/* 5. Logistics & Resupply Intelligence Panel */}
      <LogisticsPanel
        isOpen={isLogisticsOpen}
        onClose={() => setIsLogisticsOpen(false)}
        inventory={currentStation.logistics}
        onRunResupplyDelay={handleRunResupplyDelay}
      />

      {/* 6. Mission Events Timeline & Audit Drawer */}
      <MissionEventsDrawer
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        events={events}
      />

      {/* 7. Data Lineage & Scientific Trust Modal */}
      <DataLineageModal
        isOpen={isDataLineageOpen}
        onClose={() => setIsDataLineageOpen(false)}
      />

      {/* 8. 5-Minute SIH Mentor Guided Demo Walkthrough Tour */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onRunBlizzard={handleRunBlizzard}
        onOpenCascadingRisk={() => setIsCascadingRiskOpen(true)}
        onOpenRecommendation={() => setIsRecommendationOpen(true)}
        onApproveResponse={handleApproveResponse}
        onSwitchView={setActiveView}
        onResetSimulation={handleResetSimulation}
      />

      {/* 9. Pod & Module Subsystem Inspector Modal */}
      <PodDetailModal
        isOpen={!!selectedPod}
        onClose={() => setSelectedPod(null)}
        pod={selectedPod}
      />
    </div>
  );
}

export default App;
