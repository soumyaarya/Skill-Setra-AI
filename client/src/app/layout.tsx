import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillSetra AI — Bridging the Bharat Skill Gap",
  description:
    "AI-powered Career GPS that aligns India's youth and informal-sector workers with local industry demand using real-time data and intelligent matching.",
  keywords: ["career guidance", "skill gap", "India jobs", "AI career", "Skill India", "Digital India"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
