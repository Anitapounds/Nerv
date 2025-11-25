"use client";

import { motion } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/dist/client/link";
import { fetchMetadataFromIPFS } from "@/lib/gameRegistry";
import { fetchGamesFromBlockchainClient } from "@/lib/blockchainClient";
import { useSuiClient } from "@onelabs/dapp-kit";

export default function DiscoveryPlaytest() {
  const [activeCategory, setActiveCategory] = useState("Action");
  const [blockchainGames, setBlockchainGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const suiClient = useSuiClient();

  const loadGames = async () => {
    try {
      setIsLoading(true);
      console.log("Starting to fetch games from blockchain (wallet client)...");

      const games = await fetchGamesFromBlockchainClient(suiClient);
      console.log(`Fetched ${games.length} games from blockchain`);

      if (games.length === 0) {
        console.warn("No games found on blockchain yet");
        setBlockchainGames([]);
        return;
      }

      // Fetch metadata from IPFS for each game
      console.log("Fetching IPFS metadata for", games.length, "games...");
      const gamesWithMetadata = await Promise.all(
        games.map(async (game) => {
          try {
            console.log(`Fetching metadata for game: ${game.name}, IPFS hash: ${game.metadata_ipfs_hash}`);
            const metadata = await fetchMetadataFromIPFS(game.metadata_ipfs_hash);
            if (metadata) {
              console.log(`Successfully fetched metadata for ${game.name}:`, metadata);
              return {
                ...metadata,
                onchainName: game.name,
                developer: game.developer,
                submittedAt: game.submitted_at,
                submissionType: game.submission_type,
                slug: metadata.name?.toLowerCase().replace(/\s+/g, "-") || metadata.projectName?.toLowerCase().replace(/\s+/g, "-") || game.name.toLowerCase().replace(/\s+/g, "-"),
                title: metadata.name || metadata.projectName || game.name,
                image: metadata.logoUrl || "/images/game1.jpg", // Default image if no logo
                status: metadata.status || "Open",
                xp: metadata.xp || "1500 XP",
                button: metadata.button || "Join Test",
              };
            }
            console.warn(`Failed to fetch metadata for game: ${game.name}`);
            return null;
          } catch (error) {
            console.error(`Error fetching metadata for game ${game.name}:`, error);
            return null;
          }
        })
      );

      // Filter out null values
      const validGames = gamesWithMetadata.filter((game) => game !== null);
      console.log(`Successfully loaded ${validGames.length} valid games with metadata`);
      setBlockchainGames(validGames);
    } catch (error) {
      console.error("Error loading games:", error);
      // Still show empty state instead of crashing
      setBlockchainGames([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const categories = [
    "Action",
    "Adventure",
    "RPG",
    "Strategy",
    "Simulation",
    "Puzzle",
    "Sport",
    "Racing",
    "Fighting",
    "Indie",
  ];

  const staticGames = [
    {
      title: "Cosmic Clash",
      slug: "cosmic-clash",
      description:
        "In a world where strength is everything, challengers rise for glory. Master your skills, and clash to claim your place among legends.",
      image: "/images/game1.jpg",
      status: "Open",
      xp: "1500 XP",
      button: "Join Test",
      websiteUrl: "/games/cosmic-clash",
    },
    {
      title: "Mystic Realms",
      slug: "mystic-realms",
      description:
        "Step into a living world where every choice shapes your destiny. Forge alliances, battle powerful foes, and uncover ancient secrets in a land on the brink of chaos.",
      image: "/images/game2.jpg",
      status: "In progress",
      xp: "1500 XP",
      button: "Give Feedback",
      websiteUrl: "/games/mystic-realms",
    },
    {
      title: "Cyberpunk Battle",
      slug: "cyberpunk-battle",
      description:
        "The future is war. Enter a world of high-tech combat, bold heroes, and endless battles for supremacy.",
      image: "/images/game3.jpg",
      status: "Closed",
      xp: "1,000 88T Tokens",
      button: "Closed",
      websiteUrl: "/games/cyberpunk-battle",
    },
    {
      title: "Galactic Conquest",
      slug: "galactic-conquest",
      description:
        "In a world where strength is everything, challengers rise for glory. Master your skills, and clash to claim your place among legends.",
      image: "/images/game4.jpg",
      status: "Open",
      xp: "1500 XP",
      button: "Join Test",
      websiteUrl: "/games/galactic-conquest",
    },
  ];

  // Merge static games with blockchain games
  const games = [...blockchainGames, ...staticGames];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-600";
      case "In progress":
        return "bg-blue-600";
      case "Closed":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-10 py-16 pt-32">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-fancy">Discovery Playtest</h1>
        <button
          onClick={loadGames}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Refreshing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full border text-sm transition-all ${
              activeCategory === cat
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-gray-600 text-gray-300 hover:bg-gray-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading games from blockchain...</p>
          </div>
        </div>
      )}

      {/* Game List */}
      {!isLoading && (
        <div className="flex flex-col gap-6">
          {games.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">No games found. Be the first to submit!</p>
            </div>
          ) : (
            games.map((game, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-[#0d0d0d] h-58 rounded-2xl overflow-hidden flex flex-col md:flex-row items-center md:items-stretch "
          >
            {/* Image */}
            <img
              src={game.image}
              alt={game.title}
              className="p-2 rounded-2xl h-48 md:h-auto object-cover"
            />

            {/* Info */}
            <div className="flex-1 mx-4 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between mt-2 mb-6">
                  <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                  <div
                    className={`text-xs px-3 py-1 rounded-full mb-2 ${getStatusColor(
                      game.status
                    )}`}
                  >
                    {game.status}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-8">{game.description}</p>

                <div className="pt-8">                  
                  <p className="text-yellow-500 text-xs font-medium">
                    {game.xp}
                  </p>
                </div>
              </div>


            </div>
            <div className="text-center px-10 pb-15 pt-35">
              <Link href={`/games/${game.slug}`}>
                <Button
                  variant="primary"
                  className="hover:bg-gray-200 text-sm"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </motion.div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-2">
        {[1, 2, 3, 4, 5, 6].map((page) => (
          <button
            key={page}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-900 text-sm hover:bg-indigo-600 transition"
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
