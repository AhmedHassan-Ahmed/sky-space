export type LatLngPoint = [number, number]; // [lat, lng]

export type CropType =
  | "Wheat"
  | "Corn"
  | "Rice"
  | "Soybeans"
  | "Cotton"
  | "Vegetables"
  | "Orchard"
  | "Pasture";

export interface FarmField {
  id: string;
  name: string;
  crop: CropType;
  coordinates: LatLngPoint[];
  areaHectares: number;
  areaAcres: number;
  perimeterMeters: number;
  centroid: LatLngPoint;
  color: string;
  createdAt: string;
}

export interface NasaDailyRecord {
  date: string;
  tempC: number | null;
  tempMaxC: number | null;
  tempMinC: number | null;
  precipMm: number | null;
  solarKwh: number | null;
  humidityPct: number | null;
  soilWetness: number | null; // 0 to 1
}

export interface NasaPowerResponse {
  records: NasaDailyRecord[];
  source: "nasa-power" | "fallback";
  fetchedAt: string;
}

export type BaseMapId = "satellite" | "street";

export type NasaGibsLayerId =
  | "none"
  | "ndvi"
  | "soil-moisture"
  | "lst-day"
  | "true-color";

export interface FarmAdvisory {
  id: string;
  title: string;
  detail: string;
  severity: "good" | "info" | "warning" | "alert";
  metric: string;
}

export type PreviousCropType =
  | "Wheat"
  | "Corn"
  | "Rice"
  | "Cotton"
  | "Vegetables"
  | "Soybeans"
  | "Orchard"
  | "Fallow";

export type WaterSupplyTier = "low" | "moderate" | "high";

export type PlanPriority = "profit" | "sustainability" | "water-saving";

export interface FarmerGroundInputs {
  waterTier: WaterSupplyTier;
  waterM3PerHa: number;
  lastCrop: PreviousCropType | string;
  priority: PlanPriority;

  // FieldShift parameters
  landLocation?: string;
  landAreaFeddans?: number;
  plantingStartDate?: string;
  irrigationMethod?: "Surface Irrigation" | "Drip" | "Sprinkler";
  waterAvailability?: "Limited" | "Moderate" | "Abundant";
  planObjective?: "Save Water" | "Improve Soil Health";
}

export interface FieldShiftCrop {
  id: string;
  nameEn: string;
  nameAr?: string;
  season: string;
  family: string;
  kc: number;
  baseWaterMm: number;
}

export interface FieldShiftStrategy {
  id: string;
  labelEn: string;
  labelAr?: string;
  badge: string;
  finalSuitability: number;
  crops: FieldShiftCrop[];
  grossWaterM3Feddan: number;
  totalFarmWaterM3: number;
  waterSavedPercent: number;
  nitrogenBalance: number;
  soilScore: number;
  waterScore: number;
  marketForageScore: number;
  explanation?: {
    why?: { en: string; ar?: string };
    whySuggested?: { en: string; ar?: string };
    supportingEvidence?: {
      en: string;
      ar?: string;
      metrics?: Record<string, number | null>;
    };
    expectedBenefits?: {
      en: string;
      ar?: string;
      waterSavedM3Feddan?: number;
      waterSavedPercent?: number;
      nitrogenBalance?: number;
    };
    informationGaps?: {
      en: string;
      ar?: string;
      unseenFactors?: string[];
    };
    risksLocalReview?: {
      en: string;
      ar?: string;
      requiresAgronomist?: boolean;
      advisoryNotice?: { en: string; ar?: string };
    };
    confidence?: string;
    confidenceReasons?: { en: string; ar?: string }[];
    checklist?: { en: string; ar?: string }[];
  };
  warnings?: { en: string; ar?: string }[];
  verificationChecklist?: string[];
}

export interface BareFieldCoverCrop {
  id: string;
  nameEn: string;
  nameAr: string;
  durationDays: number;
  benefitEn: string;
  benefitAr: string;
}

export interface BareFieldVulnerabilityRun {
  startDate: string;
  endDate: string;
  days: number;
  composites: number;
  minNdvi: number;
  maxTempC: number | null;
  avgTempC: number | null;
  severity: "low" | "moderate" | "severe";
  riskEn: string;
  riskAr: string;
  recommendedCoverCrops: BareFieldCoverCrop[];
}

export interface BareFieldVulnerability {
  detected: boolean;
  totalBareDays: number;
  maxConsecutiveBareDays: number;
  overallLevel: "low" | "moderate" | "severe";
  runs: BareFieldVulnerabilityRun[];
  summaryEn: string;
  summaryAr: string;
}

export interface ScenarioSimulation {
  applied: boolean;
  tempDeltaC: number;
  waterSupplyPctDelta: number;
  effectiveHeatStressDays: number;
  waterAvailabilityFactor: number;
}

export interface FieldShiftDiagnostics {
  heatStressDays: number;
  julyHeatDays?: number;
  bareSoilDays: number;
  canopyAnomaly?: { value: number | null };
  salinityRisk: number | null;
  soilOrganicCarbon: number | null;
  rootZoneWetnessAvg: number | null;
  bareFieldVulnerability?: BareFieldVulnerability;
}

export interface FieldShiftEvaluation {
  diagnostics: FieldShiftDiagnostics;
  scenarioSimulation?: ScenarioSimulation | null;
  proposed: FieldShiftStrategy;
  strategies: FieldShiftStrategy[];
  warnings: {
    critical: { en: string; ar?: string }[];
    contextual: { en: string; ar?: string }[];
  };
}

export interface CropCycleStage {
  season: string;
  crop: string;
  durationMonths: string;
  role: string;
}

export interface CropCyclePlan {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  recommendedFor: PlanPriority;
  matchScore: number; // 0-100
  waterNeededM3PerHa: number;
  waterStatus: "optimal" | "tight" | "deficit";
  estimatedRevenuePerHaUsd: number;
  estimatedTotalRevenueUsd: number;
  soilHealthScore: number; // 0-100
  profitScore: number; // 0-100
  waterEfficiencyScore: number; // 0-100
  stages: [CropCycleStage, CropCycleStage, CropCycleStage];
  whyItFits: string[];
  actionSteps: string[];
}
