import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Milo Shield — Is Your OpenClaw Safe?",
  description:
    "Free security audit for OpenClaw deployments. 135,000+ instances are exposed. Find out if yours is one of them.",
  metadataBase: new URL("https://getmilo.dev"),
  openGraph: {
    title: "Milo Shield — Is Your OpenClaw Safe?",
    description:
      "Free security audit for OpenClaw. 135,000+ exposed instances. Check yours now.",
    type: "website",
    url: "https://getmilo.dev",
    siteName: "Milo — OpenClaw Security",
  },
  twitter: {
    card: "summary_large_image",
    title: "Milo Shield — Is Your OpenClaw Safe?",
    description:
      "Free security audit for OpenClaw. 135,000+ exposed instances. Check yours now.",
  },
  alternates: {
    canonical: "https://getmilo.dev",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Milo — OpenClaw Security",
    url: "https://getmilo.dev",
    description:
      "Security tools and guides for OpenClaw AI agent deployments. Free security audit, hardening guides, and automated protection.",
    publisher: {
      "@type": "Organization",
      name: "Milo",
      url: "https://getmilo.dev",
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
