import { TransactionBlock } from '@mysten/sui'
import { suiClient } from './suiClient'

type TransactionBlockInstance = InstanceType<typeof TransactionBlock>

// TODO: set PACKAGE_ID after publishing the Move package (replace 0x...)
export const PACKAGE_ID = '0xf78bc8d7f26b4afc7b4d660430b2ade7eb0cff6d2db2f1ef67efd4505d434868'

type Wallet = {
  signAndExecuteTransactionBlock: (opts: { transactionBlock: TransactionBlockInstance }) => Promise<unknown>
}

/** LOAD SAVE GAME: find PlayerState objects owned by `address` */
export async function loadPlayer(address: string) {
  // Be resilient: some builds may register the module path differently.
  // We fetch owned objects and filter client-side for objects whose
  // type string contains `PlayerState`.
  const res = await suiClient.getOwnedObjects({
    owner: address,
    options: {
      showContent: true,
    },
  })

  const objs = (res.data || []).filter((o: unknown) => {
    try {
      type OwnedObj = { data?: { content?: { type?: string }; type?: string }; type?: string }
      const obj = o as OwnedObj
      const t = obj?.data?.content?.type ?? obj?.data?.type ?? obj?.type ?? ''
      return typeof t === 'string' && t.includes('PlayerState')
    } catch {
      return false
    }
  })

  return objs
}

/** CREATE SAVE GAME */
export async function createPlayer(wallet: Wallet) {
  const tx = new TransactionBlock()

  // Try canonical name first, fallback to older `create` if needed.
  const targets = [`${PACKAGE_ID}::player::create_player`, `${PACKAGE_ID}::player::create`]

  for (const target of targets) {
    try {
      const attempt = new TransactionBlock()
      attempt.moveCall({ target, arguments: [] })
      return await wallet.signAndExecuteTransactionBlock({ transactionBlock: attempt })
    } catch (err) {
      // try next
    }
  }

  throw new Error('createPlayer: no supported create function found on-chain')
}

/** UPDATE SAVE GAME */
export async function updatePlayer(
  wallet: Wallet,
  playerObjectId: string,
  level: number,
  gold: number,
  seed: number,
  lastUpdated: number
) {
  // Try both newer and older function names
  const targets = [`${PACKAGE_ID}::player::update_player`, `${PACKAGE_ID}::player::update`]

  for (const target of targets) {
    try {
      const attempt = new TransactionBlock()
      attempt.moveCall({
        target,
        arguments: [
          attempt.object(playerObjectId),
          attempt.pure(level),
          attempt.pure(gold),
          attempt.pure(seed),
          attempt.pure(lastUpdated),
        ],
      })
      return await wallet.signAndExecuteTransactionBlock({ transactionBlock: attempt })
    } catch (err) {
      // try next
    }
  }

  throw new Error('updatePlayer: no supported update function found on-chain')
}
