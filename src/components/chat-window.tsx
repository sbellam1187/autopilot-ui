"use client";
import { CopilotChat, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import {
  ActivityIcon,
  Loader2,
  RotateCw,
  SendIcon,
  Square,
} from "lucide-react";
import { FC } from "react";
import { initialPrompt, chatSuggestions } from "@/lib/prompts";

export const ChatWindow: FC = () => {
  useCopilotChatSuggestions({
    instructions: chatSuggestions.default,
    minSuggestions: 1,
    maxSuggestions: 3,
  }, []); // No dependencies, so suggestions update on every chat context change

  return (
    <CopilotChat
      className="h-full flex flex-col"
      instructions={
        "Always use the MCP Agent if you need to use the MCP Servers. You are a multi-agent chat system with specialized agents:\n" +
        "- MCP Agent: For general or multipurpose tasks use the mcp_agent\n" +
        "- Sample Agent: For weather related queries use the sample_agent\n" +
        "- Research Agent: You are a helpful research assistant, set to help the user with conduction and writing a research paper on any topic using the ai_researcher agent."
      }
      labels={{
        placeholder: "Type your message here...",
        regenerateResponse: "Try another response",
        initial: initialPrompt.default,
      }}
      icons={{
        sendIcon: (
          <SendIcon className="w-4 h-4 hover:scale-110 transition-transform" />
        ),
        activityIcon: <ActivityIcon className="w-4 h-4 animate-pulse" />,
        spinnerIcon: <Loader2 className="w-4 h-4 animate-spin" />,
        stopIcon: (
          <Square className="w-4 h-4 hover:text-red-500 transition-colors" />
        ),
        regenerateIcon: (
          <RotateCw className="w-4 h-4 hover:rotate-180 transition-transform duration-300" />
        ),
      }}
    />
  );
};
