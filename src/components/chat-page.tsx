"use client";

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
} from "@/components/ui/prompt-input";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowUpIcon } from "lucide-react";
import PromptSuggestionsRow from "./prompt-suggestions-row";
import { useChatContext } from "@/providers/ChatProvider";

export default function ChatPage() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { input, setInput, handleSubmit } = useChatContext();

  useEffect(() => {
    if (session) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [session]);

  const onSubmit = () => {
    if (input.trim() !== "") {
      handleSubmit();
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center ">
      <div className="min-w-[600px] min-h-[400px]">
        <h2
          className={`text-3xl text-center transition-opacity ease-in duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          {session?.user?.name ? `Hello ${session.user.name}` : `\u00A0`}
        </h2>
        <PromptInput
          value={input}
          onValueChange={(value) => setInput(value)}
          onSubmit={() => onSubmit()}
          className="w-full h-full mt-8"
        >
          <PromptInputTextarea placeholder="Ask me anything..." />
          <PromptInputActions className="justify-end">
            <Button
              onClick={() => onSubmit()}
              disabled={input.trim().length === 0}
              className="w-9 h-9 rounded-full"
            >
              <ArrowUpIcon className="h-4 w-4" />
            </Button>
          </PromptInputActions>
        </PromptInput>
        <PromptSuggestionsRow setInput={setInput} />
      </div>
    </div>
  );
}
