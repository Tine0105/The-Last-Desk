export { SuiWalletConnect as ConnectWallet } from '../components/game/SuiWalletConnect'

// Backwards-compatible default export
export default null as unknown as { ConnectWallet: typeof import('../components/game/SuiWalletConnect').SuiWalletConnect }
