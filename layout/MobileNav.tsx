"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
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
  ChevronUp,
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
import { usePrice } from "@/providers/PriceContext";
import Image from "next/image";
import appLogo from "@/assets/nepali-rudraksh-logo.png";

interface MobileNavProps {
  onOpenSearch: () => void;
}

export default function MobileNav({ onOpenSearch }: MobileNavProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  const [isQuickBarOpen, setIsQuickBarOpen] = useState(false);

  // Remember user quick bar state or default to collapsed to save vertical space
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nepali_rudraksh_mobile_quickbar");
      if (saved !== null) {
        setIsQuickBarOpen(saved === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleQuickBar = () => {
    setIsQuickBarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("nepali_rudraksh_mobile_quickbar", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { currency } = usePrice();
  const quickPanelRef = useRef<HTMLDivElement>(null);

  // Auto-close quick action panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        quickPanelRef.current &&
        !quickPanelRef.current.contains(event.target as Node)
      ) {
        setIsQuickBarOpen(false);
      }
    }
    if (isQuickBarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isQuickBarOpen]);

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
    <div ref={quickPanelRef} className="lg:hidden relative flex flex-col bg-white border-b border-amber-900/10">
      {/* ── Main Mobile Header: Clean Single Row with Integrated Quick Controller ── */}
      <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3">
        {/* Left: App Logo & Name */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
          <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-white p-0.5 border border-amber-900/15 shadow-xs transition-transform duration-200 group-active:scale-95 overflow-hidden">
            <Image
              src={appLogo}
              alt="Nepali Rudraksh Logo"
              width={56}
              height={56}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black tracking-tight text-[#422006] leading-tight">
              Nepali <span className="text-[#713f12]">Rudraksh</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-[#713f12]/80 leading-none mt-0.5">
              Authentic Himalayan Beads
            </span>
          </div>
        </Link>

        {/* Right: Search, Slide Controller Pill, and Drawer Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search items"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-900/15 bg-white text-[#713f12] shadow-2xs hover:border-amber-900/35 hover:bg-amber-50 active:scale-95 transition-all cursor-pointer"
          >
            <Search className="size-4.5" />
          </button>

          {/* Quick Actions Controller (Cart • Login • Currency) */}
          <button
            type="button"
            onClick={toggleQuickBar}
            aria-expanded={isQuickBarOpen}
            aria-label={isQuickBarOpen ? "Close quick actions drawer" : "Open quick actions drawer"}
            className={`group relative flex h-9 items-center gap-1.5 rounded-full border px-2.5 sm:px-3 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              isQuickBarOpen
                ? "border-[#713f12] bg-[#713f12] text-white shadow-xs"
                : "border-amber-900/15 bg-[#faf7f2] text-[#422006] hover:bg-amber-100/60 shadow-2xs"
            }`}
          >
            {/* Cart Icon & Live Badge */}
            <div className="relative flex items-center">
              <ShoppingBag
                className={`size-4 ${
                  isQuickBarOpen ? "text-amber-100" : "text-[#713f12]"
                }`}
              />
              {isMounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#2c5339] px-1 text-[8.5px] font-black text-white ring-1 ring-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </div>

            {/* Currency Pill text */}
            <span
              className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide ${
                isQuickBarOpen ? "text-amber-100" : "text-[#713f12]"
              }`}
            >
              {currency}
            </span>

            {/* Animated Chevron */}
            <ChevronDown
              className={`size-3.5 transition-transform duration-200 ${
                isQuickBarOpen
                  ? "rotate-180 text-amber-200"
                  : "text-[#713f12]/60 group-hover:text-[#713f12]"
              }`}
            />
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

      {/* ── Slideable Quick Actions Panel (Login, Cart, Currency) ── */}
      <div
        id="mobile-quick-actions-bar"
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isQuickBarOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`${
            isQuickBarOpen ? "overflow-visible" : "overflow-hidden"
          } border-t border-amber-900/10 bg-[#faf7f2]/95 backdrop-blur-md shadow-lg`}
        >
          <div className="p-3.5 space-y-2.5">
            {/* 1. Account & Cart Cards */}
            <div className="grid grid-cols-2 gap-2">
              {/* Account Card */}
              {isAuthenticated ? (
                <Link
                  href="/profile"
                  onClick={() => setIsQuickBarOpen(false)}
                  className="flex flex-col justify-between rounded-2xl border border-[#e2d5c4] bg-white p-3 shadow-2xs hover:border-[#d0bfa8] active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7a5538] text-xs font-bold text-[#f6eee4] shrink-0">
                      {userInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[#553c2a]">
                        {userDisplayName.split(" ")[0]}
                      </p>
                      <p className="text-[10px] text-[#7a5538]/70">Profile</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-[#713f12]">
                    <span>Orders & Account</span>
                    <ArrowRight className="size-3" />
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsQuickBarOpen(false)}
                  className="flex flex-col justify-between rounded-2xl border border-[#e2d5c4] bg-white p-3 shadow-2xs hover:border-[#d0bfa8] active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f6eee4] border border-[#e2d5c4] text-[#7a5538] shrink-0">
                      <User className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#553c2a]">Account</p>
                      <p className="text-[10px] text-[#7a5538]/70">Sign In</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-[#713f12]">
                    <span>Login / Register</span>
                    <ArrowRight className="size-3" />
                  </div>
                </Link>
              )}

              {/* Cart Card */}
              <Link
                href="/cart"
                onClick={() => setIsQuickBarOpen(false)}
                className="flex flex-col justify-between rounded-2xl border border-[#c7d7c9] bg-white p-3 shadow-2xs hover:border-[#b0c8b3] active:scale-[0.98] transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf0eb] border border-[#c7d7c9] text-[#2c5339] shrink-0">
                      <ShoppingBag className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#243d2c]">Cart</p>
                      <p className="text-[10px] text-[#2c5339]/70">
                        {isMounted && totalItems > 0
                          ? `${totalItems} ${totalItems === 1 ? "item" : "items"}`
                          : "Empty"}
                      </p>
                    </div>
                  </div>
                  {isMounted && totalItems > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2c5339] px-1.5 text-[10px] font-black text-white">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-[#2c5339]">
                  <span>View Cart</span>
                  <ArrowRight className="size-3" />
                </div>
              </Link>
            </div>

            {/* 2. Currency Selector */}
            <div className="relative z-20">
              <CurrencySelector variant="full" className="w-full" />
            </div>

            {/* 3. Handle to Slide Back Up */}
            <div className="pt-0.5 flex justify-center">
              <button
                type="button"
                onClick={() => setIsQuickBarOpen(false)}
                className="flex items-center gap-1 text-[10px] font-bold text-[#713f12]/75 hover:text-[#713f12] active:scale-95 transition-all cursor-pointer py-1"
              >
                <ChevronUp className="size-3" />
                <span>Slide Up</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
