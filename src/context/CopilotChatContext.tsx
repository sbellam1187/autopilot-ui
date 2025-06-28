"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";
import {
  useCopilotChat,
  UseCopilotChatOptions,
  UseCopilotChatReturn,
} from "@copilotkit/react-core";
import { TextMessage } from "@copilotkit/runtime-client-gql";

export type ResponseBlockType = {
  message: TextMessage;
  id: string;
  title: string;
  type: string;
};

interface ExtendedCopilotChatContext extends UseCopilotChatReturn {
  responseMessage: ResponseBlockType | null;
  setResponseMessage: React.Dispatch<
    React.SetStateAction<ResponseBlockType | null>
  >;
  responseMessages: ResponseBlockType[];
  setResponseMessages: React.Dispatch<
    React.SetStateAction<ResponseBlockType[]>
  >;
}

const CopilotChatContext = createContext<
  ExtendedCopilotChatContext | undefined
>(undefined);

interface CopilotChatProviderProps {
  children: ReactNode;
  options?: UseCopilotChatOptions;
}

export function CopilotChatProvider({
  children,
  options = {},
}: CopilotChatProviderProps) {
  const chatMethods = useCopilotChat(options);

  const [responseMessage, setResponseMessage] =
    useState<ResponseBlockType | null>(null);
  const [responseMessages, setResponseMessages] = useState<ResponseBlockType[]>(
    [],
  );

  const contextValue: ExtendedCopilotChatContext = {
    ...chatMethods,
    responseMessage,
    setResponseMessage,
    responseMessages,
    setResponseMessages,
  };

  return (
    <CopilotChatContext.Provider value={contextValue}>
      {children}
    </CopilotChatContext.Provider>
  );
}

export function useCopilotChatContext(): ExtendedCopilotChatContext {
  const context = useContext(CopilotChatContext);

  if (context === undefined) {
    throw new Error(
      "useCopilotChatContext must be used within a CopilotChatProvider",
    );
  }

  return context;
}
