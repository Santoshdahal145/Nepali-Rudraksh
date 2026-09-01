"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Sparkles,
  ShieldCheck,
  Star,
  DollarSign,
  Save,
  CheckCircle2,
  Trash2,
  Layers,
  Award,
  Calendar,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAdmin } from "../../data/AdminContext";

export default function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { products, updateProduct, deleteProduct } = useAdmin();

  // Find product by id
  const product = products.find((p) => p.id === resolvedParams.productId) || products[0];

  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    costPrice: product?.costPrice || 0,
    stock: product?.stock || 0,
    mukhiType: product?.mukhiType || "",
    deity: product?.deity || "",
    planet: product?.planet || "",
    origin: product?.origin || "",
    chakra: product?.chakra || "",
    badge: product?.badge || "",
    description: product?.description || "",
    isFeatured: product?.isFeatured || false,
    inStock: product?.inStock ?? true,
  });

  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-base font-bold text-[#422006]">Product not found</p>
        <Link href="/admin/all-products">
          <Button className="mt-4 bg-[#713f12] text-white">Back to Inventory</Button>
        </Link>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(product.id, {
      name: formData.name,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      costPrice: Number(formData.costPrice),
      stock: Number(formData.stock),
      mukhiType: formData.mukhiType,
      deity: formData.deity,
      planet: formData.planet,
      origin: formData.origin,
      chakra: formData.chakra,
      badge: formData.badge,
      description: formData.description,
      isFeatured: formData.isFeatured,
      inStock: Number(formData.stock) > 0,
    });
    showToast("Product details updated successfully!");
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      deleteProduct(product.id);
      router.push("/admin/all-products");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#713f12] px-4 py-3 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-amber-300" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/all-products">
            <Button
              variant="outline"
              size="icon-sm"
              className="border-amber-900/15 text-[#713f12] hover:bg-amber-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5c3a1e]/70">SKU:</span>
              <code className="text-xs font-mono bg-amber-100/70 px-1.5 py-0.5 rounded text-[#422006]">
                {product.sku}
              </code>
              <Badge variant="gold" className="text-[10px]">
                {product.mukhiType}
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-[#422006]">{product.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/all-products" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 border-amber-900/20 text-xs text-[#713f12] hover:bg-amber-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View on Public Site
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="h-9 gap-1.5 text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Product
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Visual Card, Lab Certificate & Performance */}
          <div className="space-y-6 lg:col-span-1">
            {/* Visual Card */}
            <Card className="shadow-xs text-center p-6 space-y-4">
              <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-3xl bg-linear-to-br from-amber-100/80 via-orange-50 to-amber-50 shadow-inner">
                <span className="text-6xl">{product.emoji}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#422006]">{formData.name}</h2>
                <p className="text-xs text-amber-800 font-semibold">{formData.mukhiType} • {product.category}</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-[#422006]">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviewsCount} devotee reviews)</span>
                </div>
              </div>

              {/* Lab Certification Card */}
              <div className="rounded-2xl border border-amber-900/15 bg-amber-50/60 p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#713f12]">
                  <ShieldCheck className="h-4 w-4 text-amber-700" />
                  <span>Lab Authenticity Verified</span>
                </div>
                <div className="text-[11px] text-[#5c3a1e]/80 space-y-1">
                  <p>Certificate: <strong className="font-mono text-[#422006]">{product.certNumber}</strong></p>
                  <p>Origin: <strong>{product.origin}</strong></p>
                  <p>Consecration: <strong>Pashupatinath Temple Puja</strong></p>
                </div>
              </div>

              {/* Sales Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl bg-amber-100/50 p-3 text-center border border-amber-900/10">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Units Sold</p>
                  <p className="text-lg font-black text-[#422006]">{product.salesCount}</p>
                </div>
                <div className="rounded-xl bg-amber-100/50 p-3 text-center border border-amber-900/10">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Gross Sales</p>
                  <p className="text-lg font-black text-[#713f12]">
                    ${product.salesCount * product.price}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Editable Product Details Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* General & Pricing Info */}
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold">Pricing & Inventory Health</CardTitle>
                <CardDescription>Update active selling price, stock quantities, and feature tags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-[#422006]">Product Name</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-10"
                      required
                    />
                  </div>

                  {/* Selling Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Selling Price ($ USD)</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="h-10 font-bold text-[#713f12]"
                      required
                    />
                  </div>

                  {/* Original Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Compare-At Price ($ USD)</label>
                    <Input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="h-10"
                    />
                  </div>

                  {/* Stock Quantity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Current Stock Quantity</label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="h-10 font-bold"
                      required
                    />
                  </div>

                  {/* Badge Text */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Badge / Tag</label>
                    <Input
                      type="text"
                      value={formData.badge}
                      placeholder="e.g. Rare & Sacred, Bestseller"
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Featured on Homepage Switch */}
                <div className="flex items-center justify-between rounded-xl bg-amber-50/60 p-3.5 border border-amber-900/10 mt-2">
                  <div>
                    <p className="text-xs font-bold text-[#422006]">Feature on Public Storefront</p>
                    <p className="text-[11px] text-muted-foreground">
                      Display this sacred Rudraksha in the homepage featured collection.
                    </p>
                  </div>
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vedic & Astrological Specs */}
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold">Vedic & Astrological Specifications</CardTitle>
                <CardDescription>Deity alignment, governing planet, origin, and chakra energy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Governing Deity</label>
                    <Input
                      type="text"
                      value={formData.deity}
                      onChange={(e) => setFormData({ ...formData, deity: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Governing Planet</label>
                    <Input
                      type="text"
                      value={formData.planet}
                      onChange={(e) => setFormData({ ...formData, planet: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Himalayan Origin</label>
                    <Input
                      type="text"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#422006]">Governing Chakra</label>
                    <Input
                      type="text"
                      value={formData.chakra}
                      onChange={(e) => setFormData({ ...formData, chakra: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-[#422006]">Product Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-xl border border-amber-900/15 bg-amber-50/20 p-3 text-xs text-[#422006] outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700"
                    />
                  </div>
                </div>

                {/* Benefits List */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-[#422006] mb-2">Sacred Benefits Highlighted:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.benefits?.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg bg-amber-50 p-2 text-xs text-[#5c3a1e] border border-amber-900/10"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                        <span className="truncate">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-4 border-t border-amber-900/10">
                  <Button
                    type="submit"
                    className="h-10 gap-2 bg-[#713f12] text-xs font-bold text-white shadow-xs hover:bg-[#5c330e]"
                  >
                    <Save className="h-4 w-4" />
                    Save Product Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
