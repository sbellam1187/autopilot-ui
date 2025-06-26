"use client";

import { CopilotChat, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { FC } from "react";
import { initialPrompt, chatSuggestions } from "@/lib/prompts";

export const ChatWindow: FC = () => {
  useCopilotChatSuggestions(
    {
      instructions: chatSuggestions.default,
      minSuggestions: 1,
      maxSuggestions: 3,
    },
    [],
  ); // No dependencies, so suggestions update on every chat context change

  return (
    <CopilotChat
      className="h-full flex flex-col"
      instructions={
        "Always use the MCP Agent if you need to use the MCP Servers. You are a multi-agent chat system with specialized agents:\n" +
        "- MCP Agent: For general or multipurpose tasks use the mcp_agent\n" +
        "- Sample Agent: For weather related queries use the sample_agent"
      }
      labels={{
        placeholder: "Type your message here...",
        regenerateResponse: "Try another response",
        initial: initialPrompt.default,
      }}
    />
  );
};
