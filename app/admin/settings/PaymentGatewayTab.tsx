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
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { useAdmin } from "../../../providers/AdminContext";

export default function PaymentGatewayTab() {
  const { paymentGateways, updatePaymentGateways } = useAdmin();

  const gatewaysFormik = useFormik({
    initialValues: {
      esewa: paymentGateways?.esewaEnabled ?? true,
      khalti: paymentGateways?.khaltiEnabled ?? true,
      stripe: paymentGateways?.stripeEnabled ?? true,
      cod: paymentGateways?.codEnabled ?? true,
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
  );
}
