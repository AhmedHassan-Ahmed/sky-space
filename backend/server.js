import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import farmRoutes from "./routes/farm.js";
import connectDB from "./config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serverless DB connection middleware: ensures DB is connected before handling API requests
app.use(async (req, res, next) => {
  if (req.path.startsWith("/api") && req.path !== "/api/health") {
    try {
      await connectDB();
    } catch (err) {
      // If DB connection fails, routes can still use fallbackStore without hanging
      console.warn("DB connection attempt failed during request:", err.message);
    }
  }
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/farm", farmRoutes);

// Health check
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

// Initial database connection for persistent / local environments
if (process.env.NODE_ENV !== "test" && process.env.VERCEL !== "1") {
  connectDB().catch((err) => {
    console.warn("⚠️ Initial MongoDB connection error (will retry on incoming requests):", err.message);
  });
}

// Start Server in non-serverless mode
if (process.env.NODE_ENV !== "test" && process.env.VERCEL !== "1") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sky Space Backend API running on http://localhost:${PORT}`);
  });
}

export default app;
