import { SuiClient, getFullnodeUrl } from '@mysten/sui'

export const suiClient = new SuiClient({
  url: getFullnodeUrl('testnet'),
})
