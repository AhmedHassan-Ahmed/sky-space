import { computeReferenceEt } from "./referenceEt.js";
const valid = (n) => typeof n === "number" && Number.isFinite(n);
const DAY = 86400000;
export const clamp = (n, low, high) => Math.max(low, Math.min(high, n));

export function computeFieldIndices(data, inputs, catalog) {
  // Derive the data year from the payload; fall back to last complete calendar year.
  const year =
    data.year ??
    (Number(data.climateDaily?.[0]?.date?.slice(0, 4)) ||
      new Date().getUTCFullYear() - 1);
  const seasons = {
    Shitwi: [11, 12, 1, 2, 3, 4],
    Seifi: [5, 6, 7, 8, 9],
    Nili: [9, 10, 11],
  };
  const daily = data.climateDaily ?? [];
  const seasonalEnergy = Object.fromEntries(
    Object.entries(seasons).map(([season, months]) => {
      const points = daily.filter((p) =>
        months.includes(Number(p.date.slice(5, 7))),
      );
      const values = points
        .map((p) => p.evapotranspiration)
        .filter((v) => valid(v) && v > -900);
      return [
        season,
        {
          sum: values.length
            ? Number(values.reduce((a, b) => a + b, 0).toFixed(6))
            : null,
          validDays: values.length,
          expectedDays: { Shitwi: 181, Seifi: 153, Nili: 91 }[season],
          unit: "MJ/m²",
          window:
            season === "Shitwi"
              ? `Jan–Apr + Nov–Dec ${year} (calendar-year proxy, not a continuous crop season)`
              : season === "Seifi"
                ? `May–Sep ${year}`
                : `Sep–Nov ${year} (overlaps other windows)`,
        },
      ];
    }),
  );
  const summer = daily.filter(
    (p) =>
      Number(p.date.slice(5, 7)) >= 5 &&
      Number(p.date.slice(5, 7)) <= 9 &&
      valid(p.tmax) &&
      p.tmax > -900,
  );
  const temps = daily.length
    ? summer.map((p) => p.tmax)
    : (data.summerMaxTemps ?? []).filter((v) => valid(v) && v > -900);
  const heatStressDays = temps.filter((t) => t > 38).length;
  const julyHeatDays = summer.filter(
    (p) => p.date.slice(5, 7) === "07" && p.tmax > 38,
  ).length;
  const points = [...(data.ndviSeries ?? [])].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const runs = [];
  let run = null;
  let observed = 0;
  const seen = new Set();
  for (const p of points) {
    if (seen.has(p.date)) throw new Error("Duplicate NDVI composite date");
    seen.add(p.date);
    const start = Date.parse(p.date);
    const from = Math.max(start, Date.UTC(year, 8, 1));
    const to = Math.min(start + 16 * DAY, Date.UTC(year, 11, 1));
    if (!Number.isFinite(start) || to <= from) continue;
    const usable = valid(p.ndvi) && p.ndvi >= -0.2 && p.ndvi <= 1;
    if (usable) observed += (to - from) / DAY;
    if (!usable || p.ndvi >= 0.22) {
      run = null;
      continue;
    }
    if (run && run.endMs === from) {
      run.endMs = to;
      run.days += (to - from) / DAY;
      run.composites++;
    } else {
      run = {
        startMs: from,
        endMs: to,
        days: (to - from) / DAY,
        composites: 1,
      };
      runs.push(run);
    }
  }
  const bareSoilRuns = runs.map((r) => ({
    start: new Date(r.startMs).toISOString().slice(0, 10),
    end: new Date(r.endMs).toISOString().slice(0, 10),
    days: r.days,
    composites: r.composites,
  }));
  const bareSoilDays = Math.max(0, ...runs.map((r) => r.days));

  // Detailed Bare-Field & Vulnerability Windows analysis across the year
  const allBareRuns = [];
  let currentBare = null;
  for (const p of points) {
    const start = Date.parse(p.date);
    const usable = valid(p.ndvi) && p.ndvi >= -0.2 && p.ndvi <= 1;
    const isBare = usable && p.ndvi < 0.22;
    const to = start + 16 * DAY;
    if (isBare) {
      if (currentBare && currentBare.endMs === start) {
        currentBare.endMs = to;
        currentBare.days += 16;
        currentBare.composites++;
        currentBare.minNdvi = Math.min(currentBare.minNdvi, p.ndvi);
      } else {
        currentBare = {
          startMs: start,
          endMs: to,
          days: 16,
          composites: 1,
          minNdvi: p.ndvi,
        };
        allBareRuns.push(currentBare);
      }
    } else {
      currentBare = null;
    }
  }

  const vulnerabilityRuns = allBareRuns.map((r) => {
    const startDate = new Date(r.startMs).toISOString().slice(0, 10);
    const endDate = new Date(r.endMs).toISOString().slice(0, 10);
    const windowDaily = daily.filter((d) => d.date >= startDate && d.date <= endDate);
    const tmaxs = windowDaily.map((d) => d.tmax).filter((v) => valid(v) && v > -900);
    const maxTempC = tmaxs.length ? Math.max(...tmaxs) : null;
    const avgTempC = tmaxs.length ? Math.round((tmaxs.reduce((a, b) => a + b, 0) / tmaxs.length) * 10) / 10 : null;
    const startMonth = Number(startDate.slice(5, 7));

    const isAutumn = startMonth >= 7 && startMonth <= 10;
    const isSpringSummer = startMonth >= 3 && startMonth <= 6;

    const recommendedCoverCrops = isAutumn
      ? [
          {
            id: "berseem_fahl",
            nameEn: "Berseem Fahl (Catch Clover)",
            nameAr: "برسيم فحل (عروة سريعة)",
            durationDays: 65,
            benefitEn: "Rapid single-cut forage; fixes atmospheric nitrogen (30–45 kg N/fed) and protects soil surface from wind erosion before wheat.",
            benefitAr: "حشة واحدة سريعة (٦٠–٧٠ يوماً)؛ يثبت ٣٠–٤٥ كجم نيتروجين/فدان ويحمي التربة من الإشعاع والرياح قبل القمح.",
          },
          {
            id: "cowpea_nili",
            nameEn: "Nili Forage Cowpea",
            nameAr: "لوبيا علف نيلية",
            durationDays: 70,
            benefitEn: "High heat and drought tolerance; establishes dense vegetative cover to suppress weeds and reduce soil moisture loss.",
            benefitAr: "تحمل فائق للحرارة والجفاف؛ غطاء ورقي كثيف يكتم الحشائش ويقلل تبخر رطوبة التربة.",
          },
        ]
      : isSpringSummer
      ? [
          {
            id: "sorghum_cover",
            nameEn: "Short-cycle Forage Sorghum",
            nameAr: "سورجم علف قصير",
            durationDays: 55,
            benefitEn: "Tolerates high summer temperatures, absorbs residual salinity, and prevents solar baking of the topsoil.",
            benefitAr: "يتحمل القيظ الشديد ويمتص الأملاح السطحية ويمنع تشقق وتصلب التربة في الصيف.",
          },
        ]
      : [
          {
            id: "tillage_radish",
            nameEn: "Catch Legume / Cover Crop",
            nameAr: "محصول تغطية بقولي",
            durationDays: 60,
            benefitEn: "Short-duration ground cover to prevent nutrient leaching and maintain active root microbiome.",
            benefitAr: "تغطية سريعة للأرض تمنع غسيل العناصر الغذائية وتحافظ على حيوية الميكروبيوم في التربة.",
          },
        ];

    const isHighThermalStress = (maxTempC ?? 0) >= 36;
    const severity = r.days >= 32 && isHighThermalStress ? "severe" : r.days >= 20 ? "moderate" : "low";

    return {
      startDate,
      endDate,
      days: r.days,
      composites: r.composites,
      minNdvi: Math.round(r.minNdvi * 1000) / 1000,
      maxTempC,
      avgTempC,
      severity,
      riskEn: `${r.days} days bare-soil exposure (NDVI < 0.22)${maxTempC ? ` with peak temperatures up to ${maxTempC}°C` : ""}; prone to wind erosion, organic matter breakdown, and rapid moisture depletion.`,
      riskAr: `${r.days} يوماً من انكشاف التربة (NDVI أقل من ٠.٢٢)${maxTempC ? ` مع حرارة عظمى وصلت لـ ${maxTempC}°م` : ""}؛ مما يعرض الأرض للتآكل الهوائي وتفكك المادة العضوية وفقدان الرطوبة السريع.`,
      recommendedCoverCrops,
    };
  });

  const maxConsecutiveBareDays = Math.max(0, ...allBareRuns.map((r) => r.days));
  const hasSevereVulnerability = vulnerabilityRuns.some((v) => v.severity === "severe");
  const overallVulnerabilityLevel = hasSevereVulnerability ? "severe" : maxConsecutiveBareDays >= 20 ? "moderate" : "low";

  const bareFieldVulnerability = {
    detected: allBareRuns.length > 0 && maxConsecutiveBareDays >= 16,
    totalBareDays: allBareRuns.reduce((sum, r) => sum + r.days, 0),
    maxConsecutiveBareDays,
    overallLevel: overallVulnerabilityLevel,
    runs: vulnerabilityRuns,
    summaryEn: maxConsecutiveBareDays >= 20
      ? `Detected ${maxConsecutiveBareDays}-day bare-soil window. Soil is exposed to thermal degradation and erosion. Introducing a short-duration cover crop (Berseem Fahl or Cowpea) is strongly recommended.`
      : "Field maintains acceptable canopy coverage throughout the seasonal transitions.",
    summaryAr: maxConsecutiveBareDays >= 20
      ? `تم رصد نافذة انكشاف للتربة مدتها ${maxConsecutiveBareDays} يوماً. الأرض معرضة لفقدان الرطوبة والتآكل. نوصي بشدة بزراعة محصول تغطية سريع (برسيم فحل أو لوبيا علف).`
      : "الأرض تحتفظ بغطاء نباتي كافٍ طوال فترات التعاقب الزراعي.",
  };
  const summerNdvi = points.filter(
    (p) =>
      p.date.slice(5, 7) >= "05" &&
      p.date.slice(5, 7) <= "09" &&
      valid(p.ndvi) &&
      p.ndvi >= -0.2 &&
      p.ndvi <= 1,
  );
  const peakSummerNdvi = summerNdvi.length
    ? Math.max(...summerNdvi.map((p) => p.ndvi))
    : null;
  const baselineYearsSeen = new Set();
  const baseline = (data.ndviHistory?.years ?? []).filter((y) => {
    if (
      !y.accepted ||
      y.year < year - 5 ||
      y.year >= year ||
      !valid(y.peak) ||
      baselineYearsSeen.has(y.year)
    )
      return false;
    baselineYearsSeen.add(y.year);
    return true;
  });
  let anomaly = {
    value: null,
    status: "unavailable",
    reason:
      "At least three accepted historical same-pixel summers and eight current summer composites are required.",
    baselineYears: baseline.map((y) => y.year),
    peakSummerNdvi,
  };
  if (baseline.length >= 3 && summerNdvi.length >= 8 && valid(peakSummerNdvi)) {
    const mean = baseline.reduce((s, y) => s + y.peak, 0) / baseline.length;
    const sd = Math.sqrt(
      baseline.reduce((s, y) => s + (y.peak - mean) ** 2, 0) /
        (baseline.length - 1),
    );
    anomaly = {
      ...anomaly,
      mean,
      standardDeviation: sd,
      value: sd > 1e-8 ? (peakSummerNdvi - mean) / sd : null,
      status: sd > 1e-8 ? "available" : "unavailable",
      reason:
        sd > 1e-8
          ? "Small-sample peak anomaly; negative values do not establish water or heat stress."
          : "Historical variability is zero; z-score undefined.",
    };
  }
  const ph = data.soil?.phh2o;
  const clay = data.soil?.clay;
  const salinityRisk =
    valid(ph) && valid(clay)
      ? Math.round(
          clamp(
            15 +
              Math.max(0, ph - 8) * 35 +
              (clay > 40 ? 15 : 0) +
              (inputs.canalPosition === "tail" ? 12 : 0) +
              ({ none: 0, moderate: 18, high: 35 }[inputs.salinityLevel] ?? 0),
            0,
            100,
          ),
        )
      : null;
  const current = [inputs.currentWinterId, inputs.currentSummerId].map((id) =>
    catalog.find((c) => c.id === id),
  );
  const baselineNitrogen = current.every(Boolean)
    ? current.reduce((sum, c) => sum + c.nitrogenScore, 0)
    : null;
  const measuredSoil = data.sources?.soil?.kind === "observed";
  // Soil concentrations are reported alongside the ordinal balance; no calibrated conversion exists.
  const nitrogen = {
    cropBalance: baselineNitrogen,
    soilNitrogenGkg: measuredSoil ? (data.soil?.nitrogen ?? null) : null,
    soilOrganicCarbonGkg: measuredSoil ? (data.soil?.soc ?? null) : null,
    adjustedValue: null,
    reason:
      "Concentrations in g/kg cannot calibrate an ordinal crop index without a validated response model.",
    lowCarbonContext:
      measuredSoil && valid(data.soil?.soc) ? data.soil.soc < 10 : null,
  };
  return {
    seasonalEnergy,
    referenceEt0: computeReferenceEt(data.referenceEtDrivers),
    heatStressDays,
    julyHeatDays,
    summerObservationDays: temps.length,
    bareSoilDays,
    bareSoilTotalDays: runs.reduce((s, r) => s + r.days, 0),
    bareSoilRuns,
    bareFieldVulnerability,
    autumnObservedDays: Math.min(91, observed),
    autumnMissingDays: Math.max(0, 91 - observed),
    canopyAnomaly: anomaly,
    salinityRisk,
    salinityStatus: measuredSoil
      ? "screening"
      : "illustrative: synthetic soil fallback",
    nitrogen,
    soilOrganicCarbon: data.soil?.soc ?? null,
    rootZoneWetnessAvg: data.avgRootWetness ?? null,
  };
}
