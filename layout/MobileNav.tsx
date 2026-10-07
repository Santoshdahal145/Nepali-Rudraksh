"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  ArrowRight,
  ChevronDown,
  Layers,
  ShieldCheck,
  Calendar,
  BookOpen,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthContext";
import useCart from "@/hooks/tanstack-hooks/useCart";
import CurrencySelector from "./CurrencySelector";
import { shopMegaMenu } from "./nav-data";
import Image from "next/image";
import appLogo from "@/assets/nepali-rudraksh-logo.png";

interface MobileNavProps {
  onOpenSearch: () => void;
}

export default function MobileNav({ onOpenSearch }: MobileNavProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);

  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const userDisplayName =
    user?.firstName || user?.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : user?.email
        ? user.email.split("@")[0]
        : "Account";

  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
      : userDisplayName
        ? userDisplayName.charAt(0).toUpperCase()
        : "U";

  const handleLogout = async () => {
    try {
      await logout();
      setSheetOpen(false);
      router.push("/");
    } catch {
      // Handled in auth provider
    }
  };

  return (
    <div className="lg:hidden flex flex-col bg-white border-b border-amber-900/10">
      {/* ── Line 1 (Above): App Logo & Name at Left, Search & Menu at Right ── */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: App Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
          <div className="relative flex h-12 w-12 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-full bg-white p-0.5 border border-amber-900/15 shadow-xs transition-transform duration-200 group-active:scale-95 overflow-hidden">
            <Image
              src={appLogo}
              alt="Nepali Rudraksh Logo"
              width={64}
              height={64}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-tight text-[#422006] leading-tight">
              Nepali <span className="text-[#713f12]">Rudraksh</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#713f12]/80 leading-none mt-0.5">
              Authentic Himalayan Beads
            </span>
          </div>
        </Link>

        {/* Right: Search & Drawer Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search items"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-900/15 bg-white text-[#713f12] shadow-2xs hover:border-amber-900/35 hover:bg-amber-50 active:scale-95 transition-all cursor-pointer"
          >
            <Search className="size-5" />
          </button>

          {/* Menu Drawer Sheet */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger>
              <div
                role="button"
                aria-label="Open navigation menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-900/15 bg-[#713f12] text-amber-100 shadow-2xs hover:bg-[#5c330e] active:scale-95 transition-all cursor-pointer"
              >
                <Menu className="size-5" />
              </div>
            </SheetTrigger>

            {/* iOS-Inspired Drawer Menu */}
            <SheetContent
              side="right"
              className="flex w-84 flex-col border-l border-amber-900/15 bg-[#faf7f2] p-0 text-[#422006]"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-amber-900/10 px-5 py-4 bg-white">
                <SheetTitle className="flex items-center gap-2.5 text-base font-bold text-[#422006]">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white p-0.5 border border-amber-900/15 shadow-2xs overflow-hidden">
                    <Image
                      src={appLogo}
                      alt="Nepali Rudraksh Logo"
                      width={52}
                      height={52}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  Nepali Rudraksh
                </SheetTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-[#713f12]/70 hover:bg-amber-50 hover:text-[#713f12]"
                  onClick={() => setSheetOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Drawer Navigation Links & Catalog */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {/* Shop Catalog Accordion Card */}
                <div className="rounded-2xl border border-amber-900/15 bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setMobileShopExpanded(!mobileShopExpanded)}
                    className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold text-[#422006] hover:bg-amber-50/50 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[#713f12]" />
                      Shop Catalog
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#713f12]/60 transition-transform duration-200 ${
                        mobileShopExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileShopExpanded && (
                    <div className="border-t border-amber-900/10 bg-amber-50/30 p-2 space-y-1">
                      <Link
                        href="/all-products"
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-[#713f12] hover:bg-amber-100/60"
                      >
                        <span>View All Products</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>

                      <div className="pt-1.5 pb-0.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#713f12]/70">
                        Categories
                      </div>
                      {shopMegaMenu.categories.map((c) => (
                        <Link
                          key={c.name}
                          href={c.href}
                          onClick={() => setSheetOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium text-[#422006] hover:bg-amber-100/50"
                        >
                          <span>{c.emoji}</span>
                          <span>{c.name}</span>
                        </Link>
                      ))}

                      <div className="pt-2 pb-0.5 px-3 text-[10px] font-bold uppercase tracking-wider text-[#713f12]/70">
                        Popular Mukhis
                      </div>
                      <div className="grid grid-cols-2 gap-1 px-1">
                        {shopMegaMenu.popularMukhis.slice(0, 4).map((m) => (
                          <Link
                            key={m.name}
                            href={m.href}
                            onClick={() => setSheetOpen(false)}
                            className="flex items-center gap-1.5 rounded-lg p-1.5 text-[11px] font-medium text-[#422006] hover:bg-amber-100/50 truncate"
                          >
                            <span>{m.emoji}</span>
                            <span className="truncate">
                              {m.name.split(" ")[0]} Mukhi
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* About Us */}
                <Link
                  href="/#story"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl border border-amber-900/15 bg-white px-4 py-3 text-xs font-bold text-[#422006] hover:bg-amber-50/70 transition-colors shadow-2xs"
                >
                  <ShieldCheck className="h-4 w-4 text-[#713f12]" />
                  <span>About Us</span>
                </Link>

                {/* Consultation */}
                <Link
                  href="/consultation"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl border border-amber-900/15 bg-white px-4 py-3 text-xs font-bold text-[#422006] hover:bg-amber-50/70 transition-colors shadow-2xs"
                >
                  <Calendar className="h-4 w-4 text-[#713f12]" />
                  <span>Astrology Consultation</span>
                </Link>

                {/* Blogs */}
                <Link
                  href="/blogs"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-2.5 rounded-2xl border border-amber-900/15 bg-white px-4 py-3 text-xs font-bold text-[#422006] hover:bg-amber-50/70 transition-colors shadow-2xs"
                >
                  <BookOpen className="h-4 w-4 text-[#713f12]" />
                  <span>Vedic Wisdom Blogs</span>
                </Link>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-4 space-y-2.5 border-t border-amber-900/10 bg-white">
                <CurrencySelector variant="full" />

                {isAuthenticated ? (
                  <div className="rounded-2xl border border-amber-900/15 bg-amber-50/40 p-3 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#713f12] text-xs font-bold text-white">
                        {userInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-[#422006]">
                          {userDisplayName}
                        </p>
                        <p className="truncate text-[10px] text-[#713f12]/70">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-amber-900/10">
                      <Link
                        href="/profile"
                        onClick={() => setSheetOpen(false)}
                        className="rounded-xl bg-white px-2 py-1.5 text-center text-xs font-semibold text-[#422006] shadow-2xs hover:bg-amber-50"
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-xl bg-red-100/70 px-2 py-1.5 text-center text-xs font-semibold text-red-700 hover:bg-red-200/60 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setSheetOpen(false)}>
                    <Button
                      variant="outline"
                      className="h-10 w-full gap-2 rounded-full border-amber-900/20 text-xs font-bold text-[#713f12] hover:bg-amber-50"
                    >
                      <User className="size-3.5" />
                      Login / Register
                    </Button>
                  </Link>
                )}

                <Link href="/all-products" onClick={() => setSheetOpen(false)}>
                  <Button className="h-10 w-full gap-2 rounded-full bg-[#713f12] hover:bg-[#5c330e] text-white text-xs font-bold shadow-xs">
                    <span>Shop Full Collection</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* ── Line 2 (Just Below Them): Quick Action Bar (Auth / Cart / Currency) ── */}
      <div className="grid grid-cols-3 gap-2 px-3.5 py-2.5 border-t border-amber-900/10 bg-[#faf7f2]/80">
        {/* 1. Auth: Login or Profile (Warm Sand Palette) */}
        {isAuthenticated ? (
          <Link
            href="/profile"
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e2d5c4] bg-[#f6eee4] px-2.5 text-xs sm:text-sm font-bold text-[#553c2a] shadow-2xs hover:bg-[#ede1d0] hover:border-[#d0bfa8] active:scale-95 transition-all"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7a5538] text-xs font-bold text-[#f6eee4] shrink-0">
              {userInitials}
            </div>
            <span className="truncate text-xs sm:text-sm font-bold">
              {userDisplayName.split(" ")[0]}
            </span>
          </Link>
        ) : (
          <Link href="/login" className="block w-full">
            <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#e2d5c4] bg-[#f6eee4] px-2.5 text-xs sm:text-sm font-bold text-[#553c2a] shadow-2xs hover:bg-[#ede1d0] hover:border-[#d0bfa8] active:scale-95 transition-all cursor-pointer">
              <User className="size-4.5 shrink-0 text-[#7a5538]" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">
                Login
              </span>
            </div>
          </Link>
        )}

        {/* 2. Cart (Himalayan Botanical Sage Palette 🌿) */}
        <Link href="/cart" className="block w-full">
          <div className="relative flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#c7d7c9] bg-[#eaf0eb] px-2.5 text-xs sm:text-sm font-bold text-[#243d2c] shadow-2xs hover:bg-[#dbe6dd] hover:border-[#b0c8b3] active:scale-95 transition-all cursor-pointer">
            <ShoppingBag className="size-4.5 shrink-0 text-[#2c5339]" />
            <span className="text-xs sm:text-sm font-bold tracking-wide text-[#243d2c]">
              Cart
            </span>
            {isMounted && totalItems > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2c5339] px-1 text-[11px] font-black text-white shadow-xs">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </div>
        </Link>

        {/* 3. Currency / NPR (Kept as it is) */}
        <CurrencySelector variant="mobile" className="w-full" />
      </div>
    </div>
  );
}
