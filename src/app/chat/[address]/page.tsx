"use client";

import { Chat } from "@/components/Chat";
import { WrapperConnected } from "@/components/WrapperConnected";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const { address } = useParams() as {
    address: string;
  };

  return (
    <WrapperConnected>
      <Chat recipient={address} />
    </WrapperConnected>
  );
}
