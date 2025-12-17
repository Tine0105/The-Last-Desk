-- Create table for player profiles (linked to Sui wallet address)
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  coins INTEGER NOT NULL DEFAULT 100,
  total_runs INTEGER NOT NULL DEFAULT 0,
  best_score INTEGER NOT NULL DEFAULT 0,
  max_stage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for player's deck (cards)
CREATE TABLE public.player_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL REFERENCES public.players(wallet_address) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  name TEXT NOT NULL,
  rarity TEXT NOT NULL,
  atk INTEGER NOT NULL DEFAULT 0,
  hp INTEGER NOT NULL DEFAULT 0,
  def INTEGER NOT NULL DEFAULT 0,
  crit_rate INTEGER NOT NULL DEFAULT 0,
  cost INTEGER NOT NULL DEFAULT 0,
  card_type TEXT NOT NULL DEFAULT 'attack',
  skill TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for player's Boss NFTs
CREATE TABLE public.player_nfts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL REFERENCES public.players(wallet_address) ON DELETE CASCADE,
  nft_id TEXT NOT NULL UNIQUE,
  boss_name TEXT NOT NULL,
  boss_image TEXT,
  boss_rarity TEXT NOT NULL,
  boss_hp INTEGER NOT NULL,
  boss_atk INTEGER NOT NULL,
  boss_def INTEGER NOT NULL,
  boss_stage INTEGER NOT NULL,
  run_score INTEGER NOT NULL DEFAULT 0,
  stage_defeated INTEGER NOT NULL DEFAULT 1,
  minted_at BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access since we use wallet address (not auth)
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_nfts ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (wallet-based, not auth-based)
CREATE POLICY "Anyone can read players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Anyone can insert players" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON public.players FOR UPDATE USING (true);

CREATE POLICY "Anyone can read player_cards" ON public.player_cards FOR SELECT USING (true);
CREATE POLICY "Anyone can insert player_cards" ON public.player_cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete player_cards" ON public.player_cards FOR DELETE USING (true);

CREATE POLICY "Anyone can read player_nfts" ON public.player_nfts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert player_nfts" ON public.player_nfts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete player_nfts" ON public.player_nfts FOR DELETE USING (true);

-- Create indexes for faster queries
CREATE INDEX idx_player_cards_wallet ON public.player_cards(wallet_address);
CREATE INDEX idx_player_nfts_wallet ON public.player_nfts(wallet_address);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_players_updated_at
BEFORE UPDATE ON public.players
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();