import { NextRequest, NextResponse } from "next/server";

interface AuditResult {
  score: string;
  scoreNumber: number;
  issues: AuditIssue[];
  passed: AuditCheck[];
  summary: string;
}

interface AuditIssue {
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  fix: string;
}

interface AuditCheck {
  title: string;
  description: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const config = body.config;

    if (!config || typeof config !== "object") {
      return NextResponse.json(
        { error: "Invalid config. Send your openclaw.json content as { config: {...} }" },
        { status: 400 }
      );
    }

    const result = auditConfig(config);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON. Send your openclaw.json content as { config: {...} }" },
      { status: 400 }
    );
  }
}

function auditConfig(config: Record<string, unknown>): AuditResult {
  const issues: AuditIssue[] = [];
  const passed: AuditCheck[] = [];

  // 1. Gateway host binding
  const host = config.host as string | undefined;
  if (host === "0.0.0.0" || host === "::") {
    issues.push({
      severity: "critical",
      title: "Gateway bound to all interfaces",
      description: `Your gateway is listening on ${host}, making it accessible from any network. If this machine has a public IP, anyone can control your agent.`,
      fix: 'Set "host": "127.0.0.1" in openclaw.json to bind to localhost only.',
    });
  } else {
    passed.push({
      title: "Gateway host binding",
      description: `Gateway bound to ${host || "127.0.0.1 (default)"} -- not publicly exposed.`,
    });
  }

  // 2. Auth token
  const authToken = config.authToken as string | undefined;
  if (!authToken || authToken.length < 16) {
    issues.push({
      severity: "critical",
      title: "Weak or missing auth token",
      description: "No auth token set, or token is less than 16 characters. Anyone who can reach the gateway can control it.",
      fix: 'Set "authToken" to a random string of at least 32 characters. Generate one: openssl rand -hex 32',
    });
  } else {
    passed.push({
      title: "Auth token configured",
      description: "Auth token is set and appears to be of sufficient length.",
    });
  }

  // 3. Model configuration
  const model = config.model as string | undefined;
  const defaultModel = config.defaultModel as string | undefined;
  const activeModel = model || defaultModel;
  if (!activeModel) {
    issues.push({
      severity: "medium",
      title: "No model specified",
      description: "No model configured. OpenClaw will use the default, which may be expensive (Opus).",
      fix: 'Set "model" or "defaultModel" to control which model is used. Consider "anthropic/claude-sonnet-4-6" for a good balance of capability and cost.',
    });
  } else {
    const isExpensive = activeModel.includes("opus");
    if (isExpensive) {
      passed.push({
        title: "Model configured (Opus)",
        description: `Using ${activeModel}. This is the most capable but most expensive model (~$15/M input tokens). Consider Sonnet for routine tasks.`,
      });
    } else {
      passed.push({
        title: "Model configured",
        description: `Using ${activeModel}.`,
      });
    }
  }

  // 4. WhatsApp channel security
  const whatsapp = (config.channels as Record<string, unknown>)?.whatsapp as Record<string, unknown> | undefined
    ?? (config.whatsapp as Record<string, unknown> | undefined);
  if (whatsapp) {
    const dmPolicy = whatsapp.dmPolicy as string | undefined;
    if (!dmPolicy || dmPolicy === "open") {
      issues.push({
        severity: "high",
        title: "WhatsApp DM policy is open",
        description: "Anyone who has your WhatsApp number can message your agent and it will respond. This can lead to unexpected costs and privacy issues.",
        fix: 'Set "dmPolicy": "allowlist" or "dmPolicy": "pairing" in your WhatsApp channel config.',
      });
    } else {
      passed.push({
        title: "WhatsApp DM policy restricted",
        description: `DM policy set to "${dmPolicy}".`,
      });
    }
  }

  // 5. Elevated permissions
  const elevated = config.elevated as boolean | undefined;
  const security = config.security as Record<string, unknown> | undefined;
  const execSecurity = security?.exec as string | undefined;
  if (elevated === true) {
    issues.push({
      severity: "high",
      title: "Elevated permissions enabled",
      description: "The agent can run commands with elevated (sudo/admin) privileges. This significantly increases the attack surface.",
      fix: 'Remove "elevated: true" unless you specifically need it. Use allowlists for specific commands instead.',
    });
  }

  if (execSecurity === "full") {
    issues.push({
      severity: "medium",
      title: "Unrestricted exec permissions",
      description: 'Security mode is "full" which allows the agent to run any shell command.',
      fix: 'Consider "security": { "exec": "allowlist" } with specific commands listed.',
    });
  }

  // 6. Workspace file count (token waste indicator)
  const workspace = config.workspace as Record<string, unknown> | undefined;
  const files = workspace?.files as string[] | undefined;
  if (files && files.length > 5) {
    issues.push({
      severity: "low",
      title: `${files.length} workspace files loaded at boot`,
      description: `Loading ${files.length} files every session. Each file consumes tokens. Most agents only reference 2-3 files per session.`,
      fix: "Move infrequently-used files out of auto-injection. Load them on demand instead.",
    });
  }

  // 7. Port configuration
  const port = config.port as number | undefined;
  if (port && (port === 80 || port === 443 || port === 8080)) {
    issues.push({
      severity: "medium",
      title: `Gateway on well-known port ${port}`,
      description: `Port ${port} is commonly scanned by bots. Using a non-standard port provides a small layer of obscurity.`,
      fix: "Use a non-standard port (e.g., 3007) and restrict access with a firewall.",
    });
  }

  // 8. CORS
  const cors = config.cors as Record<string, unknown> | undefined;
  if (cors) {
    const origin = cors.origin as string | undefined;
    if (origin === "*") {
      issues.push({
        severity: "medium",
        title: "CORS allows all origins",
        description: "Any website can make requests to your gateway. This could be exploited for cross-site attacks.",
        fix: 'Set specific allowed origins instead of "*".',
      });
    }
  }

  // Calculate score
  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const highCount = issues.filter((i) => i.severity === "high").length;
  const mediumCount = issues.filter((i) => i.severity === "medium").length;

  let scoreNumber = 100;
  scoreNumber -= criticalCount * 30;
  scoreNumber -= highCount * 15;
  scoreNumber -= mediumCount * 5;
  scoreNumber = Math.max(0, scoreNumber);

  let score: string;
  if (scoreNumber >= 90) score = "A";
  else if (scoreNumber >= 75) score = "B";
  else if (scoreNumber >= 60) score = "C";
  else if (scoreNumber >= 40) score = "D";
  else score = "F";

  const summary =
    issues.length === 0
      ? "Your OpenClaw configuration looks solid. No issues found."
      : `Found ${issues.length} issue${issues.length > 1 ? "s" : ""}: ${criticalCount} critical, ${highCount} high, ${mediumCount} medium, ${issues.length - criticalCount - highCount - mediumCount} low. Score: ${score} (${scoreNumber}/100).`;

  return { score, scoreNumber, issues, passed, summary };
}
