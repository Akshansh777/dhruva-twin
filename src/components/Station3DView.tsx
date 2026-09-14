// DHRUVA-TWIN 3D Interactive Antarctic Station Visualizer
// Real-time WebGL Digital Twin rendered via Three.js with dynamic subsystem illumination & blizzard particle physics

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SubsystemStatus, StationId } from '../types';
import {
  RotateCcw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Hand,
  Orbit,
  Eye,
  Info,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Radio,
  Zap,
  Droplets,
  Activity
} from 'lucide-react';

export interface Station3DViewProps {
  statusPower?: SubsystemStatus;
  statusHabitation?: SubsystemStatus;
  statusFuel?: SubsystemStatus;
  statusWater?: SubsystemStatus;
  isBlizzard?: boolean;
  selectedPod?: string | null;
  onSelectPod?: (podId: string) => void;
  stationName?: string;
  stationId?: StationId;
  stationHealth?: number;
  isLightMode?: boolean;
}

interface SubsystemModule {
  id: string;
  name: string;
  code: string;
  category: string;
  status: SubsystemStatus;
  meshGroup: THREE.Group;
  statusMesh: THREE.Mesh;
  worldPos: THREE.Vector3;
}

function normalizeStatus(status?: string): SubsystemStatus {
  if (status === 'critical' || status === 'CRITICAL' || status === 'alert') return 'critical';
  if (status === 'warning' || status === 'WARNING' || status === 'WATCH' || status === 'HIGH') return 'warning';
  if (status === 'offline' || status === 'OFFLINE') return 'offline';
  return 'nominal';
}

export const Station3DView: React.FC<Station3DViewProps> = ({
  statusPower: rawPower = 'warning',
  statusHabitation: rawHabitation = 'nominal',
  statusFuel: rawFuel = 'nominal',
  statusWater: rawWater = 'nominal',
  isBlizzard = false,
  selectedPod = null,
  onSelectPod = (_podId: string) => {},
  stationName,
  stationId = 'bharati',
  stationHealth = 88,
  isLightMode = false
}) => {
  const statusPower = normalizeStatus(rawPower);
  const statusHabitation = normalizeStatus(rawHabitation);
  const statusFuel = normalizeStatus(rawFuel);
  const statusWater = normalizeStatus(rawWater);
  const activeStationName =
    stationName ||
    (stationId === 'maitri'
      ? 'Maitri Station (70°46′S 11°44′E)'
      : 'Bharati Station (69°24′S 76°11′E)');

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [hoveredPod, setHoveredPod] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'pan'>('orbit');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number; name: string; status: SubsystemStatus } | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modulesRef = useRef<SubsystemModule[]>([]);
  const snowParticlesRef = useRef<THREE.Points | null>(null);
  const radarMeshRef = useRef<THREE.Mesh | null>(null);
  const beaconLightRef = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasContainerRef.current) return;

    // Check WebGL support using an isolated off-DOM probe canvas
    const checkWebGL = (): boolean => {
      try {
        const probeCanvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (probeCanvas.getContext('webgl2') ||
            probeCanvas.getContext('webgl') ||
            probeCanvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    };

    if (!checkWebGL()) {
      setWebglSupported(false);
      return;
    }

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene setup: Light Mode has sunlit polar sky, Dark Mode has starry polar aurora night
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const isLight = isLightMode;
    scene.background = new THREE.Color(isLight ? 0xedf4fc : 0x020713);
    scene.fog = new THREE.FogExp2(
      isLight ? 0xe2edf9 : 0x040b1a,
      isBlizzard ? 0.032 : isLight ? 0.007 : 0.012
    );

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    camera.position.set(28, 20, 32);
    cameraRef.current = camera;

    // 3. Renderer with safe creation
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (err) {
      console.warn('WebGLRenderer could not be initialized, falling back to 2D:', err);
      setWebglSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    const canvasEl = renderer.domElement;
    canvasEl.className = 'w-full h-full flex-1 cursor-grab active:cursor-grabbing block';

    // Append to container
    if (canvasContainerRef.current) {
      canvasContainerRef.current.innerHTML = '';
      canvasContainerRef.current.appendChild(canvasEl);
    }

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Do not go underground
    controls.minDistance = 10;
    controls.maxDistance = 80;
    controls.target.set(0, 3, 0);
    controlsRef.current = controls;

    // 5. Lighting: Crisp natural sunlight in light mode, high-tech moonlight in dark mode
    const ambientLight = new THREE.AmbientLight(
      isLight ? 0xeef5fc : 0x304868,
      isLight ? 1.6 : 1.2
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      isLight ? 0xfff7ec : 0x72a5db,
      isLight ? 2.4 : 1.8
    );
    sunLight.position.set(30, 45, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(
      isLight ? 0x93c5fd : 0x00e5ff,
      isLight ? 0.6 : 0.9
    );
    rimLight.position.set(-25, 15, -25);
    scene.add(rimLight);

    // Blinking red antenna beacon
    const beaconLight = new THREE.PointLight(0xff2222, isLight ? 1.8 : 2.5, 25);
    beaconLight.position.set(0, 14, 0);
    scene.add(beaconLight);
    beaconLightRef.current = beaconLight;

    // 6. Terrain: Snow & Ice base with topographic elevation
    const terrainGeo = new THREE.PlaneGeometry(120, 120, 48, 48);
    terrainGeo.rotateX(-Math.PI / 2);

    // Displace vertices to create Antarctic ice dunes
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      const elevation = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 1.6 +
                        Math.sin(x * 0.2 + z * 0.1) * 0.5 -
                        (dist < 16 ? 0.3 : 0); // Flat area under station
      pos.setY(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xf4f7fa : 0x162438,
      roughness: 0.9,
      metalness: 0.05
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Clean subtle grid lines on ice
    const gridHelper = new THREE.GridHelper(
      100,
      30,
      isLight ? 0x93c5fd : 0x00f0ff,
      isLight ? 0xdbeafe : 0x092640
    );
    gridHelper.position.y = 0.15;
    scene.add(gridHelper);

    // Antarctic Starfield (visible at night)
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 300;
      starPositions[i + 1] = Math.random() * 120 + 20;
      starPositions[i + 2] = (Math.random() - 0.5) * 300;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: isLight ? 0x64748b : 0x9be8ff,
      size: 0.7,
      transparent: true,
      opacity: isLight ? 0.0 : 0.8
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // 7. BUILD THE STATION ARCHITECTURE (Bharati Modular Design)
    const stationGroup = new THREE.Group();
    scene.add(stationGroup);
    modulesRef.current = [];

    // Clean architectural materials
    const metallicHullMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xe2e8f0 : 0x22354a,
      metalness: isLight ? 0.35 : 0.7,
      roughness: isLight ? 0.3 : 0.35
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x334155 : 0x0e1824,
      metalness: isLight ? 0.4 : 0.8,
      roughness: 0.4
    });

    const windowGlassMat = new THREE.MeshPhysicalMaterial({
      color: isLight ? 0x0284c7 : 0x00f0ff,
      emissive: isLight ? 0x0369a1 : 0x004050,
      emissiveIntensity: isLight ? 0.25 : 0.5,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    });

    // Central Main Habitation / Operations Core
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, 0);

    // Elevated Hydraulic Stilts
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const legX = Math.cos(angle) * 5.2;
      const legZ = Math.sin(angle) * 5.2;
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.35, 4.5, 12),
        darkTrimMat
      );
      leg.position.set(legX, 2.25, legZ);
      leg.castShadow = true;
      coreGroup.add(leg);

      // Stilt footpad
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.9, 0.3, 12),
        metallicHullMat
      );
      foot.position.set(legX, 0.15, legZ);
      coreGroup.add(foot);
    }

    // Lower Core Deck
    const lowerCore = new THREE.Mesh(
      new THREE.CylinderGeometry(6.2, 5.8, 2.5, 16),
      metallicHullMat
    );
    lowerCore.position.y = 5.2;
    lowerCore.castShadow = true;
    lowerCore.receiveShadow = true;
    coreGroup.add(lowerCore);

    // Upper Core Deck with Observation Windows
    const upperCore = new THREE.Mesh(
      new THREE.CylinderGeometry(5.4, 6.0, 2.2, 16),
      metallicHullMat
    );
    upperCore.position.y = 7.5;
    upperCore.castShadow = true;
    coreGroup.add(upperCore);

    // Window Ring
    const windowBand = new THREE.Mesh(
      new THREE.CylinderGeometry(6.05, 6.05, 0.7, 16, 1, true),
      windowGlassMat
    );
    windowBand.position.y = 6.4;
    coreGroup.add(windowBand);

    // Observation Cupola Dome on Roof
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      windowGlassMat
    );
    dome.position.y = 8.6;
    coreGroup.add(dome);

    // Rooftop Antenna Spire
    const spire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.2, 6.0, 8),
      darkTrimMat
    );
    spire.position.y = 11.6;
    coreGroup.add(spire);

    // Beacon light bulb
    const beaconSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff2222 })
    );
    beaconSphere.position.y = 14.6;
    coreGroup.add(beaconSphere);

    // Rotating Radar Dish
    const radarGroup = new THREE.Group();
    radarGroup.position.set(2.8, 9.2, -1.8);
    const radarDish = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 0.5, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xddf0ff, metalness: 0.8, roughness: 0.2 })
    );
    radarDish.rotation.x = Math.PI * 0.4;
    radarGroup.add(radarDish);
    coreGroup.add(radarGroup);
    radarMeshRef.current = radarDish;

    stationGroup.add(coreGroup);

    // Function to create an elevated radial module
    const createPod = (
      id: string,
      name: string,
      code: string,
      category: string,
      angle: number,
      distance: number,
      status: SubsystemStatus
    ): SubsystemModule => {
      const podGroup = new THREE.Group();
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      podGroup.position.set(x, 0, z);

      // Connecting corridor from central core to pod
      const corridorLength = distance - 5.5;
      const corridorGeo = new THREE.CylinderGeometry(1.1, 1.1, corridorLength, 12);
      corridorGeo.rotateZ(Math.PI / 2);
      const corridor = new THREE.Mesh(corridorGeo, metallicHullMat);

      // Position corridor halfway between center and pod
      const corridorMidX = Math.cos(angle) * (distance / 2);
      const corridorMidZ = Math.sin(angle) * (distance / 2);
      corridor.position.set(corridorMidX, 5.2, corridorMidZ);
      corridor.rotation.y = -angle;
      corridor.castShadow = true;
      stationGroup.add(corridor);

      // Pod Stilts
      for (let s = 0; s < 4; s++) {
        const sAngle = (s / 4) * Math.PI * 2 + Math.PI / 4;
        const stiltX = Math.cos(sAngle) * 3.2;
        const stiltZ = Math.sin(sAngle) * 3.2;
        const stilt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.25, 4.6, 8),
          darkTrimMat
        );
        stilt.position.set(stiltX, 2.3, stiltZ);
        stilt.castShadow = true;
        podGroup.add(stilt);

        // Stilt Footpad
        const foot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.6, 0.7, 0.25, 8),
          metallicHullMat
        );
        foot.position.set(stiltX, 0.12, stiltZ);
        podGroup.add(foot);
      }

      // Pod Main Hull (Octagonal Chamber)
      const hullGeo = new THREE.CylinderGeometry(3.6, 3.4, 3.2, 10);
      const podHull = new THREE.Mesh(hullGeo, metallicHullMat);
      podHull.position.y = 5.2;
      podHull.castShadow = true;
      podHull.receiveShadow = true;
      podGroup.add(podHull);

      // Rooftop Solar / Aerodynamic Shroud
      const roof = new THREE.Mesh(
        new THREE.CylinderGeometry(3.2, 3.6, 0.5, 10),
        darkTrimMat
      );
      roof.position.y = 6.9;
      podGroup.add(roof);

      // Subsystem Status Glowing Ring
      const ringColor = getStatusColorHex(status);
      const statusRingGeo = new THREE.TorusGeometry(3.65, 0.12, 8, 24);
      statusRingGeo.rotateX(Math.PI / 2);
      const statusMat = new THREE.MeshBasicMaterial({
        color: ringColor,
        transparent: true,
        opacity: 0.95
      });
      const statusRing = new THREE.Mesh(statusRingGeo, statusMat);
      statusRing.position.y = 5.2;
      podGroup.add(statusRing);

      // Pod window port
      const windowGeo = new THREE.CylinderGeometry(3.62, 3.62, 0.6, 10, 1, true);
      const windowMesh = new THREE.Mesh(windowGeo, windowGlassMat);
      windowMesh.position.y = 5.8;
      podGroup.add(windowMesh);

      // Specific equipment per pod type
      if (id === 'power') {
        // Dual Exhaust Stacks for Cogeneration Generators
        const stack1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.5, 8), darkTrimMat);
        stack1.position.set(1.2, 8.2, 0.8);
        const stack2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.5, 8), darkTrimMat);
        stack2.position.set(-1.2, 8.2, 0.8);
        podGroup.add(stack1);
        podGroup.add(stack2);
      } else if (id === 'fuel') {
        // Cryogenic storage sphere and cylinder tanks
        const tank1 = new THREE.Mesh(
          new THREE.CylinderGeometry(0.9, 0.9, 2.0, 12),
          new THREE.MeshStandardMaterial({ color: 0x3d5a80, metalness: 0.9, roughness: 0.2 })
        );
        tank1.position.set(0, 8.0, 0);
        podGroup.add(tank1);
      } else if (id === 'water') {
        // Water purification heat exchanger dome
        const waterDome = new THREE.Mesh(
          new THREE.SphereGeometry(1.2, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2),
          new THREE.MeshStandardMaterial({ color: 0x00bcd4, roughness: 0.3, metalness: 0.6 })
        );
        waterDome.position.set(0, 7.1, 0);
        podGroup.add(waterDome);
      } else if (id === 'science') {
        // Optical astronomy / auroral observation dome
        const scienceDome = new THREE.Mesh(
          new THREE.SphereGeometry(1.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
          windowGlassMat
        );
        scienceDome.position.set(0, 7.1, 0);
        podGroup.add(scienceDome);
      }

      stationGroup.add(podGroup);

      const worldPos = new THREE.Vector3();
      podGroup.getWorldPosition(worldPos);

      return {
        id,
        name,
        code,
        category,
        status,
        meshGroup: podGroup,
        statusMesh: statusRing,
        worldPos: new THREE.Vector3(x, 5.2, z)
      };
    };

    // Radiating Subsystems
    const pods: SubsystemModule[] = [
      createPod('habitation', 'Pod 1: Habitation & Crew Quarters', 'HAB-01', 'Life Support', 0, 13.5, statusHabitation),
      createPod('power', 'Pod 2: Power Generation & Microgrid', 'PWR-02', 'Energy', (Math.PI * 2) * (1 / 5), 13.5, statusPower),
      createPod('fuel', 'Pod 3: Fuel Farm & Cryo-Storage', 'FUL-03', 'Logistics', (Math.PI * 2) * (2 / 5), 13.5, statusFuel),
      createPod('water', 'Pod 4: Water & Thermal Recycling', 'WTR-04', 'Life Support', (Math.PI * 2) * (3 / 5), 13.5, statusWater),
      createPod('science', 'Pod 5: Science & Magnetometry Lab', 'SCI-05', 'Research', (Math.PI * 2) * (4 / 5), 13.5, 'nominal')
    ];
    modulesRef.current = pods;

    // 8. Blizzard Snow Particles System
    const snowCount = 3000;
    const snowGeo = new THREE.BufferGeometry();
    const snowPos = new Float32Array(snowCount * 3);
    const snowVel = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount * 3; i += 3) {
      snowPos[i] = (Math.random() - 0.5) * 140;
      snowPos[i + 1] = Math.random() * 45;
      snowPos[i + 2] = (Math.random() - 0.5) * 140;

      snowVel[i] = -0.5 - Math.random() * 1.5; // Wind drift X
      snowVel[i + 1] = -0.15 - Math.random() * 0.3; // Fall Y
      snowVel[i + 2] = (Math.random() - 0.5) * 0.4;
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.55,
      transparent: true,
      opacity: 0.45
    });
    const snowParticles = new THREE.Points(snowGeo, snowMat);
    scene.add(snowParticles);
    snowParticlesRef.current = snowParticles;

    // 9. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate radar dish
      if (radarMeshRef.current) {
        radarMeshRef.current.rotation.y = elapsedTime * 0.8;
      }

      // Beacon blink
      if (beaconLightRef.current) {
        beaconLightRef.current.intensity = Math.sin(elapsedTime * 4.0) > 0.3 ? 3.0 : 0.2;
      }

      // Snow particle movement based on blizzard state
      if (snowParticlesRef.current) {
        const positions = snowParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const windMultiplier = isBlizzard ? 5.5 : 1.0;
        const fallMultiplier = isBlizzard ? 2.2 : 1.0;

        for (let i = 0; i < positions.length; i += 3) {
          // X drift
          positions[i] += (-0.6 * windMultiplier);
          // Y fall
          positions[i + 1] += (-0.12 * fallMultiplier);
          // Z turbulence
          positions[i + 2] += Math.sin(elapsedTime + i) * 0.04 * windMultiplier;

          // Reset when out of bounds
          if (positions[i] < -70) positions[i] = 70;
          if (positions[i + 1] < 0) positions[i + 1] = 45;
          if (positions[i + 2] < -70) positions[i + 2] = 70;
          if (positions[i + 2] > 70) positions[i + 2] = -70;
        }
        snowParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Smooth camera orbit damping
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (canvasContainerRef.current && canvasContainerRef.current.contains(canvasEl)) {
        canvasContainerRef.current.removeChild(canvasEl);
      }
      renderer.dispose();
      renderer.forceContextLoss();
      terrainGeo.dispose();
      terrainMat.dispose();
      starsGeo.dispose();
      starsMat.dispose();
      snowGeo.dispose();
      snowMat.dispose();
    };
  }, [isBlizzard, stationId, isLightMode]);

  // Update Subsystem Lights when props change
  useEffect(() => {
    if (!modulesRef.current.length) return;

    modulesRef.current.forEach(mod => {
      let status: SubsystemStatus = 'nominal';
      if (mod.id === 'power') status = statusPower;
      if (mod.id === 'habitation') status = statusHabitation;
      if (mod.id === 'fuel') status = statusFuel;
      if (mod.id === 'water') status = statusWater;

      mod.status = status;
      const isSelected = selectedPod === mod.id;
      const isHovered = hoveredPod === mod.id;

      let hexColor = getStatusColorHex(status);
      if (isSelected) hexColor = 0x00f0ff; // bright cyan highlight

      const mat = mod.statusMesh.material as THREE.MeshBasicMaterial;
      mat.color.setHex(hexColor);
      mat.opacity = isSelected || isHovered ? 1.0 : 0.85;

      // Scale effect if selected
      const targetScale = isSelected ? 1.06 : 1.0;
      mod.meshGroup.scale.set(targetScale, targetScale, targetScale);
    });
  }, [statusPower, statusHabitation, statusFuel, statusWater, selectedPod, hoveredPod]);

  // Update scene atmosphere during blizzard
  useEffect(() => {
    if (!sceneRef.current) return;
    if (isBlizzard) {
      sceneRef.current.fog = new THREE.FogExp2(0x061124, 0.045);
      if (snowParticlesRef.current) {
        (snowParticlesRef.current.material as THREE.PointsMaterial).size = 0.9;
        (snowParticlesRef.current.material as THREE.PointsMaterial).opacity = 0.85;
      }
    } else {
      sceneRef.current.fog = new THREE.FogExp2(0x040b1a, 0.012);
      if (snowParticlesRef.current) {
        (snowParticlesRef.current.material as THREE.PointsMaterial).size = 0.55;
        (snowParticlesRef.current.material as THREE.PointsMaterial).opacity = 0.45;
      }
    }
  }, [isBlizzard]);

  // Helper: Hex colors
  function getStatusColorHex(status: SubsystemStatus): number {
    switch (status) {
      case 'nominal': return 0x00ff88; // Bright Nominal Green
      case 'warning': return 0xffb703; // Amber Warning
      case 'critical': return 0xff3355; // Red Alert
      case 'offline': return 0x5a7184; // Grey offline
      default: return 0x00e5ff;
    }
  }

  // Camera toolbar actions
  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(28, 20, 32);
    controlsRef.current.target.set(0, 3, 0);
    controlsRef.current.update();
  };

  const handleZoom = (delta: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const dir = new THREE.Vector3();
    cameraRef.current.getWorldDirection(dir);
    cameraRef.current.position.addScaledVector(dir, delta);
    controlsRef.current.update();
  };

  const handleTopDown = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 48, 0.1);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  // Mouse Raycasting on Canvas Container
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;
    const canvasEl = rendererRef.current.domElement;
    const rect = canvasEl.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    for (const mod of modulesRef.current) {
      const intersects = raycaster.intersectObjects(mod.meshGroup.children, true);
      if (intersects.length > 0) {
        onSelectPod(mod.id);
        break;
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rendererRef.current || !cameraRef.current) return;
    const canvasEl = rendererRef.current.domElement;
    const rect = canvasEl.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    let foundPod: SubsystemModule | null = null;
    for (const mod of modulesRef.current) {
      const intersects = raycaster.intersectObjects(mod.meshGroup.children, true);
      if (intersects.length > 0) {
        foundPod = mod;
        break;
      }
    }

    if (foundPod) {
      setHoveredPod(foundPod.id);
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        name: foundPod.name,
        status: foundPod.status
      });
    } else {
      setHoveredPod(null);
      setTooltipPos(null);
    }
  };

  return (
    <div
      ref={containerRef}
      id="interactive-3d-station-container"
      className="relative w-full h-full min-h-[380px] bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden flex flex-col select-none transition-colors duration-300 shadow-sm"
    >
      {/* Viewport Top Bar / Controls */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-white/85 dark:bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span className="font-semibold tracking-wide">3D Interactive Station</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-slate-500 dark:text-slate-400">{activeStationName}</span>
        </div>

        {/* 3D Camera Controls Group */}
        <div className="flex items-center gap-1 pointer-events-auto bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-1 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => setCameraMode('orbit')}
            title="Orbit View Mode"
            className={`p-1.5 rounded-full transition ${cameraMode === 'orbit' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Orbit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleTopDown}
            title="Overhead View"
            className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(4)}
            title="Zoom In"
            className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-4)}
            title="Zoom Out"
            className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetCamera}
            title="Reset View"
            className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Blizzard Storm Alert Banner */}
      {isBlizzard && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 bg-rose-500/90 text-white px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg shadow-rose-900/30 animate-pulse text-xs font-semibold">
          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>Active Polar Blizzard • High Winds (118 km/h) • Reduced Visibility</span>
        </div>
      )}

      {/* 3D WebGL Canvas Container */}
      {webglSupported ? (
        <div
          ref={canvasContainerRef}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          className="w-full h-full flex-1 relative overflow-hidden"
        />
      ) : (
        // Fallback 2D Architectural Schematic
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-600 dark:text-slate-300">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center mb-3 text-sky-500">
            <Orbit className="w-8 h-8 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Architectural Schematic Mode</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
            Station overview rendered via 2D architectural blueprint layout. Telemetry remains live and synchronized.
          </p>
        </div>
      )}

      {/* Tooltip Overlay during Raycast Hover */}
      {tooltipPos && (
        <div
          style={{ left: `${tooltipPos.x + 12}px`, top: `${tooltipPos.y - 30}px` }}
          className="absolute z-30 pointer-events-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs shadow-xl flex items-center gap-2 text-slate-800 dark:text-slate-100 font-medium"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              tooltipPos.status === 'nominal' ? 'bg-emerald-500' : tooltipPos.status === 'warning' ? 'bg-amber-500 animate-ping' : 'bg-rose-500 animate-pulse'
            }`}
          />
          <span>{tooltipPos.name}</span>
          <span className="text-slate-400 text-[10px] uppercase font-semibold">({tooltipPos.status})</span>
        </div>
      )}

      {/* Subsystem Status Pills */}
      <div className="absolute bottom-4 left-3 right-3 z-20 flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
        <button
          onClick={() => onSelectPod('habitation')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all shadow-sm ${
            selectedPod === 'habitation'
              ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300/40'
              : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Living Quarters & Science (Healthy)</span>
        </button>

        <button
          onClick={() => onSelectPod('power')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all shadow-sm ${
            selectedPod === 'power'
              ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300/40'
              : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${statusPower === 'critical' ? 'bg-rose-500 animate-ping' : 'bg-amber-500'}`} />
          <span>Power Station ({statusPower === 'critical' ? 'Attention Needed' : 'Gen 2 Monitoring'})</span>
        </button>

        <button
          onClick={() => onSelectPod('fuel')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all shadow-sm ${
            selectedPod === 'fuel'
              ? 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-300/40'
              : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Fuel & Water Reserves (184 Days)</span>
        </button>

        <button
          onClick={() => onSelectPod('water')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all shadow-sm ${
            selectedPod === 'water'
              ? 'bg-sky-500 text-white border-sky-600 ring-2 ring-sky-300/40'
              : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-sky-500" />
          <span>Thermal & Water Loops (Optimal)</span>
        </button>
      </div>

      {/* Station Status Overview Bar */}
      <div className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-4 py-2.5 flex flex-col gap-2 z-20">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-slate-100">Subsystem Quick Health</span>
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">Click any pod in 3D to inspect telemetry</span>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center">
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-2 flex flex-col items-center">
            <Zap className={`w-4 h-4 mb-1 ${statusPower === 'critical' ? 'text-rose-500 animate-pulse' : statusPower === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`} />
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Power Grid</span>
            <span className={`text-[10px] font-semibold ${statusPower === 'critical' ? 'text-rose-500' : statusPower === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`}>
              {statusPower === 'critical' ? 'Attention' : statusPower === 'warning' ? 'Monitor Gen 2' : 'Nominal'}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-2 flex flex-col items-center">
            <Flame className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Thermal</span>
            <span className="text-[10px] font-semibold text-emerald-500">21.0°C Warm</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-2 flex flex-col items-center">
            <Radio className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Satellite</span>
            <span className="text-[10px] font-semibold text-emerald-500">Connected</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-2 flex flex-col items-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Structure</span>
            <span className="text-[10px] font-semibold text-emerald-500">Hydraulics OK</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-2 flex flex-col items-center">
            <Activity className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Environment</span>
            <span className="text-[10px] font-semibold text-emerald-500">Stable</span>
          </div>
        </div>

        {/* Footer Sub-Info */}
        <div className="flex items-center justify-between text-xs pt-1 text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Info className="w-3.5 h-3.5 text-sky-500" />
            <span>Next GSAT Satellite Pass in 02h 14m</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry Link: Active & Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
