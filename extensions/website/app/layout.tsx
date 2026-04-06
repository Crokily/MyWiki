import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";

import { Sidebar } from "@/components/Sidebar";
import { getAllTags } from "@/lib/content";

import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MyWiki",
    template: "%s | MyWiki",
  },
  description: "Personal knowledge base powered by markdown.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tags = getAllTags();

  return (
    <html lang="zh-CN" className={`${bodyFont.variable} ${monoFont.variable}`}>
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-8 lg:px-6">
          <Sidebar tags={tags} />
          <main className="min-w-0 flex-1">
            <div className="space-y-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
