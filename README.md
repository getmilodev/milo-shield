# Milo Shield

**Automated security hardening for OpenClaw deployments.**

Milo Shield detects exposed instances, malicious skills, weak authentication, missing sandboxing, prompt injection risks, and excessive permissions. It generates a security score (A–F), produces a detailed report with fix commands, and optionally applies fixes automatically.

Built in response to the February 2026 OpenClaw security crisis: 135,000+ exposed instances, 1,100+ malicious ClawHub skills, and CVE-2026-25253.

## What It Catches

| Category | Checks |
|----------|--------|
| **Network Exposure** | Gateway bind address, public-facing ports, reverse proxy detection |
| **Authentication** | Missing/weak auth tokens, default credentials, exposed browser control |
| **Malicious Skills** | Cross-references installed skills against known-bad signatures |
| **Sandbox & Permissions** | Tool sandbox config, file system scope, exec allowlists, elevated mode |
| **Prompt Injection** | Email/messaging injection protections, untrusted content handling |
| **Version & Patching** | Outdated OpenClaw with known CVEs |

## Quick Start

### Install as an OpenClaw Skill

```bash
git clone https://github.com/getmilodev/milo-shield.git
cp -r milo-shield/skill-source ~/.openclaw/skills/milo-shield
```

### Run It

Ask your agent:

> "Scan my OpenClaw for security issues and give me a score."

Or be specific:

> "Run Milo Shield and fix all critical issues."

## What You Get

```
═══════════════════════════════════════
   MILO SHIELD — Security Report
═══════════════════════════════════════

Overall Score: C (62/100)

🔴 CRITICAL (fix immediately)
  ✗ Gateway bound to 0.0.0.0           [-25]
    Fix: Set host: 127.0.0.1 in gateway.yaml

  ✗ No authentication configured        [-30]
    Fix: Add auth_token: <random-32-char>

🟡 WARNING (fix soon)
  ⚠ Exec mode set to "full"             [-15]
    Fix: Switch to allowlist mode

  ⚠ 2 skills with suspicious patterns   [-10]
    Details: skill-helper-v2, data-sync-pro

🟢 PASSING
  ✓ TLS configured
  ✓ No hardcoded secrets
  ✓ Browser control restricted
  ✓ Latest version installed

📊 Score Breakdown:
  Network Exposure:    5/20
  Authentication:      0/20
  Skill Safety:        10/20
  Sandbox/Permissions: 17/20
  Version/Patching:    20/20

🕐 Estimated fix time: 8 minutes
═══════════════════════════════════════
```

## Scoring

| Grade | Score | Meaning |
|-------|-------|---------|
| **A** | 90–100 | Hardened. All critical controls in place. |
| **B** | 75–89 | Good posture. Minor improvements needed. |
| **C** | 60–74 | Moderate risk. Several issues need attention. |
| **D** | 40–59 | High risk. Critical fixes needed now. |
| **F** | 0–39 | Dangerous. Likely exposed. Act immediately. |

## After the Scan

Milo Shield offers four options after presenting your report:

1. **Fix all critical issues** — guided, step-by-step with approval
2. **Fix everything automatically** — applies all fixes, creates rollback point
3. **Show commands only** — copy-paste ready, do it yourself
4. **Export report** — save to file for your records

Every fix includes a rollback command. Nothing is irreversible.

## How It Compares

| Tool | Type | Checks | Auto-Fix | Cost |
|------|------|--------|----------|------|
| `openclaw security audit` | Built-in | Basic | Yes | Free |
| [milo-scan](https://github.com/getmilodev/milo-scan) | CLI (npx) | 10 config checks | No | Free |
| **Milo Shield** (this) | OpenClaw skill | 20+ deep checks | Yes | Free |
| [Professional Audit](https://getmilo.dev/security) | Done-for-you | Full review | Yes | From $199 |

Milo Shield goes beyond `openclaw security audit` with malicious skill detection, network exposure scanning, prompt injection assessment, and prioritized remediation plans.

## Web Scanner

Don't use OpenClaw locally? Try the browser-based version at [getmilo.dev/scanner](https://getmilo.dev/scanner) — paste your config and get instant results.

## Part of the Milo Security Suite

- [**milo-scan**](https://github.com/getmilodev/milo-scan) — One-command config audit (`npx milo-scan`)
- [**Milo Watch**](https://github.com/getmilodev/milo-watch) — Daily automated monitoring (free)
- [**Milo Watch Pro**](https://github.com/getmilodev/milo-watch-pro) — Advanced monitoring with trends ($9/mo)
- [**Security Blog**](https://getmilo.dev/blog) — OpenClaw security guides and analysis
- [**AI Agent Teams**](https://getmilo.dev/agents) — Full agent teams for your business

## License

MIT

---

Built by [Milo](https://getmilo.dev) — AI security and automation for small businesses.