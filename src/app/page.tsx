import { Chats } from "@/components/Chats";
import { Landing } from "@/components/Landing";
import { WrapperConnected } from "@/components/WrapperConnected";
import { WrapperDisconnected } from "@/components/WrapperDisconnected";

export default function Home() {
  return (
    <main>
      <WrapperConnected>
        <Chats />
      </WrapperConnected>
      <WrapperDisconnected>
        <Landing />
      </WrapperDisconnected>
    </main>
  );
}
