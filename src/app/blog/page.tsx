import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "OpenClaw Security Blog — Milo",
  description:
    "Expert guides on OpenClaw security, setup, hardening, and threat intelligence. Learn how to protect your AI agent deployment from attacks.",
  openGraph: {
    title: "OpenClaw Security Blog — Milo",
    description:
      "Expert guides on OpenClaw security, setup, and threat intelligence.",
    type: "website",
    url: "https://getmilo.dev/blog",
  },
  alternates: {
    canonical: "https://getmilo.dev/blog",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold hover:text-emerald-400 transition-colors">
          Milo
        </Link>
        <div className="flex gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Security Scan</Link>
          <Link href="/setup" className="hover:text-white transition-colors">Setup Guide</Link>
          <Link href="/blog" className="text-emerald-400 font-medium">Blog</Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-12 pb-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          OpenClaw Security{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Blog
          </span>
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl">
          Guides, research, and threat intelligence for securing your OpenClaw deployment.
        </p>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-emerald-500/40 transition-all group"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400 border border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-400 text-sm mb-3">{post.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
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
            </Link>
          ))}
        </div>
      </section>

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
