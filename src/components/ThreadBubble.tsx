import { useData } from "@/contexts/DataContext";
import { ThreadComment } from "@/types/helperTypes";
import { formatDate } from "@/utils/uiUtils";
import {
  ChatBubbleLeftRightIcon,
  LinkIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import PrimeNewComment from "./PrimeNewComment";
import { chainConfig, defaultChainConfig } from "@/config/chainConfig";

type Props = {
  opUid: string;
  opAddress: string;
  uid: string;
  attester: string;
  thread: string;
  timestamp: number;
  isUser: boolean;
  votes: number;
  liked?: boolean;
  subComments: ThreadComment[];
};

export function ThreadBubble({
  opUid,
  opAddress,
  uid,
  attester,
  thread,
  timestamp,
  isUser,
  votes,
  liked,
  subComments,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [showPrimeNewComment, setShowPrimeNewComment] = useState(false);
  const { upVoteAttestation, profiles } = useData();

  const { chain } = useNetwork();
  const { address } = useAccount();
  const router = useRouter();
  const config = chainConfig[chain?.id ?? 0] ?? defaultChainConfig;

  const handleUpvote = async () => {
    setBusy(true);
    try {
      await upVoteAttestation(uid);
    } catch (error) {
      console.log(error);
    } finally {
      setBusy(false);
    }
  };

  const handleClick = async () => {
    router.push(`/profile/${attester}`);
  };

  const easScan = config.easScan || undefined;

  return (
    <div className=" w-full">
      <div
        className={`${isUser ? "bg-indigo-400" : "bg-gray-900"}
        } flex flex-col bg-gray-900 rounded-xl p-2 w-full justify-start items-start mt-5`}
      >
        <div className="flex flex-row mb-1 justify-between items-center w-full">
          <div className="flex flex-row items-center gap-1">
            {profiles[attester]?.avatarUrl && (
              <img
                src={profiles[attester].avatarUrl}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <button
              onClick={handleClick}
              className={`${
                isUser ? "text-black" : "text-gray-400"
              } text-xs font-medium`}
            >
              {profiles[attester]?.displayName ||
                `${attester.slice(0, 6)}...${attester.slice(-4)}`}
            </button>
            {opAddress === attester && (
              <p className="text-xs rounded-xl bg-indigo-700 px-2">OP</p>
            )}
          </div>
          <p
            className={`${
              isUser ? "text-black" : "text-gray-400"
            } text-xs font-medium`}
          >
            {formatDate(timestamp)}
          </p>
        </div>
        <p className={`text-sm`}>{thread}</p>
        <div className="flex flex-row w-full items-center justify-center mt-2 gap-8">
          <button
            onClick={() => setShowPrimeNewComment(!showPrimeNewComment)}
            className="hover:opacity-80 disabled:opacity-50"
            disabled={busy}
          >
            <div className="flex flex-row justify-center items-center gap-1">
              {showPrimeNewComment ? (
                <span className="relative flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex opacity-75 ">
                    <ChatBubbleLeftRightIconSolid className="h-5 w-5" />
                  </span>
                  <span className="relative inline-flex ">
                    <ChatBubbleLeftRightIconSolid className="h-5 w-5" />
                  </span>
                </span>
              ) : (
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
              )}

              <p className="text-[10px]">{subComments.length}</p>
            </div>
          </button>

          <button
            className="hover:opacity-80 disabled:opacity-50"
            disabled={busy}
            onClick={handleUpvote}
          >
            <div className="flex flex-row justify-center items-center gap-1">
              {!busy ? (
                liked ? (
                  <StarIconSolid className="h-5 w-5 " />
                ) : (
                  <StarIcon className="h-5 w-5 " />
                )
              ) : (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l1-2.647z"
                  ></path>
                </svg>
              )}
              <p className="text-[10px]">{votes}</p>
            </div>
          </button>
          {easScan && (
            <a
              href={`${easScan}/attestation/view/${uid}`}
              target="_blank"
              className=" hover:opacity-80 disabled:opacity-50"
            >
              <div className="flex flex-row justify-center items-center gap-1">
                <LinkIcon className="h-5 w-5" />
                <p className="text-[10px]">SHARE</p>
              </div>
            </a>
          )}
        </div>
      </div>

      {showPrimeNewComment && (
        <PrimeNewComment
          opRefUID={opUid}
          refUID={uid}
          attester={attester}
          originalText={thread}
          setShowPrimeNewComment={setShowPrimeNewComment}
        />
      )}

      {subComments && subComments.length > 0 && (
        <div className="w-full flex flex-col items-start pl-4">
          {subComments.map((comment, index) => (
            <ThreadBubble
              key={index}
              opUid={comment.attestation.refUID}
              opAddress={opAddress}
              uid={comment.attestation.id}
              thread={comment.attestation.threadComment}
              attester={comment.attestation.attester}
              timestamp={comment.attestation.time}
              votes={comment.votes}
              isUser={comment.attestation.attester === address}
              liked={comment.liked}
              subComments={comment.comments} // Pass down the sub-comments
            />
          ))}
        </div>
      )}
    </div>
  );
}
