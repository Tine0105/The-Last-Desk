import { Player, GameState } from '@/types/game';
import { cn } from '@/lib/utils';
import { Wallet, Coins, Trophy, Layers, Target } from 'lucide-react';

interface PlayerStatsProps {
  player: Player;
  gameState: GameState;
}

export function PlayerStats({ player, gameState }: PlayerStatsProps) {
  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Wallet className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Wallet</div>
          <div className="font-mono text-sm truncate">
            {player.address ? `${player.address.slice(0, 8)}...${player.address.slice(-6)}` : 'Not Connected'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatItem
          icon={Coins}
          label="Coins"
          value={player.coins}
          color="text-neon-gold"
        />
        <StatItem
          icon={Trophy}
          label="Best Score"
          value={player.bestScore}
          color="text-neon-green"
        />
        <StatItem
          icon={Layers}
          label="Max Stage"
          value={player.maxStage}
          color="text-neon-purple"
        />
        <StatItem
          icon={Target}
          label="Total Runs"
          value={player.totalRuns}
          color="text-neon-cyan"
        />
      </div>

      {gameState.phase === 'battle' && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Run Score</span>
            <span className="font-orbitron font-bold text-lg text-primary">
              {gameState.runScore}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatItem({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
      <Icon className={cn('w-4 h-4', color)} />
      <div>
        <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
        <div className="font-orbitron font-bold">{value}</div>
      </div>
    </div>
  );
}
