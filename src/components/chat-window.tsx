"use client";

import { Button } from "@/components/ui/button";
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
import ResponseBlock from "@/components/response-block";
import { useChatContext } from "@/providers/ChatProvider";
import {
  UIDataTypes,
  UIMessage,
  UIMessagePart,
  UITools,
  isToolUIPart,
} from "ai";
import { Tool, ToolPart } from "./ui/tool";
import { ResponseBlockType } from "@/providers/ChatProvider";
import { useMemo } from "react";

export default function ChatWindow() {
  const { messages, status, stopGeneration, handleSubmit, input, setInput } =
    useChatContext();

  const onSubmitMessage = () => {
    if (status === "ready") {
      handleSubmit();
      setInput("");
    } else {
      stopGeneration();
    }
  };

  const filteredMessages = useMemo(() => {
    if (messages.length === 0) return [];

    const result: UIMessage[] = [];
    let i = 0;

    while (i < messages.length) {
      const message = messages[i];

      if (message.role === "user") {
        // Always include user messages
        result.push(message);
        i++;
      } else if (message.role === "assistant") {
        // For assistant messages, find the last one in the consecutive sequence
        let lastAssistantMessage = message;
        let j = i + 1;

        // Look ahead to find the last consecutive assistant message
        while (j < messages.length && messages[j].role === "assistant") {
          lastAssistantMessage = messages[j];
          j++;
        }

        // Add only the last assistant message in this sequence
        result.push(lastAssistantMessage);
        i = j; // Skip to after all the assistant messages we just processed
      } else {
        // For any other role, just include it
        result.push(message);
        i++;
      }
    }

    return result;
  }, [messages]);

  const renderPart = ({
    part,
    role,
    messageId,
  }: {
    part: UIMessagePart<UIDataTypes, UITools>;
    role: string;
    messageId: string;
  }) => {
    if (part.type === "text") {
      if (!containsMarkdown(part.text) && part.text.trim() !== "") {
        if (role === "user") {
          return (
            <Message key={messageId} className="justify-end">
              <MessageContent>{part.text}</MessageContent>
            </Message>
          );
        } else {
          return (
            <Message key={messageId} className="justify-start">
              <MessageContent className="bg-transparent">
                {part.text}
              </MessageContent>
            </Message>
          );
        }
      } else if (containsMarkdown(part.text) && part.text !== "") {
        const responseBlock = {
          id: messageId,
          message: {
            content: part.text,
            role: role,
          },
          type: "markdown",
          title: status === "streaming" ? "Generating..." : `Response`,
        } as ResponseBlockType;

        return <ResponseBlock key={messageId} message={responseBlock} />;
      }
    }
    if (isToolUIPart(part)) {
      return (
        <Tool key={`${messageId}-${part.type}`} toolPart={part as ToolPart} />
      );
    }
    return null;
  };

  const renderMessage = (message: UIMessage) => {
    return (
      <div key={message.id} className="space-y-2">
        {message.parts.map((part, index) => {
          return (
            <div key={index}>
              {renderPart({
                part: part,
                role: message.role,
                messageId: message.id,
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="space-y-4 p-4">
          {filteredMessages.map((message) => renderMessage(message))}
          {status === "streaming" && <Loader variant="loading-dots" text="" />}
        </ChatContainerContent>
      </ChatContainerRoot>
      <div className="flex">
        <PromptInput
          value={input}
          onValueChange={(value) => setInput(value)}
          onSubmit={() => onSubmitMessage()}
          isLoading={status === "streaming" || status === "submitted"}
          className="w-full max-w-(--breakpoint-md)"
        >
          <PromptInputTextarea placeholder="Ask me anything!" />
          <PromptInputActions className="justify-end pt-2">
            <PromptInputAction
              tooltip={
                status === "streaming" || status === "submitted"
                  ? "Stop generation"
                  : "Send message"
              }
            >
              <Button
                variant="default"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onSubmitMessage()}
                disabled={
                  (input.length === 0 && status === "streaming") ||
                  status === "submitted"
                }
              >
                {status === "streaming" || status === "submitted" ? (
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
