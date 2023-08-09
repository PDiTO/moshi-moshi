import {
  ResolvedPublicMessageAttestation,
  ResolvedThreadAttestation,
  ResolvedThreadCommentAttestation,
} from "./easTypes";

export type Conversation = {
  address: string;
  attestations: ResolvedPublicMessageAttestation[];
};

export type Thread = {
  attestation: ResolvedThreadAttestation;
  comments: ThreadComment[];
  votes: number;
};

export type ThreadComment = {
  attestation: ResolvedThreadCommentAttestation;
  comments: ThreadComment[];
  votes: number;
};
