"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminProvider } from "./data/AdminContext";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";
import { Sheet, SheetContent } from "@/components/ui/sheet";

function AdminPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on the /admin login root page, render without sidebar shell
  const isLoginPage = pathname === "/admin";

  if (isLoginPage) {
    return <main className="min-h-screen bg-[#faf7f2]">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-[#faf7f2] text-[#422006]">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block lg:w-72 lg:shrink-0 sticky top-0 h-screen">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-[#fdfbf7]">
          <AdminSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminPortalShell>{children}</AdminPortalShell>
    </AdminProvider>
  );
}
