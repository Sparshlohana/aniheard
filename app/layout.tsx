import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import "./globals.css";

const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AniHeard | Anime Opening Guess Game",
  description:
    "Guess anime openings from ten-second snippets. Daily challenge, endless mode, streaks, and neon anime vibes.",
  openGraph: {
    title: "AniHeard",
    description: "Ten seconds. One opening. Infinite anime bragging rights.",
    siteName: "AniHeard",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AniHeard",
    description: "Wordle energy, Heardle pacing, anime opening chaos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
