"use client";

import { Chat } from "@/components/Chat";
import { Thread } from "@/components/Thread";
import { WrapperConnected } from "@/components/WrapperConnected";
import { useParams } from "next/navigation";

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
