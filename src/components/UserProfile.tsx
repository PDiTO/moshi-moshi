"use client";

import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { MessageBox } from "./MessageBox";

import { useData } from "@/contexts/DataContext";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import Loading from "./Loading";
import NavbarSpacer from "./NavbarSpacer";
import { useRouter } from "next/navigation";
import { getTokensForAddress } from "@/utils/covalentQueries";
import { CovalentTokenData } from "@/types/covalentTypes";

type Props = {
  user: string;
};

export function UserProfile({ user }: Props) {
  const [loadingCovalent, setLoadingCovalent] = useState(false);
  const [tokenData, setTokenData] = useState<CovalentTokenData | undefined>(
    undefined
  );
  const { conversations, profiles, primeEmptyConversation } = useData();
  const router = useRouter();

  const profile = profiles[user];

  const handleClick = async () => {
    const thisChat = conversations.find((convo) => convo.address == user);
    if (!thisChat) {
      primeEmptyConversation(user);
    }
    router.push(`/chat/${user}`);
  };

  useEffect(() => {
    async function getTokens() {
      console.log("Getting tokens...");
      setLoadingCovalent(true);
      try {
        const data = await getTokensForAddress(user);
        const filteredAndSortedItems = data.items
          // Filter out items with 0 balance
          .filter((item) => BigInt(item.balance) > 0)
          // Sort items by balance, from largest to smallest
          .sort((a, b) => {
            const balanceA = BigInt(a.balance);
            const balanceB = BigInt(b.balance);
            if (balanceA > balanceB) {
              return -1; // if a should come before b
            }
            if (balanceA < balanceB) {
              return 1; // if a should come after b
            }
            return 0; // no sorting (a equals b)
          });
        setTokenData({ ...data, items: filteredAndSortedItems });
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingCovalent(false);
      }
    }
    getTokens();
  }, [user]);

  if (!user) return <Loading />;

  return (
    <div className="w-full h-screen max-w-md mx-auto flex flex-col items-center ">
      <NavbarSpacer />
      <div className="flex flex-row gap-2 items-center w-full hover:opacity-80">
        <button onClick={() => router.back()}>
          <div className="flex flex-row justify-start items-center">
            <ChevronLeftIcon className="w-10 h-10 text-indigo-400" />
            <p className=" text-indigo-400 ">Back</p>
          </div>
        </button>
      </div>
      {!profile ? (
        <div className="w-full flex flex-col justify-center items-center mt-8">
          <p>There is no profile set for</p>
          <h3 className="text-center text-sm font-bold">{user}</h3>
          <p className="mt-8 pb-1">
            You can still start a conversation with them
          </p>
          <button
            className="w-34 h-8 bg-indigo-400 rounded-lg py-1 px-3 hover:opacity-80 disabled:opacity-50 text-xs font-bold"
            onClick={handleClick}
          >
            Start Talking
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center mt-8 gap-2">
          <img
            src={profile.avatarUrl}
            alt={"profile avatar"}
            className="w-48 h-48 object-cover rounded-full"
          />
          <h3 className="text-3xl font-bold">{profile.displayName}</h3>
          <button
            className="w-34 h-8 bg-indigo-400 rounded-lg py-1 px-3 hover:opacity-80 disabled:opacity-50 text-xs font-bold"
            onClick={handleClick}
          >
            Start Talking
          </button>

          {loadingCovalent && <Loading />}

          {tokenData && tokenData.items.length > 0 && (
            <div className="flex flex-col justify-center items-center mt-10">
              <h3 className="font-bold mb-2">
                Some of {profile.displayName}&apos;s holdings
              </h3>
              <div className="grid grid-cols-4 gap-x-16 gap-y-4">
                {tokenData.items.map((token, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1 justify-center items-center"
                  >
                    <img
                      src={token.logo_url}
                      className="w-10 h-10 rounded-full object-fit"
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>
                      ) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src =
                          "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dollar_sign_in_circle_cleaned_%28PD_version%29.svg";
                        target.style.backgroundColor = "#7f9cf5";
                      }}
                    />
                    <p className="font-bold text-xs">
                      {token.contract_ticker_symbol}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <NavbarSpacer />
    </div>
  );
}
