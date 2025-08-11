import PromptSuggestionsButton from "@/components/prompt-suggestions-button";
import { Brain, GraduationCap, Pen, Search } from "lucide-react";

export default function PromptSuggestionsRow({
  setInput,
}: {
  setInput: (value: string) => void;
}) {
  const suggestionsData = [
    {
      title: "Learn",
      suggestions: [
        "What is Tech Radar?",
        "What resources are blocked that allow exceptions for gaas policies?",
      ],
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      title: "Insights",
      suggestions: [
        "What are the MQ dependencies for shortname?",
        "What are the user details for this?",
        "What are applications details for this?",
      ],
      icon: <Search className="w-4 h-4" />,
    },
    {
      title: "Write",
      suggestions: [
        "Generate sample mermaid diagram for Kubernetes manifest file.",
      ],
      icon: <Pen className="w-4 h-4" />,
    },
    {
      title: "Operations",
      suggestions: [
        "List out the VMs that belong to this?",
        "What are the vulnerabilities on this VM?",
        "What are the installed applications on this VM?",
      ],
      icon: <Brain className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full flex justify-center gap-3 mt-5">
      {suggestionsData.map((suggestion, index) => {
        return (
          <PromptSuggestionsButton
            key={index}
            promptSuggestion={suggestion}
            setInput={setInput}
          />
        );
      })}
    </div>
  );
}
