"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import WalletConnectButton from "./WalletConnectButton";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-6 fixed top-0 w-full bg-transparent z-50 border-b border-gray-800 pb-2 ">
      <div className="flex justify-between items-center gap-8">
        <h1 className="text-2xl font-bold text-white">NERV</h1>

        <ul className="flex gap-8 text-gray-300 text-sm font-medium px-4">
          <Link href="/dashboard">
            <li className="hover:text-indigo-500 cursor-pointer px-2">Home</li>
          </Link>
          <Link href="/discovery">
            <li className="hover:text-indigo-500 cursor-pointer px-2">Game</li>
          </Link>
          <Link href="/developer">
            <li className="hover:text-indigo-500 cursor-pointer px-2">Developers</li>
          </Link>
          <Link href="/ongoing-live">
            <li className="hover:text-indigo-500 cursor-pointer px-2">Live</li>
          </Link>
          <li className="hover:text-indigo-500 cursor-pointer px-2">Explore</li>
          <Link href="/games/leaderboard">
            <li className="hover:text-indigo-500 cursor-pointer px-2">Leaderboard</li>
          </Link>
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2 top-2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Look Up a Game"
            className="bg-gray-800 text-white text-sm rounded-md pl-8 pr-3 py-2 outline-none"
          />
        </div>
        <WalletConnectButton className="hover:bg-gray-200 text-sm" />
        <Link
            href="/profile"
            type="button"
            className="hover:text-gray-600 rounded-full bg-white space-x-4"
          >
            <Image
              src="/avatar/profile.jpg"
              alt="Profile"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full bg-white p-1"
            />
          </Link>
      </div>
    </nav>
  );
}
