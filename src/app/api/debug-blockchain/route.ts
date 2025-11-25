import { NextResponse } from "next/server";
import https from "https";

export async function GET() {
  try {
    const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_ID || "";

    if (!REGISTRY_ID) {
      return NextResponse.json({ error: "Registry ID not configured" });
    }

    console.log("\n========== DEBUG BLOCKCHAIN REQUEST ==========");
    console.log("Registry ID:", REGISTRY_ID);
    console.log("Timestamp:", new Date().toISOString());

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

    console.log("Raw RPC Response:", JSON.stringify(data, null, 2));

    // Return everything for debugging
    return NextResponse.json({
      registryId: REGISTRY_ID,
      timestamp: new Date().toISOString(),
      rawResponse: data,
      hasError: !!data.error,
      hasResult: !!data.result,
      resultPath: {
        hasData: !!data.result?.data,
        hasContent: !!data.result?.data?.content,
        hasFields: !!data.result?.data?.content?.fields,
        hasGames: !!data.result?.data?.content?.fields?.games,
        gamesType: typeof data.result?.data?.content?.fields?.games,
        gamesLength: Array.isArray(data.result?.data?.content?.fields?.games)
          ? data.result.data.content.fields.games.length
          : "not an array",
      },
      games: data.result?.data?.content?.fields?.games || [],
      fullFields: data.result?.data?.content?.fields || null,
    });
  } catch (error: any) {
    console.error("Debug API Error:", error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    });
  }
}
