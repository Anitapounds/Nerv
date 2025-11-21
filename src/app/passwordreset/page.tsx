"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[url('/images/signupbg1.jpg')] bg-cover bg-center md:py-50 md:px-90">
      <div className="px-8 text-white">
          <h2 className="text-3xl font-bold mb-2 text-center">Reset Password</h2>
          <p className="text-white mb-15 text-center">
            Type in your registered email to continue your gaming journey.
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
            <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-gray-500 text-white py-2 rounded-md transition"
              >
                Continue
              </button>
          </form>
        </div>
    </div>

        );
        }