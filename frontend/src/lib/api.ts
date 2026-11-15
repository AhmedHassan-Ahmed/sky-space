import type { FieldShiftEvaluation } from "@/types/farm";

export function getApiBaseUrl(): string {
  // 1. Explicit override via public environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }

  // 2. Server-side runtime (Node.js / Vercel Serverless Function):
  // Reads the bound service variable BACKEND_URL injected by Vercel
  if (typeof window === "undefined") {
    if (process.env.BACKEND_URL) {
      return `${process.env.BACKEND_URL.replace(/\/+$/, "")}/api`;
    }
    return "http://localhost:5000/api";
  }

  // 3. Client-side browser:
  // Relative URL "/api" routes directly through Vercel's top-level rewrite rule
  // or Next.js development rewrites to the backend service.
  return "/api";
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: any) {
    throw new Error(
      `Cannot connect to Sky Space backend API (${url}). Make sure the backend server is running or BACKEND_URL binding is configured.`
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export interface UserProfile {
  _id?: string;
  id?: string;
  name: string;
  email: string;
}

export interface FarmerSubmissionPayload {
  landLocation: string;
  lat?: number;
  lon?: number;
  coordinates?: [number, number][];
  landArea: number; // In Feddans
  lastCrop: string;
  plantingStartDate: string;
  irrigationMethod: "Surface Irrigation" | "Drip" | "Sprinkler";
  waterAvailability: "Limited" | "Moderate" | "Abundant";
  planObjective: "Save Water" | "Improve Soil Health";
  scenarioModifiers?: {
    tempDeltaC: number;
    waterSupplyPctDelta: number;
  };
}

export interface SavedFarmerRecord extends FarmerSubmissionPayload {
  _id: string;
  userId: string;
  recommendation: FieldShiftEvaluation;
  createdAt: string;
}

export const api = {
  // Auth
  register: (name: string, email: string, password: string) =>
    apiFetch<{ token: string; user: UserProfile }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: UserProfile }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => apiFetch<UserProfile>("/auth/me"),

  // Farm
  getPresets: () => apiFetch("/farm/presets"),

  calculateRotation: (payload: FarmerSubmissionPayload) =>
    apiFetch<FieldShiftEvaluation>("/farm/calculate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  saveFarmerData: (payload: FarmerSubmissionPayload) =>
    apiFetch<{ message: string; record: SavedFarmerRecord }>("/farm", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getHistory: () => apiFetch<SavedFarmerRecord[]>("/farm/history"),

  getLatest: () => apiFetch<SavedFarmerRecord>("/farm/latest"),

  getGlossary: (lang: string = "ar") =>
    apiFetch<{ terms: any[]; glossary: Record<string, any> }>(`/farm/glossary?lang=${lang}`),

  getHarmonization: (lang: string = "en") =>
    apiFetch<any>(`/farm/harmonization?lang=${lang}`),
};
