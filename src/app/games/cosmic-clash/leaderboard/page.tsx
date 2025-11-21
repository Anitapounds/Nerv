"use client";

import { motion } from "@/lib/motion";
import Image from "next/image";

const leaderboardData = [
  { rank: 1, name: "Gamergod", handle: "@Goodoz", xp: "15,000", score: "2,500", color: "bg-green-900" },
  { rank: 2, name: "Gamergod", handle: "@Goodoz", xp: "14,500", score: "2,400", color: "bg-red-900" },
  { rank: 3, name: "Gamergod", handle: "@Goodoz", xp: "14,300", score: "2,100", color: "bg-yellow-900" },
  { rank: 4, name: "Gamergod", handle: "@Goodoz", xp: "13,600", score: "1,400", color: "bg-neutral-900" },
  { rank: 5, name: "Gamergod", handle: "@Goodoz", xp: "13,000", score: "1,300", color: "bg-neutral-900" },
  { rank: 6, name: "Gamergod", handle: "@Goodoz", xp: "13,200", score: "1,250", color: "bg-neutral-900" },
  { rank: 7, name: "Gamergod", handle: "@Goodoz", xp: "13,200", score: "1,250", color: "bg-neutral-900" },
  { rank: 8, name: "Gamergod", handle: "@Goodoz", xp: "13,200", score: "1,250", color: "bg-neutral-900" },
  { rank: 25, name: "Gamergod", handle: "@Goodoz", xp: "1,000", score: "250", color: "bg-neutral-900" },
];

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-12 py-8 pt-25">
      <button className="text-sm text-gray-400 hover:text-white mb-10">&larr; Back</button>

      <div>
        <h1 className="text-3xl font-fancy mb-1">Player Leaderboard</h1>
        <p className="text-gray-400 mb-8">Compete with your fellow players and rack up points.</p>

        {/* Header Row */}
        <div className="grid grid-cols-2 text-white text-sm mb-4 px-4">
          <p>Name</p>
          <div className="flex gap-5 sm:gap-18 justify-end">
            <p className="text-center">Xp</p>
            <p className="text-right">Game Score</p>
          </div>
        </div>

        {/* Leaderboard Items */}
        <div className="space-y-3">
          {leaderboardData.map((player, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`grid grid-cols-2 items-center ${player.color} rounded-2xl p-4 sm:px-12`}
            >
              {/* Player Info */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-6">{player.rank}</span>
                
                <img
                  src="/avatar/profile.jpg"
                  alt="avatar"
                  width={32}
                  height={32}
                  className="hover:text-gray-600 rounded-full bg-white space-x-4"
                />
                <div>
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-gray-400 text-sm">{player.handle}</p>
                </div>
              </div>
            
              <div className="flex gap-5 sm:gap-18 justify-end">
                {/* XP */}
                <p className=" font-semibold">{player.xp}</p>

                {/* Score */}
                <p className=" font-semibold">{player.score}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
