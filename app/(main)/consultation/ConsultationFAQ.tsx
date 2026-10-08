"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export function ConsultationFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How does Ujwal Bhandari determine which Rudraksha I should wear?",
      answer:
        "Ujwal combines classical Vedic Astrology (Jyotish Shastra) with Chakra bio-resonance. By reviewing your Janma Kundali (ascendant, Moon sign, planetary mahadashas, and afflicted houses like 6th, 8th, or 12th), he identifies which Mukhis will pacify malefic planets while strengthening your ruling benefics without causing energetic imbalance.",
    },
    {
      question: "What if I do not know my exact time or place of birth?",
      answer:
        "Not to worry. If birth charts are unavailable, consultation proceeds based on your dominant life intentions (e.g. wealth, focus, inner peace, health) and specific energetic symptoms. Five Mukhi, Gauri Shankar, and 7/8 Mukhi combinations have universally harmonious vibrations that bless any wearer regardless of birth data.",
    },
    {
      question: "Are your Rudrakshas certified with laboratory X-ray test reports?",
      answer:
        "Yes, absolutely. Every premium bead is tested with internal computerized X-Ray technology to verify internal seed compartments, natural compartments, and absence of synthetic glue or carved lines. You receive an official certificate of authenticity with every order.",
    },
    {
      question: "Will the bead be energized before it reaches me?",
      answer:
        "Yes. Before dispatch, your selected Rudraksha undergoes authentic Pran Pratishtha (Vedic consecration) at Pashupatinath Temple, Kathmandu. The ritual includes Panchamrit Snan, holy Gangajal purification, and chanting of 108 Shiva Beej Mantras in the devotee's name.",
    },
    {
      question: "Is there any obligation to buy after having a consultation?",
      answer:
        "None whatsoever. Ujwal Bhandari offers consultation as a sacred spiritual service to ensure seekers are not misled by fraudulent market claims. You are free to take the astrological advice and decide at your own convenience.",
    },
  ];

  return (
    <section className="rounded-3xl border border-amber-900/10 bg-white p-6 sm:p-10 shadow-lg shadow-amber-950/5">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#713f12]">
            <HelpCircle className="h-4 w-4" />
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#422006]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#5c3a1e]/70">
            Everything you need to know about Vedic Rudraksha selection and energization.
          </p>
        </div>

        <div className="divide-y divide-amber-900/10 rounded-2xl border border-amber-900/10 bg-amber-50/20 overflow-hidden">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-amber-50/60"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-[#422006] pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#713f12] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm leading-relaxed text-[#5c3a1e]/80 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
