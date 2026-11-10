import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/data";
import { siteUrl } from "@/lib/site";
import { THEME_BOOT_SCRIPT } from "@/lib/theme-boot";
import { themeCss } from "@/lib/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} | ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.tagline,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${profile.name} | ${profile.role}`,
    description: profile.tagline,
    url: "/",
    siteName: profile.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} | ${profile.role}`,
    description: profile.tagline,
  },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body
        suppressHydrationWarning
        className="bg-ink-950 font-sans text-zinc-300 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
