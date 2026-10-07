import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Public_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/AuthContext";
import Script from "next/script";
import { PriceProvider } from "@/providers/PriceContext";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

const publicSansHeading = Public_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nepali Rudraksh | Authentic Himalayan Rudraksha Beads",
  description:
    "Direct harvesters and certified purveyors of authentic Himalayan Rudraksha beads. Consecrated with sacred Vedic mantras at Pashupatinath, Nepal.",
  icons: {
    icon: [
      { url: "/nepali-rudraksh-logo.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/nepali-rudraksh-logo.png", type: "image/png" }],
    shortcut: "/nepali-rudraksh-logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        publicSansHeading.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="lazyOnload"
        />
        <ReactQueryProvider>
          <PriceProvider>
            <AuthProvider>
              {children}

              <Toaster position="top-right" richColors />
            </AuthProvider>
          </PriceProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
