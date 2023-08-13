"use client";

import { useData } from "@/contexts/DataContext";
import { get } from "http";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { normalize } from "viem/ens";
import { usePublicClient } from "wagmi";

export default function PrimeNewChat() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const { primeEmptyConversation, conversations } = useData();
  const [busy, setBusy] = useState(false);

  const publicClient = usePublicClient({ chainId: 1 });

  const getEns = async (): Promise<string | undefined> => {
    try {
      const ensAddress = await publicClient.getEnsAddress({
        name: normalize(address),
      });

      return ensAddress || undefined;
    } catch (error) {
      console.error("Failed to get ENS address:", error);
      return undefined;
    }
  };

  const handleClick = async () => {
    setBusy(true);
    try {
      const convertedAddress = address.endsWith(".eth")
        ? await getEns()
        : address;

      if (convertedAddress === undefined) return;

      const thisChat = conversations.find(
        (convo) => convo.address == convertedAddress
      );
      if (!thisChat) {
        await primeEmptyConversation(convertedAddress);
      }
      router.push(`/chat/${convertedAddress}`);
    } catch (error) {
      console.log(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full flex flex-col py-10 justify-center items-center gap-3">
      <input
        disabled={busy}
        className="w-full flex-grow text-sm bg-black text-white border border-gray-200 rounded-full py-2 px-3 leading-tight focus:outline-none focus:border-indigo-400 disabled:opacity-50"
        id="message-text"
        type="text"
        placeholder="Enter address or ENS..."
        spellCheck={false}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button
        disabled={busy}
        className="w-34 h-8 bg-indigo-400 rounded-lg py-1 px-3 hover:opacity-80 disabled:opacity-50 text-xs font-bold"
        onClick={handleClick}
      >
        {!busy ? (
          "Start Talking"
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
