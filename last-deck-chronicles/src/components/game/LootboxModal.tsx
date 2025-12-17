import { useState } from 'react';
import { Card } from '@/types/game';
import { GameCard } from './GameCard';
import { Button } from '@/components/ui/button';
import { generateLootboxCards } from '@/data/cards';
import { Gift, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LootboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: Card) => void;
}

export function LootboxModal({ isOpen, onClose, onAddCard }: LootboxModalProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleOpen = async () => {
    setIsOpening(true);
    setCards([]);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newCards = generateLootboxCards(3);
    setCards(newCards);
    setIsOpening(false);
  };

  const handleSelectCard = (card: Card) => {
    setSelectedCard(card);
    onAddCard(card);
    
    setTimeout(() => {
      setCards([]);
      setSelectedCard(null);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-panel rounded-2xl p-8 max-w-2xl w-full mx-4 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="font-orbitron text-2xl font-bold neon-text mb-2">
            Memory Lootbox
          </h2>
          <p className="text-muted-foreground">
            {cards.length > 0 ? 'Choose one card to add to your deck!' : 'Open the box to reveal your cards'}
          </p>
        </div>

        {/* Cards display */}
        {cards.length > 0 ? (
          <div className="flex justify-center gap-4 mb-6">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <GameCard
                  card={card}
                  size="lg"
                  onClick={() => handleSelectCard(card)}
                  selected={selectedCard?.id === card.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center mb-6">
            <div 
              className={cn(
                'w-32 h-44 rounded-xl border-2 border-dashed border-primary/50',
                'flex items-center justify-center',
                'bg-gradient-to-br from-primary/10 to-secondary/10',
                isOpening && 'animate-pulse',
              )}
            >
              {isOpening ? (
                <Sparkles className="w-12 h-12 text-primary animate-spin" />
              ) : (
                <Gift className="w-12 h-12 text-primary" />
              )}
            </div>
          </div>
        )}

        {!cards.length && (
          <div className="flex justify-center">
            <Button
              onClick={handleOpen}
              disabled={isOpening}
              className={cn(
                'bg-gradient-to-r from-neon-gold to-neon-orange text-primary-foreground',
                'hover:shadow-[0_0_20px_hsl(var(--neon-gold)/0.5)]',
                'font-orbitron px-8 py-6 text-lg',
              )}
            >
              {isOpening ? 'Opening...' : 'Open Lootbox'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
