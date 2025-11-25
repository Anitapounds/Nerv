import { NextResponse } from "next/server";
import https from "https";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const digest = searchParams.get("digest");

    if (!digest) {
      return NextResponse.json({ error: "Transaction digest required" });
    }

    console.log("\n========== CHECK TRANSACTION ==========");
    console.log("Digest:", digest);

    // Query transaction details
    const data: any = await new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "one_getTransactionBlock",
        params: [
          digest,
          {
            showInput: true,
            showRawInput: false,
            showEffects: true,
            showEvents: true,
            showObjectChanges: true,
            showBalanceChanges: true,
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

    console.log("Transaction details:", JSON.stringify(data, null, 2));

    return NextResponse.json({
      digest,
      timestamp: new Date().toISOString(),
      rawResponse: data,
      status: data.result?.effects?.status,
      objectChanges: data.result?.objectChanges || [],
      events: data.result?.events || [],
    });
  } catch (error: any) {
    console.error("Check transaction error:", error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    });
  }
}
