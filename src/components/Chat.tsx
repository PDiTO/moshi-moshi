"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { MessageBox } from "./MessageBox";

import { useData } from "@/contexts/DataContext";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import Loading from "./Loading";
import NavbarSpacer from "./NavbarSpacer";
import { useRouter } from "next/navigation";

type Props = {
  recipient: string;
};

export function Chat({ recipient }: Props) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { conversations, profiles } = useData();
  const thisChat = conversations.find((convo) => convo.address == recipient);
  const router = useRouter();

  const handleClick = async () => {
    router.push(`/profile/${recipient}`);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [thisChat?.attestations]);

  if (!recipient || !thisChat) return <Loading />;

  return (
    <div className="w-full h-screen max-w-md mx-auto flex flex-col items-center">
      <NavbarSpacer />
      <div className="flex flex-row gap-2 items-center w-full">
        <button onClick={() => router.back()}>
          <ChevronLeftIcon className="w-10 h-10 text-indigo-400 hover:opacity-80" />
        </button>

        {/* <h3 className="text-lg font-medium py-4">
          Chat with {thisChat?.address}
        </h3> */}
        <button
          onClick={handleClick}
          className="flex flex-row justify-center gap-2 items-center w-full mr-10"
        >
          {profiles[thisChat.address]?.avatarUrl && (
            <img
              src={profiles[thisChat.address].avatarUrl}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <h3 className="text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap">
            {profiles[thisChat.address]?.displayName ||
              `${thisChat.address.slice(0, 6)}...${thisChat.address.slice(-4)}`}
          </h3>
        </button>
      </div>

      <div className="w-full max-w-md flex flex-col gap-4 overflow-y-auto px-2 no-scrollbar">
        {thisChat?.attestations.map((att, index) => (
          <MessageBubble
            key={index}
            message={att.publicMessage}
            isSender={att.isSender}
            timestamp={att.time}
          />
        ))}
        <div ref={messagesEndRef} /> {/* This will be our point to scroll to */}
      </div>
      <div className="w-full max-w-md mt-8">
        <MessageBox recipient={recipient} />
      </div>
      <NavbarSpacer />
    </div>
  );
}
