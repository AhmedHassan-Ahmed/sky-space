import mongoose from "mongoose";

let cachedPromise = null;

export async function connectDB() {
  // If already connected, reuse connection immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If already connecting, return existing promise to prevent duplicate connections
  if (cachedPromise) {
    return cachedPromise;
  }

  let MONGODB_URI = (process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fieldshift").trim();
  if (MONGODB_URI.startsWith("MONGODB_URI=")) {
    MONGODB_URI = MONGODB_URI.replace(/^MONGODB_URI=/, "").trim();
  }
  MONGODB_URI = MONGODB_URI.replace(/^["']/, "").replace(/["']$/, "");

  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  };

  cachedPromise = mongoose
    .connect(MONGODB_URI, opts)
    .then((mongooseInstance) => {
      console.log("MongoDB connected successfully");
      return mongooseInstance;
    })
    .catch((err) => {
      cachedPromise = null;
      console.warn("⚠️ MongoDB connection error:", err.message);
      throw err;
    });

  return cachedPromise;
}

export default connectDB;
