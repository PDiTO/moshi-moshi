export interface AttestationResult {
  data: Data;
}

export interface MyAttestationResult {
  data: MyData;
}

export interface EnsNamesResult {
  data: {
    ensNames: { id: string; name: string }[];
  };
}

export interface Data {
  attestation: Attestation | null;
}

export interface MyData {
  attestations: Attestation[];
}

export interface Attestation {
  id: string;
  attester: string;
  recipient: string;
  refUID: string;
  revocationTime: number;
  expirationTime: number;
  time: number;
  txid: string;
  data: `0x${string}`;
}

export type ResolvedPublicMessageAttestation = Attestation & {
  publicMessage: string;
  isSender: boolean;
};

export type ResolvedThreadAttestation = Attestation & {
  title: string;
  thread: string;
};

export type ResolvedThreadCommentAttestation = Attestation & {
  detailedRefUID: string;
  threadComment: string;
};

export type ResolvedUpVoteAttestation = Attestation & {
  upVote: boolean;
};
