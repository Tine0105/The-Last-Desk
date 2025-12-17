import { Player, GameState } from '@/types/game';
import { SuiWalletConnect } from './SuiWalletConnect';
import { HardDrive, Coins, Target, Layers } from 'lucide-react';

interface GameHeaderProps {
  player: Player;
  gameState: GameState;
}

export function GameHeader({ player, gameState }: GameHeaderProps) {
  return (
    <header className="glass-panel border-b border-border p-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-orbitron text-lg font-bold">THE LAST DECK</h1>
            <span className="text-xs text-muted-foreground">SUI TESTNET</span>
          </div>
        </div>

        {/* Game stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-neon-gold">
            <Coins className="w-5 h-5" />
            <span className="font-orbitron font-bold">{player.coins}</span>
          </div>
          
          <div className="flex items-center gap-2 text-primary">
            <Target className="w-5 h-5" />
            <span className="font-orbitron font-bold">{gameState.runScore}</span>
          </div>

          <div className="flex items-center gap-2 text-secondary">
            <Layers className="w-5 h-5" />
            <span className="font-orbitron font-bold">Stage {gameState.currentStage}</span>
          </div>
        </div>

        {/* Wallet */}
        <SuiWalletConnect />
      </div>
    </header>
  );
}
