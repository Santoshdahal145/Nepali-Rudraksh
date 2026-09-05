import { db } from "@/src/prisma/db";

const IMAGE_URL =
  "https://www.shutterstock.com/image-photo/closeup-image-rudraksha-bead-elaeocarpus-260nw-2699062667.jpg";

const products = [
  // {
  //   name: "5 Mukhi Rudraksha",
  //   slug: "5-mukhi-rudraksha",
  //   description:
  //     "A naturally formed 5 Mukhi Rudraksha traditionally associated with Lord Shiva. Suitable for meditation, Japa, prayer, and daily spiritual practice. Each Rudraksha has a naturally unique shape, texture, and mukhi pattern.",
  //   type: "INDIVIDUAL_RUDRAKSHA" as const,

  //   detail: {
  //     mukhi: 5,
  //   },

  //   images: [
  //     {
  //       url: IMAGE_URL,
  //       altText: "Natural 5 Mukhi Rudraksha",
  //       position: 0,
  //     },
  //     {
  //       url: IMAGE_URL,
  //       altText: "5 Mukhi Rudraksha close view",
  //       position: 1,
  //     },
  //   ],

  //   variants: [
  //     {
  //       sku: "NR-5MR-001",
  //       price: 4888,
  //       stock: 35,
  //       weightGrams: 10.5,
  //       size: 16,
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "5 Mukhi Rudraksha 16mm",
  //           position: 0,
  //         },
  //       ],
  //     },
  //     {
  //       sku: "NR-5MR-002",
  //       price: 6888,
  //       stock: 89,
  //       weightGrams: 14.2,
  //       size: 18,
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "5 Mukhi Rudraksha 18mm",
  //           position: 0,
  //         },
  //       ],
  //     },
  //     {
  //       sku: "NR-5MR-003",
  //       price: 8888,
  //       stock: 42,
  //       weightGrams: 18.5,
  //       size: 20,
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "5 Mukhi Rudraksha 20mm",
  //           position: 0,
  //         },
  //       ],
  //     },
  //   ],
  // },

  // {
  //   name: "6 Mukhi Rudraksha",
  //   slug: "6-mukhi-rudraksha",
  //   description:
  //     "A genuine 6 Mukhi Rudraksha traditionally associated with Lord Kartikeya. It is commonly used for meditation, prayer, and spiritual practice. The naturally formed mukhi lines and texture give every bead its own distinctive appearance.",
  //   type: "INDIVIDUAL_RUDRAKSHA" as const,

  //   detail: {
  //     mukhi: 6,
  //   },

  //   images: [
  //     {
  //       url: IMAGE_URL,
  //       altText: "Natural 6 Mukhi Rudraksha",
  //       position: 0,
  //     },
  //     {
  //       url: IMAGE_URL,
  //       altText: "6 Mukhi Rudraksha close view",
  //       position: 1,
  //     },
  //   ],

  //   variants: [
  //     {
  //       sku: "NR-6MR-001",
  //       price: 5499,
  //       stock: 28,
  //       weightGrams: 11.5,
  //       size: 16,
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "6 Mukhi Rudraksha 16mm",
  //           position: 0,
  //         },
  //       ],
  //     },
  //     {
  //       sku: "NR-6MR-002",
  //       price: 7499,
  //       stock: 51,
  //       weightGrams: 15.8,
  //       size: 18,
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "6 Mukhi Rudraksha 18mm",
  //           position: 0,
  //         },
  //       ],
  //     },
  //     {
  //       sku: "NR-6MR-003",
  //       price: 9999,
  //       stock: 17,
  //       weightGrams: 20.1,
  //       size: 20,
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "6 Mukhi Rudraksha 20mm",
  //           position: 0,
  //         },
  //       ],
  //     },
  //   ],
  // },

  // {
  //   name: "7 Mukhi Rudraksha",
  //   slug: "7-mukhi-rudraksha",
  //   description:
  //     "A naturally formed 7 Mukhi Rudraksha traditionally associated with prosperity and spiritual well-being. It is commonly worn as a sacred bead and used for meditation, prayer, and devotional practices.",
  //   type: "INDIVIDUAL_RUDRAKSHA" as const,

  //   detail: {
  //     mukhi: 7,
  //   },

  //   images: [
  //     {
  //       url: IMAGE_URL,
  //       altText: "Natural 7 Mukhi Rudraksha",
  //       position: 0,
  //     },
  //     {
  //       url: IMAGE_URL,
  //       altText: "7 Mukhi Rudraksha detail",
  //       position: 1,
  //     },
  //   ],

  //   variants: [
  //     {
  //       sku: "NR-7MR-001",
  //       price: 6999,
  //       stock: 45,
  //       weightGrams: 12.8,
  //       size: 16,
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "7 Mukhi Rudraksha 16mm",
  //           position: 0,
  //         },
  //       ],
  //     },
  //     {
  //       sku: "NR-7MR-002",
  //       price: 8999,
  //       stock: 32,
  //       weightGrams: 16.4,
  //       size: 18,
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "7 Mukhi Rudraksha 18mm",
  //           position: 0,
  //         },
  //       ],
  //     },
  //     {
  //       sku: "NR-7MR-003",
  //       price: 11999,
  //       stock: 14,
  //       weightGrams: 21.3,
  //       size: 20,
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "7 Mukhi Rudraksha 20mm",
  //           position: 0,
  //         },
  //       ],
  //     },
  //   ],
  // },

  // {
  //   name: "8 Mukhi Rudraksha",
  //   slug: "8-mukhi-rudraksha",
  //   description:
  //     "A naturally formed 8 Mukhi Rudraksha traditionally associated with Lord Ganesha. Valued for its distinctive natural mukhi formation, it is commonly used for meditation, prayer, and spiritual practices.",
  //   type: "INDIVIDUAL_RUDRAKSHA" as const,

  //   detail: {
  //     mukhi: 8,
  //   },

  //   images: [
  //     {
  //       url: IMAGE_URL,
  //       altText: "Natural 8 Mukhi Rudraksha",
  //       position: 0,
  //     },
  //   ],

  //   variants: [
  //     {
  //       sku: "NR-8MR-001",
  //       price: 7999,
  //       stock: 26,
  //       weightGrams: 13.5,
  //       size: 16,
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "8 Mukhi Rudraksha 16mm",
  //           position: 0,
  //         },
  //       ],
  //     },
  //     {
  //       sku: "NR-8MR-002",
  //       price: 10999,
  //       stock: 19,
  //       weightGrams: 17.8,
  //       size: 18,
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "8 Mukhi Rudraksha 18mm",
  //           position: 0,
  //         },
  //       ],
  //     },
  //   ],
  // },

  // {
  //   name: "9 Mukhi Rudraksha",
  //   slug: "9-mukhi-rudraksha",
  //   description:
  //     "A naturally formed 9 Mukhi Rudraksha traditionally associated with Goddess Durga. It is valued as a sacred bead for meditation, prayer, and devotional practices.",
  //   type: "INDIVIDUAL_RUDRAKSHA" as const,

  //   detail: {
  //     mukhi: 9,
  //   },

  //   images: [
  //     {
  //       url: IMAGE_URL,
  //       altText: "Natural 9 Mukhi Rudraksha",
  //       position: 0,
  //     }
  //   ],

  //   variants: [
  //     {
  //       sku: "NR-9MR-001",
  //       price: 9999,
  //       stock: 21,
  //       weightGrams: 14.2,
  //       size: 16,
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "9 Mukhi Rudraksha 16mm",
  //           position: 0,
  //         },
  //       ],
  //     },
  //     {
  //       sku: "NR-9MR-002",
  //       price: 13999,
  //       stock: 13,
  //       weightGrams: 18.6,
  //       size: 18,
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "9 Mukhi Rudraksha 18mm",
  //           position: 0,
  //         },
  //       ],
  //     },
  //   ],
  // },

  // // ---------------- MALA PRODUCTS ----------------

  // {
  //   name: "5 Mukhi Rudraksha Prayer Mala",
  //   slug: "5-mukhi-rudraksha-prayer-mala",
  //   description:
  //     "A traditional prayer Mala crafted from natural 5 Mukhi Rudraksha beads. Ideal for mantra chanting, meditation, prayer, and devotional practices. Each bead is naturally unique, making every Mala slightly different in appearance.",
  //   type: "RUDRAKSHA_MALA" as const,

  //   detail: {
  //     mukhi: 5,
  //   },

  //   images: [
  //     {
  //       url: IMAGE_URL,
  //       altText: "5 Mukhi Rudraksha Prayer Mala",
  //       position: 0,
  //     },
  //     {
  //       url: IMAGE_URL,
  //       altText: "Natural 5 Mukhi Rudraksha Mala",
  //       position: 1,
  //     },
  //   ],

  //   variants: [
  //     {
  //       sku: "NR-5MALA-054",
  //       price: 3499,
  //       stock: 64,
  //       weightGrams: 38.5,
  //       beadCount: 54,
  //       material: "Rudraksha",
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "54 Beads 5 Mukhi Rudraksha Mala",
  //           position: 0,
  //         },
  //       ],
  //     },
  //     {
  //       sku: "NR-5MALA-108",
  //       price: 5499,
  //       stock: 48,
  //       weightGrams: 72.5,
  //       beadCount: 108,
  //       material: "Rudraksha",
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "108 Beads 5 Mukhi Rudraksha Mala",
  //           position: 0,
  //         },
  //       ],
  //     },
  //   ],
  // },

  // {
  //   name: "5 Mukhi Rudraksha Japa Mala",
  //   slug: "5-mukhi-rudraksha-japa-mala",
  //   description:
  //     "A traditional Japa Mala crafted with natural 5 Mukhi Rudraksha beads. Suitable for mantra recitation, meditation, prayer, and spiritual practices. The naturally formed beads have unique textures and mukhi lines.",
  //   type: "RUDRAKSHA_MALA" as const,

  //   detail: {
  //     mukhi: 5,
  //   },

  //   images: [
  //     {
  //       url: IMAGE_URL,
  //       altText: "5 Mukhi Rudraksha Japa Mala",
  //       position: 0,
  //     }
  //   ],

  //   variants: [
  //     {
  //       sku: "NR-JAPA-054",
  //       price: 3999,
  //       stock: 55,
  //       weightGrams: 41.2,
  //       beadCount: 54,
  //       material: "Rudraksha",
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "54 Beads Rudraksha Japa Mala",
  //           position: 0,
  //         },
  //       ],
  //     },
  //     {
  //       sku: "NR-JAPA-108",
  //       price: 6499,
  //       stock: 31,
  //       weightGrams: 76.8,
  //       beadCount: 108,
  //       material: "Rudraksha",
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "108 Beads Rudraksha Japa Mala",
  //           position: 0,
  //         },
  //       ],
  //     }
  //   ],
  // },

  // {
  //   name: "Nepali 5 Mukhi Rudraksha Mala",
  //   slug: "nepali-5-mukhi-rudraksha-mala",
  //   description:
  //     "A traditional Mala made using naturally sourced Rudraksha beads associated with Nepal. The 5 Mukhi beads are commonly used for meditation, Japa, prayer, and everyday spiritual practice.",
  //   type: "RUDRAKSHA_MALA" as const,

  //   detail: {
  //     mukhi: 5,
  //   },

  //   images: [
  //     {
  //       url: IMAGE_URL,
  //       altText: "Nepali 5 Mukhi Rudraksha Mala",
  //       position: 0
  //     }
  //   ],

  //   variants: [
  //     {
  //       sku: "NR-NEPALI-MALA-054",
  //       price: 4499,
  //       stock: 39,
  //       weightGrams: 40.5,
  //       beadCount: 54,
  //       material: "Nepali Rudraksha",
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "Nepali 54 Beads Rudraksha Mala",
  //           position: 0
  //         }
  //       ]
  //     },
  //     {
  //       sku: "NR-NEPALI-MALA-108",
  //       price: 6999,
  //       stock: 27,
  //       weightGrams: 78.2,
  //       beadCount: 108,
  //       material: "Nepali Rudraksha",
  //       images: [
  //         {
  //           url: IMAGE_URL,
  //           altText: "Nepali 108 Beads Rudraksha Mala",
  //           position: 0
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
  name: "10 Mukhi Rudraksha",
  slug: "10-mukhi-rudraksha",
  description:
    "A naturally formed 10 Mukhi Rudraksha valued as a sacred bead for meditation, prayer, and spiritual practice. Its naturally occurring mukhi lines and textured surface give each bead a distinctive appearance.",
  type: "INDIVIDUAL_RUDRAKSHA" as const,

  detail: {
    mukhi: 10,
  },

  images: [
    {
      url: IMAGE_URL,
      altText: "Natural 10 Mukhi Rudraksha",
      position: 0,
    },
    {
      url: IMAGE_URL,
      altText: "10 Mukhi Rudraksha close view",
      position: 1,
    },
  ],

  variants: [
    {
      sku: "NR-10MR-001",
      price: 11999,
      stock: 18,
      weightGrams: 15.4,
      size: 16,
      images: [
        {
          url: IMAGE_URL,
          altText: "10 Mukhi Rudraksha 16mm",
          position: 0,
        },
      ],
    },
    {
      sku: "NR-10MR-002",
      price: 15999,
      stock: 12,
      weightGrams: 19.8,
      size: 18,
      images: [
        {
          url: IMAGE_URL,
          altText: "10 Mukhi Rudraksha 18mm",
          position: 0,
        },
      ],
    },
    {
      sku: "NR-10MR-003",
      price: 21999,
      stock: 6,
      weightGrams: 24.1,
      size: 20,
      images: [
        {
          url: IMAGE_URL,
          altText: "10 Mukhi Rudraksha 20mm",
          position: 0,
        },
      ],
    },
  ],
},

{
  name: "11 Mukhi Rudraksha",
  slug: "11-mukhi-rudraksha",
  description:
    "A naturally formed 11 Mukhi Rudraksha traditionally associated with Lord Hanuman. It is commonly used as a sacred bead for meditation, prayer, mantra practice, and devotional routines.",
  type: "INDIVIDUAL_RUDRAKSHA" as const,

  detail: {
    mukhi: 11,
  },

  images: [
    {
      url: IMAGE_URL,
      altText: "Natural 11 Mukhi Rudraksha",
      position: 0,
    },
    {
      url: IMAGE_URL,
      altText: "11 Mukhi Rudraksha detailed view",
      position: 1,
    },
  ],

  variants: [
    {
      sku: "NR-11MR-001",
      price: 12999,
      stock: 18,
      weightGrams: 16.2,
      size: 16,
      images: [
        {
          url: IMAGE_URL,
          altText: "11 Mukhi Rudraksha 16mm",
          position: 0,
        },
      ],
    },
    {
      sku: "NR-11MR-002",
      price: 17999,
      stock: 11,
      weightGrams: 20.5,
      size: 18,
      images: [
        {
          url: IMAGE_URL,
          altText: "11 Mukhi Rudraksha 18mm",
          position: 0,
        },
      ],
    },
  ],
},

{
  name: "12 Mukhi Rudraksha",
  slug: "12-mukhi-rudraksha",
  description:
    "A naturally formed 12 Mukhi Rudraksha valued for its distinctive appearance and traditional spiritual significance. Suitable for prayer, meditation, devotional practices, and sacred use.",
  type: "INDIVIDUAL_RUDRAKSHA" as const,

  detail: {
    mukhi: 12,
  },

  images: [
    {
      url: IMAGE_URL,
      altText: "Natural 12 Mukhi Rudraksha",
      position: 0,
    },
  ],

  variants: [
    {
      sku: "NR-12MR-001",
      price: 14999,
      stock: 15,
      weightGrams: 17.5,
      size: 16,
      images: [
        {
          url: IMAGE_URL,
          altText: "12 Mukhi Rudraksha 16mm",
          position: 0,
        },
      ],
    },
    {
      sku: "NR-12MR-002",
      price: 19999,
      stock: 9,
      weightGrams: 22.3,
      size: 18,
      images: [
        {
          url: IMAGE_URL,
          altText: "12 Mukhi Rudraksha 18mm",
          position: 0,
        },
      ],
    },
  ],
},

{
  name: "13 Mukhi Rudraksha",
  slug: "13-mukhi-rudraksha",
  description:
    "A naturally formed 13 Mukhi Rudraksha with distinctive mukhi lines and natural texture. It is valued as a sacred bead and can be used for meditation, prayer, and devotional practices.",
  type: "INDIVIDUAL_RUDRAKSHA" as const,

  detail: {
    mukhi: 13,
  },

  images: [
    {
      url: IMAGE_URL,
      altText: "Natural 13 Mukhi Rudraksha",
      position: 0,
    },
  ],

  variants: [
    {
      sku: "NR-13MR-001",
      price: 18999,
      stock: 10,
      weightGrams: 18.4,
      size: 16,
      images: [
        {
          url: IMAGE_URL,
          altText: "13 Mukhi Rudraksha 16mm",
          position: 0,
        },
      ],
    },
    {
      sku: "NR-13MR-002",
      price: 24999,
      stock: 5,
      weightGrams: 23.6,
      size: 18,
      images: [
        {
          url: IMAGE_URL,
          altText: "13 Mukhi Rudraksha 18mm",
          position: 0,
        },
      ],
    },
  ],
},

{
  name: "14 Mukhi Rudraksha",
  slug: "14-mukhi-rudraksha",
  description:
    "A rare naturally formed 14 Mukhi Rudraksha with prominent natural mukhi lines. Traditionally regarded as a highly sacred Rudraksha and commonly kept for meditation, prayer, and spiritual practice.",
  type: "INDIVIDUAL_RUDRAKSHA" as const,

  detail: {
    mukhi: 14,
  },

  images: [
    {
      url: IMAGE_URL,
      altText: "Natural 14 Mukhi Rudraksha",
      position: 0,
    },
    {
      url: IMAGE_URL,
      altText: "14 Mukhi Rudraksha close view",
      position: 1,
    },
  ],

  variants: [
    {
      sku: "NR-14MR-001",
      price: 24999,
      stock: 7,
      weightGrams: 20.2,
      size: 16,
      images: [
        {
          url: IMAGE_URL,
          altText: "14 Mukhi Rudraksha 16mm",
          position: 0,
        },
      ],
    },
    {
      sku: "NR-14MR-002",
      price: 34999,
      stock: 4,
      weightGrams: 26.8,
      size: 18,
      images: [
        {
          url: IMAGE_URL,
          altText: "14 Mukhi Rudraksha 18mm",
          position: 0,
        },
      ],
    },
  ],
},

// ================= MALA PRODUCTS =================

{
  name: "7 Mukhi Rudraksha Mala",
  slug: "7-mukhi-rudraksha-mala",
  description:
    "A traditional Rudraksha Mala crafted from natural 7 Mukhi beads. Suitable for meditation, prayer, Japa, and devotional practices. Natural variations in bead shape and texture make each Mala unique.",
  type: "RUDRAKSHA_MALA" as const,

  detail: {
    mukhi: 7,
  },

  images: [
    {
      url: IMAGE_URL,
      altText: "7 Mukhi Rudraksha Mala",
      position: 0,
    },
    {
      url: IMAGE_URL,
      altText: "Natural 7 Mukhi Rudraksha Mala",
      position: 1,
    },
  ],

  variants: [
    {
      sku: "NR-7MALA-054",
      price: 5999,
      stock: 36,
      weightGrams: 42.5,
      beadCount: 54,
      material: "Rudraksha",
      images: [
        {
          url: IMAGE_URL,
          altText: "54 Beads 7 Mukhi Rudraksha Mala",
          position: 0,
        },
      ],
    },
    {
      sku: "NR-7MALA-108",
      price: 8999,
      stock: 24,
      weightGrams: 81.5,
      beadCount: 108,
      material: "Rudraksha",
      images: [
        {
          url: IMAGE_URL,
          altText: "108 Beads 7 Mukhi Rudraksha Mala",
          position: 0,
        },
      ],
    },
  ],
},

{
  name: "9 Mukhi Rudraksha Mala",
  slug: "9-mukhi-rudraksha-mala",
  description:
    "A traditional Mala prepared with natural 9 Mukhi Rudraksha beads. Designed for prayer, meditation, mantra chanting, and devotional practices, with naturally textured beads arranged in a traditional Mala format.",
  type: "RUDRAKSHA_MALA" as const,

  detail: {
    mukhi: 9,
  },

  images: [
    {
      url: IMAGE_URL,
      altText: "9 Mukhi Rudraksha Mala",
      position: 0,
    },
  ],

  variants: [
    {
      sku: "NR-9MALA-054",
      price: 7499,
      stock: 28,
      weightGrams: 44.8,
      beadCount: 54,
      material: "Rudraksha",
      images: [
        {
          url: IMAGE_URL,
          altText: "54 Beads 9 Mukhi Rudraksha Mala",
          position: 0,
        },
      ],
    },
    {
      sku: "NR-9MALA-108",
      price: 10999,
      stock: 16,
      weightGrams: 86.4,
      beadCount: 108,
      material: "Rudraksha",
      images: [
        {
          url: IMAGE_URL,
          altText: "108 Beads 9 Mukhi Rudraksha Mala",
          position: 0,
        },
      ],
    },
  ],
},

{
  name: "Rudraksha Meditation Mala with Guru Bead",
  slug: "rudraksha-meditation-mala-guru-bead",
  description:
    "A traditional meditation Mala made from natural Rudraksha beads and finished with a Guru bead. Suitable for meditation, Japa, mantra chanting, prayer, and everyday spiritual practice.",
  type: "RUDRAKSHA_MALA" as const,

  detail: {
    mukhi: 5,
  },

  images: [
    {
      url: IMAGE_URL,
      altText: "Rudraksha Meditation Mala with Guru Bead",
      position: 0,
    },
    {
      url: IMAGE_URL,
      altText: "Rudraksha Mala Guru Bead",
      position: 1,
    },
  ],

  variants: [
    {
      sku: "NR-GURU-MALA-054",
      price: 4999,
      stock: 33,
      weightGrams: 43.2,
      beadCount: 54,
      material: "Rudraksha with Guru Bead",
      images: [
        {
          url: IMAGE_URL,
          altText: "54 Beads Rudraksha Mala with Guru Bead",
          position: 0,
        },
      ],
    },
    {
      sku: "NR-GURU-MALA-108",
      price: 7499,
      stock: 22,
      weightGrams: 79.6,
      beadCount: 108,
      material: "Rudraksha with Guru Bead",
      images: [
        {
          url: IMAGE_URL,
          altText: "108 Beads Rudraksha Mala with Guru Bead",
          position: 0,
        },
      ],
    },
  ],
},

{
  name: "Traditional Nepali Rudraksha Mala",
  slug: "traditional-nepali-rudraksha-mala",
  description:
    "A traditional Mala made with naturally sourced Rudraksha beads. Suitable for daily prayer, meditation, Japa, and devotional practice. The natural variations in the beads give each Mala an individual character.",
  type: "RUDRAKSHA_MALA" as const,

  detail: {
    mukhi: 5,
  },

  images: [
    {
      url: IMAGE_URL,
      altText: "Traditional Nepali Rudraksha Mala",
      position: 0,
    },
  ],

  variants: [
    {
      sku: "NR-TRADITIONAL-054",
      price: 4299,
      stock: 47,
      weightGrams: 39.8,
      beadCount: 54,
      material: "Nepali Rudraksha",
      images: [
        {
          url: IMAGE_URL,
          altText: "54 Beads Traditional Nepali Rudraksha Mala",
          position: 0,
        },
      ],
    },
    {
      sku: "NR-TRADITIONAL-108",
      price: 6799,
      stock: 34,
      weightGrams: 77.4,
      beadCount: 108,
      material: "Nepali Rudraksha",
      images: [
        {
          url: IMAGE_URL,
          altText: "108 Beads Traditional Nepali Rudraksha Mala",
          position: 0,
        },
      ],
    },
  ],
},
];
export async function seedProducts() {
  for (const product of products) {
    await db.transaction(async (tx) => {
      const createdProduct = await tx.orm.public.Product.create({
        name: product.name,
        slug: product.slug,
        description: product.description,
        type: product.type,
      });

      // Product images
      for (const image of product.images) {
        await tx.orm.public.ProductImage.create({
          ...image,
          productId: createdProduct.id,
        });
      }

      // Type-specific product detail (1-1)
      if (product.type === "INDIVIDUAL_RUDRAKSHA") {
        await tx.orm.public.IndividualRudrakshaDetail.create({
          mukhi: product.detail.mukhi,
          productId: createdProduct.id,
        });
      } else {
        await tx.orm.public.RudrakshaMalaDetail.create({
          mukhi: product.detail.mukhi,
          productId: createdProduct.id,
        });
      }

      // Variants
      for (const variant of product.variants) {
        const createdVariant = await tx.orm.public.ProductVariant.create({
          sku: variant.sku,
          price: variant.price,
          stock: variant.stock,
          weightGrams: variant.weightGrams,
          productId: createdProduct.id,
        });

        // Variant images -> VariantImage table, not ProductImage
        for (const image of variant.images) {
          await tx.orm.public.VariantImage.create({
            ...image,
            variantId: createdVariant.id,
          });
        }

        // Type-specific variant attrs (1-1)
        if (product.type === "INDIVIDUAL_RUDRAKSHA") {
          await tx.orm.public.IndividualVariantAttrs.create({
            size: variant.size,
            variantId: createdVariant.id,
          });
        } else {
          await tx.orm.public.MalaVariantAttrs.create({
            beadCount: variant.beadCount,
            material: variant.material,
            variantId: createdVariant.id,
          });
        }
      }

      console.log(`Product seeded: ${createdProduct.name}`);
    });
  }

  console.log(`Successfully seeded ${products.length} products.`);
}


async function main() {
  try {
    await seedProducts();
  } catch (error) {
    console.error(error);
  } finally {
    await db.close();
  }
}
main();