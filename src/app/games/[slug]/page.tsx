"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchMetadataFromIPFS } from "@/lib/gameRegistry";
import { fetchGamesFromBlockchainClient } from "@/lib/blockchainClient";
import { useSuiClient } from "@onelabs/dapp-kit";

interface GameDetail {
  name: string;
  description: string;
  genre?: string;
  platforms?: string[];
  releaseDate?: string;
  websiteUrl?: string;
  logoUrl?: string;
  videoUrl?: string;
  developer: string;
  submittedAt: string;
  status?: string;
  xp?: string;
}

export default function GamePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const suiClient = useSuiClient();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      try {
        setIsLoading(true);
        console.log("Loading game with slug:", slug);

        // Fetch all games from blockchain
        const games = await fetchGamesFromBlockchainClient(suiClient);
        console.log(`Found ${games.length} games from blockchain`);

        // Find the game matching this slug
        let matchedGame = null;
        for (const game of games) {
          const metadata = await fetchMetadataFromIPFS(game.metadata_ipfs_hash);
          if (metadata) {
            const gameSlug =
              metadata.name?.toLowerCase().replace(/\s+/g, "-") ||
              metadata.projectName?.toLowerCase().replace(/\s+/g, "-") ||
              game.name.toLowerCase().replace(/\s+/g, "-");

            console.log(`Checking game: ${metadata.name}, slug: ${gameSlug}`);

            if (gameSlug === slug) {
              matchedGame = {
                ...metadata,
                name: metadata.name || metadata.projectName || game.name,
                developer: game.developer,
                submittedAt: game.submitted_at,
                logoUrl: metadata.logoUrl || "/images/game1.jpg",
              };
              break;
            }
          }
        }

        if (matchedGame) {
          console.log("Found matching game:", matchedGame);
          setGame(matchedGame);
        } else {
          console.warn("No game found for slug:", slug);
          setError("Game not found");
        }
      } catch (err) {
        console.error("Error loading game:", err);
        setError("Failed to load game");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadGame();
    }
  }, [slug, suiClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Game Not Found</h1>
          <p className="text-gray-400 mb-6">
            {error || "The game you're looking for doesn't exist."}
          </p>
          <Link href="/discovery">
            <Button variant="primary">Back to Discovery</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 px-6 md:px-20 py-10 pt-32">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-fancy text-white">{game.name}</h1>
        <p className="text-sm text-gray-500 my-1">
          {game.genre && (
            <>
              Genre: <span className="text-white">{game.genre}</span>
            </>
          )}
          {game.status && (
            <span className="ml-4 px-3 py-1 rounded-full text-xs bg-green-600 text-white">
              {game.status}
            </span>
          )}
        </p>

        {/* Tabs */}
        <div className="flex gap-12 mt-9 text-sm">
          <button className="text-white pb-1 px-2 border-b-2 border-white">
            Overview
          </button>
          <button className="hover:text-white">Quests</button>
          <button className="hover:text-white">Patch Info</button>
        </div>
      </header>

      {/* Main Layout */}
      {/* Banner */}
      <div className="overflow-hidden my-15">
        {game.videoUrl ? (
          <video
            src={game.videoUrl}
            controls
            className="w-full object-cover h-96 rounded-lg"
            poster={game.logoUrl}
          />
        ) : (
          <img
            src={game.logoUrl}
            alt={game.name}
            className="w-full object-cover h-96 rounded-lg"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Section */}
        <section className="lg:col-span-2 space-y-10">
          {/* About */}
          <div>
            <h2 className="text-2xl font-fancy mb-4 text-white">
              About {game.name}
            </h2>
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
              {game.description}
            </p>
          </div>

          {/* Platforms */}
          {game.platforms && game.platforms.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3 text-white">
                Available Platforms
              </h2>
              <div className="flex gap-3 flex-wrap">
                {game.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="px-4 py-2 bg-gray-800 rounded-full text-sm"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Release Date */}
          {game.releaseDate && (
            <div>
              <h2 className="text-xl font-semibold mb-3 text-white">
                Release Date
              </h2>
              <p className="text-gray-400">
                {new Date(game.releaseDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </section>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Play Now Card */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Join Playtest
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Ready to experience {game.name}? Click below to start playing!
            </p>
            {game.xp && (
              <p className="text-yellow-500 text-sm font-medium mb-4">
                Earn {game.xp}
              </p>
            )}
            {game.websiteUrl ? (
              <a
                href={game.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="primary"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Join Test
                </Button>
              </a>
            ) : (
              <Button
                variant="primary"
                className="w-full bg-gray-600 cursor-not-allowed"
                disabled
              >
                Coming Soon
              </Button>
            )}
          </div>

          {/* Developer Info */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Developer
            </h3>
            <p className="text-gray-400 text-sm font-mono break-all">
              {game.developer}
            </p>
          </div>

          {/* Back to Discovery */}
          <Link href="/discovery">
            <Button variant="outline" className="w-full">
              ← Back to Discovery
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}
