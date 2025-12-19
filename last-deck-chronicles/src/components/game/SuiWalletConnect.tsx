import { 
  ConnectButton, 
  useCurrentAccount, 
  useDisconnectWallet,
  useAccounts,
} from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, CheckCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Account menu">
              <Avatar>
                <AvatarFallback>
                  {currentAccount.address.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <div className="w-full">
                <ConnectButton
                  connectText={<span className="flex items-center gap-2"><Wallet className="w-4 h-4" />Change wallet</span>}
                  className={cn(
                    'w-full text-left px-2 py-1 !bg-transparent !p-0',
                    'font-medium',
                  )}
                />
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={() => disconnect()}>
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
