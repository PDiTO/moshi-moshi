import { Conversation } from "@/types/helperTypes";
import Link from "next/link";

type Props = {
  conversation: Conversation;
};

export function ChatSummary({ conversation }: Props) {
  return (
    <Link href={`/chat/${conversation.address}`}>
      <div className="flex flex-col gap-1 bg-gray-900 p-4 rounded-xl ">
        <h3 className="text-md font-bold overflow-hidden text-ellipsis whitespace-nowrap">
          {conversation.address}
        </h3>
        <p className="">
          {conversation.attestations.length > 0
            ? conversation.attestations[conversation.attestations.length - 1]
                .publicMessage
            : "Empty conversation."}
        </p>
        <div className="flex flex-row justify-between gap-2">
          <p className="text-xs font-bold text-indigo-400">{`Messages: ${conversation.attestations.length}`}</p>

          <p className="text-xs font-bold text-indigo-400">
            {conversation.attestations.length > 0 &&
              new Date(
                conversation.attestations[conversation.attestations.length - 1]
                  .time * 1000
              ).toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
