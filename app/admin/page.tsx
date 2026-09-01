"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdmin } from "./data/AdminContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdmin();

  const [email, setEmail] = useState("admin@nepalirudraksh.com");
  const [password, setPassword] = useState("Admin@Rudraksh2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Please provide both email and password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const ok = login(email, password);
      if (ok) {
        setSuccessMessage("Authentication verified. Redirecting to Dashboard...");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 800);
      } else {
        setErrorMessage("Invalid credentials. Please verify your admin email and password.");
        setIsLoading(false);
      }
    }, 600);
  };

  const handleQuickDemoFill = () => {
    setEmail("admin@nepalirudraksh.com");
    setPassword("Admin@Rudraksh2026");
    setErrorMessage("");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#faf7f2] p-4 sm:p-6">
      {/* Decorative ambient background */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-200/25 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Sacred Brand Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#713f12] via-[#8b4513] to-[#422006] text-3xl shadow-xl shadow-amber-950/20">
            🌿
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-bold text-[#713f12] border border-amber-900/10 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Authorized Personnel Only</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#422006]">
            Nepali Rudraksh Admin
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5c3a1e]/70">
            Sign in to manage sacred inventory, devotee orders & store settings.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-amber-900/10 bg-white/95 p-6 sm:p-8 shadow-2xl shadow-amber-950/10 backdrop-blur-md">
          {errorMessage && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-800 border border-red-200 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="text-xs font-bold uppercase tracking-wider text-[#422006]"
              >
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nepalirudraksh.com"
                  className="h-11 pl-10 border-amber-900/15 text-sm focus-visible:ring-amber-700 bg-amber-50/20"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="text-xs font-bold uppercase tracking-wider text-[#422006]"
                >
                  Password
                </label>
                <Link
                  href="/admin/settings"
                  className="text-[11px] font-semibold text-amber-800 hover:underline"
                >
                  Need access help?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="h-11 pl-10 pr-10 border-amber-900/15 text-sm focus-visible:ring-amber-700 bg-amber-50/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#422006]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & 1-Click Fill Helper */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-admin"
                  checked={rememberMe}
                  onCheckedChange={(c) => setRememberMe(!!c)}
                />
                <label
                  htmlFor="remember-admin"
                  className="text-xs font-medium text-[#5c3a1e] cursor-pointer"
                >
                  Keep me signed in
                </label>
              </div>

              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[11px] font-bold text-[#713f12] hover:underline inline-flex items-center gap-1"
              >
                <KeyRound className="h-3 w-3" />
                Demo Credentials
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-11 w-full bg-[#713f12] text-white font-bold shadow-md shadow-amber-950/20 hover:bg-[#5c330e] transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Enter Admin Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Quick Demo Info Box */}
          <div className="mt-5 rounded-2xl border border-amber-900/10 bg-amber-50/50 p-3.5 text-center">
            <p className="text-[11px] font-semibold text-[#5c3a1e]">
              Default Demo Account: <span className="font-bold text-[#713f12]">admin@nepalirudraksh.com</span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Password: <code className="rounded bg-amber-100/70 px-1 py-0.5 text-[#422006]">Admin@Rudraksh2026</code>
            </p>
          </div>
        </div>

        {/* Return to Public Website */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-[#5c3a1e] hover:text-[#713f12] transition inline-flex items-center gap-1.5"
          >
            <span>← Return to Public Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
