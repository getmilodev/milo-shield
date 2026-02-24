import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Milo Shield — Is Your OpenClaw Safe?",
  description:
    "Free security audit for OpenClaw deployments. 135,000+ instances are exposed. Find out if yours is one of them.",
  openGraph: {
    title: "Milo Shield — Is Your OpenClaw Safe?",
    description:
      "Free security audit for OpenClaw. 135,000+ exposed instances. Check yours now.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Milo Shield — Is Your OpenClaw Safe?",
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
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
