"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import WalletConnectButton from "@/components/WalletConnectButton";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[url('/images/signupbg1.jpg')] bg-cover bg-center md:py-18 md:px-90">
      <div className="px-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Get back in</h2>
          <p className="text-white mb-8">
            Create your account to unlock your gaming dashboard and explore all
            features
          </p>

          <form className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md bg-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-600 text-black"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-md bg-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-600 text-black"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" />
                Remember me
              </label>
              <Link href="/passwordreset" className="text-indigo-400 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <Link href="/dashboard"> 
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-gray-500 text-white py-2 rounded-md transition"
              >
                Sign In
              </button>
            </Link>
          </form>

          <div className="w-full h-px bg-gray-300 my-4"></div>


          {/* Social Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-800 transition">
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
            </button>
            <WalletConnectButton className="flex-1 border border-gray-300 rounded-md py-2 hover:bg-gray-800 transition bg-transparent text-white" />
          </div>

          {/* Footer */}
          <p className="text-center text-white mt-8 text-sm">
            Already have an account?{" "}
            <Link href="/" className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </p>
      </div>
    </div>
  );
}
