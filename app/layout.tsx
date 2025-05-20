import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

import { CopilotChat } from "@copilotkit/react-ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Researcher",
  description: "AI Researcher",
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" className="light">
//       <body className={inter.className}>{children}</body>
//     </html>
//   );
// }

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <body>
        <CopilotKit
          agent="mcp_agent" // lock the agent to the sample_agent since we only have one agent
          runtimeUrl="/api/copilotkit"
          showDevConsole={false}
        >
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
