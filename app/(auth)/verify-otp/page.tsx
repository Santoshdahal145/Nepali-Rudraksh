"use client";

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { ArrowRight, ArrowLeft, RotateCcw, ShieldCheck, Leaf, Gem, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const OTP_LENGTH = 6;

const steps = [
  {
    icon: ShieldCheck,
    title: "Encrypted OTP",
    desc: "Your one-time code is secured with 256-bit encryption end-to-end.",
  },
  {
    icon: Leaf,
    title: "One-Time Use",
    desc: "Each code expires after use or within 10 minutes, whichever comes first.",
  },
  {
    icon: Gem,
    title: "Instant Verification",
    desc: "Your account is protected the moment verification is complete.",
  },
  {
    icon: Star,
    title: "Safe & Private",
    desc: "We never share your verification codes or personal details.",
  },
];

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...otp];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setOtp(next);
    const nextEmpty = pasted.length < OTP_LENGTH ? pasted.length : OTP_LENGTH - 1;
    inputRefs.current[nextEmpty]?.focus();
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#faf7f2]">
      {/* ───── LEFT: OTP Form ───── */}
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
              Verify Your Email
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ve sent a 6-digit code to your email.{" "}
              <br className="hidden sm:block" />
              Enter it below to continue.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-amber-900/10 bg-white/90 p-6 shadow-xl shadow-amber-950/5 backdrop-blur sm:p-8">
            {/* OTP Inputs */}
            <div className="mb-6">
              <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Enter verification code
              </p>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    autoFocus={i === 0}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className={`h-12 w-10 rounded-xl border-2 bg-white text-center text-xl font-bold text-[#422006] outline-none transition-all sm:h-14 sm:w-12 ${
                      digit
                        ? "border-[#713f12] shadow-sm shadow-amber-900/10"
                        : "border-amber-900/15 focus:border-amber-700"
                    }`}
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="button"
              disabled={!isComplete}
              className="h-11 w-full bg-[#713f12] text-white hover:bg-[#5c330e] disabled:opacity-50"
            >
              Verify &amp; Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {/* Resend */}
            <div className="mt-5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="inline-flex items-center gap-1.5 font-semibold text-amber-800 hover:text-amber-950 hover:underline"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Resend code
                </button>
              ) : (
                <span>
                  Resend code in{" "}
                  <span className="font-semibold text-[#422006]">
                    0:{countdown.toString().padStart(2, "0")}
                  </span>
                </span>
              )}
            </div>

            {/* Back */}
            <div className="mt-4 flex items-center justify-center">
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-800 hover:text-amber-950 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Wrong email?{" "}
            <Link
              href="/forgot-password"
              className="font-semibold text-amber-800 hover:text-amber-950 hover:underline"
            >
              Change it
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
              <p className="text-lg font-bold text-white">Sacred. Authentic. Pure.</p>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold leading-snug text-white">
            One Step Away from{" "}
            <span className="text-amber-300">Your Collection</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-amber-100/80">
            Verify your identity to safely access your account and continue exploring
            our authentic Himalayan Rudraksha collection.
          </p>
        </div>

        {/* Steps grid */}
        <div className="relative px-12">
          <div className="grid grid-cols-2 gap-4">
            {steps.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:bg-white/10"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/20">
                  <Icon className="h-4 w-4 text-amber-300" />
                </div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-100/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="relative px-12 pb-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-300/80">
              Recovery progress
            </p>
            <div className="flex items-center gap-3">
              {[
                { label: "Email sent", done: true },
                { label: "Verify code", done: false, active: true },
                { label: "New password", done: false },
              ].map((step, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      step.done
                        ? "bg-amber-400 text-[#422006]"
                        : step.active
                        ? "border-2 border-amber-400 bg-transparent text-amber-300"
                        : "border border-white/20 bg-transparent text-white/40"
                    }`}
                  >
                    {step.done ? "✓" : i + 1}
                  </div>
                  <p
                    className={`text-center text-[10px] leading-none ${
                      step.done || step.active ? "text-amber-200" : "text-white/40"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
