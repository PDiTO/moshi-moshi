"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { MessageBox } from "./MessageBox";

import { useData } from "@/contexts/DataContext";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import Loading from "./Loading";
import NavbarSpacer from "./NavbarSpacer";
import { ThreadBubble } from "./ThreadBubble";
import { useAccount } from "wagmi";

type Props = {
  uid: string;
};

export function Thread({ uid }: Props) {
  const { threads } = useData();
  const thisThread = threads.find((t) => t.attestation.id == uid);
  const { address } = useAccount();

  if (!uid || !thisThread)
    return (
      <div>
        <NavbarSpacer />
        <Loading />
      </div>
    );

  return (
    <div className="w-full h-screen max-w-md mx-auto flex flex-col items-center">
      <NavbarSpacer />
      <div className="w-full flex flex-row gap-2 items-center">
        <Link href="/">
          <ChevronLeftIcon className="w-10 h-10 text-indigo-400 hover:opacity-80" />
        </Link>
        <h3 className="text-lg font-medium py-4">
          {thisThread.attestation.title}
        </h3>
      </div>
      <div className="w-full max-w-md flex flex-col gap-4 overflow-y-auto px-2 no-scrollbar">
        <ThreadBubble
          opUid={thisThread.attestation.id}
          opAddress={thisThread.attestation.attester}
          uid={thisThread.attestation.id}
          thread={thisThread.attestation.thread}
          attester={thisThread.attestation.attester}
          timestamp={thisThread.attestation.time}
          isUser={thisThread.attestation.attester === address}
          votes={thisThread.votes}
          liked={thisThread.liked}
          subComments={thisThread.comments}
        />
      </div>

      <NavbarSpacer />
    </div>
  );
}
