"use client";

import { useSession } from "next-auth/react";

export function containsMarkdown(input: string): boolean {
  const markdownPatterns = [
    /(^|\s)(#{1,6})\s.+/, // headers (#, ##, etc.)
    /\*\*(.*?)\*\*/, // bold
    /\*(.*?)\*/, // italic
    /`([^`]+)`/, // inline code
    /\[([^\]]+)]\(([^)]+)\)/, // links
    /^[-*+]\s+.+/, // unordered list
    /^\d+\.\s+.+/, // ordered list
    /^>\s.+/, // blockquote
    /^```[\s\S]*?```/, // fenced code block
  ];

  return markdownPatterns.some((pattern) => pattern.test(input));
}

export function useUpdateToken() {
  const { update } = useSession();

  const updateGHToken = async (token: string) => {
    try {
      await update({ githubToken: token });
    } catch (error) {
      console.error("Failed to save token in session: ", error);
    }
  };

  return { updateGHToken };
}
