"use client";

import { useFormik } from "formik";
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
import { adminProfileValidation } from "./validation";

export default function ProfileTab() {
  const { user, updateProfile } = useAdmin();

  const profileFormik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
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

  return (
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
              {/* First Name */}
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

              {/* Last Name */}
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
                disabled={profileFormik.isSubmitting || !profileFormik.dirty}
                className="bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#713f12]"
              >
                {profileFormik.isSubmitting ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
