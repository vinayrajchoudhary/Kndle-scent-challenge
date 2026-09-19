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
    { id: "fresh", name: "The Fresh One", icon: "🌿", descriptor: "Bright • energetic • refreshing" },
    { id: "romantic", name: "The Romantic", icon: "🌸", descriptor: "Soft • expressive • floral" },
    { id: "serene", name: "The Serene One", icon: "🌙", descriptor: "Calm • warm • grounding" }
  ],

  candles: [
    {
      id: "c01", slot: "1", slotLabel: "Slot 1", icon: "🌿",
      fragrance: "Vetiver", mappedPersonas: ["serene"],
      options: ["Vetiver", "Cedar", "Aqua", "Lemon Grass"],
      descriptor: "Earthy • green • grounding", active: true
    },
    {
      id: "c02", slot: "2", slotLabel: "Slot 2", icon: "🍃",
      fragrance: "Lemon Grass", mappedPersonas: ["fresh"],
      options: ["Lemon Grass", "Daffodil", "Jasmine", "Vetiver"],
      descriptor: "Fresh • citrusy • lively", active: true
    },
    {
      id: "c03", slot: "3", slotLabel: "Slot 3", icon: "☀️",
      fragrance: "Daffodil", mappedPersonas: ["fresh"],
      options: ["Daffodil", "Jasmine", "Orchid", "Lemon Grass"],
      descriptor: "Light • floral • spring-like", active: true
    },
    {
      id: "c04", slot: "4", slotLabel: "Slot 4", icon: "🌹",
      fragrance: "British Tea Rose", mappedPersonas: ["romantic"],
      options: ["British Tea Rose", "Jasmine", "Orchid", "Daffodil"],
      descriptor: "Soft • rosy • elegant", active: true
    },
    {
      id: "c05", slot: "5", slotLabel: "Slot 5", icon: "✨",
      fragrance: "Orchid", mappedPersonas: ["romantic"],
      options: ["Orchid", "Jasmine", "British Tea Rose", "Aqua"],
      descriptor: "Smooth • floral • refined", active: true
    },
    {
      id: "c06", slot: "6", slotLabel: "Slot 6", icon: "🌙",
      fragrance: "Cedar", mappedPersonas: ["serene"],
      options: ["Cedar", "Vetiver", "Cedar + Lavender", "Lemon Grass"],
      descriptor: "Woody • dry • warm", active: true
    },
    {
      id: "c07", slot: "7", slotLabel: "Slot 7", icon: "🌼",
      fragrance: "Cedar + Lavender", mappedPersonas: ["serene"],
      options: ["Cedar + Lavender", "Cedar", "Vetiver", "Jasmine"],
      descriptor: "Woody • calm • aromatic", active: true
    },
    {
      id: "c08", slot: "8", slotLabel: "Slot 8", icon: "🌸",
      fragrance: "Jasmine", mappedPersonas: ["romantic"],
      options: ["Jasmine", "Orchid", "British Tea Rose", "Daffodil"],
      descriptor: "Floral • rich • luminous", active: true
    },
    {
      id: "c09", slot: "9", slotLabel: "Slot 9", icon: "💧",
      fragrance: "Aqua", mappedPersonas: ["fresh"],
      options: ["Aqua", "Lemon Grass", "Daffodil", "Cedar"],
      descriptor: "Clean • cool • aquatic", active: true
    }
  ]
};
