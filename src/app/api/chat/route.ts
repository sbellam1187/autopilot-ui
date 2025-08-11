import { NextRequest } from "next/server";
import { UIMessage } from "ai";
import { getServerSession } from "next-auth";
import { authConfig } from "@/config/auth";

// Utility function to extract text content from UIMessage parts
const getMessageContent = (message: UIMessage): string => {
  if (!message.parts || message.parts.length === 0) return "";

  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => (part as { text: string }).text)
    .join("");
};

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      sessionId,
      agent = "supervisor_agent",
    } = await req.json();
    const session = await getServerSession(authConfig);

    if (!session) {
      console.error("Failed to get session");
      throw new Error("Failed to retrieve session");
    }

    console.log("Received messages:", messages);
    console.log("Requested agent:", agent);
    console.log("Session ID:", sessionId);

    // Agent-specific debugging
    console.group(`🤖 Processing request for agent: ${agent}`);
    console.log("Messages count:", messages?.length || 0);
    console.log("Session ID:", sessionId);
    console.log("Auth token exists:", !!session?.token);
    console.groupEnd();

    console.log("Using LangGraph backend");

    const langGraphUrl = process.env.REMOTE_ACTION_URL;

    if (langGraphUrl === undefined) {
      console.error("REMOTE_ACTION_URL missing");
      throw new Error("REMOTE_ACTION_URL missing");
    }

    const response = await fetch(langGraphUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token || ""}`,
        "User-Agent": "AutopilotUI-Direct",
        Connection: "keep-alive",
      },
      body: JSON.stringify({
        messages: messages.map((msg: UIMessage) => ({
          role: msg.role,
          content: getMessageContent(msg),
          id: msg.id,
        })),
        agent: agent,
        sessionId: sessionId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.group(`❌ LangGraph Error for agent: ${agent}`);
      console.error(`Status: ${response.status}`);
      console.error(`Error text: ${errorText}`);
      console.error(`Agent: ${agent}`);
      console.error(`Session: ${sessionId}`);
      console.error(`Messages sent:`, messages?.length || 0);
      console.groupEnd();
      throw new Error(`Backend error: ${response.status} - Agent: ${agent}`);
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
        "x-vercel-ai-data-stream": "v1",
        "Keep-Alive": "timeout=300, max=1000",
      },
    });
  } catch (error) {
    console.group("❌ Chat API Error");
    console.error("Error:", error);
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error,
    );
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    console.groupEnd();

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
