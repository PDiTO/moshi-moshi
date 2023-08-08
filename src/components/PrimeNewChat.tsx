"use client";

import { useData } from "@/contexts/DataContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PrimeNewChat() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const { primeEmptyConversation, conversations } = useData();

  const handleClick = () => {
    const thisChat = conversations.find((convo) => convo.address == address);
    if (!thisChat) {
      primeEmptyConversation(address);
    }
    router.push(`/chat/${address}`);
  };

  return (
    <div className="w-full flex flex-col py-10 justify-center items-center gap-3">
      <input
        className="w-full flex-grow text-sm bg-black text-white border border-gray-200 rounded-full py-2 px-3 leading-tight focus:outline-none focus:border-indigo-400"
        id="message-text"
        type="text"
        placeholder="Enter address or ENS..."
        spellCheck={false}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        className=" bg-indigo-400 rounded-lg py-1 px-3"
        onClick={handleClick}
      >
        Start Talking
      </button>
    </div>
  );
}
