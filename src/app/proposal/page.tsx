"use client";

import { Proposals } from "@/components/Proposals";
import { WrapperConnected } from "@/components/WrapperConnected";

export default function ProposalPage() {
  return (
    <WrapperConnected>
      <Proposals />
    </WrapperConnected>
  );
}
