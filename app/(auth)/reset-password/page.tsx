"use client";

import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  RotateCcw,
  ShieldCheck,
  Leaf,
  Gem,
  Star,
  KeyRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/providers/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import { resetPasswordSchema } from "./validation";

const OTP_LENGTH = 6;

const resetTips = [
  {
    icon: ShieldCheck,
    title: "Secure Verification",
    desc: "Verification OTP is encrypted and strictly time-limited for your security.",
  },
  {
    icon: KeyRound,
    title: "Strong Protection",
    desc: "Set a unique password to safeguard your account and order details.",
  },
  {
    icon: Leaf,
    title: "Spam-Free Guarantee",
    desc: "We prioritize your privacy and never share credentials with anyone.",
  },
  {
    icon: Star,
    title: "24/7 Support",
    desc: "Need help? Our customer care team is available around the clock.",
  },
];

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { resetPasswordWithOtp, resendOtp } = useAuth();
  const router = useRouter();

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const formik = useFormik({
    initialValues: {
      email: emailParam,
      otp: "",
      password: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await resetPasswordWithOtp(values.email, values.otp, values.password);
        router.push("/login");
      } catch (err) {
        console.error("Reset password error:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleResendOtp = async () => {
    if (!formik.values.email) {
      formik.setFieldTouched("email", true);
      return;
    }
    setCountdown(60);
    setCanResend(false);
    try {
      await resendOtp(formik.values.email, "PASSWORD_RESET");
    } catch (err) {
      console.error("Resend OTP error:", err);
    }
  };

  const otpArray = Array.from(
    { length: OTP_LENGTH },
    (_, i) => formik.values.otp[i] || ""
  );

  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const digits = (formik.values.otp || "").split("");
    while (digits.length < OTP_LENGTH) digits.push("");
    digits[index] = digit;
    const newOtp = digits.join("").slice(0, OTP_LENGTH);
    formik.setFieldValue("otp", newOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    formik.setFieldValue("otp", pasted);
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#faf7f2]">
      {/* ───── LEFT: Form Card ───── */}
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
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the OTP sent to your email along with your new password.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-amber-900/10 bg-white/90 p-6 shadow-xl shadow-amber-950/5 backdrop-blur sm:p-8">
            <form
              onSubmit={formik.handleSubmit}
              className="space-y-4"
              noValidate
            >
              {/* Email Address */}
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

              {/* OTP Digits Grid */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#422006]">
                    6-Digit OTP Code
                  </label>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 hover:underline"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Resend OTP
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Resend in{" "}
                      <span className="font-semibold text-[#422006]">
                        0:{countdown.toString().padStart(2, "0")}
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex justify-between gap-1.5 sm:gap-2">
                  {otpArray.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      onBlur={() => formik.setFieldTouched("otp", true)}
                      className={`h-12 w-10 rounded-xl border-2 bg-white text-center text-lg font-bold text-[#422006] outline-none transition-all sm:h-12 sm:w-12 ${
                        digit
                          ? "border-[#713f12] shadow-sm shadow-amber-900/10"
                          : "focus:border-amber-700"
                      }`}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>
                {formik.touched.otp && formik.errors.otp && (
                  <p className="text-xs font-semibold text-red-600">
                    {formik.errors.otp}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-1.5 pt-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#422006]"
                >
                  New Password
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
                    placeholder="Enter new strong password"
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
                  Confirm New Password
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
                    placeholder="Re-enter your new password"
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
                className="mt-2 h-11 w-full bg-[#713f12] font-medium text-white hover:bg-[#5c330e]"
              >
                {formik.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Resetting Password...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Reset Password</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
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
            Secure Account,{" "}
            <span className="text-amber-300">Peace of Mind</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-amber-100/80">
            Set your new credentials to protect your sacred Rudraksha collection
            and personal order details.
          </p>
        </div>

        {/* Tips grid */}
        <div className="relative px-12">
          <div className="grid grid-cols-2 gap-4">
            {resetTips.map(({ icon: Icon, title, desc }) => (
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
              Need extra assistance?
            </p>
            <p className="mt-1 text-xs leading-relaxed text-amber-100/70">
              If you did not request this OTP or are experiencing problems
              resetting your password, contact support immediately.
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
