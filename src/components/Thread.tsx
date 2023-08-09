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

type Props = {
  uid: string;
};

export function Thread({ uid }: Props) {
  const { threads } = useData();
  const thisThread = threads.find((t) => t.attestation.id == uid);

  if (!uid || !thisThread) return <Loading />;

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

      <ThreadBubble
        thread={thisThread.attestation.thread}
        attester={thisThread.attestation.attester}
        timestamp={thisThread.attestation.time}
        isOP={true}
        votes={thisThread.votes}
        subComments={thisThread.comments}
      />

      <NavbarSpacer />
    </div>
  );
}
