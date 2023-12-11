import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProviders } from "./theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "pm2-monitor-app",
  description:
    "Real-time performance analysis and early warning platform for applications deployed using pm2.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`h-screen w-full min-w-[1280px] overflow-x-auto font-sans ${inter.variable}`}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <ThemeProviders>{children}</ThemeProviders>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
