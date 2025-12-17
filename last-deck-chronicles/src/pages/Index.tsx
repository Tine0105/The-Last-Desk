import { useState } from 'react';
import { Card } from '@/types/game';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useGameState } from '@/hooks/useGameState';
import { MainMenu } from '@/components/game/MainMenu';
import { GameHeader } from '@/components/game/GameHeader';
import { BattleScreen } from '@/components/game/BattleScreen';
import { ResultScreen } from '@/components/game/ResultScreen';
import { LootboxModal } from '@/components/game/LootboxModal';
import { BuyCoinsModal } from '@/components/game/BuyCoinsModal';
import { MiningStation } from '@/components/game/MiningStation';
import { DeckManager } from '@/components/game/DeckManager';
import { NFTCollection } from '@/components/game/NFTCollection';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { X } from 'lucide-react';

type ViewType = 'menu' | 'mining' | 'deck' | 'nfts';

const Index = () => {
  const currentAccount = useCurrentAccount();
  const walletAddress = currentAccount?.address ?? null;
  
  const {
    player,
    gameState,
    pendingNFT,
    startRun,
    selectCard,
    deselectCard,
    executeBattle,
    nextStage,
    spendCoins,
    addCoins,
    returnToMenu,
    addCardToDeck,
    removeCardFromDeck,
    removeNFT,
  } = useGameState(walletAddress);

  const [currentView, setCurrentView] = useState<ViewType>('menu');
  const [showLootbox, setShowLootbox] = useState(false);
  const [showBuyCoins, setShowBuyCoins] = useState(false);

  const handleStartRun = () => {
    const success = startRun();
    if (success) {
      toast.success('Run started! Good luck, traveler.');
    } else {
      toast.error('Not enough coins!');
    }
    return success;
  };

  const handleAddCard = (card: Card) => {
    addCardToDeck(card);
    toast.success(`${card.name} added to your deck!`);
  };

  const handleRemoveCard = (cardId: string) => {
    removeCardFromDeck(cardId);
    toast.success('Card removed from deck!');
  };

  // Deck Manager view
  if (currentView === 'deck' && gameState.phase === 'menu') {
    return (
      <>
        <DeckManager
          deck={player.deck}
          onRemoveCard={handleRemoveCard}
          onClose={() => setCurrentView('menu')}
        />
        <Toaster />
      </>
    );
  }

  // NFT Collection view
  if (currentView === 'nfts' && gameState.phase === 'menu') {
    return (
      <>
        <NFTCollection
          nfts={player.bossNFTs}
          onClose={() => setCurrentView('menu')}
          onTransferNFT={removeNFT}
          walletConnected={!!walletAddress}
        />
        <Toaster />
      </>
    );
  }

  // Mining view
  if (currentView === 'mining' && gameState.phase === 'menu') {
    return (
      <div className="min-h-screen">
        <header className="p-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentView('menu')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="font-orbitron">Back to Menu</span>
          </button>
          <div className="flex items-center gap-2 text-neon-gold font-orbitron">
            <span>{player.coins}</span>
            <span className="text-sm">coins</span>
          </div>
        </header>
        <main className="max-w-2xl mx-auto p-4">
          <MiningStation
            coins={player.coins}
            onSpendCoins={spendCoins}
            onAddCard={handleAddCard}
          />
        </main>
        <Toaster />
      </div>
    );
  }

  // Main menu
  if (gameState.phase === 'menu') {
    return (
      <>
        <MainMenu
          player={player}
          isConnected={!!walletAddress}
          onStartRun={handleStartRun}
          onOpenLootbox={() => setShowLootbox(true)}
          onOpenMining={() => setCurrentView('mining')}
          onOpenDeck={() => setCurrentView('deck')}
          onOpenNFTs={() => setCurrentView('nfts')}
          onOpenBuyCoins={() => setShowBuyCoins(true)}
        />
        <LootboxModal
          isOpen={showLootbox}
          onClose={() => setShowLootbox(false)}
          onAddCard={handleAddCard}
        />
        <BuyCoinsModal
          isOpen={showBuyCoins}
          onClose={() => setShowBuyCoins(false)}
          onAddCoins={addCoins}
          walletAddress={walletAddress}
        />
        <Toaster />
      </>
    );
  }

  // Battle phase
  if (gameState.phase === 'battle' && gameState.currentBoss) {
    return (
      <div className="min-h-screen">
        <GameHeader
          player={player}
          gameState={gameState}
        />
        <main className="max-w-4xl mx-auto p-4 py-8">
          <BattleScreen
            deck={player.deck}
            boss={gameState.currentBoss}
            selectedCards={gameState.selectedCards}
            battleLog={gameState.battleLog}
            onSelectCard={selectCard}
            onDeselectCard={deselectCard}
            onExecuteBattle={executeBattle}
          />
        </main>
        <Toaster />
      </div>
    );
  }

  // Victory or Defeat
  if (gameState.phase === 'victory' || gameState.phase === 'defeat') {
    return (
      <div className="min-h-screen">
        <GameHeader
          player={player}
          gameState={gameState}
        />
        <main className="max-w-4xl mx-auto p-4">
          <ResultScreen
            type={gameState.phase}
            player={player}
            gameState={gameState}
            pendingNFT={pendingNFT}
            onNextStage={nextStage}
            onReturnToMenu={returnToMenu}
          />
        </main>
        <Toaster />
      </div>
    );
  }

  return null;
};

export default Index;
