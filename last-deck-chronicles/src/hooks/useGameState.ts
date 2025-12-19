import { useState, useCallback, useEffect } from 'react';
import { Card, Boss, Player, GameState, BattleLogEntry, BossNFT } from '@/types/game';
import { winStageAndFetchNFT } from '@/web3/playerState';
import { usePlayerSync } from '@/hooks/usePlayerSync';
import { suiClient } from '@/web3/suiClient';
import { generateStarterDeck, generateCard } from '@/data/cards';
import { generateBoss } from '@/data/bosses';

const initialGameState: GameState = {
  phase: 'menu',
  currentStage: 0,
  currentBoss: null,
  selectedCards: [],
  battleLog: [],
  runScore: 0,
};

export function useGameState(walletAddress: string | null) {
  const [player, setPlayer] = useState<Player>({
    address: walletAddress,
    coins: 100,
    deck: [],
    totalRuns: 0,
    bestScore: 0,
    maxStage: 0,
    bossNFTs: [],
  });
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [pendingNFT, setPendingNFT] = useState<BossNFT | null>(null);

  // Player sync hooks (used to persist NFTs on successful on-chain mint)
  const { saveNFT } = usePlayerSync(walletAddress);

  // Sync wallet address changes
  useEffect(() => {
    setPlayer(prev => ({
      ...prev,
      address: walletAddress,
      deck: walletAddress && prev.deck.length === 0 ? generateStarterDeck() : prev.deck,
    }));
  }, [walletAddress]);

  const startRun = useCallback(() => {
    if (player.coins < 10) return false;
    
    // Only generate starter deck if player has no cards
    const currentDeck = player.deck.length > 0 ? player.deck : generateStarterDeck();
    
    setPlayer(prev => ({
      ...prev,
      coins: prev.coins - 10,
      deck: currentDeck,
      totalRuns: prev.totalRuns + 1,
    }));
    
    const boss = generateBoss(1);
    setGameState({
      phase: 'battle',
      currentStage: 1,
      currentBoss: boss,
      selectedCards: [],
      battleLog: [{ type: 'attack', message: `Stage 1: ${boss.name} appears!` }],
      runScore: 0,
    });
    
    return true;
  }, [player.coins, player.deck]);

  const selectCard = useCallback((card: Card) => {
    setGameState(prev => {
      if (prev.selectedCards.length >= 3) return prev;
      if (prev.selectedCards.find(c => c.id === card.id)) return prev;
      
      return {
        ...prev,
        selectedCards: [...prev.selectedCards, card],
      };
    });
  }, []);

  const deselectCard = useCallback((cardId: string) => {
    setGameState(prev => ({
      ...prev,
      selectedCards: prev.selectedCards.filter(c => c.id !== cardId),
    }));
  }, []);

  const executeBattle = useCallback(() => {
    if (gameState.selectedCards.length !== 3 || !gameState.currentBoss) return null;
    
    const boss = { ...gameState.currentBoss };
    const log: BattleLogEntry[] = [];
    let totalDamage = 0;
    
    gameState.selectedCards.forEach(card => {
      const isCrit = Math.random() * 100 < card.critRate;
      let damage = Math.max(0, card.atk - boss.def);
      
      if (isCrit) {
        damage = Math.floor(damage * 2);
        log.push({
          type: 'crit',
          message: `${card.name} CRITICAL HIT!`,
          value: damage,
        });
      } else {
        log.push({
          type: 'attack',
          message: `${card.name} attacks!`,
          value: damage,
        });
      }
      
      totalDamage += damage;
    });
    
    boss.hp = Math.max(0, boss.hp - totalDamage);
    
    log.push({
      type: 'damage',
      message: `Total damage: ${totalDamage}`,
      value: totalDamage,
    });
    
    const victory = boss.hp <= 0;
    
    if (victory) {
      const reward = 20 + (gameState.currentStage * 10);
      log.push({
        type: 'victory',
        message: `Victory! Boss defeated! +${reward} coins`,
        value: reward,
      });

      // Create Boss NFT reward
      const bossNFT: BossNFT = {
        id: `nft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        boss: { ...gameState.currentBoss },
        mintedAt: Date.now(),
        runScore: gameState.runScore + (gameState.currentStage * 100),
        stageDefeated: gameState.currentStage,
      };
      setPendingNFT(bossNFT);
      
      setPlayer(prev => ({
        ...prev,
        coins: prev.coins + reward,
        maxStage: Math.max(prev.maxStage, gameState.currentStage),
      }));
      
      setGameState(prev => ({
        ...prev,
        currentBoss: boss,
        battleLog: [...prev.battleLog, ...log],
        runScore: prev.runScore + (gameState.currentStage * 100),
        phase: 'victory',
      }));
    } else {
      const bossAttack = boss.atk;
      log.push({
        type: 'damage',
        message: `${boss.name} strikes back for ${bossAttack} damage!`,
        value: bossAttack,
      });
      
      log.push({
        type: 'defeat',
        message: `Defeat! Boss has ${boss.hp} HP remaining.`,
      });
      
      setPlayer(prev => ({
        ...prev,
        bestScore: Math.max(prev.bestScore, gameState.runScore),
      }));
      
      setGameState(prev => ({
        ...prev,
        currentBoss: boss,
        battleLog: [...prev.battleLog, ...log],
        phase: 'defeat',
      }));
    }
    
    return { victory, boss, log };
  }, [gameState]);

  const claimNFT = useCallback(() => {
    if (pendingNFT) {
      setPlayer(prev => ({
        ...prev,
        bossNFTs: [...prev.bossNFTs, pendingNFT],
      }));
      setPendingNFT(null);
    }
  }, [pendingNFT]);

  // Submit the win on-chain using a wallet object that implements
  // `signAndExecuteTransactionBlock`. Caller must provide the wallet and
  // the on-chain `playerObjectId` (PlayerState object id owned by the player).
  const submitWinOnChain = useCallback(async (wallet: any, playerObjectId: string) => {
    if (!gameState.currentStage) return null;
    try {
      const stage = gameState.currentStage;
      const level = player.level;
      const gold = player.coins;
      const seed = player.seed ?? 0;
      const lastUpdated = Date.now();

      const result = await winStageAndFetchNFT(wallet, playerObjectId, stage, level, gold, seed, lastUpdated);
      const created = result?.created ?? [];
      if (created.length === 0) return result;

      const nftId = created[0].objectId;
      // Fetch object content to extract metadata if possible
      try {
        const objRes: any = await suiClient.getObject({ id: nftId, options: { showContent: true } });
        const content = objRes?.data?.content ?? objRes?.data ?? objRes;
        // Attempt to extract fields safely
        const fields = content?.data?.fields ?? content?.fields ?? content?.content?.fields ?? {};
        const name = fields?.name ?? '';
        const image_url = fields?.image_url ?? fields?.imageUrl ?? fields?.image ?? '';
        const stageField = fields?.stage ?? fields?.stage_defeated ?? stage;

        const bossNFT: BossNFT = {
          id: nftId,
          boss: {
            id: `boss-${stageField}`,
            name: typeof name === 'string' ? name : '',
            image: typeof image_url === 'string' ? image_url : '',
            rarity: 'common',
            hp: 0,
            maxHp: 0,
            atk: 0,
            def: 0,
            stage: Number(stageField) || stage,
          },
          mintedAt: Date.now(),
          runScore: gameState.runScore,
          stageDefeated: Number(stageField) || stage,
        };

        // persist via sync hook if available
        try { await saveNFT(bossNFT); } catch (_) {}
        setPlayer(prev => ({ ...prev, bossNFTs: [...prev.bossNFTs, bossNFT] }));
        setPendingNFT(null);
      } catch (err) {
        return result;
      }

      return result;
    } catch (err) {
      console.error('submitWinOnChain error', err);
      throw err;
    }
  }, [gameState, player, saveNFT]);

  const nextStage = useCallback(() => {
    // Claim NFT if pending
    claimNFT();
    
    const nextStageNum = gameState.currentStage + 1;
    
    if (nextStageNum > 8) {
      setPlayer(prev => ({
        ...prev,
        bestScore: Math.max(prev.bestScore, gameState.runScore + 1000),
      }));
      setGameState(prev => ({
        ...prev,
        phase: 'menu',
        runScore: prev.runScore + 1000,
      }));
      return;
    }
    
    const newCard = generateCard();
    setPlayer(prev => ({
      ...prev,
      deck: [...prev.deck, newCard],
    }));
    
    const boss = generateBoss(nextStageNum);
    setGameState(prev => ({
      ...prev,
      phase: 'battle',
      currentStage: nextStageNum,
      currentBoss: boss,
      selectedCards: [],
      battleLog: [{ type: 'attack', message: `Stage ${nextStageNum}: ${boss.name} appears!` }],
    }));
  }, [gameState, claimNFT]);

  const spendCoins = useCallback((amount: number) => {
    if (player.coins < amount) return false;
    setPlayer(prev => ({ ...prev, coins: prev.coins - amount }));
    return true;
  }, [player.coins]);

  const returnToMenu = useCallback(() => {
    claimNFT();
    setGameState(initialGameState);
  }, [claimNFT]);

  const addCardToDeck = useCallback((card: Card) => {
    setPlayer(prev => ({
      ...prev,
      deck: [...prev.deck, card],
    }));
  }, []);

  const removeCardFromDeck = useCallback((cardId: string) => {
    setPlayer(prev => ({
      ...prev,
      deck: prev.deck.filter(c => c.id !== cardId),
    }));
  }, []);

  const addCoins = useCallback((amount: number) => {
    setPlayer(prev => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const removeNFT = useCallback((nftId: string) => {
    setPlayer(prev => ({
      ...prev,
      bossNFTs: prev.bossNFTs.filter(nft => nft.id !== nftId),
    }));
  }, []);

  return {
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
    claimNFT,
    removeNFT,
    // Expose helper for callers to submit the win on-chain. Caller must provide a
    // wallet object implementing `signAndExecuteTransactionBlock` and the
    // on-chain `PlayerState` object id.
    submitWinOnChain,
  };
}
