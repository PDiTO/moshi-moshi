import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { WrapperConnected } from "./WrapperConnected";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 z-30 w-full">
      <div className="flex justify-between items-center px-4 py-4">
        <div>
          <Link href="/" className={`text-xl font-bold  opacity-80`}>
            MOSHI
            <span className="font-light">MOSHI</span>
          </Link>
        </div>
        <WrapperConnected>
          <ConnectButton />
        </WrapperConnected>
      </div>
    </div>
  );
}
