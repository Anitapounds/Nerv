"use client";

import { motion } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/dist/client/link";

export default function DiscoveryPlaytest() {
  const [activeCategory, setActiveCategory] = useState("Action");
  const [userGames, setUserGames] = useState<any[]>([]);

  useEffect(() => {
    // Load user-submitted games from localStorage
    const storedGames = localStorage.getItem("userGames");
    if (storedGames) {
      setUserGames(JSON.parse(storedGames));
    }
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

  // Merge static games with user-submitted games
  const games = [...userGames, ...staticGames];

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
      <h1 className="text-3xl font-fancy mb-2">Discovery Playtest</h1>

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

      {/* Game List */}
      <div className="flex flex-col gap-6">
        {games.map((game, index) => (
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
              {game.websiteUrl && game.websiteUrl.startsWith("http") ? (
                <a href={game.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="primary"
                    className="hover:bg-gray-200 text-sm"
                  >
                    {game.button}
                  </Button>
                </a>
              ) : (
                <Link href={game.websiteUrl || `/games/${game.slug}`}>
                  <Button
                    variant="primary"
                    className="hover:bg-gray-200 text-sm"
                  >
                    {game.button}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>

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
