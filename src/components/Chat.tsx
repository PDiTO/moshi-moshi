"use client";

import { ResolvedPublicMessageAttestation } from "@/types/easTypes";
import { getAttestationsForAddress } from "@/utils/easQueries";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useEffect, useRef, useState } from "react";
import { useAccount, useContractEvent } from "wagmi";
import { MessageBubble } from "./MessageBubble";
import { MessageBox } from "./MessageBox";
import { useEthersProvider } from "@/hooks/useEthersProvider";
import { EASContract } from "@/abis/EAS";

type Props = {
  receipient: string;
};

export function Chat() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [attestations, setAttestations] = useState<
    ResolvedPublicMessageAttestation[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const schemaEncoder = new SchemaEncoder("string publicMessage");
  const provider = useEthersProvider();

  useEffect(() => {
    async function getAtts() {
      setLoading(true);
      if (!address) return;
      const tmpAttestations = await getAttestationsForAddress(address);

      const decodedAtts: ResolvedPublicMessageAttestation[] = [];

      tmpAttestations.forEach((att) => {
        const decoded = schemaEncoder.decodeData(att.data);
        decodedAtts.push({
          ...att,
          publicMessage: decoded[0].value.value.toString(),
          isSender: att.attester === address,
        });
      });

      setAttestations(decodedAtts.sort((a, b) => a.time - b.time));
      setLoading(false);
    }
    getAtts();
  }, [address]);

  const onAttestation = async (uid: string) => {
    const easProvider = new EAS("0xC2679fBD37d54388Ce493F1DB75320D236e1815e");
    easProvider.connect(provider);

    const attestation = await easProvider.getAttestation(uid);
    const decoded = schemaEncoder.decodeData(attestation.data);
    const newAtt: ResolvedPublicMessageAttestation = {
      ...attestation,
      revocationTime: parseInt(attestation.revocationTime.toString()),
      expirationTime: parseInt(attestation.expirationTime.toString()),
      time: parseInt(attestation.time.toString()),
      id: attestation.uid,
      txid: "unknown",
      data: "0x",
      publicMessage: decoded[0].value.value.toString(),
      isSender: attestation.attester === address,
    };
    setAttestations((prevAttestations) => [...prevAttestations, newAtt]);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [attestations]);

  useContractEvent({
    address: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    abi: EASContract.abi,
    eventName: "Attested",
    listener(logs: any) {
      const { recipient, uid } = logs[0].args;
      if (recipient === address) {
        onAttestation(uid);
      }
    },
  });

  return (
    <div className="w-full h-screen max-w-md mx-auto flex flex-col items-center justify-center">
      <h3 className="text-4xl font-medium py-4">Chat with {"0x12...7890"}</h3>
      <div className="w-full h-5/6">
        <div className="flex flex-col gap-2 overflow-y-auto h-5/6 no-scrollbar">
          {attestations.map((att, index) => (
            <MessageBubble
              key={index}
              message={att.publicMessage}
              isSender={att.isSender}
              timestamp={att.time}
            />
          ))}
          <div ref={messagesEndRef} />{" "}
          {/* This will be our point to scroll to */}
        </div>
        <div className="mt-8">
          <MessageBox onAttestation={onAttestation} />
        </div>
      </div>
    </div>
  );
}
