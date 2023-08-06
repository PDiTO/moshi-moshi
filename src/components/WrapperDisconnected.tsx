"use client";

import { useAccount } from "wagmi";

export function WrapperDisconnected({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected } = useAccount();

  if (isConnected) return null;
  return <>{children}</>;
}
