import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <Image
        src="/mmLogo.png"
        alt="Moshi Moshi Logo"
        width={128}
        height={128}
      />
      <h1 className="text-6xl font-medium">
        MOSHI
        <span className="font-light">MOSHI</span>
      </h1>
      <h2 className="text-xl -mt-3 mb-6">Join the conversation</h2>
      <div className="animate-pulse">
        <ConnectButton />
      </div>
      <div className="flex flex-col items-center justify-center mt-10 ">
        <p className="text-sm mb-1">powered by</p>
        <div className="flex flex-row items-center justify-center gap-8">
          <Image src="/eas.svg" alt="EAS" width={128} height={128} />
          <Image src="/covalent.svg" alt="EAS" width={128} height={128} />
        </div>
      </div>
    </div>
  );
}
