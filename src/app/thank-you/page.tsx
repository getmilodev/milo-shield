"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Shield,
  BookOpen,
  Download,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Terminal,
  Lock,
} from "lucide-react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product") || "guide";

  const isShield = product === "shield";
  const isGuide = product === "guide";
  const isEssentials = product === "essentials";
  const isFieldManual = product === "field-manual";
  const isAudit = product === "audit";
  const isSetup = product === "setup";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 noise-bg">
      <div className="max-w-lg w-full text-center py-20">
        {/* Success animation */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center animate-bounce">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Thank you!</h1>
        <p className="text-gray-300 text-lg mb-8">
          Your purchase was successful. Here&apos;s your download.
        </p>

        {isGuide && (
          <div className="rounded-2xl bg-gray-900/80 border border-emerald-500/30 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">The OpenClaw Survival Guide</h2>
            <p className="text-gray-400 text-sm mb-6">
              40+ pages covering setup, security, troubleshooting, and everything you need to run OpenClaw safely.
            </p>
            <a
              href="/downloads/The-OpenClaw-Survival-Guide.pdf"
              download
              className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-lg bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </a>
            <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Bookmark this page — you can always come back to re-download.
            </p>
          </div>
        )}

        {isShield && (
          <div className="rounded-2xl bg-gray-900/80 border border-emerald-500/30 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Milo Shield</h2>
            <p className="text-gray-400 text-sm mb-6">
              Your security hardening skill is ready. Download and install it in your OpenClaw instance.
            </p>
            <a
              href="/milo-shield.skill"
              download
              className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-lg bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Milo Shield (.skill)
            </a>
            <div className="mt-6 text-left rounded-xl bg-gray-950 border border-gray-800 p-4">
              <div className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Installation
              </div>
              <code className="text-sm text-emerald-400 font-mono block">
                openclaw skill install ./milo-shield.skill
              </code>
              <p className="text-xs text-gray-500 mt-2">
                Then restart your gateway. The skill will run a full security audit automatically.
              </p>
            </div>
          </div>
        )}

        {isEssentials && (
          <div className="rounded-2xl bg-gray-900/80 border border-emerald-500/30 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Milo Essentials</h2>
            <p className="text-gray-400 text-sm mb-4">
              Your premium skill bundle is ready. 5 skills included:
            </p>
            <ul className="text-left text-sm text-gray-300 space-y-2 mb-6">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Milo Shield — Security hardening</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Cost Guardian — Spending monitor</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Memory Doctor — Context optimizer</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Skill Auditor — Malware scanner</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Backup & Restore — Disaster recovery</li>
            </ul>
            <a
              href="/downloads/milo-essentials.zip"
              download
              className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-lg bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Milo Essentials (.zip)
            </a>
            <div className="mt-6 text-left rounded-xl bg-gray-950 border border-gray-800 p-4">
              <div className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Installation
              </div>
              <code className="text-sm text-emerald-400 font-mono block whitespace-pre-line">
{`unzip milo-essentials.zip -d ~/.openclaw/skills/
openclaw gateway restart`}
              </code>
              <p className="text-xs text-gray-500 mt-2">
                All 5 skills will be available immediately after restart.
              </p>
            </div>
          </div>
        )}

        {isFieldManual && (
          <div className="rounded-2xl bg-gray-900/80 border border-cyan-500/30 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">The OpenClaw Field Manual</h2>
            <p className="text-gray-400 text-sm mb-6">
              Your guide is ready. 10 chapters of production-tested configs, troubleshooting trees, and expert knowledge.
            </p>
            <a
              href="/downloads/The-OpenClaw-Field-Manual.pdf"
              download
              className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-lg bg-cyan-600 hover:bg-cyan-500 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Field Manual (PDF)
            </a>
            <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Bookmark this page for re-download access.
            </p>
          </div>
        )}

        {isAudit && (
          <div className="rounded-2xl bg-gray-900/80 border border-purple-500/30 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">AI Agent Audit</h2>
            <p className="text-gray-400 text-sm mb-6">
              Your audit is booked! We&apos;ll email you at your purchase email within 24 hours
              with a secure form to share your config files. Expect your full report within 48 hours.
            </p>
            <div className="rounded-xl bg-gray-950 border border-gray-800 p-4 text-left">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">What happens next:</h3>
              <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
                <li>Check your email for the intake form (within 24h)</li>
                <li>Share your SOUL.md, AGENTS.md, openclaw.json (secrets redacted)</li>
                <li>We analyze everything and write your report</li>
                <li>Full audit report delivered to your email (within 48h)</li>
              </ol>
            </div>
          </div>
        )}

        {isSetup && (
          <div className="rounded-2xl bg-gray-900/80 border border-amber-500/30 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Terminal className="w-7 h-7 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Done-For-You Setup</h2>
            <p className="text-gray-400 text-sm mb-6">
              Your setup is booked! We&apos;ll reach out within 24 hours to schedule
              SSH access and start building your production OpenClaw instance.
            </p>
            <div className="rounded-xl bg-gray-950 border border-gray-800 p-4 text-left">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">What happens next:</h3>
              <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
                <li>Check your email for scheduling details (within 24h)</li>
                <li>We&apos;ll need SSH access + your Google/WhatsApp accounts ready</li>
                <li>Build takes 2-3 days (you&apos;ll need 15-20 min for QR codes & OAuth)</li>
                <li>Full handover with documentation + 30 days email support</li>
              </ol>
            </div>
          </div>
        )}

        {/* Upsell */}
        <div className="space-y-4">
          {isGuide && (
            <div className="rounded-xl bg-gray-900/50 border border-gray-800 p-5">
              <p className="text-sm text-gray-400 mb-3">
                <strong className="text-gray-200">Want automated security?</strong> Milo Shield scans your installed skills for malware, checks network exposure, and generates fix scripts.
              </p>
              <a
                href="https://buy.stripe.com/6oUdR870h1YraRQ1pYfIs00"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-600/30 transition-colors"
              >
                Get Milo Shield — $29
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}

          {isShield && (
            <div className="rounded-xl bg-gray-900/50 border border-gray-800 p-5">
              <p className="text-sm text-gray-400 mb-3">
                <strong className="text-gray-200">Need the full setup guide?</strong> 40+ pages covering everything from first install to advanced config.
              </p>
              <a
                href="https://buy.stripe.com/3cI4gy4S946z5xwfgOfIs01"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-600/30 transition-colors"
              >
                Get the Survival Guide — $19
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}

          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-300 transition-colors mt-4"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to getmilo.dev
          </a>
        </div>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </main>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
