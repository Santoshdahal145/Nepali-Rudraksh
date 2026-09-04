"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Star,
  ShieldCheck,
  ArrowUpDown,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { initialProducts } from "../data/mockData";

export default function AdminAllProductsPage() {
  const products = initialProducts;

  const addProduct = () => {};
  const deleteProduct = () => {};

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Form State for Add Product
  const [newForm, setNewForm] = useState({
    name: "",
    category: "mukhi" as "mukhi" | "mala" | "bracelet" | "collector",
    mukhiType: "5 Mukhi",
    price: 150,
    originalPrice: 180,
    costPrice: 70,
    stock: 20,
    sku: "RUD-NEW-01",
    emoji: "📿",
    deity: "Kalagni Rudra",
    origin: "Sankhuwasabha, Nepal",
    description:
      "Authentic lab-certified Nepali Rudraksha blessed with Vedic mantras.",
    badge: "New Arrival",
    certNumber: `CERT-NP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    inStock: true,
    isFeatured: false,
    benefits: [
      "Brings peace of mind",
      "Balances nervous system",
      "Removes malefic planetary influences",
    ],
  });

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(`Are you sure you want to remove "${name}" from catalog?`)
    ) {
      deleteProduct(id);
      showToast(`Product "${name}" removed.`);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mukhiType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.deity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      categoryFilter === "all" || p.category === categoryFilter;

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "instock" && p.stock > 4) ||
      (stockFilter === "low" && p.stock <= 4 && p.stock > 0) ||
      (stockFilter === "out" && p.stock === 0);

    return matchesSearch && matchesCat && matchesStock;
  });

  const lowStockCount = products.filter(
    (p) => p.stock <= 4 && p.stock > 0
  ).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#713f12] px-4 py-3 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-amber-300" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-amber-900/10 bg-gradient-to-r from-amber-100/70 via-orange-50/50 to-amber-50 p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold" className="text-[10px]">
              Inventory Management
            </Badge>
            <span className="text-xs text-muted-foreground">
              {products.length} Sacred Items
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422006]">
            All Products
          </h1>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/80 mt-1 max-w-2xl">
            Track stock quantities, lab verification certificates, Mukhi grades,
            and pricing.
          </p>
        </div>

        {/* Add Product Trigger Button */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 gap-1.5 bg-[#713f12] text-xs font-bold text-white shadow-xs hover:bg-[#5c330e]">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add New Sacred Rudraksha Item</DialogTitle>
              <DialogDescription>
                Enter the Vedic specifications, Mukhi classification, and stock
                details.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {/* Inventory Health Pills */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Total Catalog
          </p>
          <p className="text-2xl font-black text-[#422006] mt-1">
            {products.length} Items
          </p>
        </Card>
        <Card className="p-4 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Optimal Stock
          </p>
          <p className="text-2xl font-black text-emerald-900 mt-1">
            {products.filter((p) => p.stock > 4).length} Items
          </p>
        </Card>
        <Card className="p-4 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Low Stock Alert
          </p>
          <p className="text-2xl font-black text-amber-900 mt-1">
            {lowStockCount} Items
          </p>
        </Card>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-900/10 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by Mukhi, deity, title, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10 text-xs sm:text-sm border-amber-900/15 focus-visible:ring-amber-700 bg-amber-50/20"
          />
        </div>

        {/* Category & Stock filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700"
          >
            <option value="all">Category: All</option>
            <option value="mukhi">Sacred Mukhis (1-21)</option>
            <option value="mala">Japa Malas (108)</option>
            <option value="collector">Rare Collector Beads</option>
            <option value="bracelet">Silver Bracelets</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="h-10 rounded-xl border border-amber-900/15 bg-white px-3 text-xs font-semibold text-[#422006] outline-none focus:border-amber-700"
          >
            <option value="all">Stock: All</option>
            <option value="instock">In Stock (&gt; 4)</option>
            <option value="low">Low Stock (&le; 4)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">
            Product Catalog
          </CardTitle>
          <CardDescription>
            Showing {filteredProducts.length} of {products.length} products
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-4xl">🔍</span>
              <p className="mt-2 text-sm font-bold text-[#422006]">
                No sacred items match query
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for another Mukhi, deity name, or resetting
                filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setStockFilter("all");
                }}
                className="mt-4 border-amber-900/20 text-xs text-[#713f12]"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category / Deity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock Status</TableHead>
                    <TableHead>Certification</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const isLowStock = product.stock <= 4 && product.stock > 0;
                    const isOut = product.stock === 0;

                    return (
                      <TableRow key={product.id}>
                        {/* Title & Emoji */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100/70 text-2xl shadow-2xs">
                              {product.emoji}
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/admin/all-products/${product.id}`}
                                className="font-bold text-[#422006] text-xs sm:text-sm hover:text-[#713f12] hover:underline truncate block"
                              >
                                {product.name}
                              </Link>
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <span className="font-mono">{product.sku}</span>
                                {product.badge && (
                                  <Badge
                                    variant="gold"
                                    className="text-[9px] px-1.5 py-0"
                                  >
                                    {product.badge}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Category & Deity */}
                        <TableCell>
                          <div className="font-semibold text-xs text-[#422006]">
                            {product.mukhiType} ({product.category})
                          </div>
                          <div className="text-[11px] text-amber-800">
                            Deity: {product.deity}
                          </div>
                        </TableCell>

                        {/* Price */}
                        <TableCell>
                          <div className="font-bold text-sm text-[#713f12]">
                            ${product.price}
                          </div>
                          {product.originalPrice && (
                            <div className="text-[10px] text-muted-foreground line-through">
                              ${product.originalPrice}
                            </div>
                          )}
                        </TableCell>

                        {/* Stock Status */}
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`inline-block h-2 w-2 rounded-full ${
                                isOut
                                  ? "bg-red-600"
                                  : isLowStock
                                    ? "bg-amber-500 animate-pulse"
                                    : "bg-emerald-600"
                              }`}
                            />
                            <span
                              className={`text-xs font-bold ${
                                isOut
                                  ? "text-red-700"
                                  : isLowStock
                                    ? "text-amber-800"
                                    : "text-emerald-800"
                              }`}
                            >
                              {product.stock} units
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {isOut
                              ? "Out of stock"
                              : isLowStock
                                ? "Low stock alert"
                                : "In stock"}
                          </span>
                        </TableCell>

                        {/* Cert */}
                        <TableCell>
                          <div className="text-xs font-mono text-[#5c3a1e] flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                            <span>{product.certNumber.slice(0, 12)}...</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {product.origin.split(",")[0]}
                          </div>
                        </TableCell>

                        {/* Sales */}
                        <TableCell>
                          <div className="font-semibold text-xs text-[#422006]">
                            {product.salesCount} sold
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-amber-700">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span>{product.rating}</span>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link href={`/admin/all-products/${product.id}`}>
                              <Button
                                variant="outline"
                                size="xs"
                                className="h-8 gap-1 border-amber-900/15 text-xs text-[#713f12] hover:bg-amber-100/60"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Details
                              </Button>
                            </Link>

                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() =>
                                handleDelete(product.id, product.name)
                              }
                              className="h-8 text-red-700 hover:bg-red-50 hover:text-red-900"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
