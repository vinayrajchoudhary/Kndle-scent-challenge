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
    { id: "romantic", name: "The Romantic", icon: "🌸", descriptor: "Soft • dreamy • floral" },
    { id: "fresh", name: "The Fresh One", icon: "🌿", descriptor: "Clean • bright • breezy" },
    { id: "elegant", name: "The Elegant One", icon: "✨", descriptor: "Polished • refined • timeless" },
    { id: "cozy", name: "The Cozy One", icon: "🌙", descriptor: "Warm • calm • comforting" },
    { id: "playful", name: "The Playful One", icon: "🌈", descriptor: "Fun • cheerful • unexpected" },
    { id: "bold", name: "The Bold One", icon: "🔥", descriptor: "Strong • vivid • confident" }
  ],

  candles: [
    {
      id: "c01",
      slot: "🌸",
      slotLabel: "Slot 1",
      fragrance: "Jasmine",
      mappedPersonas: ["romantic", "elegant", "fresh"],
      options: ["Jasmine", "British Rose", "Cedarwood", "Bergamot"],
      descriptor: "Floral • luminous • soft",
      active: true
    },
    {
      id: "c02",
      slot: "🌙",
      slotLabel: "Slot 2",
      fragrance: "Cedarwood",
      mappedPersonas: ["cozy", "bold", "elegant"],
      options: ["Cedarwood", "Vanilla", "Jasmine", "Orange Blossom"],
      descriptor: "Woody • warm • grounding",
      active: true
    },
    {
      id: "c03",
      slot: "☀️",
      slotLabel: "Slot 3",
      fragrance: "Bergamot",
      mappedPersonas: ["fresh", "playful", "elegant"],
      options: ["Bergamot", "British Rose", "Coffee", "Sandalwood"],
      descriptor: "Citrusy • fresh • bright",
      active: true
    },
    {
      id: "c04",
      slot: "✨",
      slotLabel: "Slot 4",
      fragrance: "British Rose",
      mappedPersonas: ["romantic", "playful", "elegant"],
      options: ["British Rose", "Jasmine", "Bergamot", "Cedarwood"],
      descriptor: "Floral • soft • romantic",
      active: true
    },
    {
      id: "c05",
      slot: "🍃",
      slotLabel: "Slot 5",
      fragrance: "Green Tea",
      mappedPersonas: ["fresh", "cozy"],
      options: ["Green Tea", "Vanilla", "Rose", "Coffee"],
      descriptor: "Green • clean • calming",
      active: true
    },
    {
      id: "c06",
      slot: "🔥",
      slotLabel: "Slot 6",
      fragrance: "Amber",
      mappedPersonas: ["bold", "cozy"],
      options: ["Amber", "Jasmine", "Bergamot", "Green Tea"],
      descriptor: "Warm • rich • deep",
      active: true
    },
    {
      id: "c07",
      slot: "🌼",
      slotLabel: "Slot 7",
      fragrance: "Vanilla",
      mappedPersonas: ["cozy", "playful", "romantic"],
      options: ["Vanilla", "Cedarwood", "Bergamot", "Jasmine"],
      descriptor: "Creamy • soft • comforting",
      active: true
    },
    {
      id: "c08",
      slot: "💧",
      slotLabel: "Slot 8",
      fragrance: "Ocean Mist",
      mappedPersonas: ["fresh", "playful"],
      options: ["Ocean Mist", "Rose", "Amber", "Coffee"],
      descriptor: "Fresh • airy • cool",
      active: true
    },
    {
      id: "c09",
      slot: "🌹",
      slotLabel: "Slot 9",
      fragrance: "Rose Oud",
      mappedPersonas: ["romantic", "bold", "elegant"],
      options: ["Rose Oud", "Vanilla", "Green Tea", "Bergamot"],
      descriptor: "Floral • deep • luxurious",
      active: true
    },
    {
      id: "c10",
      slot: "🌿",
      slotLabel: "Slot 10",
      fragrance: "Sandalwood",
      mappedPersonas: ["cozy", "elegant", "bold"],
      options: ["Sandalwood", "Jasmine", "Ocean Mist", "Orange Blossom"],
      descriptor: "Woody • smooth • warm",
      active: true
    },
    {
      id: "c11",
      slot: "⭐",
      slotLabel: "Slot 11",
      fragrance: "Coffee",
      mappedPersonas: ["bold", "cozy", "playful"],
      options: ["Coffee", "British Rose", "Green Tea", "Cedarwood"],
      descriptor: "Roasted • rich • energetic",
      active: true
    },
    {
      id: "c12",
      slot: "🍊",
      slotLabel: "Slot 12",
      fragrance: "Orange Blossom",
      mappedPersonas: ["fresh", "romantic", "playful"],
      options: ["Orange Blossom", "Amber", "Sandalwood", "Vanilla"],
      descriptor: "Citrusy • floral • sunny",
      active: true
    }
  ]
};
