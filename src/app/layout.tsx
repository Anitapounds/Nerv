import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import { Erica_One } from "next/font/google";
import { Federant } from "next/font/google";
import OneLabsProvider from "@/providers/OneLabsProvider";

const federant = Federant({ subsets: ["latin"], weight: "400", variable: "--font-federant" });

const ericaOne = Erica_One({ subsets: ["latin"], weight: "400", variable: "--font-erica-one" });

export const metadata = {
  title: "NERV - Web3 Gaming Arena",
  description: "Play, Test, and Rule the Game in Web3 tournaments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-black text-white ${ericaOne.variable} ${federant.variable} font-sans`}>
        <OneLabsProvider>
          <NavbarWrapper />
          <main>{children}</main>
        </OneLabsProvider>
      </body>
    </html>
  );
}
