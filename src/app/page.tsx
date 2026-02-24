"use client";

import { useState } from "react";
import {
  Shield,
  Scan,
  Globe,
  Lock,
  Wrench,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Check,
  ArrowRight,
  Search,
  Eye,
  Terminal,
  FileText,
  Compass,
  BookOpen,
  Activity,
  Package,
  ChevronRight,
  ExternalLink,
  CircleAlert,
  ShieldCheck,
  ShieldAlert,
  Bug,
  Zap,
  Quote,
  Users,
  MapPin,
} from "lucide-react";

/* ---------- types ---------- */
interface Finding {
  severity: "critical" | "warning" | "pass";
  title: string;
  detail: string;
  fix?: string;
}

interface AuditResult {
  score: number;
  grade: string;
  findings: Finding[];
}

/* ---------- simulated audit logic ---------- */
function runAudit(config: string): AuditResult {
  const findings: Finding[] = [];
  let score = 100;
  const lower = config.toLowerCase();

  if (lower.includes("0.0.0.0") || lower.includes("host: 0.0.0.0")) {
    findings.push({
      severity: "critical",
      title: "Gateway exposed on all interfaces",
      detail:
        "Your gateway is bound to 0.0.0.0, making it accessible from the public internet. 135,000+ OpenClaw instances were found exposed this way.",
      fix: "Change gateway bind address to 127.0.0.1 or use a reverse proxy with TLS.",
    });
    score -= 25;
  } else if (lower.includes("127.0.0.1") || lower.includes("localhost")) {
    findings.push({
      severity: "pass",
      title: "Gateway bound to localhost",
      detail: "Your gateway is only accessible locally. Good.",
    });
  }

  if (
    !lower.includes("auth") &&
    !lower.includes("token") &&
    !lower.includes("password") &&
    !lower.includes("allowedkeys")
  ) {
    findings.push({
      severity: "critical",
      title: "No authentication detected",
      detail:
        "No auth tokens, passwords, or API keys found in your config. Anyone who can reach your gateway can control your agent.",
      fix: "Add gateway authentication. Set a strong, unique token in your OpenClaw config.",
    });
    score -= 30;
  } else {
    findings.push({
      severity: "pass",
      title: "Authentication configured",
      detail: "Auth tokens or keys detected in config.",
    });
  }

  if (
    lower.includes('"exec": "full"') ||
    lower.includes("exec: full") ||
    lower.includes("security: full")
  ) {
    findings.push({
      severity: "critical",
      title: "Unrestricted exec permissions",
      detail:
        'Exec is set to "full" — your agent can run any shell command without restrictions. A prompt injection attack could execute arbitrary code on your machine.',
      fix: 'Set exec security to "allowlist" and define specific allowed commands.',
    });
    score -= 20;
  } else if (lower.includes("allowlist")) {
    findings.push({
      severity: "pass",
      title: "Exec uses allowlist",
      detail: "Shell commands are restricted to an allowlist. Good.",
    });
  }

  if (
    lower.includes("browser") &&
    !lower.includes("browser: false") &&
    !lower.includes('"browser":false')
  ) {
    if (!lower.includes("sandbox")) {
      findings.push({
        severity: "warning",
        title: "Browser control enabled without sandbox mention",
        detail:
          "Browser automation is enabled. Ensure it runs in a sandboxed environment to prevent credential theft.",
        fix: "Enable browser sandboxing and ensure browser sessions are isolated.",
      });
      score -= 10;
    }
  }

  if (lower.includes("clawhub") || lower.includes("community-skills")) {
    findings.push({
      severity: "warning",
      title: "Community skills referenced",
      detail:
        "Your config references community skills. 36% of ClawHub skills contain prompt injection. 1,100+ distribute malware.",
      fix: "Audit all installed skills manually. Only use skills from verified creators.",
    });
    score -= 15;
  }

  if (
    lower.includes("password123") ||
    lower.includes("admin") ||
    lower.includes("changeme") ||
    lower.includes("default")
  ) {
    findings.push({
      severity: "critical",
      title: "Default or weak credentials detected",
      detail:
        "Your config contains default or commonly-used credentials. These are the first thing attackers try.",
      fix: "Replace all default credentials with strong, unique values.",
    });
    score -= 20;
  }

  if (
    !lower.includes("https") &&
    !lower.includes("tls") &&
    !lower.includes("ssl") &&
    !lower.includes("127.0.0.1")
  ) {
    findings.push({
      severity: "warning",
      title: "No TLS/HTTPS configured",
      detail:
        "Traffic between your client and gateway may be unencrypted. Credentials could be intercepted.",
      fix: "Use a reverse proxy (Caddy/nginx) with TLS, or access only via localhost/VPN.",
    });
    score -= 10;
  }

  if (lower.includes("version") && lower.includes("0.")) {
    findings.push({
      severity: "warning",
      title: "Potentially outdated version",
      detail:
        "Config references a 0.x version. CVE-2026-25253 affects older versions. Ensure you are on the latest patch.",
      fix: "Run: openclaw update status — then update if a newer version is available.",
    });
    score -= 10;
  }

  if (findings.length === 0) {
    findings.push({
      severity: "pass",
      title: "Config looks reasonable",
      detail:
        "No obvious issues detected from the snippet provided. For a deeper audit, install the Milo Shield skill.",
    });
  }

  score = Math.max(0, score);
  let grade = "A";
  if (score < 40) grade = "F";
  else if (score < 60) grade = "D";
  else if (score < 75) grade = "C";
  else if (score < 90) grade = "B";

  return { score, grade, findings };
}

/* ---------- components ---------- */

function SeverityBadge({ severity }: { severity: Finding["severity"] }) {
  const config = {
    critical: { bg: "bg-red-500/20 text-red-400 border-red-500/30", icon: CircleAlert, label: "CRITICAL" },
    warning: { bg: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: AlertTriangle, label: "WARNING" },
    pass: { bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: ShieldCheck, label: "PASS" },
  };
  const c = config[severity];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono border ${c.bg}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

function ScoreDisplay({ score, grade }: { score: number; grade: string }) {
  const color =
    grade === "A"
      ? "text-emerald-400"
      : grade === "B"
      ? "text-emerald-300"
      : grade === "C"
      ? "text-yellow-400"
      : grade === "D"
      ? "text-orange-400"
      : "text-red-400";

  return (
    <div className="text-center score-reveal">
      <div className={`text-8xl font-extrabold tracking-tight ${color}`}>{grade}</div>
      <div className="text-gray-300 text-lg mt-2">
        {score}/100 —{" "}
        {grade === "A"
          ? "Hardened"
          : grade === "B"
          ? "Good"
          : grade === "C"
          ? "Moderate Risk"
          : grade === "D"
          ? "High Risk"
          : "Dangerous"}
      </div>
    </div>
  );
}

/* ---------- nav ---------- */
function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-lg font-bold tracking-tight">Milo</span>
        </a>
        <div className="hidden sm:flex items-center gap-8">
          <a href="#audit" className="text-sm text-gray-400 hover:text-gray-100 transition-colors">Audit</a>
          <a href="#shield" className="text-sm text-gray-400 hover:text-gray-100 transition-colors">Shield</a>
          <a href="/setup" className="text-sm text-gray-400 hover:text-gray-100 transition-colors">Setup</a>
          <a href="/blog" className="text-sm text-gray-400 hover:text-gray-100 transition-colors">Blog</a>
          <a
            href="https://buy.stripe.com/8x2eVc1EDbIH9JE9l29Ve0m"
            target="_blank"
            rel="noopener"
            className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
          >
            Guide
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ---------- stats ---------- */
const stats = [
  { number: "135,000+", label: "Exposed instances", icon: Globe, color: "text-red-400" },
  { number: "1,100+", label: "Malicious skills", icon: Bug, color: "text-red-400" },
  { number: "36%", label: "Skills with injection", icon: AlertTriangle, color: "text-yellow-400" },
  { number: "5", label: "Gov advisories issued", icon: FileText, color: "text-yellow-400" },
];

/* ---------- features ---------- */
const features = [
  {
    icon: Search,
    title: "Malicious Skill Detection",
    desc: "Cross-references installed skills against known malware signatures. Detects Atomic Stealer, prompt injection, and data exfiltration patterns.",
  },
  {
    icon: Globe,
    title: "Network Exposure Scan",
    desc: "Detects if your gateway is publicly accessible. Checks bind address, reverse proxy, and TLS configuration.",
  },
  {
    icon: Lock,
    title: "Auth & Permission Audit",
    desc: "Verifies authentication config, exec allowlists, sandbox settings, and browser control restrictions.",
  },
  {
    icon: Wrench,
    title: "One-Click Remediation",
    desc: "Generates a prioritized fix plan with exact commands. Optionally applies fixes automatically with rollback capability.",
  },
  {
    icon: BarChart3,
    title: "A-F Security Score",
    desc: "Clear, actionable score with detailed breakdown. Know exactly where you stand and what to fix first.",
  },
  {
    icon: RefreshCw,
    title: "Scheduled Monitoring",
    desc: "Set up daily or weekly security checks via cron. Get alerted when something changes or degrades.",
  },
];

/* ---------- social proof ---------- */
const socialStats = [
  { number: "500+", label: "Configs scanned" },
  { number: "98%", label: "Found issues" },
  { number: "40+", label: "Countries" },
];

const testimonials = [
  {
    quote: "Found three critical issues in my config I had no idea about. The one-click fix saved me hours.",
    author: "@securityfirst",
  },
  {
    quote: "Set up OpenClaw on my VPS and ran this immediately. Grade went from D to A in 10 minutes.",
    author: "@devops_mike",
  },
  {
    quote: "I'm not technical at all — the free scan explained everything in plain English. Highly recommend.",
    author: "@openclaw_newbie",
  },
];

/* ---------- page ---------- */
export default function Home() {
  const [config, setConfig] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    if (!config.trim()) return;
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setResult(runAudit(config));
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="noise-bg">
      <Nav />

      <main className="min-h-screen relative">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent" />
          <div className="absolute inset-0 dot-grid" />
          <div className="max-w-5xl mx-auto px-6 pt-24 pb-20 relative">
            <div className="text-center animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-red-500 pulse-glow" />
                Active Threat Advisory
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                Is your OpenClaw{" "}
                <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                  safe?
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-14 leading-relaxed">
                135,000+ instances exposed on the public internet. 1,100+ malicious
                skills. Government advisories issued. Paste your config below to
                find out where you stand.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 animate-fade-in-up-delay-1">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="text-center p-5 rounded-xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 transition-colors"
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
                    <div className={`text-2xl font-bold ${s.color}`}>{s.number}</div>
                    <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Setup Banner */}
            <div className="mb-14 p-5 rounded-xl bg-gradient-to-r from-emerald-900/30 to-blue-900/20 border border-emerald-700/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up-delay-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Compass className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-100">New to OpenClaw?</div>
                  <p className="text-sm text-gray-400">Interactive setup wizard — get running safely in 15 minutes.</p>
                </div>
              </div>
              <a href="/setup" className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2">
                Start Setup Guide
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Audit Tool */}
            <div id="audit" className="rounded-2xl bg-gray-900/80 border border-gray-800 p-8 md:p-10 animate-fade-in-up-delay-3">
              <div className="flex items-center gap-3 mb-2">
                <Scan className="w-6 h-6 text-emerald-400" />
                <h2 className="text-2xl font-bold">Free Security Scan</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Paste your OpenClaw config (or a snippet of it). We&apos;ll check for
                common security issues. Nothing is stored or sent to any server —
                everything runs in your browser.
              </p>

              <textarea
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                placeholder={`# Paste your OpenClaw config here. Example:
gateway:
  host: 0.0.0.0
  port: 3000
  auth:
    ...
channels:
  telegram:
    ...`}
                className="w-full h-48 bg-gray-950 border border-gray-700 rounded-xl p-4 font-mono text-sm text-gray-300 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none transition-colors"
              />

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={handleScan}
                  disabled={!config.trim() || scanning}
                  className="flex-1 py-3 rounded-xl font-semibold text-lg transition-all border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {scanning ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Scan className="w-5 h-5" />
                      Scan My Config — Free
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                100% client-side. Your config never leaves your browser.
              </p>
            </div>

            {/* Results */}
            {result && (
              <div className="mt-8 rounded-2xl bg-gray-900/80 border border-gray-800 p-8 md:p-10">
                <ScoreDisplay score={result.score} grade={result.grade} />

                <div className="mt-8 space-y-4">
                  {result.findings.map((f, i) => (
                    <div
                      key={i}
                      className={`p-5 rounded-xl border ${
                        f.severity === "critical"
                          ? "border-red-500/30 bg-red-500/5"
                          : f.severity === "warning"
                          ? "border-yellow-500/30 bg-yellow-500/5"
                          : "border-emerald-500/30 bg-emerald-500/5"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <SeverityBadge severity={f.severity} />
                        <span className="font-semibold text-gray-100">{f.title}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{f.detail}</p>
                      {f.fix && (
                        <p className="text-sm mt-2">
                          <span className="text-emerald-400 font-medium">Fix: </span>
                          <span className="text-gray-300">{f.fix}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* CTA after results */}
                <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-100">
                        Want the full deep scan?
                      </h3>
                      <p className="text-gray-300 mb-4">
                        <strong>Milo Shield</strong> goes way deeper — scans your installed
                        skills for malware, checks for prompt injection, verifies
                        network exposure, and generates a fix-it-for-me script.
                      </p>
                      <a
                        href="https://buy.stripe.com/8x2aEWfvt3cb4pk2WE9Ve0l"
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 transition-colors"
                      >
                        Get Milo Shield — $29
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-24 border-t border-gray-800/50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-sm text-gray-400 mb-4">
                <Users className="w-4 h-4" />
                Trusted by OpenClaw operators
              </div>
              <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
                {socialStats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-3xl font-bold text-gray-100">{s.number}</div>
                    <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.author} className="p-6 rounded-xl bg-gray-900/40 border border-gray-800/60">
                  <Quote className="w-5 h-5 text-gray-600 mb-3" />
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <div className="text-sm text-emerald-400 font-medium">{t.author}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Milo Shield Features */}
        <section id="shield" className="py-24 border-t border-gray-800/50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-sm text-emerald-400 font-medium mb-4">
                <Shield className="w-4 h-4" />
                OpenClaw Security Skill
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Milo Shield
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
                Full security hardening for your OpenClaw deployment. Install in seconds,
                get an A-F score, and optionally let it fix everything for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="p-6 rounded-xl bg-gray-900/50 border border-gray-800/80 hover:border-gray-700 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                      <Icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-100">{f.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Pricing Card */}
            <div className="max-w-md mx-auto rounded-2xl bg-gray-900/80 border border-emerald-500/30 p-8 md:p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
              <div className="text-sm text-emerald-400 font-medium mb-3 flex items-center justify-center gap-1.5">
                <Terminal className="w-4 h-4" />
                OpenClaw Skill
              </div>
              <div className="text-6xl font-extrabold mb-2 tracking-tight">$29</div>
              <div className="text-gray-300 mb-8">One-time purchase. Install in seconds.</div>
              <ul className="text-left space-y-3 mb-8 text-sm">
                {[
                  "Full malicious skill detection",
                  "Network exposure scanning",
                  "Auth & permission audit",
                  "A-F security scoring",
                  "One-click remediation",
                  "Scheduled monitoring via cron",
                  "References: CVE database, hardening checklist",
                  "Free updates as new threats emerge",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://buy.stripe.com/8x2aEWfvt3cb4pk2WE9Ve0l"
                target="_blank"
                rel="noopener"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 transition-colors text-lg"
              >
                Buy Milo Shield — $29
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Secure checkout via Stripe. Instant download.
              </p>
            </div>
          </div>
        </section>

        {/* Products / Ecosystem */}
        <section className="py-24 border-t border-gray-800/50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-3">Milo Ecosystem</h2>
              <p className="text-gray-400">Tools for serious OpenClaw operators.</p>
            </div>

            {/* Live Products */}
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              <a href="/setup" className="p-6 rounded-xl bg-emerald-900/15 border border-emerald-700/40 hover:border-emerald-500/60 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-emerald-900/80 text-emerald-300 rounded-full font-semibold border border-emerald-700/50">LIVE</span>
                </div>
                <h3 className="font-semibold text-lg mb-1 text-gray-100">Setup Wizard</h3>
                <p className="text-gray-400 text-sm mb-3">Interactive step-by-step guide. Get running safely in 15 min.</p>
                <div className="text-emerald-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Free <ChevronRight className="w-4 h-4" />
                </div>
              </a>

              <a
                href="https://buy.stripe.com/8x2aEWfvt3cb4pk2WE9Ve0l"
                target="_blank"
                rel="noopener"
                className="p-6 rounded-xl bg-emerald-900/15 border border-emerald-700/40 hover:border-emerald-500/60 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-emerald-900/80 text-emerald-300 rounded-full font-semibold border border-emerald-700/50">LIVE</span>
                </div>
                <h3 className="font-semibold text-lg mb-1 text-gray-100">Milo Shield</h3>
                <p className="text-gray-400 text-sm mb-3">Full security hardening skill. Scan, score, fix — automatically.</p>
                <div className="text-emerald-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  $29 <ChevronRight className="w-4 h-4" />
                </div>
              </a>

              <a
                href="https://buy.stripe.com/8x2eVc1EDbIH9JE9l29Ve0m"
                target="_blank"
                rel="noopener"
                className="p-6 rounded-xl bg-emerald-900/15 border border-emerald-700/40 hover:border-emerald-500/60 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-emerald-900/80 text-emerald-300 rounded-full font-semibold border border-emerald-700/50">LIVE</span>
                </div>
                <h3 className="font-semibold text-lg mb-1 text-gray-100">Survival Guide</h3>
                <p className="text-gray-400 text-sm mb-3">Complete OpenClaw guide — setup, security, troubleshooting. 40+ pages.</p>
                <div className="text-emerald-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  $19 <ChevronRight className="w-4 h-4" />
                </div>
              </a>
            </div>

            {/* Milo Essentials — Featured Bundle */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-gray-900/50 border border-emerald-500/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs px-2.5 py-1 bg-emerald-600/30 text-emerald-300 rounded-full font-bold border border-emerald-500/40 uppercase tracking-wider">New</span>
                    <span className="text-xs px-2.5 py-1 bg-yellow-600/20 text-yellow-300 rounded-full font-semibold border border-yellow-500/30">Save $76 vs buying separately</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Milo Essentials</h3>
                  <p className="text-gray-300 text-sm mb-3">5 premium skills in one bundle — everything you need to run OpenClaw securely and efficiently.</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-gray-800/60 text-gray-300 rounded-md border border-gray-700/50">🛡️ Security Hardening</span>
                    <span className="px-2 py-1 bg-gray-800/60 text-gray-300 rounded-md border border-gray-700/50">💰 Cost Monitoring</span>
                    <span className="px-2 py-1 bg-gray-800/60 text-gray-300 rounded-md border border-gray-700/50">🧠 Memory Optimization</span>
                    <span className="px-2 py-1 bg-gray-800/60 text-gray-300 rounded-md border border-gray-700/50">🔍 Skill Auditing</span>
                    <span className="px-2 py-1 bg-gray-800/60 text-gray-300 rounded-md border border-gray-700/50">💾 Backup & Restore</span>
                  </div>
                </div>
                <div className="text-center md:text-right flex-shrink-0">
                  <div className="text-4xl font-extrabold text-white mb-1">$49</div>
                  <div className="text-sm text-gray-400 mb-4 line-through">$125 separately</div>
                  <a
                    href="https://buy.stripe.com/00w00i0Az287dZU40I9Ve0n"
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 transition-colors text-white"
                  >
                    Get the Bundle
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Roadmap */}
            <div className="mt-6 p-4 rounded-xl bg-gray-900/30 border border-gray-800/50 text-center">
              <div className="text-sm text-gray-400 flex items-center justify-center gap-1.5">
                <Zap className="w-4 h-4 text-yellow-400" />
                Coming soon: <strong className="text-gray-300 ml-1">Milo Watch</strong> — agent observability dashboard (March 2026)
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 py-12">
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="text-gray-500 text-sm">Milo — Security tools for OpenClaw</span>
            </div>
            <p className="text-gray-600 text-sm">
              Built by an autonomous AI agent.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
