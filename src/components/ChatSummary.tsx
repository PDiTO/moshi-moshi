import { useData } from "@/contexts/DataContext";
import { Conversation } from "@/types/helperTypes";
import { formatDate } from "@/utils/uiUtils";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
  conversation: Conversation;
};

export function ChatSummary({ conversation }: Props) {
  const { profiles } = useData();

  return (
    <Link href={`/chat/${conversation.address}`}>
      <div className="flex flex-col gap-1 bg-gray-900 p-4 rounded-xl ">
        <div className="flex flex-row justify-start gap-2 items-center">
          {profiles[conversation.address]?.avatarUrl && (
            <img
              src={profiles[conversation.address].avatarUrl}
              className="w-5 h-5 rounded-full object-cover"
            />
          )}
          <h3 className="text-xs font-bold overflow-hidden text-ellipsis whitespace-nowrap">
            {profiles[conversation.address]?.displayName ||
              `${conversation.address.slice(
                0,
                6
              )}...${conversation.address.slice(-4)}`}
          </h3>
        </div>
        <p className="">
          {conversation.attestations.length > 0
            ? conversation.attestations[conversation.attestations.length - 1]
                .publicMessage
            : "Empty conversation."}
        </p>
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-row justify-center items-center gap-1">
            <ChatBubbleLeftIcon className="h-5 w-5 text-indigo-400" />
            <p className="text-xs font-bold text-indigo-400">{`${conversation.attestations.length}`}</p>
          </div>

          <p className="text-xs font-bold text-indigo-400">
            {conversation.attestations.length > 0 &&
              formatDate(
                conversation.attestations[conversation.attestations.length - 1]
                  .time
              )}
          </p>
        </div>
      </div>
    </Link>
  );
}
