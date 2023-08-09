import { ThreadComment } from "@/types/helperTypes";
import {
  ChatBubbleLeftRightIcon,
  LinkIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
  attester: string;
  thread: string;
  timestamp: number;
  isOP: boolean;
  votes: number;
  subComments: ThreadComment[];
};

export function ThreadBubble({
  attester,
  thread,
  timestamp,
  isOP,
  votes,
  subComments,
}: Props) {
  return (
    <div>
      <div
        className={`${
          isOP ? "bg-indigo-400" : "bg-gray-900"
        } flex flex-col bg-gray-900 rounded-xl p-2`}
      >
        <div className="flex flex-row items-center justify-between mb-1 gap-4">
          <Link
            href={`/chat/${attester}`}
            className={`${
              isOP ? "text-black" : "text-gray-400"
            } text-xs font-medium`}
          >
            {attester}
          </Link>
          <p
            className={`${
              isOP ? "text-black" : "text-gray-400"
            } text-xs font-medium`}
          >
            {new Date(timestamp * 1000).toLocaleString()}
          </p>
        </div>
        <p className={`text-md`}>{thread}</p>
        <div className="flex items-center justify-center mt-2 gap-8">
          <button className="hover:opacity-80">
            <div className="flex flex-row justify-center items-center gap-1">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <p className="text-[10px]">{subComments.length}</p>
            </div>
          </button>
          <button className="hover:opacity-80">
            <div className="flex flex-row justify-center items-center gap-1">
              <StarIcon className="h-5 w-5 " />
              <p className="text-[10px]">{votes}</p>
            </div>
          </button>
          <button className=" hover:opacity-80">
            <div className="flex flex-row justify-center items-center gap-1">
              <LinkIcon className="h-5 w-5" />
              <p className="text-[10px]">SHARE</p>
            </div>
          </button>
        </div>
      </div>
      {isOP && <hr className="mt-5 opacity-50 rounded-xl" />}

      {subComments && subComments.length > 0 && (
        <div className="w-full flex flex-col items-start pt-5 pl-8">
          {subComments.map((comment, index) => (
            <ThreadBubble
              key={index}
              thread={comment.attestation.threadComment}
              attester={comment.attestation.attester}
              timestamp={comment.attestation.time}
              votes={comment.votes}
              isOP={false}
              subComments={comment.comments} // Pass down the sub-comments
            />
          ))}
        </div>
      )}
    </div>
  );
}
