import { NextRequest, NextResponse } from "next/server";

/* 
  Email capture endpoint.
  Stores leads to a local JSON file (good enough for now — upgrade to a DB when volume demands it).
  Used for:
  - Pre-checkout email capture (abandoned cart recovery)
  - Newsletter subscribers
  - General lead tracking
*/

import { promises as fs } from "fs";
import path from "path";

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

interface Lead {
  email: string;
  source: string; // "checkout-shield", "checkout-guide", "checkout-essentials", "newsletter", etc.
  product?: string;
  timestamp: string;
  converted: boolean;
  followUpSent: boolean;
  ip?: string;
}

async function getLeads(): Promise<Lead[]> {
  try {
    const data = await fs.readFile(LEADS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveLeads(leads: Lead[]): Promise<void> {
  await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));
}

// Simple email validation
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
  const product = body.product;

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  const leads = await getLeads();

  // Check for duplicate — update source if different
  const existing = leads.find((l) => l.email === email);
  if (existing) {
    // Update with latest interest
    if (product && existing.product !== product) {
      existing.product = product;
      existing.source = source;
      existing.timestamp = new Date().toISOString();
    }
    await saveLeads(leads);
    return NextResponse.json({ ok: true, message: "Updated." });
  }

  // New lead
  leads.push({
    email,
    source,
    product,
    timestamp: new Date().toISOString(),
    converted: false,
    followUpSent: false,
    ip,
  });

  await saveLeads(leads);

  return NextResponse.json({ ok: true, message: "Saved." });
}

// GET — return lead count (public stat, no PII)
export async function GET() {
  const leads = await getLeads();
  return NextResponse.json({
    total: leads.length,
    converted: leads.filter((l) => l.converted).length,
  });
}
