import { useState } from 'react';
import { BossNFT } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Trophy, ExternalLink, X, Sparkles, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TransferNFTModal } from './TransferNFTModal';

interface NFTCollectionProps {
  nfts: BossNFT[];
  onClose: () => void;
  onTransferNFT: (nftId: string) => void;
  walletConnected: boolean;
}

const rarityColors = {
  common: 'border-rarity-common',
  uncommon: 'border-rarity-uncommon',
  rare: 'border-rarity-rare',
  legendary: 'border-rarity-legendary',
  secret: 'border-rarity-secret',
};

const rarityGradients = {
  common: 'from-rarity-common/20 to-transparent',
  uncommon: 'from-rarity-uncommon/20 to-transparent',
  rare: 'from-rarity-rare/20 to-transparent',
  legendary: 'from-rarity-legendary/20 to-transparent',
  secret: 'from-rarity-secret/20 to-transparent',
};

export function NFTCollection({ nfts, onClose, onTransferNFT, walletConnected }: NFTCollectionProps) {
  const [selectedNFT, setSelectedNFT] = useState<BossNFT | null>(null);
  const sortedNFTs = [...nfts].sort((a, b) => b.mintedAt - a.mintedAt);

  const handleTransferComplete = (nftId: string, recipientAddress: string) => {
    onTransferNFT(nftId);
    setSelectedNFT(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-panel border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-gold to-neon-orange flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-orbitron text-xl font-bold">Boss NFT Collection</h1>
              <span className="text-sm text-muted-foreground">{nfts.length} NFTs collected</span>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 py-8">
        {sortedNFTs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNFTs.map((nft, index) => (
              <div
                key={nft.id}
                className={cn(
                  'glass-panel rounded-2xl overflow-hidden border-2 transition-all duration-300',
                  'hover:scale-[1.02] hover:shadow-lg',
                  rarityColors[nft.boss.rarity],
                  'animate-fade-in'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* NFT Image */}
                <div className={cn(
                  'relative aspect-square bg-gradient-to-b',
                  rarityGradients[nft.boss.rarity]
                )}>
                  {nft.boss.image ? (
                    <img
                      src={nft.boss.image}
                      alt={nft.boss.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Trophy className="w-20 h-20 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Rarity badge */}
                  <div className={cn(
                    'absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-orbitron uppercase',
                    'bg-background/80 backdrop-blur-sm border',
                    rarityColors[nft.boss.rarity]
                  )}>
                    {nft.boss.rarity}
                  </div>

                  {/* Stage badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-orbitron bg-background/80 backdrop-blur-sm border border-border">
                    Stage {nft.stageDefeated}
                  </div>

                  {/* NFT indicator */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-neon-gold/20 text-neon-gold text-xs font-bold">
                    <Sparkles className="w-3 h-3" />
                    NFT
                  </div>
                </div>

                {/* NFT Info */}
                <div className="p-4">
                  <h3 className="font-orbitron text-lg font-bold mb-1">{nft.boss.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {nft.boss.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 rounded bg-muted/30">
                      <div className="text-xs text-muted-foreground">ATK</div>
                      <div className="font-orbitron font-bold text-neon-orange">{nft.boss.atk}</div>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/30">
                      <div className="text-xs text-muted-foreground">DEF</div>
                      <div className="font-orbitron font-bold text-neon-cyan">{nft.boss.def}</div>
                    </div>
                    <div className="text-center p-2 rounded bg-muted/30">
                      <div className="text-xs text-muted-foreground">Score</div>
                      <div className="font-orbitron font-bold text-neon-green">{nft.runScore}</div>
                    </div>
                  </div>

                  {/* Transfer Button */}
                  <Button
                    variant="outline"
                    className="w-full mb-3 border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
                    onClick={() => setSelectedNFT(nft)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Transfer to Wallet
                  </Button>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Minted {new Date(nft.mintedAt).toLocaleDateString()}</span>
                    <a
                      href={`https://suiscan.xyz/testnet/object/${nft.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      View on Sui
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="font-orbitron text-xl font-bold mb-2">No NFTs Yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Defeat bosses in battle to claim their NFTs! Each victory adds a unique Boss NFT to your collection.
            </p>
          </div>
        )}
      </main>

      {/* Transfer Modal */}
      {selectedNFT && (
        <TransferNFTModal
          nft={selectedNFT}
          onClose={() => setSelectedNFT(null)}
          onTransferComplete={handleTransferComplete}
          walletConnected={walletConnected}
        />
      )}
    </div>
  );
}
