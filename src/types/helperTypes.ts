import {
  ResolvedProfileAttestation,
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
  liked?: boolean;
};

export type ThreadComment = {
  attestation: ResolvedThreadCommentAttestation;
  comments: ThreadComment[];
  votes: number;
  liked?: boolean;
};

export type Profile = {
  attestation: ResolvedProfileAttestation;
};

export enum ThreadsToLoad {
  MINE,
  RECENT,
}
