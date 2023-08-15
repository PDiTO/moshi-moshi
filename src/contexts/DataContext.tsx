"use client";

import { EASContract } from "@/abis/EAS";
import { chainConfig, defaultChainConfig } from "@/config/chainConfig";
import { schemaConfig } from "@/config/schemaConfig";
import { useEthersProvider } from "@/hooks/useEthersProvider";
import { useEthersSigner } from "@/hooks/useEthersSinger";
import {
  ResolvedProfileAttestation,
  ResolvedPublicMessageAttestation,
  ResolvedThreadAttestation,
  ResolvedThreadCommentAttestation,
  ResolvedUpVoteAttestation,
} from "@/types/easTypes";
import {
  Conversation,
  Thread,
  ThreadComment,
  ThreadsToLoad,
} from "@/types/helperTypes";
import { getNFTsForAddress } from "@/utils/covalentQueries";
import {
  getENSNames,
  getPopularThreads,
  getProfilesForAddresses,
  getPublicMessageAttestationsForAddress,
  getRecentThreads,
  getThreadAttestationsForAddress,
  getThreadCommentAttestationsForUids,
  getUpVoteAttestationsForUids,
} from "@/utils/easQueries";
import {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";
import { use } from "chai";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { normalize } from "viem/ens";
import {
  useAccount,
  useContractEvent,
  useNetwork,
  usePublicClient,
} from "wagmi";

type DataContextType = {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  loadingConversations?: boolean;
  handleSendMessage: (message: string, recipient: string) => Promise<void>;
  primeEmptyConversation: (address: string) => void;
  threads: Thread[];
  loadingThreads?: boolean;
  threadsToLoad: ThreadsToLoad;
  setThreadsToLoad: React.Dispatch<React.SetStateAction<ThreadsToLoad>>;
  handleCreateThread: (title: string, thread: string) => Promise<void>;
  handleCreateComment: (
    opRefUID: string,
    refUID: string,
    attester: string,
    comment: string
  ) => Promise<void>;
  upVoteAttestation: (refUID: string) => Promise<void>;
  profiles: {
    [address: string]: ResolvedProfileAttestation;
  };
  createProfile: (displayName: string, avatarUrl: string) => Promise<void>;
  createSchema: (
    schemaName: string,
    schema: string,
    revocable?: boolean
  ) => Promise<void>;
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
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();

  const provider = useEthersProvider();
  const signer = useEthersSigner();

  // General
  const config = chainConfig[chain?.id ?? 0] ?? defaultChainConfig;

  // Reset path when disconnecting
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected]);

  //   Public Message //

  const publicMessageSchemaEncoder = new SchemaEncoder("string publicMessage");

  useEffect(() => {
    async function getAtts() {
      if (!address || !chain || loadingConversations) return;
      setLoadingConversations(true);
      try {
        const tmpAttestations = await getPublicMessageAttestationsForAddress(
          address,
          chainConfig[chain?.id].api
        );

        const decodedAtts: ResolvedPublicMessageAttestation[] = [];

        tmpAttestations.forEach((att) => {
          const decoded = publicMessageSchemaEncoder.decodeData(att.data);
          decodedAtts.push({
            ...att,
            publicMessage: decoded[0].value.value.toString(),
            isSender: att.attester === address,
          });
        });

        const addresses = tmpAttestations.map((att) => att.attester);
        await getProfiles([...new Set(addresses)]);

        const conversations = groupAttestationsByConversation(
          decodedAtts,
          address
        );
        setConversations(conversations);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingConversations(false);
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
    const easProvider = new EAS(config.eas);
    easProvider.connect(provider);

    const attestation = await easProvider.getAttestation(uid);
    const decoded = publicMessageSchemaEncoder.decodeData(attestation.data);
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

    getProfiles([attestation.attester]);
  };

  const handleSendMessage = async (message: string, recipient: string) => {
    try {
      if (!signer) return;
      const eas = new EAS(config.eas);
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

  const primeEmptyConversation = async (address: string) => {
    const emptyConversation: Conversation = {
      address: address,
      attestations: [],
    };
    await getProfiles([address]);

    setConversations([emptyConversation, ...conversations]);
  };

  useContractEvent({
    address: config.eas,
    abi: EASContract.abi,
    eventName: "Attested",
    listener(logs: any) {
      const { recipient, uid } = logs[0].args;
      if (recipient === address) {
        onAttestation(uid);
      }
    },
  });

  // Threads
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadsToLoad, setThreadsToLoad] = useState<ThreadsToLoad>(
    ThreadsToLoad.RECENT
  );

  const threadSchemaEncoder = new SchemaEncoder("string title, string thread");
  const threadCommentSchemaEncoder = new SchemaEncoder(
    "string detailedRefUID, string threadComment"
  );
  const upVoteSchemaEncoder = new SchemaEncoder("bool upVote");

  function organizeByDetailedRefUID(
    attestations: ResolvedThreadCommentAttestation[]
  ): Record<string, ResolvedThreadCommentAttestation[]> {
    const organized: Record<string, ResolvedThreadCommentAttestation[]> = {};

    for (const attestation of attestations) {
      if (!organized[attestation.detailedRefUID]) {
        organized[attestation.detailedRefUID] = [];
      }
      organized[attestation.detailedRefUID].push(attestation);
    }

    return organized;
  }

  function getSubComments(
    refUID: string,
    organized: Record<string, ResolvedThreadCommentAttestation[]>,
    votesArray: ResolvedUpVoteAttestation[]
  ): ThreadComment[] {
    const result = (organized[refUID] || [])
      .filter((c) => c.detailedRefUID === refUID)
      .map((c) => {
        const subComments = getSubComments(c.id, organized, votesArray);
        return {
          attestation: c,
          comments: subComments,
          votes: votesArray.filter((vote) => vote.refUID === c.id).length,
          liked:
            votesArray.filter(
              (vote) => vote.refUID === c.id && vote.attester === address
            ).length > 0,
        };
      });

    return result;
  }

  const getDesiredThreads = async () => {
    if (!address || !chain || loadingThreads) return;

    try {
      if (threadsToLoad === ThreadsToLoad.RECENT) {
        const tmpAttestations = await getRecentThreads(
          chainConfig[chain?.id].api
        );

        return tmpAttestations;
      } else if (threadsToLoad === ThreadsToLoad.MINE) {
        const tmpAttestations = await getThreadAttestationsForAddress(
          address,
          chainConfig[chain?.id].api
        );
        return tmpAttestations;
      } else if (threadsToLoad === ThreadsToLoad.POPULAR) {
        // const voteAttestations = await getPopularThreads(
        //   chainConfig[chain?.id].api
        // );

        // const refUIDs: string[] = voteAttestations.map((att) => att.refUID);

        // const countObject: { [key: string]: number } = refUIDs.reduce<{
        //   [key: string]: number;
        // }>((acc, curr) => {
        //   acc[curr] = (acc[curr] || 0) + 1;
        //   return acc;
        // }, {});

        // const sortedEntries = Object.entries(countObject)
        //   .sort(([, countA], [, countB]) => countB - countA)
        //   .slice(0, 5);

        // const top5Counts: { [key: string]: number } =
        //   Object.fromEntries(sortedEntries);

        // console.log(top5Counts);
        const tmpAttestations = await getRecentThreads(
          chainConfig[chain?.id].api
        );

        return tmpAttestations;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    async function getThreads() {
      if (!address || !chain || loadingThreads) return;
      setLoadingThreads(true);
      try {
        // const tmpAttestations = await getThreadAttestationsForAddress(
        //   address,
        //   chainConfig[chain?.id].api
        // );

        const tmpAttestations = (await getDesiredThreads()) ?? [];

        const uids = tmpAttestations.map((att) => att.id);

        const tmpComments = await getThreadCommentAttestationsForUids(
          uids,
          chainConfig[chain?.id].api
        );

        const commentUids = tmpComments.map((att) => att.id);
        const tmpVotes = await getUpVoteAttestationsForUids(
          [...uids, ...commentUids],
          chainConfig[chain?.id].api
        );

        const comments: ResolvedThreadCommentAttestation[] = tmpComments.map(
          (att) => {
            const decoded = threadCommentSchemaEncoder.decodeData(att.data);
            return {
              ...att,
              detailedRefUID: decoded[0].value.value.toString(),
              threadComment: decoded[1].value.value.toString(),
            };
          }
        );

        const threadAddresses = tmpAttestations.map((att) => att.attester);
        const commentAddresses = comments.map((att) => att.attester);
        const allAddresses = [...threadAddresses, ...commentAddresses];

        await getProfiles([...new Set(allAddresses)]);

        const organizedComments = organizeByDetailedRefUID(comments);

        const votes: ResolvedUpVoteAttestation[] = tmpVotes
          .map((att) => {
            const decoded = upVoteSchemaEncoder.decodeData(att.data);
            return {
              ...att,
              upVote: decoded[0].value.value as boolean,
            };
          })
          .filter(
            (vote, index, self) =>
              vote.upVote !== false &&
              !self.some(
                (v, idx) =>
                  v.attester === vote.attester &&
                  v.refUID === vote.refUID &&
                  idx < index
              )
          );

        const tempThreads: Thread[] = [];

        tmpAttestations.forEach((att) => {
          const decoded = threadSchemaEncoder.decodeData(att.data);
          const convertedThread = {
            ...att,
            title: decoded[0].value.value.toString(),
            thread: decoded[1].value.value.toString(),
          };

          const threadComments: ThreadComment[] = (
            organizedComments[att.id] || []
          )
            .filter((c) => c.refUID === att.id)
            .map((c) => ({
              attestation: c,
              comments: getSubComments(c.id, organizedComments, votes),
              votes: votes.filter((vote) => vote.refUID === c.id).length,
              liked:
                votes.filter(
                  (vote) => vote.refUID === c.id && vote.attester === address
                ).length > 0,
            }));

          tempThreads.push({
            attestation: convertedThread,
            comments: threadComments,
            votes: votes.filter((vote) => vote.refUID === convertedThread.id)
              .length,
            liked:
              votes.filter(
                (vote) =>
                  vote.refUID === convertedThread.id &&
                  vote.attester === address
              ).length > 0,
          });
        });

        const sortedThreads = sortThreads(tempThreads);
        setThreads(sortedThreads);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingThreads(false);
      }
    }
    getThreads();
  }, [address, chain, threadsToLoad]);

  const handleCreateThread = async (title: string, thread: string) => {
    try {
      if (!signer) return;
      const eas = new EAS(config.eas);
      eas.connect(signer);

      // Initialize SchemaEncoder with the schema string
      const encodedData = threadSchemaEncoder.encodeData([
        { name: "title", value: title, type: "string" },
        { name: "thread", value: thread, type: "string" },
      ]);

      const schemaUID = schemaConfig.thread;

      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: "0x0000000000000000000000000000000000000000",
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();

      const easProvider = new EAS(config.eas);
      easProvider.connect(provider);

      const attestation = await easProvider.getAttestation(newAttestationUID);
      const decoded = threadSchemaEncoder.decodeData(attestation.data);
      const newAtt: ResolvedThreadAttestation = {
        attester: attestation.attester,
        recipient: attestation.recipient,
        refUID: attestation.refUID,
        revocationTime: parseInt(attestation.revocationTime.toString()),
        expirationTime: parseInt(attestation.expirationTime.toString()),
        time: parseInt(attestation.time.toString()),
        id: attestation.uid,
        txid: "unknown",
        data: "0x",
        title: decoded[0].value.value.toString(),
        thread: decoded[1].value.value.toString(),
      };
      const newThread: Thread = {
        attestation: newAtt,
        comments: [],
        votes: 0,
      };

      setThreads((prevThreads) => {
        return [newThread, ...prevThreads];
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Utility function to recursively find the correct spot and add the comment
  function addNewComment(
    comments: ThreadComment[],
    refUID: string,
    newComment: ThreadComment
  ): ThreadComment[] {
    return comments.map((comment) => {
      if (comment.attestation.id === refUID) {
        // Found the matching comment, append the new comment
        return { ...comment, comments: [...comment.comments, newComment] };
      } else if (comment.comments.length) {
        // Didn't find the comment, but it has sub-comments. Recurse.
        return {
          ...comment,
          comments: addNewComment(comment.comments, refUID, newComment),
        };
      }
      return comment; // Comment doesn't match and doesn't have sub-comments, return unchanged
    });
  }

  function insertCommentToThread(
    threads: Thread[],
    threadRefUID: string,
    refUID: string,
    newComment: ThreadComment
  ): Thread[] {
    return threads.map((thread) => {
      if (thread.attestation.id === threadRefUID) {
        if (thread.attestation.id === refUID) {
          // The new comment directly relates to this thread
          return { ...thread, comments: [...thread.comments, newComment] };
        } else {
          // The new comment relates to an existing comment or sub-comment in this thread
          return {
            ...thread,
            comments: addNewComment(thread.comments, refUID, newComment),
          };
        }
      }
      return thread; // This isn't the matching thread, return unchanged
    });
  }

  const handleCreateComment = async (
    opRefUID: string,
    refUID: string,
    attester: string,
    comment: string
  ) => {
    try {
      if (!signer) return;
      const eas = new EAS(config.eas);
      eas.connect(signer);

      // Initialize SchemaEncoder with the schema string
      const encodedData = threadCommentSchemaEncoder.encodeData([
        { name: "detailedRefUID", value: refUID, type: "string" },
        { name: "threadComment", value: comment, type: "string" },
      ]);

      const schemaUID = schemaConfig.threadComment;

      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: attester,
          expirationTime: BigInt(0),
          revocable: true,
          refUID: opRefUID,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();

      const easProvider = new EAS(config.eas);
      easProvider.connect(provider);

      const attestation = await easProvider.getAttestation(newAttestationUID);
      const decoded = threadSchemaEncoder.decodeData(attestation.data);
      const newAtt: ResolvedThreadCommentAttestation = {
        attester: attestation.attester,
        recipient: attestation.recipient,
        refUID: attestation.refUID,
        revocationTime: parseInt(attestation.revocationTime.toString()),
        expirationTime: parseInt(attestation.expirationTime.toString()),
        time: parseInt(attestation.time.toString()),
        id: attestation.uid,
        txid: "unknown",
        data: "0x",
        detailedRefUID: decoded[0].value.value.toString(),
        threadComment: decoded[1].value.value.toString(),
      };
      const newComment: ThreadComment = {
        attestation: newAtt,
        comments: [],
        votes: 0,
      };

      const updatedThreads = insertCommentToThread(
        threads,
        opRefUID,
        refUID,
        newComment
      );
      const sortedThreads = sortThreads(updatedThreads);
      setThreads(sortedThreads);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Utility function to recursively find and update the correct comment
  function updateVoteCount(
    comments: ThreadComment[],
    uid: string
  ): ThreadComment[] {
    return comments.map((comment) => {
      if (comment.attestation.id === uid) {
        // Found the comment, update its votes
        return { ...comment, votes: comment.votes + 1, liked: true };
      } else if (comment.comments.length) {
        // Didn't find the comment, but it has sub-comments. Recurse.
        return { ...comment, comments: updateVoteCount(comment.comments, uid) };
      }
      return comment; // Comment doesn't match and doesn't have sub-comments, return unchanged
    });
  }

  function incrementVoteByUID(threads: Thread[], uid: string): Thread[] {
    return threads.map((thread) => {
      if (thread.attestation.id === uid) {
        // Found the thread, update its votes
        return { ...thread, votes: thread.votes + 1, liked: true };
      } else if (thread.comments.length) {
        // Didn't find the thread, but there might be a matching comment or sub-comment. Recurse.
        return { ...thread, comments: updateVoteCount(thread.comments, uid) };
      }
      return thread; // Thread doesn't match and doesn't have matching comments, return unchanged
    });
  }

  const upVoteAttestation = async (refUID: string) => {
    try {
      if (!signer) return;
      const eas = new EAS(config.eas);
      eas.connect(signer);

      // Initialize SchemaEncoder with the schema string
      const encodedData = upVoteSchemaEncoder.encodeData([
        { name: "upVote", value: true, type: "bool" },
      ]);

      const schemaUID = schemaConfig.upVote;

      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: "0x0000000000000000000000000000000000000000",
          expirationTime: BigInt(0),
          revocable: true,
          refUID: refUID,
          data: encodedData,
        },
      });

      await tx.wait();
      const updatedThreads = incrementVoteByUID(threads, refUID);
      const sortedThreads = sortThreads(updatedThreads);
      setThreads(sortedThreads);
    } catch (error) {
    } finally {
    }
  };

  function sortCommentsByVotes(comments: ThreadComment[]): ThreadComment[] {
    return comments
      .map((comment) => ({
        ...comment,
        comments: sortCommentsByVotes(comment.comments),
      }))
      .sort((a, b) => b.votes - a.votes);
  }

  function sortThreadsByVotes(threads: Thread[]): Thread[] {
    return threads
      .map((thread) => ({
        ...thread,
        comments: sortCommentsByVotes(thread.comments),
      }))
      .sort((a, b) => b.votes - a.votes);
  }

  const sortThreads = (threads: Thread[]): Thread[] => {
    return sortThreadsByVotes(threads);
  };

  // PROFILE
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [profiles, setProfiles] = useState<{
    [address: string]: ResolvedProfileAttestation;
  }>({});

  const profileSchemaEncoder = new SchemaEncoder(
    "string displayName, string avatarUrl"
  );

  const getProfiles = async (addresses: string[]) => {
    if (!chain || !address) return;
    setLoadingProfiles(true);

    try {
      const newProfiles = await getProfilesForAddresses(
        [...addresses, address],
        chainConfig[chain?.id].api
      );

      const decodedAtts: ResolvedProfileAttestation[] = [];

      newProfiles.forEach((att) => {
        const decoded = profileSchemaEncoder.decodeData(att.data);
        decodedAtts.push({
          ...att,
          displayName: decoded[0].value.value.toString(),
          avatarUrl: decoded[1].value.value.toString(),
        });
      });

      setProfiles((prevProfiles) => {
        const updatedProfiles = { ...prevProfiles };
        decodedAtts.forEach((profile) => {
          updatedProfiles[profile.attester] = profile;
        });
        return updatedProfiles;
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const createProfile = async (displayName: string, avatarUrl: string) => {
    try {
      if (!signer) return;
      const eas = new EAS(config.eas);
      eas.connect(signer);

      // Initialize SchemaEncoder with the schema string
      const encodedData = profileSchemaEncoder.encodeData([
        { name: "displayName", value: displayName, type: "string" },
        { name: "avatarUrl", value: avatarUrl, type: "string" },
      ]);

      const schemaUID = schemaConfig.profile;

      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: "0x0000000000000000000000000000000000000000",
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      });

      await tx.wait();

      // Update local profile
      address &&
        setProfiles((prevProfiles) => {
          const updatedProfiles = { ...prevProfiles };

          if (updatedProfiles[address]) {
            // Check if profile exists
            updatedProfiles[address].displayName = displayName;
            updatedProfiles[address].avatarUrl = avatarUrl;
          } else {
            // If the profile does not exist, create one.
            // However, this scenario might not be likely given that they're updating their profile.
            updatedProfiles[address] = {
              // Assuming a structure like this based on the previous code.
              // You'd adjust based on the actual structure of a profile
              id: "someId", // Provide actual value
              attester: "someAttester", // Provide actual value
              recipient: address,
              refUID: "someRefUID", // Provide actual value
              revocationTime: 0, // Provide actual value
              expirationTime: 0, // Provide actual value
              data: "0x", // Provide actual value
              displayName: displayName,
              avatarUrl: avatarUrl,
              txid: "0x",
              time: 0,
            };
          }

          return updatedProfiles;
        });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // SCHEMAS
  const createSchema = async (
    schema: string,
    resolverAddress: string,
    revocable: boolean = true
  ) => {
    if (!signer) return;
    const schemaRegistryContractAddress = config.schemaRegistry;
    const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

    schemaRegistry.connect(signer);

    const transaction = await schemaRegistry.register({
      schema,
      resolverAddress,
      revocable,
    });

    // Optional: Wait for transaction to be validated
    await transaction.wait();
  };

  return (
    <DataContext.Provider
      value={{
        conversations,
        setConversations,
        loadingConversations,
        handleSendMessage,
        primeEmptyConversation,
        threads,
        loadingThreads,
        threadsToLoad,
        setThreadsToLoad,
        handleCreateThread,
        handleCreateComment,
        upVoteAttestation,
        profiles,
        createProfile,
        createSchema,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
