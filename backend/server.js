import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import farmRoutes from "./routes/farm.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
let MONGODB_URI = (process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fieldshift").trim();
if (MONGODB_URI.startsWith("MONGODB_URI=")) {
  MONGODB_URI = MONGODB_URI.replace(/^MONGODB_URI=/, "").trim();
}
MONGODB_URI = MONGODB_URI.replace(/^["']/, "").replace(/["']$/, "");

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/farm", farmRoutes);

// Health check (before static, so it's not shadowed)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "FieldShift API",
    dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Serve frontend static files from project root (index.html at /)
const frontendDir = path.join(__dirname, "..");
app.use(express.static(frontendDir));

// Database connection
mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log("MongoDB connected successfully:", MONGODB_URI);
  })
  .catch((err) => {
    console.warn("⚠️ MongoDB connection error (Make sure MongoDB is running or configure MONGODB_URI in .env):", err.message);
    console.log("ℹ️ Seamless local JSON storage fallback active in backend/data/db.json");
  });

// Start Server
if (process.env.NODE_ENV !== "test" && process.env.VERCEL !== "1") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sky Space Backend API running on http://localhost:${PORT}`);
  });
}

export default app;
