import { useState } from 'react';
import { BossNFT } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { toast } from 'sonner';

interface TransferNFTModalProps {
  nft: BossNFT;
  onClose: () => void;
  onTransferComplete: (nftId: string, recipientAddress: string) => void;
  walletConnected: boolean;
}

const rarityColors = {
  common: 'border-rarity-common',
  uncommon: 'border-rarity-uncommon',
  rare: 'border-rarity-rare',
  legendary: 'border-rarity-legendary',
  secret: 'border-rarity-secret',
};

export function TransferNFTModal({ nft, onClose, onTransferComplete, walletConnected }: TransferNFTModalProps) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const isValidAddress = recipientAddress.startsWith('0x') && recipientAddress.length >= 64;

  const handleTransfer = async () => {
    if (!isValidAddress || !walletConnected) return;

    setIsTransferring(true);

    try {
      const tx = new Transaction();
      
      // This is a simulated transfer - in production, you would:
      // 1. Have a real NFT object ID from minting
      // 2. Use tx.transferObjects to transfer the NFT
      
      // For demo purposes, we'll create a simple transaction
      // that simulates the transfer by sending a small amount
      const [coin] = tx.splitCoins(tx.gas, [1000000]); // 0.001 SUI as transfer fee simulation
      tx.transferObjects([coin], recipientAddress);

      await signAndExecute({
        transaction: tx,
      });

      toast.success('NFT Transfer Initiated!', {
        description: `${nft.boss.name} NFT is being transferred to ${recipientAddress.slice(0, 8)}...${recipientAddress.slice(-6)}`,
      });

      onTransferComplete(nft.id, recipientAddress);
      onClose();
    } catch (error: unknown) {
      console.error('Transfer failed:', error);
      const err = error as Error
      toast.error('Transfer Failed', {
        description: err.message || 'Could not transfer NFT. Please try again.',
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel rounded-2xl p-6 max-w-md w-full border border-border animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-primary flex items-center justify-center">
              <Send className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-orbitron text-lg font-bold">Transfer NFT</h2>
              <span className="text-sm text-muted-foreground">Send to Sui wallet</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* NFT Preview */}
        <div className={cn(
          'rounded-xl overflow-hidden border-2 mb-6',
          rarityColors[nft.boss.rarity]
        )}>
          <div className="flex items-center gap-4 p-4 bg-muted/30">
            {nft.boss.image ? (
              <img
                src={nft.boss.image}
                alt={nft.boss.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-2xl">👹</span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-orbitron font-bold">{nft.boss.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className={cn(
                  'px-2 py-0.5 rounded text-xs uppercase font-bold',
                  `text-rarity-${nft.boss.rarity}`
                )}>
                  {nft.boss.rarity}
                </span>
                <span>Stage {nft.stageDefeated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Connection Warning */}
        {!walletConnected && (
          <div className="flex items-center gap-3 p-4 mb-4 rounded-lg bg-destructive/10 border border-destructive/30">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <span className="text-sm text-destructive">
              Please connect your Sui wallet first to transfer NFTs
            </span>
          </div>
        )}

        {/* Recipient Address */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium text-muted-foreground">
            Recipient Sui Address
          </label>
          <Input
            type="text"
            placeholder="0x..."
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className={cn(
              'font-mono text-sm',
              recipientAddress && !isValidAddress && 'border-destructive focus:ring-destructive'
            )}
            disabled={!walletConnected}
          />
          {recipientAddress && !isValidAddress && (
            <p className="text-xs text-destructive">
              Please enter a valid Sui address (starts with 0x)
            </p>
          )}
        </div>

        {/* Transfer Info */}
        <div className="p-4 rounded-lg bg-muted/30 mb-6">
          <h4 className="text-sm font-medium mb-2">Transfer Details</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Network</span>
              <span className="text-neon-cyan">Sui Testnet</span>
            </div>
            <div className="flex justify-between">
              <span>Gas Fee</span>
              <span>~0.001 SUI</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isTransferring}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-neon-cyan to-primary"
            onClick={handleTransfer}
            disabled={!isValidAddress || isTransferring || !walletConnected}
          >
            {isTransferring ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Transferring...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Transfer NFT
              </>
            )}
          </Button>
        </div>

        {/* Help Link */}
        <div className="mt-4 text-center">
          <a
            href="https://suiscan.xyz/testnet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            View transactions on Suiscan
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
