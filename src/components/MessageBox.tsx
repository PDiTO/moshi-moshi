"use client";

import { useData } from "@/contexts/DataContext";

import { ArrowSmallUpIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

type Props = {
  recipient: string;
};

export function MessageBox({ recipient }: Props) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const { handleSendMessage } = useData();

  const handleSend = async () => {
    setSending(true);
    try {
      await handleSendMessage(message, recipient);
      setMessage("");
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      className="w-full flex flex-row items-center justify-center gap-2"
      onSubmit={handleSend}
    >
      <input
        className="flex-grow bg-black text-white border border-gray-200 rounded-full py-2 px-3 leading-tight focus:outline-none focus:border-indigo-400 disabled:opacity-50"
        id="message-text"
        type="text"
        placeholder="Message..."
        spellCheck={false}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onSubmit={handleSend}
        disabled={sending}
      />
      <button
        type="submit"
        disabled={sending || message.length === 0}
        onClick={handleSend}
        className={`flex justify-center items-center w-10 h-10 text-center rounded-full text-white bg-indigo-400 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed border-box`}
      >
        {!sending ? (
          <ArrowSmallUpIcon />
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
      </button>
    </form>
  );
}
