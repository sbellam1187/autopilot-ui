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
        "Are there any streaming protocols that are in Incubate?",
        "What Azure resources are blocked due to GaaS policies?",
      ],
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      title: "Insights",
      suggestions: [
        "What are the MQ dependencies for {{shortname}}?",
        "What are the user details for {{name|employee id|github id|etc}}?",
        "What are applications details for {{shortname}}?",
        "Who made the last commit on {{repository name}}? When did it occur?",
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
        "List out the VMs that belong to shortname {{shortname}}.",
        "What are the vulnerabilities on this VM {{vm hostname}}?",
        "List the installed applications on this VM {{vm hostname}}.",
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
