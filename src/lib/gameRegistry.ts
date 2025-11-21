import { Transaction } from "@onelabs/sui/transactions";
import { bcs } from "@onelabs/sui/bcs";

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || "";
const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_ID || "";
const CLOCK_ID = process.env.NEXT_PUBLIC_CLOCK_ID || "0x6";
const FEE_AMOUNT = 100_000_000; // 0.1 OCT in smallest unit

export interface GameMetadata {
  name: string;
  description: string;
  genre: string;
  platforms: string[];
  releaseDate: string;
  websiteUrl: string;
  logoUrl: string;
  videoUrl: string;
}

export function createSubmitGameTransaction(metadata: GameMetadata) {
  console.log("Creating transaction with metadata:", metadata);
  console.log("Contract config:", {
    PACKAGE_ID,
    REGISTRY_ID,
    CLOCK_ID,
    FEE_AMOUNT
  });

  const tx = new Transaction();

  // Create metadata JSON string
  const metadataJson = JSON.stringify({
    description: metadata.description,
    genre: metadata.genre,
    platforms: metadata.platforms,
    releaseDate: metadata.releaseDate,
    websiteUrl: metadata.websiteUrl,
    logoUrl: metadata.logoUrl,
    videoUrl: metadata.videoUrl,
  });

  console.log("Metadata JSON:", metadataJson);

  // Encode strings to bytes
  const nameBytes = Array.from(new TextEncoder().encode(metadata.name));
  const metadataBytes = Array.from(new TextEncoder().encode(metadataJson));

  console.log("Name bytes length:", nameBytes.length);
  console.log("Metadata bytes length:", metadataBytes.length);

  // Serialize using BCS
  const nameBcs = bcs.vector(bcs.u8()).serialize(nameBytes);
  const metadataBcs = bcs.vector(bcs.u8()).serialize(metadataBytes);

  console.log("BCS serialized name:", nameBcs);
  console.log("BCS serialized metadata:", metadataBcs);

  // Split coins for payment
  const [coin] = tx.splitCoins(tx.gas, [FEE_AMOUNT]);

  // Call submit_game function
  tx.moveCall({
    target: `${PACKAGE_ID}::game_registry::submit_game`,
    arguments: [
      tx.object(REGISTRY_ID), // registry
      tx.pure(nameBcs), // name as bytes
      tx.pure(metadataBcs), // metadata as bytes
      coin, // payment
      tx.object(CLOCK_ID), // clock
    ],
  });

  console.log("Transaction created successfully");

  return tx;
}

export function getContractConfig() {
  return {
    packageId: PACKAGE_ID,
    registryId: REGISTRY_ID,
    clockId: CLOCK_ID,
    feeAmount: FEE_AMOUNT,
    feeInOCT: FEE_AMOUNT / 1_000_000_000, // Convert to OCT tokens
  };
}

export function isContractConfigured() {
  return (
    PACKAGE_ID !== "" &&
    PACKAGE_ID !== "YOUR_PACKAGE_ID_HERE" &&
    REGISTRY_ID !== "" &&
    REGISTRY_ID !== "YOUR_REGISTRY_OBJECT_ID_HERE"
  );
}
