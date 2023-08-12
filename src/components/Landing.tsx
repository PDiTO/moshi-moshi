import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <div className="flex flex-row gap-6">
        <Image
          src={"/baseLogo.svg"}
          alt={"baseLogo"}
          width={32}
          height={32}
          className="pt-16"
        />
        <Image
          src={"/modeLogo.svg"}
          alt={"modeLogo"}
          width={32}
          height={32}
          className="mr-1"
        />
        <Image
          src={"/opLogo.svg"}
          alt={"optimismLogo"}
          width={32}
          height={32}
          className={"ml-1"}
        />
        <Image
          src={"/zoraLogo.svg"}
          alt={"zoraLogo"}
          width={32}
          height={32}
          className="pt-16"
        />
      </div>
      <Image
        src="/mmLogo.png"
        alt="Moshi Moshi Logo"
        width={128}
        height={128}
        className="-mt-6"
      />
      <h1 className="text-6xl font-bold">
        MOSHI
        <span className="font-light">MOSHI</span>
      </h1>
      <h2 className="text-xl -mt-3 mb-6">Join the conversation</h2>
      <div className="animate-pulse">
        <ConnectButton />
      </div>
      <div className="flex flex-col items-center justify-center mt-16 ">
        <p className="text-sm mb-1">powered by</p>
        <div className="flex flex-row items-center justify-center gap-8">
          <Image src="/eas.svg" alt="EAS" width={96} height={96} />
          <Image src="/covalent.svg" alt="EAS" width={96} height={96} />
        </div>
      </div>
    </div>
  );
}
