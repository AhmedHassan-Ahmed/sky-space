"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  Crosshair,
  Globe2,
  HelpCircle,
  Home,
  Layers,
  LocateFixed,
  LogOut,
  Map as MapIcon,
  PenTool,
  Satellite,
  Search,
  SlidersHorizontal,
  Sparkles,
  User,
} from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { api, getToken, removeToken, type UserProfile } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { altitudeToZoom, zoomToAltitude } from "@/lib/view";
import FarmPlannerModal from "@/components/FarmPlannerModal";
import TutorialOverlay from "@/components/TutorialOverlay";
import type { FlyToTarget } from "@/components/FarmMap";
import type { GlobePovTarget } from "@/components/Globe3D";
import {
  createFarmField,
  exportFieldsToGeoJSON,
} from "@/lib/geo";
import {
  fetchNasaPowerData,
  getNasaGibsLayers,
  getPastDateISO,
} from "@/lib/nasa";
import type {
  BaseMapId,
  FarmField,
  FarmerGroundInputs,
  FieldShiftEvaluation,
  LatLngPoint,
  NasaGibsLayerId,
  NasaPowerResponse,
} from "@/types/farm";

const FarmMap = dynamic(() => import("@/components/FarmMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#070B0E] text-[#8A9B93] gap-2">
      <Satellite className="w-8 h-8 animate-pulse text-[#A3E4B7]" />
      <span className="text-sm font-medium">
        Loading Interactive Satellite Map...
      </span>
    </div>
  ),
});

const Globe3D = dynamic(() => import("@/components/Globe3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070B0E] text-[#8A9B93] gap-2">
      <Globe2 className="w-9 h-9 animate-pulse text-[#A3E4B7]" />
      <span className="text-sm font-medium">Loading 3D Earth...</span>
    </div>
  ),
});

type ViewMode = "globe" | "map";
type PlannerStep = "idle" | "inputs" | "plans";

const DEFAULT_FARM_CENTER: LatLngPoint = [30.8225, 31.0187];

const DEFAULT_GROUND_INPUTS: FarmerGroundInputs = {
  waterTier: "moderate",
  waterM3PerHa: 4000,
  lastCrop: "Summer Maize (Dura Shami)",
  priority: "water-saving",
  landLocation: "Fayoum",
  landAreaFeddans: 5,
  plantingStartDate: "2026-11-15",
  irrigationMethod: "Surface Irrigation",
  waterAvailability: "Limited",
  planObjective: "Save Water",
};

export default function AgriDashboard() {
  const { lang, setLang, t } = useLanguage();

  // User Authentication state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedEvaluation, setSavedEvaluation] = useState<FieldShiftEvaluation | null>(null);

  // Clean entry: no pre-loaded sample plots so the farmer starts by marking their own land
  const [fields, setFields] = useState<FarmField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Guided 4-stage workflow & interactive tour state
  const [plannerStep, setPlannerStep] = useState<PlannerStep>("idle");
  const [isPlannerOpen, setIsPlannerOpen] = useState<boolean>(false);
  // Tour is optional by default (never pops up automatically on reload)
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [hasUsedLocationTool, setHasUsedLocationTool] = useState<boolean>(false);
  const [groundInputs, setGroundInputs] = useState<FarmerGroundInputs>(DEFAULT_GROUND_INPUTS);

  // Fetch and apply saved farmer data for the user
  const fetchAndApplyUserData = useCallback(async () => {
    try {
      const record = await api.getLatest();
      if (record && record.landLocation) {
        // 1. Restore farmer inputs
        setGroundInputs((prev) => ({
          ...prev,
          landLocation: record.landLocation || prev.landLocation,
          landAreaFeddans: Number(record.landArea) || prev.landAreaFeddans,
          lastCrop: record.lastCrop || prev.lastCrop,
          plantingStartDate: record.plantingStartDate || prev.plantingStartDate,
          irrigationMethod: record.irrigationMethod || prev.irrigationMethod,
          waterAvailability: record.waterAvailability || prev.waterAvailability,
          planObjective: record.planObjective || prev.planObjective,
        }));

        // 2. Restore engine recommendation
        if (record.recommendation) {
          setSavedEvaluation(record.recommendation);
        }

        // 3. Restore field on map
        let coords: LatLngPoint[] = [];
        if (Array.isArray(record.coordinates) && record.coordinates.length >= 3) {
          coords = record.coordinates as LatLngPoint[];
        } else if (typeof record.lat === "number" && typeof record.lon === "number") {
          const d = 0.0015;
          coords = [
            [record.lat - d, record.lon - d],
            [record.lat - d, record.lon + d],
            [record.lat + d, record.lon + d],
            [record.lat + d, record.lon - d],
          ];
        }

        if (coords.length >= 3) {
          const restoredField = createFarmField(
            `${record.landLocation} Farm (${record.landArea || 5} Feddans)`,
            "Corn",
            coords,
            0
          );
          setFields([restoredField]);
          setSelectedFieldId(restoredField.id);
          setFlyToTarget({
            center: restoredField.centroid,
            zoom: 15,
            key: Date.now(),
          });
          setViewMode("map");
          setIsWelcomeOpen(false);
        }
      }
    } catch {
      // New user without prior records; proceed smoothly
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      api
        .getMe()
        .then((u) => {
          setUser(u);
          fetchAndApplyUserData();
        })
        .catch(() => {
          removeToken();
          setUser(null);
        });
    }
  }, [fetchAndApplyUserData]);

  const handleAuthSuccess = useCallback(
    (loggedInUser: UserProfile) => {
      setUser(loggedInUser);
      setIsAuthModalOpen(false);
      fetchAndApplyUserData();
    },
    [fetchAndApplyUserData]
  );

  const handleLogout = useCallback(() => {
    removeToken();
    setUser(null);
    setSavedEvaluation(null);
  }, []);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [draftPoints, setDraftPoints] = useState<LatLngPoint[]>([]);

  // Map & NASA GIBS overlay state
  const [baseMap, setBaseMap] = useState<BaseMapId>("satellite");
  const [gibsLayer, setGibsLayer] = useState<NasaGibsLayerId>("none");
  const [gibsDate, setGibsDate] = useState<string>("2026-11-01");
  const [maxGibsDate, setMaxGibsDate] = useState<string>("2026-11-10");
  const [gibsOpacity, setGibsOpacity] = useState<number>(0.72);
  const [showLayerPanel, setShowLayerPanel] = useState<boolean>(false);
  const [flyToTarget, setFlyToTarget] = useState<FlyToTarget | null>(null);

  // Welcome hero overlay & 3D globe <-> 2D Leaflet map handoff
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(true);
  const [globePovTarget, setGlobePovTarget] = useState<GlobePovTarget | null>(
    null
  );
  const [viewMode, setViewMode] = useState<ViewMode>("globe");
  const [mapView, setMapView] = useState<{ center: LatLngPoint; zoom: number }>({
    center: DEFAULT_FARM_CENTER,
    zoom: 15,
  });
  const [globeView, setGlobeView] = useState<{
    center: LatLngPoint;
    altitude: number;
  }>({
    center: DEFAULT_FARM_CENTER,
    altitude: 2.55,
  });

  const pendingFlyRef = useRef<FlyToTarget | null>(null);
  const viewModeRef = useRef<ViewMode>("globe");
  const globePovRef = useRef<{ center: LatLngPoint; altitude: number } | null>(
    null
  );
  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  const enterMap = useCallback((center: LatLngPoint, zoom: number) => {
    const pending = pendingFlyRef.current;
    pendingFlyRef.current = null;
    setMapView({ center, zoom });
    setFlyToTarget(pending ? { ...pending, key: Date.now() } : null);
    setViewMode("map");
  }, []);

  const enterGlobe = useCallback((center: LatLngPoint, zoom: number) => {
    const altitude = Math.max(zoomToAltitude(zoom), 0.9);
    setFlyToTarget(null);
    globePovRef.current = { center, altitude };
    setGlobeView({ center, altitude });
    setViewMode("globe");
  }, []);

  /** Fly to a location in whichever view is active (globe flies in, then hands off). */
  const flyTo = useCallback((center: LatLngPoint, zoom: number) => {
    const target: FlyToTarget = { center, zoom, key: Date.now() };
    if (viewModeRef.current === "globe") pendingFlyRef.current = target;
    setFlyToTarget(target);
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);

  // NASA POWER state
  const [nasaData, setNasaData] = useState<NasaPowerResponse | null>(null);
  const [isLoadingNasa, setIsLoadingNasa] = useState(false);

  // Hydrate dynamic GIBS date bounds cleanly on client mount
  useEffect(() => {
    setGibsDate(getPastDateISO(10));
    setMaxGibsDate(getPastDateISO(2));
  }, []);

  const fieldsRef = useRef(fields);
  useEffect(() => {
    fieldsRef.current = fields;
  }, [fields]);

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedFieldId) ?? null,
    [fields, selectedFieldId]
  );

  // Fetch NASA POWER data whenever the marked field centroid changes
  const centroidKey = selectedField
    ? `${selectedField.centroid[0].toFixed(4)},${selectedField.centroid[1].toFixed(4)}`
    : null;

  useEffect(() => {
    if (!centroidKey) {
      setNasaData(null);
      return;
    }
    const [lat, lng] = centroidKey.split(",").map(Number);

    let cancelled = false;
    setIsLoadingNasa(true);

    fetchNasaPowerData(lat, lng).then((res) => {
      if (!cancelled) {
        setNasaData(res);
        setIsLoadingNasa(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [centroidKey]);

  const gibsLayers = useMemo(() => getNasaGibsLayers(gibsDate), [gibsDate]);

  const handleEnterFromWelcome = useCallback(() => {
    const targetCenter =
      fieldsRef.current.find((f) => f.id === selectedFieldId)?.centroid ??
      DEFAULT_FARM_CENTER;
    setIsWelcomeOpen(false);
    setViewMode("globe");
    setIsTutorialOpen(true);
    setGlobePovTarget({
      center: targetCenter,
      altitude: 1.45,
      durationMs: 1400,
      autoRotate: true,
      key: Date.now(),
    });
  }, [selectedFieldId]);

  const handleReturnToWelcome = useCallback(() => {
    const targetCenter =
      fieldsRef.current.find((f) => f.id === selectedFieldId)?.centroid ??
      DEFAULT_FARM_CENTER;
    setIsDrawing(false);
    setDraftPoints([]);
    setIsPlannerOpen(false);
    setIsTutorialOpen(true);
    setFlyToTarget(null);
    setGlobeView({ center: targetCenter, altitude: 2.55 });
    setViewMode("globe");
    setIsWelcomeOpen(true);
    setGlobePovTarget({
      center: targetCenter,
      altitude: 2.55,
      durationMs: 1200,
      autoRotate: true,
      key: Date.now(),
    });
  }, [selectedFieldId]);

  const handleSelectField = useCallback(
    (id: string) => {
      setSelectedFieldId(id);
      const target = fieldsRef.current.find((f) => f.id === id);
      if (target) flyTo(target.centroid, 15);
    },
    [flyTo]
  );

  const handleGlobeViewChange = useCallback(
    (center: LatLngPoint, altitude: number) => {
      globePovRef.current = { center, altitude };
    },
    []
  );

  const handleStartDrawing = useCallback(() => {
    setIsPlannerOpen(false);
    setDraftPoints([]);
    setIsDrawing(true);
    if (viewModeRef.current === "globe") {
      const pov = globePovRef.current;
      const sel = fieldsRef.current.find((f) => f.id === selectedFieldId);
      const center: LatLngPoint =
        pov && pov.altitude < 0.6
          ? pov.center
          : sel?.centroid ?? globeView.center;
      flyTo(
        center,
        pov && pov.altitude < 0.6
          ? Math.max(altitudeToZoom(pov.altitude), 15)
          : 16
      );
    }
  }, [flyTo, globeView.center, selectedFieldId]);

  const handleAddDraftPoint = useCallback((point: LatLngPoint) => {
    setDraftPoints((prev) => [...prev, point]);
  }, []);

  const handleUndoDraftPoint = useCallback(() => {
    setDraftPoints((prev) => prev.slice(0, -1));
  }, []);

  const handleClearDraft = useCallback(() => {
    setDraftPoints([]);
  }, []);

  const handleFinishDrawing = useCallback(() => {
    if (draftPoints.length < 3) return;
    const newField = createFarmField(
      "My Farm Field",
      "Wheat",
      draftPoints,
      fieldsRef.current.length
    );
    setFields([newField]);
    setSelectedFieldId(newField.id);
    setIsDrawing(false);
    setDraftPoints([]);
    setPlannerStep("inputs");
    setIsPlannerOpen(true);
  }, [draftPoints]);

  const handleCancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setDraftPoints([]);
  }, []);

  const handleQuickDemoField = useCallback(() => {
    const base =
      viewModeRef.current === "globe"
        ? globePovRef.current?.center ?? globeView.center
        : mapView.center;
    const dLat = 0.0032;
    const dLng = 0.004;
    const corners: LatLngPoint[] = [
      [base[0] + dLat, base[1] - dLng],
      [base[0] + dLat, base[1] + dLng],
      [base[0] - dLat, base[1] + dLng],
      [base[0] - dLat, base[1] - dLng],
    ];
    const demoField = createFarmField("Sample Farm Field", "Wheat", corners, 0);
    setFields([demoField]);
    setSelectedFieldId(demoField.id);
    setIsDrawing(false);
    setDraftPoints([]);
    setPlannerStep("inputs");
    setIsPlannerOpen(true);
  }, [globeView.center, mapView.center]);

  const handleUpdateFieldName = useCallback(
    (name: string) => {
      if (!selectedFieldId) return;
      setFields((prev) =>
        prev.map((f) => (f.id === selectedFieldId ? { ...f, name } : f))
      );
    },
    [selectedFieldId]
  );

  const handleExportGeoJSON = useCallback(() => {
    exportFieldsToGeoJSON(fieldsRef.current);
  }, []);

  const runLocationSearch = useCallback(
    async (rawQuery: string) => {
      const q = rawQuery.trim();
      if (!q) return;

      setHasUsedLocationTool(true);
      setSearchQuery(q);
      setIsSearching(true);
      setSearchMessage(null);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
            q
          )}`
        );
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          flyTo([lat, lon], 14);
        } else {
          setSearchMessage("Location not found. Try a village or city name.");
        }
      } catch {
        setSearchMessage("Search unavailable right now.");
      } finally {
        setIsSearching(false);
      }
    },
    [flyTo]
  );

  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault();
    void runLocationSearch(searchQuery);
  };

  const handleFlyToCoords = useCallback(
    (lat: number, lng: number) => {
      setHasUsedLocationTool(true);
      setSearchMessage(null);
      flyTo([lat, lng], 15);
    },
    [flyTo]
  );

  const handleLocateMe = useCallback(() => {
    setHasUsedLocationTool(true);
    if (!navigator.geolocation) {
      setSearchMessage("GPS is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        flyTo([pos.coords.latitude, pos.coords.longitude], 16);
      },
      () => {
        setSearchMessage("Could not access your GPS location.");
      }
    );
  }, [flyTo]);

  const activeHeaderStep: 1 | 2 | 3 =
    !selectedField || isDrawing || plannerStep === "idle"
      ? 1
      : plannerStep === "inputs"
        ? 2
        : 3;

  return (
    <div className="relative h-dvh w-screen flex flex-col bg-[#070B0E] text-[#F2F7F4] overflow-hidden">
      {/* Top Navigation Bar (Guided 3-Step Flow Header — No Sidebar) */}
      <header
        className={`shrink-0 bg-[#0B1015]/95 backdrop-blur-xl border-white/10 px-4 flex items-center justify-between gap-3 z-20 transition-all duration-500 ease-out ${
          isWelcomeOpen
            ? "-translate-y-full opacity-0 pointer-events-none h-0 border-0 overflow-hidden"
            : "translate-y-0 opacity-100 h-14 border-b"
        }`}
      >
        {/* Left: Brand + Home */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <img
              src="/logo.svg"
              alt="Sky Space Logo"
              className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(163,228,183,0.35)]"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-[#F2F7F4] leading-tight tracking-wide">
              {t("nav.brand")}
            </h1>
            <p className="text-[10px] text-[#8A9B93] font-medium">
              {t("nav.brandSub")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleReturnToWelcome}
            title={t("nav.home")}
            className="ml-1 inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full border border-white/10 bg-[#121A21] hover:bg-[#19242E] text-[#F2F7F4] text-xs font-medium transition"
          >
            <Home className="w-3.5 h-3.5 text-[#A3E4B7]" />
            <span className="hidden xl:inline">{t("nav.home")}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsTutorialOpen((prev) => !prev)}
            title="Interactive Guided Tour"
            className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full border text-xs font-semibold transition ${
              isTutorialOpen
                ? "bg-[#A3E4B7] text-[#070B0E] border-[#A3E4B7]"
                : "border-[#A3E4B7]/35 bg-[#A3E4B7]/10 hover:bg-[#A3E4B7]/20 text-[#A3E4B7]"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("nav.tour")}</span>
          </button>
          {/* Language Toggle */}
          <div className="inline-flex items-center rounded-full border border-white/10 bg-[#121A21] overflow-hidden text-[10px] font-bold shrink-0">
            <button
              type="button"
              onClick={() => setLang("ar")}
              className={`px-2.5 py-1 transition ${lang === "ar" ? "bg-[#A3E4B7] text-[#070B0E]" : "text-[#8A9B93] hover:text-[#F2F7F4]"}`}
            >
              AR
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 transition ${lang === "en" ? "bg-[#A3E4B7] text-[#070B0E]" : "text-[#8A9B93] hover:text-[#F2F7F4]"}`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Center-Left: 3-Step Workflow Progress Indicator (Desktop only) */}
        <nav
          data-tour="step-progress"
          aria-label="Farm planning steps"
          className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-full bg-[#111920] border border-white/[0.08] text-[11px] font-semibold shrink-0"
        >
          <span
            className={`px-2 py-0.5 rounded-full transition ${
              activeHeaderStep === 1
                ? "bg-[#A3E4B7]/20 text-[#A3E4B7]"
                : "text-[#8A9B93]"
            }`}
          >
            {t("nav.step1")}
          </span>
          <span className="text-white/20">&rsaquo;</span>
          <button
            type="button"
            disabled={!selectedField}
            onClick={() => {
              if (!selectedField) return;
              setPlannerStep("inputs");
              setIsPlannerOpen(true);
            }}
            className={`px-2 py-0.5 rounded-full transition disabled:opacity-45 ${
              activeHeaderStep === 2
                ? "bg-[#A3E4B7]/20 text-[#A3E4B7]"
                : "text-[#8A9B93] hover:text-[#F2F7F4]"
            }`}
          >
            {t("nav.step2")}
          </button>
          <span className="text-white/20">&rsaquo;</span>
          <button
            type="button"
            disabled={!selectedField}
            onClick={() => {
              if (!selectedField) return;
              setPlannerStep("plans");
              setIsPlannerOpen(true);
            }}
            className={`px-2 py-0.5 rounded-full transition disabled:opacity-45 ${
              activeHeaderStep === 3
                ? "bg-[#A3E4B7]/20 text-[#A3E4B7]"
                : "text-[#8A9B93] hover:text-[#F2F7F4]"
            }`}
          >
            {t("nav.step3")}
          </button>
        </nav>

        {/* Location Search */}
        <form
          data-tour="location-search"
          onSubmit={handleSearchLocation}
          className="flex-1 min-w-[110px] max-w-xs sm:max-w-sm flex items-center gap-1 sm:gap-1.5"
        >
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#8A9B93] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("nav.search")}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-[#121A21] border border-white/10 text-[#F2F7F4] placeholder:text-[#64766E] rounded-full focus:bg-[#162028] focus:outline-none focus:ring-2 focus:ring-[#A3E4B7]/40 transition"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold bg-[#162028] hover:bg-[#1E2B35] border border-white/10 text-[#F2F7F4] rounded-full transition disabled:opacity-50"
          >
            {isSearching ? "..." : t("nav.go")}
          </button>
          <button
            type="button"
            onClick={handleLocateMe}
            title="Jump to my current location"
            className="p-1.5 rounded-full border border-white/10 bg-[#121A21] hover:bg-[#19242E] text-[#A3E4B7] transition"
          >
            <LocateFixed className="w-4 h-4" />
          </button>
        </form>

        {/* Primary Action: Mark My Field & Account */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {searchMessage && (
            <span className="text-[11px] text-rose-400 hidden xl:inline">
              {searchMessage}
            </span>
          )}
          <button
            data-tour="mark-field-btn"
            type="button"
            onClick={isDrawing ? handleCancelDrawing : handleStartDrawing}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition ${
              isDrawing
                ? "bg-amber-400 hover:bg-amber-300 text-[#070B0E]"
                : "bg-white hover:bg-[#A3E4B7] text-[#070B0E]"
            }`}
          >
            {isDrawing ? (
              <>
                <Crosshair className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("nav.drawing")}</span>
              </>
            ) : (
              <>
                <PenTool className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("nav.markField")}</span>
              </>
            )}
          </button>

          {/* User Account / Auth Button */}
          {user ? (
            <div className="flex items-center gap-1 bg-[#121A21] border border-white/10 rounded-full px-2.5 sm:px-3 py-1">
              <span className="text-xs font-semibold text-[#A3E4B7] flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[70px] sm:max-w-[110px] truncate">{user.name.split(" ")[0]}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                title={t("nav.signOut")}
                className="text-[#8A9B93] hover:text-rose-400 transition ml-0.5 p-0.5"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/15 bg-[#121A21] hover:bg-[#19242E] text-xs font-semibold text-[#F2F7F4] transition shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-[#A3E4B7]" />
              <span className="hidden sm:inline">{t("nav.signIn")}</span>
            </button>
          )}
        </div>
      </header>

      {/* Full-Screen Interactive Globe / 2D Map Stage (No Sidebar Dashboard) */}
      <main className="relative flex-1 w-full h-full min-h-0 overflow-hidden bg-[#070B0E]">
        {/* Persistent 3D Globe Layer with cross-fade & zoom transition */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-out ${
            viewMode === "globe"
              ? "opacity-100 scale-100 z-10 pointer-events-auto"
              : "opacity-0 scale-110 z-0 pointer-events-none"
          }`}
        >
          <Globe3D
            isActive={viewMode === "globe"}
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={handleSelectField}
            initialView={globeView}
            flyToTarget={flyToTarget}
            povTarget={globePovTarget}
            onZoomIntoMap={enterMap}
            onViewChange={handleGlobeViewChange}
          />
        </div>

        {/* Persistent 2D Leaflet Map Layer with cross-fade & scale transition */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            viewMode === "map"
              ? "opacity-100 scale-100 z-20 pointer-events-auto"
              : "opacity-0 scale-95 z-0 pointer-events-none"
          }`}
        >
          <FarmMap
            isActive={viewMode === "map"}
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={handleSelectField}
            isDrawing={isDrawing}
            draftPoints={draftPoints}
            onAddDraftPoint={handleAddDraftPoint}
            onUndoDraftPoint={handleUndoDraftPoint}
            onClearDraft={handleClearDraft}
            onFinishDrawing={handleFinishDrawing}
            onCancelDrawing={handleCancelDrawing}
            baseMap={baseMap}
            gibsLayer={gibsLayer}
            gibsDate={gibsDate}
            gibsOpacity={gibsOpacity}
            flyToTarget={flyToTarget}
            initialView={mapView}
            onZoomOutToGlobe={enterGlobe}
          />
        </div>

        {/* 3D Earth / 2D Map Toggle */}
        <div
          data-tour="view-switcher"
          className={`absolute top-3 left-1/2 -translate-x-1/2 z-[450] flex items-center gap-1 p-1 rounded-full bg-[#0D1318]/90 backdrop-blur-xl border border-white/10 shadow-xl transition-opacity ${
            isWelcomeOpen
              ? "opacity-0 pointer-events-none duration-500"
              : "opacity-100 duration-700"
          }`}
        >
          <button
            type="button"
            disabled={isDrawing}
            onClick={() => {
              if (viewMode === "globe") return;
              setHasUsedLocationTool(true);
              enterGlobe(selectedField?.centroid ?? mapView.center, 3);
            }}
            aria-pressed={viewMode === "globe"}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition disabled:opacity-40 ${
              viewMode === "globe"
                ? "bg-white text-[#070B0E]"
                : "text-[#8A9B93] hover:text-[#F2F7F4]"
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            {t("dash.earth3d")}
          </button>
          <button
            type="button"
            onClick={() => {
              if (viewMode === "map") return;
              setHasUsedLocationTool(true);
              const pov = globePovRef.current;
              if (pov && pov.altitude < 0.6) {
                flyTo(
                  pov.center,
                  Math.max(altitudeToZoom(pov.altitude), 12)
                );
              } else if (selectedField) {
                flyTo(selectedField.centroid, 15);
              } else {
                enterMap(globeView.center, 15);
              }
            }}
            aria-pressed={viewMode === "map"}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              viewMode === "map"
                ? "bg-white text-[#070B0E]"
                : "text-[#8A9B93] hover:text-[#F2F7F4]"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            {t("dash.map2d")}
          </button>
        </div>

        {/* Floating Bottom Guidance Bar — Stage 2 (Bottom-Left away from Quick Practice) */}
        {!isWelcomeOpen && !isDrawing && !selectedField && !isTutorialOpen && (
          <div className="absolute bottom-4 left-4 z-[450] w-[calc(100%-2rem)] max-w-lg px-4 py-3 rounded-2xl bg-[#0D1318]/92 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-wrap items-center justify-between gap-2.5">
            <div className="min-w-[180px] flex-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A3E4B7]">
                {t("dash.step1Title")}
              </div>
              <p className="text-xs text-[#C7D4CD] mt-0.5">
                {viewMode === "globe"
                  ? t("dash.step1DescGlobe")
                  : t("dash.step1DescMap")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleQuickDemoField}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/15 bg-[#121A21] hover:bg-[#19242E] text-xs font-semibold text-[#C7D4CD] transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#A3E4B7]" />
                {t("dash.demoField")}
              </button>
              <button
                type="button"
                onClick={handleStartDrawing}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#A3E4B7] text-[#070B0E] text-xs font-bold transition"
              >
                <PenTool className="w-3.5 h-3.5" />
                {t("dash.markMyField")}
              </button>
            </div>
          </div>
        )}

        {/* Floating Bottom Field Bar — Bottom-Left away from Quick Practice */}
        {!isWelcomeOpen &&
          !isDrawing &&
          selectedField &&
          !isPlannerOpen &&
          !isTutorialOpen && (
            <div className="absolute bottom-4 left-4 z-[450] w-[calc(100%-2rem)] max-w-md px-4 py-3 rounded-2xl bg-[#0D1318]/92 backdrop-blur-xl border border-[#A3E4B7]/35 shadow-2xl flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A3E4B7]">
                  {t("dash.markedReady")}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#F2F7F4]">
                  {selectedField.name} &bull;{" "}
                  <span className="text-[#A3E4B7]">
                    {selectedField.areaHectares.toFixed(2)} ha
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleStartDrawing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/10 bg-[#121A21] hover:bg-[#19242E] text-xs font-semibold text-[#C7D4CD] transition"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  {t("dash.markNew")}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlannerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#A3E4B7] text-[#070B0E] text-xs font-bold transition"
                >
                  {plannerStep === "plans"
                    ? t("dash.openCropPlan")
                    : t("dash.openInputs")}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        {/* Floating NASA Layers & Base Map Control (Top Right) — 2D map only */}
        {viewMode === "map" && (
          <div className="absolute top-3 right-3 z-[400] flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={() => setShowLayerPanel((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0D1318]/92 backdrop-blur-xl border border-white/10 shadow-lg text-xs font-semibold text-[#F2F7F4] hover:border-[#A3E4B7]/40 transition"
            >
              <Layers className="w-3.5 h-3.5 text-[#A3E4B7]" />
              {t("dash.layersBtn")}
            </button>

            {showLayerPanel && (
              <div className="w-64 bg-[#0D1318]/92 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3 space-y-3 text-[#F2F7F4]">
                {/* Base Map Toggle */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A9B93] mb-1.5 flex items-center gap-1">
                    <MapIcon className="w-3 h-3" />
                    {t("dash.baseMap")}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBaseMap("satellite")}
                      className={`py-1.5 rounded-xl text-xs font-semibold border transition ${
                        baseMap === "satellite"
                          ? "bg-white text-[#070B0E] border-white"
                          : "bg-[#121A21] text-[#8A9B93] border-white/10 hover:text-[#F2F7F4]"
                      }`}
                    >
                      {t("dash.satellite")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBaseMap("street")}
                      className={`py-1.5 rounded-xl text-xs font-semibold border transition ${
                        baseMap === "street"
                          ? "bg-white text-[#070B0E] border-white"
                          : "bg-[#121A21] text-[#8A9B93] border-white/10 hover:text-[#F2F7F4]"
                      }`}
                    >
                      {t("dash.street")}
                    </button>
                  </div>
                </div>

                {/* NASA GIBS Satellite Overlays */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A9B93] mb-1.5 flex items-center gap-1">
                    <Satellite className="w-3 h-3 text-sky-400" />
                    {t("dash.nasaGibs")}
                  </div>
                  <div className="space-y-1">
                    {gibsLayers.map((layer) => (
                      <button
                        key={layer.id}
                        type="button"
                        onClick={() => setGibsLayer(layer.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center justify-between ${
                          gibsLayer === layer.id
                            ? "bg-[#A3E4B7]/20 border-[#A3E4B7] text-[#A3E4B7]"
                            : "bg-[#121A21] border-white/10 text-[#8A9B93] hover:text-[#F2F7F4]"
                        }`}
                      >
                        <span>
                          {layer.id === "none"
                            ? (lang === "ar" ? "بدون طبقة قمر صناعي" : "No Satellite Overlay")
                            : layer.id === "ndvi"
                            ? (lang === "ar" ? "صحة الغطاء النباتي (NDVI)" : "NASA MODIS NDVI")
                            : layer.id === "true-color"
                            ? (lang === "ar" ? "ألوان طبيعية عالية الدقة" : "True Color Surface")
                            : layer.id === "soil-moisture"
                            ? (lang === "ar" ? "رطوبة التربة (SMAP)" : "SMAP Soil Moisture")
                            : layer.id === "lst-day"
                            ? (lang === "ar" ? "درجة حرارة سطح الأرض" : "Land Surface Temp")
                            : layer.label}
                        </span>
                        {gibsLayer === layer.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A3E4B7]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layer Opacity Slider */}
                {gibsLayer !== "none" && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A9B93] mb-1 flex items-center justify-between">
                      <span>{t("dash.opacity")}</span>
                      <span>{Math.round(gibsOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={gibsOpacity}
                      onChange={(e) => setGibsOpacity(parseFloat(e.target.value))}
                      className="w-full accent-[#A3E4B7] cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Interactive Spotlight Guided Tour & Quick Practice Checklist */}
      <TutorialOverlay
        isOpen={isTutorialOpen}
        onToggle={setIsTutorialOpen}
        isWelcomeOpen={isWelcomeOpen}
        hasUsedLocationTool={hasUsedLocationTool}
        hasMarkedField={Boolean(selectedField)}
        hasGeneratedPlan={plannerStep === "plans"}
        onEnterFromWelcome={handleEnterFromWelcome}
        onSearchLocation={(q) => void runLocationSearch(q)}
        onLocateMe={handleLocateMe}
        onFlyToCoords={handleFlyToCoords}
        onStartDrawing={handleStartDrawing}
        onQuickDemoField={handleQuickDemoField}
      />

      {/* Stage 3 & Stage 4 Modal: Farmer Ground-Truth Inputs -> Generated Crop Cycle Plans */}
      {selectedField && plannerStep !== "idle" && (
        <FarmPlannerModal
          isOpen={isPlannerOpen}
          step={plannerStep}
          field={selectedField}
          inputs={groundInputs}
          onChangeInputs={setGroundInputs}
          onUpdateFieldName={handleUpdateFieldName}
          onGeneratePlans={() => setPlannerStep("plans")}
          onBackToInputs={() => setPlannerStep("inputs")}
          onMinimizeToMap={() => setIsPlannerOpen(false)}
          onRedrawField={handleStartDrawing}
          onExportGeoJSON={handleExportGeoJSON}
          nasaData={nasaData}
          isLoadingNasa={isLoadingNasa}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          savedEvaluation={savedEvaluation}
        />
      )}

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Stage 1: Welcome Home Screen Overlay — NOVA aesthetic */}
      <section
        aria-label="Welcome to Sky Space"
        aria-hidden={!isWelcomeOpen}
        className={`fixed inset-0 z-[500] flex flex-col items-center justify-center px-6 text-center transition-all duration-700 ease-out ${
          isWelcomeOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-105 pointer-events-none"
        }`}
        style={{
          background:
            "radial-gradient(circle at center, rgba(7, 11, 14, 0.22) 0%, rgba(7, 11, 14, 0.88) 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 sm:gap-5">
          {/* Sky Space Brand Logo & Aura */}
          <div className="relative group">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#A3E4B7] to-cyan-400 opacity-25 blur-2xl group-hover:opacity-45 transition duration-500" />
            <img
              src="/logo.svg"
              alt="Sky Space Logo"
              className="relative w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-[0_0_25px_rgba(163,228,183,0.4)]"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10181F]/80 border border-white/10 text-[#A3E4B7] text-[11px] font-semibold tracking-[0.2em] uppercase backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A3E4B7] animate-pulse" />
            Sky Space &bull; Earth &amp; Agriculture Intelligence
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F2F7F4] drop-shadow-lg leading-[1.06]">
            SKY SPACE.
            <br />
            <span className="text-[#A3E4B7]">CULTIVATE.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#9DB0A7] max-w-xl leading-relaxed drop-shadow">
            Welcome to{" "}
            <span className="text-[#F2F7F4] font-semibold">Sky Space</span>{" "}
            — mark your farm boundary on the 3D Earth, enter your ground parameters,
            and calculate optimal crop rotations backed by satellite observation.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              data-tour="welcome-cta"
              type="button"
              onClick={handleEnterFromWelcome}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white hover:bg-[#A3E4B7] text-[#070B0E] text-xs sm:text-sm font-bold uppercase tracking-[0.14em] shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#A3E4B7]/60"
            >
              <Globe2 className="w-4 h-4" />
              View 3D Earth
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
