// DHRUVA-TWIN Deterministic Simulation & Cascading Risk Engine
// Models Antarctic Station physics, thermodynamics, generator degradation, and mission risk

import {
  StationConfig,
  StationOperationalState,
  WeatherData,
  PowerSystemState,
  LifeSupportState,
  ResourceInventory,
  CascadingRiskState,
  WhatIfScenarioResult,
  AIRecommendation,
  MissionEvent,
  StationId,
  MultiStationState,
  StationPod
} from '../types';

export const BHARATI_CONFIG: StationConfig = {
  id: 'bharati',
  name: 'Bharati Antarctic Research Station',
  code: 'IND-ANT-02',
  lat: '71.6822° S',
  lon: '68.1234° E',
  elevationM: 2345,
  commissionedYear: 2012,
  crewCount: 12,
  missionDay: 147,
  description: 'India\'s third generation modern Antarctic research facility in Larsemann Hills',
  systemUptime: '120d 14h 23m',
  satellitePassIn: '02:14 UTC',
  primaryEnergySource: 'Multi-fuel Cogeneration & Wind Array',
  structureSpecs: {
    mainHabitation: 'Two-tier Aerodynamic Pod with Stilt Suspension',
    podsCount: 5,
    isolatedUnits: 3
  }
};

export const MAITRI_CONFIG: StationConfig = {
  id: 'maitri',
  name: 'Maitri Antarctic Research Station',
  code: 'IND-ANT-01',
  lat: '70.7667° S',
  lon: '11.7333° E',
  elevationM: 117,
  commissionedYear: 1989,
  crewCount: 22,
  missionDay: 147,
  description: 'India\'s historic second permanent station located in Schirmacher Oasis',
  systemUptime: '89d 08h 12m',
  satellitePassIn: '01:45 UTC',
  primaryEnergySource: 'Diesel Microgrid & Solar Hybrid',
  structureSpecs: {
    mainHabitation: 'Modular Steel Truss Base',
    podsCount: 4,
    isolatedUnits: 2
  }
};

export class AntarcticSimulationEngine {
  private bharatiState: StationOperationalState;
  private maitriState: StationOperationalState;
  private activeStation: StationId = 'bharati';
  public activeScenario: WhatIfScenarioResult | null = null;
  private tickCount: number = 0;
  private historyTemp: { time: string; temp: number }[] = [];
  private eventListeners: ((events: MissionEvent[]) => void)[] = [];
  private stateListeners: ((state: MultiStationState) => void)[] = [];
  public events: MissionEvent[] = [];

  constructor(stationId: StationId = 'bharati') {
    this.bharatiState = this.createInitialState(BHARATI_CONFIG);
    this.maitriState = this.createInitialState(MAITRI_CONFIG);
    this.activeStation = stationId;
    this.initTimelineEvents();
  }

  public get state(): StationOperationalState {
    return this.activeStation === 'bharati' ? this.bharatiState : this.maitriState;
  }

  public set state(s: StationOperationalState) {
    if (this.activeStation === 'bharati') {
      this.bharatiState = s;
    } else {
      this.maitriState = s;
    }
  }

  private initTimelineEvents() {
    this.events = [
      {
        id: 'evt-01',
        timestamp: '07:45 UTC',
        utcTime: '07:45',
        category: 'SYSTEM',
        level: 'info',
        title: 'Morning Diagnostics Cycle Completed',
        description: 'Atmospheric and telemetry synchronization validated with GSAT ground station.'
      },
      {
        id: 'evt-02',
        timestamp: '08:02 UTC',
        utcTime: '08:02',
        category: 'ANOMALY',
        level: 'warning',
        title: 'Generator 02 Bearing Vibration Alert',
        description: 'Vibration reached 4.8 mm/s on secondary drive shaft. Baseline is 1.8 mm/s.',
        telemetryDelta: 'Vib: +166% | Temp: +19.5°C'
      },
      {
        id: 'evt-03',
        timestamp: '08:07 UTC',
        utcTime: '08:07',
        category: 'ANOMALY',
        level: 'warning',
        title: 'Failure Probability Threshold Crossed',
        description: 'Predictive health model estimated failure probability at 82% within 9.4 days.',
        telemetryDelta: 'MTBF: 225 hrs'
      },
      {
        id: 'evt-04',
        timestamp: '08:15 UTC',
        utcTime: '08:15',
        category: 'SYSTEM',
        level: 'info',
        title: 'Cascading Risk Engine Initialized',
        description: 'Observing thermal, electrical, and fuel reserves causal matrix.'
      }
    ];
  }

  private createInitialState(config: StationConfig): StationOperationalState {
    const isBharati = config.id === 'bharati';

    const weather: WeatherData = {
      ambientTemp: isBharati ? -22.4 : -18.2,
      windSpeed: isBharati ? 34 : 28,
      windCategory: 'Moderate',
      sunlight: 0,
      season: 'Polar Eve',
      pressureKPa: 99.8,
      visibilityKm: 32,
      tempTrend24h: [
        { time: '10:00', temp: -20.5 },
        { time: '13:00', temp: -21.2 },
        { time: '16:00', temp: -21.8 },
        { time: '19:00', temp: -22.4 },
        { time: '22:00', temp: -23.1 },
        { time: '01:00', temp: -24.0 },
        { time: '04:00', temp: -23.6 },
        { time: '07:00', temp: -22.9 },
        { time: '10:00', temp: -22.4 }
      ]
    };

    const generators = [
      {
        id: 'gen-01',
        name: 'Generator #1 (Primary Cogen)',
        status: 'nominal' as const,
        loadKW: 130,
        capacityKW: 180,
        rpm: 1500,
        bearingTempC: 56.2,
        vibrationMmS: 1.4,
        efficiencyPct: 94.2,
        operatingHours: 2840,
        failureProbabilityPct: 6.2,
        estimatedFailureDays: 140,
        isIsolated: false,
        anomalyDetected: false
      },
      {
        id: 'gen-02',
        name: 'Generator #2 (Auxiliary Cogen)',
        status: 'warning' as const,
        loadKW: 115,
        capacityKW: 180,
        rpm: 1496,
        bearingTempC: 84.5, // High! Baseline is 65
        vibrationMmS: 4.8,  // High! Baseline is 2.0
        efficiencyPct: 86.1,
        operatingHours: 4210,
        failureProbabilityPct: 82.0,
        estimatedFailureDays: 9.4,
        isIsolated: false,
        anomalyDetected: true,
        anomalyDetails: {
          component: 'Drive-end roller bearing #B-42',
          description: 'High-frequency harmonic vibration with localized friction heating',
          vibrationDelta: +2.8,
          tempDelta: +19.5,
          recommendedAction: 'Isolate Gen-02 & switch load to Gen-01 / activate Gen-03 standby'
        }
      },
      {
        id: 'gen-03',
        name: 'Generator #3 (Emergency Standby)',
        status: 'nominal' as const,
        loadKW: 0,
        capacityKW: 180,
        rpm: 0,
        bearingTempC: 18.0,
        vibrationMmS: 0.0,
        efficiencyPct: 95.0,
        operatingHours: 640,
        failureProbabilityPct: 2.1,
        estimatedFailureDays: 320,
        isIsolated: false,
        anomalyDetected: false
      }
    ];

    const power: PowerSystemState = {
      totalDemandKW: 245,
      totalGenerationKW: 245,
      baseLoadKW: 110,
      hvacLoadKW: 85,
      labLoadKW: 35,
      lifeSupportLoadKW: 15,
      generators,
      generatorUtilizationPct: 68.0, // (245 / 360 available)
      fuelBurnRateLPerHour: 48.5,
      renewableSolarKW: 0,
      renewableWindKW: 12
    };

    const lifeSupport: LifeSupportState = {
      habitatHeatC: 21.2,
      o2LevelPct: 20.9,
      waterReservePct: 92.4,
      cabinPressureKPa: 101.3,
      status: 'nominal',
      historyHeat: [21.0, 21.1, 21.3, 21.2, 21.2, 21.4, 21.2],
      historyO2: [20.9, 20.9, 20.8, 20.9, 21.0, 20.9, 20.9],
      historyWater: [94, 93.5, 93.1, 92.8, 92.6, 92.5, 92.4],
      historyPressure: [101.2, 101.3, 101.3, 101.4, 101.3, 101.3, 101.3]
    };

    const logistics: ResourceInventory = {
      fuelLiters: 47820,
      fuelCapacityLiters: 65000,
      fuelDaysAutonomy: 27.8, // 47820 / (48.5 * 24) = 41 days nominal, reduced for winter safety margin
      waterLiters: 38400,
      waterCapacityLiters: 45000,
      waterDaysAutonomy: 35.5,
      foodKg: 5200,
      foodDaysAutonomy: 78.0,
      medicalKits: 48,
      generatorSparesCount: 2,
      pumpSparesCount: 3,
      daysToNextResupply: 34,
      resupplyRisk: 'HIGH'
    };

    const cascadingRisk: CascadingRiskState = {
      overallScore: 32, // Baseline Watch due to Gen-02
      level: 'WATCH',
      primaryRiskFactor: 'Gen #2 bearing degradation elevates contingency vulnerability',
      causalChain: [
        {
          id: 'c-01',
          label: 'Weather',
          subsystem: 'Environment',
          status: 'nominal',
          impactDelta: 'Nominal',
          description: 'Clear polar evening conditions with moderate winds',
          value: '-22.4°C / 34 km/h'
        },
        {
          id: 'c-02',
          label: 'Thermal Demand',
          subsystem: 'HVAC',
          status: 'nominal',
          impactDelta: 'Baseline',
          description: 'Standard insulation envelope heating requirement',
          value: '85 kW'
        },
        {
          id: 'c-03',
          label: 'Power Demand',
          subsystem: 'Microgrid',
          status: 'nominal',
          impactDelta: 'Normal',
          description: 'Aggregate base load plus active scientific modules',
          value: '245 kW'
        },
        {
          id: 'c-04',
          label: 'Gen Utilization',
          subsystem: 'Power Generation',
          status: 'warning',
          impactDelta: 'Elevated (Gen 2 Anomaly)',
          description: 'Gen 02 carries 115 kW with high bearing vibration',
          value: '68% (Gen-02 at Risk)'
        },
        {
          id: 'c-05',
          label: 'Fuel Burn Rate',
          subsystem: 'Energy Logistics',
          status: 'nominal',
          impactDelta: 'Standard',
          description: 'Cogen efficiency at 89.2% aggregate',
          value: '48.5 L/hr'
        },
        {
          id: 'c-06',
          label: 'Fuel Reserve Margin',
          subsystem: 'Logistics',
          status: 'warning',
          impactDelta: '-6.2d deficit',
          description: '27.8 days autonomy vs 34 days to next ship resupply',
          value: '27.8 Days'
        },
        {
          id: 'c-07',
          label: 'Mission Risk',
          subsystem: 'Station Readiness',
          status: 'warning',
          impactDelta: 'Score 32/100',
          description: 'System watch: Single generator contingency breach',
          value: 'WATCH (32/100)'
        }
      ],
      impactSummary: {
        hvacDeltaPct: 0,
        powerDeltaKW: 0,
        generatorStressPct: 18,
        fuelBurnDeltaPct: 0,
        autonomyLossDays: 0
      }
    };

    const defaultPods: StationPod[] = isBharati ? [
      { id: 'pod-hab', name: 'Habitation & Crew Quarters', type: 'Residential', status: 'nominal', tempC: 21.2, powerDrawKW: 38, hvacAirflowM3H: 1200, structuralStrainUe: 142, description: 'Double-tier ISO container core housing 12 wintering researchers with noise baffling.' },
      { id: 'pod-lab', name: 'Earth Science Laboratories', type: 'Scientific', status: 'nominal', tempC: 20.4, powerDrawKW: 44, hvacAirflowM3H: 950, structuralStrainUe: 110, description: 'Atmospheric sampling, seismology, magnetometry, and polar meteorology analytical instrumentation.' },
      { id: 'pod-pwr', name: 'Cogeneration Power Complex', type: 'Engineering', status: 'warning', tempC: 24.8, powerDrawKW: 112, hvacAirflowM3H: 2400, structuralStrainUe: 210, description: '3x Volvo Penta/Kirloskar 250 kW diesel gensets with jacket thermal cogeneration loops.' },
      { id: 'pod-lif', name: 'Life Support & Water Recycling', type: 'Utility', status: 'nominal', tempC: 21.0, powerDrawKW: 28, hvacAirflowM3H: 800, structuralStrainUe: 95, description: 'Potable snow-melting unit, greywater bio-membrane filters, and oxygen enrichment manifold.' },
      { id: 'pod-com', name: 'ISRO Tracking & Polar Satcom Dome', type: 'Communication', status: 'nominal', tempC: 19.8, powerDrawKW: 23, hvacAirflowM3H: 600, structuralStrainUe: 88, description: 'Radome enclosed tracking terminal interfacing GSAT-14 / Inmarsat telemetry link.' }
    ] : [
      { id: 'pod-m1', name: 'Maitri Main Block', type: 'Residential', status: 'nominal', tempC: 20.8, powerDrawKW: 42, hvacAirflowM3H: 1100, structuralStrainUe: 120, description: 'Historic steel structure housing 22 expedition members.' },
      { id: 'pod-m2', name: 'Lake Priyadarshini Pump House', type: 'Utility', status: 'nominal', tempC: 18.5, powerDrawKW: 30, hvacAirflowM3H: 500, structuralStrainUe: 90, description: 'Submerged heated trace piping drawing fresh glacier water.' }
    ];

    return {
      config,
      weather,
      power,
      lifeSupport,
      logistics,
      cascadingRisk,
      activeScenario: null,
      pendingRecommendation: null,
      stationHealthPct: 88,
      pods: defaultPods,
      missionReadiness: {
        environment: { score: 92, status: 'nominal', trend: 'stable' },
        energy: { score: 74, status: 'warning', trend: 'down' },
        infrastructure: { score: 86, status: 'nominal', trend: 'stable' },
        lifeSupport: { score: 96, status: 'nominal', trend: 'stable' },
        logistics: { score: 71, status: 'warning', trend: 'down' },
        communication: { score: 95, status: 'nominal', trend: 'stable' }
      },
      telemetryMode: 'SYNTHETIC_SIMULATION',
      selectedPodId: 'power'
    };
  }

  public getState(): MultiStationState {
    return {
      activeStation: this.activeStation,
      stations: {
        bharati: this.bharatiState,
        maitri: this.maitriState
      },
      activeScenario: this.activeScenario
    };
  }

  public switchStation(stationId: StationId) {
    this.activeStation = stationId;
    const config = stationId === 'bharati' ? BHARATI_CONFIG : MAITRI_CONFIG;
    this.addEvent({
      category: 'SYSTEM',
      level: 'info',
      title: `Switched Command Console to ${config.name}`,
      description: `Active telemetry linked to ${config.code}. Synchronizing synthetic twin parameters.`
    });
    this.notifyState();
  }

  public selectPod(podId: string | null) {
    this.state.selectedPodId = podId;
    this.notifyState();
  }

  // Live tick: updates micro-oscillations to simulate physical sensors
  public tick() {
    this.tickCount++;
    const noise = Math.sin(this.tickCount * 0.2) * 0.4;
    const isBlizzard = this.state.activeScenario?.scenarioId === 'blizzard';

    // Temperature subtle drift
    const baseTemp = isBlizzard ? -43.2 : -22.4;
    this.state.weather.ambientTemp = parseFloat((baseTemp + noise * 0.5).toFixed(1));

    // Power demand subtle oscillation
    const basePower = isBlizzard ? 276 : 245;
    this.state.power.totalDemandKW = Math.round(basePower + noise * 2);

    // Life support slight oscillations
    this.state.lifeSupport.habitatHeatC = parseFloat((21.0 + Math.sin(this.tickCount * 0.1) * 0.3).toFixed(1));
    this.state.lifeSupport.cabinPressureKPa = parseFloat((101.3 + Math.cos(this.tickCount * 0.15) * 0.1).toFixed(1));

    // Generator 2 vibration oscillation
    const gen2 = this.state.power.generators.find(g => g.id === 'gen-02');
    if (gen2 && !gen2.isIsolated) {
      gen2.vibrationMmS = parseFloat((4.8 + Math.sin(this.tickCount * 0.3) * 0.25).toFixed(2));
      gen2.bearingTempC = parseFloat((84.5 + Math.cos(this.tickCount * 0.2) * 0.6).toFixed(1));
    }

    this.notifyState();
  }

  // What-If Crisis Scenario Engine
  public runScenario(scenarioType: 'blizzard' | 'generator_failure' | 'resupply_delay' | 'water_pump_failure' | 'comm_loss') {
    const current = this.state;
    const isBharati = current.config.id === 'bharati';

    if (scenarioType === 'blizzard') {
      // 1. Blizzard physics
      // Temp drops from -22.4C to -43.2C
      // Wind increases from 34 to 118 km/h
      // Visibility drops to 0.2 km
      // HVAC load surges from 85 kW to 116 kW (+36.5%)
      // Power demand surges from 245 kW to 276 kW
      // Fuel burn surges from 48.5 to 66.8 L/hr (+37.7%)
      // Fuel autonomy collapses to 18.2 days
      // Mission risk spikes to 84 (CRITICAL)

      const weatherUpdated: WeatherData = {
        ...current.weather,
        ambientTemp: -43.2,
        windSpeed: 118,
        windCategory: 'Blizzard',
        visibilityKm: 0.2,
        pressureKPa: 97.4,
        season: 'Polar Eve',
        sunlight: 0,
        tempTrend24h: [
          { time: '10:00', temp: -22.4 },
          { time: '13:00', temp: -25.8 },
          { time: '16:00', temp: -31.2 },
          { time: '19:00', temp: -38.4 },
          { time: '22:00', temp: -41.5 },
          { time: '01:00', temp: -43.0 },
          { time: '04:00', temp: -43.8 },
          { time: '07:00', temp: -43.2 },
          { time: '10:00', temp: -43.2 }
        ]
      };

      const gen1 = current.power.generators[0];
      const gen2 = current.power.generators[1];
      const gen3 = current.power.generators[2];

      const newGen1 = { ...gen1, loadKW: 145, status: 'warning' as const };
      const newGen2 = {
        ...gen2,
        loadKW: 131,
        status: 'critical' as const,
        bearingTempC: 92.4,
        vibrationMmS: 5.6,
        failureProbabilityPct: 91.5,
        estimatedFailureDays: 3.2
      };

      const updatedPower: PowerSystemState = {
        ...current.power,
        totalDemandKW: 276,
        totalGenerationKW: 276,
        hvacLoadKW: 116,
        generatorUtilizationPct: 92.0,
        fuelBurnRateLPerHour: 66.8,
        renewableWindKW: 0, // Wind turbine shut down for blade storm protection
        generators: [newGen1, newGen2, gen3]
      };

      const updatedLogistics: ResourceInventory = {
        ...current.logistics,
        fuelDaysAutonomy: 18.2, // Drastic reduction from 27.8
        resupplyRisk: 'CRITICAL'
      };

      const updatedRisk: CascadingRiskState = {
        overallScore: 84,
        level: 'CRITICAL',
        primaryRiskFactor: 'Compound crisis: Extreme blizzard thermal surge overloads degrading Generator 02',
        causalChain: [
          {
            id: 'c-01',
            label: 'Severe Blizzard',
            subsystem: 'Environment',
            status: 'critical',
            impactDelta: '-20.8°C / +84 km/h wind',
            description: 'Extreme polar storm winds accelerating exterior thermal convective losses',
            value: '-43.2°C / 118 km/h'
          },
          {
            id: 'c-02',
            label: 'HVAC Heating Load Surge',
            subsystem: 'Thermal Enclosure',
            status: 'critical',
            impactDelta: '+36.5% (+31 kW)',
            description: 'Habitat temperature stabilization requires maximal perimeter heat tracing',
            value: '116 kW'
          },
          {
            id: 'c-03',
            label: 'Microgrid Power Demand',
            subsystem: 'Electrical Grid',
            status: 'critical',
            impactDelta: '+31 kW (+12.7%)',
            description: 'Station power requirement surges to near-capacity envelope',
            value: '276 kW'
          },
          {
            id: 'c-04',
            label: 'Generator Load & Stress',
            subsystem: 'Power Generation',
            status: 'critical',
            impactDelta: '92% Utilization',
            description: 'Degraded Gen-02 driven to 131 kW; bearing temp reaches 92.4°C',
            value: 'Gen-02 Stress: 91.5% Risk'
          },
          {
            id: 'c-05',
            label: 'Fuel Burn Rate Surge',
            subsystem: 'Combustion Cogen',
            status: 'critical',
            impactDelta: '+37.7% (+18.3 L/hr)',
            description: 'Heavy diesel consumption accelerated across dual running generators',
            value: '66.8 L/hr'
          },
          {
            id: 'c-06',
            label: 'Resupply Logistics Deficit',
            subsystem: 'Logistics',
            status: 'critical',
            impactDelta: '-9.6 Days Autonomy',
            description: 'Fuel endurance drops to 18.2 days with resupply ship 34 days away',
            value: '18.2 Days (15.8d Deficit)'
          },
          {
            id: 'c-07',
            label: 'Mission Risk Escalation',
            subsystem: 'Station Command',
            status: 'critical',
            impactDelta: 'Score: 84/100',
            description: 'High likelihood of total power loss if Gen-02 suffers catastrophic seizure',
            value: 'CRITICAL (84/100)'
          }
        ],
        impactSummary: {
          hvacDeltaPct: 36.5,
          powerDeltaKW: 31,
          generatorStressPct: 92,
          fuelBurnDeltaPct: 37.7,
          autonomyLossDays: 9.6
        }
      };

      const scenarioResult: WhatIfScenarioResult = {
        scenarioId: 'blizzard',
        name: 'Catastrophic Polar Blizzard (118 km/h)',
        description: 'Simulates severe polar convective freezing conditions, elevated HVAC power surge, and thermal grid stress.',
        isActive: true,
        before: {
          stationHealth: 88,
          powerLoadKW: 245,
          generatorUtilizationPct: 68,
          fuelAutonomyDays: 27.8,
          waterReservePct: 92.4,
          missionRiskScore: 32,
          readinessScore: 86
        },
        after: {
          stationHealth: 54,
          powerLoadKW: 276,
          generatorUtilizationPct: 92,
          fuelAutonomyDays: 18.2,
          waterReservePct: 91.8,
          missionRiskScore: 84,
          readinessScore: 48
        },
        timelineProjections: [
          { timeframe: 'NOW', stationHealth: 54, powerLoadKW: 276, fuelDays: 18.2, riskScore: 84, status: 'critical' },
          { timeframe: '+6H', stationHealth: 50, powerLoadKW: 280, fuelDays: 17.8, riskScore: 87, status: 'critical' },
          { timeframe: '+12H', stationHealth: 46, powerLoadKW: 282, fuelDays: 17.2, riskScore: 89, status: 'critical', criticalBreach: 'Gen-02 bearing thermal trip window' },
          { timeframe: '+24H', stationHealth: 42, powerLoadKW: 278, fuelDays: 16.5, riskScore: 92, status: 'critical', criticalBreach: 'Gen-02 catastrophic seizure' },
          { timeframe: '+3D', stationHealth: 36, powerLoadKW: 270, fuelDays: 14.8, riskScore: 95, status: 'critical', criticalBreach: 'Severe fuel reserve depletion' },
          { timeframe: '+7D', stationHealth: 28, powerLoadKW: 265, fuelDays: 11.2, riskScore: 98, status: 'critical', criticalBreach: 'Total logistics isolation threshold' }
        ],
        firstCriticalMetric: 'Gen-02 Bearing Thermal Trip (+12 Hours)'
      };

      const recommendation: AIRecommendation = {
        id: 'rec-blizzard-01',
        title: 'Emergency Thermal Shedding & Generator Safeguard Protocol',
        scenarioTrigger: 'Blizzard Induced Thermal Surge + Gen-02 Vulnerability',
        severity: 'CRITICAL',
        actions: [
          {
            id: 'act-01',
            label: 'Isolate Degraded Generator #2',
            description: 'Gracefully shift active electrical load from Gen-02 to Gen-01 and spool up Gen-03 cold standby to eliminate catastrophic failure hazard.',
            applied: false
          },
          {
            id: 'act-02',
            label: 'Shed Non-Critical Scientific & Lab Loads',
            description: 'De-energize auxiliary magnetometry lab, ice-core freezers standby cogen, and uninhabited corridor heating (-18 kW).',
            applied: false
          },
          {
            id: 'act-03',
            label: 'Activate Intelligent Microgrid Cogen Mode',
            description: 'Divert engine exhaust jacket water thermal recapture to primary habitat heating loop, cutting electric boiler demand by 22 kW.',
            applied: false
          },
          {
            id: 'act-04',
            label: 'Ration Daily Fuel Consumption Limit',
            description: 'Enforce conservative 52 L/hr fuel burn cap, restoring safe endurance beyond the 34-day resupply rendezvous margin.',
            applied: false
          }
        ],
        justification: [
          'Gen-02 bearing vibration (5.6 mm/s) will exceed trip limits within 12 hours under 131 kW load.',
          'Thermal recapture reduces electric heating requirement by 22 kW without lowering living quarters temperature.',
          'Load shedding lowers aggregate fuel burn from 66.8 L/hr to 51.2 L/hr, expanding fuel autonomy from 18.2 to 25.8 days.'
        ],
        expectedImpact: {
          riskScoreBefore: 84,
          riskScoreAfter: 44,
          fuelAutonomyBefore: 18.2,
          fuelAutonomyAfter: 25.8,
          genStressBefore: 92,
          genStressAfter: 54
        },
        status: 'pending'
      };

      this.state = {
        ...this.state,
        weather: weatherUpdated,
        power: updatedPower,
        logistics: updatedLogistics,
        cascadingRisk: updatedRisk,
        activeScenario: scenarioResult,
        pendingRecommendation: recommendation,
        stationHealthPct: 54,
        missionReadiness: {
          environment: { score: 28, status: 'critical', trend: 'down' },
          energy: { score: 42, status: 'critical', trend: 'down' },
          infrastructure: { score: 68, status: 'warning', trend: 'down' },
          lifeSupport: { score: 79, status: 'warning', trend: 'down' },
          logistics: { score: 48, status: 'critical', trend: 'down' },
          communication: { score: 62, status: 'warning', trend: 'down' }
        }
      };

      this.addEvent({
        category: 'SIMULATION',
        level: 'critical',
        title: 'Blizzard What-If Simulation Activated',
        description: 'Atmospheric conditions degraded: 118 km/h blizzard with -43.2°C ambient chill. Power demand climbed to 276 kW.',
        telemetryDelta: 'Temp: -20.8°C | Wind: +84 km/h | Load: +31 kW | Risk: 84'
      });

      this.addEvent({
        category: 'RECOMMENDATION',
        level: 'warning',
        title: 'Decision Support Engine Generated Response',
        description: 'Protocol formulated: Isolate Gen-02, spool Gen-03 standby, and shed 18 kW auxiliary lab circuits.',
        telemetryDelta: 'Projected Risk: 84 → 44'
      });
    } else if (scenarioType === 'generator_failure') {
      // Direct Generator 02 Seizure
      const gen1 = { ...current.power.generators[0], loadKW: 165, status: 'warning' as const };
      const gen2 = {
        ...current.power.generators[1],
        loadKW: 0,
        status: 'critical' as const,
        isIsolated: true,
        rpm: 0,
        bearingTempC: 104.2,
        failureProbabilityPct: 100,
        estimatedFailureDays: 0
      };
      const gen3 = { ...current.power.generators[2], loadKW: 80, status: 'nominal' as const, rpm: 1500 };

      const updatedPower: PowerSystemState = {
        ...current.power,
        totalDemandKW: 245,
        totalGenerationKW: 245,
        generatorUtilizationPct: 88.0,
        generators: [gen1, gen2, gen3]
      };

      const scenarioResult: WhatIfScenarioResult = {
        scenarioId: 'generator_failure',
        name: 'Generator #2 Catastrophic Mechanical Seizure',
        description: 'Simulates instantaneous roller bearing freeze on Gen-02, automatic breaker trip, and emergency Gen-03 ramp-up.',
        isActive: true,
        before: {
          stationHealth: 88,
          powerLoadKW: 245,
          generatorUtilizationPct: 68,
          fuelAutonomyDays: 27.8,
          waterReservePct: 92.4,
          missionRiskScore: 32,
          readinessScore: 86
        },
        after: {
          stationHealth: 62,
          powerLoadKW: 245,
          generatorUtilizationPct: 88,
          fuelAutonomyDays: 26.5,
          waterReservePct: 92.4,
          missionRiskScore: 72,
          readinessScore: 61
        },
        timelineProjections: [
          { timeframe: 'NOW', stationHealth: 62, powerLoadKW: 245, fuelDays: 26.5, riskScore: 72, status: 'critical', criticalBreach: 'N-1 redundancy lost' },
          { timeframe: '+6H', stationHealth: 62, powerLoadKW: 245, fuelDays: 26.2, riskScore: 74, status: 'critical' },
          { timeframe: '+12H', stationHealth: 60, powerLoadKW: 245, fuelDays: 25.8, riskScore: 75, status: 'critical' },
          { timeframe: '+24H', stationHealth: 58, powerLoadKW: 245, fuelDays: 25.0, riskScore: 78, status: 'critical', criticalBreach: 'Secondary bearing wear on Gen 1' },
          { timeframe: '+3D', stationHealth: 55, powerLoadKW: 245, fuelDays: 23.5, riskScore: 82, status: 'critical' },
          { timeframe: '+7D', stationHealth: 50, powerLoadKW: 245, fuelDays: 20.2, riskScore: 85, status: 'critical' }
        ],
        firstCriticalMetric: 'Station Microgrid Redundancy Depleted (Immediate)'
      };

      const recommendation: AIRecommendation = {
        id: 'rec-genfail-01',
        title: 'Emergency Generator Redundancy Rebalancing',
        scenarioTrigger: 'Gen-02 Mechanical Seizure Trip',
        severity: 'HIGH',
        actions: [
          {
            id: 'act-01',
            label: 'Confirm Electrical Isolation of Gen-02',
            description: 'Lockout-tagout Gen-02 output bus and dispatch crew for visual damage assessment.',
            applied: false
          },
          {
            id: 'act-02',
            label: 'Operate Gen-01 and Gen-03 in Synchronous Load Share',
            description: 'Balance 122.5 kW across both active units to minimize thermal stress on remaining units.',
            applied: false
          },
          {
            id: 'act-03',
            label: 'Prepare Spare Bearing Kit B-42 for Field Overhaul',
            description: 'Allocate remaining certified spare bearing inventory from cold logistics storage.',
            applied: false
          }
        ],
        justification: [
          'Station operates with zero redundant backup generator remaining.',
          'Equal load sharing extends mean operating life before next planned maintenance window.'
        ],
        expectedImpact: {
          riskScoreBefore: 72,
          riskScoreAfter: 48,
          fuelAutonomyBefore: 26.5,
          fuelAutonomyAfter: 26.5,
          genStressBefore: 88,
          genStressAfter: 62
        },
        status: 'pending'
      };

      this.state = {
        ...this.state,
        power: updatedPower,
        activeScenario: scenarioResult,
        pendingRecommendation: recommendation,
        stationHealthPct: 62,
        cascadingRisk: {
          ...this.state.cascadingRisk,
          overallScore: 72,
          level: 'HIGH',
          primaryRiskFactor: 'Zero remaining generator redundancy; Gen-02 tripped offline'
        }
      };

      this.addEvent({
        category: 'SIMULATION',
        level: 'critical',
        title: 'Generator 02 Hard Failure Simulated',
        description: 'Gen-02 tripped offline due to bearing lock. Gen-03 successfully auto-started.',
        telemetryDelta: 'Gen-02: 0 kW | Gen-03: 80 kW | Risk: 72'
      });
    } else if (scenarioType === 'resupply_delay') {
      // Resupply delayed by 10 days
      const updatedLogistics: ResourceInventory = {
        ...current.logistics,
        daysToNextResupply: 44, // 34 + 10
        resupplyRisk: 'CRITICAL'
      };

      const scenarioResult: WhatIfScenarioResult = {
        scenarioId: 'resupply_delay',
        name: 'Ship Resupply Delayed 10 Days (Sea Ice Blockade)',
        description: 'Simulates heavy pack-ice obstacle delaying Antarctic chartered supply vessel by 10 days (Rendezvous moves to +44 days).',
        isActive: true,
        before: {
          stationHealth: 88,
          powerLoadKW: 245,
          generatorUtilizationPct: 68,
          fuelAutonomyDays: 27.8,
          waterReservePct: 92.4,
          missionRiskScore: 32,
          readinessScore: 86
        },
        after: {
          stationHealth: 74,
          powerLoadKW: 245,
          generatorUtilizationPct: 68,
          fuelAutonomyDays: 27.8,
          waterReservePct: 92.4,
          missionRiskScore: 68,
          readinessScore: 64
        },
        timelineProjections: [
          { timeframe: 'NOW', stationHealth: 74, powerLoadKW: 245, fuelDays: 27.8, riskScore: 68, status: 'warning' },
          { timeframe: '+6H', stationHealth: 74, powerLoadKW: 245, fuelDays: 27.6, riskScore: 68, status: 'warning' },
          { timeframe: '+12H', stationHealth: 73, powerLoadKW: 245, fuelDays: 27.4, riskScore: 69, status: 'warning' },
          { timeframe: '+24H', stationHealth: 72, powerLoadKW: 245, fuelDays: 26.8, riskScore: 71, status: 'warning' },
          { timeframe: '+3D', stationHealth: 70, powerLoadKW: 245, fuelDays: 25.1, riskScore: 74, status: 'warning' },
          { timeframe: '+7D', stationHealth: 66, powerLoadKW: 245, fuelDays: 22.8, riskScore: 82, status: 'critical', criticalBreach: 'Fuel safety buffer breached' }
        ],
        firstCriticalMetric: 'Fuel Endurance Exhaustion vs Resupply Arrival (+27.8 Days)'
      };

      const recommendation: AIRecommendation = {
        id: 'rec-resupply-01',
        title: 'Emergency Fuel & Resource Rationing Directive',
        scenarioTrigger: '10-Day Resupply Delay (Pritchett Inlet Sea Ice)',
        severity: 'HIGH',
        actions: [
          {
            id: 'act-01',
            label: 'Activate Eco-Thermal Habitat Setback (-1.5°C)',
            description: 'Reduce non-living module heating from 21°C to 18°C, extending fuel burn by 12%.',
            applied: false
          },
          {
            id: 'act-02',
            label: 'Greywater Recycling Loop Maximization',
            description: 'Increase secondary filtration output to conserve thermal melting energy.',
            applied: false
          },
          {
            id: 'act-03',
            label: 'Emergency Air-Drop Logistics Contingency',
            description: 'Request MoES / Indian Air Force C-17 polar air-drop protocol for critical spares.',
            applied: false
          }
        ],
        justification: [
          'Without fuel rationing, available reserves (27.8 days) expire 16.2 days prior to ship mooring.'
        ],
        expectedImpact: {
          riskScoreBefore: 68,
          riskScoreAfter: 38,
          fuelAutonomyBefore: 27.8,
          fuelAutonomyAfter: 46.5,
          genStressBefore: 68,
          genStressAfter: 55
        },
        status: 'pending'
      };

      this.state = {
        ...this.state,
        logistics: updatedLogistics,
        activeScenario: scenarioResult,
        pendingRecommendation: recommendation,
        stationHealthPct: 74,
        cascadingRisk: {
          ...this.state.cascadingRisk,
          overallScore: 68,
          level: 'HIGH',
          primaryRiskFactor: 'Logistics deficit: Resupply date (44d) exceeds station fuel autonomy (27.8d)'
        }
      };

      this.addEvent({
        category: 'SIMULATION',
        level: 'warning',
        title: 'Resupply Delay Scenario Activated',
        description: 'Vessel transit window extended by 10 days. Autonomy deficit triggers rationing protocol.',
        telemetryDelta: 'Resupply: 44 Days | Fuel Margin: -16.2 Days'
      });
    }

    this.notifyState();
  }

  // Operator Human-in-the-Loop Simulation & Approval Flow
  public simulateRecommendation() {
    if (!this.state.pendingRecommendation) return;
    this.state.pendingRecommendation.status = 'simulated';
    this.addEvent({
      category: 'OPERATOR',
      level: 'info',
      title: 'Simulated Action Projected',
      description: 'Operator reviewed predictive impact before committing changes to virtual twin.',
      telemetryDelta: `Projected Risk: ${this.state.pendingRecommendation.expectedImpact.riskScoreBefore} → ${this.state.pendingRecommendation.expectedImpact.riskScoreAfter}`
    });
    this.notifyState();
  }

  public approveRecommendation() {
    if (!this.state.pendingRecommendation) return;
    const rec = this.state.pendingRecommendation;
    rec.status = 'approved';
    rec.actions.forEach(a => a.applied = true);

    // Apply recovery physics
    // 1. Isolate Gen-02
    const gen1 = { ...this.state.power.generators[0], loadKW: 140, status: 'nominal' as const };
    const gen2 = {
      ...this.state.power.generators[1],
      loadKW: 0,
      status: 'offline' as const,
      isIsolated: true,
      rpm: 0,
      vibrationMmS: 0.1,
      bearingTempC: 32.0,
      anomalyDetected: false
    };
    const gen3 = { ...this.state.power.generators[2], loadKW: 100, status: 'nominal' as const, rpm: 1500 };

    // 2. Reduce auxiliary loads
    const updatedPower: PowerSystemState = {
      ...this.state.power,
      totalDemandKW: 240,
      totalGenerationKW: 240,
      hvacLoadKW: 94,
      labLoadKW: 18, // Shed
      generatorUtilizationPct: 66.0,
      fuelBurnRateLPerHour: 51.2,
      generators: [gen1, gen2, gen3]
    };

    // 3. Improve fuel autonomy
    const updatedLogistics: ResourceInventory = {
      ...this.state.logistics,
      fuelDaysAutonomy: rec.expectedImpact.fuelAutonomyAfter,
      resupplyRisk: 'WATCH'
    };

    // 4. Reduce cascading risk
    const updatedRisk: CascadingRiskState = {
      overallScore: rec.expectedImpact.riskScoreAfter,
      level: 'WATCH',
      primaryRiskFactor: 'Operational mitigation active: Gen-02 isolated, Gen-03 on-line, thermal cogen load balanced',
      causalChain: [
        {
          id: 'c-01',
          label: 'Weather Status',
          subsystem: 'Environment',
          status: 'warning',
          impactDelta: 'Blizzard Mitigated',
          description: 'High winds persisting but station enclosure load-shed protocol active',
          value: `${this.state.weather.ambientTemp}°C`
        },
        {
          id: 'c-02',
          label: 'Thermal Envelope',
          subsystem: 'Thermal Enclosure',
          status: 'nominal',
          impactDelta: 'Cogen Recapture Active',
          description: 'Direct engine jacket heat recovery provides 22 kW thermal offset',
          value: '94 kW'
        },
        {
          id: 'c-03',
          label: 'Microgrid Demand',
          subsystem: 'Electrical Grid',
          status: 'nominal',
          impactDelta: '-36 kW Load Shed',
          description: 'Non-essential lab systems safely curtailed',
          value: '240 kW'
        },
        {
          id: 'c-04',
          label: 'Gen Utilization',
          subsystem: 'Power Generation',
          status: 'nominal',
          impactDelta: 'Gen-02 Isolated Safely',
          description: 'Balanced 140 kW / 100 kW across Gen-01 and Gen-03',
          value: '66% Balanced'
        },
        {
          id: 'c-05',
          label: 'Fuel Burn Rate',
          subsystem: 'Logistics',
          status: 'nominal',
          impactDelta: '-15.6 L/hr Reduction',
          description: 'Rationed consumption pace maintains safe margin',
          value: '51.2 L/hr'
        },
        {
          id: 'c-06',
          label: 'Fuel Reserve Margin',
          subsystem: 'Logistics',
          status: 'nominal',
          impactDelta: '+7.6 Days Recovered',
          description: 'Autonomy expanded to 25.8 days',
          value: '25.8 Days'
        },
        {
          id: 'c-07',
          label: 'Mission Risk',
          subsystem: 'Station Command',
          status: 'nominal',
          impactDelta: 'Risk: 84 → 44',
          description: 'Human approved response successfully averted catastrophic power trip',
          value: 'WATCH (44/100)'
        }
      ],
      impactSummary: {
        hvacDeltaPct: -18,
        powerDeltaKW: -36,
        generatorStressPct: 54,
        fuelBurnDeltaPct: -23.3,
        autonomyLossDays: 0
      }
    };

    this.state = {
      ...this.state,
      power: updatedPower,
      logistics: updatedLogistics,
      cascadingRisk: updatedRisk,
      stationHealthPct: 82,
      missionReadiness: {
        environment: { score: 62, status: 'warning', trend: 'up' },
        energy: { score: 84, status: 'nominal', trend: 'up' },
        infrastructure: { score: 85, status: 'nominal', trend: 'up' },
        lifeSupport: { score: 92, status: 'nominal', trend: 'up' },
        logistics: { score: 78, status: 'nominal', trend: 'up' },
        communication: { score: 88, status: 'nominal', trend: 'up' }
      }
    };

    this.addEvent({
      category: 'OPERATOR',
      level: 'success',
      title: 'Operator Approved Simulated Mitigation Response',
      description: 'Human-in-the-loop authorization confirmed. Gen-02 successfully isolated; Gen-03 carrying auxiliary load.',
      telemetryDelta: `Risk: ${rec.expectedImpact.riskScoreBefore} → ${rec.expectedImpact.riskScoreAfter} | Health: 82%`
    });

    this.notifyState();
  }

  public dismissRecommendation() {
    if (this.state.pendingRecommendation) {
      this.state.pendingRecommendation.status = 'dismissed';
      this.addEvent({
        category: 'OPERATOR',
        level: 'info',
        title: 'Operator Dismissed Decision Support Advisory',
        description: 'Recommendation dismissed. Telemetry remains under active manual monitoring.'
      });
      this.notifyState();
    }
  }

  // Reset simulation to baseline pristine state
  public resetSimulation() {
    const config = this.state.config;
    this.state = this.createInitialState(config);
    this.activeScenario = null;
    this.addEvent({
      category: 'SYSTEM',
      type: 'system',
      level: 'info',
      title: 'Simulation Reset to Nominal Baseline',
      description: 'All What-If scenario mutations cleared. Deterministic telemetry re-synchronized.'
    });
    this.notifyState();
  }

  public reset() {
    this.resetSimulation();
  }

  public simulateRecommendationAction() {
    this.approveRecommendation();
  }

  public isolateGenerator(genId: string = 'gen-02') {
    this.approveRecommendation();
  }

  public getEvents(): MissionEvent[] {
    return [...this.events];
  }

  public addEvent(event: Omit<MissionEvent, 'id' | 'timestamp' | 'utcTime'> & { telemetryDelta?: string }) {
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
    const utcTime = `${utcHours}:${utcMins}`;

    const newEvent: MissionEvent = {
      type: 'system',
      ...event,
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: `${utcTime} UTC`,
      utcTime
    };

    this.events.unshift(newEvent);
    if (this.events.length > 50) this.events.pop();

    this.eventListeners.forEach(cb => cb([...this.events]));
  }

  public onStateChange(listener: (state: MultiStationState) => void) {
    this.stateListeners.push(listener);
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener);
    };
  }

  public onEventsChange(listener: (events: MissionEvent[]) => void) {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== listener);
    };
  }

  private notifyState() {
    const multiState = this.getState();
    this.stateListeners.forEach(cb => cb({ ...multiState }));
  }
}

// Global deterministic simulator singleton
export const simulationEngine = new AntarcticSimulationEngine('bharati');
