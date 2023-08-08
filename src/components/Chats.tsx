"use client";

import { ResolvedPublicMessageAttestation } from "@/types/easTypes";
import { getAttestationsForAddress } from "@/utils/easQueries";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { MessageBubble } from "./MessageBubble";
import { group } from "console";

export function Chats() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [attestations, setAttestations] = useState<
    ResolvedPublicMessageAttestation[]
  >([]);

  const schemaEncoder = new SchemaEncoder("string publicMessage");

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

      setAttestations(decodedAtts);
      setLoading(false);
    }
    getAtts();
  }, [address]);

  const groupAttestationsByConversation = (
    attestations: ResolvedPublicMessageAttestation[],
    myAddress: string | undefined
  ): ResolvedPublicMessageAttestation[][] => {
    if (!myAddress) return [];

    const conversations: Record<string, ResolvedPublicMessageAttestation[]> =
      {};

    attestations.forEach((attestation) => {
      // If 'myAddress' is either the attester or recipient, determine the other party
      const otherParty =
        attestation.attester === myAddress
          ? attestation.recipient
          : attestation.attester;

      // Create a unique key for the conversation. Sorting ensures that a->b and b->a are treated as the same convo
      const key = [myAddress, otherParty].sort().join("-");

      // Push the attestation into the respective conversation
      if (!conversations[key]) {
        conversations[key] = [];
      }
      conversations[key].push(attestation);
    });

    // Convert conversations dictionary into an array and sort by the most recent attestation's time
    const sortedConversations = Object.values(conversations).sort((a, b) => {
      const lastAttestationA = a[a.length - 1].time;
      const lastAttestationB = b[b.length - 1].time;

      return lastAttestationB - lastAttestationA; // For descending order
    });

    return sortedConversations;
  };

  console.log(groupAttestationsByConversation(attestations, address));

  return (
    <div className="flex min-h-screen flex-col items-center mt-40">
      <h3 className="text-4xl font-medium pb-4">Chats</h3>
      <div className="w-full max-w-sm mx-auto flex flex-col gap-2">
        {attestations.map((att, index) => (
          <MessageBubble
            key={index}
            message={att.publicMessage}
            isSender={att.isSender}
            timestamp={att.time}
          />
        ))}
      </div>
    </div>
  );
}
