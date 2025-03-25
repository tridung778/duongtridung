"use client"; // Đánh dấu là Client Component

import { useTheme } from "next-themes";
import Aurora from "@/blocks/Backgrounds/Aurora/Aurora";

export default function AuroraBackground() {
  const { theme } = useTheme();

  // Chỉ render Aurora khi theme là 'dark'
  if (theme !== "dark") return null;

  return (
    <div className="fixed top-0 left-0 h-full w-full">
      <Aurora
        // colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={0.3}
        speed={1}
      />
    </div>
  );
}
