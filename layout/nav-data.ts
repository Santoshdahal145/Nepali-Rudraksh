// Mega menu catalog for "Shop" dropdown and mobile catalog
export const shopMegaMenu = {
  categories: [
    {
      name: "Individual Rudraksha",
      desc: "Natural 1 to 21 Mukhi single beads",
      href: "/all-products?type=INDIVIDUAL_RUDRAKSHA",
      badge: "Popular",
      emoji: "🌿",
    },
    {
      name: "Sacred Japa Malas",
      desc: "Hand-knotted 108+1 meditation malas",
      href: "/all-products?type=RUDRAKSHA_MALA",
      badge: "Bestseller",
      emoji: "📿",
    },
    {
      name: "Rudraksha Bracelets",
      desc: "Daily protection & sterling silver",
      href: "/all-products?search=bracelet",
      emoji: "⚡",
    },
    {
      name: "Rare Collector Beads",
      desc: "Gauri Shankar, Trijuti & 1 Mukhi",
      href: "/all-products?search=collector",
      badge: "Rare",
      emoji: "👑",
    },
  ],
  popularMukhis: [
    {
      name: "1 Mukhi (Half Moon)",
      desc: "Supreme consciousness & Shiva",
      href: "/all-products?mukhi=1",
      emoji: "🌙",
    },
    {
      name: "5 Mukhi (Panchamukhi)",
      desc: "Health, peace & daily japa",
      href: "/all-products?mukhi=5",
      emoji: "🌿",
    },
    {
      name: "7 Mukhi (Mahalakshmi)",
      desc: "Wealth, abundance & prosperity",
      href: "/all-products?mukhi=7",
      emoji: "✨",
    },
    {
      name: "8 Mukhi (Lord Ganesha)",
      desc: "Removes obstacles & brings success",
      href: "/all-products?mukhi=8",
      emoji: "🐘",
    },
    {
      name: "11 Mukhi (Hanuman)",
      desc: "Courage, protection & willpower",
      href: "/all-products?mukhi=11",
      emoji: "🛡️",
    },
    {
      name: "14 Mukhi (Devamani)",
      desc: "Awakens Ajna intuition chakra",
      href: "/all-products?mukhi=14",
      emoji: "🔱",
    },
  ],
  terroirs: [
    {
      name: "Sankhuwasabha, Nepal",
      desc: "Prime high-altitude forest harvest",
      href: "/all-products?search=sankhuwasabha",
      emoji: "🏔️",
    },
    {
      name: "Bhojpur Wild Terroir",
      desc: "Ancient natural mountain growth",
      href: "/all-products?search=bhojpur",
      emoji: "🌾",
    },
    {
      name: "Pashupatinath Consecrated",
      desc: "Blessed with holy Gangajal & Vedic mantras",
      href: "/all-products",
      emoji: "🕉️",
    },
    {
      name: "100% Lab Authenticated",
      desc: "Certified with X-ray clarity inspection",
      href: "/all-products",
      emoji: "📜",
    },
  ],
};

export interface SearchableProduct {
  id: string;
  name: string;
  mukhi: string;
  price: string;
  category: string;
  emoji: string;
  deity: string;
}

export const searchableProducts: SearchableProduct[] = [
  {
    id: "1",
    name: "1 Mukhi Half Moon Rudraksha",
    mukhi: "1 Mukhi",
    price: "$499",
    category: "Collector Rare",
    emoji: "🌙",
    deity: "Lord Shiva",
  },
  {
    id: "2",
    name: "5 Mukhi Nepal Siddh Mala (108+1)",
    mukhi: "5 Mukhi",
    price: "$149",
    category: "Japa Mala",
    emoji: "📿",
    deity: "Kalagni Rudra",
  },
  {
    id: "3",
    name: "7 Mukhi Mahalakshmi Rudraksha",
    mukhi: "7 Mukhi",
    price: "$189",
    category: "Sacred Mukhi",
    emoji: "✨",
    deity: "Goddess Mahalakshmi",
  },
  {
    id: "4",
    name: "14 Mukhi Devamani Rudraksha",
    mukhi: "14 Mukhi",
    price: "$1299",
    category: "Collector Rare",
    emoji: "🔱",
    deity: "Lord Hanuman & Shiva",
  },
  {
    id: "5",
    name: "Sacred Rudraksha Silver Bracelet",
    mukhi: "5 Mukhi",
    price: "$89",
    category: "Silver Ornament",
    emoji: "⚡",
    deity: "Lord Shiva",
  },
  {
    id: "6",
    name: "Gauri Shankar Sacred Divine Bead",
    mukhi: "Twin Bead",
    price: "$649",
    category: "Sacred Union",
    emoji: "💫",
    deity: "Shiva & Parvati",
  },
  {
    id: "7",
    name: "8 Mukhi Lord Ganesha Rudraksha",
    mukhi: "8 Mukhi",
    price: "$219",
    category: "Sacred Mukhi",
    emoji: "🐘",
    deity: "Lord Ganesha",
  },
  {
    id: "8",
    name: "11 Mukhi Hanuman Rudraksha",
    mukhi: "11 Mukhi",
    price: "$389",
    category: "Sacred Mukhi",
    emoji: "🛡️",
    deity: "11 Rudras / Hanuman",
  },
];

export const popularSearches = [
  "1 Mukhi",
  "Siddh Mala 108",
  "7 Mukhi Wealth",
  "Gauri Shankar",
  "Silver Bracelet",
  "Hanuman 11 Mukhi",
];
