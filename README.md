# Sky Space (FieldShift) 🌍🛰️🌾

**Sky Space** is an Earth Observation (EO) powered agro-ecological decision support platform designed for Egyptian agriculture and arid/semi-arid regions. Developed for the **NASA Space Apps Challenge**, Sky Space harmonizes multi-sensor NASA satellite observations (POWER, MODIS, SMAP) and ISRIC SoilGrids with agronomic logic to guide farmers and agricultural advisors in climate-adaptive crop rotations, water conservation, and soil health management.

---

## 🌟 Key Features

- **🌐 Interactive 3D Globe & 2D Parcel Mapping**:
  - Global 3D view with realistic NASA GIBS overlays (`react-globe.gl` / Three.js).
  - High-resolution 2D parcel boundary drawing and area calculation in Feddans, Hectares, and Acres (`react-leaflet` / Turf.js).
  - NASA GIBS dynamic satellite layers: MODIS NDVI (Canopy Health), SMAP Root-Zone Soil Moisture, and High-Resolution True Color Surface Reflectance.
- **🌱 5-Element Agro-Ecological Rotation Planner**:
  - Evaluation of consecutive cropping cycles across Egyptian agricultural seasons:
    - **العروة الشتوية (Shitwi)**: Nov 1 – Apr 30 (Wheat, Egyptian Berseem Clover, Sugar Beet).
    - **العروة الصيفية (Seifi)**: May 1 – Sep 30 (Maize, Sorghum, Soybean, Sesame).
    - **العروة النيلية (Nili)**: Short-duration transition crops (Cowpea, Fahl Berseem).
  - 5-Element Strategy Evaluation:
    1. **Why Suggested**: Agronomic justification based on prior crops and objectives.
    2. **Supporting Evidence**: Satellite-derived indices (heat stress days, canopy anomalies, soil moisture).
    3. **Expected Benefits**: Quantified water savings ($m^3/\text{feddan}$) and nitrogen fixing.
    4. **Information Gaps**: Transparent disclosure of what satellites cannot observe (subsurface salinity $EC_e$, pests, farmgate spot prices).
    5. **Local Risks & Advisory Notice**: Practical review checkpoints for local canal turns and variety maturation.
- **🌐 Full Bilingual Support (Arabic & English with RTL)**:
  - Seamless toggle between pure Arabic and pure English across all interfaces, forms, tutorials, and results.
  - Native Right-to-Left (`dir="rtl"`) text and layout alignment for Arabic speakers.
- **📱 Mobile App & Android APK**:
  - Cross-platform Android support via **Capacitor 8**.
  - Automated CI/CD pipeline using GitHub Actions to compile and export debug APKs.
- **☁️ Cloud Deployment Ready**:
  - Production deployment on **Vercel** with serverless backend API routing (`/api`).
  - Persistent storage with **MongoDB Atlas** and graceful in-memory fallback for offline/demo scenarios.

---

## 🏗️ Architecture & Technology Stack

```
sky-space/
├── frontend/                     # Next.js 16 Web & Mobile App (React 19, Tailwind CSS v4)
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   ├── components/           # AgriDashboard, FarmMap, Globe3D, FarmPlannerModal, etc.
│   │   ├── lib/                  # LanguageContext (i18n), NASA GIBS/POWER client, Geo helpers
│   │   └── types/                # TypeScript interfaces for farm data and engine contracts
│   ├── android/                  # Capacitor Android native project (compileSdk 36, Java 21)
│   ├── capacitor.config.ts       # Capacitor native wrapper configuration
│   └── package.json              # Capacitor 8 + Next.js 16 + React 19 dependencies
│
├── backend/                      # Node.js + Express REST API
│   ├── models/                   # User and FarmerData Mongoose schemas + Fallback store
│   ├── routes/                   # /api/auth and /api/farm endpoints
│   ├── server.js                 # Standalone local Express server (Port 5000)
│   └── package.json
│
├── api/                          # Vercel Serverless Function Handler
│   └── index.ts                  # Serverless entry point connecting MongoDB and Express
│
├── src/                          # Core Agro-Ecological Engine
│   ├── engine/                   # fieldIndices.js, rotationEngine.js, referenceEt.js
│   ├── data/                     # Egypt crop catalogs, NDVI historical benchmarks, fixtures
│   └── services/                 # NASA POWER, MODIS, SoilGrids fetching services
│
└── .github/workflows/
    └── build-apk.yml             # GitHub Actions CI/CD workflow for automated Android APK builds
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v22.0.0 or higher (required by Capacitor 8)
- **Java JDK**: 21 (for Android APK compilation)
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI (optional for offline testing; fallback memory store activates automatically)

---

### 1. Local Development

#### Start Backend (Express API)
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

#### Start Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

---

### 2. Environment Variables

#### Backend (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/skyspace?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
```

#### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
*(When building for Capacitor APK or production, set `NEXT_PUBLIC_API_URL=https://sky-space-omega.vercel.app/api`)*

---

### 3. Deploying on Vercel

The project is structured to deploy both frontend and backend seamlessly on Vercel:

1. **Root Directory**: Deploy the repository root.
2. **API Handler**: [api/index.ts](file:///home/ahmed/Music/sky-space-v4/sky-space-uploaded/sky-space-main/api/index.ts) routes all `/api/*` traffic to Express with automatic MongoDB caching.
3. **Environment Variables on Vercel**:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: Secret key for JWT authentication.

---

### 4. Building the Android APK (Capacitor 8)

#### Automated CI/CD Build (GitHub Actions)
Every push to `main` or `dev` (or manual trigger under the GitHub **Actions** tab) automatically triggers [.github/workflows/build-apk.yml](file:///home/ahmed/Music/sky-space-v4/sky-space-uploaded/sky-space-main/.github/workflows/build-apk.yml):
1. Sets up **Node.js 22** and **Java JDK 21**.
2. Runs `npm run build:cap` (static HTML export targeted to production API).
3. Executes `npx cap sync android`.
4. Runs `./gradlew assembleDebug` and produces `SkySpace-debug-apk` available for download directly from the Actions artifact tab.

#### Local Android Build
```bash
cd frontend

# 1. Build Next.js static assets for mobile
npm run build:cap

# 2. Sync web assets with Capacitor Android
npx cap sync android

# 3. Open in Android Studio or compile with Gradle
cd android
./gradlew assembleDebug

# Output APK: frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🛰️ NASA Earth Observation Datasets Harmonization

In accordance with the **NASA Space Apps Challenge** criteria, Sky Space harmonizes heterogeneous remote sensing streams into actionable recommendations:

| Remote Sensing Product | Spatial / Temporal Resolution | Agro-Ecological Purpose |
|------------------------|-------------------------------|-------------------------|
| **NASA POWER** | ~50 km grid / Daily | Macro-climate thermal energy, $T_{\max}$, solar radiation, daily reference $ET_0$ calculation. |
| **MODIS (MOD13Q1) / Landsat** | 250 m / 30 m (16-day) | Vegetation health (NDVI), vegetative canopy anomaly, bare-soil exposure duration. |
| **NASA SMAP (Level 4)** | 9 km – 36 km (2–3 day) | Root-zone (0–100 cm) soil moisture saturation anomaly. |
| **ISRIC SoilGrids 2.0** | 250 m static grid | Soil organic carbon (SOC), clay %, sand %, and derived nitrogen buffer. |

---

## 📜 Scientific Methodology & Transparency

- **Decision Support, Not Replacement**: Sky Space serves as an agronomic decision accelerator for smallholder farmers and extension officers.
- **Transparent Limitation Disclosures**: Because orbital optical and radiometer sensors cannot detect root-zone salinity ($EC_e$), subterranean soil pathogen burdens, or micro-topographical watercourse siltation, every strategy card explicitly notes information gaps that require local ground review.

---

## 📄 License
This project is licensed under the MIT License.
