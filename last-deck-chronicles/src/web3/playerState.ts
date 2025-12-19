import { Transaction } from "@mysten/sui/transactions";
import { suiClient } from "./suiClient";
import type {
  SuiTransactionBlockResponse,
  SuiObjectChange,
  SuiObjectResponse,
} from "@mysten/sui/client";

/* ================== CONFIG ================== */

export const PACKAGE_ID =
  "0x9b4f72b690a7829e2febb7ffb00e2f588a25351f13da14bf7a78c21a9be0c48e";

type Wallet = {
  signAndExecuteTransaction: (opts: {
    transaction: Transaction;
  }) => Promise<SuiTransactionBlockResponse>;
};

/* ================== HELPERS ================== */

import type { SuiParsedData } from "@mysten/sui/client";

function isPlayerState(obj: SuiObjectResponse): boolean {
  const content = obj.data?.content as SuiParsedData | undefined;

  if (!content || content.dataType !== "moveObject") {
    return false;
  }

  return content.type.includes("PlayerState");
}
/* ================== LOAD PLAYER ================== */

export async function loadPlayer(
  address: string
): Promise<SuiObjectResponse[]> {
  const res = await suiClient.getOwnedObjects({
    owner: address,
    options: { showContent: true },
  });

  return res.data.filter(isPlayerState);
}

/* ================== CREATE PLAYER ================== */

export async function createPlayer(wallet: Wallet) {
  const targets = [
    `${PACKAGE_ID}::player::create_player`,
    `${PACKAGE_ID}::player::create`,
  ];

  for (const target of targets) {
    try {
      const tx = new Transaction();
      tx.moveCall({ target, arguments: [] });
      return await wallet.signAndExecuteTransaction({ transaction: tx });
    } catch (error) {
      console.warn(`createPlayer failed with ${target}`, error);
    }
  }

  throw new Error("createPlayer: no supported create function found");
}

/* ================== UPDATE PLAYER ================== */

export async function updatePlayer(
  wallet: Wallet,
  playerObjectId: string,
  level: number,
  gold: number,
  seed: number,
  lastUpdated: number
) {
  const targets = [
    `${PACKAGE_ID}::player::update_player`,
    `${PACKAGE_ID}::player::update`,
  ];

  for (const target of targets) {
    try {
      const tx = new Transaction();

      tx.moveCall({
        target,
        arguments: [
          tx.object(playerObjectId),
          tx.pure.u64(level),
          tx.pure.u64(gold),
          tx.pure.u64(seed),
          tx.pure.u64(lastUpdated),
        ],
      });

      return await wallet.signAndExecuteTransaction({ transaction: tx });
    } catch (error) {
      console.warn(`updatePlayer failed with ${target}`, error);
    }
  }

  throw new Error("updatePlayer: no supported update function found");
}

/* ================== WIN STAGE ================== */

export async function winStage(
  wallet: Wallet,
  playerObjectId: string,
  stageWon: number,
  level: number,
  gold: number,
  seed: number,
  lastUpdated: number
) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::player::win_stage`,
    arguments: [
      tx.object(playerObjectId),
      tx.pure.u64(stageWon),
      tx.pure.u64(level),
      tx.pure.u64(gold),
      tx.pure.u64(seed),
      tx.pure.u64(lastUpdated),
    ],
  });

  return wallet.signAndExecuteTransaction({ transaction: tx });
}

/* ================== WIN STAGE + FETCH NFT ================== */

type CreatedNFT = {
  objectId: string;
  objectType: string;
};

function isBossNFT(
  change: SuiObjectChange
): change is Extract<SuiObjectChange, { type: "created" }> {
  return (
    change.type === "created" &&
    typeof change.objectType === "string" &&
    change.objectType.includes("BossNFT")
  );
}

export async function winStageAndFetchNFT(
  wallet: Wallet,
  playerObjectId: string,
  stageWon: number,
  level: number,
  gold: number,
  seed: number,
  lastUpdated: number
): Promise<{ digest: string; bossNFTs: CreatedNFT[] }> {
  const res = await winStage(
    wallet,
    playerObjectId,
    stageWon,
    level,
    gold,
    seed,
    lastUpdated
  );

  if (!res.digest) {
    throw new Error("Transaction digest not found");
  }

  const tx = await suiClient.getTransactionBlock({
    digest: res.digest,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });

  // `objectChanges` can appear in different shapes depending on SDK version.
  // Normalize at runtime without using `any` to satisfy ESLint.
  const asRecord = tx as unknown as Record<string, unknown>;

  let rawObjectChanges: SuiObjectChange[] | undefined;

  // Try effects.objectChanges
  const effectsVal = asRecord["effects"];
  if (effectsVal && typeof effectsVal === "object") {
    const effRec = effectsVal as Record<string, unknown>;
    const oc = effRec["objectChanges"];
    if (Array.isArray(oc)) {
      rawObjectChanges = oc as SuiObjectChange[];
    }
  }

  // Fallback to top-level objectChanges
  if (!rawObjectChanges) {
    const topOc = asRecord["objectChanges"];
    if (Array.isArray(topOc)) {
      rawObjectChanges = topOc as SuiObjectChange[];
    }
  }

  const bossNFTs: CreatedNFT[] =
    rawObjectChanges?.filter(isBossNFT).map((c) => ({
      objectId: c.objectId,
      objectType: c.objectType,
    })) ?? [];

  return {
    digest: res.digest,
    bossNFTs,
  };
}
