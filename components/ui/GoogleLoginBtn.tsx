"use client";

import { useAuth } from "@/providers/AuthContext";
import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleLoginBtn() {
  const { setUserToSessionStorage } = useAuth();
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInBtn"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleCredentialResponse = async (response: any) => {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: response.credential }),
    });

    if (res.ok) {
      const data = await res.json();
      setUserToSessionStorage(data);
      window.location.href = "/";
    } else {
      console.error("Google authentication failed");
    }
  };

  return <div id="googleSignInBtn"></div>;
}
