"use client";

import { useData } from "@/contexts/DataContext";
import Loading from "./Loading";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import PrimeNewChat from "./PrimeNewChat";
import NavbarSpacer from "./NavbarSpacer";
import { ThreadSummary } from "./ThreadSummary";
import PrimeNewThread from "./PrimeNewThread";
import { ThreadsToLoad } from "@/types/helperTypes";

export function Threads() {
  const { threads, loadingThreads, threadsToLoad, setThreadsToLoad } =
    useData();
  const [showPrimeNewThread, setShowPrimeNewThread] = useState(false);

  return (
    <div className="flex flex-col h-screen items-center  overflow-hidden">
      <NavbarSpacer />
      <div className="flex w-full max-w-sm justify-between items-start">
        <div className="w-20 display-hidden text-black">. </div>
        <div className="text-center text-4xl font-medium">Threads</div>
        <div className="text-right w-20">
          <button
            onClick={() => {
              setShowPrimeNewThread(!showPrimeNewThread);
            }}
          >
            <PlusIcon
              className={`w-10 h-10 text-indigo-400 hover:opacity-80 transition-all ${
                showPrimeNewThread ? "rotate-45" : "rotate-0"
              }`}
            />
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center">
        <button
          disabled={loadingThreads}
          className={`${
            threadsToLoad === ThreadsToLoad.RECENT
              ? "font-bold text-white bg-indigo-400"
              : "font-medium text-indigo-400"
          }  border-indigo-400 border-2 flex justify-center items-center m-1 px-3 py-1 rounded-full  text-xs w-32 disabled:opacity-50`}
          onClick={() => setThreadsToLoad(ThreadsToLoad.RECENT)}
        >
          Recent Threads
        </button>
        <button
          disabled={loadingThreads}
          className={`${
            threadsToLoad === ThreadsToLoad.POPULAR
              ? "font-bold text-white bg-indigo-400"
              : "font-medium text-indigo-400"
          }  border-indigo-400 border-2 flex justify-center items-center m-1 px-3 py-1 rounded-full  text-xs w-32 disabled:opacity-50`}
          onClick={() => setThreadsToLoad(ThreadsToLoad.POPULAR)}
        >
          Popular Threads
        </button>
        <button
          disabled={loadingThreads}
          className={`${
            threadsToLoad === ThreadsToLoad.MINE
              ? "font-bold text-white bg-indigo-400"
              : "font-medium text-indigo-400"
          }  border-indigo-400 border-2 flex justify-center items-center m-1 px-3 py-1 rounded-full  text-xs w-32 disabled:opacity-50`}
          onClick={() => setThreadsToLoad(ThreadsToLoad.MINE)}
        >
          My Threads
        </button>
      </div>

      <div
        className={`w-full max-w-sm mx-auto ${
          showPrimeNewThread
            ? "scale-100 opacity-100 h-[200px]"
            : "scale-0 opacity-0 h-0"
        } transition-all`}
      >
        <PrimeNewThread setShowPrimeNewThread={setShowPrimeNewThread} />
      </div>

      <div
        className={`w-full max-w-sm mx-auto flex flex-col gap-4 overflow-y-auto mt-4 transition-all ${
          showPrimeNewThread ? "opacity-0 pointer-events-none" : ""
        }`}
      >
        {loadingThreads ? (
          <Loading />
        ) : (
          threads.map((thread, index) => (
            <ThreadSummary thread={thread} key={index} />
          ))
        )}
      </div>
      <NavbarSpacer />
    </div>
  );
}
