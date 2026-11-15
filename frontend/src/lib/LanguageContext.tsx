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
  "nav.tour": { ar: "جولة", en: "Tour" },
  "nav.markField": { ar: "رسم الحقل", en: "Mark Field" },
  "nav.drawing": { ar: "جاري الرسم", en: "Drawing" },
  "nav.signIn": { ar: "تسجيل الدخول", en: "Sign In" },
  "nav.signOut": { ar: "خروج", en: "Sign Out" },
  "nav.search": { ar: "ابحث عن مزرعة...", en: "Search farm..." },
  "nav.go": { ar: "بحث", en: "Go" },
  "nav.step1": { ar: "١. رسم الحقل", en: "1. Mark Field" },
  "nav.step2": { ar: "٢. بيانات المزرعة", en: "2. Farm Inputs" },
  "nav.step3": { ar: "٣. خطة المحاصيل", en: "3. Crop Plan" },
  "nav.brand": { ar: "Sky Space", en: "Sky Space" },
  "nav.brandSub": { ar: "ذكاء الأقمار الصناعية", en: "Satellite Crop Intelligence" },

  // Planner modal — step 1
  "modal.title": { ar: "مخطط المزرعة", en: "Farm Planner" },
  "modal.subtitle": { ar: "الإحداثيات ومساحة الحقل تُحسب تلقائياً من الخريطة. أكمل بيانات الزراعة أدناه.", en: "Field coordinates and area are automatically acquired from your map polygon. Complete the farming parameters below." },
  "modal.location": { ar: "موقع الأرض — مكتشف تلقائياً", en: "Land Location — Auto-detected from Map" },
  "modal.locationSub": { ar: "الإحداثيات مُرسَلة إلى محرك NASA POWER / MODIS / SoilGrids", en: "Coordinates sent to backend engine for NASA POWER / MODIS / SoilGrids lookup" },
  "modal.live": { ar: "مباشر", en: "Live" },
  "modal.crop": { ar: "المحصول الحالي", en: "Current Crop" },
  "modal.season": { ar: "الموسم", en: "Season" },
  "modal.objective": { ar: "الهدف الرئيسي", en: "Primary Objective" },
  "modal.analyze": { ar: "تحليل بالقمر الصناعي", en: "Analyze with Satellite" },
  "modal.analyzing": { ar: "جاري التحليل...", en: "Analyzing..." },
  "modal.close": { ar: "إغلاق", en: "Close" },
  "modal.back": { ar: "رجوع", en: "Back" },

  // Report step 2
  "report.diagnostics": { ar: "تشخيصات القمر الصناعي", en: "Satellite Diagnostics" },
  "report.heatStress": { ar: "أيام الإجهاد الحراري", en: "Heat Stress Days" },
  "report.bareSoil": { ar: "أيام التربة المكشوفة", en: "Bare Soil Days" },
  "report.canopy": { ar: "مؤشر الغطاء النباتي", en: "Canopy Z-Score" },
  "report.salinity": { ar: "خطر الملوحة", en: "Salinity Risk" },
  "report.carbon": { ar: "كربون التربة", en: "Soil Carbon" },
  "report.wetness": { ar: "رطوبة الجذور", en: "Root Wetness" },
  "report.scenario": { ar: "محاكي السيناريوهات", en: "Scenario Simulator" },
  "report.scenarioDesc": { ar: "محاكاة التحولات المناخية القصوى أو تخفيضات حصص المياه لمعرفة كيف تتغير تصنيفات الاستراتيجية:", en: "Simulate extreme climate shifts or water quota cuts to observe how crop sequence suitability and strategy rankings dynamically adapt:" },
  "report.tempShift": { ar: "تغيير الحرارة", en: "Temp. Shift" },
  "report.waterSupply": { ar: "حصة المياه", en: "Water Supply" },
  "report.proposed": { ar: "الاستراتيجية المقترحة", en: "Recommended Strategy" },
  "report.alternatives": { ar: "استراتيجيات بديلة", en: "Alternative Strategies" },
  "report.glossary": { ar: "قاموس المصطلحات", en: "Scientific Glossary" },
  "report.dataSources": { ar: "مصادر البيانات", en: "Data Sources" },
  "report.suitability": { ar: "درجة الملاءمة", en: "Suitability Score" },
  "report.warnings": { ar: "تحذيرات", en: "Warnings" },
  "report.checklist": { ar: "قائمة المهام", en: "Action Checklist" },
  "report.saveAsPDF": { ar: "حفظ كـ PDF", en: "Save as PDF" },

  // Objectives
  "obj.saveWater": { ar: "توفير المياه", en: "Save Water" },
  "obj.maxYield": { ar: "أعلى محصول", en: "Max Yield" },
  "obj.soilHealth": { ar: "صحة التربة", en: "Soil Health" },

  // Seasons
  "season.winter": { ar: "الشتوية", en: "Winter" },
  "season.summer": { ar: "الصيفية", en: "Summer" },
  "season.nile": { ar: "النيلية", en: "Nile Season" },

  // Bare-field
  "bare.title": { ar: "نافذة ضعف الأرض المكشوفة", en: "Bare-Field Vulnerability Window" },
  "bare.detected": { ar: "تم اكتشاف فجوة أرض مكشوفة", en: "Bare-field gap detected" },

  // Generic
  "common.loading": { ar: "جاري التحميل...", en: "Loading..." },
  "common.error": { ar: "حدث خطأ", en: "An error occurred" },
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
    try { localStorage.setItem("skyspace_lang", l); } catch {}
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
