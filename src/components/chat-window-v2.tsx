"use client";

import { useCopilotChatContext } from "@/context/CopilotChatContext";
import { Button } from "@/components/ui/button";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import type { Message as CopilotMessage } from "@copilotkit/runtime-client-gql";
import { useState } from "react";
import { containsMarkdown } from "@/lib/actions";
import {
  ChatContainerRoot,
  ChatContainerContent,
} from "@/components/ui/chat-container";
import { Message, MessageContent } from "@/components/ui/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputAction,
  PromptInputActions,
} from "@/components/ui/prompt-input";
import { Square, ArrowUp } from "lucide-react";
import { Loader } from "@/components/ui/loader";

export default function ChatWindowV2() {
  const { visibleMessages, appendMessage, isLoading, stopGeneration } =
    useCopilotChatContext();
  const [message, setMessage] = useState("");

  const onSubmitMessage = () => {
    if (!isLoading) {
      appendMessage(new TextMessage({ content: message, role: Role.User }));
      setMessage("");
    } else {
      stopGeneration();
    }
  };

  const renderMessage = ({
    message,
    index,
  }: {
    message: CopilotMessage;
    index: number;
  }) => {
    if (message.isTextMessage()) {
      if (!containsMarkdown(message.content) && message.content !== "") {
        if (message.role === Role.User) {
          return (
            <Message key={index} className="justify-end">
              <MessageContent>{message.content}</MessageContent>
            </Message>
          );
        } else {
          return (
            <Message key={index} className="justify-start">
              <MessageContent className="bg-transparent">
                {message.content}
              </MessageContent>
            </Message>
          );
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="space-y-4 p-4">
          {visibleMessages.map((message, index) => {
            return renderMessage({ message, index });
          })}
          {isLoading && <Loader variant="loading-dots" text="Thinking" />}
        </ChatContainerContent>
      </ChatContainerRoot>
      <div className="flex">
        <PromptInput
          value={message}
          onValueChange={(content) => setMessage(content)}
          onSubmit={onSubmitMessage}
          isLoading={isLoading}
          className="w-full max-w-(--breakpoint-md)"
        >
          <PromptInputTextarea placeholder="Ask me anything!" />
          <PromptInputActions className="justify-end pt-2">
            <PromptInputAction
              tooltip={isLoading ? "Stop generation" : "Send message"}
            >
              <Button
                variant="default"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onSubmitMessage}
                disabled={message.length === 0 && !isLoading}
              >
                {isLoading ? (
                  <Square className="size-5 fill-current" />
                ) : (
                  <ArrowUp className="size-5" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  );
}
