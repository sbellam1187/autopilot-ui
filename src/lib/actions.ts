"use client";

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
