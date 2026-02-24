import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Milo — Security Tools for OpenClaw",
  description:
    "Free security audit for OpenClaw deployments. 135,000+ instances are exposed. Find out if yours is one of them.",
  openGraph: {
    title: "Milo — Security Tools for OpenClaw",
    description:
      "Free security audit for OpenClaw. 135,000+ exposed instances. Check yours now.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Milo — Security Tools for OpenClaw",
    description:
      "Free security audit for OpenClaw. 135,000+ exposed instances. Check yours now.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-gray-950 text-gray-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
