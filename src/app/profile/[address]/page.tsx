"use client";

import { Chat } from "@/components/Chat";
import { UserProfile } from "@/components/UserProfile";
import { WrapperConnected } from "@/components/WrapperConnected";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { address } = useParams() as {
    address: string;
  };

  return (
    <WrapperConnected>
      <UserProfile user={address} />
    </WrapperConnected>
  );
}
