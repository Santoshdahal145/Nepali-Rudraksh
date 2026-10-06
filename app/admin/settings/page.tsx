"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Lock, Store, User } from "lucide-react";
import SettingsTopHeader from "./SettingsTopHeader";
import SecurityTab from "./SecurityTab";
import ProfileTab from "./ProfileTab";
import StoreTab from "./StoreTab";
import PaymentGatewayTab from "./PaymentGatewayTab";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AdminSettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "security";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    // { scroll: false } prevents the browser from jumping back to the top of the page on tab click
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <SettingsTopHeader />

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
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

        <SecurityTab />
        <ProfileTab />
        <StoreTab />
        <PaymentGatewayTab />
      </Tabs>
    </div>
  );
}
