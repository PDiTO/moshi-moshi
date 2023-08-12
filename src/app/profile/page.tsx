"use client";

import NavbarSpacer from "@/components/NavbarSpacer";
import { useData } from "@/contexts/DataContext";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function Page() {
  const [busy, setBusy] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const { createProfile } = useData();

  const handleCreateProfile = async () => {
    setBusy(true);
    try {
      await createProfile(displayName, avatarUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setBusy(false);
    }
  };

  const { profiles } = useData();
  const { address } = useAccount();

  useEffect(() => {
    if (!address) return;
    const profile = profiles[address];
    if (profile) {
      setDisplayName(profile.displayName);
      setAvatarUrl(profile.avatarUrl);
    }
  }, [address, profiles]);

  return (
    <div className="flex flex-col h-screen items-center w-full">
      <NavbarSpacer />
      <div className="flex flex-col justify-center items-center w-full max-w-md gap-4">
        <div className="text-center text-4xl font-medium">Your Profile</div>
        <div className="flex flex-col w-full gap-1">
          <p className="text-xs font-bold uppercase">Display Name</p>
          <input
            placeholder="Enter your display name..."
            disabled={busy}
            className="w-full flex-grow text-sm bg-black text-white border border-gray-200 rounded-xl py-2 px-3 leading-tight focus:outline-none focus:border-indigo-400 disabled:opacity-50"
            id="message-text"
            type="text"
            spellCheck={false}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full gap-1">
          <p className="text-xs font-bold uppercase">Avatar Url</p>
          <input
            placeholder="Enter an image url. Square images work best..."
            disabled={busy}
            className="w-full flex-grow text-sm bg-black text-white border border-gray-200 rounded-xl py-2 px-3 leading-tight focus:outline-none focus:border-indigo-400 disabled:opacity-50"
            id="message-text"
            type="text"
            spellCheck={false}
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>
        <button
          disabled={busy}
          className="w-32 h-8 bg-indigo-400 rounded-lg py-1 px-3 hover:opacity-80 disabled:opacity-50 text-xs font-bold"
          onClick={handleCreateProfile}
        >
          {!busy ? (
            "Save Profile"
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
    </div>
  );
}
