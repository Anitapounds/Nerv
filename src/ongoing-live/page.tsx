"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";

const ongoingLives = [
  {
    id: 1,
    username: "Gamergod",
    handle: "@Goodoz",
    thumbnail: "/images/game1.jpg",
    viewers: 45,
  },
  {
    id: 2,
    username: "Nerva",
    handle: "@NervaGames",
    thumbnail: "/images/game2.jpg",
    viewers: 78,
  },
];

export default function OngoingLivePage() {
  return (
    <div className="min-h-screen bg-black px-15 py-6 relative pt-30">
      {/* Heading */}

      <Link
        href="/dashboard"
        className="text-gray-400 text-sm hover:text-white"
      >
        ←
      </Link>
      <h1 className="text-2xl text-white font-fancy mb-10 mt-7">
        Ongoing Live
      </h1>

      {/* Live Cards */}
      <div className="flex flex-col gap-8">
        {ongoingLives.map((live) => (
          <div key={live.id} className="flex flex-col space-y-2 text-white">
            <div className="flex items-center gap-3">
              <Image
                src="/avatar/profile.jpg"
                alt={live.username}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="text-sm font-semibold">{live.username}</h3>
                <p className="text-xs text-gray-400">{live.handle}</p>
              </div>
            </div>

            {/* Thumbnail Card */}
            <Link href={`/ongoing-live/${live.id}`}>
              <div className="relative rounded-xl overflow-hidden group">
                <Image
                  src={live.thumbnail}
                  alt={live.username}
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover rounded-xl group-hover:opacity-90 transition"
                />

                {/* Live tag */}
                <span className="absolute bottom-3 left-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-md">
                  Live
                </span>

                {/* Viewer count */}
                <div className="absolute bottom-3 right-3 flex items-center text-xs text-gray-300 space-x-1">
                  <Eye size={14} />
                  <span>{live.viewers}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Floating + Button */}
      <Link
        href="/ongoing-live/live"
        className="fixed bottom-8 right-8 bg-indigo-700 text-white rounded-full w-12 h-12 flex items-center justify-center text-3xl hover:bg-indigo-800 transition"
      >
        +
      </Link>
    </div>
  );
}
