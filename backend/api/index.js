import app from "../server.js";
import connectDB from "../config/db.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.warn("MongoDB connection deferred in serverless handler:", err.message);
  }
  return app(req, res);
}
