"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  ArrowRight,
  Sparkles,
  ChevronDown,
  LogOut,
  ShieldCheck,
  BookOpen,
  Calendar,
  Layers,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/providers/AuthContext";
import useCart from "@/hooks/tanstack-hooks/useCart";
import CurrencySelector from "./CurrencySelector";

// Mega menu catalog for "Shop" dropdown
const shopMegaMenu = {
  categories: [
    {
      name: "Individual Rudraksha",
      desc: "Natural 1 to 21 Mukhi single beads",
      href: "/all-products?type=INDIVIDUAL_RUDRAKSHA",
      badge: "Popular",
      emoji: "🌿",
    },
    {
      name: "Sacred Japa Malas",
      desc: "Hand-knotted 108+1 meditation malas",
      href: "/all-products?type=RUDRAKSHA_MALA",
      badge: "Bestseller",
      emoji: "📿",
    },
    {
      name: "Rudraksha Bracelets",
      desc: "Daily protection & sterling silver",
      href: "/all-products?search=bracelet",
      emoji: "⚡",
    },
    {
      name: "Rare Collector Beads",
      desc: "Gauri Shankar, Trijuti & 1 Mukhi",
      href: "/all-products?search=collector",
      badge: "Rare",
      emoji: "👑",
    },
  ],
  popularMukhis: [
    {
      name: "1 Mukhi (Half Moon)",
      desc: "Supreme consciousness & Shiva",
      href: "/all-products?mukhi=1",
      emoji: "🌙",
    },
    {
      name: "5 Mukhi (Panchamukhi)",
      desc: "Health, peace & daily japa",
      href: "/all-products?mukhi=5",
      emoji: "🌿",
    },
    {
      name: "7 Mukhi (Mahalakshmi)",
      desc: "Wealth, abundance & prosperity",
      href: "/all-products?mukhi=7",
      emoji: "✨",
    },
    {
      name: "8 Mukhi (Lord Ganesha)",
      desc: "Removes obstacles & brings success",
      href: "/all-products?mukhi=8",
      emoji: "🐘",
    },
    {
      name: "11 Mukhi (Hanuman)",
      desc: "Courage, protection & willpower",
      href: "/all-products?mukhi=11",
      emoji: "🛡️",
    },
    {
      name: "14 Mukhi (Devamani)",
      desc: "Awakens Ajna intuition chakra",
      href: "/all-products?mukhi=14",
      emoji: "🔱",
    },
  ],
  terroirs: [
    {
      name: "Sankhuwasabha, Nepal",
      desc: "Prime high-altitude forest harvest",
      href: "/all-products?search=sankhuwasabha",
      emoji: "🏔️",
    },
    {
      name: "Bhojpur Wild Terroir",
      desc: "Ancient natural mountain growth",
      href: "/all-products?search=bhojpur",
      emoji: "🌾",
    },
    {
      name: "Pashupatinath Consecrated",
      desc: "Blessed with holy Gangajal & Vedic mantras",
      href: "/all-products",
      emoji: "🕉️",
    },
    {
      name: "100% Lab Authenticated",
      desc: "Certified with X-ray clarity inspection",
      href: "/all-products",
      emoji: "📜",
    },
  ],
};

const searchableProducts = [
  {
    id: "1",
    name: "1 Mukhi Half Moon Rudraksha",
    mukhi: "1 Mukhi",
    price: "$499",
    category: "Collector Rare",
    emoji: "🌙",
    deity: "Lord Shiva",
  },
  {
    id: "2",
    name: "5 Mukhi Nepal Siddh Mala (108+1)",
    mukhi: "5 Mukhi",
    price: "$149",
    category: "Japa Mala",
    emoji: "📿",
    deity: "Kalagni Rudra",
  },
  {
    id: "3",
    name: "7 Mukhi Mahalakshmi Rudraksha",
    mukhi: "7 Mukhi",
    price: "$189",
    category: "Sacred Mukhi",
    emoji: "✨",
    deity: "Goddess Mahalakshmi",
  },
  {
    id: "4",
    name: "14 Mukhi Devamani Rudraksha",
    mukhi: "14 Mukhi",
    price: "$1299",
    category: "Collector Rare",
    emoji: "🔱",
    deity: "Lord Hanuman & Shiva",
  },
  {
    id: "5",
    name: "Sacred Rudraksha Silver Bracelet",
    mukhi: "5 Mukhi",
    price: "$89",
    category: "Silver Ornament",
    emoji: "⚡",
    deity: "Lord Shiva",
  },
  {
    id: "6",
    name: "Gauri Shankar Sacred Divine Bead",
    mukhi: "Twin Bead",
    price: "$649",
    category: "Sacred Union",
    emoji: "💫",
    deity: "Shiva & Parvati",
  },
  {
    id: "7",
    name: "8 Mukhi Lord Ganesha Rudraksha",
    mukhi: "8 Mukhi",
    price: "$219",
    category: "Sacred Mukhi",
    emoji: "🐘",
    deity: "Lord Ganesha",
  },
  {
    id: "8",
    name: "11 Mukhi Hanuman Rudraksha",
    mukhi: "11 Mukhi",
    price: "$389",
    category: "Sacred Mukhi",
    emoji: "🛡️",
    deity: "11 Rudras / Hanuman",
  },
];

const popularSearches = [
  "1 Mukhi",
  "Siddh Mala 108",
  "7 Mukhi Wealth",
  "Gauri Shankar",
  "Silver Bracelet",
  "Hanuman 11 Mukhi",
];

export default function NavBar() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Auto focus input when search modal opens
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Handle ESC key to close search modal & dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (searchOpen) {
          setSearchOpen(false);
          setSearchQuery("");
        }
        setShopDropdownOpen(false);
        setAccountDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // Filter products by search query
  const filteredResults = searchQuery.trim()
    ? searchableProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.mukhi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/all-products`);
    }
  };

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
      <div className="hidden lg:flex relative mx-auto h-16 max-w-7xl items-center justify-between px-6 xl:px-8 border-b border-amber-900/10">
        {/* Brand: Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#713f12] text-base text-amber-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
            🌿
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-[#422006]">
              Nepali <span className="text-[#713f12]">Rudraksh</span>
            </span>
            <span className="text-[9px] font-medium tracking-wider uppercase text-[#713f12]/60">
              Authentic Himalayan Beads
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links (Shop with mega menu, About Us, Consultation, Blogs) */}
        <nav className="flex items-center gap-1.5">
          {/* Shop with Mega Menu */}
          <div
            className="relative"
            onMouseEnter={handleShopMouseEnter}
            onMouseLeave={handleShopMouseLeave}
          >
            <Link
              href="/all-products"
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                shopDropdownOpen
                  ? "bg-amber-100/80 text-[#713f12]"
                  : "text-[#5c3a1e] hover:bg-amber-50 hover:text-[#713f12]"
              }`}
            >
              <span>Shop</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  shopDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </Link>

            {/* Mega Menu Dropdown */}
            {shopDropdownOpen && (
              <div
                className="fixed left-1/2 -translate-x-1/2 top-[58px] z-50 w-full max-w-5xl px-4 animate-in fade-in zoom-in-95 duration-200"
                onMouseEnter={handleShopMouseEnter}
                onMouseLeave={handleShopMouseLeave}
              >
                <div className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-2xl backdrop-blur-2xl">
                  <div className="grid grid-cols-12 gap-6">
                    {/* Categories Column */}
                    <div className="col-span-3 space-y-3 border-r border-amber-900/10 pr-4">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#713f12]">
                        <Layers className="h-3.5 w-3.5" />
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
                                <span className="text-xs font-semibold text-[#422006] group-hover:text-[#713f12]">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-[#713f12]">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="line-clamp-1 text-[11px] text-[#713f12]/60">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Popular Mukhis Column */}
                    <div className="col-span-4 space-y-3 border-r border-amber-900/10 pr-4">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#713f12]">
                        <Sparkles className="h-3.5 w-3.5" />
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
                              <span className="text-xs font-semibold text-[#422006] group-hover:text-[#713f12] truncate">
                                {item.name}
                              </span>
                            </div>
                            <span className="mt-0.5 text-[10px] text-[#713f12]/60 line-clamp-1">
                              {item.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Terroirs Column */}
                    <div className="col-span-2 space-y-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#713f12]">
                        <ShieldCheck className="h-3.5 w-3.5" />
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
                            <span className="flex items-center gap-1 text-xs font-semibold text-[#422006] group-hover:text-[#713f12]">
                              <span>{item.emoji}</span>
                              <span className="truncate">{item.name}</span>
                            </span>
                            <span className="text-[10px] text-[#713f12]/60 line-clamp-1">
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
            className="rounded-full px-4 py-2 text-xs font-semibold text-[#5c3a1e] hover:bg-amber-50 hover:text-[#713f12] transition-all"
          >
            About Us
          </Link>

          {/* Consultation */}
          <Link
            href="/consultation"
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-[#5c3a1e] hover:bg-amber-50 hover:text-[#713f12] transition-all"
          >
            <Calendar className="h-3.5 w-3.5 text-[#713f12]" />
            <span>Consultation</span>
          </Link>

          {/* Blogs */}
          <Link
            href="/blogs"
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-[#5c3a1e] hover:bg-amber-50 hover:text-[#713f12] transition-all"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#713f12]" />
            <span>Blogs</span>
          </Link>
        </nav>

        {/* Desktop Actions: Search, Currency, Cart, Account, Shop Now */}
        <div className="flex items-center gap-2">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search items"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#713f12]/80 hover:bg-amber-50 hover:text-[#713f12] transition-all cursor-pointer"
          >
            <Search className="size-4" />
          </button>

          {/* Currency Selector */}
          <CurrencySelector variant="desktop" />

          {/* Cart Pill */}
          <Link href="/cart">
            <Button
              variant="outline"
              className="relative h-9 gap-2 rounded-full border-amber-900/15 bg-white/90 px-3.5 text-xs font-semibold text-[#5c3a1e] hover:bg-amber-50 hover:text-[#713f12] shadow-2xs cursor-pointer"
            >
              <ShoppingBag className="size-3.5 text-[#713f12]" />
              <span>Cart</span>
              {isMounted && totalItems > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#713f12] px-1 text-[9px] font-bold text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>
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
                className="group flex h-9 items-center gap-2 rounded-full border border-amber-900/20 bg-amber-50/70 pl-1 pr-3 transition-all hover:border-amber-900/40 hover:bg-amber-100/60"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#713f12] text-xs font-bold text-white">
                  {userInitials}
                </div>
                <span className="max-w-24 truncate text-xs font-semibold text-[#422006]">
                  {userDisplayName}
                </span>
                <ChevronDown className="h-3 w-3 text-[#713f12]/60" />
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
            <Link href="/login">
              <Button
                variant="outline"
                className="h-9 gap-1.5 rounded-full border-amber-900/20 bg-white/90 px-3.5 text-xs font-semibold text-[#713f12] hover:bg-amber-50 hover:border-amber-900/40 cursor-pointer"
              >
                <User className="size-3.5" />
                <span>Login</span>
              </Button>
            </Link>
          )}

          {/* Shop Now CTA Button */}
          <Link href="/all-products">
            <Button className="h-9 gap-1.5 rounded-full bg-[#713f12] px-4 text-xs font-bold text-white hover:bg-[#5c330e] shadow-sm shadow-amber-900/20 transition-all cursor-pointer">
              <span>Shop Now</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════════════ */}
      {/* ── MOBILE NAVIGATION (lg:hidden) — TWO-TIER NON-CONGESTED STRUCTURE ──      */}
      {/* ═════════════════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden flex flex-col bg-white border-b border-amber-900/10">
        {/* ── Line 1 (Above): Bigger App Logo & Name at Leftmost, Search & Menu at Rightmost ── */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Leftmost: App Logo & App Name (Enlarged) */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#713f12] text-lg text-amber-100 shadow-xs transition-transform duration-200 group-active:scale-95">
              🌿
            </span>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#422006] leading-tight">
                Nepali <span className="text-[#713f12]">Rudraksh</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#713f12]/80 leading-none mt-0.5">
                Authentic Himalayan Beads
              </span>
            </div>
          </Link>

          {/* Rightmost: Search at the left of Menu */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search items"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-900/15 bg-white text-[#713f12] shadow-2xs hover:border-amber-900/35 hover:bg-amber-50 active:scale-95 transition-all cursor-pointer"
            >
              <Search className="size-5" />
            </button>

            {/* Menu Icon Drawer Trigger */}
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
                <SheetTitle className="flex items-center gap-2 text-sm font-bold text-[#422006]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#713f12] text-xs text-amber-100">
                    🌿
                  </span>
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

              {/* Drawer Search */}
              <div className="p-4 border-b border-amber-900/10 bg-white/70">
                <button
                  type="button"
                  onClick={() => {
                    setSheetOpen(false);
                    setSearchOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-2xl border border-amber-900/15 bg-white px-3.5 py-2.5 text-xs text-[#5c3a1e]/70 shadow-2xs hover:border-amber-900/30 transition-colors"
                >
                  <Search className="h-4 w-4 text-[#713f12]" />
                  <span>Search 1-21 Mukhi, malas...</span>
                </button>
              </div>

              {/* Drawer Navigation Links & Catalog */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {/* Shop Catalog Accordion Card */}
                <div className="rounded-2xl border border-amber-900/15 bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setMobileShopExpanded(!mobileShopExpanded)}
                    className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold text-[#422006] hover:bg-amber-50/50 transition-colors"
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
                            <span className="truncate">{m.name.split(" ")[0]} Mukhi</span>
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
                        onClick={() => {
                          handleLogout();
                          setSheetOpen(false);
                        }}
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

        {/* ── Line 2 (Just Below Them): Bigger Buttons for Auth (Login), Cart, and Currency (NPR) ── */}
        <div className="grid grid-cols-3 gap-2 px-3.5 py-2.5 border-t border-amber-900/10 bg-[#faf7f2]/80">
          {/* 1. Auth: Login or Profile (Bigger Button) */}
          {isAuthenticated ? (
            <Link
              href="/profile"
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-amber-900/15 bg-white px-2.5 text-xs sm:text-sm font-bold text-[#422006] shadow-2xs hover:border-amber-900/35 hover:bg-amber-50 active:scale-95 transition-all"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#713f12] text-xs font-bold text-white shrink-0">
                {userInitials}
              </div>
              <span className="truncate text-xs sm:text-sm text-[#422006]">
                {userDisplayName.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <Link href="/login" className="block w-full">
              <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-amber-900/15 bg-white px-2.5 text-xs sm:text-sm font-bold text-[#713f12] shadow-2xs hover:border-amber-900/35 hover:bg-amber-50 active:scale-95 transition-all cursor-pointer">
                <User className="size-4.5 shrink-0 text-[#713f12]" />
                <span className="text-xs sm:text-sm font-bold tracking-wide">Login</span>
              </div>
            </Link>
          )}

          {/* 2. Cart (Bigger Button) */}
          <Link href="/cart" className="block w-full">
            <div className="relative flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-amber-900/15 bg-white px-2.5 text-xs sm:text-sm font-bold text-[#422006] shadow-2xs hover:border-amber-900/35 hover:bg-amber-50 active:scale-95 transition-all cursor-pointer">
              <ShoppingBag className="size-4.5 shrink-0 text-[#713f12]" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">Cart</span>
              {isMounted && totalItems > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#713f12] px-1 text-[11px] font-extrabold text-white shadow-2xs">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </div>
          </Link>

          {/* 3. Currency / NPR (Bigger Button) */}
          <div className="w-full [&>div]:w-full [&>button]:h-11! [&>button]:w-full! [&>button]:rounded-xl! [&>button]:px-2.5! [&>button]:text-xs! sm:[&>button]:text-sm! [&>button]:font-bold! [&>button]:shadow-2xs! [&>button]:justify-center! [&>button]:border-amber-900/15! [&>button]:bg-white! hover:[&>button]:border-amber-900/35! hover:[&>button]:bg-amber-50!">
            <CurrencySelector variant="compact" className="w-full" />
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════════════ */}
      {/* ── SEARCH DIALOG MODAL (Warm Sacred Theme) ──                                */}
      {/* ═════════════════════════════════════════════════════════════════════════════ */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 sm:pt-24 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-900/15 bg-white shadow-2xl animate-in zoom-in-95 duration-200 text-[#422006]">
            {/* Search Input Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative border-b border-amber-900/10 p-4"
            >
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-[#713f12] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search 1-21 Mukhi, Siddh Mala, bracelets, deity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base font-medium placeholder:text-[#5c3a1e]/40 outline-none text-[#422006]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="rounded-full p-1 text-[#713f12]/60 hover:bg-amber-50 hover:text-[#713f12] cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="h-7 px-2 text-[11px] font-semibold text-[#713f12]/70 hover:bg-amber-50"
                >
                  ESC
                </Button>
              </div>
            </form>

            {/* Modal Body */}
            <div className="max-h-[60vh] overflow-y-auto p-5">
              {searchQuery.trim() ? (
                /* Live Results */
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#713f12] mb-3">
                    Found {filteredResults.length} Items
                  </p>

                  {filteredResults.length === 0 ? (
                    <div className="py-8 text-center">
                      <span className="text-3xl mb-2 inline-block">🔍</span>
                      <p className="text-sm font-bold text-[#422006]">
                        No matching sacred beads found
                      </p>
                      <p className="text-xs text-[#5c3a1e]/70 mt-1">
                        Try searching for &quot;5 Mukhi&quot;, &quot;Siddh Mala&quot;, or &quot;Gauri Shankar&quot;.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredResults.map((item) => (
                        <Link
                          key={item.id}
                          href="/all-products"
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between rounded-2xl border border-amber-900/10 p-3.5 shadow-2xs transition hover:bg-amber-50/60"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/50 text-xl">
                              {item.emoji}
                            </span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-[#422006]">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-[#713f12]/70">
                                {item.mukhi} · {item.deity}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs sm:text-sm font-extrabold text-[#713f12]">
                              {item.price}
                            </span>
                            <ArrowRight className="h-4 w-4 text-[#713f12]/60" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Default State / Popular Searches */
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#713f12] mb-3">
                    <Sparkles className="h-3.5 w-3.5 text-[#713f12]" />
                    Popular Searches
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="rounded-full border border-amber-900/15 bg-white px-3.5 py-1.5 text-xs font-medium text-[#5c3a1e] hover:border-amber-900/35 hover:bg-amber-50 hover:text-[#713f12] transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-amber-900/10 pt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#713f12] mb-3">
                      Featured Collections
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Link
                        href="/all-products"
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 rounded-2xl border border-amber-900/10 p-3 hover:bg-amber-50/60"
                      >
                        <span className="text-xl">📿</span>
                        <div>
                          <p className="text-xs font-bold text-[#422006]">Nepal Siddh Malas</p>
                          <p className="text-[10px] text-[#713f12]/70">108+1 Blessed Beads</p>
                        </div>
                      </Link>

                      <Link
                        href="/all-products"
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 rounded-2xl border border-amber-900/10 p-3 hover:bg-amber-50/60"
                      >
                        <span className="text-xl">🌙</span>
                        <div>
                          <p className="text-xs font-bold text-[#422006]">1 to 21 Mukhi Beads</p>
                          <p className="text-[10px] text-[#713f12]/70">Rare Collector Grades</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer CTA */}
            <div className="border-t border-amber-900/10 p-3.5 px-5 sm:flex sm:items-center sm:justify-between text-center bg-[#faf7f2]/50">
              <span className="text-[11px] text-[#713f12]/70 hidden sm:inline">
                Press <kbd className="rounded border border-amber-900/15 bg-white px-1 py-0.5 font-mono text-[10px]">Enter</kbd> to search full catalog
              </span>
              <Link
                href="/all-products"
                onClick={() => setSearchOpen(false)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#713f12] hover:underline"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
