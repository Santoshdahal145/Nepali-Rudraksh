"use client";

import { useState } from "react";
import { useFormik } from "formik";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Star,
  ShieldCheck,
  Leaf,
  Gem,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { registerSchema } from "./validation";
import { requestAPI } from "@/lib/requestAPI";
import { registerApi } from "@/app/api/auth/register/api";
import { useRouter } from "next/navigation";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Authenticity Guaranteed",
    desc: "Every bead hand-verified by Nepali experts with a certificate of origin.",
  },
  {
    icon: Leaf,
    title: "Ethically Sourced",
    desc: "Sustainably harvested from the sacred Himalayan foothills.",
  },
  {
    icon: Gem,
    title: "Premium Quality",
    desc: "Finest Mukhi grades 1–21 curated for spiritual seekers.",
  },
  {
    icon: Star,
    title: "Exclusive Member Perks",
    desc: "Early access to rare collections & members-only discounts.",
  },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await requestAPI(registerApi({ ...values }));
        router.push(`/verify-otp?email=${values.email}`);
      } catch (err) {
        console.error("Registration error:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#faf7f2]">
      {/* ───── LEFT: Register Form ───── */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-200/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-200/20 blur-3xl" />

        <div className="relative w-full max-w-md">
          {/* Brand header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#713f12] text-2xl text-white shadow-lg shadow-amber-900/30">
              🌿
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-[#422006]">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join{" "}
              <span className="font-semibold text-amber-800">
                Nepali Rudraksh
              </span>{" "}
              and begin your spiritual journey
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-amber-900/10 bg-white/90 p-6 shadow-xl shadow-amber-950/5 backdrop-blur sm:p-8">
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-4"
              noValidate
            >
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-[#422006]"
                  >
                    First name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="First name"
                      className="h-11 pl-10 focus-visible:ring-amber-700"
                      aria-invalid={
                        formik.touched.firstName && !!formik.errors.firstName
                      }
                    />
                  </div>
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-xs font-semibold text-red-600">
                      {formik.errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-[#422006]"
                  >
                    Last name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formik.values.lastName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Last name"
                      className="h-11 pl-10 focus-visible:ring-amber-700"
                      aria-invalid={
                        formik.touched.lastName && !!formik.errors.lastName
                      }
                    />
                  </div>
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-xs font-semibold text-red-600">
                      {formik.errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-[#422006]"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="you@example.com"
                    className="h-11 pl-10 focus-visible:ring-amber-700"
                    aria-invalid={formik.touched.email && !!formik.errors.email}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-xs font-semibold text-red-600">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-[#422006]"
                >
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phoneNumber"
                    type="tel"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="+977 98XXXXXXXX"
                    className="h-11 pl-10 focus-visible:ring-amber-700"
                    aria-invalid={
                      formik.touched.phoneNumber && !!formik.errors.phoneNumber
                    }
                  />
                </div>
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <p className="text-xs font-semibold text-red-600">
                    {formik.errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#422006]"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Create a strong password"
                    className="h-11 pl-10 pr-10 focus-visible:ring-amber-700"
                    aria-invalid={
                      formik.touched.password && !!formik.errors.password
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-[#422006]"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Re-enter your password"
                    className="h-11 pl-10 pr-10 focus-visible:ring-amber-700"
                    aria-invalid={
                      formik.touched.confirmPassword &&
                      !!formik.errors.confirmPassword
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-xs font-semibold text-red-600">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="h-11 w-full bg-[#713f12] text-white hover:bg-[#5c330e] font-medium"
              >
                {formik.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Create account</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Google */}
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full border-amber-900/15 hover:bg-amber-50"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-amber-800 hover:text-amber-950 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* ───── RIGHT: Brand Panel ───── */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-linear-to-br from-[#713f12] via-[#8B4A0F] to-[#422006]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute right-20 bottom-40 h-48 w-48 rounded-full bg-amber-400/10" />

        {/* Brand copy */}
        <div className="relative px-12 pt-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-4xl">🌿</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-300/80">
                Nepali Rudraksh
              </p>
              <p className="text-lg font-bold text-white">
                Sacred. Authentic. Pure.
              </p>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold leading-snug text-white">
            Your Sacred Journey{" "}
            <span className="text-amber-300">Begins Here</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-amber-100/80">
            Create your account and unlock access to authentic Himalayan
            Rudraksha — sourced, verified, and delivered straight to your
            doorstep.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="relative px-12">
          <div className="grid grid-cols-2 gap-4">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:bg-white/10"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/20">
                  <Icon className="h-4 w-4 text-amber-300" />
                </div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-100/70">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badge */}
        <div className="relative px-12 pb-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {["RK", "SM", "AP", "DN"].map((init) => (
                  <div
                    key={init}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#713f12] bg-amber-400/30 text-xs font-bold text-white"
                  >
                    {init}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  10,000+ members
                </p>
                <div className="mt-0.5 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="ml-1 text-xs text-amber-300/80">
                    4.9 average rating
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs italic leading-relaxed text-amber-100/70">
              &ldquo;Joining was the best decision — the quality and
              authenticity is unmatched.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
