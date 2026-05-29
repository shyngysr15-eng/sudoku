import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sudoku Academy - Advanced Training & PvP",
  description: "A highly polished, gamified Sudoku training web app with vertical swipe navigation, bento stats, daily challenges, and PvP Arena. Inspired by Duolingo, Strava, and Chess.com.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-100 selection:bg-brand-blue-100 selection:text-brand-blue-600">
        {children}
      </body>
    </html>
  );
}
