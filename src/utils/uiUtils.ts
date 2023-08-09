import { Thread, ThreadComment } from "@/types/helperTypes";

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
