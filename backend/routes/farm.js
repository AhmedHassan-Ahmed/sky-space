import express from "express";
import mongoose from "mongoose";
import { FarmerData } from "../models/FarmerData.js";
import { FileStore } from "../models/fallbackStore.js";
import { authMiddleware } from "../middleware/auth.js";
import "../lib/fieldshift.bundle.js";

const FS = globalThis.FieldShift;
const router = express.Router();

const LOCATION_MAP = {
  fayoum: { name: "Fayoum", presetId: "fayoum_etsa", lat: 29.2315, lon: 30.7952, landType: "old_clay", salinity: "moderate" },
  kafr_el_sheikh: { name: "Kafr El-Sheikh", presetId: "delta_kafr_el_sheikh", lat: 31.1107, lon: 30.9388, landType: "old_clay", salinity: "high" },
  nubariya: { name: "Nubariya", presetId: "west_delta_nubariya", lat: 30.6650, lon: 30.0680, landType: "new_sandy", salinity: "none" },
};

// Map irrigation and water availability
function resolveInputs({ landLocation, lat: rawLat, lon: rawLon, landArea, lastCrop, irrigationMethod, waterAvailability, planObjective, scenarioModifiers, soilEceDsm, hasLivestock, forceNiliCover }) {
  const locKey = String(landLocation || "fayoum").toLowerCase().replace(/[^a-z_]/g, "_");
  const defaultLoc = LOCATION_MAP[locKey] || LOCATION_MAP.fayoum;

  // Use map coordinates if provided, else preset coordinates
  const lat = typeof rawLat === "number" && !isNaN(rawLat) ? rawLat : defaultLoc.lat;
  const lon = typeof rawLon === "number" && !isNaN(rawLon) ? rawLon : defaultLoc.lon;

  // Irrigation mapping
  const irrigationType = irrigationMethod === "Drip" ? "drip" : irrigationMethod === "Sprinkler" ? "sprinkler" : "flood";

  // Water availability mapping
  const canalPosition = waterAvailability === "Abundant" ? "head" : waterAvailability === "Moderate" ? "middle" : "tail";

  // Plan objective weights
  const weights = planObjective === "Improve Soil Health" ? FS.GOALS.soil.weights : FS.GOALS.water.weights;

  // Last crop rotation history inference
  const cropStr = String(lastCrop || "Maize").toLowerCase();
  const lastCropObj = FS.egyptCrops.find(
    (c) => c.nameEn.toLowerCase().includes(cropStr) || c.id === cropStr
  );

  let currentWinterId = "wheat";
  let currentSummerId = "maize";

  if (lastCropObj?.season === "Seifi") {
    currentSummerId = lastCropObj.id;
    currentWinterId = planObjective === "Improve Soil Health" ? "berseem" : "wheat";
  } else if (lastCropObj?.season === "Shitwi") {
    currentWinterId = lastCropObj.id;
    currentSummerId = "maize";
  }

  const loc = {
    ...defaultLoc,
    lat,
    lon,
  };

  return {
    loc,
    userInputs: {
      feddans: Number(landArea) || 1,
      qirats: 0,
      landType: loc.landType,
      irrigationType,
      canalPosition,
      salinityLevel: loc.salinity,
      soilEceDsm: soilEceDsm != null ? Number(soilEceDsm) : null,
      currentWinterId,
      currentSummerId,
      hasLivestock: hasLivestock !== undefined ? Boolean(hasLivestock) : true,
      forceNiliCover: Boolean(forceNiliCover),
      weights,
      scenarioModifiers: scenarioModifiers ?? { tempDeltaC: 0, waterSupplyPctDelta: 0 },
    },
  };
}

// 1. Get reference metadata (crops, locations)
router.get("/presets", (req, res) => {
  res.json({
    locations: Object.entries(LOCATION_MAP).map(([key, l]) => ({ id: key, name: l.name })),
    crops: FS.egyptCrops.map((c) => ({ id: c.id, name: c.nameEn, season: c.season })),
    irrigationMethods: ["Surface Irrigation", "Drip", "Sprinkler"],
    waterAvailabilityOptions: ["Limited", "Moderate", "Abundant"],
    objectives: ["Save Water", "Improve Soil Health"],
  });
});

// Scientific Glossary endpoint
router.get("/glossary", (req, res) => {
  const lang = req.query.lang === "ar" ? "ar" : "en";
  res.json({
    terms: FS.getAllGlossaryTerms ? FS.getAllGlossaryTerms(lang) : [],
    glossary: FS.SCIENTIFIC_GLOSSARY ?? {},
  });
});

// Satellite Harmonization Guide endpoint
router.get("/harmonization", (req, res) => {
  const lang = req.query.lang === "ar" ? "ar" : "en";
  res.json(FS.explainDataHarmonization ? FS.explainDataHarmonization(lang) : {});
});

/** Fetch live farm data, falling back to initial data on any error. */
async function loadFarmData(loc, { timeoutMs = 25000 } = {}) {
  try {
    return await FS.fetchUnifiedFarmData(loc.lat, loc.lon, loc.presetId, { timeoutMs });
  } catch (err) {
    if (err.message?.includes("within Egypt")) throw err; // propagate bounds error
    return FS.getInitialFarmData(loc.lat, loc.lon, loc.presetId);
  }
}

// 2. Calculate recommendation without saving (Public / Instant preview)
router.post("/calculate", async (req, res) => {
  try {
    const {
      landLocation,
      lat,
      lon,
      landArea,
      lastCrop,
      irrigationMethod,
      waterAvailability,
      planObjective,
      scenarioModifiers,
      soilEceDsm,
      hasLivestock,
      forceNiliCover,
    } = req.body;

    const { loc, userInputs } = resolveInputs({
      landLocation,
      lat,
      lon,
      landArea,
      lastCrop,
      irrigationMethod,
      waterAvailability,
      planObjective,
      scenarioModifiers,
      soilEceDsm,
      hasLivestock,
      forceNiliCover,
    });

    let farmData;
    try {
      farmData = await loadFarmData(loc);
    } catch (boundsErr) {
      return res.status(400).json({ message: boundsErr.message });
    }

    const evaluation = FS.evaluateFieldAndRotations(farmData, userInputs, FS.egyptCrops);
    const model = FS.buildFarmerModel(evaluation, userInputs, farmData, "en");

    res.json({
      diagnostics: evaluation.diagnostics,
      scenarioSimulation: evaluation.scenarioSimulation ?? null,
      proposed: model.proposed,
      strategies: model.strategies,
      warnings: model.warnings,
      location: loc,
      dataSources: farmData.sources,
      dataYear: farmData.year,
    });
  } catch (err) {
    res.status(500).json({ message: "Calculation failed", error: err.message });
  }
});

// 3. Save farmer data & compute recommendation (Protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      landLocation,
      lat,
      lon,
      coordinates,
      landArea,
      lastCrop,
      plantingStartDate,
      irrigationMethod,
      waterAvailability,
      planObjective,
      scenarioModifiers,
    } = req.body;

    if (!landLocation || !landArea || !lastCrop || !plantingStartDate || !irrigationMethod || !waterAvailability || !planObjective) {
      return res.status(400).json({ message: "All farmer data fields are required" });
    }

    const { loc, userInputs } = resolveInputs({
      landLocation,
      lat,
      lon,
      landArea,
      lastCrop,
      irrigationMethod,
      waterAvailability,
      planObjective,
      scenarioModifiers,
    });

    // Run FieldShift core engine with live data
    let farmData;
    try {
      farmData = await loadFarmData(loc);
    } catch (boundsErr) {
      return res.status(400).json({ message: boundsErr.message });
    }
    const evaluation = FS.evaluateFieldAndRotations(farmData, userInputs, FS.egyptCrops);
    const model = FS.buildFarmerModel(evaluation, userInputs, farmData, "en");

    const isDbConnected = mongoose.connection.readyState === 1;
    let savedRecord;

    if (isDbConnected) {
      // Save in MongoDB via Mongoose
      const farmerRecord = new FarmerData({
        userId: req.user.id,
        landLocation,
        lat: loc.lat,
        lon: loc.lon,
        coordinates: Array.isArray(coordinates) ? coordinates : [],
        landArea: Number(landArea),
        lastCrop,
        plantingStartDate,
        irrigationMethod,
        waterAvailability,
        planObjective,
        recommendation: {
          diagnostics: evaluation.diagnostics,
          proposed: model.proposed,
          strategies: model.strategies,
          warnings: model.warnings,
        },
      });

      await farmerRecord.save();
      savedRecord = farmerRecord;
    } else {
      // Save in file-backed fallback store
      savedRecord = FileStore.createFarmerData({
        userId: req.user.id,
        landLocation,
        lat: loc.lat,
        lon: loc.lon,
        coordinates: Array.isArray(coordinates) ? coordinates : [],
        landArea: Number(landArea),
        lastCrop,
        plantingStartDate,
        irrigationMethod,
        waterAvailability,
        planObjective,
        recommendation: {
          diagnostics: evaluation.diagnostics,
          proposed: model.proposed,
          strategies: model.strategies,
          warnings: model.warnings,
        },
      });
    }

    res.status(201).json({
      message: "Farmer data evaluated and saved successfully",
      record: savedRecord,
      dataSources: farmData.sources,
      dataYear: farmData.year,
    });
  } catch (err) {
    res.status(500).json({ message: "Engine evaluation failed", error: err.message });
  }
});

// 4. Get all farmer records for the logged-in user (Protected)
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let history;

    if (isDbConnected) {
      history = await FarmerData.find({ userId: req.user.id }).sort({ createdAt: -1 });
    } else {
      history = FileStore.findFarmerDataByUser(req.user.id);
    }

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch farmer history", error: err.message });
  }
});

// 5. Get the latest farmer record for the logged-in user (Protected)
router.get("/latest", authMiddleware, async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let latest;

    if (isDbConnected) {
      latest = await FarmerData.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    } else {
      latest = FileStore.findLatestFarmerDataByUser(req.user.id);
    }

    if (!latest) {
      return res.status(404).json({ message: "No farmer data found for this user" });
    }
    res.json(latest);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch latest data", error: err.message });
  }
});

export default router;
