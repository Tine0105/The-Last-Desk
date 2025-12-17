import { TransactionBlock } from '@mysten/sui'

/** Helper: build a tx to update a PlayerState (returns TransactionBlock) */
export function buildUpdatePlayerTx(
  objectId: string,
  level: number,
  gold: number,
  seed: number,
  lastUpdated: number,
  packageId: string
) {
  const tx = new TransactionBlock()

  tx.moveCall({
    target: `${packageId}::player::update_player`,
    arguments: [
      tx.object(objectId),
      tx.pure(level),
      tx.pure(gold),
      tx.pure(seed),
      tx.pure(lastUpdated),
    ],
  })

  return tx
}
