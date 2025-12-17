import { Card } from '@/types/game';
import { GameCard } from './GameCard';
import { Button } from '@/components/ui/button';
import { Trash2, Layers, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DeckManagerProps {
  deck: Card[];
  onRemoveCard: (cardId: string) => void;
  onClose: () => void;
}

type FilterType = 'all' | 'attack' | 'skill' | 'curse' | 'relic';
type SortType = 'rarity' | 'atk' | 'hp' | 'cost' | 'name';

const rarityOrder = { common: 0, uncommon: 1, rare: 2, legendary: 3, secret: 4 };

export function DeckManager({ deck, onRemoveCard, onClose }: DeckManagerProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('rarity');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const filteredDeck = deck
    .filter(card => filter === 'all' || card.type === filter)
    .sort((a, b) => {
      switch (sort) {
        case 'rarity':
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'atk':
          return b.atk - a.atk;
        case 'hp':
          return b.hp - a.hp;
        case 'cost':
          return a.cost - b.cost;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const curseCount = deck.filter(c => c.type === 'curse').length;
  const stats = {
    total: deck.length,
    attack: deck.filter(c => c.type === 'attack').length,
    skill: deck.filter(c => c.type === 'skill').length,
    curse: curseCount,
    relic: deck.filter(c => c.type === 'relic').length,
    avgAtk: deck.length > 0 ? Math.round(deck.reduce((sum, c) => sum + c.atk, 0) / deck.length) : 0,
  };

  const handleRemove = (card: Card) => {
    if (card.type === 'curse' || window.confirm(`Remove ${card.name} from your deck?`)) {
      onRemoveCard(card.id);
      setSelectedCard(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-panel border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-orbitron text-xl font-bold">Deck Manager</h1>
              <span className="text-sm text-muted-foreground">{deck.length} cards</span>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <StatBox label="Total" value={stats.total} color="text-foreground" />
          <StatBox label="Attack" value={stats.attack} color="text-neon-orange" />
          <StatBox label="Skill" value={stats.skill} color="text-neon-cyan" />
          <StatBox label="Curse" value={stats.curse} color="text-destructive" />
          <StatBox label="Relic" value={stats.relic} color="text-neon-gold" />
          <StatBox label="Avg ATK" value={stats.avgAtk} color="text-neon-pink" />
        </div>

        {/* Filters & Sort */}
        <div className="glass-panel rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter:</span>
              {(['all', 'attack', 'skill', 'curse', 'relic'] as FilterType[]).map(f => (
                <Button
                  key={f}
                  size="sm"
                  variant={filter === f ? 'default' : 'outline'}
                  onClick={() => setFilter(f)}
                  className="capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortType)}
                className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="rarity">Rarity</option>
                <option value="atk">Attack</option>
                <option value="hp">HP</option>
                <option value="cost">Cost</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Curse Warning */}
        {curseCount > 0 && (
          <div className="glass-panel rounded-xl p-4 mb-6 border border-destructive/30 bg-destructive/5">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-bold text-destructive">
                  You have {curseCount} curse card{curseCount > 1 ? 's' : ''} in your deck!
                </p>
                <p className="text-sm text-muted-foreground">
                  Curse cards weaken your deck. Click on them to remove.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="glass-panel rounded-xl p-4">
          {filteredDeck.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredDeck.map((card, index) => (
                <div
                  key={card.id}
                  className="animate-fade-in relative group"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <GameCard
                    card={card}
                    size="sm"
                    onClick={() => setSelectedCard(card)}
                    selected={selectedCard?.id === card.id}
                  />
                  {card.type === 'curse' && (
                    <button
                      onClick={() => handleRemove(card)}
                      className={cn(
                        'absolute -top-2 -right-2 w-6 h-6 rounded-full',
                        'bg-destructive text-destructive-foreground',
                        'flex items-center justify-center',
                        'opacity-0 group-hover:opacity-100 transition-opacity',
                        'hover:scale-110'
                      )}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No cards match the current filter</p>
            </div>
          )}
        </div>

        {/* Selected Card Detail */}
        {selectedCard && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 glass-panel rounded-xl p-4 flex items-center gap-4 animate-slide-up">
            <GameCard card={selectedCard} size="sm" />
            <div className="max-w-xs">
              <h3 className="font-orbitron font-bold">{selectedCard.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{selectedCard.description}</p>
              {selectedCard.type === 'curse' ? (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemove(selectedCard)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Curse
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedCard(null)}
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass-panel rounded-lg p-3 text-center">
      <div className="text-xs text-muted-foreground uppercase">{label}</div>
      <div className={cn('font-orbitron text-xl font-bold', color)}>{value}</div>
    </div>
  );
}
