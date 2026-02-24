"use client";

import {
  Shield,
  FileText,
  Wrench,
  Activity,
  Check,
  ArrowRight,
  Clock,
  Zap,
  BookOpen,
  Search,
  Lock,
  BarChart3,
  Terminal,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* Nav */}
      <nav className="border-b border-gray-800 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center font-bold text-sm">
              M
            </div>
            <span className="font-semibold text-white">Milo</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition">Security Scan</Link>
            <Link href="/setup" className="text-gray-400 hover:text-white transition">Setup Guide</Link>
            <Link href="/services" className="text-cyan-400">Services</Link>
            <Link href="/blog" className="text-gray-400 hover:text-white transition">Blog</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-cyan-400 text-sm mb-6">
            <Zap className="w-4 h-4" />
            Expert OpenClaw Services
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Stop guessing.{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Get it right.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Most OpenClaw setups waste tokens, leak memory, and break silently.
            We fix that. From a $49 guide to a full done-for-you build.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

          {/* Field Manual */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 border border-cyan-500/30 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-cyan-500/20 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full">
              BESTSELLER
            </div>
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">The OpenClaw Field Manual</h2>
            <p className="text-gray-400 mb-4">
              The definitive production guide. 10 chapters, 15,000+ words.
              Memory configs, token optimization, multi-agent architecture,
              security hardening, autonomous execution. Every config is
              copy-paste ready.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "8 silent failures that waste your first week",
                "Memory config that actually persists across sessions",
                "Token optimization (cut costs 40-60%)",
                "Complete copy-paste openclaw.json",
                "Production troubleshooting decision tree",
                "Multi-agent architecture patterns",
                "WhatsApp + Google multi-account setup",
                "Gateway watchdog + crash recovery",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold text-white">$49</span>
                <span className="text-gray-500 ml-2">one-time</span>
              </div>
              <a
                href="https://buy.stripe.com/8x2bJ070hdH91hgfgOfIs03"
                className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-xl transition"
              >
                Get the Manual <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* AI Agent Audit */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 border border-purple-500/30 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-purple-500/20 text-purple-400 text-xs font-bold px-3 py-1 rounded-full">
              POPULAR
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">AI Agent Audit</h2>
            <p className="text-gray-400 mb-4">
              We review your entire OpenClaw setup and deliver a detailed
              report with specific fixes. SOUL.md quality, memory architecture,
              token efficiency, security gaps, cron health, and channel config.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                "Full SOUL.md / AGENTS.md / USER.md review",
                "Memory config analysis (is memoryFlush working?)",
                "Token usage audit (where are you bleeding?)",
                "Security posture check (8-point assessment)",
                "Cron job health check",
                "Channel routing verification",
                "Personalized optimization recommendations",
                "Delivered within 48 hours",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold text-white">$199</span>
                <span className="text-gray-500 ml-2">one-time</span>
              </div>
              <a
                href="https://buy.stripe.com/00w3cu84l8mP5xwc4CfIs04"
                className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-black font-semibold px-6 py-3 rounded-xl transition"
              >
                Book an Audit <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Done-For-You Setup */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-900/50 border border-amber-500/30 rounded-2xl p-8 relative overflow-hidden md:col-span-2">
            <div className="md:flex md:gap-8">
              <div className="md:flex-1">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Done-For-You Setup</h2>
                <p className="text-gray-400 mb-4">
                  We build your production OpenClaw from scratch on your server.
                  Memory optimized, security hardened, channels connected,
                  cron jobs configured. You get a fully operational AI assistant
                  that survives crashes and remembers everything.
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Average setup time saved: 12-20 hours. Average token waste prevented: $200+.
                </p>
              </div>
              <div className="md:flex-1">
                <ul className="space-y-2 mb-6">
                  {[
                    "Fresh install on your VPS (Hetzner, DigitalOcean, etc.)",
                    "Memory architecture: memoryFlush, hybrid search, QMD",
                    "WhatsApp + Google account integration",
                    "Calendar aggregation across accounts",
                    "Security hardening (non-default port, auth, Tailscale)",
                    "Gateway watchdog with auto-recovery",
                    "Cron jobs: morning briefing, memory maintenance",
                    "SOUL.md, USER.md, AGENTS.md written to your spec",
                    "Daily backup to Hetzner Storage Box",
                    "30 days of email support after setup",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-bold text-white">$399</span>
                    <span className="text-gray-500 ml-2">one-time</span>
                  </div>
                  <a
                    href="https://buy.stripe.com/5kQcN484l32vgcac4CfIs05"
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-3 rounded-xl transition"
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Milo Watch Coming Soon */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-gray-900/80 to-gray-900 border border-gray-700 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Milo Watch</h2>
            <p className="text-gray-400 mb-4 max-w-lg mx-auto">
              Agent observability for OpenClaw. Token spend tracking, memory
              health monitoring, drift detection, cron job dashboards.
              Know what your agent is doing and what it costs.
            </p>
            <div className="inline-flex items-center gap-2 text-green-400 text-sm font-medium bg-green-500/10 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              Coming March 2026 &bull; $19-49/mo
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-400">135K+</div>
              <div className="text-sm text-gray-500 mt-1">Exposed OpenClaw instances</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">$250+</div>
              <div className="text-sm text-gray-500 mt-1">Average wasted on setup</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400">8</div>
              <div className="text-sm text-gray-500 mt-1">Silent failures in default config</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Common Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Who is this for?",
                a: "Anyone running OpenClaw who wants it to actually work well. Whether you just installed it or you've been running it for weeks and something feels off. The Field Manual is for self-service learners. The Audit is for people who want expert eyes. The Setup is for people who want it done right without the learning curve."
              },
              {
                q: "How is the Field Manual different from the official docs?",
                a: "The official docs tell you what's possible. The Field Manual tells you what actually works in production, what breaks silently, and gives you copy-paste configs based on hundreds of hours of research and community war stories. It's opinionated, not neutral."
              },
              {
                q: "What do I need to provide for the Audit?",
                a: "After purchase, we'll email you a secure form. You share your SOUL.md, AGENTS.md, USER.md, openclaw.json (with secrets redacted), and a screenshot of your /context detail output. We do the rest."
              },
              {
                q: "How long does the Done-For-You setup take?",
                a: "Typically 2-3 days from when we get SSH access to your server. Most of that is Google OAuth flows and WhatsApp QR code pairing, which need your involvement for 15-20 minutes total."
              },
              {
                q: "What if I'm not happy?",
                a: "Full refund within 7 days for the Field Manual. For services (Audit and Setup), if our recommendations don't improve your setup measurably, we'll refund you."
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">{q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <span>Milo Security &copy; 2026</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/blog" className="hover:text-white transition">Blog</Link>
            <a href="https://x.com/getmilo_dev" className="hover:text-white transition">@getmilo_dev</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
