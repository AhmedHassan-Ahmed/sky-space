export function explainStrategy(strategy, data, inputs, metrics) {
  const reasons = [];
  const add = (en, ar) => reasons.push({ en, ar });
  if (Object.values(data.sources ?? {}).some((s) => s.kind !== "observed"))
    add(
      "Low: at least one source is an illustrative fallback.",
      "منخفض: أحد المصادر على الأقل بديل توضيحي.",
    );
  if (inputs.landType === "new_sandy")
    add(
      "Desert-fringe land scenario: pixel mixing is possible, not detected or measured.",
      "سيناريو أرض على حافة الصحراء: اختلاط البكسل محتمل ولم يُقَس.",
    );
  if (metrics.summerObservationDays < 153)
    add(
      "Summer climate observations are incomplete.",
      "أرصاد المناخ الصيفية غير مكتملة.",
    );
  if (metrics.autumnMissingDays > 0)
    add(
      `${metrics.autumnMissingDays} autumn days lack accepted NDVI support.`,
      `${metrics.autumnMissingDays} يوم خريفي دون رصد NDVI مقبول.`,
    );
  if (metrics.canopyAnomaly?.value === null)
    add(
      "Historical canopy anomaly is unavailable.",
      "شذوذ الغطاء النباتي التاريخي غير متاح.",
    );
  if (strategy.conditionalNili)
    add(
      "Nili crop dates are conditional and need local scheduling.",
      "مواعيد الغطاء النيلي مشروطة وتحتاج تخطيطاً محلياً.",
    );
  const confidence = Object.values(data.sources ?? {}).some(
    (s) => s.kind !== "observed",
  )
    ? "low"
    : reasons.length
      ? "medium"
      : "high";
  const ndviSource =
    data.sources?.ndvi?.kind === "observed"
      ? "MODIS NDVI (250m composite)"
      : "Illustrative NDVI fixture";
  const ndviSourceAr =
    data.sources?.ndvi?.kind === "observed"
      ? "أقمار MODIS NDVI (دقة ٢٥٠م)"
      : "بيانات NDVI توضيحية";
  const source =
    data.sources?.climate?.kind === "observed"
      ? "NASA POWER (Agroclimatology)"
      : "Illustrative climate fixture";
  const sourceAr =
    data.sources?.climate?.kind === "observed"
      ? "ناسا POWER للمناخ الزراعي"
      : "بيانات مناخ توضيحية";

  const summer = strategy.crops.find((c) => c.season === "Seifi") || strategy.crops[0];
  const winter = strategy.crops.find((c) => c.season === "Shitwi") || strategy.crops[0];
  const cover = strategy.crops.find((c) => c.season === "Nili");

  // 1. Why it was suggested (سبب الاختيار)
  const isWaterSmart = strategy.id.includes("water") || strategy.badge.toLowerCase().includes("water");
  const isSoilBuilder = strategy.id.includes("soil") || strategy.badge.toLowerCase().includes("soil");

  let whySuggestedEn = "";
  let whySuggestedAr = "";

  if (isWaterSmart) {
    whySuggestedEn = `Selected to minimize seasonal evapotranspiration under thermal stress. Alternating drought-hardy summer crops (${summer?.nameEn ?? "Sorghum"}) with winter staple (${winter?.nameEn ?? "Wheat"}) moderates gross irrigation demand while keeping productive canopy coverage during extreme heat events.`;
    whySuggestedAr = `تم اختيار هذه الدورة لتقليل الفاقد التبخري تحت الإجهاد الحراري. التبديل بمحصول صيفي متأقلم مع الجفاف والحرارة (${summer?.nameAr ?? "ذرة رفيعة"}) مع المحصول الشتوي (${winter?.nameAr ?? "قمح"}) يقلل استهلاك المياه الكلي مع ضمان استمرار الغطاء النباتي في موجات القيظ.`;
  } else if (isSoilBuilder) {
    whySuggestedEn = `Designed for biological nitrogen fixation and soil organic restoration. Introducing legumes (${winter?.nameEn ?? "Berseem"} / ${cover?.nameEn ?? "Cowpea"}) enriches residual nitrogen following exhaustive cereals, breaks nematode/pathogen life cycles, and guards against salinity-induced nutrient lockout.`;
    whySuggestedAr = `صُممت لتعزيز تثبيت النيتروجين الحيوي واستعادة خصوبة التربة. إدخال البقوليات (${winter?.nameAr ?? "برسيم"} / ${cover?.nameAr ?? "لوبيا"}) يثري مخزون النيتروجين العضوي بعد الحبوب المجهدة، ويكسر دورات الآفات وأمراض التربة، ويحد من أضرار تراكم الأملاح.`;
  } else {
    whySuggestedEn = `Baseline crop sequence representing the conventional rotation (${winter?.nameEn ?? "Wheat"} followed by ${summer?.nameEn ?? "Maize"}). Serves as the benchmark for water demand, soil nutrient balance, and exposure to summer heatwaves.`;
    whySuggestedAr = `الدورة الزراعية المعتادة (${winter?.nameAr ?? "قمح"} متبوعاً بـ ${summer?.nameAr ?? "ذرة شامية"}). تُستخدم كنقطة مقارنة مرجعية لحساب استهلاك المياه، وتوازن النيتروجين، ومدى التعرض لموجات الحر.`;
  }

  // 2. Supporting Evidence (الدليل من بيانات ناسا)
  const supportingEvidenceEn = `${source}: Detected ${metrics.heatStressDays} days with maximum temperatures > 38°C in May–September (${metrics.julyHeatDays ?? 0} days in July). ${ndviSource}: Identified autumn bare-soil / low-cover duration of ${metrics.bareSoilDays} days (${metrics.autumnMissingDays ?? 0} days unobserved). Modeled summer heat threshold: ${summer?.heatThresholdC ?? 38}°C.`;
  const supportingEvidenceAr = `${sourceAr}: تم رصد ${metrics.heatStressDays} يوماً تجاوزت فيها الحرارة العظمى ٣٨°م من مايو إلى سبتمبر (${metrics.julyHeatDays ?? 0} يوماً في يوليو). ${ndviSourceAr}: رصد فترة انكشاف وانخفاض غطاء خريفي لمدة ${metrics.bareSoilDays} يوماً (${metrics.autumnMissingDays ?? 0} يوماً دون رصد). حد التحمل الحراري في الدليل: ${summer?.heatThresholdC ?? 38}°م.`;

  // 3. Expected Benefits (الفوائد المتوقعة)
  const waterSavedTextEn = strategy.waterSavedM3Feddan > 0
    ? `Saves ~${strategy.waterSavedM3Feddan} m³/feddan (${strategy.waterSavedPercent}%) compared to baseline`
    : "Maintains standard seasonal irrigation baseline";
  const waterSavedTextAr = strategy.waterSavedM3Feddan > 0
    ? `توفير حوالي ${strategy.waterSavedM3Feddan} م³/فدان (${strategy.waterSavedPercent}%) مقارنة بالدورة الحالية`
    : "تحافظ على معدل الري المعتاد للمقارنة";

  const expectedBenefitsEn = `${waterSavedTextEn}. Net soil nitrogen score: ${strategy.nitrogenBalance > 0 ? "+" : ""}${strategy.nitrogenBalance}. Reduces bare-soil exposure by providing green canopy cover, breaking monoculture pest cycles, and conserving root-zone soil moisture.`;
  const expectedBenefitsAr = `${waterSavedTextAr}. مؤشر النيتروجين المقدر: ${strategy.nitrogenBalance > 0 ? "+" : ""}${strategy.nitrogenBalance}. حماية التربة من الانكشاف والتصحر بزيادة الغطاء النباتي، كسر دورة توطن الآفات، والحفاظ على رطوبة التربة الحيوية.`;

  // 4. Information Gaps (فجوات البيانات)
  const informationGapsEn = "Orbital observations cannot detect: (1) Saturated-paste root-zone salinity (ECe) at depth — a laboratory soil extract is required; (2) Hyper-local pest, nematode, or root-rot presence in the field; (3) Daily farmgate market price variations across Egyptian governorates; (4) Sub-plot canal siltation or drainage micro-variations.";
  const informationGapsAr = "ما لا يراه القمر الصناعي (فجوات البيانات): (١) قياس ملوحة التربة المعملية الدقيقة (ECe) على عمق الجذور — يلزم فحص معملي أرضي؛ (٢) انتشار الآفات أو النيماتودا أو أعفان الجذور الموضعية في الحقل؛ (٣) التغيرات اليومية لأسعار بيع المحاصيل في أسواق المحافظة؛ (٤) انسداد المراوي أو تفاوت الصرف الزراعي داخل القطعة.";

  // 5. Risks requiring local review (المخاطر والتنبيه الإرشادي)
  const risksLocalReviewEn = "Risks requiring agronomist & farmer review: (1) Verify local cultivar maturity period to prevent date conflicts between summer harvest and winter sowing; (2) Confirm availability of certified seed and local canal rotation turns. ADVISORY NOTICE: FieldShift / Sky Space is an orbital decision-support aid to guide agronomic planning and is NOT a substitute for on-site agronomist consultation and farmer local field experience.";
  const risksLocalReviewAr = "المخاطر التي تتطلب مراجعة محلية: (١) التأكد من دورة نضج الأصناف المتاحة لتفادي تداخل مواعيد حصاد الصيفي وزراعة الشتوي؛ (٢) التأكد من توافر التقاوي المعتمدة ومناوبات الري المحلية. تنبيه إرشادي إلزامي: هذا النظام أداة دعم قرار استرشادية تعتمد على الأقمار الصناعية والنماذج البيئية، وليست بديلاً عن المعاينة الميدانية للمهندس الزراعي وخبرة المزارع الميدانية.";

  return {
    why: {
      en: `${whySuggestedEn} ${supportingEvidenceEn}`,
      ar: `${whySuggestedAr} ${supportingEvidenceAr}`,
    },
    // The 5 mandatory NASA Strategy Explanation schema elements:
    whySuggested: {
      en: whySuggestedEn,
      ar: whySuggestedAr,
    },
    supportingEvidence: {
      en: supportingEvidenceEn,
      ar: supportingEvidenceAr,
      metrics: {
        heatStressDays: metrics.heatStressDays,
        julyHeatDays: metrics.julyHeatDays ?? 0,
        bareSoilDays: metrics.bareSoilDays,
        salinityRisk: metrics.salinityRisk,
        nitrogenBalance: strategy.nitrogenBalance,
        grossWaterM3Feddan: strategy.grossWaterM3Feddan,
      },
    },
    expectedBenefits: {
      en: expectedBenefitsEn,
      ar: expectedBenefitsAr,
      waterSavedM3Feddan: strategy.waterSavedM3Feddan ?? 0,
      waterSavedPercent: strategy.waterSavedPercent ?? 0,
      nitrogenBalance: strategy.nitrogenBalance,
    },
    informationGaps: {
      en: informationGapsEn,
      ar: informationGapsAr,
      unseenFactors: [
        "Root-zone laboratory ECe at depth",
        "Local daily market farmgate prices",
        "Localized pest / fungal / nematode pressure",
        "Micro-topographical canal drainage",
      ],
    },
    risksLocalReview: {
      en: risksLocalReviewEn,
      ar: risksLocalReviewAr,
      requiresAgronomist: true,
      advisoryNotice: {
        en: "FieldShift / Sky Space is a decision-support aid, not a substitute for farmer experience or on-site agronomist consultation.",
        ar: "هذا النظام أداة دعم قرار استرشادية، وليست بديلاً عن خبرة المزارع أو المعاينة الميدانية للمهندس الزراعي.",
      },
    },
    confidence,
    confidenceReasons: reasons,
    confidenceMeaning: {
      en: "Heuristic data-support category, not a calibrated probability, field accuracy or agronomic approval.",
      ar: "فئة إرشادية لدعم البيانات وليست احتمالاً معايراً أو دقة حقلية أو اعتماداً زراعياً.",
    },
    checklist: strategy.crops.map((c) => ({
      en: c.riskNote,
      ar: c.riskNoteAr,
    })),
  };
}
