import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dispatch, SetStateAction } from "react";
import { JSX } from "react/jsx-runtime";

type PromptSuggestion = {
  title: string;
  suggestions: string[];
  icon: JSX.Element;
};

export default function PromptSuggestionsButton({
  promptSuggestion,
  setInput,
}: {
  promptSuggestion: PromptSuggestion;
  setInput: Dispatch<SetStateAction<string>>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2">
          {promptSuggestion.icon}
          {promptSuggestion.title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {promptSuggestion.suggestions.map((suggestion, index) => {
          return (
            <DropdownMenuItem onClick={() => setInput(suggestion)} key={index}>
              {suggestion}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
