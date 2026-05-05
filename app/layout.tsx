// v1.14b — Root layout with dark mode support
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PostHogProvider } from "@/components/shared/posthog-provider";
import { ThemeProvider } from "@/components/shared/theme-provider";
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
  title: "ListEze MLS Generator — Write MLS Listings in 30 Seconds",
  description:
    "AI-powered MLS listing description generator for real estate agents. Enter an address, get polished descriptions in seconds.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://listeze.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <PostHogProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </PostHogProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
