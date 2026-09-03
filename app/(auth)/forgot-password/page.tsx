"use client";

import { useState } from "react";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  Gem,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/providers/AuthContext";

const tips = [
  {
    icon: ShieldCheck,
    title: "Secure Reset",
    desc: "Your reset link is encrypted and expires in 15 minutes for your safety.",
  },
  {
    icon: Leaf,
    title: "Spam-Free",
    desc: "We never share your email address with third parties.",
  },
  {
    icon: Gem,
    title: "Instant Delivery",
    desc: "Reset emails are delivered within seconds to your inbox.",
  },
  {
    icon: Star,
    title: "Always Available",
    desc: "Our support team is here 24/7 if you need additional help.",
  },
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { forgotPassword } = useAuth();

  const handleSubmitEmail = async (email: string) => {
    try {
      await forgotPassword(email);
    } catch (err) {
      console.log("Error " + err);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#faf7f2]">
      {/* ───── LEFT: Form ───── */}
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
              Forgot Password ?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              No worries! Enter your email and we'll send you a otp.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-amber-900/10 bg-white/90 p-6 shadow-xl shadow-amber-950/5 backdrop-blur sm:p-8">
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (email) handleSubmitEmail(email);
              }}
            >
              <div className="space-y-2">
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
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-10 focus-visible:ring-amber-700"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full bg-[#713f12] text-white hover:bg-[#5c330e]"
              >
                Send OTP
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-800 hover:text-amber-950 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign in
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-amber-800 hover:text-amber-950 hover:underline"
            >
              Create one
            </Link>
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
            Account Recovery,{" "}
            <span className="text-amber-300">Made Simple</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-amber-100/80">
            We&apos;ll get you back on your spiritual journey in just a few
            moments. Your account and order history will be right where you left
            them.
          </p>
        </div>

        {/* Tips grid */}
        <div className="relative px-12">
          <div className="grid grid-cols-2 gap-4">
            {tips.map(({ icon: Icon, title, desc }) => (
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

        {/* Help callout */}
        <div className="relative px-12 pb-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm font-semibold text-white">
              Still having trouble?
            </p>
            <p className="mt-1 text-xs leading-relaxed text-amber-100/70">
              Our customer support team is available around the clock to help
              you regain access to your sacred Rudraksha collection.
            </p>
            <div className="mt-4 flex gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">
                📧 support@nepalirudraksh.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
