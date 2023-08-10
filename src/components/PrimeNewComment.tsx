"use client";

import { useData } from "@/contexts/DataContext";
import { useState } from "react";

type Props = {
  opRefUID: string;
  refUID: string;
  attester: string;
  originalText: string;
  setShowPrimeNewComment: (show: boolean) => void;
};

export default function PrimeNewComment({
  opRefUID,
  refUID,
  attester,
  originalText,
  setShowPrimeNewComment,
}: Props) {
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const { handleCreateComment } = useData();

  const handleClick = async () => {
    setSending(true);
    try {
      await handleCreateComment(opRefUID, refUID, attester, comment);
      setComment("");
      setShowPrimeNewComment(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full flex flex-col pt-4 justify-center items-center gap-3">
      <p className="line-clamp-1 text-sm">
        Responding to
        <span className="ml-1 italic text-gray-400">{originalText}</span>
      </p>
      <textarea
        disabled={sending}
        className="w-full text-sm bg-black text-white border border-gray-200 rounded-xl py-2 px-3 leading-tight focus:outline-none focus:border-indigo-400 disabled:opacity-50"
        id="message-text"
        placeholder="Write your comment..."
        spellCheck={false}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        disabled={sending}
        className="w-32 h-8 bg-indigo-400 rounded-lg py-1 px-3 hover:opacity-80 disabled:opacity-50 text-xs font-bold"
        onClick={handleClick}
      >
        {!sending ? (
          "Submit Comment"
        ) : (
          <div className="flex justify-center items-center gap-2">
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
          </div>
        )}
      </button>
    </div>
  );
}
