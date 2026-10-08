"use client";

import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export function ContactCards() {
  const whatsappNumber = "+977 980-1234567";
  const rawWhatsapp = "+9779801234567".replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(
    "Namaste Ujwal ji, I would like to seek personal Rudraksha & Janma Kundali consultation.",
  )}`;

  const email = "founder@nepalirudraksh.com";
  const phone = "+977 (1) 449-7800";
  const mobile = "+977 980-1234567";
  const address = "Pashupatinath Marga, Gaushala, Kathmandu 44600, Nepal";

  return (
    <section className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#713f12]">
          Direct Reach
        </span>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-[#422006]">
          How to Contact Ujwal Bhandari
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#5c3a1e]/75">
          Choose your preferred medium. Ujwal and his Vedic consultation team
          typically respond within 1–2 hours during temple business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* 1. WhatsApp Direct (Featured) */}
        <div className="relative rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-50/50 to-white p-5 sm:p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute top-4 right-4">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-md shadow-emerald-500/20">
            <MessageCircle className="h-6 w-6 fill-white" />
          </div>

          <h3 className="mt-4 text-base font-bold text-[#422006]">
            WhatsApp Direct
          </h3>
          <p className="mt-1 text-xs text-[#5c3a1e]/75">
            Fastest for audio notes, Kundali photos, and instant replies.
          </p>

          <div className="mt-4 pt-3 border-t border-emerald-900/10">
            <p className="text-xs font-bold text-emerald-950 font-mono">
              {whatsappNumber}
            </p>
            <p className="mt-0.5 text-[10px] text-emerald-700 font-semibold">
              Online • Fast Response
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:underline"
          >
            Chat with Ujwal
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* 2. Direct Email */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-5 sm:p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-[#713f12]">
            <Mail className="h-6 w-6" />
          </div>

          <h3 className="mt-4 text-base font-bold text-[#422006]">
            Direct Email
          </h3>
          <p className="mt-1 text-xs text-[#5c3a1e]/75">
            Best for detailed birth charts, family inquiries, and custom mala
            designs.
          </p>

          <div className="mt-4 pt-3 border-t border-amber-900/10">
            <p className="text-xs font-bold text-[#422006] truncate">{email}</p>
            <p className="mt-0.5 text-[10px] text-[#5c3a1e]/60">
              Personal Founder Inbox
            </p>
          </div>

          <a
            href={`mailto:${email}?subject=Rudraksha%20Consultation%20Inquiry%20-%20Nepali%20Rudraksh`}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#713f12] hover:text-[#5c330e] hover:underline"
          >
            Send Email
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* 3. Direct Phone Calls */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-5 sm:p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-[#713f12]">
            <Phone className="h-6 w-6" />
          </div>

          <h3 className="mt-4 text-base font-bold text-[#422006]">
            Phone Consultation
          </h3>
          <p className="mt-1 text-xs text-[#5c3a1e]/75">
            Direct audio consultation for in-depth questions and Vedic advice.
          </p>

          <div className="mt-4 pt-3 border-t border-amber-900/10">
            <p className="text-xs font-bold text-[#422006] font-mono">
              {phone}
            </p>
            <p className="mt-0.5 text-[10px] text-[#5c3a1e]/60 font-mono">
              Mobile: {mobile}
            </p>
          </div>

          <a
            href={`tel:${rawWhatsapp}`}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#713f12] hover:text-[#5c330e] hover:underline"
          >
            Call Desk
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
