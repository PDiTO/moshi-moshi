import { useData } from "@/contexts/DataContext";
import { Thread } from "@/types/helperTypes";
import { countComments, formatDate } from "@/utils/uiUtils";
import { ChatBubbleLeftRightIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import Link from "next/link";

type Props = {
  thread: Thread;
};

export function ThreadSummary({ thread }: Props) {
  const { profiles } = useData();

  return (
    <Link href={`/${thread.attestation.id}`}>
      <div className="flex flex-col gap-1 bg-gray-900 p-4 rounded-xl ">
        <div className="flex flex-row justify-start gap-2 items-center">
          {profiles[thread.attestation.attester]?.avatarUrl && (
            <img
              src={profiles[thread.attestation.attester].avatarUrl}
              className="w-5 h-5 rounded-full object-cover"
            />
          )}
          <h3 className="text-xs font-bold overflow-hidden text-ellipsis whitespace-nowrap">
            {profiles[thread.attestation.attester]?.displayName ||
              `${thread.attestation.attester.slice(
                0,
                6
              )}...${thread.attestation.attester.slice(-4)}`}
          </h3>
        </div>
        <p className="">{thread.attestation.title}</p>
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-row justify-between gap-4">
            <div className="flex flex-row justify-center items-center gap-1">
              {thread.liked ? (
                <StarIconSolid className="h-5 w-5 text-indigo-400" />
              ) : (
                <StarIcon className="h-5 w-5 text-indigo-400" />
              )}
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
            {formatDate(thread.attestation.time)}
          </p>
        </div>
      </div>
    </Link>
  );
}
