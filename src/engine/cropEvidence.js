import evidence from "../data/cropEvidence.json" with { type: "json" };
import { dailyReferenceEt } from "./referenceEt.js";

export const CROP_REFERENCE_SOURCES = evidence.sources;
export function getCropEvidence(cropId) {
  return evidence.cropProfiles[cropId] ?? null;
}

/**
 * FAO ECe (saturated-paste soil extract), never the app's 0–100 salinity screening score.
 * Returns an illustrative reference response, NOT a calibrated yield prediction.
 */
export function assessMeasuredSalinity(cropId, measuredEceDsm) {
  const profile = getCropEvidence(cropId);
  if (measuredEceDsm === null || measuredEceDsm === undefined || measuredEceDsm === "") {
    return { status: "unavailable", reason: "A laboratory soil ECe measurement is required." };
  }
  if (typeof measuredEceDsm !== "number" || !Number.isFinite(measuredEceDsm) || measuredEceDsm < 0 || measuredEceDsm > 100) {
    return { status: "invalid", reason: "ECe must be a finite value in dS/m between 0 and 100." };
  }
  const ref = profile?.salinity;
  if (!ref || ref.status !== "published_reference" || ref.eceThresholdDsm === null || ref.slopePctPerDsm === null) {
    return { status: "unsupported", reason: ref?.note ?? "No matching FAO numeric ECe response." };
  }
  const excessDsm = Math.max(0, measuredEceDsm - ref.eceThresholdDsm);
  return {
    status: excessDsm > 0 ? "above_reference_threshold" : "within_reference_threshold",
    measuredEceDsm, thresholdDsm: ref.eceThresholdDsm, slopePctPerDsm: ref.slopePctPerDsm,
    excessDsm, outcome: ref.outcome, sourceId: ref.sourceId,
    illustrativeRelativeYieldPct: Math.max(0, Math.round((100 - ref.slopePctPerDsm * excessDsm) * 10) / 10),
    caveat: "FAO reference response for the stated outcome, not a field-specific yield prediction or a salinity measurement."
  };
}

/**
 * Crop ETc from daily FAO-56 ET0 and a full, explicitly specified crop calendar.
 * Does not calculate effective rainfall, irrigation scheduling or gross water withdrawals.
 * Missing dates / stage lengths / matching reference coefficients return unavailable, never fabricated values.
 */
export function projectCropEtc(cropId, { drivers, sowingDate, stageLengthsDays } = {}) {
  const profile = getCropEvidence(cropId);
  const kc = profile?.cropCoefficient;
  if (!kc || kc.status !== "published_reference" || [kc.kcIni, kc.kcMid, kc.kcEnd].some((v) => !Number.isFinite(v))) {
    return { status: "unavailable", reason: "Crop-stage Kc has not been verified for this crop's use." };
  }
  if (!Array.isArray(stageLengthsDays) || stageLengthsDays.length !== 4 || !stageLengthsDays.every((v) => Number.isInteger(v) && v > 0)) {
    return { status: "unavailable", reason: "Explicit positive initial/development/mid/late stage lengths are required." };
  }
  if (!/^\d{4}-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])$/.test(sowingDate ?? "")) {
    return { status: "unavailable", reason: "An explicit planting date (YYYY-MM-DD) is required to use the reference weather." };
  }
  const start = Date.parse(sowingDate);
  if (!Number.isFinite(start) || new Date(start).toISOString().slice(0, 10) !== sowingDate || !drivers?.daily) {
    return { status: "unavailable", reason: "Invalid planting date or missing reference ET weather." };
  }
  const byDate = new Map(drivers.daily.map((row) => [row.date, row]));
  const [ini, dev, mid, late] = stageLengthsDays;
  const total = ini + dev + mid + late;
  if (total > 365) return { status: "unavailable", reason: "Stage lengths exceed one year." };
  let sum = 0;
  for (let i = 0; i < total; i++) {
    const date = new Date(start + 86400000 * i).toISOString().slice(0, 10);
    const row = byDate.get(date);
    if (!row) return { status: "unavailable", reason: "Complete daily weather is missing for the specified crop window." };
    const et0 = dailyReferenceEt(row, drivers.lat, drivers.elevationM);
    if (!Number.isFinite(et0)) return { status: "unavailable", reason: "A required ET0 driver is missing or invalid." };
    let currentKc;
    if (i < ini) currentKc = kc.kcIni;
    else if (i < ini + dev) currentKc = kc.kcIni + (kc.kcMid - kc.kcIni) * ((i - ini + 1) / dev);
    else if (i < ini + dev + mid) currentKc = kc.kcMid;
    else currentKc = kc.kcMid + (kc.kcEnd - kc.kcMid) * ((i - ini - dev - mid + 1) / late);
    sum += et0 * currentKc;
  }
  return {
    status: "reference_scenario", cropId, sowingDate, stageLengthsDays,
    etcMm: Math.round(sum * 100) / 100, unit: "mm/crop-cycle",
    referenceSourceId: kc.sourceId, et0Method: "FAO-56",
    caveat: "Reference ETc (not gross irrigation demand or measured water). Calendar/cultivar/wetting adjustments and effective rainfall are not validated."
  };
}

/**
 * Returns crop-level evidence structured into the 5 NASA Strategy Explanation elements.
 */
export function explainCropDecisionEvidence(cropId, { measuredEceDsm = null, heatStressDays = 0 } = {}) {
  const profile = getCropEvidence(cropId);
  const salt = assessMeasuredSalinity(cropId, measuredEceDsm);

  return {
    cropId,
    whySuggested: {
      en: profile?.agronomicRoleEn ?? "Adapted crop candidate for target seasonal window.",
      ar: profile?.agronomicRoleAr ?? "محصول مناسب للعروة الزراعية المستهدفة.",
    },
    supportingEvidence: {
      en: `FAO salinity threshold ${profile?.salinity?.eceThresholdDsm ?? "N/A"} dS/m; Summer heat tolerance rating: ${heatStressDays > 14 ? "High heat exposure area" : "Moderate heat exposure area"}.`,
      ar: `حد الملوحة المرجعي من الفاو ${profile?.salinity?.eceThresholdDsm ?? "غير متاح"} ديسيسيمنز/م؛ التعرض للإجهاد الحراري: ${heatStressDays > 14 ? "منطقة معرضة لموجات حر شديدة" : "منطقة معتدلة الإجهاد الحراري"}.`,
      salinityStatus: salt.status,
    },
    expectedBenefits: {
      en: profile?.benefitsEn ?? "Contributes to rotational water efficiency or soil fertility enhancement.",
      ar: profile?.benefitsAr ?? "يساهم في ترشيد المياه أو تحسين خصوبة التربة وتوازن النيتروجين.",
    },
    informationGaps: {
      en: "Requires laboratory soil test for ECe and on-site pest inspection.",
      ar: "يتطلب تحليلاً معملياً لملوحة التربة ECe وفحصاً ميدانياً لخلو الأرض من النيماتودا والآفات.",
    },
    risksLocalReview: {
      en: "Confirm certified seed variety availability and district water rotation schedule with local agricultural extension.",
      ar: "راجع الجمعية الزراعية أو المهندس المحلي للتأكد من توافر التقاوي ومناوبات الترعة.",
      decisionSupportDisclaimer: "Advisory decision support only — not a substitute for local agronomist consultation.",
    },
  };
}
