"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormik } from "formik";
import {
  CreditCard,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Store,
  User,
} from "lucide-react";
import { useState } from "react";
import { useAdmin } from "../data/AdminContext";
import {
  adminProfileValidation,
  changePasswordValidation,
  storeSettingsValidation,
} from "./validation";

export default function AdminSettingsPage() {
  const {
    changePassword,
    paymentGateways,
    storeSetting,
    updatePaymentGateways,
    updateStoreSetting,
    user,
    updateProfile,
  } = useAdmin();
  const [showPass, setShowPass] = useState(false);
  /*
   * ------------------------------------------------------------
   * Password Form
   * ------------------------------------------------------------
   */
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
    validationSchema: changePasswordValidation,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await changePassword(values.currentPassword, values.newPassword);
        resetForm();
        setShowPass(false);
      } catch (error) {
        console.error("Password update failed:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  /*
   * ------------------------------------------------------------
   * Admin Profile Form
   * ------------------------------------------------------------
   */

  const profileFormik = useFormik({
    initialValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
    },
    enableReinitialize: true,
    validationSchema: adminProfileValidation,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        await updateProfile({
          email: values.email!,
          firstName: values.firstName!,
          lastName: values.lastName!,
          phoneNumber: values.phoneNumber!,
        });
      } catch (error) {
        console.error("Profile update failed:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  /*
   * ------------------------------------------------------------
   * Store Settings Form
   * ------------------------------------------------------------
   */

  const storeFormik = useFormik({
    initialValues: {
      storeName: storeSetting?.storeName!,
      customerSupportEmail: storeSetting?.customerSupportEmail!,
      standardConsecrationFee: storeSetting?.standardConsecrationFee!,
      freeShippingThreshold: storeSetting?.freeShippingThreshold!,
      primaryTempleConsecrationOrigin:
        storeSetting?.primaryTempleConsecrationOrigin!,
    },
    validationSchema: storeSettingsValidation,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await updateStoreSetting({
          storeName: values.storeName,
          customerSupportEmail: values.customerSupportEmail,
          standardConsecrationFee: values.standardConsecrationFee,
          freeShippingThreshold: values.freeShippingThreshold,
          primaryTempleConsecrationOrigin:
            values.primaryTempleConsecrationOrigin,
        });
      } catch (error) {
        console.error("Store settings update failed:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });
  console.log("🚀 ~ AdminSettingsPage ~ storeFormik:", storeFormik.errors);

  /*
   * ------------------------------------------------------------
   * Payment Gateway Form
   * ------------------------------------------------------------
   */

  const gatewaysFormik = useFormik({
    initialValues: {
      esewa: paymentGateways?.esewaEnabled,
      khalti: paymentGateways?.khaltiEnabled,
      stripe: paymentGateways?.stripeEnabled,
      cod: paymentGateways?.codEnabled,
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await updatePaymentGateways({
          esewaEnabled: values.esewa ?? true,
          khaltiEnabled: values.khalti ?? true,
          stripeEnabled: values.stripe ?? true,
          codEnabled: values.cod ?? true,
        });
      } catch (error) {
        console.error("Payment gateway update failed:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* =========================================================
          PAGE HEADER
          ========================================================= */}

      <div className="flex flex-col gap-4 rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="gold" className="text-[10px]">
              System Administration
            </Badge>

            <span className="text-xs text-muted-foreground">
              Security & Store Configuration
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-[#422006] sm:text-3xl">
            Admin Settings & Security
          </h1>

          <p className="mt-1 max-w-2xl text-xs text-[#5c3a1e]/80 sm:text-sm">
            Update administrator passwords, Vedic consecration pricing rules,
            and payment gateways.
          </p>
        </div>
      </div>

      {/* =========================================================
          TABS
          ========================================================= */}

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-1 rounded-2xl border border-amber-900/10 bg-amber-100/70 p-1.5">
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

          <TabsTrigger value="payments" className="gap-2 text-xs font-bold">
            <CreditCard className="h-4 w-4 text-[#713f12]" />
            Payment Gateways
          </TabsTrigger>
        </TabsList>

        {/* =======================================================
            1. SECURITY
            ======================================================= */}

        <TabsContent value="security">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <KeyRound className="h-5 w-5 text-[#713f12]" />
                Change Administrator Password
              </CardTitle>

              <CardDescription>
                Ensure your account is using a long, random password to stay
                secure.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={passwordFormik.handleSubmit}
                className="space-y-4"
                noValidate
              >
                {/* Current Password */}

                <div className="space-y-1.5">
                  <label
                    htmlFor="currentPassword"
                    className="text-xs font-bold text-[#422006]"
                  >
                    Current Password
                  </label>

                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPass ? "text" : "password"}
                      value={passwordFormik.values.currentPassword}
                      onChange={passwordFormik.handleChange}
                      onBlur={passwordFormik.handleBlur}
                      placeholder="Enter current password"
                      disabled={passwordFormik.isSubmitting}
                      aria-invalid={
                        passwordFormik.touched.currentPassword &&
                        !!passwordFormik.errors.currentPassword
                      }
                      className="h-10 pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPass((value) => !value)}
                      disabled={passwordFormik.isSubmitting}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-[#422006] disabled:opacity-50"
                    >
                      {showPass ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {passwordFormik.touched.currentPassword &&
                    passwordFormik.errors.currentPassword && (
                      <p className="text-xs font-semibold text-red-600">
                        {passwordFormik.errors.currentPassword}
                      </p>
                    )}
                </div>

                {/* New Password */}

                <div className="space-y-1.5">
                  <label
                    htmlFor="newPassword"
                    className="text-xs font-bold text-[#422006]"
                  >
                    New Password
                  </label>

                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPass ? "text" : "password"}
                    value={passwordFormik.values.newPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    placeholder="At least 8 characters"
                    disabled={passwordFormik.isSubmitting}
                    aria-invalid={
                      passwordFormik.touched.newPassword &&
                      !!passwordFormik.errors.newPassword
                    }
                    className="h-10"
                  />

                  {passwordFormik.touched.newPassword &&
                    passwordFormik.errors.newPassword && (
                      <p className="text-xs font-semibold text-red-600">
                        {passwordFormik.errors.newPassword}
                      </p>
                    )}
                </div>

                {/* Confirm Password */}

                <div className="space-y-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="text-xs font-bold text-[#422006]"
                  >
                    Confirm New Password
                  </label>

                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPass ? "text" : "password"}
                    value={passwordFormik.values.confirmPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    placeholder="Repeat new password"
                    disabled={passwordFormik.isSubmitting}
                    aria-invalid={
                      passwordFormik.touched.confirmPassword &&
                      !!passwordFormik.errors.confirmPassword
                    }
                    className="h-10"
                  />

                  {passwordFormik.touched.confirmPassword &&
                    passwordFormik.errors.confirmPassword && (
                      <p className="text-xs font-semibold text-red-600">
                        {passwordFormik.errors.confirmPassword}
                      </p>
                    )}
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={
                      passwordFormik.isSubmitting || !passwordFormik.dirty
                    }
                    className="bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#713f12]"
                  >
                    {passwordFormik.isSubmitting
                      ? "Updating..."
                      : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =======================================================
            2. ADMIN PROFILE
            ======================================================= */}

        <TabsContent value="profile">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">
                Admin Personal & Contact Info
              </CardTitle>

              <CardDescription>
                Manage display name, administrative email, and authority role
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={profileFormik.handleSubmit}
                className="space-y-4"
                noValidate
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Name */}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="profile-first-name"
                      className="text-xs font-bold text-[#422006]"
                    >
                      First Name
                    </label>

                    <Input
                      id="profile-first-name"
                      name="firstName"
                      type="text"
                      value={profileFormik.values.firstName}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      placeholder="Administrator name"
                      disabled={profileFormik.isSubmitting}
                      aria-invalid={
                        profileFormik.touched.firstName &&
                        !!profileFormik.errors.firstName
                      }
                      className="h-10"
                    />

                    {profileFormik.touched.firstName &&
                      profileFormik.errors.firstName && (
                        <p className="text-xs font-semibold text-red-600">
                          {profileFormik.errors.firstName}
                        </p>
                      )}
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="profile-last-name"
                      className="text-xs font-bold text-[#422006]"
                    >
                      Last Name
                    </label>

                    <Input
                      id="profile-last-name"
                      name="lastName"
                      type="text"
                      value={profileFormik.values.lastName}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      placeholder="Administrator name"
                      disabled={profileFormik.isSubmitting}
                      aria-invalid={
                        profileFormik.touched.lastName &&
                        !!profileFormik.errors.lastName
                      }
                      className="h-10"
                    />

                    {profileFormik.touched.lastName &&
                      profileFormik.errors.lastName && (
                        <p className="text-xs font-semibold text-red-600">
                          {profileFormik.errors.lastName}
                        </p>
                      )}
                  </div>
                  {/* Email */}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="profile-email"
                      className="text-xs font-bold text-[#422006]"
                    >
                      Admin Email
                    </label>

                    <Input
                      id="profile-email"
                      name="email"
                      type="email"
                      value={profileFormik.values.email}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      placeholder="admin@example.com"
                      disabled={profileFormik.isSubmitting}
                      aria-invalid={
                        profileFormik.touched.email &&
                        !!profileFormik.errors.email
                      }
                      className="h-10"
                    />

                    {profileFormik.touched.email &&
                      profileFormik.errors.email && (
                        <p className="text-xs font-semibold text-red-600">
                          {profileFormik.errors.email}
                        </p>
                      )}
                  </div>

                  {/* Phone */}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="profile-phone"
                      className="text-xs font-bold text-[#422006]"
                    >
                      Phone Number
                    </label>

                    <Input
                      id="profile-phone"
                      name="phoneNumber"
                      type="tel"
                      value={profileFormik.values.phoneNumber}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      placeholder="98XXXXXXXX"
                      disabled={profileFormik.isSubmitting}
                      aria-invalid={
                        profileFormik.touched.phoneNumber &&
                        !!profileFormik.errors.phoneNumber
                      }
                      className="h-10"
                    />

                    {profileFormik.touched.phoneNumber &&
                      profileFormik.errors.phoneNumber && (
                        <p className="text-xs font-semibold text-red-600">
                          {profileFormik.errors.phoneNumber}
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={
                      profileFormik.isSubmitting || !profileFormik.dirty
                    }
                    className="bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#713f12]"
                  >
                    {profileFormik.isSubmitting ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =======================================================
            3. STORE SETTINGS
            ======================================================= */}

        <TabsContent value="store">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">
                Store & Vedic Puja Defaults
              </CardTitle>

              <CardDescription>
                Default currency, consecration fees, and shipping policies
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={storeFormik.handleSubmit}
                className="space-y-4"
                noValidate
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Store Name */}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="store-name"
                      className="text-xs font-bold text-[#422006]"
                    >
                      Store Name
                    </label>

                    <Input
                      id="store-name"
                      name="storeName"
                      type="text"
                      value={storeFormik.values.storeName}
                      onChange={storeFormik.handleChange}
                      onBlur={storeFormik.handleBlur}
                      placeholder="Nepali Rudraksh"
                      disabled={storeFormik.isSubmitting}
                      aria-invalid={
                        storeFormik.touched.storeName &&
                        !!storeFormik.errors.storeName
                      }
                      className="h-10"
                    />

                    {storeFormik.touched.storeName &&
                      storeFormik.errors.storeName && (
                        <p className="text-xs font-semibold text-red-600">
                          {storeFormik.errors.storeName}
                        </p>
                      )}
                  </div>

                  {/* Support Email */}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="support-email"
                      className="text-xs font-bold text-[#422006]"
                    >
                      Customer Support Email
                    </label>

                    <Input
                      id="support-email"
                      name="customerSupportEmail"
                      type="email"
                      value={storeFormik.values.customerSupportEmail}
                      onChange={storeFormik.handleChange}
                      onBlur={storeFormik.handleBlur}
                      placeholder="support@example.com"
                      disabled={storeFormik.isSubmitting}
                      aria-invalid={
                        storeFormik.touched.customerSupportEmail &&
                        !!storeFormik.errors.customerSupportEmail
                      }
                      className="h-10"
                    />

                    {storeFormik.touched.customerSupportEmail &&
                      storeFormik.errors.customerSupportEmail && (
                        <p className="text-xs font-semibold text-red-600">
                          {storeFormik.errors.customerSupportEmail}
                        </p>
                      )}
                  </div>

                  {/* Consecration Fee */}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="consecration-fee"
                      className="text-xs font-bold text-[#422006]"
                    >
                      Standard Consecration Fee ($)
                    </label>

                    <Input
                      id="consecration-fee"
                      name="standardConsecrationFee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={storeFormik.values.standardConsecrationFee}
                      onChange={storeFormik.handleChange}
                      onBlur={storeFormik.handleBlur}
                      placeholder="0"
                      disabled={storeFormik.isSubmitting}
                      aria-invalid={
                        storeFormik.touched.standardConsecrationFee &&
                        !!storeFormik.errors.standardConsecrationFee
                      }
                      className="h-10"
                    />

                    {storeFormik.touched.standardConsecrationFee &&
                      storeFormik.errors.standardConsecrationFee && (
                        <p className="text-xs font-semibold text-red-600">
                          {storeFormik.errors.standardConsecrationFee}
                        </p>
                      )}
                  </div>

                  {/* Free Shipping */}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="shipping-threshold"
                      className="text-xs font-bold text-[#422006]"
                    >
                      Free Shipping Threshold ($)
                    </label>

                    <Input
                      id="shipping-threshold"
                      name="freeShippingThreshold"
                      type="number"
                      min="0"
                      step="0.01"
                      value={storeFormik.values.freeShippingThreshold}
                      onChange={storeFormik.handleChange}
                      onBlur={storeFormik.handleBlur}
                      placeholder="0"
                      disabled={storeFormik.isSubmitting}
                      aria-invalid={
                        storeFormik.touched.freeShippingThreshold &&
                        !!storeFormik.errors.freeShippingThreshold
                      }
                      className="h-10"
                    />

                    {storeFormik.touched.freeShippingThreshold &&
                      storeFormik.errors.freeShippingThreshold && (
                        <p className="text-xs font-semibold text-red-600">
                          {storeFormik.errors.freeShippingThreshold}
                        </p>
                      )}
                  </div>

                  {/* Temple Origin */}

                  <div className="space-y-1.5 sm:col-span-2">
                    <label
                      htmlFor="temple-origin"
                      className="text-xs font-bold text-[#422006]"
                    >
                      Primary Temple Consecration Origin
                    </label>

                    <Input
                      id="temple-origin"
                      name="primaryTempleConsecrationOrigin"
                      type="text"
                      value={storeFormik.values.primaryTempleConsecrationOrigin}
                      onChange={storeFormik.handleChange}
                      onBlur={storeFormik.handleBlur}
                      placeholder="Enter temple origin"
                      disabled={storeFormik.isSubmitting}
                      aria-invalid={
                        storeFormik.touched.primaryTempleConsecrationOrigin &&
                        !!storeFormik.errors.primaryTempleConsecrationOrigin
                      }
                      className="h-10"
                    />

                    {storeFormik.touched.primaryTempleConsecrationOrigin &&
                      storeFormik.errors.primaryTempleConsecrationOrigin && (
                        <p className="text-xs font-semibold text-red-600">
                          {storeFormik.errors.primaryTempleConsecrationOrigin}
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={storeFormik.isSubmitting || !storeFormik.dirty}
                    className="bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#713f12]"
                  >
                    {storeFormik.isSubmitting
                      ? "Saving..."
                      : "Save Store Settings"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =======================================================
            4. PAYMENT GATEWAYS
            ======================================================= */}

        <TabsContent value="payments">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">
                Payment Gateway Configurations
              </CardTitle>

              <CardDescription>
                Enable or disable active checkout payment methods
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={gatewaysFormik.handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* eSewa */}

                  <div className="flex items-center justify-between rounded-xl border border-amber-900/10 bg-amber-50/70 p-3.5">
                    <div>
                      <p className="text-xs font-bold text-[#422006]">
                        eSewa Digital Wallet (Nepal)
                      </p>

                      <p className="text-[11px] text-muted-foreground">
                        QR & Direct Wallet Integration
                      </p>
                    </div>

                    <Switch
                      checked={gatewaysFormik.values.esewa}
                      onCheckedChange={(checked) =>
                        gatewaysFormik.setFieldValue("esewa", checked)
                      }
                      disabled={gatewaysFormik.isSubmitting}
                    />
                  </div>

                  {/* Khalti */}

                  <div className="flex items-center justify-between rounded-xl border border-amber-900/10 bg-amber-50/70 p-3.5">
                    <div>
                      <p className="text-xs font-bold text-[#422006]">
                        Khalti Digital Wallet (Nepal)
                      </p>

                      <p className="text-[11px] text-muted-foreground">
                        Instant SDK Payments
                      </p>
                    </div>

                    <Switch
                      checked={gatewaysFormik.values.khalti}
                      onCheckedChange={(checked) =>
                        gatewaysFormik.setFieldValue("khalti", checked)
                      }
                      disabled={gatewaysFormik.isSubmitting}
                    />
                  </div>

                  {/* Stripe */}

                  <div className="flex items-center justify-between rounded-xl border border-amber-900/10 bg-amber-50/70 p-3.5">
                    <div>
                      <p className="text-xs font-bold text-[#422006]">
                        Stripe / Global Cards
                      </p>

                      <p className="text-[11px] text-muted-foreground">
                        Visa, MasterCard, Amex (USD)
                      </p>
                    </div>

                    <Switch
                      checked={gatewaysFormik.values.stripe}
                      onCheckedChange={(checked) =>
                        gatewaysFormik.setFieldValue("stripe", checked)
                      }
                      disabled={gatewaysFormik.isSubmitting}
                    />
                  </div>

                  {/* COD */}

                  <div className="flex items-center justify-between rounded-xl border border-amber-900/10 bg-amber-50/70 p-3.5">
                    <div>
                      <p className="text-xs font-bold text-[#422006]">
                        Cash on Delivery (Nepal)
                      </p>

                      <p className="text-[11px] text-muted-foreground">
                        Pay upon hand delivery
                      </p>
                    </div>

                    <Switch
                      checked={gatewaysFormik.values.cod}
                      onCheckedChange={(checked) =>
                        gatewaysFormik.setFieldValue("cod", checked)
                      }
                      disabled={gatewaysFormik.isSubmitting}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={
                      gatewaysFormik.isSubmitting || !gatewaysFormik.dirty
                    }
                    className="bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#713f12]"
                  >
                    {gatewaysFormik.isSubmitting
                      ? "Saving..."
                      : "Save Payment Settings"}
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
