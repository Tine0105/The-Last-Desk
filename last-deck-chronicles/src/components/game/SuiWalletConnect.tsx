import { 
  ConnectButton, 
  useCurrentAccount, 
  useDisconnectWallet,
  useAccounts,
} from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, CheckCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuiWalletConnectProps {
  onConnectionChange?: (address: string | null) => void;
}

export function SuiWalletConnect({ onConnectionChange }: SuiWalletConnectProps) {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const accounts = useAccounts();

  // Notify parent of connection changes
  if (onConnectionChange) {
    if (currentAccount?.address) {
      onConnectionChange(currentAccount.address);
    }
  }

  if (currentAccount) {
    return (
      <div className="flex items-center gap-3">
        <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-neon-green" />
          <span className="font-mono text-sm">
            {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-6)}
          </span>
          <a
            href={`https://suiscan.xyz/testnet/account/${currentAccount.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
          className="border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <ConnectButton
      connectText={
        <span className="flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          Connect Sui Wallet
        </span>
      }
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-all duration-300',
        'bg-gradient-to-r from-primary to-secondary text-primary-foreground',
        'hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)]',
      )}
    />
  );
}

// Hook to get current wallet address
export function useWalletAddress() {
  const currentAccount = useCurrentAccount();
  return currentAccount?.address ?? null;
}
