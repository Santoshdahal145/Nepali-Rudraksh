"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  CheckCircle2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateConsultation } from "@/hooks/tanstack-hooks/useConsultationRequest";

export function ConsultationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    tob: "",
    pob: "",
    intention: "Career, Wealth & Business Prosperity",
    preferredMode: "WhatsApp Chat / Voice Note",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const createConsultation = useCreateConsultation();

  const intentionsList = [
    "Career, Wealth & Business Prosperity",
    "Health, Longevity & Healing Energy",
    "Spiritual Sadhana, Meditation & Shiva Bhakti",
    "Relief from Planetary Doshas (Shani, Rahu, Ketu)",
    "Marital Harmony & Relationship Union",
    "Academic Focus, Memory & Student Success",
    "General Astrological Guidance & Recommendation",
  ];

  const modesList = [
    "WhatsApp Chat / Voice Note (Recommended)",
    "WhatsApp Video Call (15 Minutes)",
    "Direct Phone Call",
    "Detailed Vedic Email Report",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      toast.error("Please enter your name, email, and phone number.");
      return;
    }

    try {
      await createConsultation.mutateAsync({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        dob: formData.dob.trim() || null,
        tob: formData.tob.trim() || null,
        pob: formData.pob.trim() || null,
        intention: formData.intention,
        preferredMode: formData.preferredMode,
        notes: formData.notes.trim() || null,
      });
      setSubmitted(true);
      toast.success(
        "Consultation request submitted! Ujwal Bhandari will reach out shortly.",
      );
    } catch (err) {
      console.error("Consultation submit error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to submit consultation request. Please try again.",
      );
    }
  };

  const whatsappDirectUrl = `https://wa.me/9779801234567?text=${encodeURIComponent(
    `Namaste Ujwal ji, my name is ${formData.fullName || "Devotee"}. I submitted a consultation request for ${formData.intention}. Looking forward to connecting!`,
  )}`;

  return (
    <section className="rounded-3xl border border-amber-900/15 bg-white p-6 sm:p-10 shadow-xl shadow-amber-950/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/70 border border-amber-900/15 px-3 py-1 text-xs font-bold text-[#713f12]">
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            Online Vedic Consultation Form
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#422006]">
            Request a Consultation with Ujwal Bhandari
          </h2>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/75 max-w-xl mx-auto">
            Provide your birth details and questions below. Ujwal will review
            your planetary configuration and suggest the exact Mukhi beads
            suited for you.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 sm:p-10 text-center space-y-4 animate-in fade-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
              Blessings, {formData.fullName}!
            </h3>

            <p className="text-xs sm:text-sm text-emerald-900/80 max-w-lg mx-auto leading-relaxed">
              Your consultation request has been delivered directly to Ujwal
              Bhandari&apos;s desk. You will receive an astrological evaluation
              and direct contact via {formData.preferredMode}.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="h-11 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm gap-2">
                  <MessageCircle className="h-4 w-4 fill-white" />
                  Fast Track on WhatsApp Now
                </Button>
              </a>

              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    dob: "",
                    tob: "",
                    pob: "",
                    intention: "Career, Wealth & Business Prosperity",
                    preferredMode: "WhatsApp Chat / Voice Note",
                    notes: "",
                  });
                }}
                className="h-11 border-amber-900/20 text-xs sm:text-sm font-semibold text-[#713f12]"
              >
                Submit Another Request
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Contact Essentials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5c3a1e] mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-[#5c3a1e]/40" />
                  <Input
                    required
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="pl-9 h-11 text-xs sm:text-sm border-amber-900/20 focus-visible:ring-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c3a1e] mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#5c3a1e]/40" />
                  <Input
                    required
                    type="email"
                    placeholder="e.g. aarav@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-9 h-11 text-xs sm:text-sm border-amber-900/20 focus-visible:ring-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c3a1e] mb-1.5">
                  WhatsApp / Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-[#5c3a1e]/40" />
                  <Input
                    required
                    type="tel"
                    placeholder="+977 980-0000000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="pl-9 h-11 text-xs sm:text-sm border-amber-900/20 focus-visible:ring-amber-700"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Birth Details for Astrological Kundali */}
            <div className="rounded-2xl border border-amber-900/10 bg-amber-50/40 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#422006] flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#713f12]" />
                  Birth Information (For Janma Kundali Alignment)
                </span>
                <span className="text-[10px] text-[#5c3a1e]/60">
                  Optional if birth time is unknown
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5c3a1e] mb-1">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className="h-10 text-xs border-amber-900/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5c3a1e] mb-1">
                    Time of Birth
                  </label>
                  <Input
                    type="time"
                    value={formData.tob}
                    onChange={(e) =>
                      setFormData({ ...formData, tob: e.target.value })
                    }
                    className="h-10 text-xs border-amber-900/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5c3a1e] mb-1">
                    Place of Birth (City, Country)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Kathmandu, Nepal"
                    value={formData.pob}
                    onChange={(e) =>
                      setFormData({ ...formData, pob: e.target.value })
                    }
                    className="h-10 text-xs border-amber-900/20 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Life Intention & Preferred Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5c3a1e] mb-1.5">
                  Primary Life Intention / Need
                </label>
                <select
                  value={formData.intention}
                  onChange={(e) =>
                    setFormData({ ...formData, intention: e.target.value })
                  }
                  className="w-full h-11 rounded-lg border border-amber-900/20 bg-white px-3 text-xs sm:text-sm text-[#422006] focus:border-amber-700 focus:outline-hidden"
                >
                  {intentionsList.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c3a1e] mb-1.5">
                  Preferred Consultation Mode
                </label>
                <select
                  value={formData.preferredMode}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredMode: e.target.value })
                  }
                  className="w-full h-11 rounded-lg border border-amber-900/20 bg-white px-3 text-xs sm:text-sm text-[#422006] focus:border-amber-700 focus:outline-hidden"
                >
                  {modesList.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Notes / Questions */}
            <div>
              <label className="block text-xs font-bold text-[#5c3a1e] mb-1.5">
                Questions or Specific Concerns for Ujwal Bhandari
              </label>
              <textarea
                rows={3}
                placeholder="Share any specific problems (e.g., career blockages, health, spiritual practices, or beads you are already wearing)..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full rounded-xl border border-amber-900/20 bg-white p-3 text-xs sm:text-sm text-[#422006] placeholder:text-[#5c3a1e]/40 focus:border-amber-700 focus:outline-hidden"
              />
            </div>

            {/* Privacy note & Submit CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-[11px] text-[#5c3a1e]/70 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                100% confidential. Your birth details are strictly protected.
              </p>

              <Button
                type="submit"
                disabled={createConsultation.isPending}
                className="w-full sm:w-auto h-12 px-8 bg-[#713f12] hover:bg-[#5c330e] text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-950/20 gap-2 transition-all active:scale-[0.99]"
              >
                {createConsultation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Request Sacred Consultation
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
