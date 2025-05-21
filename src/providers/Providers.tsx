"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CopilotKit } from "@copilotkit/react-core";
import { CoAgentsProvider } from "@/components/coagents-provider";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CopilotKit
        showDevConsole={false}
        runtimeUrl="/api/copilotkit"
        agent="mcp_agent" // the name of the agent you want to use
      >
        <CoAgentsProvider>{children}</CoAgentsProvider>
      </CopilotKit>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
