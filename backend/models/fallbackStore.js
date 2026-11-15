import fs from "fs";
import path from "path";
import crypto from "crypto";

const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL_ENV;
const DATA_DIR = isVercel ? path.join("/tmp", "backend_data") : path.resolve("backend/data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], farmerData: [] }, null, 2));
  }
}

function readStore() {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  } catch {
    return { users: [], farmerData: [] };
  }
}

function writeStore(data) {
  ensureStore();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export const FileStore = {
  findUserByEmail(email) {
    const data = readStore();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById(id) {
    const data = readStore();
    return data.users.find((u) => String(u._id) === String(id) || String(u.id) === String(id)) || null;
  },

  createUser({ name, email, password }) {
    const data = readStore();
    const newUser = {
      _id: crypto.randomUUID(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    data.users.push(newUser);
    writeStore(data);
    return newUser;
  },

  createFarmerData(record) {
    const data = readStore();
    const newRecord = {
      _id: crypto.randomUUID(),
      ...record,
      createdAt: new Date().toISOString(),
    };
    data.farmerData.push(newRecord);
    writeStore(data);
    return newRecord;
  },

  findFarmerDataByUser(userId) {
    const data = readStore();
    return data.farmerData
      .filter((f) => String(f.userId) === String(userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  findLatestFarmerDataByUser(userId) {
    const list = this.findFarmerDataByUser(userId);
    return list.length > 0 ? list[0] : null;
  },
};
