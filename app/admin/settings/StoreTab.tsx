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
import { storeSettingsValidation } from "./validation";

export default function StoreTab() {
  const { storeSetting, updateStoreSetting } = useAdmin();

  const storeFormik = useFormik({
    initialValues: {
      storeName: storeSetting?.storeName || "",
      customerSupportEmail: storeSetting?.customerSupportEmail || "",
      standardConsecrationFee: storeSetting?.standardConsecrationFee ?? 0,
      freeShippingThreshold: storeSetting?.freeShippingThreshold ?? 0,
      primaryTempleConsecrationOrigin:
        storeSetting?.primaryTempleConsecrationOrigin || "",
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

  return (
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
  );
}
