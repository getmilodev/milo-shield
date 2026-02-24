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

        {/* Upsell */}
        <div className="space-y-4">
          {isGuide && (
            <div className="rounded-xl bg-gray-900/50 border border-gray-800 p-5">
              <p className="text-sm text-gray-400 mb-3">
                <strong className="text-gray-200">Want automated security?</strong> Milo Shield scans your installed skills for malware, checks network exposure, and generates fix scripts.
              </p>
              <a
                href="https://buy.stripe.com/8x2aEWfvt3cb4pk2WE9Ve0l"
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
                href="https://buy.stripe.com/8x2eVc1EDbIH9JE9l29Ve0m"
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
