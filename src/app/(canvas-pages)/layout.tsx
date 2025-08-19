"use client";

import { SessionProvider } from "next-auth/react";
import { ChatProvider } from "@/providers/ChatProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChatProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </ChatProvider>
    </SessionProvider>
  );
}
