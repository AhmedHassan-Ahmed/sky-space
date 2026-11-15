import mongoose from "mongoose";

const farmerDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  landLocation: {
    type: String,
    required: true,
    trim: true,
  },
  lat: {
    type: Number,
    default: null,
  },
  lon: {
    type: Number,
    default: null,
  },
  coordinates: {
    type: [[Number]],
    default: [],
  },
  landArea: {
    type: Number,
    required: true,
    min: 0.1,
  },
  lastCrop: {
    type: String,
    required: true,
  },
  plantingStartDate: {
    type: String,
    required: true,
  },
  irrigationMethod: {
    type: String,
    required: true,
    enum: ["Surface Irrigation", "Drip", "Sprinkler"],
  },
  waterAvailability: {
    type: String,
    required: true,
    enum: ["Limited", "Moderate", "Abundant"],
  },
  planObjective: {
    type: String,
    required: true,
    enum: ["Save Water", "Improve Soil Health"],
  },
  recommendation: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const FarmerData = mongoose.model("FarmerData", farmerDataSchema);
