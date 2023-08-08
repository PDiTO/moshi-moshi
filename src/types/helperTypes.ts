import { ResolvedPublicMessageAttestation } from "./easTypes";

export type Conversation = {
  address: string;
  attestations: ResolvedPublicMessageAttestation[];
};
