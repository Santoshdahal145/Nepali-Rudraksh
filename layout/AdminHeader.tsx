"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ExternalLink,
  Menu,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAdmin } from "../providers/AdminContext";

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const pathname = usePathname();
  const { user } = useAdmin();
  const [showNotifications, setShowNotifications] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const getPageTitle = () => {
    if (pathname === "/admin/dashboard") return "Dashboard Overview";
    if (pathname.startsWith("/admin/all-products/")) return "Product Inspector";
    if (pathname === "/admin/all-products") return "Inventory & Products";
    if (pathname.startsWith("/admin/orders/")) return "Order Inspector";
    if (pathname === "/admin/orders") return "Orders Management";
    if (pathname.startsWith("/admin/all-users/")) return "Devotee Profile";
    if (pathname === "/admin/all-users") return "Devotees & Users";
    if (pathname.startsWith("/admin/blogs")) return "Blogs";
    if (pathname.startsWith("/admin/consultation-requests/"))
      return "Consultation Inspector";
    if (pathname === "/admin/consultation-requests")
      return "Consultation Requests";
    if (pathname === "/admin/settings") return "System & Store Settings";
    return "Admin Portal";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-amber-900/10 bg-[#fdfbf7]/90 px-4 sm:px-8 backdrop-blur-md">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          className="lg:hidden border-amber-900/15 text-[#713f12]"
          onClick={onOpenMobileMenu}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5c3a1e]/70">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#713f12] font-bold">{getPageTitle()}</span>
          </div>
          <h1 className="text-base font-extrabold text-[#422006]">
            {getPageTitle()}
          </h1>
        </div>

        <div className="sm:hidden font-extrabold text-sm text-[#422006]">
          {getPageTitle()}
        </div>
      </div>

      {/* Right: Actions, Search, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* View Store Button */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-amber-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#713f12] shadow-2xs hover:bg-amber-50 transition"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Live Store</span>
        </Link>

        {/* Notification Bell with Popover */}
        <div className="relative">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative border-amber-900/15 bg-white text-[#713f12] hover:bg-amber-50"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[9px] font-bold text-white">
              2
            </span>
          </Button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xl shadow-amber-950/15 animate-in fade-in zoom-in-95 z-50">
              <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#422006]">
                    Notifications
                  </span>
                  <Badge variant="gold" className="text-[10px]">
                    3 New
                  </Badge>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-amber-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {[].map((ord) => (
                  <></>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-amber-900/10 text-center">
                <Link
                  href="/admin/orders"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-[#713f12] hover:underline"
                >
                  View All Orders & Activities →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Avatar */}
        <Link
          href="/admin/settings"
          className="flex items-center gap-2 rounded-xl border border-amber-900/10 bg-white p-1.5 pr-3 shadow-2xs hover:bg-amber-50 transition"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#713f12] text-xs font-bold text-white">
            {user?.firstName[0]}
            {user?.lastName[0]}
          </div>
          <span className="hidden md:inline-block text-xs font-bold text-[#422006]">
            {user?.firstName} {user?.lastName}
          </span>
        </Link>
      </div>
    </header>
  );
}
