// Quick test script to check the API
const REGISTRY_ID = "0x2e9828660d10a126323c2fa5f0b46ea8d1d75a9df28c327721bf80ea60bc7d82";

async function testAPI() {
  try {
    console.log("Testing blockchain fetch...");
    console.log("Registry ID:", REGISTRY_ID);

    const response = await fetch("https://fullnode.onechain.network:443", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      }),
    });

    const data = await response.json();
    console.log("\n=== RPC Response ===");
    console.log(JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("\n❌ Error:", data.error);
      return;
    }

    const games = data.result?.data?.content?.fields?.games || [];
    console.log(`\n✅ Found ${games.length} games on blockchain`);

    if (games.length > 0) {
      console.log("\n=== First Game ===");
      console.log(JSON.stringify(games[0], null, 2));

      // Try to decode the data
      const game = games[0];
      console.log("\n=== Decoded Data ===");
      console.log("Name:", new TextDecoder().decode(new Uint8Array(game.name)));
      console.log("IPFS Hash:", new TextDecoder().decode(new Uint8Array(game.metadata_ipfs_hash)));
      console.log("Developer:", game.developer);
      console.log("Submitted At:", game.submitted_at);
      console.log("Submission Type:", game.submission_type);
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

testAPI();
