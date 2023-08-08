"use client";

import { useEthersProvider } from "@/hooks/useEthersProvider";
import { useEthersSigner } from "@/hooks/useEthersSinger";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ArrowSmallUpIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useDebounce } from "use-debounce";

type Props = {
  onAttestation: (uid: string) => Promise<void>;
};

export function MessageBox({ onAttestation }: Props) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [debouncedMessage] = useDebounce(message, 500);
  const signer = useEthersSigner();

  const handleSend = async () => {
    console.log(signer);

    setSending(true);

    if (!signer) return;
    const eas = new EAS("0xC2679fBD37d54388Ce493F1DB75320D236e1815e");
    eas.connect(signer);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder("string publicMessage");
    const encodedData = schemaEncoder.encodeData([
      { name: "publicMessage", value: debouncedMessage, type: "string" },
    ]);

    const schemaUID =
      "0x334acfc3d5ad5e5a521f88ff3e6330ef462b473126d1dbfabcbc6f5bbb2cc38f";

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: "0x3df822003C1B974fAB42dB7CB4Da929AFede4613",
        expirationTime: BigInt(0),
        revocable: true,
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();
    await onAttestation(newAttestationUID);
    setMessage("");
    setSending(false);
  };

  return (
    <div className="w-full flex flex-row items-center justify-center gap-2">
      <input
        className="flex-grow bg-black text-white border border-gray-200 rounded-full py-2 px-3 leading-tight focus:outline-none focus:border-indigo-400"
        id="message-text"
        type="text"
        placeholder="Message..."
        spellCheck={false}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
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
    </div>
  );
}
