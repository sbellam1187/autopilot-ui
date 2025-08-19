"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import { useChat } from "@ai-sdk/react";
import { UIMessage, DefaultChatTransport } from "ai";
import { containsMarkdown } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { getRemoteActionUrl } from "@/lib/server.actions";

export type ResponseBlockType = {
  message: {
    content: string;
    role: string;
  };
  id: string;
  title: string;
  type: string;
};

// Utility function to extract text content from UIMessage parts
export const getMessageContent = (message: UIMessage): string => {
  if (!message.parts || message.parts.length === 0) return "";

  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { text: string }).text)
    .join("");
};

interface ExtendedChatContext {
  messages: UIMessage[];
  input: string;
  setInput: (input: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  status: "submitted" | "streaming" | "ready" | "error";
  stop: () => void;
  sendMessage: (message: UIMessage) => void;
  setMessages: (
    messages: UIMessage[] | ((messages: UIMessage[]) => UIMessage[]),
  ) => void;

  responseMessage: ResponseBlockType | null;
  setResponseMessage: React.Dispatch<
    React.SetStateAction<ResponseBlockType | null>
  >;
  responseMessages: ResponseBlockType[];
  setResponseMessages: React.Dispatch<
    React.SetStateAction<ResponseBlockType[]>
  >;

  currentAgent: string;
  setCurrentAgent: (agent: string) => void;

  appendMessage: (message: UIMessage) => void;
  stopGeneration: () => void;

  sessionId: string;
}

const ChatContext = createContext<ExtendedChatContext | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
  defaultAgent?: string;
}

export function ChatProvider({
  children,
  defaultAgent = "supervisor_agent",
}: ChatProviderProps) {
  const [responseMessage, setResponseMessage] =
    useState<ResponseBlockType | null>(null);
  const [responseMessages, setResponseMessages] = useState<ResponseBlockType[]>(
    [],
  );
  const [currentAgent, setCurrentAgent] = useState<string>(defaultAgent);
  const [input, setInput] = useState("");
  const sessionId: string = `session_${Date.now()}`;
  const { data: session } = useSession();
  const authToken = useRef<string>("");
  const backendURL = useRef<string>("");

  useEffect(() => {
    authToken.current = session?.token || "";

    const loadURL = async () => {
      try {
        const url = await getRemoteActionUrl();
        backendURL.current = url;
      } catch (error) {
        console.error("Failed to get url", error);
      }
    };

    if (backendURL.current === "") {
      loadURL();
    }
  }, [session]);

  const getToken = () => {
    return authToken.current;
  };

  const getURL = () => {
    return backendURL.current;
  };

  const chatMethods = useChat({
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ messages }) => {
        return {
          body: {
            messages: messages.map((msg) => ({
              role: msg.role,
              content: getMessageContent(msg),
              id: msg.id,
            })),
            agent: currentAgent,
            sessionId: sessionId,
          },
          api: `${getURL()}`,
        };
      },
      headers: () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        "User-Agent": "AutopilotUI-Direct",
        Connection: "keep-alive",
      }),
    }),
    onData: (dataPart) => {
      console.group("🔍 Stream Data Debug");
      console.log("Data part type:", dataPart.type);
      console.log("Data part:", dataPart);

      // If it's a custom data type (e.g., "data-myCustomType")
      if (dataPart.type.startsWith("data-")) {
        console.log("Custom data type:", dataPart.type);
        console.log("Data content:", dataPart.data);
        console.log("Data ID:", dataPart.id);
      }

      console.log("Full data part JSON:", JSON.stringify(dataPart, null, 2));
      console.groupEnd();
    },
    onFinish: ({ message }: { message: UIMessage }) => {
      console.log("✅ Chat finished");
      console.log("Final message:", message);
      const content = getMessageContent(message);
      if (content && containsMarkdown(content)) {
        const responseBlock = {
          id: message.id,
          message: {
            content: content,
            role: message.role,
          },
          type: "markdown",
          title: `Response #${responseMessages.length + 1}`,
        } as ResponseBlockType;

        setResponseMessage(responseBlock);
        setResponseMessages((prev) => {
          const exists = prev.some((resp) => resp.id === message.id);
          return exists ? prev : [...prev, responseBlock];
        });
      }
    },
    onError: (error: Error) => {
      console.group("❌ Chat Error Debug");
      console.error("Error message:", error.message);
      console.error("Error name:", error.name);
      console.error("Error stack:", error.stack);
      console.error("Full error object:", error);
      console.error("Current agent:", currentAgent);
      console.error("Session ID:", sessionId);
      console.error(
        "Current messages:",
        chatMethods?.messages || "No messages available",
      );
      console.groupEnd();

      // Try to get more context about the state
      try {
        console.log("Chat status:", chatMethods?.status);
        console.log("Chat error:", chatMethods?.error);
      } catch (e) {
        console.error("Error accessing chat state:", e);
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    if (input.trim()) {
      try {
        console.log("📤 Sending message with agent:", currentAgent);
        console.log("📤 Message content:", input);

        chatMethods.sendMessage({
          id: Date.now().toString(),
          role: "user",
          parts: [
            {
              type: "text",
              text: input,
            },
          ],
        });
      } catch (error) {
        console.error("❌ Error sending message:", error);
        console.error("Current agent:", currentAgent);
        console.error("Input:", input);
      }
      setInput("");
    }
  };

  const contextValue: ExtendedChatContext = {
    messages: chatMethods.messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    status: chatMethods.status,
    stop: chatMethods.stop,
    sendMessage: chatMethods.sendMessage,
    setMessages: chatMethods.setMessages,
    responseMessage,
    setResponseMessage,
    responseMessages,
    setResponseMessages,
    currentAgent,
    setCurrentAgent,
    sessionId,
    appendMessage: chatMethods.sendMessage,
    stopGeneration: chatMethods.stop,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

export function useChatContext(): ExtendedChatContext {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }

  return context;
}
