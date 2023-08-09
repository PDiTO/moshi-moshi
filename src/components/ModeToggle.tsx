"use client";

import {
  ChatBubbleLeftIcon,
  ChatBubbleLeftRightIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  GlobeAmericasIcon as GlobeAmericasIconSolid,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WrapperConnected } from "./WrapperConnected";

export default function ModeToggle() {
  const pathname = usePathname();

  return (
    <WrapperConnected>
      <div className="fixed left-4 top-20 flex flex-col bg-gray-900 p-4 rounded-xl w-20">
        <Link href="/" className="">
          <div className="flex flex-col items-center hover:opacity-80 transition-all">
            {pathname === "/" ? (
              <ChatBubbleLeftRightIconSolid className="w-10 h-10 text-indigo-400" />
            ) : (
              <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />
            )}
            {pathname === "/" ? (
              <p className="text-xs text-indigo-400 font-bold">Community</p>
            ) : (
              <p className="text-xs text-white">Community</p>
            )}
          </div>
        </Link>
        <hr className="my-4 opacity-50" />
        <Link href="/chat">
          <div className="flex flex-col items-center hover:opacity-80 transition-all">
            {pathname === "/chat" ? (
              <ChatBubbleLeftIconSolid className="w-10 h-10 text-indigo-400" />
            ) : (
              <ChatBubbleLeftIcon className="w-10 h-10 text-white" />
            )}
            {pathname === "/chat" ? (
              <p className="text-xs text-indigo-400 font-bold">Chat</p>
            ) : (
              <p className="text-xs text-white">Chat</p>
            )}
          </div>
        </Link>
        <hr className="my-4 opacity-50" />
        <Link href="/proposal">
          <div className="flex flex-col items-center hover:opacity-80 transition-all">
            {pathname === "/proposal" ? (
              <GlobeAmericasIconSolid className="w-10 h-10 text-indigo-400" />
            ) : (
              <GlobeAmericasIcon className="w-10 h-10 text-white" />
            )}
            {pathname === "/proposal" ? (
              <p className="text-xs text-indigo-400 font-bold">RPGF</p>
            ) : (
              <p className="text-xs text-white">RPGF</p>
            )}
          </div>
        </Link>
      </div>
    </WrapperConnected>
  );
}
