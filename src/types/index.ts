// DHRUVA-TWIN System Types
// MoES - NCPOR Antarctic Mission Digital Twin Architecture

export type StationId = 'bharati' | 'maitri';

export type SubsystemStatus = 'nominal' | 'warning' | 'critical' | 'offline';

export type RiskLevel = 'LOW' | 'WATCH' | 'HIGH' | 'CRITICAL';

export interface WeatherData {
  ambientTemp: number; // in Celsius (-55 to -10)
  windSpeed: number;   // in km/h (0 to 160)
  windCategory: 'Calm' | 'Moderate' | 'Gale' | 'Storm' | 'Blizzard';
  sunlight: number;    // W/m2 (0 Polar Night to 450)
  season: 'Polar Eve' | 'Polar Day' | 'Polar Night' | 'Polar Dawn';
  pressureKPa: number; // 96 - 103 kPa
  visibilityKm: number;// 0.1 to 50 km
  tempTrend24h: { time: string; temp: number }[];
}

export interface GeneratorState {
  id: string;
  name: string;
  status: SubsystemStatus;
  loadKW: number;
  capacityKW: number;
  rpm: number;
  bearingTempC: number;
  vibrationMmS: number;
  efficiencyPct: number;
  operatingHours: number;
  failureProbabilityPct: number;
  estimatedFailureDays: number;
  isIsolated: boolean;
  anomalyDetected: boolean;
  anomalyDetails?: {
    component: string;
    description: string;
    vibrationDelta: number;
    tempDelta: number;
    recommendedAction: string;
  };
}

export interface PowerSystemState {
  totalDemandKW: number;
  totalGenerationKW: number;
  baseLoadKW: number;
  hvacLoadKW: number;
  labLoadKW: number;
  lifeSupportLoadKW: number;
  generators: GeneratorState[];
  generatorUtilizationPct: number;
  fuelBurnRateLPerHour: number;
  renewableSolarKW: number;
  renewableWindKW: number;
}

export interface LifeSupportState {
  habitatHeatC: number;
  o2LevelPct: number;
  waterReservePct: number;
  cabinPressureKPa: number;
  status: SubsystemStatus;
  historyHeat: number[];
  historyO2: number[];
  historyWater: number[];
  historyPressure: number[];
}

export interface ResourceInventory {
  fuelLiters: number;
  fuelCapacityLiters: number;
  fuelDaysAutonomy: number;
  waterLiters: number;
  waterCapacityLiters: number;
  waterDaysAutonomy: number;
  foodKg: number;
  foodDaysAutonomy: number;
  medicalKits: number;
  generatorSparesCount: number;
  pumpSparesCount: number;
  daysToNextResupply: number;
  resupplyRisk: RiskLevel;
}

export interface CascadingRiskNode {
  id: string;
  label: string;
  subsystem: string;
  status: SubsystemStatus;
  impactDelta: string;
  description: string;
  value: string;
}

export interface CascadingRiskState {
  overallScore: number; // 0 - 100
  level: RiskLevel;
  primaryRiskFactor: string;
  causalChain: CascadingRiskNode[];
  impactSummary: {
    hvacDeltaPct: number;
    powerDeltaKW: number;
    generatorStressPct: number;
    fuelBurnDeltaPct: number;
    autonomyLossDays: number;
  };
}

export interface WhatIfScenarioResult {
  scenarioId: 'blizzard' | 'generator_failure' | 'resupply_delay' | 'water_pump_failure' | 'comm_loss';
  name: string;
  description: string;
  isActive: boolean;
  before: {
    stationHealth: number;
    powerLoadKW: number;
    generatorUtilizationPct: number;
    fuelAutonomyDays: number;
    waterReservePct: number;
    missionRiskScore: number;
    readinessScore: number;
  };
  after: {
    stationHealth: number;
    powerLoadKW: number;
    generatorUtilizationPct: number;
    fuelAutonomyDays: number;
    waterReservePct: number;
    missionRiskScore: number;
    readinessScore: number;
  };
  timelineProjections: {
    timeframe: string; // 'NOW', '+6H', '+12H', '+24H', '+3D', '+7D'
    stationHealth: number;
    powerLoadKW: number;
    fuelDays: number;
    riskScore: number;
    status: SubsystemStatus;
    criticalBreach?: string;
  }[];
  firstCriticalMetric: string;
}

export interface StationPod {
  id: string;
  name: string;
  type: string;
  status: SubsystemStatus;
  tempC: number;
  powerDrawKW: number;
  hvacAirflowM3H: number;
  structuralStrainUe: number;
  description: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  scenarioTrigger: string;
  severity: RiskLevel;
  actions: {
    id: string;
    label: string;
    description: string;
    applied: boolean;
  }[];
  justification: string[];
  expectedImpact: {
    riskScoreBefore: number;
    riskScoreAfter: number;
    fuelAutonomyBefore: number;
    fuelAutonomyAfter: number;
    genStressBefore: number;
    genStressAfter: number;
  };
  status: 'pending' | 'simulated' | 'approved' | 'dismissed';
}

export interface MissionEvent {
  id: string;
  timestamp: string;
  utcTime: string;
  category?: 'ANOMALY' | 'SIMULATION' | 'RECOMMENDATION' | 'OPERATOR' | 'SYSTEM';
  type?: 'anomaly' | 'simulation' | 'recommendation' | 'human_approval' | 'operational_action' | 'system' | string;
  level: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  description: string;
  telemetryDelta?: string;
  subsystem?: string;
  operator?: string;
  outcome?: string;
}

export interface StationConfig {
  id: StationId;
  name: string;
  code: string;
  lat: string;
  lon: string;
  elevationM: number;
  commissionedYear: number;
  crewCount: number;
  missionDay: number;
  description: string;
  systemUptime: string;
  satellitePassIn: string;
  primaryEnergySource: string;
  structureSpecs: {
    mainHabitation: string;
    podsCount: number;
    isolatedUnits: number;
  };
}

export interface StationOperationalState {
  config: StationConfig;
  weather: WeatherData;
  power: PowerSystemState;
  lifeSupport: LifeSupportState;
  logistics: ResourceInventory;
  cascadingRisk: CascadingRiskState;
  activeScenario: WhatIfScenarioResult | null;
  pendingRecommendation: AIRecommendation | null;
  stationHealthPct: number;
  pods: StationPod[];
  missionReadiness: {
    environment: { score: number; status: SubsystemStatus; trend: 'up' | 'down' | 'stable' };
    energy: { score: number; status: SubsystemStatus; trend: 'up' | 'down' | 'stable' };
    infrastructure: { score: number; status: SubsystemStatus; trend: 'up' | 'down' | 'stable' };
    lifeSupport: { score: number; status: SubsystemStatus; trend: 'up' | 'down' | 'stable' };
    logistics: { score: number; status: SubsystemStatus; trend: 'up' | 'down' | 'stable' };
    communication: { score: number; status: SubsystemStatus; trend: 'up' | 'down' | 'stable' };
  };
  telemetryMode: 'SYNTHETIC_SIMULATION';
  selectedPodId: string | null;
}

export interface MultiStationState {
  activeStation: StationId;
  stations: {
    bharati: StationOperationalState;
    maitri: StationOperationalState;
  };
  activeScenario: WhatIfScenarioResult | null;
}

export type StationState = MultiStationState;
