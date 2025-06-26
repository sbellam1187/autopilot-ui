"use client";

import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = async () => {
    if (!buttonRef.current || !document.startViewTransition()) {
      setTheme(theme === "dark" ? "light" : "dark");
      return;
    }

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const maxRadius =
      Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      ) * 2;

    document.documentElement.style.setProperty("--circle-x", `${x}px`);
    document.documentElement.style.setProperty("--circle-y", `${y}px`);
    document.documentElement.style.setProperty(
      "--circle-radius",
      `${maxRadius}px`,
    );

    const transition = document.startViewTransition(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    });

    await transition.ready;
  };

  if (!mounted) {
    return null;
  }

  return (
    <Button ref={buttonRef} variant={"ghost"} onClick={toggleTheme}>
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}
