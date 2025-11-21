"use client";

import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from "@/lib/motion";
import Link from "next/dist/client/link";

export default function HomePage() {
  
const games = [
  {
    title: "VR Games",
    image: "/images/homevr1.jpg",
    discription: "An immersive VR experience that transports players.",
  },
  {
    title: "enter in essport's",
    image: "/images/homevr2.jpg",
    discription: "A thrilling multiplayer game where players.",
  },
  {
    title: "console games",
    image: "/images/homevr3.jpg",
    discription: "A thrilling multiplayer game where players",
  },
];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/images/nerv_bkg.jpg')",
      }}
    >
      {/* Hero Section */}
      <div className="px-8 md:px-20 py-10 pt-23 md:mr-100 lg:mr-195">
        <div className="bg-transparent backdrop-blur-xs border border-gray-500 text-center p-3 rounded-full max-w-xs mt-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="uppercase tracking-widest text-white text-xs"
          >
            Join the Ultimate Gaming Experience
          </motion.h2>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-3xl md:text-5xl leading-tight font-heading tracking-wider"
        >
          <div className="flex mt-2">
            <div className="rounded-md w-2 h-8 lg:h-15 md:h-15 bg-gradient-to-b from-gray-300 to-gray-300 mr-1"></div>
            <span>Play, Test </span>
          </div>
          <span>Rule the Game</span>
        </motion.h1>

        <p className="text-white-400 mt-2 max-w-md">
          Discover early-stage Web3 games. Compete in skill-
          based tournaments. Earn badges, points, and
          reputation all on-chain.
        </p>

        <div className="flex gap-4 mt-4">
          <div className="flex-1 bg-transparent backdrop-blur-xs border border-gray-500 text-center p-2 px-2 lg:p-3 lg:px-3 rounded-xl hover:bg-indigo-700 ">
            <Link href="#" className="uppercase tracking-wider text-white text-sm">Enter Arena</Link>
          </div>
          <div className="flex-1 bg-transparent backdrop-blur-xs border border-gray-500 text-center p-3 rounded-xl hover:bg-indigo-700">
            <Link href="/developerforgame" className="uppercase tracking-wider text-white text-sm">Add Game</Link>
          </div>
        </div>
      </div>

      {/* Game Cards */}
      <section className="grid md:grid-cols-3 gap-6 px-2 md:px-5 pb-3">
        {games.map((game, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="relative rounded-2xl overflow-hidden group cursor-pointer"
          >
            <div className="flex justify-between  p-4">
              <div>
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-30 object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="px-4 w-50 bottom-4 left-4">
                <h3 className="text-xs font-semibold uppercase">{game.title}</h3><br />
                <p className="text-[0.625rem] text-gray-300 uppercase">{game.discription}</p><br />
                <div className="text-[0.625rem] flex justify-between items-center">
                  <div className="flex gap-2">
                    <FontAwesomeIcon icon={faHeart} />
                    <p>1.3k</p>
                  </div>
                  <p className="underline">EXPLORE</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
