export const text = (lang, en, ar) => (lang === "ar" ? ar : en);

export const formatNumber = (value, lang = "en", options = {}) =>
  value == null
    ? "—"
    : new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-GB", {
        maximumFractionDigits: 1,
        ...options,
      }).format(value);

export const sourceLabel = (source, lang) => {
  const labels = {
    live: ["Retrieved source data", "بيانات مصدر مسترجعة"],
    cached: ["Cached source data", "بيانات مصدر محفوظة"],
    snapshot: ["Audited historical snapshot", "نسخة تاريخية مدققة"],
    demo: ["Illustrative demo fixture", "بيانات تجريبية توضيحية"],
  };
  const label = labels[source?.status] ?? labels.demo;
  return text(lang, ...label);
};

/**
 * Simplified Scientific Glossary for Farmers (قاموس المصطلحات الزراعية المبسط)
 * Translates complex NASA Earth observation parameters into intuitive everyday language for Egyptian farmers.
 */
export const SCIENTIFIC_GLOSSARY = {
  evapotranspiration: {
    key: "evapotranspiration",
    symbol: "ET₀",
    nameEn: "Evapotranspiration (ET₀)",
    nameAr: "البخر-نتح (استهلاك المية)",
    simpleConceptEn: "Water lost to atmosphere from soil and plants (mm/day).",
    simpleConceptAr: "كمية المية اللي الأرض والزرع بيفقدوها في الجو بسبب الحر والشمس والهوا.",
    farmerExplanationEn:
      "Measures daily crop thirst in millimeters. High ET₀ means sun and wind are pulling water rapidly from your field, requiring timely irrigation to prevent wilting.",
    farmerExplanationAr:
      "بتقيس عطش الزرع بالمليمتر كل يوم؛ كل ما الرقم ده يعلى، معناه إن الشمس والهوا بيسحبوا المية بسرعة من الغيط، والزرع محتاج ري في ميعاده عشان ميعطش.",
    unit: "mm/day",
  },

  ndvi: {
    key: "ndvi",
    symbol: "NDVI",
    nameEn: "Vegetation Index (NDVI)",
    nameAr: "مؤشر الغطاء النباتي (خضار الزرع)",
    simpleConceptEn: "Satellite greenness and crop canopy health (0.0 to 1.0).",
    simpleConceptAr: "مقياس لقوة خضار وصحة أوراق الزرع من القمر الصناعي.",
    farmerExplanationEn:
      "Calculated from reflected sunlight. Values below 0.20 indicate bare or dry soil; values above 0.60 show dense, healthy, thriving crop foliage.",
    farmerExplanationAr:
      "بيتحسب من انعكاس الشمس على الورق؛ لو أقل من ٠.٢٠ يبقى الأرض بور أو مكشوفة للشمس، ولو عدى ٠.٦٠ يبقى الغيط مخضر ومزدهر وصحته كويسة جداً.",
    unit: "ratio (0 to 1)",
  },

  soilMoistureAnomaly: {
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

  bareSoilWindow: {
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

  nitrogenFixation: {
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

  salinityEce: {
    key: "salinityEce",
    symbol: "ECe",
    nameEn: "Soil Salinity (ECe)",
    nameAr: "ملوحة التربة المعملية (ECe)",
    simpleConceptEn: "Laboratory salt concentration in saturated soil extract (dS/m).",
    simpleConceptAr: "درجة ملوحة الطين في المعمل؛ بتوضح مدى صعوبة امتصاص الجذور للمية.",
    farmerExplanationEn:
      "Values above 4 dS/m create osmotic resistance, making it hard for crop roots to absorb water even in wet soil. Requires salt-tolerant varieties and leaching.",
    farmerExplanationAr:
      "لو الرقم عدى ٤ ديسيسيمنز/متر، الملوحة بتمسك المية وتمنع الجذور تشرب بسهولة حتى لو الأرض مروية؛ ساعتها بنحتاج نزرع محاصيل تستحمل الملوحة زي الشعير أو الذرة الرفيعة ونغسل الأرض.",
    unit: "dS/m",
  },

  heatStressDays: {
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
};

/**
 * Helper to fetch a glossary term with localized fields.
 */
export function getGlossaryTerm(key, lang = "en") {
  const item = SCIENTIFIC_GLOSSARY[key];
  if (!item) return null;
  const isAr = lang === "ar";
  return {
    key: item.key,
    symbol: item.symbol,
    name: isAr ? item.nameAr : item.nameEn,
    simpleConcept: isAr ? item.simpleConceptAr : item.simpleConceptEn,
    farmerExplanation: isAr ? item.farmerExplanationAr : item.farmerExplanationEn,
    unit: item.unit,
  };
}

export function getAllGlossaryTerms(lang = "en") {
  return Object.keys(SCIENTIFIC_GLOSSARY).map((k) => getGlossaryTerm(k, lang));
}
