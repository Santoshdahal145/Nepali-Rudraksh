"use client";

import { changePasswordApi } from "@/app/api/auth/change-password/api";
import { loginApi } from "@/app/api/auth/login/api";
import { logoutApi } from "@/app/api/auth/logout/api";
import { paymentGatewayApi } from "@/app/api/payment-gateway/api";
import { storeSettingApi } from "@/app/api/store-setting/api";
import { updateUserApi } from "@/app/api/users/me/api";
import { PaymentSettingType, StoreSettingType, UserType } from "@/app/types";
import { requestAPI } from "@/lib/requestAPI";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AdminContextType {
  user: UserType | null;
  storeSetting: StoreSettingType | null;
  updateStoreSetting: (data: StoreSettingType) => Promise<void>;
  paymentGateways: PaymentSettingType | null;
  updatePaymentGateways: (data: PaymentSettingType) => Promise<void>;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
  updateProfile: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_PREFIX = "nepali_rudraksh_admin_";

const STORAGE_KEYS = {
  user: `${STORAGE_PREFIX}user`,
  isAuthenticated: `${STORAGE_PREFIX}isAuthenticated`,
  storeSetting: `${STORAGE_PREFIX}storeSetting`,
  paymentGateways: `${STORAGE_PREFIX}paymentGateways`,
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storeSetting, setStoreSetting] = useState<StoreSettingType | null>(
    null
  );
  const [paymentGateways, setPaymentGateways] =
    useState<PaymentSettingType | null>(null);

  const getStoreSetting = async () => {
    try {
      const res = await requestAPI(storeSettingApi.getStoreSetting());
      if (res?.data) {
        setStoreSetting(res.data as StoreSettingType);
      }
    } catch (error) {
      console.error("Failed to get store setting:", error);
    }
  };

  const getPaymentGateways = async () => {
    try {
      const res = await requestAPI(paymentGatewayApi.getPaymentGateway());
      if (res?.data) {
        setPaymentGateways(res.data as PaymentSettingType);
      }
    } catch (error) {
      console.error("Failed to get payment gateways:", error);
    }
  };

  useEffect(() => {
    getStoreSetting();
    getPaymentGateways();
  }, []);

  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem(STORAGE_KEYS.user);
      const savedAuth = sessionStorage.getItem(STORAGE_KEYS.isAuthenticated);
      const savedStoreSetting = sessionStorage.getItem(
        STORAGE_KEYS.storeSetting
      );
      const savedPaymentGateways = sessionStorage.getItem(
        STORAGE_KEYS.paymentGateways
      );

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }
      if (savedStoreSetting) {
        setStoreSetting(JSON.parse(savedStoreSetting));
      }
      if (savedPaymentGateways) {
        setPaymentGateways(JSON.parse(savedPaymentGateways));
      }
    } catch (error) {
      console.error("Failed to restore admin session:", error);
      sessionStorage.removeItem(STORAGE_KEYS.user);
      sessionStorage.removeItem(STORAGE_KEYS.isAuthenticated);
      sessionStorage.removeItem(STORAGE_KEYS.storeSetting);
      sessionStorage.removeItem(STORAGE_KEYS.paymentGateways);

      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    try {
      if (user) {
        sessionStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.user);
      }
    } catch (error) {
      console.error("Failed to save admin user:", error);
    }
  }, [user]);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEYS.isAuthenticated,
        String(isAuthenticated)
      );
    } catch (error) {
      console.error("Failed to save authentication state:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      if (storeSetting) {
        sessionStorage.setItem(
          STORAGE_KEYS.storeSetting,
          JSON.stringify(storeSetting)
        );
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.storeSetting);
      }
    } catch (error) {
      console.error("Failed to save store setting:", error);
    }
  }, [storeSetting]);

  useEffect(() => {
    try {
      if (paymentGateways) {
        sessionStorage.setItem(
          STORAGE_KEYS.paymentGateways,
          JSON.stringify(paymentGateways)
        );
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.paymentGateways);
      }
    } catch (error) {
      console.error("Failed to save payment gateways:", error);
    }
  }, [paymentGateways]);

  const login = async (email: string, pass: string) => {
    try {
      const response = await requestAPI<UserType>(
        loginApi({
          email,
          password: pass,
        })
      );

      if (!response?.data) {
        throw new Error("Login failed");
      }

      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
      setIsAuthenticated(false);

      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.user);
    sessionStorage.removeItem(STORAGE_KEYS.isAuthenticated);
    await requestAPI(logoutApi());
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    try {
      await requestAPI(
        changePasswordApi({
          newPassword: newPass,
          oldPassword: currentPass,
        })
      );
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  };

  const updateProfile = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }) => {
    try {
      await requestAPI(updateUserApi(data));
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  const updateStoreSetting = async (data: StoreSettingType) => {
    try {
      await requestAPI(storeSettingApi.updateStoreSetting(data));
      getStoreSetting();
    } catch (error) {
      console.error("Update store setting error:", error);
      throw error;
    }
  };

  const updatePaymentGateways = async (data: PaymentSettingType) => {
    try {
      await requestAPI(paymentGatewayApi.updatePaymentGateway(data));
      getPaymentGateways();
    } catch (error) {
      console.error("Update payment gateways error:", error);
      throw error;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        storeSetting,
        updateStoreSetting,
        paymentGateways,
        updatePaymentGateways,
        isAuthenticated,
        login,
        logout,
        changePassword,
        updateProfile,
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
