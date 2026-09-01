"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestAPI } from "@/lib/requestAPI";
import { useFormik } from "formik";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginApi } from "../api/auth/login/api";
import { adminLoginSchema } from "./validation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "admin@nepalirudraksh.com",
      password: "YourStrongAdminPassword123!",
    },
    validationSchema: adminLoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await requestAPI(
          loginApi({
            email: values.email,
            password: values.password,
          })
        );
        router.push("/admin/dashboard");
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#faf7f2] p-4 sm:p-6">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-200/25 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#713f12] via-[#8b4513] to-[#422006] text-3xl shadow-xl shadow-amber-950/20">
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
          <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
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
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="admin@nepalirudraksh.com"
                  className="h-11 pl-10 border-amber-900/15 text-sm focus-visible:ring-amber-700 bg-amber-50/20"
                  aria-invalid={formik.touched.email && !!formik.errors.email}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs font-semibold text-red-600">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="text-xs font-bold uppercase tracking-wider text-[#422006]"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter administrator password"
                  className="h-11 pl-10 pr-10 border-amber-900/15 text-sm focus-visible:ring-amber-700 bg-amber-50/20"
                  aria-invalid={
                    formik.touched.password && !!formik.errors.password
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#422006]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs font-semibold text-red-600">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="mt-2 h-11 w-full bg-[#713f12] text-white font-bold shadow-md shadow-amber-950/20 hover:bg-[#5c330e] transition-all"
            >
              {formik.isSubmitting ? (
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
        </div>

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
