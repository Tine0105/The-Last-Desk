import { useState } from 'react';
import { Card, Boss, BattleLogEntry } from '@/types/game';
import { GameCard } from './GameCard';
import { BossDisplay } from './BossDisplay';
import { BattleLog } from './BattleLog';
import { Button } from '@/components/ui/button';
import { Swords, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BattleScreenProps {
  deck: Card[];
  boss: Boss;
  selectedCards: Card[];
  battleLog: BattleLogEntry[];
  onSelectCard: (card: Card) => void;
  onDeselectCard: (cardId: string) => void;
  onExecuteBattle: () => void;
}

export function BattleScreen({
  deck,
  boss,
  selectedCards,
  battleLog,
  onSelectCard,
  onDeselectCard,
  onExecuteBattle,
}: BattleScreenProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBattle = async () => {
    if (selectedCards.length !== 3) return;
    
    setIsAnimating(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onExecuteBattle();
    setIsAnimating(false);
  };

  return (
    <div className="space-y-6">
      {/* Boss area */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <BossDisplay 
            boss={boss} 
            isAttacking={isAnimating}
          />
        </div>
      </div>

      {/* Battle log */}
      <BattleLog entries={battleLog} />

      {/* Selected cards */}
      <div className="glass-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-orbitron text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Selected Cards ({selectedCards.length}/3)
          </h3>
          {selectedCards.length > 0 && (
            <button
              onClick={() => selectedCards.forEach(c => onDeselectCard(c.id))}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
        
        <div className="flex gap-3 min-h-[160px] justify-center items-center">
          {selectedCards.length > 0 ? (
            selectedCards.map((card, index) => (
              <div
                key={card.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <GameCard
                  card={card}
                  size="sm"
                  selected
                  onClick={() => onDeselectCard(card.id)}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Select 3 cards from your deck to attack</p>
            </div>
          )}
        </div>

        {/* Attack button */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleBattle}
            disabled={selectedCards.length !== 3 || isAnimating}
            className={cn(
              'bg-gradient-to-r from-destructive to-neon-orange text-destructive-foreground',
              'hover:shadow-[0_0_20px_hsl(var(--destructive)/0.5)]',
              'font-orbitron px-8 py-6 text-lg',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            <Swords className="w-5 h-5 mr-2" />
            {isAnimating ? 'Attacking...' : 'ATTACK!'}
          </Button>
        </div>
      </div>

      {/* Deck */}
      <div className="glass-panel rounded-xl p-4">
        <h3 className="font-orbitron text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wider">
          Your Deck ({deck.length} cards)
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {deck.map((card, index) => {
            const isSelected = selectedCards.some(c => c.id === card.id);
            return (
              <div
                key={card.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <GameCard
                  card={card}
                  size="sm"
                  onClick={() => onSelectCard(card)}
                  disabled={isSelected || (selectedCards.length >= 3 && !isSelected)}
                  selected={isSelected}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
