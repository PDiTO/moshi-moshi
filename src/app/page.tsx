import { Landing } from "@/components/Landing";
import { Threads } from "@/components/Threads";
import { WrapperConnected } from "@/components/WrapperConnected";
import { WrapperDisconnected } from "@/components/WrapperDisconnected";

export default function Home() {
  return (
    <main>
      <WrapperConnected>
        <Threads />
      </WrapperConnected>
      <WrapperDisconnected>
        <Landing />
      </WrapperDisconnected>
    </main>
  );
}
