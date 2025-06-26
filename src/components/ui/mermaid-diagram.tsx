import mermaid from "mermaid";
import { useEffect, useRef } from "react";

const MermaidDiagram = ({
  chart,
  theme,
}: {
  chart: string;
  theme: string | undefined;
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const isDarkMode = theme !== undefined && theme === "dark";

  useEffect(() => {
    if (chartRef.current) {
      mermaid.initialize({
        startOnLoad: false,
        suppressErrorRendering: true,
        darkMode: isDarkMode,
      });
      mermaid
        .render(`mermaid-${Math.random().toString(36).slice(2)}`, chart)
        .then(({ svg }) => {
          chartRef.current!.innerHTML = svg;
        })
        .catch((error) => {
          chartRef.current!.innerHTML = `<pre style="color:red;">Mermaid rendering failed: ${error}</pre>`;
          console.error("Mermaid rendering failed", error);
        });
    }
  }, [chart, isDarkMode]);

  return <div ref={chartRef} />;
};

export default MermaidDiagram;
