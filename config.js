window.KNDLE_CONFIG = {
  brand: {
    name: "KNDLÉ",
    gameTitle: "Scent Challenge",
    tagline: "Think you know your fragrances?"
  },

  settings: {
    adminPin: "2468",
    autoResetSeconds: 8,
    correctReward: "You nailed it!",
    wrongReward: "So close!"
  },

  personas: [
    { id: "fresh",    name: "The Fresh One",  icon: "🌿", descriptor: "Bright • energetic • refreshing" },
    { id: "romantic", name: "The Romantic",   icon: "🌸", descriptor: "Soft • expressive • floral" },
    { id: "serene",   name: "The Serene One", icon: "🌙", descriptor: "Calm • warm • grounding" }
  ],

  // Nine candles in one row below the iPad, numbered 1–9 from left to right.
  // Each vibe maps to three candles. Options = the correct answer + 3 distractors
  // (one from the same vibe, two from other vibes). Descriptors are placeholders to confirm.
  candles: [
    {
      id: "c01", slot: "1", slotLabel: "Candle 1",
      fragrance: "Vetiver",
      mappedPersonas: ["serene"],
      options: ["Vetiver", "Cedar", "Lemongrass", "British Tea Rose"],
      descriptor: "Earthy • smoky • grounding",
      active: true
    },
    {
      id: "c02", slot: "2", slotLabel: "Candle 2",
      fragrance: "Lemongrass",
      mappedPersonas: ["fresh"],
      options: ["Lemongrass", "Aqua", "Vetiver", "Orchid"],
      descriptor: "Zesty • green • uplifting",
      active: true
    },
    {
      id: "c03", slot: "3", slotLabel: "Candle 3",
      fragrance: "Daffodil",
      mappedPersonas: ["fresh"],
      options: ["Daffodil", "Lemongrass", "Jasmine", "Cedar"],
      descriptor: "Bright • floral • sunny",
      active: true
    },
    {
      id: "c04", slot: "4", slotLabel: "Candle 4",
      fragrance: "British Tea Rose",
      mappedPersonas: ["romantic"],
      options: ["British Tea Rose", "Orchid", "Daffodil", "Vetiver"],
      descriptor: "Soft • floral • classic",
      active: true
    },
    {
      id: "c05", slot: "5", slotLabel: "Candle 5",
      fragrance: "Orchid",
      mappedPersonas: ["romantic"],
      options: ["Orchid", "Jasmine", "Aqua", "Cedar"],
      descriptor: "Exotic • floral • velvety",
      active: true
    },
    {
      id: "c06", slot: "6", slotLabel: "Candle 6",
      fragrance: "Cedar",
      mappedPersonas: ["serene"],
      options: ["Cedar", "Vetiver", "Aqua", "Jasmine"],
      descriptor: "Woody • warm • dry",
      active: true
    },
    {
      id: "c07", slot: "7", slotLabel: "Candle 7",
      fragrance: "Cedar + Lavender",
      mappedPersonas: ["serene"],
      options: ["Cedar + Lavender", "Vetiver", "Orchid", "Daffodil"],
      descriptor: "Woody • herbal • calming",
      active: true
    },
    {
      id: "c08", slot: "8", slotLabel: "Candle 8",
      fragrance: "Jasmine",
      mappedPersonas: ["romantic"],
      options: ["Jasmine", "British Tea Rose", "Daffodil", "Vetiver"],
      descriptor: "Sweet • floral • heady",
      active: true
    },
    {
      id: "c09", slot: "9", slotLabel: "Candle 9",
      fragrance: "Aqua",
      mappedPersonas: ["fresh"],
      options: ["Aqua", "Lemongrass", "Orchid", "Cedar"],
      descriptor: "Fresh • airy • watery",
      active: true
    }
  ]
};
