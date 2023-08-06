import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-6xl font-black pb-6">もしもし</h1>
      <h1 className="text-6xl font-medium">
        MOSHI
        <span className="font-light">MOSHI</span>
      </h1>
      <h2 className="text-xl -mt-3 mb-6">
        Chat with whomever, from whatever identity you want
      </h2>
      <ConnectButton />
    </div>
  );
}
