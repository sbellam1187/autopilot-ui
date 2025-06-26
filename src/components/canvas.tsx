"use client";

import * as Agents from "@/components/agents";
import * as Skeletons from "@/components/skeletons";
import { AvailableAgents } from "@/lib/available-agents";
import { useCoAgent } from "@copilotkit/react-core";
import { Loader2, Settings, User } from "lucide-react";
import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { MCPConfigModal } from "./mcp-config-modal";
import ChatWindowV2 from "@/components/chat-window-v2";
import { useCopilotChatContext } from "@/context/CopilotChatContext";
import { MessageRole } from "@copilotkit/runtime-client-gql";
import { containsMarkdown } from "@/lib/actions";
import { Markdown } from "./ui/markdown";
import { useSession } from "next-auth/react";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const getCurrentlyRunningAgent = (
  state: Array<{
    status: boolean;
    name: string;
    nodeName: string;
  }>,
) => {
  return state.find((agent) => agent.status);
};

const DefaultView = () => (
  <div className="flex items-center justify-center h-full text-gray-600">
    <p className="text-2xl text-center font-serif italic max-w-3xl">
      <strong className="flex items-center justify-center gap-2">
        Welcome to Autopilot
        <Image
          src="/baby-yoda.png"
          alt="Baby Yoda"
          width={32}
          height={32}
          className="inline-block"
          priority
        />
      </strong>
      <br />
      Start a conversation in the chat to begin searching for users, researching
      application details, creating documents for your application, use the MCP
      agent for other tasks, or add your own MCP servers!
    </p>
  </div>
);

export default function Canvas() {
  const [showMCPConfigModal, setShowMCPConfigModal] = useState(false);
  const { visibleMessages } = useCopilotChatContext();
  const [markDownMessage, setMarkdownMessage] = useState<string | null>(null);

  useEffect(() => {
    const lastMessage = visibleMessages[visibleMessages.length - 1];

    if (
      lastMessage &&
      lastMessage.isTextMessage() &&
      lastMessage.role !== MessageRole.User &&
      containsMarkdown(lastMessage.content)
    ) {
      setMarkdownMessage(lastMessage.content);
    }
  }, [visibleMessages]);
  const { data: session } = useSession();

  const {
    running: travelAgentRunning,
    name: travelAgentName,
    nodeName: travelAgentNodeName,
  } = useCoAgent({
    name: AvailableAgents.TRAVEL_AGENT,
  });

  const {
    running: aiResearchAgentRunning,
    name: aiResearchAgentName,
    nodeName: aiResearchAgentNodeName,
  } = useCoAgent({
    name: AvailableAgents.RESEARCH_AGENT,
  });

  const {
    running: mcpAgentRunning,
    name: mcpAgentName,
    nodeName: mcpAgentNodeName,
  } = useCoAgent({
    name: AvailableAgents.MCP_AGENT,
  });

  const currentlyRunningAgent = getCurrentlyRunningAgent([
    {
      status: travelAgentRunning,
      name: travelAgentName,
      nodeName: travelAgentNodeName ?? "",
    },
    {
      status: aiResearchAgentRunning,
      name: aiResearchAgentName,
      nodeName: aiResearchAgentNodeName ?? "",
    },
    {
      status: mcpAgentRunning,
      name: mcpAgentName,
      nodeName: mcpAgentNodeName ?? "",
    },
  ]);

  return (
    <div className="relative h-full w-full grid grid-cols-1 md:grid-cols-12">
      {currentlyRunningAgent?.status ? (
        <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg animate-pulse z-[9999]">
          <span className="font-bold">
            <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
            {currentlyRunningAgent.name} agent executing{" "}
            {currentlyRunningAgent.nodeName} node
          </span>{" "}
        </div>
      ) : (
        <div className="absolute top-4 right-4 flex gap-2 z-[9999]">
          <Button
            onClick={() => setShowMCPConfigModal(true)}
            className="rounded-full shadow-lg"
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium">MCP Servers</span>
          </Button>

          <div className="px-4 py-2">
            <User className="inline-block w-5 h-5 mr-2" />
            <span className="font-bold">{session?.user?.name}</span>
          </div>
          <ThemeToggle />
        </div>
      )}
      <div className="order-last md:order-first md:col-span-4 p-4 border-r h-screen overflow-y-auto">
        <ChatWindowV2 />
      </div>
      <div className="order-first md:order-last md:col-span-8 p-8 overflow-y-auto">
        <div className="space-y-8 h-full">
          <Suspense fallback={<Skeletons.EmailListSkeleton />}>
            <div className="h-full">
              <Agents.TravelAgent />
              <Agents.AIResearchAgent />
              <Agents.MCPAgent />
              {markDownMessage === null ? (
                <DefaultView />
              ) : (
                <div className="mt-10">
                  <Markdown>{markDownMessage}</Markdown>
                </div>
              )}
            </div>
          </Suspense>
        </div>
      </div>

      {/* MCP Config Modal */}
      <MCPConfigModal
        isOpen={showMCPConfigModal}
        onCloseAction={() => setShowMCPConfigModal(false)}
      />
    </div>
  );
}
