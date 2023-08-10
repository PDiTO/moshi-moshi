import { formatDate } from "@/utils/uiUtils";
import "./MessageBubble.css";

type Props = {
  message: string;
  timestamp: number;
  isSender: boolean;
};

export function MessageBubble({ message, timestamp, isSender }: Props) {
  return (
    <div className="flex flex-col">
      <div
        className={`imessage flex flex-col ${
          isSender ? "items-end" : "items-start"
        }`}
      >
        <p className={`${isSender ? "from-me" : "from-them"} text-sm`}>
          {message}
        </p>
      </div>
      <p
        className={`${
          isSender ? "text-right" : "text-left"
        } text-xs text-gray-400 -mt-1`}
      >
        {formatDate(timestamp)}
      </p>
    </div>
  );
}
