import { Thread } from "@/types/helperTypes";
import { countComments } from "@/utils/uiUtils";
import { ChatBubbleLeftRightIcon, StarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
  thread: Thread;
};

export function ThreadSummary({ thread }: Props) {
  return (
    <Link href={`/${thread.attestation.id}`}>
      <div className="flex flex-col gap-1 bg-gray-900 p-4 rounded-xl ">
        <h3 className="text-xs font-bold overflow-hidden text-ellipsis whitespace-nowrap">
          {thread.attestation.attester}
        </h3>
        <p className="">{thread.attestation.title}</p>
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-row justify-between gap-4">
            <div className="flex flex-row justify-center items-center gap-1">
              <StarIcon className="h-5 w-5 text-indigo-400" />
              <p className="text-xs font-bold text-indigo-400">
                {thread.votes}
              </p>
            </div>
            <div className="flex flex-row justify-center items-center gap-1">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-indigo-400" />
              <p className="text-xs font-bold text-indigo-400">
                {countComments(thread)}
              </p>
            </div>
          </div>
          <p className="text-xs font-bold text-indigo-400">
            {new Date(thread.attestation.time * 1000).toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
