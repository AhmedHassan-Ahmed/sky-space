import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Load all JSON data
const egyptCrops = JSON.parse(fs.readFileSync(path.join(root, "src/data/egyptCrops.json"), "utf8"));
const cropEvidence = JSON.parse(fs.readFileSync(path.join(root, "src/data/cropEvidence.json"), "utf8"));
const fallbackPresets = JSON.parse(fs.readFileSync(path.join(root, "src/data/fallbackPresets.json"), "utf8"));

// Strip export/import statements from source files to inline them
function cleanModule(code) {
  return code
    .replace(/^import\s+.*?;\s*$/gm, "")
    .replace(/export\s+default\s+/g, "")
    .replace(/export\s+const\s+/g, "const ")
    .replace(/export\s+function\s+/g, "function ")
    .replace(/export\s+async\s+function\s+/g, "async function ")
    .replace(/export\s+\{.*?\};/g, "");
}

const referenceEtCode = cleanModule(fs.readFileSync(path.join(root, "src/engine/referenceEt.js"), "utf8"));
const cropEvidenceCode = cleanModule(fs.readFileSync(path.join(root, "src/engine/cropEvidence.js"), "utf8"));
const fieldIndicesCode = cleanModule(fs.readFileSync(path.join(root, "src/engine/fieldIndices.js"), "utf8"));
const strategyExplanationsCode = cleanModule(fs.readFileSync(path.join(root, "src/engine/strategyExplanations.js"), "utf8"));
let rotationEngineCode = cleanModule(fs.readFileSync(path.join(root, "src/engine/rotationEngine.js"), "utf8"))
  .replace(/const clamp = \(n, min, max\) => Math\.max\(min, Math\.min\(max, n\)\);/g, "/* clamp reused */");

const nasaDataServiceCode = cleanModule(fs.readFileSync(path.join(root, "src/services/nasaDataService.js"), "utf8"));
const farmerModelCode = cleanModule(fs.readFileSync(path.join(root, "src/presentation/farmerModel.js"), "utf8"));
const i18nCode = cleanModule(fs.readFileSync(path.join(root, "src/i18n.js"), "utf8"));

const bundle = `/**
 * FieldShift - Standalone Distribution Bundle
 * Generated for both direct script-tag inclusion (file:// and offline) and HTTP ES module fallback.
 */
(function(root) {
  'use strict';

  // Bundled Data Catalog & Fallback Presets
  const fallbackPresets = ${JSON.stringify(fallbackPresets)};
  const egyptCrops = ${JSON.stringify(egyptCrops)};
  const evidence = ${JSON.stringify(cropEvidence)};
  const egyptCropsCatalog = egyptCrops;

  // --- referenceEt.js ---
  ${referenceEtCode}

  // --- cropEvidence.js ---
  ${cropEvidenceCode}

  // --- fieldIndices.js ---
  ${fieldIndicesCode}

  // --- strategyExplanations.js ---
  ${strategyExplanationsCode}

  // --- rotationEngine.js ---
  ${rotationEngineCode}

  // --- nasaDataService.js ---
  ${nasaDataServiceCode}

  // --- farmerModel.js ---
  ${farmerModelCode}

  // --- i18n.js ---
  ${i18nCode}

  const FieldShift = {
    // Data
    egyptCrops,
    fallbackPresets,
    cropEvidence: evidence,

    // Engine
    computeFieldIndices,
    evaluateFieldAndRotations,
    rankRotations,
    generateCandidateRotations,
    assessMeasuredSalinity,
    projectCropEtc,
    computeReferenceEt,
    dailyReferenceEt,
    explainCropDecisionEvidence,
    explainStrategy,

    // Services
    getInitialFarmData,
    fetchUnifiedFarmData,
    fetchFieldData,
    nearestPreset,
    harmonizationMeta,
    DATA_HARMONIZATION_SPEC,
    explainDataHarmonization,

    // Presentation
    GOALS,
    selectGoal,
    areaIsValid,
    evaluationInputs,
    proposedStrategy,
    warningLayers,
    buildFarmerModel,

    // i18n & Glossary
    text,
    formatNumber,
    sourceLabel,
    SCIENTIFIC_GLOSSARY,
    getGlossaryTerm,
    getAllGlossaryTerms,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = FieldShift;
  }
  if (typeof root !== 'undefined') {
    root.FieldShift = FieldShift;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
`;

const distDir = path.join(root, "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(path.join(distDir, "fieldshift.bundle.js"), bundle, "utf8");

// Also keep backend/lib self-contained for Vercel services deployment
const backendLibDir = path.join(root, "backend/lib");
if (!fs.existsSync(backendLibDir)) {
  fs.mkdirSync(backendLibDir, { recursive: true });
}
fs.writeFileSync(path.join(backendLibDir, "fieldshift.bundle.js"), bundle, "utf8");

console.log("Bundle built successfully at dist/fieldshift.bundle.js and backend/lib/fieldshift.bundle.js (" + (bundle.length / 1024).toFixed(1) + " KB)");
