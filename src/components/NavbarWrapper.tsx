// src/components/NavbarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const noNavbarRoutes = ["/", "/login", "/passwordreset"];

  return !noNavbarRoutes.includes(pathname) ? <Navbar /> : null;
}
