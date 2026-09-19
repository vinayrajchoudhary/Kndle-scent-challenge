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
      id: "c01", slot: "1", slotLabel: "Candle 1", vessel: "amber-lidded",
      fragrance: "Vetiver", mappedPersonas: ["serene"],
      options: ["Vetiver", "Cedar", "Aqua", "Lemon Grass"],
      descriptor: "Earthy • green • grounding", active: true
    },
    {
      id: "c02", slot: "2", slotLabel: "Candle 2", vessel: "green-pedestal",
      fragrance: "Lemon Grass", mappedPersonas: ["fresh"],
      options: ["Lemon Grass", "Daffodil", "Jasmine", "Vetiver"],
      descriptor: "Fresh • citrusy • lively", active: true
    },
    {
      id: "c03", slot: "3", slotLabel: "Candle 3", vessel: "ribbed-green",
      fragrance: "Daffodil", mappedPersonas: ["fresh"],
      options: ["Daffodil", "Jasmine", "Orchid", "Lemon Grass"],
      descriptor: "Light • floral • spring-like", active: true
    },
    {
      id: "c04", slot: "4", slotLabel: "Candle 4", vessel: "lime-bowl",
      fragrance: "British Tea Rose", mappedPersonas: ["romantic"],
      options: ["British Tea Rose", "Jasmine", "Orchid", "Daffodil"],
      descriptor: "Soft • rosy • elegant", active: true
    },
    {
      id: "c05", slot: "5", slotLabel: "Candle 5", vessel: "floral-glass",
      fragrance: "Orchid", mappedPersonas: ["romantic"],
      options: ["Orchid", "Jasmine", "British Tea Rose", "Aqua"],
      descriptor: "Smooth • floral • refined", active: true
    },
    {
      id: "c06", slot: "6", slotLabel: "Candle 6", vessel: "teal-bowl",
      fragrance: "Cedar", mappedPersonas: ["serene"],
      options: ["Cedar", "Vetiver", "Cedar + Lavender", "Lemon Grass"],
      descriptor: "Woody • dry • warm", active: true
    },
    {
      id: "c07", slot: "7", slotLabel: "Candle 7", vessel: "white-face",
      fragrance: "Cedar + Lavender", mappedPersonas: ["serene"],
      options: ["Cedar + Lavender", "Cedar", "Vetiver", "Jasmine"],
      descriptor: "Woody • calm • aromatic", active: true
    },
    {
      id: "c08", slot: "8", slotLabel: "Candle 8", vessel: "large-floral-bowl",
      fragrance: "Jasmine", mappedPersonas: ["romantic"],
      options: ["Jasmine", "Orchid", "British Tea Rose", "Daffodil"],
      descriptor: "Floral • rich • luminous", active: true
    },
    {
      id: "c09", slot: "9", slotLabel: "Candle 9", vessel: "aqua-green",
      fragrance: "Aqua", mappedPersonas: ["fresh"],
      options: ["Aqua", "Lemon Grass", "Daffodil", "Cedar"],
      descriptor: "Clean • cool • aquatic", active: true
    }
  ]
};
