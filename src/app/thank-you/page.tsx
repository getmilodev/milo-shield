"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product") || "guide";

  const isShield = product === "shield";
  const isGuide = product === "guide";

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Success animation */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-4xl animate-bounce">
            ✓
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Thank you!</h1>
        <p className="text-gray-400 text-lg mb-8">
          Your purchase was successful. Here&apos;s your download.
        </p>

        {isGuide && (
          <div className="rounded-2xl bg-gray-900/80 border border-emerald-500/30 p-8 mb-8">
            <div className="text-5xl mb-4">📘</div>
            <h2 className="text-2xl font-bold mb-2">The OpenClaw Survival Guide</h2>
            <p className="text-gray-400 text-sm mb-6">
              40+ pages covering setup, security, troubleshooting, and everything you need to run OpenClaw safely.
            </p>
            <a
              href="/downloads/The-OpenClaw-Survival-Guide.pdf"
              download
              className="inline-block w-full py-4 rounded-xl font-semibold text-lg bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              ⬇️ Download PDF
            </a>
            <p className="text-xs text-gray-600 mt-3">
              Bookmark this page — you can always come back to re-download.
            </p>
          </div>
        )}

        {isShield && (
          <div className="rounded-2xl bg-gray-900/80 border border-emerald-500/30 p-8 mb-8">
            <div className="text-5xl mb-4">🛡️</div>
            <h2 className="text-2xl font-bold mb-2">Milo Shield</h2>
            <p className="text-gray-400 text-sm mb-6">
              Your security hardening skill is ready. Download and install it in your OpenClaw instance.
            </p>
            <a
              href="/milo-shield.skill"
              download
              className="inline-block w-full py-4 rounded-xl font-semibold text-lg bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              ⬇️ Download Milo Shield (.skill)
            </a>
            <div className="mt-6 text-left rounded-xl bg-gray-950 border border-gray-800 p-4">
              <p className="text-sm font-semibold text-gray-300 mb-2">Installation:</p>
              <code className="text-xs text-emerald-400 block">
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
                href="https://buy.stripe.com/3cIcN4ab9aEDdZUeFm9Ve0j"
                target="_blank"
                rel="noopener"
                className="inline-block px-5 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-600/30 transition-colors"
              >
                Get Milo Shield — $29 →
              </a>
            </div>
          )}

          {isShield && (
            <div className="rounded-xl bg-gray-900/50 border border-gray-800 p-5">
              <p className="text-sm text-gray-400 mb-3">
                <strong className="text-gray-200">Need the full setup guide?</strong> 40+ pages covering everything from first install to advanced config.
              </p>
              <a
                href="https://buy.stripe.com/eVqfZg5UT2878FA8gY9Ve0k"
                target="_blank"
                rel="noopener"
                className="inline-block px-5 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-600/30 transition-colors"
              >
                Get the Survival Guide — $19 →
              </a>
            </div>
          )}

          <a
            href="/"
            className="inline-block text-gray-500 text-sm hover:text-gray-300 transition-colors mt-4"
          >
            ← Back to getmilo.dev
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
