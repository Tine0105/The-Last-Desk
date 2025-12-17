import { Boss, Rarity } from '@/types/game';

// Import boss images
import bossShadowFragment from '@/assets/boss-shadow-fragment.png';
import bossMemoryWraith from '@/assets/boss-memory-wraith.png';
import bossVoidSentinel from '@/assets/boss-void-sentinel.png';
import bossTimeDevourer from '@/assets/boss-time-devourer.png';
import bossCrimsonNightmare from '@/assets/boss-crimson-nightmare.png';
import bossOblivionLord from '@/assets/boss-oblivion-lord.png';
import bossForgottenKing from '@/assets/boss-forgotten-king.png';
import bossEternalVoid from '@/assets/boss-eternal-void.png';

export interface BossTemplate {
  name: string;
  atk: number;
  def: number;
  rarity: Rarity;
  stage: number;
  image: string;
  description: string;
}

const bossTemplates: BossTemplate[] = [
  {
    name: 'Shadow Fragment',
    atk: 15,
    def: 5,
    rarity: 'common',
    stage: 1,
    image: bossShadowFragment,
    description: 'A shard of darkness given form. The weakest of the void creatures.',
  },
  {
    name: 'Memory Wraith',
    atk: 20,
    def: 8,
    rarity: 'common',
    stage: 2,
    image: bossMemoryWraith,
    description: 'A spectral being born from forgotten memories.',
  },
  {
    name: 'Void Sentinel',
    atk: 28,
    def: 12,
    rarity: 'uncommon',
    stage: 3,
    image: bossVoidSentinel,
    description: 'Guardian of the void, forged from darkness and steel.',
  },
  {
    name: 'Time Devourer',
    atk: 35,
    def: 15,
    rarity: 'uncommon',
    stage: 4,
    image: bossTimeDevourer,
    description: 'An eldritch horror that consumes the fabric of time itself.',
  },
  {
    name: 'Crimson Nightmare',
    atk: 45,
    def: 20,
    rarity: 'rare',
    stage: 5,
    image: bossCrimsonNightmare,
    description: 'The embodiment of terror, burning with hellfire.',
  },
  {
    name: 'Oblivion Lord',
    atk: 55,
    def: 25,
    rarity: 'rare',
    stage: 6,
    image: bossOblivionLord,
    description: 'Ancient god of the void, wielder of cosmic power.',
  },
  {
    name: 'The Forgotten King',
    atk: 70,
    def: 30,
    rarity: 'legendary',
    stage: 7,
    image: bossForgottenKing,
    description: 'Once a great ruler, now an undead monarch seeking vengeance.',
  },
  {
    name: 'Eternal Void',
    atk: 100,
    def: 40,
    rarity: 'secret',
    stage: 8,
    image: bossEternalVoid,
    description: 'The ultimate darkness. The end of all existence.',
  },
];

export function generateBoss(stage: number): Boss {
  const template = bossTemplates.find(b => b.stage === stage) || bossTemplates[0];
  const baseHp = 50 + (stage * 30);
  
  return {
    ...template,
    id: `boss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    hp: baseHp,
    maxHp: baseHp,
  };
}

export function getAllBossTemplates(): BossTemplate[] {
  return bossTemplates;
}

export function getBossTemplate(stage: number): BossTemplate | undefined {
  return bossTemplates.find(b => b.stage === stage);
}
