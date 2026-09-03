"use client";

import { useState, useEffect, useRef } from "react";
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
  Star,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/providers/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/all-products" },
  { label: "Collections", href: "/#collections" },
  { label: "Offers", href: "/#offers" },
  { label: "Our Story", href: "/#story" },
];

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
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Auto focus input when search modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  // Handle ESC key to close search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
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

  return (
    <>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Brand ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#713f12] text-base text-white shadow-sm shadow-amber-900/30">
            🌿
          </span>
          <span className="font-semibold tracking-tight text-[#422006]">
            Nepali <span className="text-[#713f12]">Rudraksh</span>
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative text-sm font-medium text-[#5c3a1e]/80 transition-colors hover:text-[#713f12]"
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-[#713f12] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* ── Desktop Actions ── */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            aria-label="Search sacred items"
            className="text-[#713f12]/80 hover:bg-amber-50 hover:text-[#713f12] transition-colors"
          >
            <Search className="size-4.5" />
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className="relative text-[#713f12]/80 hover:bg-amber-50 hover:text-[#713f12]"
          >
            <Link href="/cart">
              <ShoppingBag className="size-4.5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#713f12] text-[9px] font-bold text-white">
                2
              </span>
            </Link>
          </Button>

          {/* Auth: Login or User Avatar */}
          {isAuthenticated ? (
            <Link
              href="/user-settings"
              className="group flex h-9 items-center gap-2 rounded-full border border-amber-900/20 bg-amber-50/60 pl-1 pr-3.5 transition-all duration-200 hover:border-amber-900/40 hover:bg-amber-100/70 hover:shadow-xs"
              title="User Settings"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#713f12] text-xs font-bold text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
                {userInitials}
              </div>
              <span className="max-w-[130px] truncate text-xs font-semibold text-[#422006] transition-colors group-hover:text-[#713f12]">
                {userDisplayName}
              </span>
            </Link>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                className="h-9 gap-1.5 border-amber-900/20 px-4 text-sm font-medium text-[#713f12] hover:border-amber-900/40 hover:bg-amber-50"
              >
                <User className="size-3.5" />
                Login
              </Button>
            </Link>
          )}

          {/* Shop CTA */}
          <Link href="/all-products">
            <Button className="h-9 bg-[#713f12] px-5 text-sm font-medium text-white shadow-sm shadow-amber-900/20 hover:bg-[#5c330e]">
              Shop Now
            </Button>
          </Link>
        </div>

        {/* ── Mobile Actions ── */}
        <div className="flex items-center gap-1 lg:hidden">
          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="text-[#713f12]/80 hover:bg-amber-50 hover:text-[#713f12]"
          >
            <Search className="size-5" />
          </Button>

          {/* Cart icon on mobile */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className="relative text-[#713f12]/80 hover:bg-amber-50 hover:text-[#713f12]"
          >
            <Link href="/cart">
              <ShoppingBag className="size-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#713f12] text-[9px] font-bold text-white">
                2
              </span>
            </Link>
          </Button>

          {/* Hamburger Sheet */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="text-[#713f12]/80 hover:bg-amber-50 hover:text-[#713f12]"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-72 flex-col border-l border-amber-900/10 bg-[#faf7f2] p-0"
            >
              {/* Sheet header */}
              <div className="flex items-center justify-between border-b border-amber-900/10 px-5 py-4">
                <SheetTitle className="flex items-center gap-2 text-base font-semibold text-[#422006]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#713f12] text-sm text-white">
                    🌿
                  </span>
                  Nepali Rudraksh
                </SheetTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#713f12]/60 hover:bg-amber-100 hover:text-[#713f12]"
                  onClick={() => setSheetOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Mobile Quick Search Bar inside Sheet */}
              <div className="px-4 pt-4">
                <button
                  onClick={() => {
                    setSheetOpen(false);
                    setSearchOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-amber-900/15 bg-white px-3.5 py-2.5 text-xs text-muted-foreground shadow-xs transition hover:border-amber-900/30"
                >
                  <Search className="h-4 w-4 text-[#713f12]" />
                  <span>Search Mukhis, Malas...</span>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1 px-3 py-4">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-[#5c3a1e]/80 transition-colors hover:bg-amber-100/60 hover:text-[#713f12]"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="mx-5 h-px bg-amber-900/10" />

              {/* Auth + CTA */}
              <div className="flex flex-col gap-3 px-5 py-5">
                {isAuthenticated ? (
                  <Link
                    href="/user-settings"
                    onClick={() => setSheetOpen(false)}
                    className="group flex items-center gap-3 rounded-2xl border border-amber-900/20 bg-white p-3 shadow-xs transition-all duration-200 hover:border-amber-900/40 hover:bg-amber-50/70"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#713f12] text-xs font-bold text-white shadow-xs">
                      {userInitials}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-semibold text-[#422006]">
                        {userDisplayName}
                      </span>
                      <span className="text-[11px] font-medium text-[#713f12]/80 group-hover:underline">
                        User Settings & Profile →
                      </span>
                    </div>
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setSheetOpen(false)}>
                    <Button
                      variant="outline"
                      className="h-10 w-full gap-2 border-amber-900/20 text-[#713f12] hover:border-amber-900/40 hover:bg-amber-50"
                    >
                      <User className="size-4" />
                      Login / Register
                    </Button>
                  </Link>
                )}
                <Link href="/all-products" onClick={() => setSheetOpen(false)}>
                  <Button className="h-10 w-full bg-[#713f12] text-white shadow-sm shadow-amber-900/20 hover:bg-[#5c330e]">
                    Shop Now
                  </Button>
                </Link>
              </div>

              {/* Footer tagline */}
              <div className="mt-auto border-t border-amber-900/10 px-5 py-4">
                <p className="text-center text-xs text-[#713f12]/50">
                  🌿 Sacred. Authentic. Pure.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* ── Sacred Search Dialog Modal Overlay ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 sm:pt-24 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-900/15 bg-[#faf7f2] shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Search Input Box */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative border-b border-amber-900/10 bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-[#713f12] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search 1-21 Mukhi, Siddh Mala, bracelets, deity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base font-medium text-[#2d1a0e] placeholder:text-[#5c3a1e]/40 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="rounded-full p-1 text-muted-foreground hover:bg-amber-100 hover:text-[#422006]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchOpen(false)}
                  className="h-8 px-2.5 text-xs text-muted-foreground hover:text-[#422006]"
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
                  <p className="text-xs font-bold uppercase tracking-wider text-[#713f12] mb-3">
                    Found {filteredResults.length} Sacred Items
                  </p>

                  {filteredResults.length === 0 ? (
                    <div className="py-8 text-center">
                      <span className="text-4xl mb-2 inline-block">🔍</span>
                      <p className="text-sm font-bold text-[#422006]">
                        No matching sacred beads found
                      </p>
                      <p className="text-xs text-[#5c3a1e]/70 mt-1">
                        Try searching for &quot;5 Mukhi&quot;, &quot;Siddh
                        Mala&quot;, or &quot;Gauri Shankar&quot;.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredResults.map((item) => (
                        <Link
                          key={item.id}
                          href="/all-products"
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between rounded-2xl border border-amber-900/5 bg-white p-3.5 shadow-xs transition hover:border-amber-900/20 hover:bg-amber-50/50 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf7f2] text-xl shadow-inner">
                              {item.emoji}
                            </span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-[#2d1a0e]">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-[#5c3a1e]/70">
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
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713f12] mb-3">
                    <Sparkles className="h-3.5 w-3.5" />
                    Popular Searches
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="rounded-full border border-amber-900/10 bg-white px-3.5 py-1.5 text-xs font-medium text-[#5c3a1e] transition hover:border-amber-900/30 hover:bg-amber-100/60 hover:text-[#713f12]"
                      >
                        {term}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-amber-900/10 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#713f12] mb-3">
                      Featured Collections
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Link
                        href="/all-products"
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 rounded-xl border border-amber-900/10 bg-white p-3 hover:bg-amber-50"
                      >
                        <span className="text-xl">📿</span>
                        <div>
                          <p className="text-xs font-bold text-[#422006]">
                            Nepal Siddh Malas
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            108+1 Blessed Beads
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/all-products"
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 rounded-xl border border-amber-900/10 bg-white p-3 hover:bg-amber-50"
                      >
                        <span className="text-xl">🌙</span>
                        <div>
                          <p className="text-xs font-bold text-[#422006]">
                            1 to 21 Mukhi Beads
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Rare Collector Grades
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer CTA */}
            <div className="border-t border-amber-900/10 bg-white p-3.5 text-center sm:flex sm:items-center sm:justify-between px-5">
              <span className="text-[11px] text-[#5c3a1e]/60 hidden sm:inline">
                Press{" "}
                <kbd className="rounded border bg-amber-50 px-1 py-0.5 font-mono text-[10px]">
                  Enter
                </kbd>{" "}
                to search full catalog
              </span>
              <Link
                href="/all-products"
                onClick={() => setSearchOpen(false)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#713f12] hover:underline"
              >
                View Full Himalayan Collection
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
