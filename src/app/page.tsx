import { Landing } from "@/components/Landing";
import { WrapperConnected } from "@/components/WrapperConnected";
import { WrapperDisconnected } from "@/components/WrapperDisconnected";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <WrapperConnected>
        <p>Connected</p>
      </WrapperConnected>
      <WrapperDisconnected>
        <Landing />
      </WrapperDisconnected>
    </main>
  );
}
