import { SuiClient, getFullnodeUrl } from '@mysten/sui'

export const client = new SuiClient({
  url: getFullnodeUrl('testnet'),
})

export default client
