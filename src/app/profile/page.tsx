"use client";

import { motion } from "@/lib/motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const games = [
    {
      title: "Cosmic Conquest",
      progress: 75,
      image: "/images/game1.jpg",
    },
    {
      title: "Cosmic Conquest",
      progress: 75,
      image: "/images/game2.jpg",
    },
    {
      title: "Cosmic Conquest",
      progress: 75,
      image: "/images/game3.jpg",
    },
  ];

  const notifications = [
    {
      title: "Test Invite",
      message: "You have been invited to test a new game",
    },
    {
      title: "Tournament Call",
      message: "Arena Clash tournament call starts now.",
    },
    {
      title: "Reward Earned",
      message: "You earned a new badge!",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 pt-30">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        {/* Left: Profile Section */}
        <div className="md:col-span-2">
          <button className="text-gray-400 text-sm mb-6 hover:text-white">
            &larr; Back
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
            <Image
              src="/avatar/profile.jpg"
              alt="Profile"
              width={200}
              height={200}
              className="rounded-full border border-gray-700"
            />

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold">Gamergod</h2>
              <p className="text-gray-400 text-xs">@Gamergod</p>

              <div className="mt-4 flex items-center gap-3">
                <p className="text-gray-300">My Stats</p>
                <div className="border border-gray-500 rounded-full mb-2">
                  <div className="text-white px-2 py-1 text-sm">Connect X</div>
                </div>
              </div>
              {/* Stats Boxes */}
              <div className="grid grid-cols-3 gap-2 mb-5 w-120">
                <div className="bg-neutral-900 p-4 text-center">
                  <p className="text-gray-400 text-sm">Xp</p>
                  <p className="text-lg font-semibold">12,500</p>
                </div>
                <div className="bg-neutral-900 p-4 text-center">
                  <p className="text-gray-400 text-sm">Badges</p>
                  <p className="text-lg font-semibold">7</p>
                </div>
                <div className="bg-neutral-900 p-4 text-center">
                  <p className="text-gray-400 text-sm">Leaderboard rank</p>
                  <p className="text-lg font-semibold">#254</p>
                </div>
              </div>
            </div>
          </div>

          {/* Games Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 uppercase">
              Games I’m Testing
            </h3>

            <div className="space-y-4">
              {games.map((game, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 bg-neutral-900 p-4 rounded-xl"
                >
                  <Image
                    src={game.image}
                    alt={game.title}
                    width={64}
                    height={64}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{game.title}</h4>
                    <p className="text-gray-400 text-sm mb-2">
                      Progress {game.progress}%
                    </p>
                    <div className="w-full bg-gray-700 h-2 rounded-full">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${game.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Notifications */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Notification</h3>

          <div className="space-y-3">
            {notifications.map((note, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-neutral-900 rounded-xl p-4 flex gap-3 items-start"
              >
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">{note.title}</p>
                  <p className="text-gray-400 text-sm">{note.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
