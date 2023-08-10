"use client";

import { Chat } from "@/components/Chat";
import { Thread } from "@/components/Thread";
import { WrapperConnected } from "@/components/WrapperConnected";
import { useParams } from "next/navigation";
import { useEnsName } from "wagmi";

export default function ChatPage() {
  const { uid } = useParams() as {
    uid: string;
  };

  return (
    <WrapperConnected>
      <Thread uid={uid} />
    </WrapperConnected>
  );
}
