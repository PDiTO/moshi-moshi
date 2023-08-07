import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { WrapperConnected } from "./WrapperConnected";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 z-30 w-full">
      <div className="flex justify-between items-center px-4 py-4">
        <div>
          <Link href="/" className={`text-xl font-bold`}>
            <div className="flex flex-row items-center">
              <Image
                className="mr-2"
                src="/mmLogo.png"
                alt="me"
                width="32"
                height="32"
              />
              MOSHI
              <span className="font-light">MOSHI</span>
            </div>
          </Link>
        </div>
        <WrapperConnected>
          <ConnectButton />
        </WrapperConnected>
      </div>
    </div>
  );
}
