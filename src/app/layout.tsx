import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from 'next-themes'
import { QueryProvider } from "@/components/providers/query-provider";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ultimate Pokédex - Fast, Beautiful, Intuitive",
  description: "A modern Pokédex with lightning-fast search, powerful filters, and gorgeous adaptive UI themes. Built with Next.js 14 and TypeScript.",
  keywords: ["Pokemon", "Pokedex", "Next.js", "TypeScript", "React", "Tailwind"],
  authors: [{ name: "Claude Code" }],
  openGraph: {
    title: "Ultimate Pokédex",
    description: "Fast, beautiful, and intuitive Pokédex with adaptive theming",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AppShell>
              {children}
            </AppShell>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
