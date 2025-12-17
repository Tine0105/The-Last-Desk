import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/types/game';
import { GameCard } from './GameCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { generateCard } from '@/data/cards';
import { Pickaxe, Coins, Sparkles, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MiningStationProps {
  coins: number;
  onSpendCoins: (amount: number) => boolean;
  onAddCard: (card: Card) => void;
}

interface MiningSlot {
  id: string;
  startTime: number;
  duration: number; // in seconds
  cost: number;
  isComplete: boolean;
  card: Card | null;
}

const MINING_OPTIONS = [
  { duration: 10, cost: 20, label: 'Quick Mine', rarity: 'Low chance of rare' },
  { duration: 30, cost: 50, label: 'Standard Mine', rarity: 'Medium chance of rare' },
  { duration: 60, cost: 100, label: 'Deep Mine', rarity: 'High chance of rare' },
];

export function MiningStation({ coins, onSpendCoins, onAddCard }: MiningStationProps) {
  const [activeSlots, setActiveSlots] = useState<MiningSlot[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every 100ms for smooth progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Check for completed mining operations
  useEffect(() => {
    setActiveSlots(prev => prev.map(slot => {
      if (!slot.isComplete && currentTime >= slot.startTime + (slot.duration * 1000)) {
        // Mining complete - generate card
        const card = generateCard();
        return { ...slot, isComplete: true, card };
      }
      return slot;
    }));
  }, [currentTime]);

  const startMining = useCallback((option: typeof MINING_OPTIONS[0]) => {
    if (!onSpendCoins(option.cost)) return;

    const newSlot: MiningSlot = {
      id: `mining-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startTime: Date.now(),
      duration: option.duration,
      cost: option.cost,
      isComplete: false,
      card: null,
    };

    setActiveSlots(prev => [...prev, newSlot]);
  }, [onSpendCoins]);

  const claimCard = useCallback((slotId: string) => {
    const slot = activeSlots.find(s => s.id === slotId);
    if (slot?.card) {
      onAddCard(slot.card);
      setActiveSlots(prev => prev.filter(s => s.id !== slotId));
    }
  }, [activeSlots, onAddCard]);

  const getProgress = (slot: MiningSlot) => {
    if (slot.isComplete) return 100;
    const elapsed = (currentTime - slot.startTime) / 1000;
    return Math.min(100, (elapsed / slot.duration) * 100);
  };

  const getRemainingTime = (slot: MiningSlot) => {
    if (slot.isComplete) return 0;
    const elapsed = (currentTime - slot.startTime) / 1000;
    return Math.max(0, slot.duration - elapsed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-orange to-neon-gold flex items-center justify-center">
          <Pickaxe className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-orbitron text-xl font-bold">Mining Station</h2>
          <p className="text-sm text-muted-foreground">Discover new cards over time</p>
        </div>
      </div>

      {/* Mining Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {MINING_OPTIONS.map((option, index) => (
          <div
            key={index}
            className={cn(
              'p-4 rounded-xl border transition-all duration-300',
              'bg-muted/30 border-border/50',
              'hover:border-neon-orange/50 hover:bg-muted/50',
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-neon-cyan" />
              <span className="font-orbitron text-sm">{option.duration}s</span>
            </div>
            <h3 className="font-bold mb-1">{option.label}</h3>
            <p className="text-xs text-muted-foreground mb-3">{option.rarity}</p>
            <Button
              onClick={() => startMining(option)}
              disabled={coins < option.cost}
              className={cn(
                'w-full',
                'bg-gradient-to-r from-neon-orange to-neon-gold text-primary-foreground',
                'hover:shadow-[0_0_15px_hsl(var(--neon-orange)/0.4)]',
              )}
              size="sm"
            >
              <Coins className="w-4 h-4 mr-1" />
              {option.cost}
            </Button>
          </div>
        ))}
      </div>

      {/* Active Mining Slots */}
      {activeSlots.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-orbitron text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Active Mining ({activeSlots.length})
          </h3>
          
          <div className="space-y-3">
            {activeSlots.map(slot => (
              <div
                key={slot.id}
                className={cn(
                  'p-4 rounded-xl border transition-all duration-300',
                  slot.isComplete
                    ? 'bg-neon-green/10 border-neon-green/50'
                    : 'bg-muted/30 border-border/50',
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {slot.isComplete ? (
                      <Sparkles className="w-5 h-5 text-neon-green animate-pulse" />
                    ) : (
                      <Pickaxe className="w-5 h-5 text-neon-orange animate-[spin_2s_linear_infinite]" />
                    )}
                    <span className="font-orbitron text-sm">
                      {slot.isComplete ? 'Complete!' : 'Mining...'}
                    </span>
                  </div>
                  {!slot.isComplete && (
                    <span className="font-mono text-sm text-muted-foreground">
                      {formatTime(getRemainingTime(slot))}
                    </span>
                  )}
                </div>

                {!slot.isComplete && (
                  <Progress 
                    value={getProgress(slot)} 
                    className="h-2 mb-2"
                  />
                )}

                {slot.isComplete && slot.card && (
                  <div className="flex items-center gap-4 mt-3">
                    <GameCard card={slot.card} size="sm" />
                    <Button
                      onClick={() => claimCard(slot.id)}
                      className={cn(
                        'bg-gradient-to-r from-neon-green to-neon-cyan text-primary-foreground',
                        'hover:shadow-[0_0_15px_hsl(var(--neon-green)/0.4)]',
                      )}
                    >
                      Claim Card
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSlots.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Pickaxe className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No active mining operations</p>
          <p className="text-sm">Start mining to discover new cards!</p>
        </div>
      )}
    </div>
  );
}
