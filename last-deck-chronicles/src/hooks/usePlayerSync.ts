import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, BossNFT, Player } from '@/types/game';

interface PlayerData {
  coins: number;
  totalRuns: number;
  bestScore: number;
  maxStage: number;
  deck: Card[];
  bossNFTs: BossNFT[];
}

export function usePlayerSync(walletAddress: string | null) {
  const isLoadingRef = useRef(false);
  const isSyncingRef = useRef(false);

  // Load player data from database
  const loadPlayerData = useCallback(async (): Promise<PlayerData | null> => {
    if (!walletAddress || isLoadingRef.current) return null;
    
    isLoadingRef.current = true;
    try {
      // Check if player exists
      const { data: player, error: playerError } = await supabase
        .from('players')
        .select('*')
        .eq('wallet_address', walletAddress)
        .maybeSingle();

      if (playerError) {
        console.error('Error loading player:', playerError);
        return null;
      }

      // If player doesn't exist, create new one
      if (!player) {
        const { error: insertError } = await supabase
          .from('players')
          .insert({ wallet_address: walletAddress });
        
        if (insertError) {
          console.error('Error creating player:', insertError);
          return null;
        }
        
        return {
          coins: 100,
          totalRuns: 0,
          bestScore: 0,
          maxStage: 0,
          deck: [],
          bossNFTs: [],
        };
      }

      // Load cards
      const { data: cards, error: cardsError } = await supabase
        .from('player_cards')
        .select('*')
        .eq('wallet_address', walletAddress);

      if (cardsError) {
        console.error('Error loading cards:', cardsError);
      }

      // Load NFTs
      const { data: nfts, error: nftsError } = await supabase
        .from('player_nfts')
        .select('*')
        .eq('wallet_address', walletAddress);

      if (nftsError) {
        console.error('Error loading NFTs:', nftsError);
      }

      // Map cards from database format
      const deck: Card[] = (cards || []).map(c => ({
        id: c.card_id,
        name: c.name,
        rarity: c.rarity as Card['rarity'],
        atk: c.atk,
        hp: c.hp,
        def: c.def,
        critRate: c.crit_rate,
        cost: c.cost,
        type: c.card_type as Card['type'],
        description: c.skill || c.name,
      }));

      // Map NFTs from database format
      const bossNFTs: BossNFT[] = (nfts || []).map(n => ({
        id: n.nft_id,
        boss: {
          id: `boss-${n.boss_stage}`,
          name: n.boss_name,
          image: n.boss_image || '',
          rarity: n.boss_rarity as BossNFT['boss']['rarity'],
          hp: n.boss_hp,
          maxHp: n.boss_hp,
          atk: n.boss_atk,
          def: n.boss_def,
          stage: n.boss_stage,
        },
        mintedAt: n.minted_at,
        runScore: n.run_score,
        stageDefeated: n.stage_defeated,
      }));

      return {
        coins: player.coins,
        totalRuns: player.total_runs,
        bestScore: player.best_score,
        maxStage: player.max_stage,
        deck,
        bossNFTs,
      };
    } finally {
      isLoadingRef.current = false;
    }
  }, [walletAddress]);

  // Save player stats
  const savePlayerStats = useCallback(async (player: Partial<Player>) => {
    if (!walletAddress || isSyncingRef.current) return;
    
    isSyncingRef.current = true;
    try {
      const { error } = await supabase
        .from('players')
        .update({
          coins: player.coins,
          total_runs: player.totalRuns,
          best_score: player.bestScore,
          max_stage: player.maxStage,
        })
        .eq('wallet_address', walletAddress);

      if (error) {
        console.error('Error saving player stats:', error);
      }
    } finally {
      isSyncingRef.current = false;
    }
  }, [walletAddress]);

  // Add card to database
  const saveCard = useCallback(async (card: Card) => {
    if (!walletAddress) return;
    
    const { error } = await supabase
      .from('player_cards')
      .insert({
        wallet_address: walletAddress,
        card_id: card.id,
        name: card.name,
        rarity: card.rarity,
        atk: card.atk,
        hp: card.hp,
        def: card.def,
        crit_rate: card.critRate,
        cost: card.cost,
        card_type: card.type,
        skill: card.description,
      });

    if (error) {
      console.error('Error saving card:', error);
    }
  }, [walletAddress]);

  // Remove card from database
  const deleteCard = useCallback(async (cardId: string) => {
    if (!walletAddress) return;
    
    const { error } = await supabase
      .from('player_cards')
      .delete()
      .eq('wallet_address', walletAddress)
      .eq('card_id', cardId);

    if (error) {
      console.error('Error deleting card:', error);
    }
  }, [walletAddress]);

  // Save NFT to database
  const saveNFT = useCallback(async (nft: BossNFT) => {
    if (!walletAddress) return;
    
    const { error } = await supabase
      .from('player_nfts')
      .insert({
        wallet_address: walletAddress,
        nft_id: nft.id,
        boss_name: nft.boss.name,
        boss_image: nft.boss.image,
        boss_rarity: nft.boss.rarity,
        boss_hp: nft.boss.maxHp,
        boss_atk: nft.boss.atk,
        boss_def: nft.boss.def,
        boss_stage: nft.boss.stage,
        run_score: nft.runScore,
        stage_defeated: nft.stageDefeated,
        minted_at: nft.mintedAt,
      });

    if (error) {
      console.error('Error saving NFT:', error);
    }
  }, [walletAddress]);

  // Remove NFT from database
  const deleteNFT = useCallback(async (nftId: string) => {
    if (!walletAddress) return;
    
    const { error } = await supabase
      .from('player_nfts')
      .delete()
      .eq('wallet_address', walletAddress)
      .eq('nft_id', nftId);

    if (error) {
      console.error('Error deleting NFT:', error);
    }
  }, [walletAddress]);

  return {
    loadPlayerData,
    savePlayerStats,
    saveCard,
    deleteCard,
    saveNFT,
    deleteNFT,
  };
}
