"use client";

import React, { createContext, useContext, ReactNode } from "react";
import {
  useCopilotChat,
  UseCopilotChatOptions,
  UseCopilotChatReturn,
} from "@copilotkit/react-core";

const CopilotChatContext = createContext<UseCopilotChatReturn | undefined>(
  undefined,
);

interface CopilotChatProviderProps {
  children: ReactNode;
  options?: UseCopilotChatOptions;
}

export function CopilotChatProvider({
  children,
  options = {},
}: CopilotChatProviderProps) {
  const chatMethods = useCopilotChat(options);

  return (
    <CopilotChatContext.Provider value={chatMethods}>
      {children}
    </CopilotChatContext.Provider>
  );
}

export function useCopilotChatContext(): UseCopilotChatReturn {
  const context = useContext(CopilotChatContext);

  if (context === undefined) {
    throw new Error(
      "useCopilotChatContext must be used within a CopilotChatProvider",
    );
  }

  return context;
}
