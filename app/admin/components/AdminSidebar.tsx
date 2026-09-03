"use client";

import {
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sliders,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "../../../providers/AdminContext";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "All Products",
    href: "/admin/all-products",
    icon: Package,
    badge: "Inventory",
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    badge: "Live",
  },
  {
    name: "All Users",
    href: "/admin/all-users",
    icon: Users,
    badge: null,
  },
  {
    name: "Home Control",
    href: "/admin/home-control",
    icon: Sliders,
    badge: "CMS",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    badge: null,
  },
];

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAdmin();
  const pendingOrdersCount = 5;
  return (
    <aside className="flex h-full w-72 flex-col justify-between border-r border-amber-900/10 bg-[#fdfbf7] p-5 shadow-xs">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-900/10">
          <Link
            href="/admin/dashboard"
            onClick={onCloseMobile}
            className="group flex items-center gap-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#713f12] via-[#8b4513] to-[#422006] text-xl shadow-md shadow-amber-950/20 transition group-hover:scale-105">
              🌿
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-[#422006] text-base leading-tight">
                Nepali Rudraksh
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800/80 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-amber-700" />
                Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#5c3a1e]/60 mb-2">
            Management Suite
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#713f12] text-white shadow-md shadow-amber-950/15"
                    : "text-[#5c3a1e] hover:bg-amber-100/60 hover:text-[#422006]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? "text-amber-300" : "text-[#713f12]"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.name === "Orders" && pendingOrdersCount > 0 && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? "bg-amber-300 text-amber-950"
                          : "bg-amber-200 text-amber-900"
                      }`}
                    >
                      {pendingOrdersCount}
                    </span>
                  )}
                  {item.badge && item.name !== "Orders" && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform ${
                      isActive
                        ? "text-white opacity-90"
                        : "text-amber-900/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Store link & Admin user info */}
      <div className="space-y-3 pt-4 border-t border-amber-900/10">
        {/* Public Store link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-xl border border-amber-900/15 bg-white px-3 py-2 text-xs font-semibold text-[#713f12] shadow-2xs transition hover:bg-amber-50 hover:border-amber-700"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5" />
            View Public Store
          </span>
          <span className="text-[10px] text-muted-foreground">Live ↗</span>
        </Link>

        {/* User Card */}
        <div className="flex items-center justify-between rounded-xl bg-amber-100/40 p-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#713f12] text-xs font-bold text-white shadow-xs">
              {user?.firstName[0]}
              {user?.lastName[0]}
            </div>
            <div className="min-w-0 truncate">
              <p className="truncate text-xs font-bold text-[#422006]">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          <Link
            href="/admin"
            onClick={logout}
            title="Log Out"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-700 transition"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
