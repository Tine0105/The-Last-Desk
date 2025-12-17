import { Card, Rarity } from '@/types/game';

const cardTemplates: Omit<Card, 'id'>[] = [
  // Common Cards
  {
    name: 'Memory Shard',
    type: 'attack',
    rarity: 'common',
    atk: 8,
    hp: 20,
    def: 2,
    critRate: 10,
    cost: 1,
    description: 'A fragment of forgotten power.',
  },
  {
    name: 'Echo Blade',
    type: 'attack',
    rarity: 'common',
    atk: 12,
    hp: 15,
    def: 0,
    critRate: 15,
    cost: 1,
    description: 'Strikes twice in memory.',
  },
  {
    name: 'Fading Shield',
    type: 'skill',
    rarity: 'common',
    atk: 4,
    hp: 30,
    def: 8,
    critRate: 5,
    cost: 1,
    description: 'Protection from times past.',
  },
  {
    name: 'Phantom Strike',
    type: 'attack',
    rarity: 'common',
    atk: 10,
    hp: 18,
    def: 3,
    critRate: 12,
    cost: 1,
    description: 'A ghostly attack from nowhere.',
  },

  // Uncommon Cards
  {
    name: 'Void Walker',
    type: 'attack',
    rarity: 'uncommon',
    atk: 18,
    hp: 25,
    def: 5,
    critRate: 20,
    cost: 2,
    description: 'Traverses the space between memories.',
  },
  {
    name: 'Time Fracture',
    type: 'skill',
    rarity: 'uncommon',
    atk: 14,
    hp: 35,
    def: 10,
    critRate: 15,
    cost: 2,
    description: 'Breaks the flow of time itself.',
  },
  {
    name: 'Crystal Resonance',
    type: 'skill',
    rarity: 'uncommon',
    atk: 10,
    hp: 40,
    def: 12,
    critRate: 10,
    cost: 2,
    description: 'Harmonic defense from crystallized memories.',
  },
  {
    name: 'Neon Cutter',
    type: 'attack',
    rarity: 'uncommon',
    atk: 22,
    hp: 20,
    def: 2,
    critRate: 25,
    cost: 2,
    description: 'Slices through reality with light.',
  },

  // Rare Cards
  {
    name: 'Oblivion Surge',
    type: 'attack',
    rarity: 'rare',
    atk: 30,
    hp: 35,
    def: 8,
    critRate: 30,
    cost: 3,
    description: 'Unleash the power of forgotten worlds.',
  },
  {
    name: 'Eternal Guard',
    type: 'skill',
    rarity: 'rare',
    atk: 15,
    hp: 60,
    def: 20,
    critRate: 10,
    cost: 3,
    description: 'An unbreakable shield from eternity.',
  },
  {
    name: 'Crimson Echo',
    type: 'attack',
    rarity: 'rare',
    atk: 35,
    hp: 30,
    def: 5,
    critRate: 35,
    cost: 3,
    description: 'The last cry of a dying memory.',
  },

  // Legendary Cards
  {
    name: 'Void Emperor',
    type: 'attack',
    rarity: 'legendary',
    atk: 50,
    hp: 50,
    def: 15,
    critRate: 40,
    cost: 4,
    description: 'Ruler of the emptiness between worlds.',
  },
  {
    name: 'Time Lord\'s Blessing',
    type: 'skill',
    rarity: 'legendary',
    atk: 25,
    hp: 80,
    def: 30,
    critRate: 20,
    cost: 4,
    description: 'Gift from the master of time itself.',
  },

  // Secret Cards
  {
    name: 'The Last Memory',
    type: 'relic',
    rarity: 'secret',
    atk: 75,
    hp: 100,
    def: 25,
    critRate: 50,
    cost: 5,
    description: 'The final fragment of all existence.',
  },

  // Curse Cards
  {
    name: 'Corrupted Echo',
    type: 'curse',
    rarity: 'common',
    atk: 5,
    hp: 10,
    def: 0,
    critRate: 0,
    cost: 0,
    description: 'A tainted memory that weakens your deck.',
  },
];

export function generateCard(): Card {
  const roll = Math.random() * 100;
  let targetRarity: Rarity;
  
  if (roll < 60) targetRarity = 'common';
  else if (roll < 90) targetRarity = 'uncommon';
  else if (roll < 95) targetRarity = 'rare';
  else if (roll < 98) targetRarity = 'legendary';
  else targetRarity = 'secret';

  const filtered = cardTemplates.filter(c => c.rarity === targetRarity);
  const template = filtered[Math.floor(Math.random() * filtered.length)];
  
  return {
    ...template,
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
}

export function generateStarterDeck(): Card[] {
  const deck: Card[] = [];
  
  // 3 common cards
  for (let i = 0; i < 3; i++) {
    const commons = cardTemplates.filter(c => c.rarity === 'common' && c.type !== 'curse');
    const template = commons[Math.floor(Math.random() * commons.length)];
    deck.push({
      ...template,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });
  }
  
  // 2 uncommon cards
  for (let i = 0; i < 2; i++) {
    const uncommons = cardTemplates.filter(c => c.rarity === 'uncommon');
    const template = uncommons[Math.floor(Math.random() * uncommons.length)];
    deck.push({
      ...template,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });
  }
  
  return deck;
}

export function generateLootboxCards(count: number = 3): Card[] {
  return Array.from({ length: count }, () => generateCard());
}
