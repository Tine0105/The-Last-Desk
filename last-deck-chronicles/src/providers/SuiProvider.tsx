import React from 'react';
import { createNetworkConfig, SuiClientProvider, WalletProvider, useCurrentAccount } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';

// Config for Sui networks
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
  devnet: { url: getFullnodeUrl('devnet') },
});

const queryClient = new QueryClient();

interface SuiProviderProps {
  children: React.ReactNode;
}

export function SuiProvider({ children }: SuiProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <BodyBackgroundSwitcher />
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

function BodyBackgroundSwitcher() {
  const current = useCurrentAccount();

  React.useEffect(() => {
    const body = document.body;
    if (current?.address) {
      body.classList.add('loggedin-bg');
      body.classList.remove('first-bg');
    } else {
      body.classList.remove('loggedin-bg');
      body.classList.add('first-bg');
    }
  }, [current?.address]);

  return null;
}
