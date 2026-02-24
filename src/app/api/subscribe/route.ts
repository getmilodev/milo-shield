import { NextRequest, NextResponse } from "next/server";

/* 
  Email capture endpoint.
  Stores leads by sending them to a Milo webhook endpoint on the home server.
  Falls back to Stripe customer creation if webhook fails.
  
  Used for:
  - Pre-checkout email capture (abandoned cart recovery)
  - Newsletter subscribers
  - General lead tracking
*/

// Webhook URL on the home server to store leads
const WEBHOOK_URL = process.env.LEADS_WEBHOOK_URL || "";
// Milo's Stripe key for creating customers as backup
const STRIPE_KEY = process.env.STRIPE_KEY_MILO || "";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

// Rate limit: max 5 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

async function storeViaStripe(email: string, product: string, source: string): Promise<boolean> {
  if (!STRIPE_KEY) return false;
  try {
    const res = await fetch("https://api.stripe.com/v1/customers", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email,
        "metadata[source]": source,
        "metadata[product]": product,
        "metadata[type]": "lead",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function storeViaWebhook(email: string, product: string, source: string, ip: string): Promise<boolean> {
  if (!WEBHOOK_URL) return false;
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, product, source, ip, timestamp: new Date().toISOString() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  let body: { email?: string; source?: string; product?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const source = body.source || "unknown";
  const product = body.product || "unknown";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  // Try webhook first, fall back to Stripe customer creation
  const webhookOk = await storeViaWebhook(email, product, source, ip);
  if (!webhookOk) {
    await storeViaStripe(email, product, source);
  }

  // Always return success to the user — don't block checkout over storage failures
  return NextResponse.json({ ok: true, message: "Saved." });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
