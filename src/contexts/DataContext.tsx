"use client";

import { EASContract } from "@/abis/EAS";
import { chainConfig } from "@/config/chainConfig";
import { schemaConfig } from "@/config/schemaConfig";
import { useEthersProvider } from "@/hooks/useEthersProvider";
import { useEthersSigner } from "@/hooks/useEthersSinger";
import { ResolvedPublicMessageAttestation } from "@/types/easTypes";
import { Conversation } from "@/types/helperTypes";
import { getNFTsForAddress } from "@/utils/covalentQueries";
import { getAttestationsForAddress } from "@/utils/easQueries";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAccount, useContractEvent, useNetwork } from "wagmi";

type DataContextType = {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  handleSendMessage: (message: string, recipient: string) => Promise<void>;
  primeEmptyConversation: (address: string) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [loading, setLoading] = useState(false);
  const [covalentLoading, setCovalentLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const { address } = useAccount();
  const { chain } = useNetwork();

  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const schemaEncoder = new SchemaEncoder("string publicMessage");

  //   Attestations //

  useEffect(() => {
    async function getAtts() {
      if (!address || !chain || loading) return;
      setLoading(true);
      try {
        const tmpAttestations = await getAttestationsForAddress(
          address,
          chainConfig[chain?.id].apiPrefix
        );

        const decodedAtts: ResolvedPublicMessageAttestation[] = [];

        tmpAttestations.forEach((att) => {
          const decoded = schemaEncoder.decodeData(att.data);
          decodedAtts.push({
            ...att,
            publicMessage: decoded[0].value.value.toString(),
            isSender: att.attester === address,
          });
        });

        const conversations = groupAttestationsByConversation(
          decodedAtts,
          address
        );
        setConversations(conversations);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getAtts();
  }, [address, chain]);

  const groupAttestationsByConversation = (
    attestations: ResolvedPublicMessageAttestation[],
    myAddress: string | undefined
  ): Conversation[] => {
    if (!myAddress) return [];

    const conversations: Record<string, Conversation> = {};

    attestations.forEach((attestation) => {
      // If 'myAddress' is either the attester or recipient, determine the other party
      const otherParty =
        attestation.attester === myAddress
          ? attestation.recipient
          : attestation.attester;

      // Create a unique key for the conversation. Sorting ensures that a->b and b->a are treated as the same convo
      const key = [myAddress, otherParty].sort().join("-");

      // Create or update the conversation
      if (!conversations[key]) {
        conversations[key] = {
          address: otherParty,
          attestations: [],
        };
      }
      conversations[key].attestations.push(attestation);
    });

    // Sort attestations within each conversation
    for (const key in conversations) {
      conversations[key].attestations.sort((a, b) => a.time - b.time); // Sort in ascending order of time
    }

    // Convert conversations dictionary into an array and sort by the most recent attestation's time
    const sortedConversations = Object.values(conversations).sort((a, b) => {
      const lastAttestationA = a.attestations[a.attestations.length - 1].time; // As it's sorted in ascending order, the last is the most recent
      const lastAttestationB = b.attestations[b.attestations.length - 1].time;

      return lastAttestationB - lastAttestationA; // For descending order of conversations based on the latest attestation
    });

    return sortedConversations;
  };

  const onAttestation = async (uid: string) => {
    const easProvider = new EAS(chainConfig[chain?.id ?? 10].eas);
    easProvider.connect(provider);

    const attestation = await easProvider.getAttestation(uid);
    const decoded = schemaEncoder.decodeData(attestation.data);
    const newAtt: ResolvedPublicMessageAttestation = {
      attester: attestation.attester,
      recipient: attestation.recipient,
      refUID: attestation.refUID,
      revocationTime: parseInt(attestation.revocationTime.toString()),
      expirationTime: parseInt(attestation.expirationTime.toString()),
      time: parseInt(attestation.time.toString()),
      id: attestation.uid,
      txid: "unknown",
      data: "0x",
      publicMessage: decoded[0].value.value.toString(),
      isSender: attestation.attester === address,
    };

    // Use a functional update for setConversations to always use the latest state
    setConversations((prevConversations) => {
      // Convert current conversations back into a flat list of attestations
      const flatAttestations = prevConversations.flatMap(
        (convo) => convo.attestations
      );

      // Add the new attestation to the list
      flatAttestations.push(newAtt);

      // Regroup the attestations using the unchanged function
      return groupAttestationsByConversation(flatAttestations, address);
    });
  };

  const handleSendMessage = async (message: string, recipient: string) => {
    try {
      if (!signer) return;
      const eas = new EAS(chainConfig[chain?.id ?? 10].eas);
      eas.connect(signer);

      // Initialize SchemaEncoder with the schema string
      const schemaEncoder = new SchemaEncoder("string publicMessage");
      const encodedData = schemaEncoder.encodeData([
        { name: "publicMessage", value: message, type: "string" },
      ]);

      const schemaUID = schemaConfig.publicMessage;

      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: recipient,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();
      await onAttestation(newAttestationUID);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const primeEmptyConversation = (address: string) => {
    const emptyConversation: Conversation = {
      address: address,
      attestations: [],
    };

    setConversations([emptyConversation, ...conversations]);
  };

  useContractEvent({
    address: chainConfig[chain?.id ?? 10].eas,
    abi: EASContract.abi,
    eventName: "Attested",
    listener(logs: any) {
      const { recipient, uid } = logs[0].args;
      if (recipient === address) {
        onAttestation(uid);
      }
    },
  });

  // NFTs
  useEffect(() => {
    async function getNFTs() {
      if (!address || !chain || covalentLoading) return;
      setCovalentLoading(true);
      try {
        getNFTsForAddress(address);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getNFTs();
  }, [address, chain]);

  return (
    <DataContext.Provider
      value={{
        conversations,
        setConversations,
        handleSendMessage,
        primeEmptyConversation,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
