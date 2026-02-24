"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { geoEquirectangular, geoPath } from "d3-geo";
import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import worldAtlas from "world-atlas/countries-110m.json";
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  DoubleSide,
  MathUtils,
  MeshBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  Spherical,
  Vector3,
} from "three";

export interface MarketPoint {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface MarketsGlobeProps {
  markets: MarketPoint[];
  selectedId: string;
  onSelect: (id: string) => void;
  onHover?: (id: string | null) => void;
}

type ThemeMode = "dark" | "light";
type Vec3 = [number, number, number];

const GLOBE_RADIUS = 1.02;
const CAMERA_DISTANCE = 3.05;
const MIN_POLAR = 0.48;
const MAX_POLAR = Math.PI - 0.48;
const TAU = Math.PI * 2;
const MARKET_REGION_IDS: Record<string, number[]> = {
  germany: [276],
  france: [250],
  italy: [380],
  gcc: [48, 414, 512, 634, 682, 784],
  "united-kingdom": [826],
  poland: [616],
  russia: [643],
};

type Palette = {
  core: string;
  glow: string;
  atmosphere: string;
  grid: string;
  land: string;
  landShadow: string;
  landStroke: string;
  landGlow: string;
  marker: string;
  markerHover: string;
  markerSelected: string;
  markerHalo: string;
  labelBg: string;
  labelBorder: string;
  labelText: string;
};

const PALETTES: Record<ThemeMode, Palette> = {
  dark: {
    core: "#0f2a33",
    glow: "#88c5db",
    atmosphere: "#4bb4da",
    grid: "#8eb9c7",
    land: "#568fa4",
    landShadow: "#21414d",
    landStroke: "rgba(226, 175, 109, 0.78)",
    landGlow: "rgba(185, 117, 50, 0.56)",
    marker: "#f5f8fb",
    markerHover: "#bde0ef",
    markerSelected: "#e2af6d",
    markerHalo: "#b97532",
    labelBg: "rgba(8, 17, 22, 0.84)",
    labelBorder: "rgba(226, 175, 109, 0.72)",
    labelText: "#ffffff",
  },
  light: {
    core: "#5d8195",
    glow: "#f1dfc6",
    atmosphere: "#d8e5ec",
    grid: "#4d6f81",
    land: "#c5cebf",
    landShadow: "#dde3d4",
    landStroke: "rgba(125, 102, 70, 0.68)",
    landGlow: "rgba(185, 117, 50, 0.26)",
    marker: "#1d4251",
    markerHover: "#2c6278",
    markerSelected: "#b97532",
    markerHalo: "#d2a370",
    labelBg: "rgba(252, 254, 255, 0.92)",
    labelBorder: "rgba(27, 58, 66, 0.45)",
    labelText: "#132b33",
  },
};

function latLonToPosition(lat: number, lon: number, radius = GLOBE_RADIUS): Vec3 {
  const phi = MathUtils.degToRad(90 - lat);
  const theta = MathUtils.degToRad(lon + 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

function shortestAngle(from: number, to: number) {
  let delta = (to - from) % TAU;
  if (delta > Math.PI) delta -= TAU;
  if (delta < -Math.PI) delta += TAU;
  return delta;
}

function createLatitudeLine(lat: number, radius: number): Vec3[] {
  const points: Vec3[] = [];
  const latRad = MathUtils.degToRad(lat);
  for (let i = 0; i <= 128; i += 1) {
    const lon = (i / 128) * TAU;
    const x = radius * Math.cos(latRad) * Math.cos(lon);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.sin(lon);
    points.push([x, y, z]);
  }
  return points;
}

function createLongitudeLine(lon: number, radius: number): Vec3[] {
  const points: Vec3[] = [];
  const lonRad = MathUtils.degToRad(lon);
  for (let i = 0; i <= 128; i += 1) {
    const lat = MathUtils.degToRad(-90 + (180 * i) / 128);
    const x = radius * Math.cos(lat) * Math.cos(lonRad);
    const y = radius * Math.sin(lat);
    const z = radius * Math.cos(lat) * Math.sin(lonRad);
    points.push([x, y, z]);
  }
  return points;
}

function createLandTexture(theme: ThemeMode, palette: Palette) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    const fallback = document.createElement("canvas");
    fallback.width = 2;
    fallback.height = 2;
    const fallbackTexture = new CanvasTexture(fallback);
    fallbackTexture.colorSpace = SRGBColorSpace;
    return fallbackTexture;
  }

  const atlas = worldAtlas as {
    objects: { countries: unknown };
  };
  const countries = feature(atlas as never, atlas.objects.countries as never);
  const projection = geoEquirectangular()
    .translate([canvas.width / 2, canvas.height / 2])
    .scale(canvas.width / (2 * Math.PI));
  const path = geoPath(projection, ctx);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  path(countries as never);
  ctx.fillStyle = palette.landShadow;
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  path(countries as never);
  ctx.shadowColor = palette.landGlow;
  ctx.shadowBlur = theme === "dark" ? 34 : 26;
  ctx.fillStyle = palette.land;
  ctx.globalAlpha = theme === "dark" ? 0.9 : 0.74;
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  path(countries as never);
  ctx.strokeStyle = palette.landStroke;
  ctx.lineWidth = theme === "dark" ? 1.45 : 1.2;
  ctx.globalAlpha = theme === "dark" ? 0.86 : 0.56;
  ctx.stroke();
  ctx.globalAlpha = 1;

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createRegionTexture(theme: ThemeMode, palette: Palette, countryIds: number[]) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    const fallback = document.createElement("canvas");
    fallback.width = 2;
    fallback.height = 2;
    const fallbackTexture = new CanvasTexture(fallback);
    fallbackTexture.colorSpace = SRGBColorSpace;
    return fallbackTexture;
  }

  const atlas = worldAtlas as {
    objects: { countries: unknown };
  };
  const allCountries = feature(atlas as never, atlas.objects.countries as never) as unknown as {
    type: "FeatureCollection";
    features: Array<{ id?: string | number }>;
  };

  const regionSet = new Set(countryIds);
  const regionFeatures = allCountries.features.filter((entry) => regionSet.has(Number(entry.id)));
  const regionOnly = {
    type: "FeatureCollection",
    features: regionFeatures,
  };

  const projection = geoEquirectangular()
    .translate([canvas.width / 2, canvas.height / 2])
    .scale(canvas.width / (2 * Math.PI));
  const path = geoPath(projection, ctx);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.beginPath();
  path(regionOnly as never);
  ctx.shadowColor = theme === "dark" ? "rgba(226, 175, 109, 0.88)" : "rgba(185, 117, 50, 0.62)";
  ctx.shadowBlur = theme === "dark" ? 30 : 20;
  ctx.fillStyle = theme === "dark" ? "rgba(226, 175, 109, 0.92)" : "rgba(185, 117, 50, 0.82)";
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  path(regionOnly as never);
  ctx.strokeStyle = theme === "dark" ? "rgba(255, 236, 196, 0.95)" : "rgba(245, 210, 153, 0.9)";
  ctx.lineWidth = theme === "dark" ? 2.25 : 1.9;
  ctx.stroke();

  ctx.beginPath();
  path(regionOnly as never);
  ctx.strokeStyle = palette.landGlow;
  ctx.lineWidth = theme === "dark" ? 4.2 : 3.2;
  ctx.globalAlpha = theme === "dark" ? 0.44 : 0.3;
  ctx.stroke();
  ctx.globalAlpha = 1;

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

interface MarketMarkerProps {
  id: string;
  position: Vec3;
  selected: boolean;
  hovered: boolean;
  palette: Palette;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

function MarketMarker({
  id,
  position,
  selected,
  hovered,
  palette,
  onSelect,
  onHover,
}: MarketMarkerProps) {
  const coreRef = useRef<Mesh>(null);
  const haloRef = useRef<Mesh>(null);
  const pulseSeed = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < id.length; i += 1) {
      hash = (hash * 31 + id.charCodeAt(i)) % 1000;
    }
    return (hash / 1000) * TAU;
  }, [id]);

  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.35 + pulseSeed) * 0.11;
    if (haloRef.current) {
      const haloBase = selected ? 1.42 : hovered ? 1.24 : 1;
      haloRef.current.scale.setScalar(haloBase * pulse);
    }
    if (coreRef.current) {
      const coreBase = selected ? 1.35 : hovered ? 1.18 : 1;
      coreRef.current.scale.setScalar(coreBase);
    }
  });

  return (
    <group position={position}>
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.045, 20, 20]} />
        <meshBasicMaterial
          color={selected ? palette.markerSelected : palette.markerHalo}
          transparent
          opacity={selected ? 0.28 : hovered ? 0.2 : 0.13}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.038, 0.052, 48]} />
        <meshBasicMaterial
          color={selected ? palette.markerSelected : palette.grid}
          transparent
          opacity={selected ? 0.86 : hovered ? 0.54 : 0.3}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={coreRef}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(id);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHover(null);
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(id);
        }}
      >
        <sphereGeometry args={[0.02, 24, 24]} />
        <meshStandardMaterial
          color={selected ? palette.markerSelected : hovered ? palette.markerHover : palette.marker}
          emissive={selected ? palette.markerSelected : hovered ? palette.markerHover : palette.marker}
          emissiveIntensity={selected ? 0.92 : hovered ? 0.56 : 0.32}
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

interface GlobeSceneProps {
  markets: MarketPoint[];
  selectedId: string;
  onSelect: (id: string) => void;
  onHover?: (id: string | null) => void;
  theme: ThemeMode;
}

function GlobeScene({ markets, selectedId, onSelect, onHover, theme }: GlobeSceneProps) {
  const palette = PALETTES[theme];
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const landMeshRef = useRef<Mesh>(null);
  const landGlowMeshRef = useRef<Mesh>(null);
  const regionHighlightMeshRef = useRef<Mesh>(null);
  const auraMeshRef = useRef<Mesh>(null);
  const orbitRingRef = useRef<Mesh>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const userOrbitingRef = useRef(false);
  const focusTargetRef = useRef<{ theta: number; phi: number; active: boolean }>({
    theta: 0,
    phi: Math.PI / 2,
    active: false,
  });
  const releaseTimerRef = useRef<number | null>(null);

  const markerPositions = useMemo(() => {
    const next: Record<string, Vec3> = {};
    markets.forEach((market) => {
      next[market.id] = latLonToPosition(market.lat, market.lon);
    });
    return next;
  }, [markets]);

  const latitudeLines = useMemo(
    () => [-60, -40, -20, 0, 20, 40, 60].map((lat) => createLatitudeLine(lat, GLOBE_RADIUS + 0.002)),
    []
  );
  const longitudeLines = useMemo(
    () =>
      [-180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) =>
        createLongitudeLine(lon, GLOBE_RADIUS + 0.002)
      ),
    []
  );
  const landTexture = useMemo(() => createLandTexture(theme, palette), [theme, palette]);

  const activeId = hoveredId || selectedId;
  const activeRegionIds = useMemo(() => MARKET_REGION_IDS[activeId] ?? [], [activeId]);
  const regionTexture = useMemo(
    () =>
      activeRegionIds.length > 0
        ? createRegionTexture(theme, palette, activeRegionIds)
        : null,
    [activeRegionIds, theme, palette]
  );
  const activeMarket = useMemo(
    () => markets.find((market) => market.id === activeId) ?? markets[0],
    [activeId, markets]
  );

  useEffect(() => {
    if (!onHover) return;
    onHover(hoveredId);
  }, [hoveredId, onHover]);

  useEffect(() => {
    const selectedMarket = markets.find((market) => market.id === selectedId);
    if (!selectedMarket) return;
    const [x, y, z] = markerPositions[selectedMarket.id] ?? [0, 0, GLOBE_RADIUS];
    const cameraVector = new Vector3(x, y, z).normalize().multiplyScalar(CAMERA_DISTANCE);
    const spherical = new Spherical().setFromVector3(cameraVector);
    focusTargetRef.current = {
      theta: spherical.theta,
      phi: MathUtils.clamp(spherical.phi, MIN_POLAR, MAX_POLAR),
      active: true,
    };
  }, [markerPositions, markets, selectedId]);

  useEffect(() => {
    document.body.style.cursor = hoveredId ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hoveredId]);

  useEffect(() => {
    return () => {
      if (releaseTimerRef.current !== null) {
        window.clearTimeout(releaseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      landTexture.dispose();
    };
  }, [landTexture]);

  useEffect(() => {
    return () => {
      regionTexture?.dispose();
    };
  }, [regionTexture]);

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const t = state.clock.elapsedTime;

    if (focusTargetRef.current.active && !userOrbitingRef.current) {
      const currentTheta = controls.getAzimuthalAngle();
      const currentPhi = controls.getPolarAngle();
      const nextTheta =
        currentTheta +
        shortestAngle(currentTheta, focusTargetRef.current.theta) * Math.min(1, delta * 4.6);
      const nextPhi =
        currentPhi + (focusTargetRef.current.phi - currentPhi) * Math.min(1, delta * 4.6);

      controls.setAzimuthalAngle(nextTheta);
      controls.setPolarAngle(nextPhi);

      const remaining =
        Math.abs(shortestAngle(nextTheta, focusTargetRef.current.theta)) +
        Math.abs(focusTargetRef.current.phi - nextPhi);
      if (remaining < 0.0022) {
        focusTargetRef.current.active = false;
      }
    }

    if (auraMeshRef.current) {
      const auraScale = 1 + Math.sin(t * 1.4) * 0.02;
      auraMeshRef.current.scale.setScalar(auraScale);
      const auraMaterial = auraMeshRef.current.material as MeshBasicMaterial;
      auraMaterial.opacity = (theme === "dark" ? 0.11 : 0.07) + Math.sin(t * 1.4) * 0.015;
    }

    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z += delta * 0.09;
      const ringMaterial = orbitRingRef.current.material as MeshBasicMaterial;
      ringMaterial.opacity = (theme === "dark" ? 0.34 : 0.24) + Math.sin(t * 2.6) * 0.05;
    }

    if (landMeshRef.current) {
      const landMaterial = landMeshRef.current.material as MeshStandardMaterial;
      landMaterial.emissiveIntensity =
        (theme === "dark" ? 0.24 : 0.11) + (Math.sin(t * 1.8) + 1) * (theme === "dark" ? 0.032 : 0.018);
    }

    if (landGlowMeshRef.current) {
      const landGlowMaterial = landGlowMeshRef.current.material as MeshBasicMaterial;
      landGlowMaterial.opacity = (theme === "dark" ? 0.2 : 0.13) + Math.sin(t * 2.1) * 0.03;
    }

    if (regionHighlightMeshRef.current) {
      const isHoverPreview = Boolean(hoveredId && hoveredId !== selectedId);
      const regionMaterial = regionHighlightMeshRef.current.material as MeshBasicMaterial;
      const base = theme === "dark" ? 0.66 : 0.54;
      const previewOffset = isHoverPreview ? -0.08 : 0;
      regionMaterial.opacity = base + previewOffset + Math.sin(t * 3.1) * 0.12;
    }

    controls.update();
  });

  const activePosition = markerPositions[activeMarket.id] ?? [0, 0, GLOBE_RADIUS];

  return (
    <>
      <ambientLight intensity={theme === "dark" ? 0.65 : 0.82} />
      <directionalLight
        position={[2.2, 1.4, 2.6]}
        intensity={theme === "dark" ? 1.4 : 1.05}
        color={theme === "dark" ? "#f4e5cf" : "#ffffff"}
      />
      <pointLight
        position={[-2.4, -1.1, 2]}
        intensity={theme === "dark" ? 1.05 : 0.75}
        color={theme === "dark" ? "#2f7f99" : "#d8bc93"}
      />

      <Stars
        radius={22}
        depth={30}
        count={theme === "dark" ? 720 : 190}
        factor={2.3}
        saturation={0}
        fade
        speed={0.18}
      />
      <Sparkles
        count={theme === "dark" ? 44 : 20}
        scale={[3.8, 3.8, 3.8]}
        size={1.9}
        speed={0.24}
        opacity={theme === "dark" ? 0.36 : 0.18}
        color={theme === "dark" ? palette.glow : palette.grid}
      />

      <group>
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS, 112, 112]} />
          <meshPhysicalMaterial
            color={palette.core}
            roughness={0.34}
            metalness={0.12}
            clearcoat={0.92}
            clearcoatRoughness={0.18}
            reflectivity={0.68}
            emissive={theme === "dark" ? "#08131a" : "#486172"}
            emissiveIntensity={theme === "dark" ? 0.56 : 0.055}
          />
        </mesh>

        <mesh ref={landMeshRef}>
          <sphereGeometry args={[GLOBE_RADIUS + 0.007, 112, 112]} />
          <meshStandardMaterial
            map={landTexture}
            transparent
            alphaTest={0.06}
            roughness={0.58}
            metalness={0.14}
            emissive={theme === "dark" ? "#18323d" : "#7e6c4f"}
            emissiveIntensity={theme === "dark" ? 0.28 : 0.04}
          />
        </mesh>

        <mesh ref={landGlowMeshRef}>
          <sphereGeometry args={[GLOBE_RADIUS + 0.012, 112, 112]} />
          <meshBasicMaterial
            map={landTexture}
            transparent
            opacity={theme === "dark" ? 0.22 : 0.09}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {regionTexture ? (
          <mesh ref={regionHighlightMeshRef}>
            <sphereGeometry args={[GLOBE_RADIUS + 0.016, 112, 112]} />
            <meshBasicMaterial
              map={regionTexture}
              transparent
              opacity={theme === "dark" ? 0.66 : 0.54}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ) : null}

        <mesh ref={auraMeshRef}>
          <sphereGeometry args={[GLOBE_RADIUS + 0.03, 96, 96]} />
          <meshBasicMaterial
            color={palette.glow}
            transparent
            opacity={theme === "dark" ? 0.11 : 0.07}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={orbitRingRef} rotation={[Math.PI / 2.2, 0.16, 0.22]}>
          <torusGeometry args={[GLOBE_RADIUS + 0.165, 0.0045, 16, 220]} />
          <meshBasicMaterial
            color={theme === "dark" ? "#e2af6d" : "#c88a45"}
            transparent
            opacity={theme === "dark" ? 0.34 : 0.2}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS + 0.09, 84, 84]} />
          <meshBasicMaterial
            color={palette.atmosphere}
            transparent
            opacity={theme === "dark" ? 0.17 : 0.12}
            side={BackSide}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {latitudeLines.map((points, idx) => (
          <Line
            key={`lat-${idx}`}
            points={points}
            color={palette.grid}
            transparent
            opacity={theme === "dark" ? 0.27 : 0.2}
            lineWidth={0.95}
          />
        ))}

        {longitudeLines.map((points, idx) => (
          <Line
            key={`lon-${idx}`}
            points={points}
            color={palette.grid}
            transparent
            opacity={theme === "dark" ? 0.24 : 0.18}
            lineWidth={0.9}
          />
        ))}

        {markets.map((market) => (
          <MarketMarker
            key={market.id}
            id={market.id}
            position={markerPositions[market.id] ?? [0, 0, GLOBE_RADIUS]}
            selected={selectedId === market.id}
            hovered={hoveredId === market.id}
            palette={palette}
            onSelect={onSelect}
            onHover={setHoveredId}
          />
        ))}
      </group>

      <Html
        position={[activePosition[0] * 1.18, activePosition[1] * 1.18, activePosition[2] * 1.18]}
        center
        transform={false}
        style={{ pointerEvents: "none" }}
      >
        <div
          className="border px-2 py-0.5 font-semibold uppercase"
          style={{
            background: palette.labelBg,
            borderColor: palette.labelBorder,
            color: palette.labelText,
            fontSize: "9px",
            letterSpacing: "0.11em",
            lineHeight: 1.1,
            boxShadow:
              theme === "dark"
                ? "0 12px 26px -16px rgba(0,0,0,0.8)"
                : "0 12px 24px -14px rgba(18,44,59,0.36)",
          }}
        >
          {activeMarket.name}
        </div>
      </Html>

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        minDistance={2.3}
        maxDistance={4.35}
        rotateSpeed={0.52}
        zoomSpeed={0.68}
        autoRotate={false}
        enableDamping
        dampingFactor={0.065}
        minPolarAngle={MIN_POLAR}
        maxPolarAngle={MAX_POLAR}
        onStart={() => {
          if (releaseTimerRef.current !== null) {
            window.clearTimeout(releaseTimerRef.current);
            releaseTimerRef.current = null;
          }
          userOrbitingRef.current = true;
        }}
        onEnd={() => {
          if (releaseTimerRef.current !== null) {
            window.clearTimeout(releaseTimerRef.current);
          }
          releaseTimerRef.current = window.setTimeout(() => {
            userOrbitingRef.current = false;
            releaseTimerRef.current = null;
          }, 120);
        }}
      />
    </>
  );
}

function useThemeMode(): ThemeMode {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => {
      setTheme(root.dataset.theme === "light" ? "light" : "dark");
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

export default function MarketsGlobe({
  markets,
  selectedId,
  onSelect,
  onHover,
}: MarketsGlobeProps) {
  const theme = useThemeMode();
  const shellClass =
    theme === "dark"
      ? "bg-[linear-gradient(140deg,rgba(18,38,46,0.75),rgba(8,17,22,0.9))] shadow-[0_42px_70px_-42px_rgba(0,0,0,0.92)]"
      : "bg-[linear-gradient(145deg,rgba(253,251,247,0.98),rgba(236,242,245,0.96))] shadow-[0_34px_58px_-34px_rgba(21,53,68,0.24)]";

  return (
    <div className={`relative overflow-hidden border border-[var(--line-soft)] ${shellClass}`}>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
      <span className="pointer-events-none absolute -left-20 top-1/3 h-52 w-52 rounded-full bg-primary/14 blur-[72px]" />
      <span className="pointer-events-none absolute -right-16 bottom-8 h-52 w-52 rounded-full bg-[var(--color-accent)]/16 blur-[70px]" />

      <div className="relative h-[430px] w-full md:h-[590px]">
        <Canvas
          camera={{ position: [0, 0, CAMERA_DISTANCE], fov: 36, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          onPointerMissed={() => onHover?.(null)}
        >
          <GlobeScene
            markets={markets}
            selectedId={selectedId}
            onSelect={onSelect}
            onHover={onHover}
            theme={theme}
          />
        </Canvas>
      </div>

      <span
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 ${
          theme === "dark" ? "bg-gradient-to-t from-black/28 to-transparent" : "bg-gradient-to-t from-white/55 to-transparent"
        }`}
      />
    </div>
  );
}
