import { TransactionBlock } from '@mysten/sui'

/** Helper: build a tx to update a PlayerState (safe version) */
export function buildUpdatePlayerTx(
  objectId: string,
  level: number,
  gold: number,
  seed: number,
  lastUpdated: number,
  packageId: string
) {
  if (!objectId) {
    throw new Error('Player objectId is missing')
  }

  const targets = [
    `${packageId}::player::update_player`,
    `${packageId}::player::update`,
  ]

  const tx = new TransactionBlock()

  // chỉ build 1 call, fallback ở runtime
  tx.moveCall({
    target: targets[0],
    arguments: [
      tx.object(objectId),
      tx.pure(level),
      tx.pure(gold),
      tx.pure(seed),
      tx.pure(lastUpdated),
    ],
  })

  // ghi nhớ để debug
  console.log('[UPDATE PLAYER]', {
    objectId,
    level,
    gold,
    seed,
    lastUpdated,
    target: targets[0],
  })

  return tx
}
