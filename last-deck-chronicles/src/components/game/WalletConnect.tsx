import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WalletConnectProps {
  address: string | null;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export function WalletConnect({ address, onConnect, onDisconnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection (MVP - would use Sui SDK in production)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a mock Sui address
    const mockAddress = `0x${Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;
    
    onConnect(mockAddress);
    setIsConnecting(false);
  };

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <div className="glass-panel rounded-lg px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="font-mono text-sm">
            {address.slice(0, 8)}...{address.slice(-6)}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onDisconnect}
          className="border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className={cn(
        'bg-gradient-to-r from-primary to-secondary text-primary-foreground',
        'hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)]',
        'transition-all duration-300'
      )}
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet (Testnet)
        </>
      )}
    </Button>
  );
}
