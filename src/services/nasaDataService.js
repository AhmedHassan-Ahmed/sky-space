import fallbackPresets from "../data/fallbackPresets.json" with { type: "json" };

/**
 * FieldShift data service — live APIs first, compact fallback second.
 *
 * Live sources (queried for the exact field centroid):
 *   • NASA POWER daily point API  → climate series + FAO-56 ET₀ drivers + elevation
 *   • ORNL DAAC MODIS MOD13Q1 API → 16-day NDVI (QA screened) for the data year
 *                                   and the 5 previous summers (canopy-anomaly baseline)
 *   • ISRIC SoilGrids 2.0 API     → topsoil clay / sand / SOC / nitrogen / pH
 *
 * The data year is always the last complete calendar year (see targetDataYear).
 * If an API fails or times out, that source falls back to src/data/fallbackPresets.json
 * (regional monthly means) and is labelled kind: "synthetic" so the engine/UI can warn.
 */

export const REQUEST_TIMEOUT_MS = 25000;
const CACHE_VERSION = "fieldshift-v3";
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // complete live result
const PARTIAL_CACHE_MAX_AGE = 60 * 60 * 1000; // some sources fell back → retry after 1 h
const _DAY = 86400000;
const HISTORY_YEARS = 5;
const MODIS_CONCURRENCY = 4;

const presets = Object.fromEntries(
  Object.entries(fallbackPresets).filter(([key]) => !key.startsWith("_")),
);

const validNumber = (value) =>
  typeof value === "number" && Number.isFinite(value);
const cleanPowerValue = (value) =>
  validNumber(value) && value > -900 ? value : null;
const mean = (values) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
const pad3 = (n) => String(n).padStart(3, "0");

/** Last complete calendar year. In Jan–Feb the previous December may not be final yet. */
export function targetDataYear(now = new Date()) {
  const year = now.getUTCFullYear();
  return now.getUTCMonth() < 2 ? year - 2 : year - 1;
}
export const daysInYear = (year) =>
  (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / _DAY;
const isoDate = (ms) => new Date(ms).toISOString().slice(0, 10);
const yearDates = (year) =>
  Array.from({ length: daysInYear(year) }, (_, i) =>
    isoDate(Date.UTC(year, 0, 1 + i)),
  );
/** MOD13Q1 composite start dates (DOY 1, 17, … 353) for a year. */
const modisCompositeDates = (year) =>
  Array.from({ length: 23 }, (_, i) => isoDate(Date.UTC(year, 0, 1 + i * 16)));

export function nearestPreset(lat, lon) {
  // Great-circle distance, used only to choose a regional fallback, not to downscale data.
  const radians = (n) => (n * Math.PI) / 180;
  const distance = (p) =>
    Math.sin(radians(p.lat - lat) / 2) ** 2 +
    Math.cos(radians(lat)) *
      Math.cos(radians(p.lat)) *
      Math.sin(radians(p.lon - lon) / 2) ** 2;
  return Object.values(presets).reduce((best, p) =>
    distance(p) < distance(best) ? p : best,
  );
}

/** Expands the compact regional fallback into the daily/16-day shapes the engine expects. */
export function expandFallback(preset, year = targetDataYear()) {
  const baseDates = yearDates(fallbackPresets._about?.baseYear ?? 2025);
  const tmaxByMonthDay = new Map(
    baseDates.map((d, i) => [d.slice(5), preset.tmaxDaily[i]]),
  );
  const climateDaily = yearDates(year).map((date) => {
    const monthDay = date.slice(5) === "02-29" ? "02-28" : date.slice(5);
    const monthly = preset.climateMonthly[Number(date.slice(5, 7)) - 1];
    return {
      date,
      tmax: tmaxByMonthDay.get(monthDay) ?? monthly.tmax,
      tmin: monthly.tmin,
      precipitation: monthly.precipitation,
      evapotranspiration: monthly.evapotranspiration,
      rootWetness: monthly.rootWetness,
      topWetness: monthly.topWetness,
    };
  });
  const summer = climateDaily.filter(
    (d) => d.date.slice(5, 7) >= "05" && d.date.slice(5, 7) <= "09",
  );
  return {
    soil: structuredClone(preset.soil),
    climateDaily,
    summerMaxTemps: summer.map((d) => d.tmax).filter(validNumber),
    avgRootWetness: mean(
      preset.climateMonthly.map((m) => m.rootWetness).filter(validNumber),
    ),
    ndviSeries: modisCompositeDates(year).map((date, i) => ({
      date,
      ndvi: preset.ndvi16Day[i] ?? null,
    })),
  };
}

export function parsePower(
  payload,
  { requireComplete = false, year = targetDataYear(), lat, lon, url } = {},
) {
  const parameters = payload?.properties?.parameter;
  if (!parameters?.T2M_MAX) throw new Error("Missing POWER temperature series");
  const names = {
    tmax: "T2M_MAX",
    tmin: "T2M_MIN",
    precipitation: "PRECTOTCORR",
    evapotranspiration: "EVPTRNS",
    rootWetness: "GWETROOT",
    topWetness: "GWETTOP",
  };
  const driverNames = {
    rh: "RH2M",
    wind: "WS2M",
    solar: "ALLSKY_SFC_SW_DWN",
    pressure: "PS",
  };
  const bounds = {
    tmax: [-90, 65],
    tmin: [-90, 60],
    precipitation: [0, 500],
    evapotranspiration: [-50, 50],
    rootWetness: [0, 1],
    topWetness: [0, 1],
    rh: [0, 100],
    wind: [0, 50],
    solar: [0, 50],
    pressure: [70, 110],
  };
  if (requireComplete) {
    const units = {
      T2M_MAX: "C",
      T2M_MIN: "C",
      PRECTOTCORR: "mm/day",
      EVPTRNS: "MJ/m^2/day",
      GWETROOT: "1",
      GWETTOP: "1",
    };
    for (const [key, unit] of Object.entries(units))
      if (payload.parameters?.[key]?.units !== unit)
        throw new Error("Unrecognized POWER units");
  }
  const read = (key, name, d) => {
    const value = cleanPowerValue(parameters[name]?.[d]);
    const [low, high] = bounds[key];
    return value !== null && value >= low && value <= high ? value : null;
  };
  const yearPattern = new RegExp(`^${year}\\d{4}$`);
  const dates = [
    ...new Set(Object.values(parameters).flatMap((p) => Object.keys(p))),
  ]
    .filter((d) => yearPattern.test(d))
    .sort();
  const toIso = (d) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  const climateDaily = dates.map((d) => ({
    date: toIso(d),
    ...Object.fromEntries(
      Object.entries(names).map(([key, name]) => [key, read(key, name, d)]),
    ),
  }));
  const summer = climateDaily.filter(
    (d) => d.date.slice(5, 7) >= "05" && d.date.slice(5, 7) <= "09",
  );
  if (!summer.some((d) => d.tmax !== null))
    throw new Error("Missing POWER summer observations");
  if (
    climateDaily.some(
      (d) => d.tmax !== null && d.tmin !== null && d.tmax < d.tmin,
    )
  )
    throw new Error("POWER Tmax below Tmin");
  const expectedDays = daysInYear(year);
  if (
    requireComplete &&
    (dates.length !== expectedDays ||
      dates.some((d) => {
        const iso = toIso(d);
        return (
          !Number.isFinite(Date.parse(iso)) ||
          new Date(iso).toISOString().slice(0, 10) !== iso
        );
      }) ||
      summer.filter((d) => d.tmax !== null).length !== 153 ||
      Object.keys(names).some(
        (key) =>
          climateDaily.filter((d) => d[key] !== null).length <
          expectedDays - 18,
      ))
  )
    throw new Error(`Incomplete POWER coverage for ${year}; retaining fallback`);

  // FAO-56 drivers come from the same response; ET₀ stays "unavailable" if any are missing.
  const elevation = payload?.geometry?.coordinates?.[2];
  const hasDrivers = Object.values(driverNames).every(
    (name) => parameters[name],
  );
  const referenceEtDrivers =
    hasDrivers && validNumber(elevation)
      ? {
          lat: validNumber(lat) ? lat : payload.geometry.coordinates[1],
          lon: validNumber(lon) ? lon : payload.geometry.coordinates[0],
          elevationM: elevation,
          daily: dates.map((d) => ({
            date: toIso(d),
            tmax: read("tmax", "T2M_MAX", d),
            tmin: read("tmin", "T2M_MIN", d),
            ...Object.fromEntries(
              Object.entries(driverNames).map(([key, name]) => [
                key,
                read(key, name, d),
              ]),
            ),
          })),
          source: {
            provider: "NASA POWER",
            url,
            retrievedAt: new Date().toISOString(),
            units: {
              tmax: "C",
              tmin: "C",
              rh: "%",
              wind: "m/s",
              solar: "MJ/m^2/day",
              pressure: "kPa",
            },
          },
        }
      : null;
  return {
    climateDaily,
    summerMaxTemps: summer.map((d) => d.tmax).filter(validNumber),
    avgRootWetness: mean(
      climateDaily.map((d) => d.rootWetness).filter(validNumber),
    ),
    referenceEtDrivers,
  };
}

export function parseIsric(payload) {
  const layers = payload?.properties?.layers;
  if (!Array.isArray(layers)) throw new Error("Missing SoilGrids layers");
  const soil = {};
  for (const [name, divisor] of Object.entries({
    clay: 10,
    sand: 10,
    soc: 10,
    nitrogen: 100,
    phh2o: 10,
  })) {
    const depths = layers.find((l) => l.name === name)?.depths ?? [];
    // Thickness-weighted top 15 cm: 0–5 cm (5), 5–15 cm (10).
    const selected = depths.filter((d) =>
      ["0-5cm", "5-15cm"].includes(d.label),
    );
    if (
      selected.length !== 2 ||
      selected.some((d) => !validNumber(d.values?.mean))
    )
      throw new Error("Incomplete SoilGrids profile");
    soil[name] =
      selected.reduce(
        (sum, d) => sum + d.values.mean * (d.label === "0-5cm" ? 5 : 10),
        0,
      ) /
      15 /
      divisor;
  }
  return validateSoil(soil);
}

function validateSoil(soil) {
  for (const name of ["clay", "sand", "soc", "nitrogen", "phh2o"])
    if (!validNumber(soil?.[name]))
      throw new Error(`Missing soil property: ${name}`);
  if (
    soil.phh2o <= 0 ||
    soil.phh2o > 14 ||
    soil.clay < 0 ||
    soil.clay > 100 ||
    soil.sand < 0 ||
    soil.sand > 100 ||
    soil.soc < 0 ||
    soil.nitrogen < 0 ||
    soil.sand + soil.clay <= 0 ||
    soil.sand + soil.clay > 100
  )
    throw new Error("Invalid soil units");
  return soil;
}

export function parseModis(payload, qualityPayload, year = targetDataYear()) {
  if (!qualityPayload?.subset?.length)
    throw new Error("MODIS pixel reliability is required");
  const qa = new Map(
    qualityPayload.subset.map((row) => [row.calendar_date, row]),
  );
  const seen = new Set();
  const datePattern = new RegExp(`^${year}-\\d{2}-\\d{2}$`);
  const series = (payload?.subset ?? [])
    .map((entry) => {
      if (!datePattern.test(entry.calendar_date) || seen.has(entry.calendar_date))
        throw new Error("Duplicate/invalid MODIS date");
      seen.add(entry.calendar_date);
      const quality = qa.get(entry.calendar_date);
      if (
        !quality ||
        quality.data.length !== entry.data.length ||
        quality.tile !== entry.tile
      )
        throw new Error("MODIS QA alignment mismatch");
      const pixels = entry.data.filter(
        (value, i) =>
          validNumber(value) &&
          value >= -2000 &&
          value <= 10000 &&
          quality.data[i] === 0,
      );
      return {
        date: entry.calendar_date,
        ndvi: pixels.length ? mean(pixels) * 0.0001 : null,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  if (!series.some((p) => p.ndvi !== null))
    throw new Error("No good-quality MODIS pixels");
  return series;
}

export function harmonizationMeta(lat, lon, year = targetDataYear()) {
  return {
    centroid: { lat, lon },
    climateResolution: "~50 km",
    vegetationResolution: "250 m",
    soilResolution: "250 m",
    period: `${year}-01-01/${year}-12-31`,
    method:
      "Centroid co-location of NASA POWER climate vectors (T2M_MAX, EVPTRNS, GWETROOT), MODIS reflectance and SoilGrids properties; no field-scale downscaling or physical data assimilation.",
  };
}

// ---------------------------------------------------------------------------
// Caching: in-memory (works on the Node backend and in the browser) + localStorage.
// ---------------------------------------------------------------------------
const memoryCache = new Map();
const inFlight = new Map();

function cacheKey(lat, lon, year) {
  return `${CACHE_VERSION}:${year}:${lat.toFixed(4)},${lon.toFixed(4)}`;
}
const allObserved = (data) =>
  ["climate", "soil", "ndvi"].every(
    (key) => data?.sources?.[key]?.kind === "observed",
  );
function isFresh(entry) {
  if (!entry?.data?.sources) return false;
  const maxAge = allObserved(entry.data) ? CACHE_MAX_AGE : PARTIAL_CACHE_MAX_AGE;
  return Date.now() - entry.savedAt <= maxAge;
}
function hasBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readCache(lat, lon, year) {
  const key = cacheKey(lat, lon, year);
  const memory = memoryCache.get(key);
  if (isFresh(memory)) return structuredClone(memory.data);
  if (!hasBrowserStorage()) return null;
  try {
    const cached = JSON.parse(
      window.localStorage.getItem(key) ?? "null",
    );
    if (cached?.version !== 3 || !isFresh(cached)) return null;
    validateSoil(cached.data.soil);
    if (
      !Array.isArray(cached.data.climateDaily) ||
      !Array.isArray(cached.data.ndviSeries)
    )
      return null;
    return cached.data;
  } catch {
    return null;
  }
}
function writeCache(lat, lon, year, data) {
  const key = cacheKey(lat, lon, year);
  const entry = { version: 3, savedAt: Date.now(), data: structuredClone(data) };
  memoryCache.set(key, entry);
  if (memoryCache.size > 500)
    memoryCache.delete(memoryCache.keys().next().value);
  if (!hasBrowserStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    /* Private mode / full storage: memory cache and fallback still work. */
  }
}

/**
 * Synchronous starting point: a cached live result if one exists, otherwise the
 * compact regional fallback. Call fetchUnifiedFarmData to retrieve live observations.
 */
export function getInitialFarmData(lat, lon, presetId, { year = targetDataYear() } = {}) {
  const cached = readCache(lat, lon, year);
  if (cached)
    return {
      ...cached,
      lat,
      lon,
      sources: Object.fromEntries(
        Object.entries(cached.sources).map(([key, source]) => [
          key,
          { ...source, status: source.kind === "observed" ? "cached" : "demo" },
        ]),
      ),
    };
  const preset = presets[presetId] ?? nearestPreset(lat, lon);
  return {
    lat,
    lon,
    year,
    presetId: preset.id,
    ...expandFallback(preset, year),
    ndviHistory: null,
    referenceEtDrivers: null,
    harmonizationMeta: harmonizationMeta(lat, lon, year),
    sources: Object.fromEntries(
      ["climate", "soil", "ndvi"].map((key) => [
        key,
        {
          status: "demo",
          kind: "synthetic",
          provider:
            key === "climate"
              ? "NASA POWER"
              : key === "soil"
                ? "SoilGrids"
                : "MODIS MOD13Q1",
          regionalPreset: preset.id,
          reason:
            "Compact regional fallback (monthly means of a 2025 snapshot); live observations not retrieved.",
        },
      ]),
    ),
  };
}

async function fetchJson(url, signal) {
  const response = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${new URL(url).host}`);
  return response.json();
}

// ORNL limits the subset service; keep a few requests in flight at a time.
let modisActive = 0;
const modisQueue = [];
function limitedModisFetch(url, signal) {
  return new Promise((resolve, reject) => {
    const run = () => {
      modisActive++;
      fetchJson(url, signal)
        .then(resolve, reject)
        .finally(() => {
          modisActive--;
          modisQueue.shift()?.();
        });
    };
    if (modisActive < MODIS_CONCURRENCY) run();
    else modisQueue.push(run);
  });
}

const MODIS_BASE = "https://modis.ornl.gov/rst/api/v1/MOD13Q1/subset";
const modisUrl = (lat, lon, band, year, startDoy, endDoy) =>
  `${MODIS_BASE}?latitude=${lat}&longitude=${lon}&band=${band}&startDate=A${year}${pad3(startDoy)}&endDate=A${year}${pad3(endDoy)}&kmAboveBelow=0&kmLeftRight=0`;
const GRID_KEYS = ["xllcorner", "yllcorner", "cellsize", "nrows", "ncols"];

/** Fetches one MODIS band for several ≤10-composite DOY windows and checks the pixel grid. */
async function fetchModisBand(lat, lon, band, year, windows, signal) {
  const chunks = await Promise.all(
    windows.map(([start, end]) =>
      limitedModisFetch(modisUrl(lat, lon, band, year, start, end), signal),
    ),
  );
  if (chunks.some((c) => c.nrows !== 1 || c.ncols !== 1))
    throw new Error("Unexpected MODIS grid");
  const grid = Object.fromEntries(GRID_KEYS.map((key) => [key, chunks[0][key]]));
  if (chunks.some((c) => GRID_KEYS.some((key) => c[key] !== grid[key])))
    throw new Error("Inconsistent MODIS chunk grids");
  if (
    band === "250m_16_days_NDVI" &&
    chunks.some((c) => Number(c.scale) !== 0.0001)
  )
    throw new Error("Unrecognized MODIS scale");
  return { subset: chunks.flatMap((c) => c.subset ?? []), grid };
}

async function fetchModisYear(lat, lon, year, windows, signal) {
  const [ndvi, qa] = await Promise.all(
    ["250m_16_days_NDVI", "250m_16_days_pixel_reliability"].map((band) =>
      fetchModisBand(lat, lon, band, year, windows, signal),
    ),
  );
  if (JSON.stringify(ndvi.grid) !== JSON.stringify(qa.grid))
    throw new Error("MODIS QA pixel grid mismatch");
  return { series: parseModis(ndvi, qa, year), grid: ndvi.grid };
}

// Full year: composites DOY 1…353 in three ≤10-date windows.
const FULL_YEAR_WINDOWS = [
  [1, 145],
  [161, 305],
  [321, 353],
];
// Summer baseline: the 10 composites starting May–Sep (DOY 129…273).
const SUMMER_WINDOW = [[129, 273]];

async function fetchNdviHistory(lat, lon, year, signal) {
  const years = Array.from({ length: HISTORY_YEARS }, (_, i) => year - HISTORY_YEARS + i);
  const results = await Promise.allSettled(
    years.map((y) => fetchModisYear(lat, lon, y, SUMMER_WINDOW, signal)),
  );
  return {
    years: results.map((result, i) => {
      if (result.status !== "fulfilled")
        return {
          year: years[i],
          validComposites: 0,
          expectedComposites: 10,
          peak: null,
          accepted: false,
          reason: result.reason?.message ?? "Request failed",
        };
      const summer = result.value.series.filter(
        (p) => p.date.slice(5, 7) >= "05" && p.date.slice(5, 7) <= "09",
      );
      const valid = summer.filter((p) => validNumber(p.ndvi));
      return {
        year: years[i],
        validComposites: valid.length,
        expectedComposites: 10,
        peak: valid.length ? Math.max(...valid.map((p) => p.ndvi)) : null,
        accepted: valid.length >= 8,
        grid: result.value.grid,
      };
    }),
  };
}

/**
 * Retrieves live observations for a field centroid in Egypt. Each source that fails
 * keeps its fallback value and carries the failure reason in data.sources[key].reason.
 */
export async function fetchUnifiedFarmData(
  lat,
  lon,
  presetId,
  {
    signal: parentSignal,
    timeoutMs = REQUEST_TIMEOUT_MS,
    year = targetDataYear(),
    useCache = true,
  } = {},
) {
  if (
    !validNumber(lat) ||
    !validNumber(lon) ||
    lat < 22 ||
    lat > 32.5 ||
    lon < 24 ||
    lon > 37
  )
    throw new Error("Select a location within Egypt (22–32.5°N, 24–37°E).");

  const key = cacheKey(lat, lon, year);
  if (useCache) {
    const memory = memoryCache.get(key);
    if (isFresh(memory)) return structuredClone(memory.data);
    // Concurrent requests for the same field share one set of API calls.
    if (inFlight.has(key) && !parentSignal)
      return structuredClone(await inFlight.get(key));
  }
  const request = fetchLive(lat, lon, presetId, {
    parentSignal,
    timeoutMs,
    year,
  });
  if (!parentSignal) inFlight.set(key, request);
  try {
    return structuredClone(await request);
  } finally {
    if (inFlight.get(key) === request) inFlight.delete(key);
  }
}

async function fetchLive(lat, lon, presetId, { parentSignal, timeoutMs, year }) {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  parentSignal?.addEventListener("abort", onAbort, { once: true });
  if (parentSignal?.aborted) controller.abort();
  let timer;
  const preset = presets[presetId] ?? nearestPreset(lat, lon);
  const data = {
    ...getInitialFarmData(lat, lon, preset.id, { year }),
    lat,
    lon,
    year,
    presetId: preset.id,
    harmonizationMeta: harmonizationMeta(lat, lon, year),
  };
  // Never reuse cached sources as a base for a fresh fetch: start from the fallback.
  Object.assign(data, expandFallback(preset, year), {
    ndviHistory: null,
    referenceEtDrivers: null,
  });
  const { signal } = controller;
  const powerUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M_MAX,T2M_MIN,PRECTOTCORR,EVPTRNS,GWETROOT,GWETTOP,RH2M,WS2M,ALLSKY_SFC_SW_DWN,PS&community=AG&longitude=${lon}&latitude=${lat}&start=${year}0101&end=${year}1231&format=JSON`;
  const isricUrl = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=clay&property=sand&property=soc&property=nitrogen&property=phh2o&depth=0-5cm&depth=5-15cm&value=mean`;
  const expectedNdviDates = new Set(modisCompositeDates(year));
  const snapshots = [];
  const tasks = [
    fetchJson(powerUrl, signal)
      .then((payload) =>
        parsePower(payload, { requireComplete: true, year, lat, lon, url: powerUrl }),
      )
      .then((value) => ({ value, provider: "NASA POWER", url: powerUrl })),
    fetchJson(isricUrl, signal)
      .then(parseIsric)
      .then((value) => ({ value, provider: "ISRIC SoilGrids 2.0", url: isricUrl })),
    // Retrieve QA alongside NDVI; never accept unscreened pixels.
    fetchModisYear(lat, lon, year, FULL_YEAR_WINDOWS, signal).then(
      ({ series, grid }) => {
        if (
          series.length !== 23 ||
          series.some((p) => !expectedNdviDates.has(p.date))
        )
          throw new Error("Incomplete MODIS calendar");
        return {
          value: series,
          grid,
          provider: "ORNL DAAC MODIS MOD13Q1 · QA screened",
          url: "https://modis.ornl.gov/data/modis_webservice.html",
        };
      },
    ),
    fetchNdviHistory(lat, lon, year, signal),
  ].map((task, index) =>
    task.then(
      (value) => {
        snapshots[index] = { status: "fulfilled", value };
        return value;
      },
      (reason) => {
        snapshots[index] = { status: "rejected", reason };
        throw reason;
      },
    ),
  );
  try {
    // A race enforces the deadline even if a fetch implementation ignores abort.
    const deadline = new Promise((resolve) => {
      timer = setTimeout(() => {
        controller.abort();
        resolve(null);
      }, timeoutMs);
    });
    const results = await Promise.race([Promise.allSettled(tasks), deadline]);
    if (parentSignal?.aborted)
      throw new DOMException("Cancelled", "AbortError");
    const retrievedAt = new Date().toISOString();
    for (const [i, key] of ["climate", "soil", "ndvi"].entries()) {
      const result = results?.[i] ?? snapshots[i];
      if (result?.status === "fulfilled") {
        const { value, provider, url } = result.value;
        if (key === "climate") Object.assign(data, value);
        else data[key === "soil" ? "soil" : "ndviSeries"] = value;
        data.sources[key] = {
          status: "live",
          kind: "observed",
          provider,
          url,
          retrievedAt,
          period: key === "soil" ? "SoilGrids 2.0 static prediction" : String(year),
        };
      } else
        data.sources[key] = {
          ...data.sources[key],
          reason:
            result?.reason?.message ??
            `${Math.round(timeoutMs / 1000)}-second deadline; using compact fallback.`,
        };
    }
    // Canopy-anomaly baseline: only same-pixel history next to observed current NDVI.
    const history = (results?.[3] ?? snapshots[3])?.value;
    const currentGrid = (results?.[2] ?? snapshots[2])?.value?.grid;
    if (history && currentGrid && data.sources.ndvi.kind === "observed")
      data.ndviHistory = {
        lat,
        lon,
        retrievedAt,
        policy: `${year - HISTORY_YEARS}–${year - 1} annual May–Sep peak; >=8/10 good QA=0 composites/year; same native pixel; >=3 accepted years for sample z-score. Baseline excludes ${year}.`,
        years: history.years.map(({ grid, ...row }) => ({
          ...row,
          accepted:
            row.accepted &&
            !!grid &&
            JSON.stringify(grid) === JSON.stringify(currentGrid),
        })),
      };
    writeCache(lat, lon, year, data);
    return data;
  } finally {
    clearTimeout(timer);
    parentSignal?.removeEventListener("abort", onAbort);
  }
}

export async function fetchFieldData({ lat, lon, presetId, ...options } = {}) {
  return fetchUnifiedFarmData(lat, lon, presetId, options);
}


/**
 * Multi-Sensor Harmonization & Resolution Specification
 * Explicitly describes the spatial, temporal, and physical characteristics of each sensor layer,
 * how they are fused into Egyptian agricultural seasons, and the relationship between satellite
 * proxies and in-situ ground-truth measurements.
 */
export const DATA_HARMONIZATION_SPEC = {
  sensors: [
    {
      id: "nasa_power",
      name: "NASA POWER (Agroclimatology)",
      satelliteSystem: "GEOS-5 / MERRA-2 assimilation & CERES radiation",
      spatialResolution: "0.5° × 0.5° (~50 km at Egypt latitude)",
      temporalResolution: "Daily continuous (1981–present)",
      parameters: ["T2M_MAX", "T2M_MIN", "PRECTOTCORR", "EVPTRNS", "ALLSKY_SFC_SW_DWN"],
      physicalUnits: {
        tmax: "°C",
        tmin: "°C",
        precipitation: "mm/day",
        evapotranspiration: "MJ/m²/day (energy) & mm/day (FAO-56 Penman-Monteith)",
      },
      roleInPipeline: "Provides macro-climatic energy drivers, heatwave frequency (>38°C), and daily baseline reference ET0.",
    },
    {
      id: "modis_landsat",
      name: "MODIS (MOD13Q1) & Landsat 8/9 / Sentinel-2",
      satelliteSystem: "Terra/Aqua MODIS, USGS/NASA Landsat 8-9, Copernicus Sentinel-2 MSI",
      spatialResolution: "10 m – 30 m (Landsat/Sentinel-2) / 250 m (MODIS 16-day composite)",
      temporalResolution: "5–16 days composite with QA pixel reliability filtering",
      parameters: ["NDVI (Normalized Difference Vegetation Index)", "Pixel Reliability QA"],
      physicalUnits: {
        ndvi: "Dimensionless ratio (-0.2 to 1.0)",
        qa: "Reliability bitmask (0 = good quality, >1 = cloud/snow/shadow)",
      },
      roleInPipeline: "Tracks field canopy greenness, identifies bare-soil windows (NDVI < 0.20), and flags historical canopy anomalies.",
    },
    {
      id: "smap",
      name: "NASA SMAP (Soil Moisture Active Passive)",
      satelliteSystem: "SMAP L-band radiometer / Level-4 Surface & Root-Zone Soil Moisture",
      spatialResolution: "9 km – 36 km grid",
      temporalResolution: "2–3 days revisit",
      parameters: ["GWETROOT (Root-zone wetness 0–100 cm)", "GWETTOP (Surface wetness 0–5 cm)"],
      physicalUnits: {
        soilWetness: "Degree of saturation (fractional 0.0 to 1.0)",
      },
      roleInPipeline: "Measures macro soil moisture status and identifies drought / water deficit stress across agricultural basins.",
    },
    {
      id: "soilgrids",
      name: "ISRIC SoilGrids / Digital Soil Mapping",
      satelliteSystem: "Machine learning ensemble fitted with 240,000 global soil profiles & Earth observation covariates",
      spatialResolution: "250 m grid",
      temporalResolution: "Static baseline depth intervals (0–5 cm, 5–15 cm, 15–30 cm)",
      parameters: ["clay (%)", "sand (%)", "phh2o (pH × 10)", "soc (g/kg)", "nitrogen (cg/kg)"],
      physicalUnits: {
        clay: "% by weight",
        phh2o: "Standard pH units",
        soc: "g/kg (Soil Organic Carbon)",
      },
      roleInPipeline: "Initial soil texture screening, soil alkalinity baseline, and organic carbon context.",
    },
  ],

  harmonizationPipeline: {
    spatialHarmonization: {
      method: "Centroid-anchored multi-scale bounding-box query with perimeter buffer screening.",
      descriptionEn:
        "High-resolution parcel polygons (10m–30m) are overlaid on coarse climate (50km) and soil moisture (9–36km) grids. Nearest-neighbor and bilinear interpolation assign macro-climate values to the field centroid while parcel boundaries query high-resolution NDVI pixels, masking out desert-fringe non-agricultural pixels.",
      descriptionAr:
        "يتم دمج إحداثيات الحقل التفصيلية مع شبكات المناخ والرطوبة الواسعة. تُسند بيانات المناخ العام ودرجات الحرارة لمركز الحقل، بينما تُقاس مؤشرات الغطاء النباتي (NDVI) بدقة البكسل الزراعي فقط مع استبعاد البكسلات المختلطة بحواف الصحراء.",
    },
    temporalHarmonization: {
      aggregationWindows: [
        {
          seasonEn: "Shitwi (Winter Season)",
          seasonAr: "العروة الشتوية",
          months: [11, 12, 1, 2, 3, 4],
          durationDays: 181,
          descriptionEn: "November 1 to April 30: Wheat, Berseem Clover, Broad Beans, Sugar Beet.",
          descriptionAr: "من أول نوفمبر إلى نهاية أبريل: القمح، البرسيم المصري، الفول البلدي، بنجر السكر.",
        },
        {
          seasonEn: "Seifi (Summer Season)",
          seasonAr: "العروة الصيفية",
          months: [5, 6, 7, 8, 9],
          durationDays: 153,
          descriptionEn: "May 1 to September 30: Maize, Rice, Cotton, Sorghum, Soybeans.",
          descriptionAr: "من أول مايو إلى نهاية سبتمبر: الذرة الشامية، الأرز، القطن، الذرة الرفيعة، فول الصويا.",
        },
        {
          seasonEn: "Nili (Autumn Transition / Nile Season)",
          seasonAr: "العروة النيلية وفترة التغطية",
          months: [9, 10, 11],
          durationDays: 91,
          descriptionEn: "September 1 to November 30: Short-duration Maize, Nili Cowpea, Fahl Clover, Potatoes.",
          descriptionAr: "من سبتمبر إلى نوفمبر: الذرة النيلية، لوبيا العلف، البرسيم الفحل، والبطاطس النيلي.",
        },
      ],
      descriptionEn:
        "Daily meteorological records (365 points) are aggregated into cumulative seasonal energy balances (MJ/m²), heat-stress day counts (>38°C), and 16-day composite NDVI steps, directly matching Egyptian cropping rotations.",
      descriptionAr:
        "يتم تجميع الأرصاد اليومية (٣٦٥ يوماً) في أرصدة طاقة تراكمية وعدد أيام الإجهاد الحراري وخطوات NDVI الدورية لتتوافق مباشرة مع مواسم الزراعة المصرية.",
    },
    groundTruthComparison: {
      satelliteRole:
        "Screening, trend detection, radiative energy balance, and regional risk mapping.",
      groundTruthRole:
        "Definitive field diagnosis: calibrated laboratory saturated-paste ECe (dS/m), in-situ soil tensiometers, certified seed germination checks, and on-site pest scouting.",
      disclaimerEn:
        "Satellite observations detect optical reflections and radiative flux from the canopy surface; they cannot determine subsurface root-zone salt accumulation or localized pathogen pressure. In-situ ground truth remains the authoritative operational standard.",
      disclaimerAr:
        "تقيس الأقمار الصناعية الانعكاسات الضوئية والتوازن الإشعاعي للسطح؛ ولا تستطيع قياس الأملاح العميقة حول الجذور أو الآفات الموضعية. القياس المعماري والمعاينة الأرضية تظل الأساس الميداني المعتمد.",
    },
  },
};

/**
 * Returns a human-friendly and machine-readable explanation of data harmonization.
 */
export function explainDataHarmonization(lang = "en") {
  const isAr = lang === "ar";
  return {
    title: isAr ? "دليل مواءمة ودمج بيانات الأقمار الصناعية" : "Satellite Multi-Sensor Fusion & Harmonization Guide",
    spec: DATA_HARMONIZATION_SPEC,
    summary: isAr
      ? "تدمج المنظومة بيانات ناسا POWER اليومية الواسعة (~50 كم) لحساب درجات الحرارة والبخر، مع صور موديس ولاندسات الدقيقة (10-250م) لرصد الغطاء النباتي وفترات انكشاف الأرض، وتوفيرها وفق العروات المصرية (الشتوية، الصيفية، النيلية) مع التأكيد على ضرورة القياسات الأرضية المعملية للملوحة."
      : "FieldShift harmonizes wide daily NASA POWER grids (~50 km) for temperatures and ET0 with fine-resolution MODIS/Landsat/Sentinel (10-250 m) composites for NDVI canopy vigor and bare-soil gaps, aligning them to Egypt's agricultural seasons (Shitwi, Seifi, Nili) alongside ground-truth validation rules.",
  };
}


