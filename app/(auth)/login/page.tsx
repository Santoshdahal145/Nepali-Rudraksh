"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Star,
  ShieldCheck,
  Leaf,
  Gem,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/providers/AuthContext";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { loginSchema } from "./validation";
import GoogleLoginBtn from "@/components/ui/GoogleLoginBtn";

const features = [
  {
    icon: ShieldCheck,
    title: "Authenticity Guaranteed",
    desc: "Every bead is hand-verified by Nepali experts with a certificate of origin.",
  },
  {
    icon: Leaf,
    title: "Ethically Sourced",
    desc: "Sustainably harvested from the sacred forests of the Himalayan foothills.",
  },
  {
    icon: Gem,
    title: "Premium Quality",
    desc: "Only the finest Mukhi grades — 1 to 21 — curated for spiritual seekers.",
  },
  {
    icon: Star,
    title: "Trusted by 10,000+",
    desc: "Join thousands of devotees who have found their perfect Rudraksha with us.",
  },
];

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Yoga Practitioner",
    text: "The 5 Mukhi mala I ordered transformed my morning practice. Truly authentic.",
    avatar: "AS",
  },
  {
    name: "Priya Nair",
    role: "Spiritual Coach",
    text: "Finally a trusted source for genuine Nepali Rudraksha. Fast delivery too!",
    avatar: "PN",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const { login } = useAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values.email, values.password);
        router.push("/");
      } catch (err) {
        console.error("Login submission error:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#faf7f2]">
      {/* ───── LEFT: Login Card ───── */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        {/* Subtle blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-200/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-200/20 blur-3xl" />

        <div className="relative w-full max-w-md">
          {/* Logo / Brand */}
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#713f12] text-2xl text-white shadow-lg shadow-amber-900/30">
              🌿
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-[#422006]">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue your journey with{" "}
              <span className="font-semibold text-amber-800">
                Nepali Rudraksh
              </span>
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-amber-900/10 bg-white/90 p-6 shadow-xl shadow-amber-950/5 backdrop-blur sm:p-8">
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-5"
              noValidate
            >
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

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-[#422006]"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-amber-800 hover:text-amber-950 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your password"
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

              {/* Submit */}
              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="h-11 w-full bg-[#713f12] font-medium text-white hover:bg-[#5c330e]"
              >
                {formik.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Sign in</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Google */}
            <GoogleLoginBtn />

            {/* Register */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-amber-800 hover:text-amber-950 hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
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
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute right-20 bottom-40 h-48 w-48 rounded-full bg-amber-400/10" />

        {/* Top: brand copy */}
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
            Discover the Power of{" "}
            <span className="text-amber-300">Himalayan Rudraksha</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-amber-100/80">
            Direct from the sacred forests of Nepal — hand-selected beads that
            carry centuries of spiritual energy, healing, and divine protection.
          </p>
        </div>

        {/* Middle: feature grid */}
        <div className="relative px-12">
          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:bg-white/10"
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

        {/* Bottom: testimonials */}
        <div className="relative px-12 pb-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="mb-3 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-sm italic leading-relaxed text-amber-100/90">
              &ldquo;{testimonials[activeTestimonial].text}&rdquo;
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/30 text-xs font-bold text-white">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {testimonials[activeTestimonial].name}
                  </p>
                  <p className="text-xs text-amber-300/70">
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === activeTestimonial
                        ? "w-5 bg-amber-400"
                        : "w-2 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
