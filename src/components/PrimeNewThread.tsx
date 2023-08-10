"use client";

import { useData } from "@/contexts/DataContext";
import { useState } from "react";

type Props = {
  setShowPrimeNewThread: (show: boolean) => void;
};

export default function PrimeNewThread({ setShowPrimeNewThread }: Props) {
  const [title, setTitle] = useState("");
  const [thread, setThread] = useState("");
  const [sending, setSending] = useState(false);

  const { handleCreateThread } = useData();

  const handleClick = async () => {
    setSending(true);
    try {
      await handleCreateThread(title, thread);
      setTitle("");
      setThread("");
      setShowPrimeNewThread(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full flex flex-col py-10 justify-center items-center gap-3">
      <input
        disabled={sending}
        className="w-full flex-grow text-sm bg-black text-white border border-gray-200 rounded-xl py-2 px-3 leading-tight focus:outline-none focus:border-indigo-400 disabled:opacity-50"
        id="message-text"
        type="text"
        placeholder="Enter title..."
        spellCheck={false}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        disabled={sending}
        className="w-full h-96 text-sm bg-black text-white border border-gray-200 rounded-xl py-2 px-3 leading-tight focus:outline-none focus:border-indigo-400 disabled:opacity-50"
        id="message-text"
        placeholder="What do you want to say..."
        spellCheck={false}
        value={thread}
        onChange={(e) => setThread(e.target.value)}
      />
      <button
        disabled={sending}
        className="w-32 h-8 bg-indigo-400 rounded-lg py-1 px-3 hover:opacity-80 disabled:opacity-50 text-xs font-bold"
        onClick={handleClick}
      >
        {!sending ? (
          "Start Conversation"
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
