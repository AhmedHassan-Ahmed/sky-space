"use client";

import React, { useState } from "react";
import { Lock, Mail, User as UserIcon, X, Loader2, CheckCircle2 } from "lucide-react";
import { api, setToken, type UserProfile } from "@/lib/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await api.register(name, email, password);
        setToken(res.token);
        onAuthSuccess(res.user);
      } else {
        const res = await api.login(email, password);
        setToken(res.token);
        onAuthSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-[#070B0E]/80 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto scroll-slim rounded-3xl bg-[#0B1015] border border-white/10 shadow-2xl text-[#F2F7F4] p-5 sm:p-6 relative">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 text-[#8A9B93] hover:text-white rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto flex items-center justify-center mb-3">
            <img
              src="/logo.svg"
              alt="Sky Space"
              className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(163,228,183,0.35)]"
            />
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === "login" ? "Sky Space Sign In" : "Join Sky Space"}
          </h2>
          <p className="text-xs text-[#8A9B93] mt-1">
            {mode === "login"
              ? "Access your saved field records & rotation history"
              : "Register to save your farm parameters and crop plans"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#121A21] rounded-2xl border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              mode === "login"
                ? "bg-white text-[#070B0E] shadow"
                : "text-[#8A9B93] hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              mode === "register"
                ? "bg-white text-[#070B0E] shadow"
                : "text-[#8A9B93] hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-[#8A9B93] mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8A9B93] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g., Ahmed Hassan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#121A21] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A3E4B7]/40"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#8A9B93] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A9B93] absolute left-3 top-3" />
              <input
                type="email"
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#121A21] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A3E4B7]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A9B93] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A9B93] absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#121A21] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A3E4B7]/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#A3E4B7] hover:bg-[#8ee0a7] text-[#070B0E] font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#A3E4B7]/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Please wait...</span>
              </>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-xs text-[#8A9B93]">
            {mode === "login" ? "New to FieldShift?" : "Already registered?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="text-[#A3E4B7] font-semibold hover:underline"
            >
              {mode === "login" ? "Register an account" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
