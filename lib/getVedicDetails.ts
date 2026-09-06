// Vedic deity and mantra mapping helper
export function getVedicDetails(mukhi?: number | null) {
  switch (mukhi) {
    case 1:
      return {
        deity: "Lord Shiva (Paramshiva)",
        planet: "Sun (Surya)",
        chakra: "Sahasrara (Crown Chakra)",
        mantra: "ॐ ह्रीं नमः (Om Hreem Namah)",
        benefits:
          "Supreme consciousness, spiritual enlightenment, leadership and liberation.",
      };
    case 2:
      return {
        deity: "Ardhanarishwara (Shiva & Parvati)",
        planet: "Moon (Chandra)",
        chakra: "Swadhisthana (Sacral Chakra)",
        mantra: "ॐ नमः (Om Namah)",
        benefits:
          "Harmonious relationships, emotional calm, unity and marital bliss.",
      };
    case 3:
      return {
        deity: "Lord Agni (Fire God)",
        planet: "Mars (Mangal)",
        chakra: "Manipura (Solar Plexus Chakra)",
        mantra: "ॐ क्लीं नमः (Om Kleem Namah)",
        benefits:
          "Cleanses past negative karma, enhances courage, self-esteem and vitality.",
      };
    case 4:
      return {
        deity: "Lord Brahma (Creator)",
        planet: "Mercury (Budha)",
        chakra: "Vishuddha (Throat Chakra)",
        mantra: "ॐ ह्रीं नमः (Om Hreem Namah)",
        benefits:
          "Intellect, creative eloquence, memory power and academic brilliance.",
      };
    case 5:
      return {
        deity: "Kalagni Rudra (Lord Shiva)",
        planet: "Jupiter (Brihaspati / Guru)",
        chakra: "Vishuddha (Throat Chakra)",
        mantra: "ॐ ह्रीं नमः (Om Hreem Namah)",
        benefits:
          "Peace of mind, mental equanimity, good health, and spiritual alignment.",
      };
    case 6:
      return {
        deity: "Lord Kartikeya (Skanda)",
        planet: "Venus (Shukra)",
        chakra: "Swadhisthana (Sacral Chakra)",
        mantra: "ॐ ह्रीं हुं नमः (Om Hreem Hum Namah)",
        benefits:
          "Courage, emotional balance, willpower, and artistic magnetism.",
      };
    case 7:
      return {
        deity: "Goddess Mahalakshmi",
        planet: "Saturn (Shani)",
        chakra: "Anahata (Heart Chakra)",
        mantra: "ॐ हुं नमः (Om Hum Namah)",
        benefits:
          "Prosperity, removal of financial distress, luck, and abundance.",
      };
    case 8:
      return {
        deity: "Lord Ganesha (Vighnaharta)",
        planet: "Rahu",
        chakra: "Muladhara (Root Chakra)",
        mantra: "ॐ हुं नमः (Om Hum Namah)",
        benefits:
          "Removes hurdles and obstacles, grants wisdom and business triumph.",
      };
    case 9:
      return {
        deity: "Maa Durga (Navadurga)",
        planet: "Ketu",
        chakra: "Ajna (Third Eye Chakra)",
        mantra: "ॐ ह्रीं हुं नमः (Om Hreem Hum Namah)",
        benefits:
          "Fearlessness, dynamic energy, protection against evil spirits and curses.",
      };
    case 10:
      return {
        deity: "Lord Vishnu (Dashavatara)",
        planet: "All Nine Planets",
        chakra: "Sahasrara (Crown Chakra)",
        mantra: "ॐ ह्रीं नमः (Om Hreem Namah)",
        benefits:
          "Supreme protection, pacifies malefic planetary doshas, brings serenity.",
      };
    case 11:
      return {
        deity: "Lord Hanuman & 11 Rudras",
        planet: "Mars & Jupiter",
        chakra: "Ajna (Third Eye Chakra)",
        mantra: "ॐ श्रीं नमः (Om Shreem Namah)",
        benefits:
          "Physical fortitude, fearless intellect, yogic discipline and triumph over adversaries.",
      };
    case 12:
      return {
        deity: "Lord Surya (Sun God)",
        planet: "Sun (Surya)",
        chakra: "Anahata (Heart Chakra)",
        mantra: "ॐ क्रौं क्षौं रौ नमः (Om Kroum Kshowm Rowm Namah)",
        benefits:
          "Radiance, administrative power, fame, charisma and physical vitality.",
      };
    case 14:
      return {
        deity: "Lord Shiva & Hanuman",
        planet: "Saturn & Mars",
        chakra: "Ajna (Third Eye Chakra)",
        mantra: "ॐ नमः (Om Namah)",
        benefits:
          "Awakens the Sixth Sense (intuitive power), highly coveted divine collector bead.",
      };
    default:
      return {
        deity: "Lord Shiva (Maha Rudra)",
        planet: "All Celestial Planets",
        chakra: "Universal Shiva Consciousness",
        mantra: "ॐ नमः शिवाय (Om Namah Shivaya)",
        benefits:
          "Spiritual protection, inner peace, cosmic connection, and auspicious energy.",
      };
  }
}