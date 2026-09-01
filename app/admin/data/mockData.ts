export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Customer" | "Admin" | "Wholesale";
  status: "Active" | "Blocked" | "VIP";
  avatar: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  lastActive: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  notes?: string;
  spiritualFocus?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: "mukhi" | "mala" | "bracelet" | "collector";
  mukhiType: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  stock: number;
  sku: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  emoji: string;
  deity: string;
  planet?: string;
  origin: string;
  chakra?: string;
  description: string;
  benefits: string[];
  inStock: boolean;
  isFeatured: boolean;
  certNumber: string;
  createdAt: string;
  salesCount: number;
}

export interface AdminOrderItem {
  productId: string;
  name: string;
  mukhiType: string;
  emoji: string;
  price: number;
  quantity: number;
  total: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  status: "Pending" | "Processing" | "Blessed" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  paymentMethod: "eSewa" | "Khalti" | "Credit Card" | "Cash on Delivery";
  subtotal: number;
  consecrationFee: number;
  shippingFee: number;
  discount: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  sankalpDetails?: {
    devoteeName: string;
    gotra: string;
    birthStar: string;
    specialPrayers: string;
  };
  tracking?: {
    carrier: string;
    trackingNumber: string;
    estimatedDelivery: string;
  };
  items: AdminOrderItem[];
}

export interface HomeControlData {
  announcementBar: {
    enabled: boolean;
    text: string;
    badge: string;
  };
  heroSection: {
    headline: string;
    subheadline: string;
    highlightText: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    badgeText: string;
  };
  featuredProductIds: string[];
  offers: {
    id: string;
    title: string;
    code: string;
    discountPercent: number;
    description: string;
    expiresAt: string;
    isActive: boolean;
    badge: string;
    bgGradient: string;
  }[];
  testimonials: {
    id: string;
    name: string;
    role: string;
    location: string;
    comment: string;
    rating: number;
    isApproved: boolean;
    avatar: string;
  }[];
}

export interface AdminSettingsData {
  adminProfile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    twoFactorEnabled: boolean;
  };
  storeConfig: {
    storeName: string;
    supportEmail: string;
    currency: string;
    currencySymbol: string;
    defaultConsecrationFee: number;
    freeShippingThreshold: number;
    standardShippingFee: number;
    templeOrigin: string;
  };
  notifications: {
    emailOnNewOrder: boolean;
    emailOnLowStock: boolean;
    dailyDigest: boolean;
    smsAlerts: boolean;
  };
  paymentGateways: {
    esewa: boolean;
    khalti: boolean;
    stripe: boolean;
    cod: boolean;
  };
}

// Initial Mock Datasets
export const initialUsers: AdminUser[] = [
  {
    id: "usr_1",
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    phone: "+977 9841234567",
    role: "Customer",
    status: "VIP",
    avatar: "AS",
    joinedDate: "2025-01-14",
    totalOrders: 6,
    totalSpent: 1890,
    lastActive: "2026-08-28 14:32",
    spiritualFocus: "Shiva Sadhana & Daily Japa Meditation",
    address: {
      street: "Gairidhara Road, House #42",
      city: "Kathmandu",
      state: "Bagmati",
      country: "Nepal",
      postalCode: "44600",
    },
    notes: "High-value collector. Preferred delivery on auspicious Monday timings.",
  },
  {
    id: "usr_2",
    name: "Priya Nair",
    email: "priya.nair@spiritualcoach.in",
    phone: "+91 9820123456",
    role: "Customer",
    status: "Active",
    avatar: "PN",
    joinedDate: "2025-03-02",
    totalOrders: 4,
    totalSpent: 920,
    lastActive: "2026-08-30 09:15",
    spiritualFocus: "Chakra Awakening & Prosperity",
    address: {
      street: "Indiranagar 100ft Road",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      postalCode: "560038",
    },
    notes: "Frequently orders Gauri Shankar & 7 Mukhi beads.",
  },
  {
    id: "usr_3",
    name: "Dr. Vikram Joshi",
    email: "v.joshi@himalayanwellness.org",
    phone: "+977 9801987654",
    role: "Wholesale",
    status: "Active",
    avatar: "VJ",
    joinedDate: "2024-11-20",
    totalOrders: 14,
    totalSpent: 7450,
    lastActive: "2026-08-31 11:00",
    spiritualFocus: "Ayurvedic & Crystal Energy Research",
    address: {
      street: "Lakeside Street 6",
      city: "Pokhara",
      state: "Gandaki",
      country: "Nepal",
      postalCode: "33700",
    },
    notes: "Wholesale partner for Himalayan retreat center.",
  },
  {
    id: "usr_4",
    name: "Michael Sterling",
    email: "m.sterling@ukyoga.co.uk",
    phone: "+44 7700 900123",
    role: "Customer",
    status: "Active",
    avatar: "MS",
    joinedDate: "2025-06-18",
    totalOrders: 2,
    totalSpent: 1398,
    lastActive: "2026-08-25 18:20",
    spiritualFocus: "14 Mukhi Ajna Intuition",
    address: {
      street: "24 Kensington Garden Mews",
      city: "London",
      state: "Greater London",
      country: "United Kingdom",
      postalCode: "W2 4BA",
    },
  },
  {
    id: "usr_5",
    name: "Devendra Thapa",
    email: "devendra.thapa.temp@outlook.com",
    phone: "+977 9811223344",
    role: "Customer",
    status: "Blocked",
    avatar: "DT",
    joinedDate: "2025-07-09",
    totalOrders: 1,
    totalSpent: 0,
    lastActive: "2025-08-10 12:00",
    address: {
      street: "Kupondole Height",
      city: "Lalitpur",
      state: "Bagmati",
      country: "Nepal",
      postalCode: "44700",
    },
    notes: "Repeated fraudulent COD orders. Account restricted by Admin.",
  },
  {
    id: "usr_6",
    name: "Sunita Acharya",
    email: "sunita.acharya@gmail.com",
    phone: "+977 9851098765",
    role: "Customer",
    status: "Active",
    avatar: "SA",
    joinedDate: "2025-08-01",
    totalOrders: 3,
    totalSpent: 645,
    lastActive: "2026-08-31 08:45",
    spiritualFocus: "Family Harmony & Child Protection",
    address: {
      street: "Baluwatar Main Road",
      city: "Kathmandu",
      state: "Bagmati",
      country: "Nepal",
      postalCode: "44600",
    },
  },
];

export const initialProducts: AdminProduct[] = [
  {
    id: "1",
    name: "1 Mukhi Half Moon Rudraksha",
    category: "collector",
    mukhiType: "1 Mukhi",
    price: 499,
    originalPrice: 599,
    costPrice: 280,
    stock: 12,
    sku: "RUD-01M-COL",
    rating: 5.0,
    reviewsCount: 128,
    badge: "Rare & Sacred",
    emoji: "🌙",
    deity: "Lord Shiva (Supreme Consciousness)",
    planet: "Sun (Surya)",
    origin: "Sankhuwasabha, Nepal",
    chakra: "Sahasrara (Crown)",
    description: "Supreme consciousness & liberation. Blessed from Pashupatinath Temple. Highly energized for meditation and divine connection.",
    benefits: ["Sahasrara Crown Chakra Awakening", "Enhances supreme concentration", "Destroys past negative karmas", "Brings inner peace and detachment"],
    inStock: true,
    isFeatured: true,
    certNumber: "CERT-NP-2026-00189",
    createdAt: "2025-01-10",
    salesCount: 64,
  },
  {
    id: "2",
    name: "5 Mukhi Nepal Siddh Mala (108+1)",
    category: "mala",
    mukhiType: "5 Mukhi",
    price: 149,
    originalPrice: 189,
    costPrice: 65,
    stock: 45,
    sku: "RUD-05M-MAL",
    rating: 4.9,
    reviewsCount: 412,
    badge: "Bestseller",
    emoji: "📿",
    deity: "Kalagni Rudra",
    planet: "Jupiter (Brihaspati)",
    origin: "Bhojpur, Eastern Nepal",
    chakra: "Vishuddha (Throat)",
    description: "Hand-knotted with silk thread. Ideal for daily japa, peace of mind, health, blood pressure balance, and spiritual alignment.",
    benefits: ["Maintains optimal blood pressure", "Eliminates stress and mental clutter", "Ideal for daily mantra japa", "Protects against untimely death"],
    inStock: true,
    isFeatured: true,
    certNumber: "CERT-NP-2026-00342",
    createdAt: "2025-01-15",
    salesCount: 280,
  },
  {
    id: "3",
    name: "7 Mukhi Mahalakshmi Rudraksha",
    category: "mukhi",
    mukhiType: "7 Mukhi",
    price: 189,
    originalPrice: 220,
    costPrice: 85,
    stock: 28,
    sku: "RUD-07M-MUK",
    rating: 4.9,
    reviewsCount: 235,
    badge: "Prosperity",
    emoji: "✨",
    deity: "Goddess Mahalakshmi",
    planet: "Venus (Shukra)",
    origin: "Taplejung, Nepal",
    chakra: "Anahata (Heart)",
    description: "Attracts wealth, business success, abundance, and removes negative financial blocks and distress.",
    benefits: ["Bestows continuous wealth and fortune", "Overcomes sudden financial losses", "Opens doors for new career opportunities", "Blesses with luxury and stability"],
    inStock: true,
    isFeatured: true,
    certNumber: "CERT-NP-2026-00411",
    createdAt: "2025-02-01",
    salesCount: 154,
  },
  {
    id: "4",
    name: "14 Mukhi Devamani Rudraksha",
    category: "collector",
    mukhiType: "14 Mukhi",
    price: 1299,
    originalPrice: 1450,
    costPrice: 720,
    stock: 4,
    sku: "RUD-14M-COL",
    rating: 5.0,
    reviewsCount: 64,
    badge: "Most Rare",
    emoji: "🔱",
    deity: "Lord Hanuman & Shiva",
    planet: "Saturn & Mars (Shani/Mangal)",
    origin: "Dingla, Sankhuwasabha",
    chakra: "Ajna (Third Eye)",
    description: "Awakens the Sixth Sense (Ajna Chakra) and intuition. Extremely sought-after collector bead representing supreme divine foresight.",
    benefits: ["Awakens intuition and gut feelings", "Guarantees success in high-risk decisions", "Neutralizes Sade Sati Shani dosha", "Ultimate spiritual shield"],
    inStock: true,
    isFeatured: true,
    certNumber: "CERT-NP-2026-00088",
    createdAt: "2025-02-12",
    salesCount: 18,
  },
  {
    id: "5",
    name: "Sacred Rudraksha Silver Bracelet",
    category: "bracelet",
    mukhiType: "5 Mukhi",
    price: 89,
    originalPrice: 110,
    costPrice: 38,
    stock: 35,
    sku: "RUD-05M-BRC",
    rating: 4.8,
    reviewsCount: 180,
    badge: "Handcrafted",
    emoji: "⚡",
    deity: "Lord Shiva",
    planet: "Jupiter",
    origin: "Patan Artisans, Nepal",
    chakra: "Manipura (Solar Plexus)",
    description: "925 Pure Sterling Silver handcrafted with 5 Mukhi Nepali beads by master Newari artisans in Kathmandu valley.",
    benefits: ["Shields aura from evil eye and negativity", "Stylish luxury sacred daily wear", "Certified 925 sterling silver hallmarked", "Energized with Vedic Mahamrityunjaya chants"],
    inStock: true,
    isFeatured: false,
    certNumber: "CERT-NP-2026-00567",
    createdAt: "2025-03-01",
    salesCount: 112,
  },
  {
    id: "6",
    name: "Gauri Shankar Sacred Divine Bead",
    category: "collector",
    mukhiType: "Twin Bead",
    price: 649,
    originalPrice: 750,
    costPrice: 340,
    stock: 7,
    sku: "RUD-GSH-COL",
    rating: 5.0,
    reviewsCount: 92,
    badge: "Divine Union",
    emoji: "💫",
    deity: "Lord Shiva & Goddess Parvati",
    planet: "Moon & Sun",
    origin: "Dhankuta, Nepal",
    chakra: "Hridaya (Spiritual Heart)",
    description: "Two naturally joined Rudraksha beads representing the divine union of Shiva and Shakti. Harmonizes relationships and marriage.",
    benefits: ["Brings eternal love and marital harmony", "Attracts the ideal spiritual life partner", "Harmonizes parent-child relationships", "Cultivates unconditional divine peace"],
    inStock: true,
    isFeatured: true,
    certNumber: "CERT-NP-2026-00102",
    createdAt: "2025-03-10",
    salesCount: 39,
  },
  {
    id: "7",
    name: "8 Mukhi Lord Ganesha Rudraksha",
    category: "mukhi",
    mukhiType: "8 Mukhi",
    price: 219,
    originalPrice: 260,
    costPrice: 95,
    stock: 19,
    sku: "RUD-08M-MUK",
    rating: 4.9,
    reviewsCount: 145,
    badge: "Vighnaharta",
    emoji: "🐘",
    deity: "Lord Ganesha",
    planet: "Rahu",
    origin: "Bhojpur, Nepal",
    chakra: "Muladhara (Root)",
    description: "Removes all obstacles, provides wisdom, intellect, grounding and guaranteed success in new ventures and investments.",
    benefits: ["Removes unforeseen hurdles in life", "Overcomes malefic effects of Rahu", "Boosts sharp intellect and writing skill", "Blesses with swift progress in business"],
    inStock: true,
    isFeatured: false,
    certNumber: "CERT-NP-2026-00298",
    createdAt: "2025-03-15",
    salesCount: 88,
  },
  {
    id: "8",
    name: "11 Mukhi Hanuman Rudraksha",
    category: "mukhi",
    mukhiType: "11 Mukhi",
    price: 389,
    originalPrice: 440,
    costPrice: 190,
    stock: 2,
    sku: "RUD-11M-MUK",
    rating: 5.0,
    reviewsCount: 88,
    badge: "Fearlessness",
    emoji: "🛡️",
    deity: "11 Rudras / Lord Hanuman",
    planet: "Mars",
    origin: "Sankhuwasabha, Nepal",
    chakra: "Manipura & Vishuddha",
    description: "Grants supreme courage, physical stamina, mental clarity, oratory power, and victory over fears and adversaries.",
    benefits: ["Destroys fears, phobias and anxiety", "Enhances physical vitality and courage", "Protects against accident vulnerabilities", "Blesses speaker with magnetic voice"],
    inStock: true,
    isFeatured: false,
    certNumber: "CERT-NP-2026-00330",
    createdAt: "2025-04-02",
    salesCount: 42,
  },
];

export const initialOrders: AdminOrder[] = [
  {
    id: "ord_1",
    orderNumber: "NR-8941",
    userId: "usr_1",
    customerName: "Aarav Sharma",
    customerEmail: "aarav.sharma@gmail.com",
    customerPhone: "+977 9841234567",
    date: "2026-08-30 16:45",
    status: "Processing",
    paymentStatus: "Paid",
    paymentMethod: "eSewa",
    subtotal: 649,
    consecrationFee: 0,
    shippingFee: 0,
    discount: 50,
    total: 599,
    shippingAddress: {
      street: "Gairidhara Road, House #42",
      city: "Kathmandu",
      state: "Bagmati",
      country: "Nepal",
      postalCode: "44600",
    },
    sankalpDetails: {
      devoteeName: "Aarav Sharma",
      gotra: "Kashyap",
      birthStar: "Rohini",
      specialPrayers: "Blessing for business expansion and family harmony.",
    },
    tracking: {
      carrier: "Nepal Express Logistics",
      trackingNumber: "NEX-982173",
      estimatedDelivery: "2026-09-02",
    },
    items: [
      {
        productId: "6",
        name: "Gauri Shankar Sacred Divine Bead",
        mukhiType: "Twin Bead",
        emoji: "💫",
        price: 649,
        quantity: 1,
        total: 649,
      },
    ],
  },
  {
    id: "ord_2",
    orderNumber: "NR-8940",
    userId: "usr_2",
    customerName: "Priya Nair",
    customerEmail: "priya.nair@spiritualcoach.in",
    customerPhone: "+91 9820123456",
    date: "2026-08-30 11:20",
    status: "Shipped",
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    subtotal: 338,
    consecrationFee: 25,
    shippingFee: 20,
    discount: 0,
    total: 383,
    shippingAddress: {
      street: "Indiranagar 100ft Road",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      postalCode: "560038",
    },
    sankalpDetails: {
      devoteeName: "Priya Nair",
      gotra: "Vashistha",
      birthStar: "Ashwini",
      specialPrayers: "Consecration with Mahalakshmi Stotram chants.",
    },
    tracking: {
      carrier: "DHL Express International",
      trackingNumber: "DHL-IN-88941029",
      estimatedDelivery: "2026-09-04",
    },
    items: [
      {
        productId: "2",
        name: "5 Mukhi Nepal Siddh Mala (108+1)",
        mukhiType: "5 Mukhi",
        emoji: "📿",
        price: 149,
        quantity: 1,
        total: 149,
      },
      {
        productId: "3",
        name: "7 Mukhi Mahalakshmi Rudraksha",
        mukhiType: "7 Mukhi",
        emoji: "✨",
        price: 189,
        quantity: 1,
        total: 189,
      },
    ],
  },
  {
    id: "ord_3",
    orderNumber: "NR-8939",
    userId: "usr_4",
    customerName: "Michael Sterling",
    customerEmail: "m.sterling@ukyoga.co.uk",
    customerPhone: "+44 7700 900123",
    date: "2026-08-29 20:10",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    subtotal: 1299,
    consecrationFee: 0,
    shippingFee: 35,
    discount: 100,
    total: 1234,
    shippingAddress: {
      street: "24 Kensington Garden Mews",
      city: "London",
      state: "Greater London",
      country: "United Kingdom",
      postalCode: "W2 4BA",
    },
    sankalpDetails: {
      devoteeName: "Michael Sterling",
      gotra: "Universal Soul",
      birthStar: "Ardra",
      specialPrayers: "Special energization by temple head priest with Shiva Sahasranama.",
    },
    tracking: {
      carrier: "FedEx International Priority",
      trackingNumber: "FDX-77491024",
      estimatedDelivery: "2026-08-31",
    },
    items: [
      {
        productId: "4",
        name: "14 Mukhi Devamani Rudraksha",
        mukhiType: "14 Mukhi",
        emoji: "🔱",
        price: 1299,
        quantity: 1,
        total: 1299,
      },
    ],
  },
  {
    id: "ord_4",
    orderNumber: "NR-8938",
    userId: "usr_6",
    customerName: "Sunita Acharya",
    customerEmail: "sunita.acharya@gmail.com",
    customerPhone: "+977 9851098765",
    date: "2026-08-29 14:05",
    status: "Blessed",
    paymentStatus: "Paid",
    paymentMethod: "Khalti",
    subtotal: 219,
    consecrationFee: 0,
    shippingFee: 5,
    discount: 0,
    total: 224,
    shippingAddress: {
      street: "Baluwatar Main Road",
      city: "Kathmandu",
      state: "Bagmati",
      country: "Nepal",
      postalCode: "44600",
    },
    sankalpDetails: {
      devoteeName: "Sunita Acharya",
      gotra: "Bharadwaj",
      birthStar: "Pushya",
      specialPrayers: "Blessing for obstacle removal and children's studies.",
    },
    tracking: {
      carrier: "Pathao Express",
      trackingNumber: "PTH-992014",
      estimatedDelivery: "2026-09-01",
    },
    items: [
      {
        productId: "7",
        name: "8 Mukhi Lord Ganesha Rudraksha",
        mukhiType: "8 Mukhi",
        emoji: "🐘",
        price: 219,
        quantity: 1,
        total: 219,
      },
    ],
  },
  {
    id: "ord_5",
    orderNumber: "NR-8937",
    userId: "usr_3",
    customerName: "Dr. Vikram Joshi",
    customerEmail: "v.joshi@himalayanwellness.org",
    customerPhone: "+977 9801987654",
    date: "2026-08-28 17:30",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "eSewa",
    subtotal: 996,
    consecrationFee: 0,
    shippingFee: 0,
    discount: 150,
    total: 846,
    shippingAddress: {
      street: "Lakeside Street 6",
      city: "Pokhara",
      state: "Gandaki",
      country: "Nepal",
      postalCode: "33700",
    },
    items: [
      {
        productId: "1",
        name: "1 Mukhi Half Moon Rudraksha",
        mukhiType: "1 Mukhi",
        emoji: "🌙",
        price: 499,
        quantity: 2,
        total: 998,
      },
    ],
  },
  {
    id: "ord_6",
    orderNumber: "NR-8936",
    userId: "usr_5",
    customerName: "Devendra Thapa",
    customerEmail: "devendra.thapa.temp@outlook.com",
    customerPhone: "+977 9811223344",
    date: "2026-08-27 10:15",
    status: "Cancelled",
    paymentStatus: "Refunded",
    paymentMethod: "Cash on Delivery",
    subtotal: 149,
    consecrationFee: 0,
    shippingFee: 5,
    discount: 0,
    total: 154,
    shippingAddress: {
      street: "Kupondole Height",
      city: "Lalitpur",
      state: "Bagmati",
      country: "Nepal",
      postalCode: "44700",
    },
    items: [
      {
        productId: "2",
        name: "5 Mukhi Nepal Siddh Mala (108+1)",
        mukhiType: "5 Mukhi",
        emoji: "📿",
        price: 149,
        quantity: 1,
        total: 149,
      },
    ],
  },
];

export const initialHomeControl: HomeControlData = {
  announcementBar: {
    enabled: true,
    text: "✨ Sacred Shravan Month Blessing: Complimentary Pashupatinath Consecration & Free Global Shipping on orders over $150",
    badge: "Special Blessing",
  },
  heroSection: {
    headline: "Sacred Himalayan Rudraksha",
    subheadline: "Direct from the sacred high-altitude forests of Nepal. Non-doctored, lab-certified, and energized at Pashupatinath Temple for your spiritual awakening.",
    highlightText: "Authentic Divine Energy",
    primaryCtaText: "Explore Sacred Collection",
    primaryCtaLink: "/all-products",
    secondaryCtaText: "Vedic Bead Consultation",
    secondaryCtaLink: "/all-products?category=collector",
    badgeText: "100% Genuine Himalayan Origin",
  },
  featuredProductIds: ["1", "2", "3", "4", "6"],
  offers: [
    {
      id: "off_1",
      title: "Maha Shivaratri Blessings",
      code: "SHIVARATRI25",
      discountPercent: 25,
      description: "Get 25% discount across all rare collector Mukhis with free Vedic Puja consecration certificate.",
      expiresAt: "2026-09-15",
      isActive: true,
      badge: "Limited Time Offer",
      bgGradient: "from-amber-800 to-[#422006]",
    },
    {
      id: "off_2",
      title: "Daily Japa Mala Bundle",
      code: "JAPA15",
      discountPercent: 15,
      description: "Save 15% when ordering 2 or more 108+1 Siddh Japa Malas with pure silk storage pouch.",
      expiresAt: "2026-09-30",
      isActive: true,
      badge: "Devotee Special",
      bgGradient: "from-[#713f12] to-amber-900",
    },
  ],
  testimonials: [
    {
      id: "t_1",
      name: "Aarav Sharma",
      role: "Yoga Practitioner & Devotee",
      location: "Kathmandu, Nepal",
      comment: "The 5 Mukhi mala and 1 Mukhi bead I ordered transformed my morning meditation practice. You can feel the vibrational purity immediately.",
      rating: 5,
      isApproved: true,
      avatar: "AS",
    },
    {
      id: "t_2",
      name: "Priya Nair",
      role: "Spiritual Coach & Healer",
      location: "Bangalore, India",
      comment: "Finally a trustworthy source for genuine Nepali Rudraksha with official X-Ray lab certifications. Fast international delivery.",
      rating: 5,
      isApproved: true,
      avatar: "PN",
    },
    {
      id: "t_3",
      name: "Michael Sterling",
      role: "Meditation Instructor",
      location: "London, UK",
      comment: "The 14 Mukhi bead has a magnificent natural shape and weight. The consecration document and gotra sankalp card gave so much peace.",
      rating: 5,
      isApproved: true,
      avatar: "MS",
    },
  ],
};

export const initialSettings: AdminSettingsData = {
  adminProfile: {
    name: "Acharya Santosh Dahal",
    email: "admin@nepalirudraksh.com",
    phone: "+977 9841000000",
    role: "Super Administrator & Chief Consecrator",
    avatar: "AD",
    twoFactorEnabled: true,
  },
  storeConfig: {
    storeName: "Nepali Rudraksh - Sacred Himalayan Beads",
    supportEmail: "support@nepalirudraksh.com",
    currency: "USD",
    currencySymbol: "$",
    defaultConsecrationFee: 25,
    freeShippingThreshold: 150,
    standardShippingFee: 15,
    templeOrigin: "Pashupatinath Temple, Kathmandu, Nepal",
  },
  notifications: {
    emailOnNewOrder: true,
    emailOnLowStock: true,
    dailyDigest: true,
    smsAlerts: false,
  },
  paymentGateways: {
    esewa: true,
    khalti: true,
    stripe: true,
    cod: true,
  },
};
