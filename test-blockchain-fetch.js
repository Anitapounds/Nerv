// Test script to check blockchain connection
const REGISTRY_ID = "0x2e9828660d10a126323c2fa5f0b46ea8d1d75a9df28c327721bf80ea60bc7d82";

async function testFetch() {
  try {
    console.log("Testing blockchain connection...");
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

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("RPC Error:", data.error);
      return;
    }

    const games = data.result?.data?.content?.fields?.games || [];
    console.log(`Found ${games.length} games`);
    console.log("Games:", JSON.stringify(games, null, 2));

  } catch (error) {
    console.error("Error:", error);
  }
}

testFetch();
