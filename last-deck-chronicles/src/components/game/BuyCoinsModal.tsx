import { useState } from 'react';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Button } from '@/components/ui/button';
import { Coins, Loader2, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BuyCoinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCoins: (amount: number) => void;
  walletAddress: string | null;
}

const COIN_PACKAGES = [
  { sui: 0.01, coins: 100, label: 'Starter Pack' },
  { sui: 0.05, coins: 600, label: 'Value Pack', bonus: '+20%' },
  { sui: 0.1, coins: 1500, label: 'Pro Pack', bonus: '+50%' },
];

export function BuyCoinsModal({ isOpen, onClose, onAddCoins, walletAddress }: BuyCoinsModalProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handlePurchase = async (pkg: typeof COIN_PACKAGES[0], index: number) => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first!');
      return;
    }

    setIsPurchasing(true);
    setSelectedPackage(index);

    try {
      const tx = new Transaction();
      
      // Convert SUI to MIST (1 SUI = 1_000_000_000 MIST)
      const amountInMist = Math.floor(pkg.sui * 1_000_000_000);
      
      // Split coins and transfer to a "game treasury" address (testnet placeholder)
      const [coin] = tx.splitCoins(tx.gas, [amountInMist]);
      tx.transferObjects([coin], '0x0000000000000000000000000000000000000000000000000000000000000001');

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('Transaction successful:', result);
            onAddCoins(pkg.coins);
            toast.success(`Successfully purchased ${pkg.coins} coins!`);
            onClose();
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
            toast.error('Transaction failed. Please try again.');
          },
          onSettled: () => {
            setIsPurchasing(false);
            setSelectedPackage(null);
          },
        }
      );
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to initiate purchase');
      setIsPurchasing(false);
      setSelectedPackage(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative glass-panel rounded-2xl p-8 max-w-lg w-full mx-4 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-gold to-neon-orange flex items-center justify-center">
            <Coins className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="font-orbitron text-2xl font-bold neon-text mb-2">
            Buy Coins
          </h2>
          <p className="text-muted-foreground text-sm">
            Purchase in-game coins using SUI (Testnet)
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {COIN_PACKAGES.map((pkg, index) => (
            <button
              key={index}
              onClick={() => handlePurchase(pkg, index)}
              disabled={isPurchasing || !walletAddress}
              className={cn(
                'w-full p-4 rounded-xl border-2 transition-all',
                'flex items-center justify-between',
                'hover:border-neon-gold hover:bg-neon-gold/10',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                selectedPackage === index 
                  ? 'border-neon-gold bg-neon-gold/20' 
                  : 'border-border/50 bg-muted/30'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-gold/20 to-neon-orange/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-neon-gold" />
                </div>
                <div className="text-left">
                  <div className="font-orbitron font-bold flex items-center gap-2">
                    {pkg.label}
                    {pkg.bonus && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neon-green/20 text-neon-green">
                        {pkg.bonus}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {pkg.sui} SUI
                  </div>
                </div>
              </div>
              <div className="text-right">
                {isPurchasing && selectedPackage === index ? (
                  <Loader2 className="w-5 h-5 animate-spin text-neon-gold" />
                ) : (
                  <div className="font-orbitron font-bold text-neon-gold">
                    {pkg.coins.toLocaleString()} <span className="text-xs">coins</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {!walletAddress && (
          <div className="text-center p-3 rounded-lg bg-destructive/20 border border-destructive/50">
            <p className="text-sm text-destructive">
              Connect your wallet to purchase coins
            </p>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-4">
          All transactions are on Sui Testnet
        </p>
      </div>
    </div>
  );
}
