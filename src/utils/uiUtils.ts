import { Thread, ThreadComment } from "@/types/helperTypes";
import { createHash } from "crypto";

export function countComments(thread: Thread): number {
  // This function counts the direct comments and recursively counts sub-comments.
  function countSubComments(comments: ThreadComment[]): number {
    let totalCount = comments.length;

    comments.forEach((comment) => {
      totalCount += countSubComments(comment.comments);
    });

    return totalCount;
  }

  // Start the count with the top-level thread's comments.
  return countSubComments(thread.comments);
}

export function formatDate(timestamp: number): string {
  const inputDate = new Date(timestamp * 1000);
  const currentDate = new Date();

  const startOfInputDate = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );
  const startOfCurrentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const daysDiff = Math.floor(
    (startOfCurrentDate.getTime() - startOfInputDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // If it's today, return the time without seconds
  if (daysDiff === 0) {
    return inputDate.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // If it's yesterday, return "Yesterday"
  if (daysDiff === 1) {
    return "Yesterday";
  }

  // If it's within the last 7 days, return the day name
  if (daysDiff > 1 && daysDiff < 7) {
    const days: string[] = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[inputDate.getDay()];
  }

  // Otherwise, return the date in the local format
  return inputDate.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const avatarUrls = [
  "https://api.dicebear.com/6.x/adventurer/svg?seed=Oreo",
  "https://api.dicebear.com/6.x/adventurer/svg?seed=Charlie",
  "https://api.dicebear.com/6.x/adventurer/svg?seed=Luna",
];

export const getRandomAvatarForAddress = (address: string) => {
  const hash = createHash("sha256").update(address).digest("hex");

  const index = parseInt(hash, 16) % avatarUrls.length;

  return avatarUrls[index];
};
