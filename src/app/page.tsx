"use client";

import Image from "next/image";
import { motion } from "@/lib/motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import WalletConnectButton from "@/components/WalletConnectButton";

export default function SignupPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Side: Image */}
      <div className="relative">
        <Image
          src="/images/signupbg2.jpg" 
          alt="Game Image"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Side: Form */}
      <div className="relative flex flex-col justify-center bg-[url('/images/signupbg1.jpg')] bg-cover bg-center p-8 text-white">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Gear up, it’s time to play
          </h2>
          <p className="text-gray-300 mb-8">
            Create your account to unlock your gaming dashboard and explore all features
          </p>

          <form className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm white">First name</label>
                <input
                  type="text"
                  placeholder="Enter your firstname"
                  className="w-full bg-white border border-gray-700 rounded-md px-3 py-2 text-sm outline-none text-black"
                />
              </div>

              <div className="flex-1">
                <label className="text-sm white">Last name</label>
                <input
                  type="text"
                  placeholder="Enter your lastname"
                  className="w-full bg-white border border-gray-700 rounded-md px-3 py-2 text-sm outline-none text-black"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-white">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white border border-gray-700 rounded-md px-3 py-2 text-sm outline-none text-black"
              />
            </div>

            <Link href="/dashboard">
              <Button
                variant="primary"
                className="w-full bg-gray-200 hover:bg-gray-300 text-black py-2 rounded-md text-sm"
              >
                sign up
              </Button>
            </Link>
          </form>

          <div className="w-full h-px bg-gray-300 my-4"></div>

          <div className="flex gap-4 mt-6">
            <div
              className="flex font-semibold text-white border border-gray-300 text-center p-3 rounded-md max-w-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C34.7 32.3 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.2 6.4 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11.6 0 19.6-8.1 19.6-19.5 0-1.3-.1-2.3-.3-3z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15.3 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.2 6.4 29.4 4 24 4c-7.5 0-14 4.2-17.7 10.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.3 0 10.2-2 13.8-5.3l-6.4-5.4C29.4 34.5 26.8 36 24 36c-6 0-10.7-3.8-12.5-9l-6.6 5.1C8.7 39.8 15.7 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3C34.7 32.3 30 36 24 36c-3.9 0-7.4-1.8-9.7-4.6l-6.6 5.1C11.3 39.8 17.1 44 24 44c11.6 0 19.6-8.1 19.6-19.5 0-1.3-.1-2.3-.3-3z"
                />
              </svg>
              Sign up with Google
            </div>

            <WalletConnectButton
              variant="secondary"
              className="flex-1 font-semibold text-white border border-gray-300 text-center p-3 rounded-md max-w-xs bg-transparent hover:bg-gray-800 transition"
            />
          </div>

          <p className="mt-9 text-sm text-white text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 hover:underline">
              Log in
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
