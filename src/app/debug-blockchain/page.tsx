"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DebugBlockchainPage() {
  const [response, setResponse] = useState<any>(null);
  const [txResponse, setTxResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState("");

  const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_ID || "0x2e9828660d10a126323c2fa5f0b46ea8d1d75a9df28c327721bf80ea60bc7d82";

  const fetchDirectly = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/debug-blockchain", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkTransaction = async () => {
    if (!txDigest.trim()) {
      alert("Please enter a transaction digest");
      return;
    }
    setTxLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/check-transaction?digest=${encodeURIComponent(txDigest)}`);
      const data = await res.json();
      setTxResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-10 py-16 pt-32">
      <h1 className="text-3xl font-fancy mb-6">Blockchain Debug Tool</h1>

      {/* Registry Info */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-6">
        <p className="text-sm text-gray-400 mb-2">Registry ID:</p>
        <p className="font-mono text-sm break-all">{REGISTRY_ID}</p>
      </div>

      {/* Fetch Registry Button */}
      <Button onClick={fetchDirectly} disabled={loading} className="mb-6">
        {loading ? "Fetching..." : "Fetch Registry Data"}
      </Button>

      {/* Transaction Checker */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Check Transaction</h2>
        <p className="text-sm text-gray-400 mb-3">
          Paste the transaction digest from your game submission (e.g., FJW8y6UfH4EGGskCBmLJA62dsz7Qjq2GW6Lm4vBXn5v5)
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={txDigest}
            onChange={(e) => setTxDigest(e.target.value)}
            placeholder="Transaction digest..."
            className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm font-mono"
          />
          <Button onClick={checkTransaction} disabled={txLoading}>
            {txLoading ? "Checking..." : "Check"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 mb-6">
          <p className="text-red-400">Error: {error}</p>
        </div>
      )}

      {/* Transaction Response */}
      {txResponse && (
        <div className="bg-zinc-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
          {txResponse.status && (
            <div className="mb-4 p-3 bg-zinc-800 rounded">
              <p className="text-sm text-gray-400">Status:</p>
              <p className={`font-semibold ${txResponse.status.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {txResponse.status.status || "unknown"}
              </p>
            </div>
          )}
          <pre className="text-xs overflow-auto max-h-[600px] bg-black p-4 rounded">
            {JSON.stringify(txResponse, null, 2)}
          </pre>
        </div>
      )}

      {/* Registry Response */}
      {response && (
        <div className="bg-zinc-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Registry Data</h2>

          {/* Summary */}
          <div className="mb-4 space-y-2">
            <div className="p-3 bg-zinc-800 rounded">
              <p className="text-sm text-gray-400">Games Found:</p>
              <p className="text-2xl font-bold">
                {response.games?.length || 0}
              </p>
            </div>

            {response.resultPath && (
              <div className="p-3 bg-zinc-800 rounded text-sm">
                <p className="text-gray-400 mb-2">Data Path Check:</p>
                <ul className="space-y-1 font-mono">
                  <li>✓ Has Result: {response.resultPath.hasResult ? "✅" : "❌"}</li>
                  <li>✓ Has Data: {response.resultPath.hasData ? "✅" : "❌"}</li>
                  <li>✓ Has Content: {response.resultPath.hasContent ? "✅" : "❌"}</li>
                  <li>✓ Has Fields: {response.resultPath.hasFields ? "✅" : "❌"}</li>
                  <li>✓ Has Games: {response.resultPath.hasGames ? "✅" : "❌"}</li>
                  <li>→ Games Type: {response.resultPath.gamesType}</li>
                  <li>→ Games Length: {response.resultPath.gamesLength}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Full Response */}
          <details className="cursor-pointer">
            <summary className="text-sm text-gray-400 mb-2 hover:text-white">
              Show Full Raw Response
            </summary>
            <pre className="text-xs overflow-auto max-h-[600px] bg-black p-4 rounded mt-2">
              {JSON.stringify(response, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
