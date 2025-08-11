"use client";

import Image from "next/image";
import ChatWindow from "@/components/chat-window";
import { Markdown } from "@/components/ui/markdown";
import ChatPage from "@/components/chat-page";
import { useChatContext } from "@/providers/ChatProvider";

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
  const { responseMessage, messages } = useChatContext();

  if (messages.length === 0) {
    return <ChatPage />;
  }

  return (
    <div className="relative h-full w-full grid grid-cols-1 md:grid-cols-12">
      <div className="order-last md:order-first md:col-span-4 p-4 border-r h-screen overflow-y-auto">
        <ChatWindow />
      </div>
      <div className="order-first md:order-last md:col-span-8 p-8 overflow-y-auto">
        <div className="space-y-8 h-full">
          {responseMessage === null ? (
            <DefaultView />
          ) : (
            <div className="mt-10">
              <Markdown>{responseMessage.message.content}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
