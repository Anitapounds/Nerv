'use client';

import Image from "next/image";
import { Federant } from "next/font/google";

const federant = Federant({
  subsets: ["latin"],
  weight: "400",
});

const games = [
  {
    id: 1,
    title: "Cyberpunk Battle",
    description:
      "The future is war. Enter a world of high-tech combat, bold heroes, and endless battles for supremacy.",
    players: "20,000+",
    status: "closed",
    image: "/images/game1.jpg",
    bgColor: "bg-green-950",
    buttonColor: "bg-green-600",
  },
  {
    id: 2,
    title: "Cosmic Clash",
    description:
      "In a world where strength is everything, challengers rise for glory. Master your skills, and clash to claim your place among legends.",
    players: "20,000+",
    status: "open",
    image: "/images/game2.jpg",
    bgColor: "bg-red-950",
    buttonColor: "bg-red-800",
  },
  {
    id: 3,
    title: "Cosmic Clash",
    description:
      "In a world where strength is everything, challengers rise for glory. Master your skills, and clash to claim your place among legends.",
    players: "20,000+",
    status: "open",
    image: "/images/game3.jpg",
    bgColor: "bg-yellow-900",
    buttonColor: "bg-yellow-600",
  },
  {
    id: 4,
    title: "Cosmic Clash",
    description:
      "In a world where strength is everything, challengers rise for glory. Master your skills, and clash to claim your place among legends.",
    players: "20,000+",
    status: "open",
    image: "/images/game4.jpg",
    bgColor: "bg-gray-900",
    buttonColor: "bg-gray-700",
  },
];

export default function GamesLeaderboard() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      {/* Header */}
      <h1 className={`${federant.className} text-3xl md:text-4xl font-bold pt-20`}>
        Games Leaderboard
      </h1>
      <p className="text-white mt-2">
        Compete with your fellow players and rack up points.
      </p>

      {/* Filter Tabs */}
      <div className="flex justify-between gap-6 mx-8 mt-8 text-white">
        <span className="font-semibold">Games</span>
        <div className="flex gap-6 text-sm">
          {["7D", "30D", "3M", "6M"].map((tab) => (
            <button
              key={tab}
              className="hover:text-indigo-600 transition-colors duration-200"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Game Cards */}
      <div className="mt-8 space-y-6">
        {games.map((game) => (
          <div
            key={game.id}
            className={`${game.bgColor} rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6`}
          >
            <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
              <Image
                src={game.image}
                alt={game.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className={`${federant.className} text-xl font-semibold`}>
                {game.title}
              </h2>
              <p className="text-gray-300 text-sm mt-1">{game.description}</p>

              <div className="flex items-center gap-2 mt-3 text-gray-400">
                <Image
                  src="/icons/players.svg"
                  alt="players"
                  width={24}
                  height={24}
                />
                <span>{game.players}+ Players</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  game.status === "open"
                    ? "bg-green-700 text-white"
                    : "bg-red-700 text-white"
                }`}
              >
                {game.status === "open" ? "Open" : "Closed"}
              </div>
              <button
                className={`${game.buttonColor} text-white px-6 py-2 rounded-lg hover:opacity-80 transition`}
              >
                {game.status === "open" ? "Join Test" : "Closed"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
