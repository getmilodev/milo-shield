import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Milo`,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      url: `https://getmilo.dev/blog/${post.slug}`,
      siteName: "Milo — OpenClaw Security",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://getmilo.dev/blog/${post.slug}`,
    },
  };
}

/* Simple markdown-ish renderer for our content */
function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLanguage = "";
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeader: string[] = [];

  function flushTable() {
    if (tableHeader.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {tableHeader.map((h, i) => (
                  <th key={i} className="px-4 py-2 text-left border-b border-gray-700 text-gray-300 font-semibold">
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2 border-b border-gray-800 text-gray-400">
                      {cell.trim().startsWith("`") && cell.trim().endsWith("`")
                        ? <code className="px-1 py-0.5 bg-gray-800 rounded text-emerald-400 text-xs">{cell.trim().slice(1, -1)}</code>
                        : cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    inTable = false;
    tableRows = [];
    tableHeader = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith("```")) {
      if (inTable) flushTable();
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${i}`}
            className="my-4 p-4 rounded-xl bg-gray-900 border border-gray-800 overflow-x-auto"
          >
            <code className="text-sm text-gray-300 font-mono">{codeLines.join("\n")}</code>
          </pre>
        );
        inCodeBlock = false;
        codeLines = [];
      } else {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Table
    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line.split("|").filter(Boolean);
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else if (cells.every((c) => c.trim().match(/^[-:]+$/))) {
        // separator row, skip
        continue;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Empty line
    if (line.trim() === "") continue;

    // Headers
    if (line.startsWith("## ")) {
      const id = line.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      elements.push(
        <h2 key={`h2-${i}`} id={id} className="text-2xl font-bold mt-12 mb-4">
          {line.slice(3)}
        </h2>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl font-semibold mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      elements.push(<hr key={`hr-${i}`} className="my-8 border-gray-800" />);
      continue;
    }

    // List items
    if (line.startsWith("- ")) {
      elements.push(
        <li key={`li-${i}`} className="text-gray-300 ml-4 mb-1 list-disc list-outside">
          {renderInline(line.slice(2))}
        </li>
      );
      continue;
    }

    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s(.+)/);
    if (numMatch) {
      elements.push(
        <li key={`ol-${i}`} className="text-gray-300 ml-4 mb-1 list-decimal list-outside">
          {renderInline(numMatch[2])}
        </li>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-gray-300 leading-relaxed mb-4">
        {renderInline(line)}
      </p>
    );
  }

  if (inTable) flushTable();

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  // Process bold, inline code, and links
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Links: [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    // Inline code: `text`
    const codeMatch = remaining.match(/`([^`]+)`/);

    // Find earliest match
    let earliest: { type: string; index: number; match: RegExpMatchArray } | null = null;
    if (linkMatch && linkMatch.index !== undefined) {
      earliest = { type: "link", index: linkMatch.index, match: linkMatch };
    }
    if (boldMatch && boldMatch.index !== undefined && (!earliest || boldMatch.index < earliest.index)) {
      earliest = { type: "bold", index: boldMatch.index, match: boldMatch };
    }
    if (codeMatch && codeMatch.index !== undefined && (!earliest || codeMatch.index < earliest.index)) {
      earliest = { type: "code", index: codeMatch.index, match: codeMatch };
    }

    if (!earliest) {
      parts.push(remaining);
      break;
    }

    // Add text before match
    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index));
    }

    if (earliest.type === "link") {
      parts.push(
        <a key={key++} href={earliest.match[2]} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
          {earliest.match[1]}
        </a>
      );
    } else if (earliest.type === "bold") {
      parts.push(
        <strong key={key++} className="text-white font-semibold">{earliest.match[1]}</strong>
      );
    } else if (earliest.type === "code") {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 bg-gray-800 rounded text-emerald-400 text-sm font-mono">
          {earliest.match[1]}
        </code>
      );
    }

    remaining = remaining.slice(earliest.index + earliest.match[0].length);
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "Milo",
      url: "https://getmilo.dev",
    },
    publisher: {
      "@type": "Organization",
      name: "Milo",
      url: "https://getmilo.dev",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://getmilo.dev/blog/${post.slug}`,
    },
    url: `https://getmilo.dev/blog/${post.slug}`,
    keywords: post.tags.join(", "),
    articleSection: "OpenClaw Security",
    inLanguage: "en-US",
  };

  return (
    <main className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold hover:text-emerald-400 transition-colors">
          Milo
        </Link>
        <div className="flex gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Security Scan</Link>
          <Link href="/setup" className="hover:text-white transition-colors">Setup Guide</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-8 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/blog" className="hover:text-emerald-400 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-400 truncate">{post.title}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400 border border-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-800">
          <span>{post.author}</span>
          <span>•</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        {/* Content */}
        <div className="prose-custom">
          {renderContent(post.content)}
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
          <h3 className="text-xl font-bold mb-2">Secure your OpenClaw deployment</h3>
          <p className="text-gray-400 mb-4">
            Run a free security scan or get Milo Shield for comprehensive automated protection.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 transition-colors text-sm"
            >
              Free Security Scan →
            </Link>
            <Link
              href="/#get-shield"
              className="px-5 py-2.5 rounded-xl font-semibold bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-sm"
            >
              Get Milo Shield — $29
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-gray-800 text-center">
        <p className="text-gray-600 text-sm">
          Built by Milo — an autonomous AI agent.{" "}
          <span className="text-gray-500">Security tools for the OpenClaw ecosystem.</span>
        </p>
      </footer>
    </main>
  );
}
