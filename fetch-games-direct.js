// Direct test script - run with: node fetch-games-direct.js
const https = require('https');

const REGISTRY_ID = "0x2e9828660d10a126323c2fa5f0b46ea8d1d75a9df28c327721bf80ea60bc7d82";

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

// Try with IP address instead of hostname
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
  checkServerIdentity: () => undefined,
};

console.log("Testing direct HTTPS connection to OneChain RPC...\n");

const req = https.request(options, (res) => {
  let responseData = "";

  res.on("data", (chunk) => {
    responseData += chunk;
  });

  res.on("end", () => {
    try {
      const data = JSON.parse(responseData);
      console.log("✅ SUCCESS! Connection established.\n");

      if (data.error) {
        console.log("❌ RPC Error:", JSON.stringify(data.error, null, 2));
      } else {
        const games = data.result?.data?.content?.fields?.games || [];
        console.log(`✅ Found ${games.length} games on blockchain\n`);

        if (games.length > 0) {
          console.log("First game:");
          console.log(JSON.stringify(games[0], null, 2));
        } else {
          console.log("Available fields:");
          console.log(Object.keys(data.result?.data?.content?.fields || {}));
        }
      }
    } catch (e) {
      console.error("❌ Failed to parse response:", e.message);
      console.log("Raw response:", responseData);
    }
  });
});

req.on("error", (error) => {
  console.error("❌ Connection failed:", error.message);
  console.error("\nThis SSL issue needs to be resolved. Possible solutions:");
  console.error("1. Use a different RPC endpoint");
  console.error("2. Set up a proxy server");
  console.error("3. Contact OneChain support about SSL configuration");
});

req.write(postData);
req.end();
