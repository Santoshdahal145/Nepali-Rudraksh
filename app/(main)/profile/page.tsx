"use client";

import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Crown,
  Eye,
  EyeOff,
  FileText,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Phone,
  Save,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/providers/AuthContext";

export default function ProfilePage() {
  const {
    user,
    isAuthenticated,
    logout,
    changePassword,
    updateProfile,
    setUserToSessionStorage,
  } = useAuth();
  const router = useRouter();

  // Profile Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Populate form with user details when available
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("A valid email address is required");
      return;
    }

    try {
      setIsUpdatingProfile(true);
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
      });

      // Update session state
      if (user) {
        setUserToSessionStorage({
          ...user,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
        });
      }
      toast.success("Devotee profile details updated successfully");
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message || "Failed to update profile details");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!oldPassword) {
      setPasswordError("Please enter your current password");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (oldPassword === newPassword) {
      setPasswordError(
        "New password must be different from your current password"
      );
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword(oldPassword, newPassword);

      // Reset fields on success
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Your password has been changed successfully");
    } catch (err: unknown) {
      const error = err as { message?: string };
      const msg =
        error?.message || "Incorrect current password or update failed";
      setPasswordError(msg);
      toast.error(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();

      router.push("/login");
    } catch (err: unknown) {
      console.error("Logout error:", err);
      router.push("/login");
    }
  };

  // Format date helper
  const formatDate = (dateVal: string | Date | undefined) => {
    if (!dateVal) return "Recently joined";
    try {
      return new Date(dateVal).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Active Member";
    }
  };

  // Guest view if user is not authenticated
  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-[75vh] bg-[#fcfaf7] px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-xl">
          <Card className="border-amber-900/15 bg-white shadow-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-[#713f12] shadow-inner">
                <Sparkles className="h-8 w-8 text-[#713f12]" />
              </div>
              <CardTitle className="text-2xl font-extrabold text-[#422006]">
                Devotee Sanctuary Access
              </CardTitle>
              <CardDescription className="text-sm text-[#5c3a1e]/80 mt-1.5 max-w-md mx-auto">
                Sign in to view your sacred profile, review consecrated orders,
                update contact details, and manage your spiritual preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="rounded-xl border border-amber-900/10 bg-amber-50/50 p-4 text-xs text-[#5c3a1e] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#422006]">
                  <ShieldCheck className="h-4 w-4 text-amber-700" />
                  Benefits of Devotee Membership:
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[#5c3a1e]/90">
                  <li>Personalized Mukhi Rudraksha consultation records</li>
                  <li>Temple consecration & Pooja certificate history</li>
                  <li>Express checkout with saved delivery addresses</li>
                  <li>Real-time order tracking & priority dispatch</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/login" className="flex-1">
                  <Button className="w-full h-11 rounded-xl bg-[#713f12] text-white hover:bg-[#5c3a1e] font-bold shadow-xs">
                    Sign In to Account
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl border-amber-900/20 text-[#713f12] hover:bg-amber-50 font-bold"
                  >
                    Create New Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const isAdmin = user.role === "ADMIN";
  const isVerified = Boolean(user.isEmailVerified);
  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
    "D";

  return (
    <main className="min-h-[85vh] bg-[#fcfaf7] px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#5c3a1e]/70">
          <Link href="/" className="hover:text-[#713f12] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#422006]">Devotee Profile</span>
        </div>

        {/* Devotee Hero Profile Card */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-900/15 bg-linear-to-br from-white via-amber-50/40 to-amber-100/30 p-6 sm:p-8 shadow-xs">
          {/* Subtle background sacred pattern / glow */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-amber-200/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-56 w-56 rounded-full bg-amber-300/15 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* User Avatar */}
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-3 border-amber-300/60 bg-[#713f12] text-2xl font-black text-amber-100 shadow-md">
              {initials}
              {isAdmin && (
                <div
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white shadow-xs"
                  title="Administrator Privileges"
                >
                  <Crown className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* User Primary Information */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Badge
                  variant={isAdmin ? "gold" : "sacred"}
                  className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5"
                >
                  {isAdmin ? "👑 Administrator" : "🌿 Devotee Member"}
                </Badge>
                {isVerified ? (
                  <Badge
                    variant="success"
                    className="text-[11px] gap-1 px-2.5 py-0.5"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Verified Email
                  </Badge>
                ) : (
                  <Badge
                    variant="warning"
                    className="text-[11px] gap-1 px-2.5 py-0.5"
                  >
                    <ShieldAlert className="h-3 w-3 text-amber-700" />
                    Unverified Email
                  </Badge>
                )}
                <span className="text-xs text-[#5c3a1e]/60 font-mono bg-amber-100/50 px-2 py-0.5 rounded border border-amber-900/10">
                  ID: #{user.id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006] tracking-tight">
                {user.firstName} {user.lastName}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-[#5c3a1e]/80">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-amber-800" />
                  {user.email}
                </span>
                {user.phoneNumber && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-amber-800" />
                    {user.phoneNumber}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-800" />
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:self-start">
              {isAdmin && (
                <Link href="/admin/all-users">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 rounded-xl border-amber-900/20 text-[#713f12] hover:bg-amber-100/60 font-bold text-xs"
                  >
                    <Crown className="h-3.5 w-3.5 text-amber-600" />
                    Admin Panel
                  </Button>
                </Link>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="h-9 gap-1.5 rounded-xl border-amber-900/20 text-rose-800 hover:bg-rose-50 font-bold text-xs"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-700" />
                Log Out
              </Button>
            </div>
          </div>
        </div>

        {/* Tabbed Profile Dashboard */}
        <Tabs defaultValue="personal" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto sm:mx-0 h-12 rounded-xl bg-amber-100/60 p-1 border border-amber-900/15">
            <TabsTrigger
              value="personal"
              className="rounded-lg gap-2 text-xs sm:text-sm font-bold"
            >
              <UserIcon className="h-4 w-4" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-lg gap-2 text-xs sm:text-sm font-bold"
            >
              <Lock className="h-4 w-4" />
              <span>Password</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Personal Details */}
          <TabsContent value="personal" className="space-y-6">
            <Card className="border-amber-900/15 shadow-xs">
              <CardHeader className="border-b border-amber-900/10 pb-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-[#713f12]" />
                  <CardTitle className="text-lg font-bold text-[#422006]">
                    Devotee Personal Details
                  </CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm text-[#5c3a1e]/70">
                  Update your contact information and identity for order
                  dispatch and temple consecration records.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#422006] uppercase tracking-wide">
                        First Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="e.g. Aarav"
                        className="w-full h-11 rounded-xl border border-amber-900/20 bg-amber-50/20 px-3.5 text-sm text-[#422006] outline-none  transition-all"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#422006] uppercase tracking-wide">
                        Last Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="e.g. Sharma"
                        className="w-full h-11 rounded-xl border border-amber-900/20 bg-amber-50/20 px-3.5 text-sm text-[#422006] outline-none  transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006] uppercase tracking-wide">
                      Contact Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+977-9841234567"
                        className="w-full h-11 rounded-xl border border-amber-900/20 bg-amber-50/20 pl-10 pr-3.5 text-sm text-[#422006] placeholder:text-stone-400 outline-none focus:border-amber-700 focus:bg-white transition-all"
                      />
                      <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Devotee Admin Note / Astrological Guidance if present */}
                  {user.adminNote && (
                    <div className="rounded-xl border border-amber-900/20 bg-amber-50/60 p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#713f12]">
                        <FileText className="h-3.5 w-3.5 text-amber-700" />
                        Temple Astrologer & Special Guidance Note:
                      </div>
                      <p className="text-xs text-[#5c3a1e]/90 italic">
                        {user.adminNote}
                      </p>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="h-11 px-6 rounded-xl bg-[#713f12] text-white hover:bg-[#5c3a1e] font-bold shadow-xs transition-all"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Profile Details
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: Security & Change Password */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-amber-900/15 shadow-xs">
              <CardHeader className="border-b border-amber-900/10 pb-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-[#713f12]" />
                  <CardTitle className="text-lg font-bold text-[#422006]">
                    Change Your Password
                  </CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm text-[#5c3a1e]/70">
                  Ensure your account remains safe with a strong, secure
                  spiritual password.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-5 max-w-lg"
                >
                  {passwordError && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-800 flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006] uppercase tracking-wide">
                      Current Password <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        placeholder="Enter your existing password"
                        className="w-full h-11 rounded-xl border border-amber-900/20 bg-amber-50/20 pl-10 pr-10 text-sm text-[#422006] placeholder:text-stone-400 outline-none focus:border-amber-700 focus:bg-white transition-all"
                      />
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-3 text-stone-400 hover:text-[#713f12] transition-colors"
                        tabIndex={-1}
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006] uppercase tracking-wide">
                      New Password <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="Minimum 8 characters"
                        className="w-full h-11 rounded-xl border border-amber-900/20 bg-amber-50/20 pl-10 pr-10 text-sm text-[#422006] placeholder:text-stone-400 outline-none focus:border-amber-700 focus:bg-white transition-all"
                      />
                      <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-stone-400 hover:text-[#713f12] transition-colors"
                        tabIndex={-1}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006] uppercase tracking-wide">
                      Confirm New Password{" "}
                      <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Re-type your new password"
                        className="w-full h-11 rounded-xl border border-amber-900/20 bg-amber-50/20 pl-10 pr-10 text-sm text-[#422006] placeholder:text-stone-400 outline-none focus:border-amber-700 focus:bg-white transition-all"
                      />
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-3 text-stone-400 hover:text-[#713f12] transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Guidelines Checklist */}
                  <div className="rounded-xl border border-amber-900/10 bg-amber-50/40 p-4 text-xs space-y-2 text-[#5c3a1e]">
                    <span className="font-bold text-[#422006] block">
                      Password Security Tips:
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          newPassword.length >= 8
                            ? "bg-emerald-600"
                            : "bg-stone-300"
                        }`}
                      />
                      <span>At least 8 characters long</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          newPassword && newPassword === confirmPassword
                            ? "bg-emerald-600"
                            : "bg-stone-300"
                        }`}
                      />
                      <span>Both passwords match identically</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-start pt-2">
                    <Button
                      type="submit"
                      disabled={isChangingPassword}
                      className="h-11 px-6 rounded-xl bg-[#713f12] text-white hover:bg-[#5c3a1e] font-bold shadow-xs transition-all"
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <KeyRound className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
