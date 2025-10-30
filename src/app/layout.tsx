import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { UserFeedback } from "@/components/feedback/UserFeedback";
import { KeyboardNavigationProvider } from "@/components/ui/keyboard-navigation";
import "./globals.css";
import "@/lib/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MDReader - Enterprise Document Management",
  description: "AI-powered document management with enterprise-grade UX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <KeyboardNavigationProvider>
          <ToastProvider>
            {children}
            <UserFeedback />
          </ToastProvider>
        </KeyboardNavigationProvider>
      </body>
    </html>
  );
}
