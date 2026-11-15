"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Lang = "ar" | "en";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.tour": { ar: "جولة إرشادية", en: "Guided Tour" },
  "nav.markField": { ar: "رسم الحقل", en: "Mark Field" },
  "nav.drawing": { ar: "جاري الرسم...", en: "Drawing..." },
  "nav.signIn": { ar: "تسجيل الدخول", en: "Sign In" },
  "nav.signOut": { ar: "تسجيل الخروج", en: "Sign Out" },
  "nav.search": { ar: "ابحث عن قرية، مركز، أو مزرعة...", en: "Search farm, village, or coordinates..." },
  "nav.go": { ar: "بحث", en: "Go" },
  "nav.locateMe": { ar: "موقعي الحالي", en: "Locate Me" },
  "nav.step1": { ar: "١. تحديد الحقل", en: "1. Mark Field" },
  "nav.step2": { ar: "٢. بيانات المزرعة", en: "2. Farm Inputs" },
  "nav.step3": { ar: "٣. خطة المحاصيل", en: "3. Crop Plan" },
  "nav.brand": { ar: "سكاي سبيس", en: "Sky Space" },
  "nav.brandSub": { ar: "ذكاء الأقمار الصناعية الزراعي", en: "Satellite Crop Intelligence" },

  // Dashboard Stage & Views
  "dash.earth3d": { ar: "مجسم الأرض 3D", en: "3D Earth" },
  "dash.map2d": { ar: "خريطة تفاعلية 2D", en: "2D Map" },
  "dash.step1Title": { ar: "الخطوة ١ من ٣ • حدد موقع أرضك", en: "Step 1 of 3 • Find & Mark Your Land" },
  "dash.step1DescGlobe": { ar: "ابحث عن منطقتك بالبحث أو الـ GPS أو تدوير المجسم، ثم ارسم حدود حقلك.", en: "Find your region by search, GPS, or globe—then mark your field." },
  "dash.step1DescMap": { ar: "حرك الخريطة إلى قطعة أرضك ثم اضغط على «رسم حقلي».", en: "Pan to your land parcel, then tap Mark My Field." },
  "dash.demoField": { ar: "حقل تجريبي", en: "Demo Field" },
  "dash.markMyField": { ar: "رسم حقلي", en: "Mark My Field" },
  "dash.markedReady": { ar: "تم تحديد الحقل بنجاح", en: "Marked Field Ready" },
  "dash.markNew": { ar: "رسم حقل جديد", en: "Mark New Field" },
  "dash.openCropPlan": { ar: "عرض خطة المحاصيل", en: "Open Crop Plan" },
  "dash.openInputs": { ar: "إدخال بيانات المزرعة", en: "Open Farm Inputs" },
  "dash.layersBtn": { ar: "طبقات ناسا والخرائط", en: "NASA & Map Layers" },
  "dash.baseMap": { ar: "الخريطة الأساسية", en: "Base Map" },
  "dash.satellite": { ar: "أقمار صناعية", en: "Satellite" },
  "dash.street": { ar: "شوارع وتضاريس", en: "Street Map" },
  "dash.nasaGibs": { ar: "صور ناسا اليومية (GIBS)", en: "NASA Daily Imagery (GIBS)" },
  "dash.layerTrueColor": { ar: "ألوان حقيقية (MODIS)", en: "True Color (MODIS)" },
  "dash.layerNdvi": { ar: "دليل الغطاء النباتي (NDVI)", en: "Vegetation Index (NDVI)" },
  "dash.opacity": { ar: "شفافية الطبقة", en: "Layer Opacity" },
  "dash.close": { ar: "إغلاق", en: "Close" },

  // Planner Modal — Header & Navigation
  "modal.title": { ar: "مخطط المحاصيل الذكي", en: "Smart Crop Planner" },
  "modal.subtitle": { ar: "يتم استخراج الإحداثيات والمساحة تلقائياً من خريطة الحقل. أكمل معطيات الحقل أدناه لبدء التحليل.", en: "Field coordinates and area are automatically acquired from your map polygon. Complete the farming parameters below." },
  "modal.location": { ar: "موقع الأرض (محدد تلقائياً)", en: "Land Location (Auto-detected)" },
  "modal.locationSub": { ar: "يتم ربط الإحداثيات ببيانات NASA POWER و MODIS و SoilGrids", en: "Coordinates linked to NASA POWER, MODIS, and SoilGrids" },
  "modal.live": { ar: "مباشر", en: "Live" },
  "modal.close": { ar: "إغلاق", en: "Close" },
  "modal.back": { ar: "رجوع", en: "Back" },
  "modal.redraw": { ar: "إعادة الرسم", en: "Redraw on Map" },
  "modal.viewMap": { ar: "معاينة الخريطة", en: "View Map" },
  "modal.analyze": { ar: "تحليل وتوليد الخطة", en: "Analyze & Generate Plan" },
  "modal.analyzing": { ar: "جاري تحليل بيانات القمر الصناعي...", en: "Analyzing satellite data..." },
  "modal.markAnother": { ar: "رسم حقل آخر", en: "Mark Another Field" },
  "modal.exportGeo": { ar: "تصدير GeoJSON", en: "Export GeoJSON" },
  "modal.viewOnGlobe": { ar: "عرض على مجسم الأرض / الخريطة", en: "View on 3D Globe / Map" },
  "modal.glossaryBtn": { ar: "قاموس المصطلحات", en: "Scientific Glossary" },

  // Planner Modal — Step 1 Inputs
  "input.lastCrop": { ar: "المحصول السابق في الأرض", en: "Last Crop in Field" },
  "input.lastCropTip": { ar: "يقوم النظام بفحص تاريخ المحاصيل لكسر دورات أمراض التربة والآفات.", en: "Engine screens rotation history to break soil-borne disease cycles." },
  "input.plantingDate": { ar: "تاريخ بدء الزراعة المستهدف", en: "Target Planting Start Date" },
  "input.targetWindow": { ar: "الموسم المستهدف: العروة الشتوية", en: "Target Window: Winter Season (Shitwi)" },
  "input.irrigation": { ar: "طريقة الري المستخدمة", en: "Irrigation Method" },
  "input.surface": { ar: "ري سطحي (غمر)", en: "Surface Irrigation" },
  "input.drip": { ar: "ري بالتنقيط", en: "Drip Irrigation" },
  "input.sprinkler": { ar: "ري بالرش", en: "Sprinkler Irrigation" },
  "input.waterAvail": { ar: "مدى توافر المياه ونوبات الترعة", en: "Water Availability & Canal Position" },
  "input.limited": { ar: "محدود (نهايات الترع)", en: "Limited (Canal Tail-end)" },
  "input.limitedTip": { ar: "خطر نقص أو تأخر مناوبات المياه", en: "Canal tail-end (deficit risk)" },
  "input.moderate": { ar: "متوسط (وسط الترعة)", en: "Moderate (Mid-Canal)" },
  "input.moderateTip": { ar: "إمدادات مائية منتظمة نسبياً", en: "Mid-canal (average supply)" },
  "input.abundant": { ar: "وفير (فم الترعة / آبار قوية)", en: "Abundant (Canal Head)" },
  "input.abundantTip": { ar: "وفرة مائية دائمة", en: "Canal head (plentiful supply)" },
  "input.objective": { ar: "الهدف الرئيسي للخطة الزراعية", en: "Primary Crop Plan Objective" },
  "input.saveWater": { ar: "توفير المياه ومواجهة الجفاف", en: "Save Irrigation Water" },
  "input.saveWaterDesc": { ar: "رفع كفاءة استهلاك المياه وتفضيل المحاصيل المقاومة للإجهاد المائي والحراري.", en: "Maximize irrigation water productivity and prioritize drought & heat-resilient crops." },
  "input.improveSoil": { ar: "تحسين خصوبة وصحة التربة", en: "Improve Soil Health & Nitrogen" },
  "input.improveSoilDesc": { ar: "تعويض النيتروجين الطبيعي بمحاصيل بقولية وزيادة المادة العضوية في التربة.", en: "Restore nitrogen index, enhance soil organic carbon, and include nitrogen-fixing legumes." },
  "input.efficiency": { ar: "الكفاءة", en: "Efficiency" },

  // Planner Modal — Step 2 Results & Diagnostics
  "report.title": { ar: "تقرير التشخيص الفضائي وتوصيات المحاصيل", en: "Satellite Diagnostics & Rotation Advisory" },
  "report.fieldOverview": { ar: "ملخص الحقل والأرصاد", en: "Field Overview & Remote Sensing" },
  "report.heatStress": { ar: "أيام الإجهاد الحراري", en: "Heat Stress Days (>38°C)" },
  "report.bareSoil": { ar: "أيام الأرض المكشوفة", en: "Bare Soil Exposure Days" },
  "report.canopy": { ar: "انحراف الغطاء النباتي (NDVI)", en: "Canopy Anomaly (NDVI)" },
  "report.salinity": { ar: "مؤشر خطر الملوحة", en: "Salinity Risk Index" },
  "report.soilCarbon": { ar: "كربون التربة العضوي", en: "Soil Organic Carbon" },
  "report.rootWetness": { ar: "رطوبة الجذور (SMAP)", en: "Root-Zone Moisture (SMAP)" },
  "report.day": { ar: "يوم", en: "days" },

  // Scenario Simulator
  "scenario.title": { ar: "محاكي السيناريوهات المناخية والمائية", en: "Climate & Water Scenario Simulator" },
  "scenario.desc": { ar: "اختبر تأثير الارتفاع الحاد في درجات الحرارة أو انخفاض حصص المياه على ملاءمة المحاصيل وتصنيف الدورات:", en: "Simulate extreme thermal spikes or water quota reductions to observe how rotation rankings adapt:" },
  "scenario.temp": { ar: "تغير درجة الحرارة", en: "Temp. Shift" },
  "scenario.water": { ar: "حصة مياه الري", en: "Water Allocation" },
  "scenario.reset": { ar: "إعادة ضبط للمعدل الطبيعي", en: "Reset to Baseline" },
  "scenario.active": { ar: "⚡ تم تفعيل المحاكاة — تم تحديث النتائج فورياً", en: "⚡ What-If Scenario Active — Results Updated" },
  "scenario.reranked": { ar: "تمت إعادة ترتيب الدورات الزراعية ديناميكياً وفقاً للظروف الجديدة.", en: "Rotations re-ranked dynamically based on updated conditions." },

  // Tactical Cover Crops
  "tactical.title": { ar: "محاصيل التغطية السريعة المقترحة لسد فجوة الخريف:", en: "Recommended Tactical Cover Crops for Autumn Gap:" },
  "tactical.fahl": { ar: "برسيم فحل", en: "Fahl Berseem (Egyptian Clover)" },
  "tactical.fahlBadge": { ar: "تثبيت نيتروجين ٤٠ كجم/فدان", en: "Fixes ~40 kg N/Feddan" },
  "tactical.fahlDesc": { ar: "غطاء نباتي سريع يثبت 30–45 كجم نيتروجين/فدان قبل زراعة القمح، ويحمي التربة من جفاف ورياح الخريف.", en: "Fast-growing cover crop that fixes 30–45 kg N/feddan before wheat; shields soil from autumn winds." },
  "tactical.cowpea": { ar: "لوبيا علف نيلية", en: "Nili Forage Cowpea" },
  "tactical.cowpeaBadge": { ar: "مقاوم للحرارة الشديدة", en: "High Heat Tolerance" },
  "tactical.cowpeaDesc": { ar: "يتحمل حرارة نهاية الصيف، يقمع بذور الحشائش، ويمنع تشقق وتقشر سطح التربة.", en: "Tolerates late summer heat, suppresses weed seeds, and prevents topsoil crusting." },

  // Recommended Strategy Card
  "strategy.recommended": { ar: "الدورة الزراعية المقترحة الأولى", en: "Recommended Optimal Strategy" },
  "strategy.suitability": { ar: "درجة الملاءمة", en: "Suitability Score" },
  "strategy.optimalFor": { ar: "الخيار الأمثل لهدف", en: "Optimal match for" },
  "strategy.inRegion": { ar: "في منطقة", en: "in" },
  "strategy.waterSavings": { ar: "نسبة توفير المياه", en: "Water Savings" },
  "strategy.vsBaseline": { ar: "مقارنة بالدورة التقليدية", en: "vs conventional rotation" },
  "strategy.waterPerFeddan": { ar: "المياه لكل فدان", en: "Water per Feddan" },
  "strategy.m3Cycle": { ar: "م³ / فدان / دورة", en: "m³/feddan/cycle" },
  "strategy.totalWater": { ar: "إجمالي استهلاك المزرعة", en: "Total Farm Water" },
  "strategy.nitrogenBalance": { ar: "توازن النيتروجين", en: "Nitrogen Balance" },
  "strategy.soilHealthIdx": { ar: "مؤشر صحة التربة", en: "Soil Health Index" },

  // 5-Element Strategy Evaluation
  "eval.title": { ar: "تقييم الاستراتيجية وفق معايير ناسا (٥ عناصر)", en: "5-Element Strategy Evaluation (NASA Standards)" },
  "eval.why": { ar: "💡 ١. سبب الاختيار والملاءمة الزراعية:", en: "💡 1. Why Suggested:" },
  "eval.evidence": { ar: "🛰️ ٢. الأدلة الداعمة من بيانات الأقمار الصناعية:", en: "🛰️ 2. Supporting Satellite Evidence:" },
  "eval.benefits": { ar: "📈 ٣. الفوائد الاقتصادية والمائية المتوقعة:", en: "📈 3. Expected Benefits:" },
  "eval.gaps": { ar: "🔍 ٤. الفجوات المعلوماتية (ما لا يراه القمر الصناعي):", en: "🔍 4. Information Gaps (What Satellites Cannot See):" },
  "eval.risks": { ar: "⚠️ ٥. المخاطر والتنبيه الإرشادي الميداني:", en: "⚠️ 5. Risks Requiring Local Agronomist Review:" },
  "eval.advisoryNotice": { ar: "تنبيه إرشادي: سكاي سبيس هو نظام دعم قرار استرشادي مبني على رصد الأقمار الصناعية والنماذج البيئية، وليس بديلاً عن الفحص المخبري للتربة وخبرة المهندس الزراعي الميداني.", en: "Decision-Support Advisory: Sky Space is an orbital decision-support aid to guide planning and is NOT a substitute for on-site agronomist consultation, lab soil tests, or farmer field experience." },

  // Pre-planting checklist & alternatives
  "checklist.title": { ar: "قائمة الفحص الفني الموصى بها قبل الزراعة:", en: "Pre-Planting Technical Checklist:" },
  "strat.hideAlternatives": { ar: "إخفاء الدورات البديلة", en: "Hide Alternative Strategies" },
  "strat.showAlternatives": { ar: "مقارنة الدورات الزراعية البديلة الأخرى", en: "Compare Other Evaluated Strategies" },

  // Glossary Modal
  "glossary.title": { ar: "قاموس المصطلحات العلمية الزراعية", en: "Scientific Agricultural Glossary" },
  "glossary.subtitle": { ar: "ترجمة مؤشرات الأقمار الصناعية إلى إرشادات عملية يفهمها الفلاح.", en: "Translating orbital satellite metrics into practical agricultural insight." },
  "glossary.farmerRule": { ar: "💡 بلغة الفلاح:", en: "💡 Farmer Practical Rule:" },

  // Auth Modal
  "auth.signInTitle": { ar: "تسجيل الدخول إلى سكاي سبيس", en: "Sign In to Sky Space" },
  "auth.joinTitle": { ar: "إنشاء حساب جديد في سكاي سبيس", en: "Join Sky Space" },
  "auth.signInSub": { ar: "للوصول إلى حقولك المحفوظة وسجلات الدورات الزراعية", en: "Access your saved field records & rotation history" },
  "auth.joinSub": { ar: "احفظ مزارعك واستفد من التوصيات الفضائية المخصصة", en: "Save your fields and get tailored satellite advisories" },
  "auth.nameLabel": { ar: "الاسم الكامل", en: "Full Name" },
  "auth.namePlaceholder": { ar: "أحمد الفلاح", en: "Ahmed Farmer" },
  "auth.emailLabel": { ar: "البريد الإلكتروني", en: "Email Address" },
  "auth.passwordLabel": { ar: "كلمة المرور", en: "Password" },
  "auth.signInBtn": { ar: "دخول", en: "Sign In" },
  "auth.joinBtn": { ar: "إنشاء الحساب", en: "Create Account" },
  "auth.noAccount": { ar: "ليس لديك حساب؟", en: "Don't have an account?" },
  "auth.hasAccount": { ar: "لديك حساب بالفعل؟", en: "Already have an account?" },
  "auth.createOne": { ar: "سجل حساباً مجانياً", en: "Create one free" },
  "auth.signInLink": { ar: "سجل الدخول هنا", en: "Sign in here" },

  // Common
  "common.loading": { ar: "جاري التحميل...", en: "Loading..." },
  "common.error": { ar: "حدث خطأ غير متوقع", en: "An unexpected error occurred" },
  "common.retry": { ar: "إعادة المحاولة", en: "Retry" },
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  dir: "ltr",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    }
    if (typeof window !== "undefined") {
      try { localStorage.setItem("skyspace_lang", l); } catch {}
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("skyspace_lang") as Lang | null;
      if (saved === "ar" || saved === "en") setLang(saved);
    } catch {}
  }, [setLang]);

  const t = useCallback((key: string): string => {
    return translations[key]?.[lang] ?? key;
  }, [lang]);

  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
