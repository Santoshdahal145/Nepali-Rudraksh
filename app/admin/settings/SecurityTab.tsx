"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { useAdmin } from "../../../providers/AdminContext";
import { changePasswordValidation } from "./validation";

export default function SecurityTab() {
  const { changePassword } = useAdmin();
  const [showPass, setShowPass] = useState(false);

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

  return (
    <TabsContent value="security">
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <KeyRound className="h-5 w-5 text-[#713f12]" />
            Change Administrator Password
          </CardTitle>

          <CardDescription>
            Ensure your account is using a long, random password to stay secure.
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
                disabled={passwordFormik.isSubmitting || !passwordFormik.dirty}
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
  );
}
