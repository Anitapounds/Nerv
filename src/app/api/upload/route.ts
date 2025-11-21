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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Uploading file to Pinata:", file.name, "Size:", file.size);

    const pinataFormData = new FormData();
    pinataFormData.append("file", file);

    const pinataResponse = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: pinataFormData,
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
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;

    console.log("File uploaded successfully to IPFS:", ipfsUrl);

    return NextResponse.json({ url: ipfsUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
