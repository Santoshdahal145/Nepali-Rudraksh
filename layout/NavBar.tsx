"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  ArrowRight,
  Sparkles,
  ChevronDown,
  LogOut,
  ShieldCheck,
  BookOpen,
  Calendar,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthContext";
import useCart from "@/hooks/tanstack-hooks/useCart";
import CurrencySelector from "./CurrencySelector";
import MobileNav from "./MobileNav";
import SearchModal from "./SearchModal";
import { shopMegaMenu } from "./nav-data";
import Image from "next/image";
import appLogo from "@/assets/nepali-rudraksh-logo.png";

export default function NavBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Clean up any stale dark theme state to preserve original app appearance
  useEffect(() => {
    try {
      localStorage.removeItem("nepali_rudraksh_theme");
      document.documentElement.classList.remove("dark");
    } catch {
      // ignore
    }
  }, []);

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

  // Hover handlers for Shop Mega Menu with gentle delay
  const handleShopMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setShopDropdownOpen(true);
  };

  const handleShopMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShopDropdownOpen(false);
    }, 180);
  };

  // Hover handlers for Account Dropdown
  const handleAccountMouseEnter = () => {
    if (accountTimeoutRef.current) {
      clearTimeout(accountTimeoutRef.current);
      accountTimeoutRef.current = null;
    }
    setAccountDropdownOpen(true);
  };

  const handleAccountMouseLeave = () => {
    accountTimeoutRef.current = setTimeout(() => {
      setAccountDropdownOpen(false);
    }, 180);
  };

  // Handle ESC key to close dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShopDropdownOpen(false);
        setAccountDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setAccountDropdownOpen(false);
      router.push("/");
    } catch {
      // Handled in auth provider
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-2xs">
      {/* ═════════════════════════════════════════════════════════════════════════════ */}
      {/* ── DESKTOP NAVIGATION BAR (lg:flex, hidden on mobile) ──                     */}
      {/* ═════════════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex relative mx-auto h-18 max-w-7xl items-center justify-between px-6 xl:px-8 border-b border-amber-900/10">
        {/* Brand: Logo & Name */}
        <Link href="/" className="flex items-center gap-3.5 shrink-0 group">
          <div className="relative flex h-13 w-13 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-full bg-white p-1 border border-amber-900/15 shadow-xs transition-transform duration-300 group-hover:scale-105 overflow-hidden">
            <Image
              src={appLogo}
              alt="Nepali Rudraksh Logo"
              width={72}
              height={72}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg lg:text-xl tracking-tight text-[#422006] leading-tight">
              Nepali <span className="text-[#713f12]">Rudraksh</span>
            </span>
            <span className="text-[10px] lg:text-[11px] font-bold tracking-wider uppercase text-[#713f12]/80 mt-0.5">
              Authentic Himalayan Beads
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links (Shop with mega menu, About Us, Consultation, Blogs) */}
        <nav className="flex items-center gap-1 xl:gap-2">
          {/* Shop with Mega Menu */}
          <div
            className="relative"
            onMouseEnter={handleShopMouseEnter}
            onMouseLeave={handleShopMouseLeave}
          >
            <Link
              href="/all-products"
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold tracking-wide transition-all ${
                shopDropdownOpen
                  ? "bg-amber-100/80 text-[#713f12]"
                  : "text-[#5c3a1e] hover:bg-amber-50 hover:text-[#713f12]"
              }`}
            >
              <span>Shop</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  shopDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </Link>

            {/* Mega Menu Dropdown */}
            {shopDropdownOpen && (
              <div
                className="fixed left-1/2 -translate-x-1/2 top-[68px] z-50 w-full max-w-5xl px-4 animate-in fade-in zoom-in-95 duration-200"
                onMouseEnter={handleShopMouseEnter}
                onMouseLeave={handleShopMouseLeave}
              >
                <div className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-2xl backdrop-blur-2xl">
                  <div className="grid grid-cols-12 gap-6">
                    {/* Categories Column */}
                    <div className="col-span-3 space-y-3 border-r border-amber-900/10 pr-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713f12]">
                        <Layers className="h-4 w-4" />
                        <span>Categories</span>
                      </div>
                      <div className="space-y-1">
                        {shopMegaMenu.categories.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setShopDropdownOpen(false)}
                            className="group flex items-start gap-2.5 rounded-xl p-2 transition-colors hover:bg-amber-50/70"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100/60 text-base">
                              {item.emoji}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold text-[#422006] group-hover:text-[#713f12]">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-[#713f12]">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="line-clamp-1 text-xs text-[#713f12]/60">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Popular Mukhis Column */}
                    <div className="col-span-4 space-y-3 border-r border-amber-900/10 pr-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713f12]">
                        <Sparkles className="h-4 w-4" />
                        <span>Sacred Mukhis</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {shopMegaMenu.popularMukhis.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setShopDropdownOpen(false)}
                            className="group flex flex-col rounded-xl p-2 transition-colors hover:bg-amber-50/70"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{item.emoji}</span>
                              <span className="text-sm font-semibold text-[#422006] group-hover:text-[#713f12] truncate">
                                {item.name}
                              </span>
                            </div>
                            <span className="mt-0.5 text-[11px] text-[#713f12]/60 line-clamp-1">
                              {item.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Terroirs Column */}
                    <div className="col-span-2 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713f12]">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Terroir Purity</span>
                      </div>
                      <div className="space-y-1">
                        {shopMegaMenu.terroirs.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setShopDropdownOpen(false)}
                            className="group block rounded-xl p-2 transition-colors hover:bg-amber-50/70"
                          >
                            <span className="flex items-center gap-1 text-sm font-semibold text-[#422006] group-hover:text-[#713f12]">
                              <span>{item.emoji}</span>
                              <span className="truncate">{item.name}</span>
                            </span>
                            <span className="text-[11px] text-[#713f12]/60 line-clamp-1">
                              {item.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Featured Showcase Box */}
                    <div className="col-span-3">
                      <div className="flex h-full flex-col justify-between rounded-2xl border border-amber-900/15 bg-amber-50/60 p-5">
                        <div>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[10px] font-bold text-[#713f12]">
                            <Sparkles className="h-3 w-3" />
                            Temple Consecrated
                          </span>
                          <h4 className="mt-3 text-sm font-bold text-[#422006]">
                            Pashupatinath Blessed
                          </h4>
                          <p className="mt-1 text-xs text-[#5c3a1e]/80 leading-relaxed">
                            Each sacred bead is 100% genuine Nepali Rudraksha, ethically sourced, and consecrated with Vedic mantras.
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-amber-900/10">
                          <Link
                            href="/all-products"
                            onClick={() => setShopDropdownOpen(false)}
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#713f12] hover:bg-[#5c330e] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
                          >
                            <span>Browse Catalog</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* About Us */}
          <Link
            href="/#story"
            className="rounded-full px-3.5 py-2 text-sm font-semibold text-[#5c3a1e] hover:bg-amber-50 hover:text-[#713f12] transition-all"
          >
            About Us
          </Link>

          {/* Consultation */}
          <Link
            href="/consultation"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-[#5c3a1e] hover:bg-amber-50 hover:text-[#713f12] transition-all"
          >
            <Calendar className="h-4 w-4 text-[#713f12]" />
            <span>Consultation</span>
          </Link>

          {/* Blogs */}
          <Link
            href="/blogs"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-[#5c3a1e] hover:bg-amber-50 hover:text-[#713f12] transition-all"
          >
            <BookOpen className="h-4 w-4 text-[#713f12]" />
            <span>Blogs</span>
          </Link>
        </nav>

        {/* Desktop Actions: Search, Currency, Cart, Account, Shop Now */}
        <div className="flex items-center gap-2 xl:gap-2.5">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search items"
            className="flex h-9.5 w-9.5 items-center justify-center rounded-full text-[#713f12]/80 hover:bg-amber-50 hover:text-[#713f12] transition-all cursor-pointer"
          >
            <Search className="size-4.5" />
          </button>

          {/* Currency Selector */}
          <CurrencySelector variant="desktop" />

          {/* Cart Pill (Himalayan Botanical Sage 🌿) */}
          <Link
            href="/cart"
            className="relative flex h-9.5 items-center gap-2 rounded-full border border-[#c7d7c9] bg-[#eaf0eb] px-3.5 text-sm font-semibold text-[#243d2c] shadow-2xs transition-all duration-200 hover:bg-[#dbe6dd] hover:border-[#b0c8b3] cursor-pointer"
          >
            <ShoppingBag className="size-4 text-[#2c5339]" />
            <span>Cart</span>
            {isMounted && totalItems > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2c5339] px-1 text-[9px] font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* Login / Account Dropdown */}
          {isAuthenticated ? (
            <div
              className="relative"
              onMouseEnter={handleAccountMouseEnter}
              onMouseLeave={handleAccountMouseLeave}
            >
              <Link
                href="/profile"
                className="group flex h-9.5 items-center gap-2 rounded-full border border-[#e2d5c4] bg-[#f6eee4] pl-1 pr-3.5 text-sm font-semibold text-[#553c2a] shadow-2xs transition-all duration-200 hover:bg-[#ede1d0] hover:border-[#d0bfa8]"
              >
                <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-[#7a5538] text-xs font-bold text-[#f6eee4]">
                  {userInitials}
                </div>
                <span className="max-w-28 truncate text-sm font-semibold text-[#553c2a]">
                  {userDisplayName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-[#7a5538]/70" />
              </Link>

              {/* Account Dropdown */}
              {accountDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl border border-amber-900/15 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50"
                  onMouseEnter={handleAccountMouseEnter}
                  onMouseLeave={handleAccountMouseLeave}
                >
                  <Link
                    href="/profile"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#422006] hover:bg-amber-50 hover:text-[#713f12] transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-[#713f12]" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#422006] hover:bg-amber-50 hover:text-[#713f12] transition-colors"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 text-[#713f12]" />
                    <span>My Orders</span>
                  </Link>

                  <Link
                    href="/admin/all-products"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-[#422006] hover:bg-amber-50 hover:text-[#713f12] transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-[#713f12]" />
                    <span>Admin Panel</span>
                  </Link>

                  <div className="my-1 border-t border-amber-900/10" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex h-9.5 items-center gap-2 rounded-full border border-[#e2d5c4] bg-[#f6eee4] px-4 text-sm font-semibold text-[#553c2a] shadow-2xs transition-all duration-200 hover:bg-[#ede1d0] hover:border-[#d0bfa8] cursor-pointer"
            >
              <User className="size-4 text-[#7a5538]" />
              <span>Login</span>
            </Link>
          )}

          {/* Shop Now CTA Button */}
          <Link href="/all-products">
            <Button className="h-9.5 gap-2 rounded-full bg-[#713f12] px-4.5 text-sm font-bold text-white hover:bg-[#5c330e] shadow-sm shadow-amber-900/20 transition-all cursor-pointer">
              <span>Shop Now</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════════════ */}
      {/* ── MOBILE NAVIGATION (lg:hidden) ──                                          */}
      {/* ═════════════════════════════════════════════════════════════════════════════ */}
      <MobileNav onOpenSearch={() => setSearchOpen(true)} />

      {/* ═════════════════════════════════════════════════════════════════════════════ */}
      {/* ── SEARCH DIALOG MODAL ──                                                    */}
      {/* ═════════════════════════════════════════════════════════════════════════════ */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
