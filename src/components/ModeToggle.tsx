"use client";

import {
  ChatBubbleLeftIcon,
  ChatBubbleLeftRightIcon,
  GlobeAmericasIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  GlobeAmericasIcon as GlobeAmericasIconSolid,
  UserIcon as UserIconSolid,
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
            {pathname === "/" || pathname.startsWith("/0x") ? (
              <ChatBubbleLeftRightIconSolid className="w-8 h-8 text-indigo-400" />
            ) : (
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
            )}
            {pathname === "/" || pathname.startsWith("/0x") ? (
              <p className="text-xs text-indigo-400 font-bold">Community</p>
            ) : (
              <p className="text-xs text-white">Community</p>
            )}
          </div>
        </Link>
        <hr className="my-4 opacity-50" />
        <Link href="/chat">
          <div className="flex flex-col items-center hover:opacity-80 transition-all">
            {pathname.startsWith("/chat") ? (
              <ChatBubbleLeftIconSolid className="w-8 h-8 text-indigo-400" />
            ) : (
              <ChatBubbleLeftIcon className="w-8 h-8 text-white" />
            )}
            {pathname.startsWith("/chat") ? (
              <p className="text-xs text-indigo-400 font-bold">Chat</p>
            ) : (
              <p className="text-xs text-white">Chat</p>
            )}
          </div>
        </Link>
        <hr className="my-4 opacity-50" />
        {/* <Link href="/proposal">
          <div className="flex flex-col items-center hover:opacity-80 transition-all">
            {pathname.startsWith("/proposal") ? (
              <GlobeAmericasIconSolid className="w-8 h-8 text-indigo-400" />
            ) : (
              <GlobeAmericasIcon className="w-8 h-8 text-white" />
            )}
            {pathname.startsWith("/proposal") ? (
              <p className="text-xs text-indigo-400 font-bold">RPGF</p>
            ) : (
              <p className="text-xs text-white">RPGF</p>
            )}
          </div>
        </Link>
        <hr className="my-4 opacity-50" /> */}
        <Link href="/profile">
          <div className="flex flex-col items-center hover:opacity-80 transition-all">
            {pathname.startsWith("/profile") ? (
              <UserIconSolid className="w-8 h-8 text-indigo-400" />
            ) : (
              <UserIcon className="w-8 h-8 text-white" />
            )}
            {pathname.startsWith("/profile") ? (
              <p className="text-xs text-indigo-400 font-bold">Profile</p>
            ) : (
              <p className="text-xs text-white">Profile</p>
            )}
          </div>
        </Link>
      </div>
    </WrapperConnected>
  );
}
