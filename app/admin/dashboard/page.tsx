"use client";

import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import DashboardCard from "./DashboardCard";
import DashboardTopWelcome from "./DashboardTopWelcome";
import { useQuery } from "@tanstack/react-query";
import { DashboardResponseType } from "@/app/types";
import { adminDashboardApi } from "@/app/api/dashboard/api";
import { requestAPI } from "@/lib/requestAPI";

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["ADMIN-DASHBOARD"],
    queryFn: async () => {
      const res = await requestAPI<DashboardResponseType>(
        adminDashboardApi.getDashboardData(),
      );
      return res.data as DashboardResponseType;
    },
  });

  const DASHBOARD_ITEMS = [
    {
      id: 1,
      title: "Total Revenue",
      value: data?.totalRevenue ?? 0,
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-amber-100 text-[#713f12]",
    },
    {
      id: 2,
      title: "Sacred Orders",
      value: data?.totalOrders ?? 0,
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-900",
    },
    {
      id: 3,
      title: "Active Devotees",
      value: data?.totalCustomers ?? 0,
      icon: <Users className="h-5 w-5" />,
      color: "bg-emerald-100 text-emerald-900",
    },
    {
      id: 4,
      title: "Sacred Beads In Stock",
      value: data?.totalProducts ?? 0,
      icon: <Package className="h-5 w-5" />,
      color: "bg-amber-200 text-amber-950",
    },
  ];
  return (
    <div className="space-y-6 sm:space-y-8">
      <DashboardTopWelcome />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {DASHBOARD_ITEMS.map((item) => (
          <DashboardCard key={item.id} {...item} loading={isLoading} />
        ))}
      </div>
    </div>
  );
}
