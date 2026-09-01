"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Lock,
  User,
  Store,
  Bell,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  KeyRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAdmin } from "../data/AdminContext";

export default function AdminSettingsPage() {
  const { settings, updateSettings, changePassword } = useAdmin();

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // Store config state
  const [profileData, setProfileData] = useState(settings.adminProfile);
  const [storeConfig, setStoreConfig] = useState(settings.storeConfig);
  const [notifications, setNotifications] = useState(settings.notifications);
  const [gateways, setGateways] = useState(settings.paymentGateways);

  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ success: false, message: "New passwords do not match." });
      return;
    }

    const res = changePassword(currentPassword, newPassword);
    setPasswordFeedback(res);

    if (res.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Admin credentials updated securely!");
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ adminProfile: profileData });
    showToast("Admin Profile updated successfully.");
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ storeConfig });
    showToast("Store & Vedic Consecration defaults saved.");
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ notifications });
    showToast("Notification rules saved.");
  };

  const handleSaveGateways = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ paymentGateways: gateways });
    showToast("Payment gateways updated.");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#713f12] px-4 py-3 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-amber-300" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" className="text-[10px]">
              System Administration
            </Badge>
            <span className="text-xs text-muted-foreground">
              Security & Store Configuration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006]">
            Admin Settings & Security
          </h1>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/80 mt-1 max-w-2xl">
            Update administrator passwords, manage 2-factor authentication, Vedic consecration pricing rules, and payment gateways.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto p-1.5 gap-1 bg-amber-100/70 border border-amber-900/10 rounded-2xl">
          <TabsTrigger value="security" className="gap-2 text-xs font-bold">
            <Lock className="h-4 w-4 text-[#713f12]" />
            Security & Password
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2 text-xs font-bold">
            <User className="h-4 w-4 text-[#713f12]" />
            Admin Profile
          </TabsTrigger>
          <TabsTrigger value="store" className="gap-2 text-xs font-bold">
            <Store className="h-4 w-4 text-[#713f12]" />
            Store & Consecration
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 text-xs font-bold">
            <Bell className="h-4 w-4 text-[#713f12]" />
            Alerts & Notifications
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2 text-xs font-bold">
            <CreditCard className="h-4 w-4 text-[#713f12]" />
            Payment Gateways
          </TabsTrigger>
        </TabsList>

        {/* 1. Security & Change Password */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Password Form Card */}
            <Card className="lg:col-span-2 shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-[#713f12]" />
                  Change Administrator Password
                </CardTitle>
                <CardDescription>
                  Ensure your account is using a long, random password to stay secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {passwordFeedback && (
                  <div
                    className={`mb-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold border ${
                      passwordFeedback.success
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-red-50 text-red-800 border-red-200"
                    }`}
                  >
                    {passwordFeedback.success ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    )}
                    <span>{passwordFeedback.message}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showPass ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="h-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">New Password</label>
                    <Input
                      type={showPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="h-10"
                      required
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Confirm New Password</label>
                    <Input
                      type={showPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="h-10"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" className="bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e]">
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* 2FA Card */}
            <Card className="shadow-xs lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#713f12]" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>Extra layer of security for temple database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-amber-50 p-3.5 border border-amber-900/10">
                  <div>
                    <p className="text-xs font-bold text-[#422006]">2FA Status</p>
                    <p className="text-[11px] text-muted-foreground">
                      {profileData.twoFactorEnabled ? "Active & Enforced" : "Disabled"}
                    </p>
                  </div>
                  <Switch
                    checked={profileData.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      setProfileData({ ...profileData, twoFactorEnabled: checked })
                    }
                  />
                </div>
                <p className="text-xs text-[#5c3a1e]/80 leading-relaxed">
                  When enabled, all admin logins require OTP authentication sent to verified email or authenticator app.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. Admin Profile */}
        <TabsContent value="profile">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Admin Personal & Contact Info</CardTitle>
              <CardDescription>Manage display name, administrative email, and authority role</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Full Name</label>
                    <Input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Admin Email</label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Phone Number</label>
                    <Input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Admin Authority Role</label>
                    <Input
                      type="text"
                      value={profileData.role}
                      onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" className="bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e]">
                    Save Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Store & Consecration Settings */}
        <TabsContent value="store">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Store & Vedic Puja Defaults</CardTitle>
              <CardDescription>Default currency, consecration fees, and shipping policies</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveStore} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Store Name</label>
                    <Input
                      type="text"
                      value={storeConfig.storeName}
                      onChange={(e) => setStoreConfig({ ...storeConfig, storeName: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Customer Support Email</label>
                    <Input
                      type="email"
                      value={storeConfig.supportEmail}
                      onChange={(e) => setStoreConfig({ ...storeConfig, supportEmail: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Standard Consecration Fee ($)</label>
                    <Input
                      type="number"
                      value={storeConfig.defaultConsecrationFee}
                      onChange={(e) =>
                        setStoreConfig({ ...storeConfig, defaultConsecrationFee: Number(e.target.value) })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Free Shipping Threshold ($)</label>
                    <Input
                      type="number"
                      value={storeConfig.freeShippingThreshold}
                      onChange={(e) =>
                        setStoreConfig({ ...storeConfig, freeShippingThreshold: Number(e.target.value) })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-[#422006]">Primary Temple Consecration Origin</label>
                    <Input
                      type="text"
                      value={storeConfig.templeOrigin}
                      onChange={(e) => setStoreConfig({ ...storeConfig, templeOrigin: e.target.value })}
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" className="bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e]">
                    Save Store Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Alerts & Notifications */}
        <TabsContent value="notifications">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Email & SMS Alert Notifications</CardTitle>
              <CardDescription>Control when you receive alerts for new orders and low stock</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveNotifications} className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-amber-50/70 p-3.5 border border-amber-900/10">
                    <div>
                      <p className="text-xs font-bold text-[#422006]">Email on New Order</p>
                      <p className="text-[11px] text-muted-foreground">
                        Receive instant email notification when a devotee places an order.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailOnNewOrder}
                      onCheckedChange={(c) => setNotifications({ ...notifications, emailOnNewOrder: c })}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-amber-50/70 p-3.5 border border-amber-900/10">
                    <div>
                      <p className="text-xs font-bold text-[#422006]">Low Stock Alerts</p>
                      <p className="text-[11px] text-muted-foreground">
                        Notify admin when any Mukhi grade inventory drops below 4 units.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailOnLowStock}
                      onCheckedChange={(c) => setNotifications({ ...notifications, emailOnLowStock: c })}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-amber-50/70 p-3.5 border border-amber-900/10">
                    <div>
                      <p className="text-xs font-bold text-[#422006]">Daily Business Digest</p>
                      <p className="text-[11px] text-muted-foreground">
                        Morning email summary of previous day sales and upcoming consecrations.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.dailyDigest}
                      onCheckedChange={(c) => setNotifications({ ...notifications, dailyDigest: c })}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e]">
                    Save Notification Rules
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Payment Gateways */}
        <TabsContent value="payments">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Payment Gateway Configurations</CardTitle>
              <CardDescription>Enable or disable active checkout payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveGateways} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between rounded-xl bg-amber-50/70 p-3.5 border border-amber-900/10">
                    <div>
                      <p className="text-xs font-bold text-[#422006]">eSewa Digital Wallet (Nepal)</p>
                      <p className="text-[11px] text-muted-foreground">QR & Direct Wallet Integration</p>
                    </div>
                    <Switch
                      checked={gateways.esewa}
                      onCheckedChange={(c) => setGateways({ ...gateways, esewa: c })}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-amber-50/70 p-3.5 border border-amber-900/10">
                    <div>
                      <p className="text-xs font-bold text-[#422006]">Khalti Digital Wallet (Nepal)</p>
                      <p className="text-[11px] text-muted-foreground">Instant SDK Payments</p>
                    </div>
                    <Switch
                      checked={gateways.khalti}
                      onCheckedChange={(c) => setGateways({ ...gateways, khalti: c })}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-amber-50/70 p-3.5 border border-amber-900/10">
                    <div>
                      <p className="text-xs font-bold text-[#422006]">Stripe / Global Cards</p>
                      <p className="text-[11px] text-muted-foreground">Visa, MasterCard, Amex (USD)</p>
                    </div>
                    <Switch
                      checked={gateways.stripe}
                      onCheckedChange={(c) => setGateways({ ...gateways, stripe: c })}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-amber-50/70 p-3.5 border border-amber-900/10">
                    <div>
                      <p className="text-xs font-bold text-[#422006]">Cash on Delivery (Nepal)</p>
                      <p className="text-[11px] text-muted-foreground">Pay upon hand delivery</p>
                    </div>
                    <Switch
                      checked={gateways.cod}
                      onCheckedChange={(c) => setGateways({ ...gateways, cod: c })}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e]">
                    Save Payment Settings
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
