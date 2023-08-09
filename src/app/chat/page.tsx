"use client";

import { Chats } from "@/components/Chats";
import { WrapperConnected } from "@/components/WrapperConnected";

export default function ChatPage() {
  return (
    <WrapperConnected>
      <Chats />
    </WrapperConnected>
  );
}
