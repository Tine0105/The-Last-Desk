export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'secret';
export type CardType = 'attack' | 'skill' | 'curse' | 'relic';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  rarity: Rarity;
  atk: number;
  hp: number;
  def: number;
  critRate: number;
  cost: number;
  description: string;
  image?: string;
}

export interface Boss {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  rarity: Rarity;
  stage: number;
  image?: string;
  description?: string;
}

export interface BossNFT {
  id: string;
  boss: Boss;
  mintedAt: number;
  runScore: number;
  stageDefeated: number;
}

export interface Player {
  address: string | null;
  coins: number;
  deck: Card[];
  totalRuns: number;
  bestScore: number;
  maxStage: number;
  bossNFTs: BossNFT[];
}

export interface GameState {
  phase: 'menu' | 'battle' | 'victory' | 'defeat' | 'lootbox' | 'mining';
  currentStage: number;
  currentBoss: Boss | null;
  selectedCards: Card[];
  battleLog: BattleLogEntry[];
  runScore: number;
}

export interface BattleLogEntry {
  type: 'attack' | 'crit' | 'damage' | 'block' | 'victory' | 'defeat';
  message: string;
  value?: number;
}

export interface LootboxResult {
  cards: Card[];
  rarity: Rarity;
}
