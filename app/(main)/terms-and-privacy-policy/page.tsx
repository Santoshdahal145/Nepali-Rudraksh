"use client";

import { FileText, HelpCircle, Lock, Mail, Scale } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TermsAndPrivacyPage({
  initialTab = "terms",
}: {
  initialTab?: "terms" | "privacy";
}) {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">(initialTab);

  return (
    <main className="flex-1 pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-xs font-medium text-[#5c3a1e]/70">
          <Link href="/" className="hover:text-[#713f12]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#713f12] font-semibold">
            Legal &amp; Policies
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#713f12] sm:text-xs">
            <Scale className="h-3.5 w-3.5" />
            Nepali Rudraksh Trust &amp; Governance
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#2d1a0e] sm:text-4xl">
            Terms of Service &amp; Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#5c3a1e]/70 max-w-2xl">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            . Our sacred commitment to authenticity, privacy, and spiritual
            integrity.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-8 flex rounded-2xl border border-amber-900/10 bg-white p-1.5 shadow-xs">
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex-1 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "terms"
                ? "bg-[#713f12] text-white shadow-xs"
                : "text-[#5c3a1e]/70 hover:text-[#713f12] hover:bg-amber-50/50"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Terms of Service</span>
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex-1 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "privacy"
                ? "bg-[#713f12] text-white shadow-xs"
                : "text-[#5c3a1e]/70 hover:text-[#713f12] hover:bg-amber-50/50"
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Privacy Policy</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="rounded-3xl border border-amber-900/10 bg-white p-6 sm:p-10 shadow-xs">
          {activeTab === "terms" ? (
            /* TERMS OF SERVICE */
            <div className="space-y-8 text-xs sm:text-sm text-[#5c3a1e]/90 leading-relaxed">
              <section>
                <h2 className="text-lg sm:text-xl font-bold text-[#2d1a0e] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-[#713f12]">
                    1
                  </span>
                  Authenticity Guarantee &amp; Lab Certification
                </h2>
                <p className="mt-2.5">
                  Nepali Rudraksh certifies that 100% of all Rudraksha beads,
                  Siddh Malas, and sacred items offered are naturally harvested
                  from the Himalayan foothills of Nepal (Sankhuwasabha, Bhojpur,
                  and Taplejung districts).
                </p>
                <p className="mt-2">
                  Every collector bead and high-grade Mukhi is accompanied by an
                  individual laboratory certificate and X-Ray analysis verifying
                  natural internal seed chambers (carpel count) without
                  artificial carving, gluing, or doctoring.
                </p>
              </section>

              <section className="border-t border-amber-900/10 pt-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#2d1a0e] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-[#713f12]">
                    2
                  </span>
                  Vedic Consecration (Shuddhikaran &amp; Pran Pratishtha)
                </h2>
                <p className="mt-2.5">
                  Prior to dispatch, beads undergo traditional Vedic
                  purification by authorized priests with sacred mantras at the
                  revered Pashupatinath Temple, Kathmandu. Consecration is
                  provided as a complimentary service to devotees and does not
                  alter the physical or gemological properties of the items.
                </p>
              </section>

              <section className="border-t border-amber-900/10 pt-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#2d1a0e] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-[#713f12]">
                    3
                  </span>
                  Worldwide Shipping, Customs &amp; Delivery
                </h2>
                <p className="mt-2.5">
                  We provide insured global express shipping via DHL Express,
                  FedEx, and EMS Nepal. Orders are typically processed and
                  consecrated within 24–48 hours and delivered within 3–7
                  business days worldwide.
                </p>
                <p className="mt-2">
                  Free shipping is automatically applied on all orders exceeding
                  $150 USD. Customers are responsible for any
                  destination-specific import duties or local customs taxes
                  where applicable.
                </p>
              </section>

              <section className="border-t border-amber-900/10 pt-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#2d1a0e] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-[#713f12]">
                    4
                  </span>
                  Returns, Replacements &amp; Lifetime Authenticity
                </h2>
                <p className="mt-2.5">
                  We offer a{" "}
                  <strong>14-day return and replacement policy</strong> from the
                  date of delivery if your item does not meet your spiritual
                  expectations or arrives damaged in transit.
                </p>
                <p className="mt-2">
                  Furthermore, we provide a{" "}
                  <strong>
                    Lifetime 100% Money-Back Authenticity Guarantee
                  </strong>
                  : If any independent certified gemological laboratory proves
                  any bead non-natural, we will issue a 100% full refund plus
                  all testing costs.
                </p>
              </section>
            </div>
          ) : (
            /* PRIVACY POLICY */
            <div className="space-y-8 text-xs sm:text-sm text-[#5c3a1e]/90 leading-relaxed">
              <section>
                <h2 className="text-lg sm:text-xl font-bold text-[#2d1a0e] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-[#713f12]">
                    1
                  </span>
                  Information We Collect
                </h2>
                <p className="mt-2.5">
                  We collect only the essential information necessary to process
                  your sacred orders and personalize your Vedic consecration:
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1 text-[#5c3a1e]/80">
                  <li>
                    Contact details (Name, Email, Phone number, Shipping
                    address)
                  </li>
                  <li>
                    Optional spiritual details for Vedic Gotra, Nakshatra, and
                    Sankalpa intentions
                  </li>
                  <li>
                    Order transaction history and dispatch tracking identifiers
                  </li>
                </ul>
              </section>

              <section className="border-t border-amber-900/10 pt-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#2d1a0e] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-[#713f12]">
                    2
                  </span>
                  How We Protect &amp; Encrypt Your Data
                </h2>
                <p className="mt-2.5">
                  All payment processing and customer communications are
                  encrypted using bank-grade{" "}
                  <strong>256-bit SSL encryption</strong>. We never store or
                  retain full credit card numbers or banking passwords on our
                  servers.
                </p>
              </section>

              <section className="border-t border-amber-900/10 pt-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#2d1a0e] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-[#713f12]">
                    3
                  </span>
                  Zero Data Selling &amp; Spam-Free Policy
                </h2>
                <p className="mt-2.5">
                  We strictly uphold spiritual confidentiality. We will{" "}
                  <strong>never sell, rent, trade, or share</strong> your
                  personal details or email address with any third-party
                  advertisers or commercial brokers.
                </p>
                <p className="mt-2">
                  You can unsubscribe from rare harvest updates or astrological
                  newsletters at any time with a single click.
                </p>
              </section>

              <section className="border-t border-amber-900/10 pt-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#2d1a0e] flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-[#713f12]">
                    4
                  </span>
                  Your Devotee Rights &amp; Data Deletion
                </h2>
                <p className="mt-2.5">
                  You have the right to request a complete copy of your stored
                  records or request the permanent deletion of your account and
                  personal history at any time by contacting our legal care
                  team.
                </p>
              </section>
            </div>
          )}

          {/* Help & Contact Callout Box */}
          <div className="mt-10 rounded-2xl border border-amber-900/10 bg-[#faf7f2] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-[#422006] flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-[#713f12]" />
                  Have questions about our terms or sacred authenticity?
                </h3>
                <p className="text-xs text-[#5c3a1e]/70 mt-1">
                  Our devotee support and legal team in Kathmandu is ready to
                  assist you.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="mailto:support@nepalirudraksh.com"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#713f12] hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" />
                  support@nepalirudraksh.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
