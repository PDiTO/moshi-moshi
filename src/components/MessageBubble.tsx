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
        <p className={`${isSender ? "from-me" : "from-them"} text-md`}>
          {message}
        </p>
      </div>
      <p
        className={`${
          isSender ? "text-right" : "text-left"
        } text-xs text-gray-400 -mt-1`}
      >
        {new Date(timestamp * 1000).toLocaleString()}
      </p>
    </div>
  );
}
