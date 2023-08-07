import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <Image src="/mmLogo.png" alt="me" width="128" height="128" />
      <h1 className="text-6xl font-medium">
        MOSHI
        <span className="font-light">MOSHI</span>
      </h1>
      <h2 className="text-xl -mt-3 mb-6">
        Chat with whomever, from whatever identity you want
      </h2>
      <div className="animate-pulse">
        <ConnectButton />
      </div>
    </div>
  );
}
