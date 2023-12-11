"use client";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemeProvider } from "next-themes";

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider className="h-full w-full">
      <NextThemeProvider attribute="class">{children}</NextThemeProvider>
    </NextUIProvider>
  );
}
