"use client";

import { useAccount } from "wagmi";

export function WrapperConnected({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected) return null;

  return <>{children}</>;
}
