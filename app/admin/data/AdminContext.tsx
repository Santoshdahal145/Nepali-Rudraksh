"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AdminUser,
  AdminProduct,
  AdminOrder,
  HomeControlData,
  AdminSettingsData,
  initialUsers,
  initialProducts,
  initialOrders,
  initialHomeControl,
  initialSettings,
} from "./mockData";

interface AdminContextType {
  users: AdminUser[];
  products: AdminProduct[];
  orders: AdminOrder[];
  homeControl: HomeControlData;
  settings: AdminSettingsData;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  toggleBlockUser: (userId: string) => void;
  updateUserStatus: (userId: string, status: "Active" | "Blocked" | "VIP") => void;
  deleteUser: (userId: string) => void;
  addProduct: (product: Omit<AdminProduct, "id" | "createdAt" | "salesCount" | "rating" | "reviewsCount">) => void;
  updateProduct: (id: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: AdminOrder["status"]) => void;
  updateOrderPaymentStatus: (orderId: string, status: AdminOrder["paymentStatus"]) => void;
  updateHomeControl: (updates: Partial<HomeControlData>) => void;
  addOffer: (offer: Omit<HomeControlData["offers"][0], "id">) => void;
  toggleOfferStatus: (offerId: string) => void;
  deleteOffer: (offerId: string) => void;
  updateSettings: (updates: Partial<AdminSettingsData>) => void;
  changePassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_PREFIX = "nepali_rudraksh_admin_";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [homeControl, setHomeControl] = useState<HomeControlData>(initialHomeControl);
  const [settings, setSettings] = useState<AdminSettingsData>(initialSettings);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // default authenticated in dev mode

  // Load from session storage if present
  useEffect(() => {
    try {
      const savedUsers = sessionStorage.getItem(`${STORAGE_PREFIX}users`);
      if (savedUsers) setUsers(JSON.parse(savedUsers));

      const savedProducts = sessionStorage.getItem(`${STORAGE_PREFIX}products`);
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedOrders = sessionStorage.getItem(`${STORAGE_PREFIX}orders`);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedHome = sessionStorage.getItem(`${STORAGE_PREFIX}homeControl`);
      if (savedHome) setHomeControl(JSON.parse(savedHome));

      const savedSettings = sessionStorage.getItem(`${STORAGE_PREFIX}settings`);
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedAuth = sessionStorage.getItem(`${STORAGE_PREFIX}auth`);
      if (savedAuth !== null) setIsAuthenticated(JSON.parse(savedAuth));
    } catch (e) {
      console.error("Failed to load admin state:", e);
    }
  }, []);

  // Sync to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}users`, JSON.stringify(users));
      sessionStorage.setItem(`${STORAGE_PREFIX}products`, JSON.stringify(products));
      sessionStorage.setItem(`${STORAGE_PREFIX}orders`, JSON.stringify(orders));
      sessionStorage.setItem(`${STORAGE_PREFIX}homeControl`, JSON.stringify(homeControl));
      sessionStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(settings));
      sessionStorage.setItem(`${STORAGE_PREFIX}auth`, JSON.stringify(isAuthenticated));
    } catch (e) {
      console.error("Failed to save admin state:", e);
    }
  }, [users, products, orders, homeControl, settings, isAuthenticated]);

  const login = (email: string, pass: string) => {
    // Standard mock admin login check
    if (email && pass.length >= 4) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const toggleBlockUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === "Blocked" ? "Active" : "Blocked";
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const updateUserStatus = (userId: string, status: "Active" | "Blocked" | "VIP") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const addProduct = (
    newProd: Omit<AdminProduct, "id" | "createdAt" | "salesCount" | "rating" | "reviewsCount">
  ) => {
    const id = `${Date.now()}`;
    const product: AdminProduct = {
      ...newProd,
      id,
      createdAt: new Date().toISOString().split("T")[0],
      salesCount: 0,
      rating: 5.0,
      reviewsCount: 0,
    };
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<AdminProduct>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateOrderStatus = (orderId: string, status: AdminOrder["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status } : o))
    );
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: AdminOrder["paymentStatus"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, paymentStatus } : o))
    );
  };

  const updateHomeControl = (updates: Partial<HomeControlData>) => {
    setHomeControl((prev) => ({ ...prev, ...updates }));
  };

  const addOffer = (offerData: Omit<HomeControlData["offers"][0], "id">) => {
    const id = `off_${Date.now()}`;
    const newOffer = { ...offerData, id };
    setHomeControl((prev) => ({
      ...prev,
      offers: [newOffer, ...prev.offers],
    }));
  };

  const toggleOfferStatus = (offerId: string) => {
    setHomeControl((prev) => ({
      ...prev,
      offers: prev.offers.map((off) =>
        off.id === offerId ? { ...off, isActive: !off.isActive } : off
      ),
    }));
  };

  const deleteOffer = (offerId: string) => {
    setHomeControl((prev) => ({
      ...prev,
      offers: prev.offers.filter((off) => off.id !== offerId),
    }));
  };

  const updateSettings = (updates: Partial<AdminSettingsData>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const changePassword = (currentPass: string, newPass: string) => {
    if (!currentPass) {
      return { success: false, message: "Please enter your current admin password." };
    }
    if (newPass.length < 6) {
      return { success: false, message: "New password must be at least 6 characters long." };
    }
    return { success: true, message: "Admin password has been updated securely." };
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        products,
        orders,
        homeControl,
        settings,
        isAuthenticated,
        login,
        logout,
        toggleBlockUser,
        updateUserStatus,
        deleteUser,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        updateOrderPaymentStatus,
        updateHomeControl,
        addOffer,
        toggleOfferStatus,
        deleteOffer,
        updateSettings,
        changePassword,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
