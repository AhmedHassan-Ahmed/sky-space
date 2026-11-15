"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Droplets,
  Eye,
  Flame,
  Info,
  Layers,
  Leaf,
  Loader2,
  Lock,
  MapPin,
  PenTool,
  RotateCcw,
  Satellite,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Sun,
  Thermometer,
  User,
  Wheat,
  Wind,
  X,
} from "lucide-react";
import { api, type UserProfile, type FarmerSubmissionPayload } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import type {
  FarmField,
  FarmerGroundInputs,
  FieldShiftEvaluation,
  NasaPowerResponse,
} from "@/types/farm";

interface FarmPlannerModalProps {
  isOpen: boolean;
  step: "inputs" | "plans";
  field: FarmField;
  inputs: FarmerGroundInputs;
  onChangeInputs: (next: FarmerGroundInputs) => void;
  onUpdateFieldName: (name: string) => void;
  onGeneratePlans: () => void;
  onBackToInputs: () => void;
  onMinimizeToMap: () => void;
  onRedrawField: () => void;
  onExportGeoJSON: () => void;
  nasaData: NasaPowerResponse | null;
  isLoadingNasa: boolean;
  user?: UserProfile | null;
  onOpenAuth?: () => void;
  savedEvaluation?: FieldShiftEvaluation | null;
}

const EGYPT_CROPS = [
  { id: "maize", name: "Summer Maize (Dura Shami)", season: "Seifi" },
  { id: "sorghum", name: "Grain/Forage Sorghum (Dura Rafia)", season: "Seifi" },
  { id: "soybean", name: "Soybean (Foul Soya)", season: "Seifi" },
  { id: "sesame", name: "Sesame (Semsem)", season: "Seifi" },
  { id: "wheat", name: "Wheat (Qamh)", season: "Shitwi" },
  { id: "berseem", name: "Egyptian Clover (Berseem)", season: "Shitwi" },
  { id: "faba_bean", name: "Faba Bean (Foul Baladi)", season: "Shitwi" },
  { id: "sugar_beet", name: "Sugar Beet (Bangar El-Sokkar)", season: "Shitwi" },
];

const GLOSSARY_DATA = [
  {
    key: "evapotranspiration",
    symbol: "ET₀",
    nameEn: "Evapotranspiration (ET₀)",
    nameAr: "البخر-نتح (معدل عطش واستهلاك المية)",
    simpleConceptEn: "Water lost to atmosphere from soil and plants (mm/day).",
    simpleConceptAr: "كمية المية اللي الأرض والزرع بيفقدوها في الجو بسبب الحر والشمس والهوا.",
    farmerExplanationEn:
      "Measures daily crop thirst in millimeters. High ET₀ means sun and wind are pulling water rapidly from your field, requiring timely irrigation to prevent wilting.",
    farmerExplanationAr:
      "بتقيس عطش الزرع بالمليمتر كل يوم؛ كل ما الرقم ده يعلى، معناه إن الشمس والهوا بيسحبوا المية بسرعة من الغيط، والزرع محتاج ري في ميعاده عشان ميعطش.",
    unit: "mm/day",
  },
  {
    key: "ndvi",
    symbol: "NDVI",
    nameEn: "Vegetation Index (NDVI)",
    nameAr: "مؤشر الغطاء النباتي (خضار وحيوية الزرع)",
    simpleConceptEn: "Satellite greenness and crop canopy health (0.0 to 1.0).",
    simpleConceptAr: "مقياس لقوة خضار وصحة أوراق الزرع من صور القمر الصناعي.",
    farmerExplanationEn:
      "Calculated from reflected sunlight. Values below 0.20 indicate bare or dry soil; values above 0.60 show dense, healthy, thriving crop foliage.",
    farmerExplanationAr:
      "بيتحسب من انعكاس الشمس على الورق؛ لو أقل من ٠.٢٠ يبقى الأرض بور أو مكشوفة للشمس، ولو عدى ٠.٦٠ يبقى الغيط مخضر ومزدهر وصحته كويسة جداً.",
    unit: "ratio (0 to 1)",
  },
  {
    key: "soilMoistureAnomaly",
    symbol: "GWETROOT",
    nameEn: "Soil Moisture Anomaly",
    nameAr: "شذوذ رطوبة التربة في الجذور",
    simpleConceptEn: "Root-zone water comparison vs 10-year historical average.",
    simpleConceptAr: "مقارنة رطوبة الأرض في عمق الجذور بمتوسط السنين اللي فاتت في نفس التوقيت.",
    farmerExplanationEn:
      "Indicates whether root-zone moisture is wetter or drier than usual for this time of year, helping adjust irrigation before water stress sets in.",
    farmerExplanationAr:
      "بيعرفك هل الأرض في عمق الجذور أشد جفافاً أو أزيد رطوبة من المعتاد في الوقت ده من السنة، عشان تظبط نوبات الري قبل ما الزرع يتأثر.",
    unit: "saturation index (0 to 1)",
  },
  {
    key: "bareSoilWindow",
    symbol: "Bare-Run",
    nameEn: "Bare-Field Vulnerability Window",
    nameAr: "فترة خلو وانكشاف الأرض بين العروات",
    simpleConceptEn: "Days where field is left unplanted without vegetative cover.",
    simpleConceptAr: "الأيام اللي الأرض بتقعد فيها فاضية ومكشوفة للشمس بين حصاد عروة وزراعة اللي بعدها.",
    farmerExplanationEn:
      "Leaving soil bare under hot sun breaks down organic carbon and accelerates moisture evaporation. Sowing quick cover crops like Berseem Fahl protects topsoil fertility.",
    farmerExplanationAr:
      "لما الأرض تقعد فاضية تحت الشمس المحرقة، المادة العضوية بتتفكك والرطوبة بتتبخر في الهوا. زراعة غطاء سريع زي البرسيم الفحل أو اللوبيا بيحمي الأرض ويزود غلتها.",
    unit: "days",
  },
  {
    key: "nitrogenFixation",
    symbol: "N-Fix",
    nameEn: "Biological Nitrogen Fixation",
    nameAr: "تثبيت النيتروجين الحيوي (خصوبة طبيعية)",
    simpleConceptEn: "Legumes capturing atmospheric nitrogen to feed the soil.",
    simpleConceptAr: "قدرة البقوليات إنها تسحب النيتروجين من الهوا وتخزنه كسماد طبيعي في الأرض.",
    farmerExplanationEn:
      "Legumes (clover, cowpea, soybeans) host friendly root bacteria that produce natural nitrogen, slashing your chemical fertilizer and urea bills for the following crop.",
    farmerExplanationAr:
      "محاصيل زي البرسيم واللوبيا والصويا فيها بكتيريا نافعة في الجذور بتسحب النيتروجين من الجو وتثبته في الطين، فتوفر عليك شكاير الكيماوي واليوريا للمحصول اللي جاي.",
    unit: "kg N/feddan balance",
  },
  {
    key: "salinityEce",
    symbol: "ECe",
    nameEn: "Soil Salinity (ECe)",
    nameAr: "ملوحة التربة المعملية (ECe)",
    simpleConceptEn: "Laboratory salt concentration in saturated soil extract (dS/m).",
    simpleConceptAr: "درجة ملوحة الطين في المعمل؛ بتوضح مدى صعوبة امتصاص الجذور للمية.",
    farmerExplanationEn:
      "Values above 4 dS/m create osmotic resistance, making it hard for crop roots to absorb water even in wet soil. Requires salt-tolerant varieties and leaching.",
    farmerExplanationAr:
      "لو الرقم عدى ٤ ديسيسيمنز/متر، الملوحة بتمسك المية وتمنع الجذور تشرب بسهولة حتى لو الأرض مروية؛ ساعتها بنحتاج نزرع محاصيل تستحمل الملوحة ونغسل الأرض.",
    unit: "dS/m",
  },
  {
    key: "heatStressDays",
    symbol: "Tmax > 38°C",
    nameEn: "Heat Stress Days",
    nameAr: "أيام القيظ والإجهاد الحراري",
    simpleConceptEn: "Days with maximum air temperature exceeding 38°C.",
    simpleConceptAr: "عدد أيام الصيف الشديدة اللي الحرارة فيها بتعدي ٣٨ درجة مئوية.",
    farmerExplanationEn:
      "Extreme heat burns pollen, stunts flower setting, and drastically spikes water loss. Requires early morning or nocturnal irrigation cycles.",
    farmerExplanationAr:
      "موجات الحر دي بتسقط الأزهار وتوقف التحجيم وتضاعف استهلاك المية؛ وعشان كده بننصح بالري في الفجرية أو بالليل واختيار أصناف بتتحمل الحرارة.",
    unit: "days",
  },
];

export default function FarmPlannerModal({
  isOpen,
  step,
  field,
  inputs,
  onChangeInputs,
  onUpdateFieldName,
  onGeneratePlans,
  onBackToInputs,
  onMinimizeToMap,
  onRedrawField,
  onExportGeoJSON,
  nasaData,
  isLoadingNasa,
  user,
  onOpenAuth,
  savedEvaluation,
}: FarmPlannerModalProps) {
  const { lang, setLang, t } = useLanguage();

  // Evaluation result from backend
  const [evaluation, setEvaluation] = useState<FieldShiftEvaluation | null>(savedEvaluation || null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showOtherPlans, setShowOtherPlans] = useState(false);

  // Scenario Simulator (What-If Analysis)
  const [scenarioTempDelta, setScenarioTempDelta] = useState<number>(0);
  const [scenarioWaterDelta, setScenarioWaterDelta] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Glossary modal & language states — synced to global lang context
  const [showGlossary, setShowGlossary] = useState(false);
  const [glossaryLang, setGlossaryLang] = useState<"ar" | "en">(lang);
  const [explanationLang, setExplanationLang] = useState<"ar" | "en">(lang);

  // Keep local lang states in sync when global language changes
  useEffect(() => {
    setGlossaryLang(lang);
    setExplanationLang(lang);
  }, [lang]);

  // Sync saved evaluation when user signs in or account data is fetched
  useEffect(() => {
    if (savedEvaluation) {
      setEvaluation(savedEvaluation);
    }
  }, [savedEvaluation]);

  // Synchronize area in Feddans (1 Feddan = 0.42 Hectares)
  const computedFeddans = useMemo(() => {
    if (field.areaHectares > 0) {
      return Number((field.areaHectares / 0.42).toFixed(1));
    }
    return 5;
  }, [field.areaHectares]);

  // Derived input values
  const activeFeddans = inputs.landAreaFeddans ?? computedFeddans;
  // Land location is always derived from map coordinates — never from a dropdown
  const activeLocation = `${field.centroid[0].toFixed(4)}°N, ${field.centroid[1].toFixed(4)}°E`;
  const activeLastCrop = inputs.lastCrop || "Summer Maize";
  const activeStartDate = inputs.plantingStartDate || "2026-11-15";
  const activeIrrigation = inputs.irrigationMethod || "Surface Irrigation";
  const activeWaterAvail = inputs.waterAvailability || "Limited";
  const activeObjective = inputs.planObjective || "Save Water";

  const climateSummary = useMemo(() => {
    const records = nasaData?.records ?? [];
    const validTemps = records.map((r) => r.tempC).filter((v): v is number => v !== null);
    const avgTemp = validTemps.length > 0 ? validTemps.reduce((a, b) => a + b, 0) / validTemps.length : null;
    const validWetness = records.map((r) => r.soilWetness).filter((v): v is number => v !== null);
    const latestWetness = validWetness.length > 0 ? validWetness[validWetness.length - 1] : null;

    return { avgTemp, latestWetness };
  }, [nasaData]);

  if (!isOpen) return null;

  // Run backend calculation & optional persistence
  const handleCalculateAndProceed = async () => {
    setIsEvaluating(true);
    setEvalError(null);
    setSaveSuccess(false);

    const payload: FarmerSubmissionPayload = {
      landLocation: activeLocation,  // auto-derived from map centroid
      lat: field.centroid[0],
      lon: field.centroid[1],
      coordinates: field.coordinates,
      landArea: computedFeddans,     // auto-measured from map polygon
      lastCrop: activeLastCrop,
      plantingStartDate: activeStartDate,
      irrigationMethod: activeIrrigation,
      waterAvailability: activeWaterAvail,
      planObjective: activeObjective,
      scenarioModifiers: {
        tempDeltaC: scenarioTempDelta,
        waterSupplyPctDelta: scenarioWaterDelta,
      },
    };

    try {
      if (user) {
        // Authenticated: Save to MongoDB + Calculate
        const res = await api.saveFarmerData(payload);
        if (res.record?.recommendation) {
          setEvaluation(res.record.recommendation);
          setSaveSuccess(true);
        }
      } else {
        // Guest mode: Calculate preview via backend
        const res = await api.calculateRotation(payload);
        setEvaluation(res);
      }
      onGeneratePlans();
    } catch (err: any) {
      console.warn("Backend evaluation failed; will use fallback or show error:", err);
      setEvalError(err.message || "Failed to connect to backend engine. Please ensure backend is running.");
      onGeneratePlans();
    } finally {
      setIsEvaluating(false);
    }
  };

  // Live Scenario Simulation recalculation
  const handleApplyScenario = async (tempDelta: number, waterDelta: number) => {
    setScenarioTempDelta(tempDelta);
    setScenarioWaterDelta(waterDelta);
    setIsSimulating(true);

    const payload: FarmerSubmissionPayload = {
      landLocation: activeLocation,  // auto-derived from map centroid
      lat: field.centroid[0],
      lon: field.centroid[1],
      coordinates: field.coordinates,
      landArea: computedFeddans,     // auto-measured from map polygon
      lastCrop: activeLastCrop,
      plantingStartDate: activeStartDate,
      irrigationMethod: activeIrrigation,
      waterAvailability: activeWaterAvail,
      planObjective: activeObjective,
      scenarioModifiers: {
        tempDeltaC: tempDelta,
        waterSupplyPctDelta: waterDelta,
      },
    };

    try {
      const res = await api.calculateRotation(payload);
      setEvaluation(res);
    } catch (err) {
      console.warn("Scenario calculation error:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <>
    <style>{`
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(20px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(163,228,183,0); }
        50%       { box-shadow: 0 0 16px 4px rgba(163,228,183,0.18); }
      }
      .animate-step2-in { animation: fadeIn 0.4s ease both; }
      .animate-step2-in > * {
        animation: fadeInUp 0.5s ease both;
      }
      .animate-step2-in > *:nth-child(1) { animation-delay: 0.05s; }
      .animate-step2-in > *:nth-child(2) { animation-delay: 0.12s; }
      .animate-step2-in > *:nth-child(3) { animation-delay: 0.19s; }
      .animate-step2-in > *:nth-child(4) { animation-delay: 0.26s; }
      .animate-step2-in > *:nth-child(5) { animation-delay: 0.33s; }
      .animate-step2-in > *:nth-child(6) { animation-delay: 0.40s; }
      .animate-step2-in > *:nth-child(7) { animation-delay: 0.47s; }
      .animate-fade-in { animation: fadeIn 0.3s ease both; }
      .diag-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      .diag-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
      .strategy-card { animation: scaleIn 0.5s ease 0.3s both; }
      .scenario-card { animation: slideInRight 0.5s ease 0.2s both; }
    `}</style>
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Crop Rotation & Farm Planner"
      className="fixed inset-0 z-[480] flex items-center justify-center p-3 sm:p-5 bg-[#070B0E]/75 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-4xl max-h-[92dvh] flex flex-col rounded-3xl bg-[#0B1015]/95 border border-white/10 shadow-2xl text-[#F2F7F4] overflow-hidden">
        {/* Top Header: Field Info, Area, NASA Weather & Glossary Button */}
        <div className="shrink-0 px-5 py-4 border-b border-white/[0.08] bg-[#0D1318]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[220px]">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A3E4B7] mb-1">
                <img src="/logo.svg" alt="Sky Space" className="w-3.5 h-3.5 object-contain" />
                {step === "inputs"
                  ? "Sky Space • Ground Parameters"
                  : "Sky Space Engine • Optimal Crop Rotation Plan"}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {step === "inputs" ? (
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => onUpdateFieldName(e.target.value)}
                    aria-label="Field Name"
                    className="text-base sm:text-lg font-bold bg-[#121A21] border border-white/10 rounded-xl px-2.5 py-1 text-[#F2F7F4] focus:outline-none focus:ring-2 focus:ring-[#A3E4B7]/40 w-full sm:w-60"
                  />
                ) : (
                  <h2 className="text-base sm:text-lg font-bold text-[#F2F7F4]">
                    {field.name}
                  </h2>
                )}
                <span className="px-3 py-1 rounded-full bg-[#111920] border border-white/10 text-xs font-semibold text-[#A3E4B7]">
                  {activeFeddans} Feddans ({field.areaHectares.toFixed(2)} Ha)
                </span>
                <span className="text-[11px] text-[#8A9B93] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#A3E4B7]" />
                  {field.centroid[0].toFixed(4)}°N, {field.centroid[1].toFixed(4)}°E
                </span>
              </div>
            </div>

            {/* NASA Weather Pill, Glossary Button & Auth Status */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <div className="inline-flex items-center rounded-2xl border border-white/10 bg-[#111920] overflow-hidden text-[10px] font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => setLang("ar")}
                  className={`px-2.5 py-1.5 transition ${lang === "ar" ? "bg-[#A3E4B7] text-[#070B0E]" : "text-[#8A9B93] hover:text-[#F2F7F4]"}`}
                >
                  AR
                </button>
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`px-2.5 py-1.5 transition ${lang === "en" ? "bg-[#A3E4B7] text-[#070B0E]" : "text-[#8A9B93] hover:text-[#F2F7F4]"}`}
                >
                  EN
                </button>
              </div>

              {/* Scientific Glossary Button */}
              <button
                type="button"
                onClick={() => setShowGlossary(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#111920] hover:bg-[#162029] border border-[#A3E4B7]/30 text-xs font-bold text-[#A3E4B7] transition shadow-sm"
                title="Scientific Glossary for Farmers (قاموس المصطلحات)"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#A3E4B7]" />
                <span className="hidden sm:inline">{lang === "ar" ? "قاموس" : "Glossary"}</span>
              </button>

              <div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-[#111920] border border-white/[0.08] text-xs">
                {isLoadingNasa ? (
                  <span className="inline-flex items-center gap-1.5 text-[#8A9B93]">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A3E4B7]" />
                    Syncing NASA...
                  </span>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                      <Thermometer className="w-3.5 h-3.5" />
                      {climateSummary.avgTemp !== null ? `${climateSummary.avgTemp.toFixed(0)}°C` : "Weather Synced"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#A3E4B7] font-semibold">
                      <Droplets className="w-3.5 h-3.5" />
                      {climateSummary.latestWetness !== null ? `${Math.round(climateSummary.latestWetness * 100)}% moisture` : "—"}
                    </span>
                  </>
                )}
              </div>

              {user ? (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#A3E4B7]/15 border border-[#A3E4B7]/30 text-[#A3E4B7] text-xs font-semibold">
                  <User className="w-3 h-3" />
                  {user.name.split(" ")[0]}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-[#F2F7F4] font-semibold transition"
                >
                  <Lock className="w-3 h-3 text-[#A3E4B7]" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto scroll-slim p-5 space-y-5">
          {step === "inputs" ? (
            /* =================== STEP 1: USER INPUTS =================== */
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-[#9DB0A7]">
                {t("modal.subtitle")}
              </p>

              {/* Land Location: auto-detected from map coordinates */}
              <div className="rounded-2xl bg-[#111920] border border-white/[0.08] p-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#A3E4B7] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A9B93] mb-0.5">
                    {t("modal.location")}
                  </div>
                  <div className="text-sm font-bold text-[#F2F7F4] truncate">
                    {field.centroid[0].toFixed(4)}°N, {field.centroid[1].toFixed(4)}°E
                  </div>
                  <div className="text-[11px] text-[#A3E4B7] mt-0.5">
                    {t("modal.locationSub")}
                  </div>
                </div>
                <div className="shrink-0 px-2.5 py-1 rounded-full bg-[#A3E4B7]/15 border border-[#A3E4B7]/30 text-[#A3E4B7] text-[10px] font-bold uppercase tracking-wider">
                  {t("modal.live")}
                </div>
              </div>

              {/* Input 3 & 4: Last Crop & Planting Start Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#111920] border border-white/[0.08] p-4 space-y-2">
                  <label className="block text-xs font-bold text-[#F2F7F4] uppercase tracking-wider flex items-center gap-1.5">
                    <Wheat className="w-3.5 h-3.5 text-[#A3E4B7]" />
                    Last Crop (e.g., Maize)
                  </label>
                  <select
                    value={activeLastCrop}
                    onChange={(e) => onChangeInputs({ ...inputs, lastCrop: e.target.value })}
                    className="w-full bg-[#0D1318] border border-white/15 rounded-xl px-3 py-2 text-sm text-[#F2F7F4] focus:outline-none focus:ring-2 focus:ring-[#A3E4B7]/40"
                  >
                    {EGYPT_CROPS.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.season})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#8A9B93]">
                    Engine screens rotation history to break cereal disease cycles.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#111920] border border-white/[0.08] p-4 space-y-2">
                  <label className="block text-xs font-bold text-[#F2F7F4] uppercase tracking-wider">
                    Planting Start Date
                  </label>
                  <input
                    type="date"
                    value={activeStartDate}
                    onChange={(e) => onChangeInputs({ ...inputs, plantingStartDate: e.target.value })}
                    className="w-full bg-[#0D1318] border border-white/15 rounded-xl px-3 py-2 text-sm text-[#F2F7F4] focus:outline-none focus:ring-2 focus:ring-[#A3E4B7]/40"
                  />
                  <p className="text-[11px] text-[#A3E4B7]">
                    Target Window: Winter Season (Shitwi 2026/2027)
                  </p>
                </div>
              </div>

              {/* Input 5: Irrigation Method */}
              <div className="rounded-2xl bg-[#111920] border border-white/[0.08] p-4 space-y-2.5">
                <label className="block text-xs font-bold text-[#F2F7F4] uppercase tracking-wider">
                  Irrigation Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(["Surface Irrigation", "Drip", "Sprinkler"] as const).map((method) => {
                    const active = activeIrrigation === method;
                    const efficiency = method === "Surface Irrigation" ? "55%" : method === "Drip" ? "88%" : "75%";
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => onChangeInputs({ ...inputs, irrigationMethod: method })}
                        className={`p-3 rounded-xl border text-left transition ${
                          active
                            ? "bg-[#A3E4B7]/15 border-[#A3E4B7] text-white"
                            : "bg-[#0D1318] border-white/10 text-[#9DB0A7] hover:border-white/20"
                        }`}
                      >
                        <div className="text-xs font-bold flex items-center justify-between">
                          <span>{method}</span>
                          {active && <CheckCircle2 className="w-3.5 h-3.5 text-[#A3E4B7]" />}
                        </div>
                        <div className="text-[10px] text-[#8A9B93] mt-0.5">Efficiency: {efficiency}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input 6: Water Availability */}
              <div className="rounded-2xl bg-[#111920] border border-white/[0.08] p-4 space-y-2.5">
                <label className="block text-xs font-bold text-[#F2F7F4] uppercase tracking-wider flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  Water Availability
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(["Limited", "Moderate", "Abundant"] as const).map((avail) => {
                    const active = activeWaterAvail === avail;
                    const note = avail === "Limited" ? "Canal tail-end (deficit risk)" : avail === "Moderate" ? "Mid-canal (average supply)" : "Canal head (plentiful)";
                    return (
                      <button
                        key={avail}
                        type="button"
                        onClick={() => onChangeInputs({ ...inputs, waterAvailability: avail })}
                        className={`p-3 rounded-xl border text-left transition ${
                          active
                            ? "bg-sky-500/15 border-sky-400 text-white"
                            : "bg-[#0D1318] border-white/10 text-[#9DB0A7] hover:border-white/20"
                        }`}
                      >
                        <div className="text-xs font-bold flex items-center justify-between">
                          <span>{avail}</span>
                          {active && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                        </div>
                        <div className="text-[10px] text-[#8A9B93] mt-0.5">{note}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input 7: Plan Objective */}
              <div className="rounded-2xl bg-[#111920] border border-white/[0.08] p-4 space-y-2.5">
                <label className="block text-xs font-bold text-[#F2F7F4] uppercase tracking-wider">
                  Plan Objective
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => onChangeInputs({ ...inputs, planObjective: "Save Water", priority: "water-saving" })}
                    className={`p-4 rounded-xl border text-left transition ${
                      activeObjective === "Save Water"
                        ? "bg-[#A3E4B7]/15 border-[#A3E4B7] text-white"
                        : "bg-[#0D1318] border-white/10 text-[#9DB0A7] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                      <Droplets className="w-4 h-4 text-sky-400" />
                      Save Water
                    </div>
                    <p className="text-xs text-[#8A9B93] leading-snug">
                      Maximize irrigation water productivity and prioritize drought & heat-resilient crops.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangeInputs({ ...inputs, planObjective: "Improve Soil Health", priority: "sustainability" })}
                    className={`p-4 rounded-xl border text-left transition ${
                      activeObjective === "Improve Soil Health"
                        ? "bg-[#A3E4B7]/15 border-[#A3E4B7] text-white"
                        : "bg-[#0D1318] border-white/10 text-[#9DB0A7] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                      <Leaf className="w-4 h-4 text-[#A3E4B7]" />
                      Improve Soil Health
                    </div>
                    <p className="text-xs text-[#8A9B93] leading-snug">
                      Restore nitrogen index, enhance soil organic carbon, and include nitrogen-fixing legumes.
                    </p>
                  </button>
                </div>
              </div>

              {evalError && (
                <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{evalError}</span>
                </div>
              )}
            </div>
          ) : (
            /* =================== STEP 2: ENGINE PLANS VIEW =================== */
            <div className="space-y-4 animate-step2-in">
              {/* Persistence / Auth Status Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#111920] border border-white/10 text-xs">
                {user ? (
                  <span className="text-[#A3E4B7] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Authenticated as {user.name} • Saved to MongoDB database
                  </span>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[#8A9B93]">
                      Viewing guest preview. Sign in to save this evaluation to your account history.
                    </span>
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="px-3 py-1 rounded-xl bg-[#A3E4B7] text-[#070B0E] font-bold text-xs hover:bg-[#8ee0a7] transition"
                    >
                      Sign In & Save
                    </button>
                  </div>
                )}
              </div>

              {/* Real Satellite Diagnostics Banner */}
              {evaluation?.diagnostics && (() => {
                const hsd = evaluation.diagnostics.heatStressDays ?? 0;
                const bsd = evaluation.diagnostics.bareSoilDays ?? 0;
                const canopy = evaluation.diagnostics.canopyAnomaly?.value ?? null;
                const sal = evaluation.diagnostics.salinityRisk ?? null;
                const soc = evaluation.diagnostics.soilOrganicCarbon ?? null;
                const wet = evaluation.diagnostics.rootZoneWetnessAvg ?? null;

                // color helpers: returns Tailwind classes for bg + text + icon based on status
                const heatStatus = hsd >= 30 ? "danger" : hsd >= 15 ? "warn" : "good";
                const bareStatus = bsd >= 30 ? "danger" : bsd >= 15 ? "warn" : "good";
                const canopyStatus = canopy == null ? "neutral" : canopy >= 0.5 ? "good" : canopy >= -0.5 ? "neutral" : "warn";
                const salStatus = sal == null ? "neutral" : sal < 25 ? "good" : sal < 60 ? "warn" : "danger";
                const socStatus = soc == null ? "neutral" : soc >= 15 ? "good" : soc >= 8 ? "warn" : "danger";
                const wetStatus = wet == null ? "neutral" : wet >= 0.4 ? "good" : wet >= 0.2 ? "warn" : "danger";

                const statusColors: Record<string, { bg: string; text: string; icon: string; badge: string; badgeText: string; label: string }> = {
                  good:    { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-300", icon: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300", badgeText: lang === "ar" ? "جيد ✓" : "Good ✓", label: "text-emerald-200/70" },
                  warn:    { bg: "bg-amber-500/10 border-amber-500/30",     text: "text-amber-300",   icon: "text-amber-400",   badge: "bg-amber-500/20 text-amber-300",   badgeText: lang === "ar" ? "تحذير ⚠" : "Warn ⚠", label: "text-amber-200/70" },
                  danger:  { bg: "bg-rose-500/10 border-rose-500/30",       text: "text-rose-300",    icon: "text-rose-400",    badge: "bg-rose-500/20 text-rose-300",     badgeText: lang === "ar" ? "خطر ✕" : "High ✕", label: "text-rose-200/70" },
                  neutral: { bg: "bg-[#111920] border-white/10",             text: "text-[#A3E4B7]",   icon: "text-[#8A9B93]",  badge: "bg-white/10 text-[#8A9B93]",       badgeText: "—", label: "text-[#8A9B93]" },
                };

                const DiagCard = ({
                  status, icon: Icon, value, unit, label,
                }: { status: string; icon: React.ElementType; value: string; unit?: string; label: string }) => {
                  const c = statusColors[status] || statusColors.neutral;
                  return (
                    <div className={`diag-card rounded-2xl border p-3 flex flex-col gap-2 ${c.bg}`}>
                      <div className="flex items-center justify-between">
                        <Icon className={`w-5 h-5 ${c.icon}`} />
                        <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${c.badge}`}>
                          {c.badgeText}
                        </span>
                      </div>
                      <div>
                        <div className={`text-xl font-black leading-none ${c.text}`}>
                          {value}
                          {unit && <span className={`text-[11px] font-bold ml-1 ${c.label}`}>{unit}</span>}
                        </div>
                        <div className={`text-[10px] font-semibold mt-1 leading-tight ${c.label}`}>
                          {label}
                        </div>
                      </div>
                    </div>
                  );
                };

                return (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-0.5">
                      <Satellite className="w-4 h-4 text-[#A3E4B7]" />
                      <h4 className="text-xs font-bold text-[#A3E4B7] uppercase tracking-wider">
                        {lang === "ar" ? "تشخيصات الأقمار الصناعية" : "Live Satellite Diagnostics"}
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <DiagCard status={heatStatus} icon={Flame} value={String(hsd)} unit={lang === "ar" ? "يوم" : "days"} label={t("report.heatStress")} />
                      <DiagCard status={bareStatus} icon={Sun} value={String(bsd)} unit={lang === "ar" ? "يوم" : "days"} label={t("report.bareSoil")} />
                      <DiagCard
                        status={canopyStatus}
                        icon={Leaf}
                        value={canopy != null ? (canopy > 0 ? "+" : "") + canopy.toFixed(2) : "—"}
                        label={t("report.canopy")}
                      />
                      <DiagCard
                        status={salStatus}
                        icon={Thermometer}
                        value={sal != null ? String(sal) : "—"}
                        unit={sal != null ? "/100" : undefined}
                        label={t("report.salinity")}
                      />
                      <DiagCard
                        status={socStatus}
                        icon={Layers}
                        value={soc != null ? soc.toFixed(1) : "—"}
                        unit={soc != null ? "g/kg" : undefined}
                        label={t("report.carbon")}
                      />
                      <DiagCard
                        status={wetStatus}
                        icon={Droplets}
                        value={wet != null ? `${Math.round(wet * 100)}%` : "—"}
                        label={t("report.wetness")}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* ----------------- 4. SCENARIO SIMULATOR (WHAT-IF ANALYSIS SLIDERS) ----------------- */}
              <div className="scenario-card rounded-2xl p-4 bg-[#111920] border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#A3E4B7]" />
                    <h4 className="text-sm font-bold text-white">{t("report.scenario")}</h4>
                  </div>
                  {(scenarioTempDelta !== 0 || scenarioWaterDelta !== 0) && (
                    <button
                      type="button"
                      onClick={() => handleApplyScenario(0, 0)}
                      className="text-[11px] text-[#A3E4B7] hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset to Baseline (إعادة ضبط)
                    </button>
                  )}
                </div>

                <p className="text-xs text-[#8A9B93]">
                  {t("report.scenarioDesc")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Temperature Slider */}
                  <div className="p-3 rounded-xl bg-[#0D1318] border border-white/10 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        Temperature Shift:
                      </span>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${scenarioTempDelta > 0 ? "bg-amber-500/20 text-amber-300" : scenarioTempDelta < 0 ? "bg-sky-500/20 text-sky-300" : "bg-white/10 text-white"}`}>
                        {scenarioTempDelta > 0 ? `+${scenarioTempDelta}°C` : `${scenarioTempDelta}°C`}
                        {scenarioTempDelta === 0 ? " (Normal)" : scenarioTempDelta >= 2 ? " (Heatwave)" : ""}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-2}
                      max={5}
                      step={1}
                      value={scenarioTempDelta}
                      onChange={(e) => handleApplyScenario(Number(e.target.value), scenarioWaterDelta)}
                      className="w-full accent-[#A3E4B7] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#8A9B93]">
                      <span>-2°C (Cooler)</span>
                      <span>0°C (Baseline)</span>
                      <span>+2°C (Warming)</span>
                      <span>+5°C (Extreme)</span>
                    </div>
                  </div>

                  {/* Water Supply Quota Slider */}
                  <div className="p-3 rounded-xl bg-[#0D1318] border border-white/10 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-sky-400" />
                        Water Supply Quota:
                      </span>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${scenarioWaterDelta < 0 ? "bg-rose-500/20 text-rose-300" : scenarioWaterDelta > 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white"}`}>
                        {scenarioWaterDelta > 0 ? `+${scenarioWaterDelta}%` : `${scenarioWaterDelta}%`}
                        {scenarioWaterDelta === 0 ? " (Standard 100%)" : scenarioWaterDelta <= -20 ? " (Drought Deficit)" : " (Surplus)"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-40}
                      max={30}
                      step={5}
                      value={scenarioWaterDelta}
                      onChange={(e) => handleApplyScenario(scenarioTempDelta, Number(e.target.value))}
                      className="w-full accent-sky-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#8A9B93]">
                      <span>-40% (Severe Deficit)</span>
                      <span>-20% (Cut)</span>
                      <span>0% (Full Quota)</span>
                      <span>+30% (Surplus)</span>
                    </div>
                  </div>
                </div>

                {evaluation?.scenarioSimulation?.applied && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5" style={{animation:"fadeInUp 0.4s ease both"}}>
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold text-amber-300">
                        {lang === "ar" ? "⚡ سيناريو مفعّل — النتائج محدّثة" : "⚡ What-If Active — Results Updated"}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <strong>{evaluation.scenarioSimulation.effectiveHeatStressDays}</strong>
                          {lang === "ar" ? " يوم &gt; 38°م" : " days > 38°C"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5 text-sky-400" />
                          {lang === "ar" ? "توافر المياه: " : "Water factor: "}
                          <strong>{Math.round(evaluation.scenarioSimulation.waterAvailabilityFactor * 100)}%</strong>
                        </span>
                      </div>
                      <div className="text-amber-200/70">
                        {lang === "ar" ? "تم إعادة ترتيب الدورات ديناميكياً." : "Rotations re-ranked dynamically."}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ----------------- 3. BARE-FIELD & SOIL VULNERABILITY WINDOWS ----------------- */}
              {(evaluation?.diagnostics?.bareFieldVulnerability?.detected || (evaluation?.diagnostics?.bareSoilDays ?? 0) >= 16) && (
                <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-950/40 via-[#181309] to-[#120E08] border border-amber-500/30 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                      <Wind className="w-4 h-4 text-amber-400" />
                      <span>{t("bare.title")}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Exposure: {evaluation?.diagnostics?.bareSoilDays ?? 32} Days (NDVI &lt; 0.22)
                    </span>
                  </div>

                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    {evaluation?.diagnostics?.bareFieldVulnerability?.summaryEn ||
                      `Orbital NDVI composite detected a ${evaluation?.diagnostics?.bareSoilDays}-day bare-soil gap in autumn. Leaving soil unplanted under intense solar radiation causes microbial carbon oxidation, wind erosion, and severe moisture evaporation.`}
                  </p>

                  <div className="pt-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2">
                      Recommended Tactical Cover Crops (محاصيل تغطية سريعة مقترحة):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="diag-card p-3.5 rounded-xl bg-black/40 border border-amber-500/20 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                              <Leaf className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">Berseem Fahl</div>
                              <div className="text-[10px] text-amber-200/70">برسيم فحل</div>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-[#A3E4B7] bg-[#A3E4B7]/10 px-2 py-0.5 rounded-full whitespace-nowrap">65 {lang === "ar" ? "يوم" : "Days"}</span>
                        </div>
                        <p className="text-[11px] text-[#9DB0A7] leading-relaxed">
                          {lang === "ar"
                            ? "غطاء نباتي سريع يثبت 30–45 كجم نيتروجين/فدان قبل زراعة القمح؛ يحمي التربة من رياح الخريف."
                            : "Fast canopy fixing 30–45 kg N/feddan before wheat sowing; shields topsoil from autumn desert winds."}
                        </p>
                      </div>

                      <div className="diag-card p-3.5 rounded-xl bg-black/40 border border-amber-500/20 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                              <Sun className="w-4 h-4 text-amber-400" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">Nili Cowpea</div>
                              <div className="text-[10px] text-amber-200/70">لوبيا علف نيلية</div>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full whitespace-nowrap">70 {lang === "ar" ? "يوم" : "Days"}</span>
                        </div>
                        <p className="text-[11px] text-[#9DB0A7] leading-relaxed">
                          {lang === "ar"
                            ? "يتحمل حرارة الصيف، يقمع بذور الأعشاب، ويمنع تقشر التربة."
                            : "Tolerates summer heat, suppresses weed seedbanks, and prevents soil crusting."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommended Optimal Strategy Card */}
              {evaluation?.proposed && (
                <div className="strategy-card rounded-2xl p-5 bg-gradient-to-br from-[#15271c] to-[#0d1812] border-2 border-[#A3E4B7] shadow-xl space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#A3E4B7] text-[#070B0E]">
                        RECOMMENDED STRATEGY • {evaluation.proposed.badge}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1.5">
                        {evaluation.proposed.labelEn}
                      </h3>
                      <p className="text-xs text-[#A3E4B7]">
                        Optimal match for {activeObjective} in {activeLocation}
                      </p>
                    </div>

                    <div className="text-center px-4 py-2 rounded-xl bg-black/40 border border-[#A3E4B7]/30">
                      <div className="text-2xl font-black text-[#A3E4B7] leading-none">
                        {evaluation.proposed.finalSuitability}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-[#8A9B93] mt-1">
                        Suitability
                      </div>
                    </div>
                  </div>

                  {/* Sequence Flow */}
                  <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-black/30 border border-white/5">
                    {evaluation.proposed.crops.map((c, idx) => (
                      <React.Fragment key={c.id || idx}>
                        <div className="diag-card flex-1 min-w-[130px] p-2.5 rounded-lg bg-[#111920] border border-[#A3E4B7]/30">
                          <div className="text-[10px] font-bold uppercase text-[#8A9B93]">
                            {c.season === "Shitwi" ? "🌾 Shitwi" : c.season === "Seifi" ? "☀️ Seifi" : "🍂 Nili"}
                          </div>
                          <div className="text-sm font-bold text-white mt-0.5">{c.nameEn}</div>
                          <div className="text-[11px] text-[#A3E4B7]">{c.family} · Kc: {c.kc}</div>
                        </div>
                        {idx < evaluation.proposed.crops.length - 1 && (
                          <span className="text-[#A3E4B7] font-bold text-lg">➔</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                      <div className="text-[10px] uppercase text-[#8A9B93]">Water Savings</div>
                      <div className="text-lg font-bold text-[#A3E4B7] mt-0.5">
                        {evaluation.proposed.waterSavedPercent > 0 ? `+${evaluation.proposed.waterSavedPercent}%` : `${evaluation.proposed.waterSavedPercent}%`}
                      </div>
                      <div className="text-[10px] text-[#8A9B93]">vs baseline rotation</div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                      <div className="text-[10px] uppercase text-[#8A9B93]">Water per Feddan</div>
                      <div className="text-lg font-bold text-sky-400 mt-0.5">
                        {evaluation.proposed.grossWaterM3Feddan.toLocaleString()} m³
                      </div>
                      <div className="text-[10px] text-[#8A9B93]">m³/feddan/cycle</div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                      <div className="text-[10px] uppercase text-[#8A9B93]">Total Farm Water</div>
                      <div className="text-lg font-bold text-white mt-0.5">
                        {evaluation.proposed.totalFarmWaterM3.toLocaleString()} m³
                      </div>
                      <div className="text-[10px] text-[#8A9B93]">{activeFeddans} Feddans total</div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                      <div className="text-[10px] uppercase text-[#8A9B93]">Nitrogen Balance</div>
                      <div className="text-lg font-bold text-[#A3E4B7] mt-0.5">
                        {evaluation.proposed.nitrogenBalance > 0 ? `+${evaluation.proposed.nitrogenBalance}` : evaluation.proposed.nitrogenBalance}
                      </div>
                      <div className="text-[10px] text-[#8A9B93]">Soil Health Index: {evaluation.proposed.soilScore}</div>
                    </div>
                  </div>

                  {/* ----------------- 1. 5-ELEMENT STRATEGY EXPLANATION CARDS ----------------- */}
                  <div className="rounded-xl p-4 bg-black/40 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="text-xs font-bold text-[#A3E4B7] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        5-Element Strategy Evaluation (عناصر تقييم الاستراتيجية الـ ٥)
                      </div>
                      <div className="flex items-center gap-1 bg-[#111920] p-0.5 rounded-lg border border-white/10 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setExplanationLang("en")}
                          className={`px-2 py-0.5 rounded font-bold transition ${explanationLang === "en" ? "bg-[#A3E4B7] text-[#070B0E]" : "text-[#8A9B93] hover:text-white"}`}
                        >
                          EN
                        </button>
                        <button
                          type="button"
                          onClick={() => setExplanationLang("ar")}
                          className={`px-2 py-0.5 rounded font-bold transition ${explanationLang === "ar" ? "bg-[#A3E4B7] text-[#070B0E]" : "text-[#8A9B93] hover:text-white"}`}
                        >
                          العربية
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* 1. Why Suggested */}
                      <div className="p-3 rounded-lg bg-[#111920]/80 border-l-2 border-[#A3E4B7] space-y-1">
                        <div className="font-bold text-[#A3E4B7] flex items-center gap-1">
                          <span>💡 1. Why Suggested (سبب الاختيار):</span>
                        </div>
                        <p className="text-[#cbd5e1] leading-relaxed">
                          {explanationLang === "ar"
                            ? (evaluation.proposed.explanation?.whySuggested?.ar || evaluation.proposed.explanation?.why?.ar || "تم اختيار الدورة لتحقيق أقصى كفاءة مائية وتعزيز النيتروجين الحيوي.")
                            : (evaluation.proposed.explanation?.whySuggested?.en || evaluation.proposed.explanation?.why?.en)}
                        </p>
                      </div>

                      {/* 2. Supporting Evidence */}
                      <div className="p-3 rounded-lg bg-[#111920]/80 border-l-2 border-sky-400 space-y-1">
                        <div className="font-bold text-sky-400 flex items-center gap-1">
                          <span>🛰️ 2. Supporting Evidence (الدليل من بيانات ناسا):</span>
                        </div>
                        <p className="text-[#cbd5e1] leading-relaxed">
                          {explanationLang === "ar"
                            ? (evaluation.proposed.explanation?.supportingEvidence?.ar || "أرصاد ناسا POWER أكدت تكرار درجات حرارة فوق ٣٨°م مع فترات انخفاض غطاء نباتي MODIS.")
                            : (evaluation.proposed.explanation?.supportingEvidence?.en || "NASA POWER thermal observations and MODIS NDVI composite bare-field data.")}
                        </p>
                      </div>

                      {/* 3. Expected Benefits */}
                      <div className="p-3 rounded-lg bg-[#111920]/80 border-l-2 border-emerald-400 space-y-1">
                        <div className="font-bold text-emerald-400 flex items-center gap-1">
                          <span>📈 3. Expected Benefits (الفوائد المتوقعة):</span>
                        </div>
                        <p className="text-[#cbd5e1] leading-relaxed">
                          {explanationLang === "ar"
                            ? (evaluation.proposed.explanation?.expectedBenefits?.ar || `توفير مياه بنسبة ${evaluation.proposed.waterSavedPercent}% مع تحسين مؤشر النيتروجين إلى ${evaluation.proposed.nitrogenBalance}.`)
                            : (evaluation.proposed.explanation?.expectedBenefits?.en || `Water savings of ${evaluation.proposed.waterSavedPercent}% with modeled nitrogen balance of ${evaluation.proposed.nitrogenBalance}.`)}
                        </p>
                      </div>

                      {/* 4. Information Gaps */}
                      <div className="p-3 rounded-lg bg-[#111920]/80 border-l-2 border-amber-400 space-y-1">
                        <div className="font-bold text-amber-400 flex items-center gap-1">
                          <span>🔍 4. Information Gaps (ما لا يراه القمر الصناعي):</span>
                        </div>
                        <p className="text-[#cbd5e1] leading-relaxed">
                          {explanationLang === "ar"
                            ? (evaluation.proposed.explanation?.informationGaps?.ar || "ما لا يراه القمر: ملوحة التربة المعملية الدقيقة (ECe) على عمق الجذور، وأسعار السوق اليومية بالمحافظة، والآفات الموضعية.")
                            : (evaluation.proposed.explanation?.informationGaps?.en || "Orbital observations cannot measure subsurface root-zone ECe, local farmgate market prices, or localized pest infestations.")}
                        </p>
                      </div>

                      {/* 5. Risks & Agronomist Review */}
                      <div className="p-3 rounded-lg bg-[#111920]/80 border-l-2 border-rose-400 space-y-1.5">
                        <div className="font-bold text-rose-400 flex items-center gap-1">
                          <span>⚠️ 5. Risks Requiring Local Review (المخاطر والتنبيه الإرشادي):</span>
                        </div>
                        <p className="text-[#cbd5e1] leading-relaxed">
                          {explanationLang === "ar"
                            ? (evaluation.proposed.explanation?.risksLocalReview?.ar || "يلزم التأكد من توافق مواعيد نضج الأصناف ومناوبات ترعة الري المحلية.")
                            : (evaluation.proposed.explanation?.risksLocalReview?.en || "Verify local seed cultivar maturity days and district canal rotation intervals.")}
                        </p>
                        <div className="p-2 rounded bg-black/40 border border-white/10 text-[11px] text-amber-300 font-semibold">
                          {explanationLang === "ar"
                            ? "تنبيه إرشادي: هذا النظام أداة دعم قرار استرشادية مبنية على الأقمار الصناعية والنماذج البيئية، وليست بديلاً عن المعاينة الميدانية للمهندس الزراعي وخبرة المزارع الميدانية."
                            : "Decision-Support Advisory: Sky Space is an orbital decision-support aid to guide agronomic planning and is NOT a substitute for on-site agronomist consultation and farmer local field experience."}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {evaluation.warnings?.critical && evaluation.warnings.critical.length > 0 && (
                    <div className="space-y-1.5">
                      {evaluation.warnings.critical.map((w, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{w.en}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pre-Planting Checklist */}
                  {evaluation.proposed.verificationChecklist && evaluation.proposed.verificationChecklist.length > 0 && (
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-[#A3E4B7] text-[11px] uppercase tracking-wider">
                        Pre-Planting Technical Checklist:
                      </div>
                      {evaluation.proposed.verificationChecklist.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[#9DB0A7]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#A3E4B7] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Alternative Rotation Strategies */}
              {evaluation?.strategies && evaluation.strategies.length > 1 && (
                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setShowOtherPlans((v) => !v)}
                    className="w-full py-2 px-4 rounded-xl bg-[#111920] hover:bg-[#162029] border border-white/10 text-xs font-bold text-[#A3E4B7] flex items-center justify-center gap-1.5 transition"
                  >
                    {showOtherPlans ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Alternative Strategies
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Compare {evaluation.strategies.length - 1} Other Evaluated Strategies
                      </>
                    )}
                  </button>

                  {showOtherPlans && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {evaluation.strategies.slice(1).map((strat) => (
                        <div key={strat.id} className="p-3.5 rounded-xl bg-[#111920] border border-white/10 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase text-[#8A9B93] bg-white/5 px-2 py-0.5 rounded">
                              {strat.badge}
                            </span>
                            <span className="text-sm font-bold text-[#A3E4B7]">{strat.finalSuitability} pts</span>
                          </div>
                          <div className="text-sm font-bold text-white">{strat.labelEn}</div>
                          <div className="text-xs text-[#9DB0A7]">
                            {strat.crops.map((c) => c.nameEn).join(" ➔ ")}
                          </div>
                          <div className="pt-2 border-t border-white/10 text-[11px] flex justify-between text-[#8A9B93]">
                            <span>Water Saved: <strong className="text-white">{strat.waterSavedPercent}%</strong></span>
                            <span>{strat.grossWaterM3Feddan.toLocaleString()} m³/feddan</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sticky Footer Action Bar */}
        <div className="shrink-0 px-5 py-3.5 border-t border-white/[0.08] bg-[#0D1318] flex flex-wrap items-center justify-between gap-2">
          {step === "inputs" ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onRedrawField}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/10 bg-[#121A21] hover:bg-[#19242E] text-xs font-semibold text-[#C7D4CD] transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Redraw on Map
                </button>
                <button
                  type="button"
                  onClick={onMinimizeToMap}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/10 bg-[#121A21] hover:bg-[#19242E] text-xs font-semibold text-[#C7D4CD] transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Map
                </button>
              </div>

              <button
                type="button"
                disabled={isEvaluating}
                onClick={handleCalculateAndProceed}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-[#A3E4B7] text-[#070B0E] text-xs sm:text-sm font-bold shadow-lg transition disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#070B0E]" />
                    {t("modal.analyzing")}
                  </>
                ) : (
                  <>
                    {t("modal.analyze")}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onBackToInputs}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/10 bg-[#121A21] hover:bg-[#19242E] text-xs font-semibold text-[#C7D4CD] transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {t("modal.back")}
                </button>
                <button
                  type="button"
                  onClick={onRedrawField}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/10 bg-[#121A21] hover:bg-[#19242E] text-xs font-semibold text-[#C7D4CD] transition"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  {lang === "ar" ? "رسم حقل آخر" : "Mark Another Field"}
                </button>
                <button
                  type="button"
                  onClick={onExportGeoJSON}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/10 bg-[#121A21] hover:bg-[#19242E] text-xs font-semibold text-[#C7D4CD] transition"
                >
                  <Download className="w-3.5 h-3.5 text-[#A3E4B7]" />
                  Export GeoJSON
                </button>
              </div>
              <button
                type="button"
                onClick={onMinimizeToMap}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#A3E4B7] text-[#070B0E] text-xs font-bold shadow-lg transition"
              >
                <Eye className="w-4 h-4" />
                View Field on 3D Globe / Map
              </button>
            </>
          )}
        </div>
      </div>

      {/* ----------------- 5. SCIENTIFIC GLOSSARY MODAL ----------------- */}
      {showGlossary && (
        <div className="fixed inset-0 z-[520] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl max-h-[85dvh] flex flex-col rounded-3xl bg-[#0D1318] border border-white/15 shadow-2xl text-[#F2F7F4] overflow-hidden">
            {/* Glossary Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#111920]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#A3E4B7]" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Scientific Glossary for Farmers (قاموس المصطلحات الزراعية)
                  </h3>
                  <p className="text-[11px] text-[#8A9B93]">
                    Translating orbital satellite metrics into practical agricultural insight.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setGlossaryLang("ar")}
                    className={`px-2 py-0.5 rounded font-bold transition ${glossaryLang === "ar" ? "bg-[#A3E4B7] text-[#070B0E]" : "text-[#8A9B93] hover:text-white"}`}
                  >
                    العربية
                  </button>
                  <button
                    type="button"
                    onClick={() => setGlossaryLang("en")}
                    className={`px-2 py-0.5 rounded font-bold transition ${glossaryLang === "en" ? "bg-[#A3E4B7] text-[#070B0E]" : "text-[#8A9B93] hover:text-white"}`}
                  >
                    English
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGlossary(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-[#8A9B93] hover:text-white transition"
                  aria-label="Close glossary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Glossary Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-slim">
              {GLOSSARY_DATA.map((term) => (
                <div key={term.key} className="p-3.5 rounded-2xl bg-[#111920] border border-white/10 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#070B0E] bg-[#A3E4B7] px-2 py-0.5 rounded">
                        {term.symbol}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {glossaryLang === "ar" ? term.nameAr : term.nameEn}
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#8A9B93] font-mono">
                      {term.unit}
                    </span>
                  </div>

                  <p className="text-xs text-[#A3E4B7]">
                    {glossaryLang === "ar" ? term.simpleConceptAr : term.simpleConceptEn}
                  </p>

                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-[#cbd5e1] leading-relaxed">
                    <strong className="text-amber-300 block mb-0.5">
                      {glossaryLang === "ar" ? "💡 بلغة الفلاح:" : "💡 Farmer Practical Rule:"}
                    </strong>
                    {glossaryLang === "ar" ? term.farmerExplanationAr : term.farmerExplanationEn}
                  </div>
                </div>
              ))}
            </div>

            {/* Glossary Footer */}
            <div className="p-3 border-t border-white/10 bg-[#111920] flex justify-end">
              <button
                type="button"
                onClick={() => setShowGlossary(false)}
                className="px-4 py-1.5 rounded-xl bg-white hover:bg-[#A3E4B7] text-[#070B0E] font-bold text-xs transition"
              >
                {t("modal.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
