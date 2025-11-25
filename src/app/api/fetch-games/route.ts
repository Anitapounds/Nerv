import { NextResponse } from "next/server";
import https from "https";

export async function GET() {
  try {
    const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_ID || "";

    console.log("\n========== FETCH GAMES API CALLED ==========");
    console.log("Fetching games from registry:", REGISTRY_ID);
    console.log("Timestamp:", new Date().toISOString());
    console.log("Request headers:", JSON.stringify(Object.fromEntries(new Headers().entries())));

    // If contract not deployed yet, return empty array instead of error
    if (!REGISTRY_ID || REGISTRY_ID === "YOUR_REGISTRY_OBJECT_ID_HERE" || REGISTRY_ID === "") {
      console.log("Registry not configured, returning empty array");
      return NextResponse.json({ games: [] });
    }

    console.log("Using RPC URL: https://fullnode.onechain.network:443");

    // Use Node's https module directly to bypass SSL verification
    const data: any = await new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "one_getObject",
        params: [
          REGISTRY_ID,
          {
            showType: true,
            showOwner: true,
            showPreviousTransaction: true,
            showDisplay: false,
            showContent: true,
            showBcs: false,
            showStorageRebate: true,
          },
        ],
      });

      const options = {
        hostname: "fullnode.onechain.network",
        port: 443,
        path: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
        rejectUnauthorized: false,
        requestCert: false,
        agent: false,
        checkServerIdentity: () => undefined, // Completely disable server identity check
      };

      const req = https.request(options, (res) => {
        let responseData = "";

        res.on("data", (chunk) => {
          responseData += chunk;
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            reject(new Error("Failed to parse JSON response"));
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
    // Log response structure for debugging
    console.log("RPC Response received");
    console.log("Response keys:", Object.keys(data || {}));

    if (data.result) {
      console.log("Result keys:", Object.keys(data.result || {}));
      if (data.result.data) {
        console.log("Data keys:", Object.keys(data.result.data || {}));
        if (data.result.data.content) {
          console.log("Content keys:", Object.keys(data.result.data.content || {}));
          if (data.result.data.content.fields) {
            console.log("Fields keys:", Object.keys(data.result.data.content.fields || {}));
          }
        }
      }
    }

    if (data.error) {
      console.error("RPC Error:", JSON.stringify(data.error, null, 2));
      // Return empty array instead of error - contract might not be deployed yet
      return NextResponse.json({ games: [] });
    }

    const games = data.result?.data?.content?.fields?.games || [];
    console.log(`Found ${games.length} games on blockchain`);

    if (games.length > 0) {
      console.log("Sample game structure:", JSON.stringify(games[0], null, 2));
    } else {
      console.warn("No games found - checking object structure:");
      console.log("Full object:", JSON.stringify(data.result?.data?.content?.fields, null, 2));
    }

    if (games.length === 0) {
      return NextResponse.json({ games: [] });
    }

    const processedGames = games.map((game: any) => {
      try {
        // Handle both old format (metadata) and new format (metadata_ipfs_hash)
        let metadata_ipfs_hash = "";

        if (game.metadata_ipfs_hash) {
          // New format with IPFS hash
          metadata_ipfs_hash = new TextDecoder().decode(new Uint8Array(game.metadata_ipfs_hash));
        } else if (game.metadata) {
          // Old format with full metadata - skip these for now
          console.log("Skipping old-format game:", game.name);
          return null;
        }

        return {
          developer: game.developer,
          name: new TextDecoder().decode(new Uint8Array(game.name)),
          metadata_ipfs_hash,
          submitted_at: game.submitted_at,
          submission_type: game.submission_type || 0,
        };
      } catch (err) {
        console.error("Error processing game:", err, game);
        return null;
      }
    }).filter((game: any) => game !== null);

    console.log(`Processed ${processedGames.length} games successfully`);

    if (processedGames.length > 0) {
      console.log("Sample processed game:", JSON.stringify(processedGames[0], null, 2));
    }

    console.log("========== END FETCH GAMES API ==========\n");

    return NextResponse.json({ games: processedGames });
  } catch (error: any) {
    console.error("Error fetching games from blockchain:", error);
    console.error("Error details:", error.message, error.stack);
    // Return empty array instead of error for graceful degradation
    return NextResponse.json({ games: [] });
  }
}
