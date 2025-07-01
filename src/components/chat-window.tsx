"use client";

import {
  ResponseBlockType,
  useCopilotChatContext,
} from "@/context/CopilotChatContext";
import { Button } from "@/components/ui/button";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import type { Message as CopilotMessage } from "@copilotkit/runtime-client-gql";
import { useEffect, useState } from "react";
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

export default function ChatWindow() {
  const {
    visibleMessages,
    appendMessage,
    isLoading,
    stopGeneration,
    setResponseMessage,
    setResponseMessages,
    responseMessages,
  } = useCopilotChatContext();
  const [message, setMessage] = useState("");

  const onSubmitMessage = () => {
    if (!isLoading) {
      appendMessage(new TextMessage({ content: message, role: Role.User }));
      setMessage("");
    } else {
      stopGeneration();
    }
  };

  useEffect(() => {
    const markdownMessages = visibleMessages
      .filter(
        (msg) =>
          msg.isTextMessage() &&
          containsMarkdown(msg.content) &&
          msg.content !== "" &&
          msg.status.code === "Success",
      )
      .map((msg) => {
        return {
          id: msg.id,
          message: msg,
          type: "markdown",
          title: `Response #${responseMessages.length + 1}`,
        } as ResponseBlockType;
      });

    if (markdownMessages.length > 0) {
      const latestMarkdownMessage =
        markdownMessages[markdownMessages.length - 1];
      setResponseMessage(latestMarkdownMessage);
    }

    if (markdownMessages.length > 0) {
      const newMessages = markdownMessages.filter(
        (newMsg) =>
          !responseMessages.some((existingMsg) => existingMsg.id === newMsg.id),
      );

      if (newMessages.length > 0) {
        setResponseMessages([...responseMessages, ...newMessages]);
      }
    }
  }, [
    visibleMessages,
    responseMessages,
    setResponseMessage,
    setResponseMessages,
  ]);

  const renderMessage = ({ message }: { message: CopilotMessage }) => {
    if (message.isTextMessage()) {
      if (!containsMarkdown(message.content) && message.content !== "") {
        if (message.role === Role.User) {
          return (
            <Message key={message.id} className="justify-end">
              <MessageContent>{message.content}</MessageContent>
            </Message>
          );
        } else {
          return (
            <Message key={message.id} className="justify-start">
              <MessageContent className="bg-transparent">
                {message.content}
              </MessageContent>
            </Message>
          );
        }
      } else if (containsMarkdown(message.content) && message.content !== "") {
        const existingResponseMessage = responseMessages.find(
          (resp) => resp.id === message.id,
        );

        if (existingResponseMessage) {
          return (
            <ResponseBlock key={message.id} message={existingResponseMessage} />
          );
        }
        return null;
      }
      return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="space-y-4 p-4">
          {visibleMessages.map((message) => {
            return renderMessage({ message });
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
