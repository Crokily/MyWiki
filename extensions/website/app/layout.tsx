import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Nunito } from "next/font/google";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { getAllPages } from "@/lib/content";

import "./globals.css";

const bodyFont = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MyWiki",
    template: "%s | MyWiki",
  },
  description: "A personal knowledge base incrementally maintained by LLM agents",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5d7052",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const searchEntries = getAllPages().map((p) => ({
    slug: p.slug,
    href: p.href,
    title: p.title,
    directory: p.directory,
  }));

  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
      <body>
        <div className="relative isolate min-h-screen px-4 py-4 sm:px-6">
          <SiteHeader entries={searchEntries} />
          <main className="mx-auto mt-6 w-full max-w-7xl pb-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
