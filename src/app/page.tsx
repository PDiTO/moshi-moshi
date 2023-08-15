"use client";

import { Landing } from "@/components/Landing";
import { Threads } from "@/components/Threads";
import { WrapperConnected } from "@/components/WrapperConnected";
import { WrapperDisconnected } from "@/components/WrapperDisconnected";
import { useNetwork } from "wagmi";

export default function Home() {
  const { chain } = useNetwork();

  return (
    <main>
      <WrapperConnected>
        {chain?.unsupported ? (
          <div className="w-full h-screen flex flex-col items-center justify-center">
            <p className="text-2xl">Unsupported Network.</p>
            <p className="text-sm">
              Please select a supported network using the button in the top
              right
            </p>
          </div>
        ) : (
          <Threads />
        )}
      </WrapperConnected>
      <WrapperDisconnected>
        <Landing />
      </WrapperDisconnected>
    </main>
  );
}
