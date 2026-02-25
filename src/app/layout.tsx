import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Milo — Security Tools for OpenClaw",
  description:
    "Free security audit for OpenClaw deployments. 135,000+ instances are exposed. Find out if yours is one of them.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Milo — Security Tools for OpenClaw",
    description:
      "Free security audit for OpenClaw. 135,000+ exposed instances. Check yours now.",
    type: "website",
    url: "https://getmilo.dev",
  },
  twitter: {
    card: "summary_large_image",
    site: "@getmilo_dev",
    creator: "@getmilo_dev",
    title: "Milo — Security Tools for OpenClaw",
    description:
      "Free security audit for OpenClaw. 135,000+ exposed instances. Check yours now.",
  },
  metadataBase: new URL("https://getmilo.dev"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script defer data-domain="getmilo.dev" src="https://plausible.io/js/script.js"></script>
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-gray-950 text-gray-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
