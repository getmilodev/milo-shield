---
name: milo-shield
description: >-
  Comprehensive security hardening for OpenClaw deployments. Detects exposed
  instances, malicious skills, weak authentication, missing sandboxing, prompt
  injection risks, and excessive permissions. Generates a security score (A-F),
  produces a detailed report with fix commands, and optionally applies fixes.
  Use when: user asks about OpenClaw security, wants a security audit, mentions
  CVE-2026-25253, worries about malicious skills, needs to harden their
  deployment, or mentions the OpenClaw security crisis. Also triggers on:
  "is my OpenClaw safe", "security scan", "audit my agent", "check for
  malicious skills", "harden my setup", "exposed instance", "prompt injection".
---

# Milo Shield — OpenClaw Security Hardening

## Overview

Milo Shield is a battle-tested security skill that audits and hardens OpenClaw
deployments against the threats documented in the February 2026 security crisis:
135,000+ exposed instances, 1,100+ malicious ClawHub skills, CVE-2026-25253,
and government advisories from Belgium, Cisco, Microsoft, and Snyk.

This skill goes beyond the built-in `openclaw security audit` by adding:
- Malicious skill detection (cross-references known bad skill signatures)
- Network exposure scanning (detects public-facing gateway instances)
- Permission audit (identifies over-privileged tool access)
- Prompt injection risk assessment across installed skills
- Security score (A-F) with prioritized remediation plan
- Automated fix mode with rollback capability

## Quick Start

Run the full audit:
```
Scan my OpenClaw for security issues and give me a score.
```

## Core Workflow

### Phase 1: Read-Only Assessment (no changes, no approval needed)

1. **Gather system context** — OS, privilege level, network exposure, OpenClaw version.

2. **Run built-in audit** — Execute `openclaw security audit --deep --json` and parse results.

3. **Check OpenClaw version** — Run `openclaw update status`. Flag if not on latest patch.

4. **Scan network exposure:**
   - Check gateway bind address (0.0.0.0 vs 127.0.0.1)
   - Check if gateway port is accessible from public internet
   - Linux: `ss -ltnp | grep -i openclaw`
   - macOS: `lsof -nP -iTCP -sTCP:LISTEN | grep -i node`
   - Check for reverse proxy or tunnel (Cloudflare, ngrok, Tailscale)

5. **Audit installed skills:**
   - List all installed skills: `ls -la ~/.openclaw/skills/ 2>/dev/null` and check skill directories
   - For each skill, check SKILL.md for suspicious patterns:
     - `exec` calls to external URLs
     - Instructions to disable safety features
     - Encoded/obfuscated strings
     - References to exfiltrating data
     - Requests to modify system prompt or override safety
   - Cross-reference skill names against known malicious skills list (see references/known-bad-skills.md)
   - Flag skills not from verified creators

6. **Check authentication config:**
   - Verify gateway authentication is enabled and not using defaults
   - Check for exposed API tokens in config files
   - Verify token rotation practices
   - Check if browser control is exposed without auth

7. **Check sandbox and permissions:**
   - Verify tool sandbox configuration
   - Check file system access scope
   - Audit exec permissions and allowlists
   - Check if elevated mode is restricted
   - Verify browser automation restrictions

8. **Assess prompt injection risk:**
   - Check if email/messaging channels have injection protections
   - Verify that inbound messages are treated as untrusted
   - Check if skills process external content without sanitization

### Phase 2: Generate Security Report

Produce a structured report with:

```
═══════════════════════════════════════
   MILO SHIELD — Security Report
═══════════════════════════════════════

Overall Score: [A-F]

🔴 CRITICAL (fix immediately)
  [List critical issues with fix commands]

🟡 WARNING (fix soon)
  [List warnings with fix commands]

🟢 PASSING
  [List what's configured correctly]

📊 Score Breakdown:
  Network Exposure:    [score/20]
  Authentication:      [score/20]
  Skill Safety:        [score/20]
  Sandbox/Permissions: [score/20]
  Version/Patching:    [score/20]

💊 Remediation Plan (prioritized):
  1. [Most critical fix first]
  2. [Second priority]
  ...

🕐 Estimated fix time: [X minutes]
═══════════════════════════════════════
```

#### Scoring Rubric:
- **A (90-100):** Hardened deployment. All critical controls in place.
- **B (75-89):** Good posture. Minor improvements needed.
- **C (60-74):** Moderate risk. Several issues need attention.
- **D (40-59):** High risk. Critical fixes needed.
- **F (0-39):** Dangerous. Immediate action required. Likely exposed.

Score deductions:
- Gateway bound to 0.0.0.0 without reverse proxy: -25
- No authentication configured: -30
- Known malicious skill installed: -40
- Outdated version with known CVEs: -20
- Exec without allowlist: -15
- Browser control exposed without auth: -15
- No sandbox configured: -10
- Default/weak credentials: -20
- Skills with prompt injection patterns: -10 each (max -30)

### Phase 3: Optional Remediation (requires explicit approval)

After presenting the report, offer numbered options:

1. **Fix all critical issues** (guided, step-by-step approval)
2. **Fix everything automatically** (applies all fixes, creates rollback point)
3. **Show commands only** (copy-paste ready)
4. **Export report** (save to file for later)

For each fix:
- Show exact command before execution
- Explain what it does in plain language
- Create a rollback command/backup
- Verify the fix worked after applying

### Phase 4: Schedule Ongoing Monitoring

After remediation, offer to schedule recurring audits:

1. "Schedule daily security check via cron?"
2. "Schedule weekly deep audit?"

Use cron job names: `milo-shield:daily-check`, `milo-shield:weekly-audit`

## Important Rules

- NEVER modify SSH, firewall, or OS-level settings without explicit approval.
- NEVER expose or log tokens, API keys, or credentials.
- ALWAYS show the fix plan before executing anything.
- ALWAYS create rollback points before changes.
- If unsure about a finding, flag it as "needs manual review" rather than guessing.
- The skill does NOT change the host firewall, SSH, or OS update policies — only OpenClaw configuration.
- Recommend the built-in `openclaw security audit --fix` for OpenClaw-specific safe defaults.
- For issues outside OpenClaw's scope (firewall, SSH hardening, OS updates), recommend the built-in `healthcheck` skill.

## References

- For known malicious skill signatures: read `references/known-bad-skills.md`
- For detailed CVE information: read `references/cve-details.md`
- For hardening checklist: read `references/hardening-checklist.md`
