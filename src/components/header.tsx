"use client";

import SettingsButton from "@/components/settings-button";
import ThemeToggle from "@/components/theme-toggle";

export default function Header() {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 z-1">
      <SettingsButton />
      <ThemeToggle />
    </div>
  );
}
