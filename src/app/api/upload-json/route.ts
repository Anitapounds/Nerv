import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check if Pinata JWT is configured
    if (!process.env.PINATA_JWT) {
      console.error("PINATA_JWT environment variable is not configured");
      return NextResponse.json(
        { error: "Server configuration error: PINATA_JWT not set" },
        { status: 500 }
      );
    }

    const jsonData = await request.json();

    if (!jsonData) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    console.log("Uploading JSON to Pinata:", jsonData);

    const pinataResponse = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: JSON.stringify({
          pinataContent: jsonData,
          pinataMetadata: {
            name: jsonData.name || "metadata",
          },
        }),
      }
    );

    if (!pinataResponse.ok) {
      const errorText = await pinataResponse.text();
      console.error("Pinata API error:", {
        status: pinataResponse.status,
        statusText: pinataResponse.statusText,
        body: errorText
      });
      return NextResponse.json(
        {
          error: "Failed to upload to Pinata",
          details: `Status: ${pinataResponse.status} - ${errorText}`
        },
        { status: 500 }
      );
    }

    const data = await pinataResponse.json();
    const ipfsHash = data.IpfsHash;
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    console.log("JSON uploaded successfully to IPFS:", ipfsUrl);

    return NextResponse.json({
      url: ipfsUrl,
      hash: ipfsHash
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
