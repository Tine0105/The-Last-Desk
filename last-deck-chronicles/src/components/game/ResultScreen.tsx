import { Player, GameState, BossNFT } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Trophy, Skull, ArrowRight, Home, Coins, Sparkles, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultScreenProps {
  type: 'victory' | 'defeat';
  player: Player;
  gameState: GameState;
  pendingNFT: BossNFT | null;
  onNextStage: () => void;
  onReturnToMenu: () => void;
}

export function ResultScreen({ type, player, gameState, pendingNFT, onNextStage, onReturnToMenu }: ResultScreenProps) {
  const isVictory = type === 'victory';
  
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className={cn(
        'glass-panel rounded-2xl p-8 max-w-lg w-full text-center',
        'border-2',
        isVictory ? 'border-neon-green/50' : 'border-destructive/50',
      )}>
        {/* Icon */}
        <div className={cn(
          'w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center',
          'animate-scale-in',
          isVictory 
            ? 'bg-gradient-to-br from-neon-green/30 to-neon-cyan/30 shadow-[0_0_40px_hsl(var(--neon-green)/0.3)]'
            : 'bg-gradient-to-br from-destructive/30 to-neon-orange/30 shadow-[0_0_40px_hsl(var(--destructive)/0.3)]',
        )}>
          {isVictory ? (
            <Trophy className="w-12 h-12 text-neon-green" />
          ) : (
            <Skull className="w-12 h-12 text-destructive" />
          )}
        </div>

        {/* Title */}
        <h2 className={cn(
          'font-orbitron text-3xl font-bold mb-2',
          isVictory ? 'text-neon-green neon-text' : 'text-destructive',
        )}>
          {isVictory ? 'VICTORY!' : 'DEFEAT'}
        </h2>

        <p className="text-muted-foreground mb-6">
          {isVictory 
            ? 'You have conquered this stage!' 
            : 'Your memories fade into oblivion...'}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="text-xs text-muted-foreground uppercase">Stage</div>
            <div className="font-orbitron text-xl font-bold">{gameState.currentStage}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="text-xs text-muted-foreground uppercase">Score</div>
            <div className="font-orbitron text-xl font-bold text-primary">{gameState.runScore}</div>
          </div>
        </div>

        {isVictory && (
          <div className="flex items-center justify-center gap-2 mb-4 text-neon-gold">
            <Coins className="w-5 h-5" />
            <span className="font-orbitron font-bold">+{20 + (gameState.currentStage * 10)} Coins</span>
          </div>
        )}

        {/* NFT Reward */}
        {isVictory && pendingNFT && (
          <div className="mb-6 p-4 rounded-xl bg-neon-gold/10 border border-neon-gold/30 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-neon-gold" />
              <span className="font-orbitron font-bold text-neon-gold">BOSS NFT REWARD!</span>
            </div>
            
            <div className="flex items-center gap-4">
              {pendingNFT.boss.image && (
                <img
                  src={pendingNFT.boss.image}
                  alt={pendingNFT.boss.name}
                  className="w-20 h-20 rounded-lg object-cover border-2 border-neon-gold/50"
                />
              )}
              <div className="text-left flex-1">
                <h4 className="font-orbitron font-bold">{pendingNFT.boss.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Stage {pendingNFT.stageDefeated} • {pendingNFT.boss.rarity.toUpperCase()}
                </p>
                <p className="text-xs text-neon-green">
                  This NFT will be added to your collection!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {isVictory && gameState.currentStage < 8 && (
            <Button
              onClick={onNextStage}
              className={cn(
                'bg-gradient-to-r from-neon-green to-neon-cyan text-primary-foreground',
                'hover:shadow-[0_0_20px_hsl(var(--neon-green)/0.5)]',
                'font-orbitron w-full py-6',
              )}
            >
              {pendingNFT && <Sparkles className="w-5 h-5 mr-2" />}
              Claim NFT & Next Stage
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
          
          <Button
            onClick={onReturnToMenu}
            variant="outline"
            className="font-orbitron w-full py-6"
          >
            <Home className="w-5 h-5 mr-2" />
            {isVictory && pendingNFT ? 'Claim NFT & Return to Menu' : 'Return to Menu'}
          </Button>
        </div>

        {isVictory && gameState.currentStage >= 8 && (
          <div className="mt-4 p-4 rounded-lg bg-neon-gold/10 border border-neon-gold/30">
            <p className="font-orbitron text-neon-gold font-bold">
              🎉 Congratulations! You've completed all stages!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
