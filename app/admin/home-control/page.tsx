"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sliders,
  Sparkles,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Eye,
  Tag,
  MessageSquare,
  Layout,
  Megaphone,
  Star,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAdmin } from "../../../providers/AdminContext";

export default function AdminHomeControlPage() {
  const {
    homeControl,
    products,
    updateHomeControl,
    addOffer,
    toggleOfferStatus,
    deleteOffer,
  } = useAdmin();

  // Hero form state
  const [heroData, setHeroData] = useState(homeControl.heroSection);
  const [announcement, setAnnouncement] = useState(homeControl.announcementBar);
  const [selectedFeatured, setSelectedFeatured] = useState<string[]>(
    homeControl.featuredProductIds
  );
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // New Offer Form state
  const [isAddOfferOpen, setIsAddOfferOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: "Navaratri Divine Blessings",
    code: "NAVARATRI20",
    discountPercent: 20,
    description:
      "20% off all Mukhis and Malas with complimentary Durga Puja consecration.",
    expiresAt: "2026-10-15",
    isActive: true,
    badge: "Festival Special",
    bgGradient: "from-amber-800 to-[#422006]",
  });

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomeControl({ heroSection: heroData });
    showToast("Hero section content saved and live on homepage!");
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomeControl({ announcementBar: announcement });
    showToast("Top announcement banner updated!");
  };

  const handleToggleFeaturedProduct = (productId: string) => {
    const isPresent = selectedFeatured.includes(productId);
    const updated = isPresent
      ? selectedFeatured.filter((id) => id !== productId)
      : [...selectedFeatured, productId];
    setSelectedFeatured(updated);
    updateHomeControl({ featuredProductIds: updated });
    showToast(
      isPresent
        ? "Product removed from Featured section."
        : "Product added to Featured section."
    );
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    addOffer({
      title: newOffer.title,
      code: newOffer.code.toUpperCase(),
      discountPercent: Number(newOffer.discountPercent),
      description: newOffer.description,
      expiresAt: newOffer.expiresAt,
      isActive: newOffer.isActive,
      badge: newOffer.badge,
      bgGradient: newOffer.bgGradient,
    });
    setIsAddOfferOpen(false);
    showToast(`Promotional Offer "${newOffer.title}" activated!`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#713f12] px-4 py-3 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-amber-300" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-amber-900/10 bg-linear-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" className="text-[10px]">
              Storefront CMS
            </Badge>
            <span className="text-xs text-muted-foreground">
              Live Public Homepage Controls
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006]">
            Home Page Control & Banners
          </h1>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/80 mt-1 max-w-2xl">
            Control the announcement bar, hero section headlines, featured
            sacred products, promotional festival offers, and devotee
            testimonials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" target="_blank">
            <Button
              variant="outline"
              className="h-10 gap-1.5 border-amber-900/20 bg-white text-xs font-bold text-[#713f12] hover:bg-amber-50 shadow-2xs"
            >
              <ExternalLink className="h-4 w-4" />
              Preview Live Homepage
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Announcement Bar Control */}
      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-[#713f12]" />
              <div>
                <CardTitle className="text-base font-bold">
                  Top Announcement Bar
                </CardTitle>
                <CardDescription>
                  Header notification shown to all visiting devotees
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#422006]">
                {announcement.enabled ? "Enabled" : "Disabled"}
              </span>
              <Switch
                checked={announcement.enabled}
                onCheckedChange={(checked) =>
                  setAnnouncement({ ...announcement, enabled: checked })
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveAnnouncement} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold text-[#422006]">
                  Badge Label
                </label>
                <Input
                  type="text"
                  value={announcement.badge}
                  onChange={(e) =>
                    setAnnouncement({ ...announcement, badge: e.target.value })
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-3">
                <label className="text-xs font-bold text-[#422006]">
                  Announcement Message
                </label>
                <Input
                  type="text"
                  value={announcement.text}
                  onChange={(e) =>
                    setAnnouncement({ ...announcement, text: e.target.value })
                  }
                  className="h-10"
                />
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="rounded-xl border border-amber-900/10 bg-amber-100/50 p-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-semibold">
                Preview:
              </span>
              <div className="flex items-center gap-2 font-medium text-[#713f12]">
                <span className="rounded-full bg-[#713f12] text-white px-2 py-0.5 text-[10px] font-bold">
                  {announcement.badge}
                </span>
                <span className="truncate">{announcement.text}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                className="bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e]"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                Update Announcement Bar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. Hero Section Control */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Layout className="h-5 w-5 text-[#713f12]" />
            Hero Section Banner & Copy
          </CardTitle>
          <CardDescription>
            Customize headline, subheadline, badges, and call-to-action buttons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveHero} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#422006]">
                  Top Badge Tag
                </label>
                <Input
                  type="text"
                  value={heroData.badgeText}
                  onChange={(e) =>
                    setHeroData({ ...heroData, badgeText: e.target.value })
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#422006]">
                  Main Hero Headline
                </label>
                <Input
                  type="text"
                  value={heroData.headline}
                  onChange={(e) =>
                    setHeroData({ ...heroData, headline: e.target.value })
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#422006]">
                  Highlighted Text Emphasis
                </label>
                <Input
                  type="text"
                  value={heroData.highlightText}
                  onChange={(e) =>
                    setHeroData({ ...heroData, highlightText: e.target.value })
                  }
                  className="h-10 text-[#713f12] font-bold"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#422006]">
                  Hero Subheadline / Mission
                </label>
                <textarea
                  rows={2}
                  value={heroData.subheadline}
                  onChange={(e) =>
                    setHeroData({ ...heroData, subheadline: e.target.value })
                  }
                  className="w-full rounded-xl border border-amber-900/15 bg-amber-50/20 p-3 text-xs text-[#422006] outline-none focus:border-amber-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#422006]">
                  Primary CTA Button Text
                </label>
                <Input
                  type="text"
                  value={heroData.primaryCtaText}
                  onChange={(e) =>
                    setHeroData({ ...heroData, primaryCtaText: e.target.value })
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#422006]">
                  Primary CTA Target URL
                </label>
                <Input
                  type="text"
                  value={heroData.primaryCtaLink}
                  onChange={(e) =>
                    setHeroData({ ...heroData, primaryCtaLink: e.target.value })
                  }
                  className="h-10"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                size="sm"
                className="bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e]"
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                Save Hero Section
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 3. Featured Products Selector */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#713f12]" />
              Homepage Featured Sacred Collection ({
                selectedFeatured.length
              }{" "}
              active)
            </CardTitle>
            <CardDescription>
              Toggle which products appear on the homepage sacred gallery
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((prod) => {
              const isSelected = selectedFeatured.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  onClick={() => handleToggleFeaturedProduct(prod.id)}
                  className={`flex items-center justify-between rounded-2xl p-3.5 border cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#713f12] bg-amber-100/50 shadow-xs"
                      : "border-amber-900/10 bg-white hover:bg-amber-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl">
                      {prod.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-[#422006] truncate">
                        {prod.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        ${prod.price} • {prod.mukhiType}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "bg-[#713f12] border-[#713f12] text-white"
                        : "border-amber-900/20 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 4. Special Offers & Promo Banners */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Tag className="h-5 w-5 text-[#713f12]" />
              Promotional Offers & Discount Banners ({homeControl.offers.length}
              )
            </CardTitle>
            <CardDescription>
              Create festival coupon discounts and promotional highlight banners
            </CardDescription>
          </div>

          <Dialog open={isAddOfferOpen} onOpenChange={setIsAddOfferOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="h-9 gap-1.5 bg-[#713f12] text-xs font-bold text-white hover:bg-[#5c330e]"
              >
                <Plus className="h-4 w-4" />
                Add Offer Banner
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Promotional Festival Offer</DialogTitle>
                <DialogDescription>
                  Set the discount code, percentage, description, and expiry
                  date.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleCreateOffer}
                className="space-y-3.5 text-xs"
              >
                <div className="space-y-1">
                  <label className="font-bold text-[#422006]">
                    Offer Title
                  </label>
                  <Input
                    type="text"
                    required
                    value={newOffer.title}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, title: e.target.value })
                    }
                    className="h-9"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#422006]">
                      Promo Code
                    </label>
                    <Input
                      type="text"
                      required
                      value={newOffer.code}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, code: e.target.value })
                      }
                      className="h-9 font-mono font-bold uppercase"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#422006]">
                      Discount %
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="90"
                      value={newOffer.discountPercent}
                      onChange={(e) =>
                        setNewOffer({
                          ...newOffer,
                          discountPercent: Number(e.target.value),
                        })
                      }
                      className="h-9 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#422006]">
                    Expiry Date
                  </label>
                  <Input
                    type="date"
                    value={newOffer.expiresAt}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, expiresAt: e.target.value })
                    }
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#422006]">
                    Offer Details
                  </label>
                  <textarea
                    rows={2}
                    value={newOffer.description}
                    onChange={(e) =>
                      setNewOffer({ ...newOffer, description: e.target.value })
                    }
                    className="w-full rounded-md border border-input p-2 text-xs"
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddOfferOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-[#713f12] text-white hover:bg-[#5c330e]"
                  >
                    Save & Activate Offer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {homeControl.offers.map((off) => (
              <div
                key={off.id}
                className="relative overflow-hidden rounded-2xl border border-amber-900/10 bg-linear-to-br from-[#713f12] via-[#8b4513] to-[#422006] p-5 text-white shadow-md"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="gold" className="text-[10px]">
                    {off.badge}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-200">
                      {off.isActive ? "Active" : "Inactive"}
                    </span>
                    <Switch
                      checked={off.isActive}
                      onCheckedChange={() => toggleOfferStatus(off.id)}
                    />
                    <button
                      onClick={() => deleteOffer(off.id)}
                      className="p-1 text-white/60 hover:text-white transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="text-base font-extrabold">{off.title}</h4>
                  <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">
                    {off.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-200">Code:</span>
                    <code className="rounded bg-white/20 px-2 py-0.5 font-mono text-xs font-bold text-amber-300">
                      {off.code}
                    </code>
                  </div>
                  <span className="text-lg font-black text-amber-300">
                    {off.discountPercent}% OFF
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
