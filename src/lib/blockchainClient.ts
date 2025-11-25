// Client-side blockchain fetching using wallet's SuiClient
import { BlockchainGame } from "./gameRegistry";

const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_ID || "";

export async function fetchGamesFromBlockchainClient(suiClient: any): Promise<BlockchainGame[]> {
  try {
    if (!REGISTRY_ID) {
      console.warn("Registry ID not configured");
      return [];
    }

    if (!suiClient) {
      console.error("SuiClient not provided - wallet not connected?");
      return [];
    }

    console.log("Fetching games using wallet's SuiClient...");
    console.log("Registry ID:", REGISTRY_ID);

    // Use wallet's SuiClient to bypass CORS
    const response = await suiClient.getObject({
      id: REGISTRY_ID,
      options: {
        showType: true,
        showOwner: true,
        showPreviousTransaction: true,
        showDisplay: false,
        showContent: true,
        showBcs: false,
        showStorageRebate: true,
      },
    });

    console.log("SDK Response received");
    console.log("Response keys:", Object.keys(response || {}));

    if (!response || !response.data) {
      console.error("No data in response");
      return [];
    }

    // @ts-ignore - accessing content fields
    const games = response.data.content?.fields?.games || [];
    console.log(`Found ${games.length} games from blockchain (wallet client)`);

    if (games.length === 0) {
      console.warn("No games found. Available fields:");
      // @ts-ignore
      console.log(Object.keys(response.data.content?.fields || {}));
      // @ts-ignore
      console.log("Full fields:", response.data.content?.fields);
    }

    // Process games
    const processedGames = games.map((game: any, index: number) => {
      try {
        console.log(`\n=== Processing game ${index + 1} ===`);
        console.log("Raw game object:", game);
        console.log("Game keys:", Object.keys(game));

        // Check if data is nested in a 'fields' property (common in Sui responses)
        const gameData = game.fields || game;
        console.log("Using gameData keys:", Object.keys(gameData));
        console.log("Name raw:", gameData.name);
        console.log("Name type:", typeof gameData.name);
        console.log("Metadata IPFS hash raw:", gameData.metadata_ipfs_hash);
        console.log("Metadata type:", typeof gameData.metadata_ipfs_hash);

        // Try to decode name
        let decodedName = "";
        if (Array.isArray(gameData.name)) {
          decodedName = new TextDecoder().decode(new Uint8Array(gameData.name));
          console.log("Decoded name from array:", decodedName);
        } else if (typeof gameData.name === "string") {
          decodedName = gameData.name;
          console.log("Name is already string:", decodedName);
        }

        // Try to decode IPFS hash
        let decodedHash = "";
        if (Array.isArray(gameData.metadata_ipfs_hash)) {
          decodedHash = new TextDecoder().decode(new Uint8Array(gameData.metadata_ipfs_hash));
          console.log("Decoded hash from array:", decodedHash);
        } else if (typeof gameData.metadata_ipfs_hash === "string") {
          decodedHash = gameData.metadata_ipfs_hash;
          console.log("Hash is already string:", decodedHash);
        }

        return {
          developer: gameData.developer || game.developer,
          name: decodedName,
          metadata_ipfs_hash: decodedHash,
          submitted_at: gameData.submitted_at || game.submitted_at,
          submission_type: gameData.submission_type || game.submission_type || 0,
        };
      } catch (err) {
        console.error("Error processing game:", err, game);
        return null;
      }
    }).filter((game: any) => game !== null);

    console.log(`Processed ${processedGames.length} games successfully`);
    return processedGames;
  } catch (error) {
    console.error("Error fetching games (wallet client):", error);
    return [];
  }
}
