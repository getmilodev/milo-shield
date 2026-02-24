"use client";

import { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";

export function EmailCaptureModal({
  isOpen,
  onClose,
  product,
  stripeUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: string;
  stripeUrl: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);

    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: `checkout-${product}`,
          product,
        }),
      });
    } catch {
      // Don't block checkout if email capture fails
    }

    window.open(stripeUrl, "_blank");
    setLoading(false);
    onClose();
  };

  const handleSkip = () => {
    window.open(stripeUrl, "_blank");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-gray-900 border border-gray-700 p-8 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Almost there</h3>
          <p className="text-gray-400 text-sm">
            Enter your email so we can send your download link and receipt.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-700 text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors text-sm"
            autoFocus
            required
          />
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full mt-4 py-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Redirecting..." : "Continue to Checkout"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <button
          onClick={handleSkip}
          className="w-full mt-3 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Skip — go straight to checkout
        </button>

        <p className="text-xs text-gray-600 mt-4 text-center">
          No spam. Just your download link + one follow-up if you need help.
        </p>
      </div>
    </div>
  );
}

export function BuyButton({
  href,
  product,
  children,
  className,
}: {
  href: string;
  product: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)} className={className}>
        {children}
      </button>
      <EmailCaptureModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={product}
        stripeUrl={href}
      />
    </>
  );
}
