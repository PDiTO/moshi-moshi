"use client";

import { ChatSummary } from "./ChatSummary";
import { useData } from "@/contexts/DataContext";
import Loading from "./Loading";
import { PlusIcon, UserPlusIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import PrimeNewChat from "./PrimeNewChat";

export function Chats() {
  const { conversations } = useData();
  const [showPrimeNewChat, setShowPrimeNewChat] = useState(false);

  if (!conversations) return <Loading />;

  return (
    <div className="flex flex-col h-screen items-center py-20 overflow-hidden">
      <div className="flex w-full max-w-sm justify-between items-start">
        <div className="w-20 display-hidden text-black">. </div>
        <div className="text-center text-4xl font-medium">Chats</div>
        <div className="text-right w-20">
          <button
            onClick={() => {
              setShowPrimeNewChat(!showPrimeNewChat);
            }}
          >
            <PlusIcon
              className={`w-10 h-10 text-indigo-400 hover:opacity-80 transition-all ${
                showPrimeNewChat ? "rotate-45" : "rotate-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`w-full max-w-sm mx-auto ${
          showPrimeNewChat
            ? "scale-100 opacity-100 h-32"
            : "scale-0 opacity-0 h-0"
        } transition-all`}
      >
        <PrimeNewChat />
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col gap-4 overflow-y-auto mt-4">
        {conversations.map((conversation, index) => (
          <ChatSummary conversation={conversation} key={index} />
        ))}
      </div>
    </div>
  );
}
