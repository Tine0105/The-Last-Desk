import { Card } from '@/types/game';
import { cn } from '@/lib/utils';
import { Sword, Shield, Heart, Zap } from 'lucide-react';

interface GameCardProps {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const rarityColors = {
  common: 'border-rarity-common',
  uncommon: 'border-rarity-uncommon',
  rare: 'border-rarity-rare',
  legendary: 'border-rarity-legendary',
  secret: 'border-rarity-secret',
};

const rarityGlows = {
  common: '',
  uncommon: 'shadow-[0_0_15px_hsl(var(--rarity-uncommon)/0.4)]',
  rare: 'shadow-[0_0_20px_hsl(var(--rarity-rare)/0.5)]',
  legendary: 'shadow-[0_0_25px_hsl(var(--rarity-legendary)/0.6)] animate-glow-pulse',
  secret: 'shadow-[0_0_30px_hsl(var(--rarity-secret)/0.7)]',
};

const rarityLabels = {
  common: 'bg-rarity-common/20 text-rarity-common',
  uncommon: 'bg-rarity-uncommon/20 text-rarity-uncommon',
  rare: 'bg-rarity-rare/20 text-rarity-rare',
  legendary: 'bg-rarity-legendary/20 text-rarity-legendary',
  secret: 'bg-rarity-secret/20 text-rarity-secret',
};

const sizeClasses = {
  sm: 'w-28 h-40',
  md: 'w-36 h-52',
  lg: 'w-44 h-64',
};

export function GameCard({ card, selected, onClick, size = 'md', disabled }: GameCardProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        'relative rounded-xl border-2 overflow-hidden transition-all duration-300 cursor-pointer',
        'bg-gradient-to-br from-card via-card to-background',
        sizeClasses[size],
        rarityColors[card.rarity],
        rarityGlows[card.rarity],
        selected && 'ring-2 ring-primary scale-105 -translate-y-2',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && !selected && 'hover:scale-105 hover:-translate-y-2',
      )}
    >
      {/* Card header */}
      <div className="p-2 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className={cn(
            'font-orbitron font-bold truncate',
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
          )}>
            {card.name}
          </h3>
          <div className={cn(
            'flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-neon-purple/20 text-neon-purple',
            size === 'sm' ? 'text-[10px]' : 'text-xs'
          )}>
            <Zap className={cn(size === 'sm' ? 'w-2 h-2' : 'w-3 h-3')} />
            {card.cost}
          </div>
        </div>
      </div>

      {/* Card art area */}
      <div className={cn(
        'relative bg-gradient-to-b from-muted/50 to-transparent flex items-center justify-center',
        size === 'sm' ? 'h-12' : size === 'md' ? 'h-16' : 'h-24'
      )}>
        <div className={cn(
          'rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center',
          size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16'
        )}>
          <Sword className={cn(
            'text-primary',
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'
          )} />
        </div>
      </div>

      {/* Stats */}
      <div className={cn(
        'grid grid-cols-2 gap-1 p-2',
        size === 'sm' ? 'text-[10px]' : 'text-xs'
      )}>
        <div className="flex items-center gap-1 text-neon-orange">
          <Sword className={cn(size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
          <span className="font-bold">{card.atk}</span>
        </div>
        <div className="flex items-center gap-1 text-neon-green">
          <Heart className={cn(size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
          <span className="font-bold">{card.hp}</span>
        </div>
        <div className="flex items-center gap-1 text-neon-cyan">
          <Shield className={cn(size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
          <span className="font-bold">{card.def}</span>
        </div>
        <div className="flex items-center gap-1 text-neon-pink">
          <Zap className={cn(size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
          <span className="font-bold">{card.critRate}%</span>
        </div>
      </div>

      {/* Rarity badge */}
      <div className={cn(
        'absolute bottom-2 left-2 right-2 text-center py-0.5 rounded font-orbitron uppercase',
        rarityLabels[card.rarity],
        size === 'sm' ? 'text-[8px]' : 'text-[10px]'
      )}>
        {card.rarity}
      </div>

      {/* Selection indicator */}
      {selected && (
        <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
      )}
    </div>
  );
}
