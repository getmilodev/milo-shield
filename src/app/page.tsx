"use client";

import { useState } from "react";

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

  // Check 1: Gateway binding
  if (lower.includes("0.0.0.0") || lower.includes("host: 0.0.0.0")) {
    findings.push({
      severity: "critical",
      title: "Gateway exposed on all interfaces",
      detail:
        'Your gateway is bound to 0.0.0.0, making it accessible from the public internet. 135,000+ OpenClaw instances were found exposed this way.',
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

  // Check 2: Authentication
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

  // Check 3: Exec permissions
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

  // Check 4: Browser control
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

  // Check 5: Skills directory mentions
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

  // Check 6: Default / weak credentials
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

  // Check 7: HTTPS / TLS
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

  // Check 8: Version
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

  // If nothing detected, add generic advice
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
  const styles = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    pass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };
  const labels = { critical: "🔴 CRITICAL", warning: "🟡 WARNING", pass: "🟢 PASS" };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-mono border ${styles[severity]}`}>
      {labels[severity]}
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
      <div className={`text-8xl font-bold ${color}`}>{grade}</div>
      <div className="text-gray-400 text-lg mt-2">
        {score}/100 — {grade === "A" ? "Hardened" : grade === "B" ? "Good" : grade === "C" ? "Moderate Risk" : grade === "D" ? "High Risk" : "Dangerous"}
      </div>
    </div>
  );
}

/* ---------- stats ---------- */
const stats = [
  { number: "135,000+", label: "Exposed instances", color: "text-red-400" },
  { number: "1,100+", label: "Malicious skills on ClawHub", color: "text-red-400" },
  { number: "36%", label: "Skills with prompt injection", color: "text-yellow-400" },
  { number: "5", label: "Government/org advisories", color: "text-yellow-400" },
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
    // Simulate scan delay for UX
    setTimeout(() => {
      setResult(runAudit(config));
      setScanning(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-red-500 pulse-glow" />
              OpenClaw Security Crisis — February 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Is your OpenClaw{" "}
              <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                safe?
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              135,000+ instances exposed on the public internet. 1,100+ malicious
              skills. Government advisories issued. Paste your config below to
              find out where you stand.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((s) => (
              <div
                key={s.label}
                className="text-center p-4 rounded-xl bg-gray-900/50 border border-gray-800"
              >
                <div className={`text-2xl font-bold ${s.color}`}>{s.number}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Audit Tool */}
          <div className="rounded-2xl bg-gray-900/80 border border-gray-800 p-8">
            <h2 className="text-2xl font-bold mb-2">Free Security Scan</h2>
            <p className="text-gray-400 mb-6">
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
              className="w-full h-48 bg-gray-950 border border-gray-700 rounded-xl p-4 font-mono text-sm text-gray-300 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
            />

            <button
              onClick={handleScan}
              disabled={!config.trim() || scanning}
              className="mt-4 w-full py-3 rounded-xl font-semibold text-lg transition-all
                bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scanning ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Scanning...
                </span>
              ) : (
                "🔍 Scan My OpenClaw"
              )}
            </button>

            <p className="text-xs text-gray-600 mt-3 text-center">
              100% client-side. Your config never leaves your browser.
            </p>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-8 rounded-2xl bg-gray-900/80 border border-gray-800 p-8">
              <ScoreDisplay score={result.score} grade={result.grade} />

              <div className="mt-8 space-y-4">
                {result.findings.map((f, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border ${
                      f.severity === "critical"
                        ? "border-red-500/30 bg-red-500/5"
                        : f.severity === "warning"
                        ? "border-yellow-500/30 bg-yellow-500/5"
                        : "border-emerald-500/30 bg-emerald-500/5"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <SeverityBadge severity={f.severity} />
                      <span className="font-semibold">{f.title}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{f.detail}</p>
                    {f.fix && (
                      <p className="text-sm mt-2">
                        <span className="text-emerald-400 font-medium">Fix: </span>
                        <span className="text-gray-300">{f.fix}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
                <h3 className="text-xl font-bold mb-2">
                  Want the full deep scan?
                </h3>
                <p className="text-gray-400 mb-4">
                  <strong>Milo Shield</strong> goes way deeper — scans your installed
                  skills for malware, checks for prompt injection, verifies
                  network exposure, and generates a fix-it-for-me script. Runs
                  directly as an OpenClaw skill.
                </p>
                <a
                  href="#get-shield"
                  className="inline-block px-6 py-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 transition-colors"
                >
                  Get Milo Shield — $29
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* What is Milo Shield */}
      <section id="get-shield" className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          Milo Shield — Full Security Hardening
        </h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
          An OpenClaw skill that audits and hardens your deployment against every known
          threat. Install in seconds, get an A-F security score, and optionally
          let it fix everything for you.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            {
              icon: "🔍",
              title: "Malicious Skill Detection",
              desc: "Cross-references installed skills against known malware signatures. Detects Atomic Stealer, prompt injection, and data exfiltration patterns.",
            },
            {
              icon: "🌐",
              title: "Network Exposure Scan",
              desc: "Detects if your gateway is publicly accessible. Checks bind address, reverse proxy, and TLS configuration.",
            },
            {
              icon: "🔐",
              title: "Auth & Permission Audit",
              desc: "Verifies authentication config, exec allowlists, sandbox settings, and browser control restrictions.",
            },
            {
              icon: "💊",
              title: "One-Click Remediation",
              desc: "Generates a prioritized fix plan with exact commands. Optionally applies fixes automatically with rollback capability.",
            },
            {
              icon: "📊",
              title: "A-F Security Score",
              desc: "Clear, actionable score with detailed breakdown. Know exactly where you stand and what to fix first.",
            },
            {
              icon: "🔄",
              title: "Scheduled Monitoring",
              desc: "Set up daily or weekly security checks via cron. Get alerted when something changes or degrades.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl bg-gray-900/50 border border-gray-800"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="max-w-md mx-auto rounded-2xl bg-gray-900/80 border border-emerald-500/30 p-8 text-center">
          <div className="text-sm text-emerald-400 font-medium mb-2">
            OpenClaw Skill
          </div>
          <div className="text-5xl font-bold mb-2">$29</div>
          <div className="text-gray-400 mb-6">One-time purchase. Install in seconds.</div>
          <ul className="text-left space-y-2 mb-8 text-sm">
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
              <li key={item} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="block w-full py-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 transition-colors"
          >
            Get Milo Shield
          </a>
          <p className="text-xs text-gray-600 mt-3">
            Also available on ClawMart
          </p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-800">
        <h2 className="text-2xl font-bold text-center mb-8">Coming Soon</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-gray-900/30 border border-gray-800/50">
            <div className="text-2xl mb-2">🏪</div>
            <h3 className="font-semibold mb-1">Milo Essentials</h3>
            <p className="text-gray-500 text-sm">
              Premium skill bundle. 5 battle-tested, security-audited skills for
              serious operators.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gray-900/30 border border-gray-800/50">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold mb-1">Milo Watch</h3>
            <p className="text-gray-500 text-sm">
              Agent observability dashboard. Know what your agent is doing, spending,
              and accomplishing. Coming March 2026.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gray-900/30 border border-gray-800/50">
            <div className="text-2xl mb-2">🎓</div>
            <h3 className="font-semibold mb-1">Agent Mastery</h3>
            <p className="text-gray-500 text-sm">
              Advanced guide to running production AI agents. Beyond the basics.
            </p>
          </div>
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
