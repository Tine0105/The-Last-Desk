import { Boss } from '@/types/game';
import { cn } from '@/lib/utils';
import { Sword, Shield, Heart, Sparkles } from 'lucide-react';

interface BossDisplayProps {
  boss: Boss;
  isAttacking?: boolean;
  isDamaged?: boolean;
}

const rarityColors = {
  common: 'from-rarity-common/30 to-rarity-common/10 border-rarity-common',
  uncommon: 'from-rarity-uncommon/30 to-rarity-uncommon/10 border-rarity-uncommon',
  rare: 'from-rarity-rare/30 to-rarity-rare/10 border-rarity-rare',
  legendary: 'from-rarity-legendary/30 to-rarity-legendary/10 border-rarity-legendary',
  secret: 'from-rarity-secret/30 to-rarity-secret/10 border-rarity-secret',
};

export function BossDisplay({ boss, isAttacking, isDamaged }: BossDisplayProps) {
  const hpPercent = (boss.hp / boss.maxHp) * 100;
  
  return (
    <div className={cn(
      'relative glass-panel rounded-2xl p-6 border-2 transition-all duration-300',
      'bg-gradient-to-b',
      rarityColors[boss.rarity],
      isAttacking && 'attack-animation',
      isDamaged && 'damage-animation',
    )}>
      {/* NFT Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-neon-gold/20 text-neon-gold text-xs font-bold z-10">
        <Sparkles className="w-3 h-3" />
        NFT
      </div>

      {/* Boss image */}
      <div className="flex justify-center mb-4">
        <div className={cn(
          'w-32 h-32 rounded-xl overflow-hidden',
          'border-2 border-border',
          'shadow-[0_0_30px_hsl(var(--destructive)/0.3)]',
        )}>
          {boss.image ? (
            <img 
              src={boss.image} 
              alt={boss.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-destructive/50 to-destructive/20 flex items-center justify-center">
              <Sword className="w-12 h-12 text-destructive" />
            </div>
          )}
        </div>
      </div>

      {/* Boss name */}
      <h2 className="font-orbitron text-xl font-bold text-center mb-2 neon-text-pink">
        {boss.name}
      </h2>

      {/* Stage badge */}
      <div className="flex justify-center mb-4">
        <span className={cn(
          'px-3 py-1 rounded-full text-xs font-orbitron uppercase',
          'bg-secondary/20 text-secondary border border-secondary/50'
        )}>
          Stage {boss.stage}
        </span>
      </div>

      {/* HP Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1 text-sm">
          <span className="flex items-center gap-1 text-neon-red">
            <Heart className="w-4 h-4" />
            HP
          </span>
          <span className="font-mono">{boss.hp} / {boss.maxHp}</span>
        </div>
        <div className="h-4 bg-muted rounded-full overflow-hidden border border-border">
          <div
            className={cn(
              'h-full transition-all duration-500 rounded-full',
              'bg-gradient-to-r from-neon-red to-neon-orange',
              hpPercent < 25 && 'animate-pulse',
            )}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
          <Sword className="w-5 h-5 text-neon-orange" />
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Attack</div>
            <div className="font-orbitron font-bold">{boss.atk}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
          <Shield className="w-5 h-5 text-neon-cyan" />
          <div>
            <div className="text-[10px] text-muted-foreground uppercase">Defense</div>
            <div className="font-orbitron font-bold">{boss.def}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      {boss.description && (
        <p className="mt-4 text-xs text-center text-muted-foreground italic">
          "{boss.description}"
        </p>
      )}

      {/* Rarity glow effect */}
      {boss.rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-2xl bg-rarity-legendary/5 animate-pulse pointer-events-none" />
      )}
      {boss.rarity === 'secret' && (
        <div className="absolute inset-0 rounded-2xl animate-[secret-rainbow_3s_linear_infinite] opacity-10 pointer-events-none" />
      )}
    </div>
  );
}
