import { Transaction } from "@onelabs/sui/transactions";
import { bcs } from "@onelabs/sui/bcs";

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || "";
const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_ID || "";
const CLOCK_ID = process.env.NEXT_PUBLIC_CLOCK_ID || "0x6";
const GAME_FEE_AMOUNT = 100_000_000; // 0.1 OCT in smallest unit
const PROJECT_FEE_AMOUNT = 50_000_000; // 0.05 OCT in smallest unit

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

export interface ProjectMetadata {
  projectName: string;
  description: string;
  stage: string;
  releaseDate: string;
  supportTypes: string[];
  raisedMoney: string;
  assistance: string;
}

export async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  try {
    const response = await fetch("/api/upload-json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error("Failed to upload metadata to IPFS");
    }

    const data = await response.json();
    return data.hash; // Return IPFS hash
  } catch (error) {
    console.error("Error uploading metadata to IPFS:", error);
    throw error;
  }
}

export function createSubmitGameTransaction(ipfsHash: string, gameName: string) {
  console.log("Creating game transaction with IPFS hash:", ipfsHash);
  console.log("Contract config:", {
    PACKAGE_ID,
    REGISTRY_ID,
    CLOCK_ID,
    GAME_FEE_AMOUNT
  });

  const tx = new Transaction();

  // Encode strings to bytes
  const nameBytes = Array.from(new TextEncoder().encode(gameName));
  const ipfsHashBytes = Array.from(new TextEncoder().encode(ipfsHash));

  console.log("Name bytes length:", nameBytes.length);
  console.log("IPFS hash bytes length:", ipfsHashBytes.length);

  // Serialize using BCS
  const nameBcs = bcs.vector(bcs.u8()).serialize(nameBytes).toBytes();
  const ipfsHashBcs = bcs.vector(bcs.u8()).serialize(ipfsHashBytes).toBytes();

  console.log("Serialized name BCS length:", nameBcs.length);
  console.log("Serialized IPFS hash BCS length:", ipfsHashBcs.length);

  // Split coins for payment
  const [coin] = tx.splitCoins(tx.gas, [GAME_FEE_AMOUNT]);

  // Call submit_game function
  tx.moveCall({
    target: `${PACKAGE_ID}::game_registry::submit_game`,
    arguments: [
      tx.object(REGISTRY_ID), // registry
      tx.pure(nameBcs), // name as bytes
      tx.pure(ipfsHashBcs), // IPFS hash as bytes
      coin, // payment
      tx.object(CLOCK_ID), // clock
    ],
  });

  console.log("Transaction created successfully");

  return tx;
}

export function createSubmitProjectTransaction(ipfsHash: string, projectName: string) {
  console.log("Creating project transaction with IPFS hash:", ipfsHash);
  console.log("Project name:", projectName);
  console.log("Contract config:", {
    PACKAGE_ID,
    REGISTRY_ID,
    CLOCK_ID,
    PROJECT_FEE_AMOUNT
  });

  const tx = new Transaction();

  // Encode strings to bytes
  const nameBytes = Array.from(new TextEncoder().encode(projectName));
  const ipfsHashBytes = Array.from(new TextEncoder().encode(ipfsHash));

  console.log("Name bytes length:", nameBytes.length);
  console.log("IPFS hash bytes length:", ipfsHashBytes.length);

  // Serialize using BCS
  const nameBcs = bcs.vector(bcs.u8()).serialize(nameBytes).toBytes();
  const ipfsHashBcs = bcs.vector(bcs.u8()).serialize(ipfsHashBytes).toBytes();

  console.log("Serialized name BCS length:", nameBcs.length);
  console.log("Serialized IPFS hash BCS length:", ipfsHashBcs.length);

  // Split coins for payment
  const [coin] = tx.splitCoins(tx.gas, [PROJECT_FEE_AMOUNT]);

  // Call submit_project function
  tx.moveCall({
    target: `${PACKAGE_ID}::game_registry::submit_project`,
    arguments: [
      tx.object(REGISTRY_ID), // registry
      tx.pure(nameBcs), // name as bytes
      tx.pure(ipfsHashBcs), // IPFS hash as bytes
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
    gameFeeAmount: GAME_FEE_AMOUNT,
    gameFeeInOCT: GAME_FEE_AMOUNT / 1_000_000_000, // 0.1 OCT
    projectFeeAmount: PROJECT_FEE_AMOUNT,
    projectFeeInOCT: PROJECT_FEE_AMOUNT / 1_000_000_000, // 0.05 OCT
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

export interface BlockchainGame {
  developer: string;
  name: string;
  metadata_ipfs_hash: string;
  submitted_at: string;
  submission_type: number;
}

export async function fetchGamesFromBlockchain(retries = 3, delayMs = 2000): Promise<BlockchainGame[]> {
  try {
    if (!isContractConfigured()) {
      console.warn("Contract not configured");
      return [];
    }

    console.log("Fetching games from blockchain via API...");

    // Retry logic for blockchain state propagation
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Use the API route to avoid CORS and SSL issues
        const response = await fetch("/api/fetch-games", {
          cache: "no-store", // Disable caching to get fresh data
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          console.error(`API Error (attempt ${attempt}/${retries}):`, response.status, response.statusText);
          if (attempt < retries) {
            console.log(`Retrying in ${delayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
          }
          return [];
        }

        const data = await response.json();

        if (!data.games || !Array.isArray(data.games)) {
          console.error("Invalid API response format");
          return [];
        }

        console.log(`Found ${data.games.length} games from blockchain`);

        // If we found games or this is the last attempt, return the result
        if (data.games.length > 0 || attempt === retries) {
          return data.games;
        }

        // If no games found and we have retries left, wait and try again
        console.log(`No games found yet (attempt ${attempt}/${retries}). Waiting for blockchain state...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } catch (fetchError) {
        console.error(`Fetch error (attempt ${attempt}/${retries}):`, fetchError);
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }

    // All retries exhausted
    console.warn("All retry attempts exhausted, returning empty array");
    return [];
  } catch (error) {
    console.error("Error fetching games from blockchain:", error);
    return [];
  }
}

export async function fetchMetadataFromIPFS(ipfsHash: string): Promise<any> {
  try {
    if (!ipfsHash || ipfsHash.trim() === "") {
      console.warn("Empty IPFS hash provided");
      return null;
    }

    console.log(`Fetching from IPFS: https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

    if (!response.ok) {
      console.error(`Failed to fetch IPFS data: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    console.log("Successfully fetched IPFS metadata:", data);
    return data;
  } catch (error) {
    console.error("Error fetching metadata from IPFS:", error);
    return null;
  }
}
