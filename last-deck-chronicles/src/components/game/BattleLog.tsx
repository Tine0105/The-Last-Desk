import { BattleLogEntry } from '@/types/game';
import { cn } from '@/lib/utils';
import { Sword, Zap, Heart, Trophy, Skull } from 'lucide-react';

interface BattleLogProps {
  entries: BattleLogEntry[];
}

const entryStyles = {
  attack: 'text-neon-orange',
  crit: 'text-neon-pink font-bold',
  damage: 'text-neon-red',
  block: 'text-neon-cyan',
  victory: 'text-neon-green font-bold',
  defeat: 'text-destructive font-bold',
};

const entryIcons = {
  attack: Sword,
  crit: Zap,
  damage: Heart,
  block: Heart,
  victory: Trophy,
  defeat: Skull,
};

export function BattleLog({ entries }: BattleLogProps) {
  return (
    <div className="glass-panel rounded-xl p-4 max-h-48 overflow-y-auto">
      <h3 className="font-orbitron text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wider">
        Battle Log
      </h3>
      <div className="space-y-2">
        {entries.map((entry, index) => {
          const Icon = entryIcons[entry.type];
          return (
            <div
              key={index}
              className={cn(
                'flex items-center gap-2 text-sm animate-fade-in',
                entryStyles[entry.type],
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{entry.message}</span>
              {entry.value !== undefined && (
                <span className="ml-auto font-mono font-bold">
                  {entry.type === 'damage' ? '-' : ''}{entry.value}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
