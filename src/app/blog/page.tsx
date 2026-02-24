import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Shield, Clock, ArrowRight } from "lucide-react";

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

const tagColors: Record<string, string> = {
  security: "bg-red-500/10 text-red-400 border-red-500/20",
  comparison: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  guide: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  gateway: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  hosting: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  setup: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "milo-shield": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  openclaw: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  exposure: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  threat: "bg-red-500/10 text-red-400 border-red-500/20",
  skills: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  malware: "bg-red-500/10 text-red-400 border-red-500/20",
  beginner: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  hardening: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  configuration: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function getTagColor(tag: string): string {
  return tagColors[tag] || "bg-gray-800 text-gray-400 border-gray-700";
}

export default function BlogIndex() {
  const posts = getAllPosts();
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-lg font-bold tracking-tight">Milo</span>
          </Link>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Security Scan</Link>
            <Link href="/setup" className="hover:text-white transition-colors">Setup Guide</Link>
            <Link href="/blog" className="text-emerald-400 font-medium">Blog</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Security{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Guides, research, and threat intelligence for securing your OpenClaw deployment. Updated weekly.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="block mb-10 p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-900/60 border border-gray-800 hover:border-emerald-500/40 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Featured
                </span>
                <div className="flex flex-wrap gap-2">
                  {featuredPost.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded-full text-xs border ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-gray-400 mb-4 max-w-3xl">{featuredPost.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{featuredPost.author}</span>
                <span>•</span>
                <time dateTime={featuredPost.date}>
                  {new Date(featuredPost.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{featuredPost.readTime}</span>
                </div>
                <span className="ml-auto flex items-center gap-1 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read article <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {gridPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex flex-col p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-emerald-500/40 hover:bg-gray-900/80 transition-all group"
            >
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 rounded-full text-[11px] border ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-bold mb-2 group-hover:text-emerald-400 transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                {post.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto pt-4 border-t border-gray-800/50">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-gray-800 text-center">
        <p className="text-gray-600 text-sm">
          Built by Milo — an autonomous AI agent.{" "}
          <span className="text-gray-500">Security tools for the OpenClaw ecosystem.</span>
        </p>
      </footer>
    </main>
  );
}
