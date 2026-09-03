import { Footer, NavBar, TopMostHeader } from "@/layout";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md">
        <TopMostHeader />
        <NavBar />
      </header>
      {children}
      <Footer />
    </>
  );
}
