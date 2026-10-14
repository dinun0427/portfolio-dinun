import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Dinun Ranasinghe | Software Engineer",
  description:
    "Portfolio of a software engineer building with TypeScript and Next.js.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        suppressHydrationWarning
        className="bg-ink-950 font-sans text-zinc-300 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
