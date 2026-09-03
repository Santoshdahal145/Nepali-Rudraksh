"use client";

import { changePasswordApi } from "@/app/api/auth/change-password/api";
import { forgotPasswordApi } from "@/app/api/auth/forgot-password/api";
import { loginApi } from "@/app/api/auth/login/api";
import { logoutApi } from "@/app/api/auth/logout/api";
import { registerApi } from "@/app/api/auth/register/api";
import { resendOtpApi } from "@/app/api/auth/resend-otp/api";
import { resetPasswordWithOtpApi } from "@/app/api/auth/reset-password/api";
import { verifyOtpRegisterApi } from "@/app/api/auth/verify-otp/api";
import { updateUserApi } from "@/app/api/users/me/api";
import { UserType } from "@/app/types";
import { requestAPI } from "@/lib/requestAPI";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: UserType | null;
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
  verifyEmailOtp: (email: string, otp: string) => Promise<void>;
  resetPasswordWithOtp: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resendOtp: (
    email: string,
    otpType: "PASSWORD_RESET" | "EMAIL_VERIFICATION"
  ) => Promise<void>;
  registerUser: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_PREFIX = "nepali_rudraksh_auth_";

const STORAGE_KEYS = {
  user: `${STORAGE_PREFIX}user`,
  isAuthenticated: `${STORAGE_PREFIX}isAuthenticated`,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem(STORAGE_KEYS.user);
      const savedAuth = sessionStorage.getItem(STORAGE_KEYS.isAuthenticated);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to restore admin session:", error);
      sessionStorage.removeItem(STORAGE_KEYS.user);
      sessionStorage.removeItem(STORAGE_KEYS.isAuthenticated);
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

  const forgotPassword = async (email: string) => {
    try {
      await requestAPI(forgotPasswordApi({ email }));
      router.push(`/reset-password?email=${email}`);
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  };

  const resetPasswordWithOtp = async (
    email: string,
    otp: string,
    password: string
  ) => {
    try {
      await requestAPI(resetPasswordWithOtpApi({ email, otp, password }));
    } catch (error) {
      console.error("Reset password with OTP error:", error);
      throw error;
    }
  };

  const verifyEmailOtp = async (email: string, otp: string) => {
    try {
      const response = await requestAPI<UserType>(
        verifyOtpRegisterApi({ email, otp })
      );
      if (!response?.data) {
        throw new Error("verification failed");
      }
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Verify email OTP error:", error);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const resendOtp = async (
    email: string,
    otpType: "PASSWORD_RESET" | "EMAIL_VERIFICATION"
  ) => {
    try {
      await requestAPI(resendOtpApi({ email, otpType }));
    } catch (error) {
      console.error("Resend OTP error:", error);
      throw error;
    }
  };
  const registerUser = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => {
    try {
      await requestAPI(registerApi(data));
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error("Register user error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        changePassword,
        updateProfile,
        forgotPassword,
        resetPasswordWithOtp,
        verifyEmailOtp,
        resendOtp,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
