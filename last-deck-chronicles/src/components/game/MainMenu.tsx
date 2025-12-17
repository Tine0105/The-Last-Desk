import { Player } from '@/types/game';
import { Button } from '@/components/ui/button';
import { SuiWalletConnect } from './SuiWalletConnect';
import { PlayerStats } from './PlayerStats';
import { Play, Gift, HardDrive, Info, Coins, Pickaxe, Layers, Trophy, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainMenuProps {
  player: Player;
  isConnected: boolean;
  onStartRun: () => boolean;
  onOpenLootbox: () => void;
  onOpenMining: () => void;
  onOpenDeck: () => void;
  onOpenNFTs: () => void;
  onOpenBuyCoins: () => void;
}

export function MainMenu({ 
  player, 
  isConnected, 
  onStartRun, 
  onOpenLootbox, 
  onOpenMining,
  onOpenDeck,
  onOpenNFTs,
  onOpenBuyCoins,
}: MainMenuProps) {
  const handleStart = () => {
    if (!isConnected) return;
    if (player.coins < 10) return;
    onStartRun();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-orbitron text-sm text-muted-foreground">SUI TESTNET</span>
        </div>
        <SuiWalletConnect />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-4 tracking-wider">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              THE LAST
            </span>
            <br />
            <span className="text-foreground neon-text">DECK</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            A roguelike card game where memories become your weapons.
            Build your deck. Fight the void. Collect Boss NFTs.
          </p>
        </div>

        {/* Stats panel (if connected) */}
        {isConnected && (
          <div className="w-full max-w-sm mb-8 animate-fade-in">
            <PlayerStats 
              player={player} 
              gameState={{ phase: 'menu', currentStage: 0, currentBoss: null, selectedCards: [], battleLog: [], runScore: 0 }} 
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          {isConnected ? (
            <>
              <Button
                onClick={handleStart}
                disabled={player.coins < 10}
                className={cn(
                  'bg-gradient-to-r from-primary to-secondary text-primary-foreground',
                  'hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]',
                  'font-orbitron py-8 text-xl',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                )}
              >
                <Play className="w-6 h-6 mr-3" />
                START RUN
                <span className="ml-3 text-sm opacity-80 flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  10
                </span>
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={onOpenDeck}
                  variant="outline"
                  className={cn(
                    'border-primary/50 text-primary hover:bg-primary/10',
                    'font-orbitron py-6',
                  )}
                >
                  <Layers className="w-5 h-5 mr-2" />
                  Deck
                  <span className="ml-2 text-xs opacity-80">{player.deck.length}</span>
                </Button>

                <Button
                  onClick={onOpenNFTs}
                  variant="outline"
                  className={cn(
                    'border-neon-gold/50 text-neon-gold hover:bg-neon-gold/10',
                    'font-orbitron py-6',
                  )}
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  NFTs
                  <span className="ml-2 text-xs opacity-80">{player.bossNFTs.length}</span>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={onOpenLootbox}
                  disabled={player.coins < 50}
                  variant="outline"
                  className={cn(
                    'border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10',
                    'font-orbitron py-6',
                  )}
                >
                  <Gift className="w-5 h-5 mr-2" />
                  Lootbox
                  <span className="ml-2 text-xs opacity-80">50</span>
                </Button>

                <Button
                  onClick={onOpenMining}
                  variant="outline"
                  className={cn(
                    'border-neon-orange/50 text-neon-orange hover:bg-neon-orange/10',
                    'font-orbitron py-6',
                  )}
                >
                  <Pickaxe className="w-5 h-5 mr-2" />
                  Mining
                </Button>
                <Button
                  onClick={onOpenBuyCoins}
                  className={cn(
                    'bg-gradient-to-r from-neon-gold to-neon-orange text-primary-foreground',
                    'hover:shadow-[0_0_20px_hsl(var(--neon-gold)/0.5)]',
                    'font-orbitron py-6 col-span-2',
                  )}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Coins with SUI
                </Button>
              </div>

              {player.coins < 10 && (
                <p className="text-center text-destructive text-sm">
                  Not enough coins! Buy more or try mining.
                </p>
              )}
            </>
          ) : (
            <div className="text-center p-6 glass-panel rounded-xl">
              <Info className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Connect your Sui wallet to start playing
              </p>
              <SuiWalletConnect />
            </div>
          )}
        </div>

        {/* Game info */}
        <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg w-full">
          <InfoCard
            title="Play"
            description="Select 3 cards to attack bosses"
            icon="🎮"
          />
          <InfoCard
            title="Collect"
            description="Defeat bosses to claim their NFTs"
            icon="🏆"
          />
          <InfoCard
            title="On-Chain"
            description="All NFTs stored on Sui Testnet"
            icon="⛓️"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-muted-foreground">
        Built for Sui Testnet | Web3 Roguelike Card Game
      </footer>
    </div>
  );
}

function InfoCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="glass-panel rounded-lg p-4 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-orbitron text-sm font-bold mb-1">{title}</h3>
      <p className="text-[10px] text-muted-foreground">{description}</p>
    </div>
  );
}
