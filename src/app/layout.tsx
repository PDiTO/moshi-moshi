import type { Metadata } from "next";

// Styles
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

// Fonts
import { Urbanist } from "next/font/google";

// Components
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import { DataProvider } from "@/contexts/DataContext";
import ModeToggle from "@/components/ModeToggle";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moshi Moshi",
  description: "Chat from your wallet or NFT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={urbanist.className}>
        <Providers>
          <Navbar />
          <ModeToggle />
          <DataProvider>{children}</DataProvider>
        </Providers>
      </body>
    </html>
  );
}
