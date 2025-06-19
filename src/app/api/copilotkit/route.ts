import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  LangChainAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { getServerSession } from "next-auth";
import { authConfig } from "@/config/auth";

// Determine which LLM provider to use based on environment variables
const getLLMProvider = () => {
  const provider = process.env.LLM_PROVIDER || "openai"; // Default to OpenAI
  return provider.toLowerCase();
};

const createLLMModel = ({ tools }: { tools: DynamicStructuredTool[] }) => {
  const provider = getLLMProvider();

  switch (provider) {
    case "ollama":
      return new ChatOllama({
        model: process.env.OLLAMA_MODEL || "qwen3",
        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
      }).withConfig({ tools });

    case "openai":
    default:
      return new ChatOpenAI({
        model: process.env.OPENAI_MODEL || "gpt-4o",
        apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
        configuration: {
          baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
        },
      }).withConfig({ tools });
  }
};

const serviceAdapter = new LangChainAdapter({
  chainFn: async ({ messages, tools }) => {
    const model = createLLMModel({ tools });
    return model.stream(messages);
  },
});

const runtime = async () => {
  const session = await getServerSession(authConfig);

  return new CopilotRuntime({
    remoteEndpoints: [
      {
        url:
          process.env.REMOTE_ACTION_URL || "http://localhost:8000/copilotkit",
        onBeforeRequest() {
          return {
            headers: {
              Authorization: `Bearer ${session?.token || ""}`,
              "User-Agent": "AutopilotUI",
            },
          };
        },
      },
    ],
  });
};

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: await runtime(),
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
