# OpenClaw Hardening Checklist

Use this as a quick reference when producing remediation plans.

## Critical (Must Fix)

- [ ] Gateway NOT bound to 0.0.0.0 (use 127.0.0.1 or reverse proxy)
- [ ] Authentication enabled and configured (not defaults)
- [ ] OpenClaw updated to latest version (patches CVE-2026-25253)
- [ ] No known malicious skills installed
- [ ] API tokens are unique, not shared, not in plaintext configs
- [ ] Browser control not exposed without authentication

## High Priority

- [ ] Exec commands use allowlist (not unrestricted)
- [ ] Sandbox enabled for tool execution
- [ ] File system access scoped to workspace (not root /)
- [ ] Elevated mode requires explicit approval
- [ ] Skills reviewed for prompt injection patterns
- [ ] Inbound messages from channels treated as untrusted metadata

## Recommended

- [ ] TLS/HTTPS configured for remote access
- [ ] Reverse proxy in front of gateway (Caddy/nginx)
- [ ] VPN or Tailscale for remote management
- [ ] Token rotation schedule established
- [ ] Disk encryption enabled (FileVault/LUKS/BitLocker)
- [ ] OS automatic security updates enabled
- [ ] Regular backups configured and tested
- [ ] Audit logging enabled
- [ ] Gateway access logs reviewed periodically

## Network-Specific

### If running on VPS:
- [ ] SSH key-only auth (no password)
- [ ] Root login disabled
- [ ] Firewall configured (ufw/iptables)
- [ ] Fail2ban or similar installed
- [ ] Non-standard SSH port (optional but reduces noise)

### If running on local machine:
- [ ] Gateway bound to localhost only
- [ ] No port forwarding to gateway port
- [ ] Host firewall enabled
- [ ] Remote access via VPN/Tailscale only

### If using Docker:
- [ ] Container not running as root
- [ ] Host filesystem not fully mounted
- [ ] Network isolation configured
- [ ] Resource limits set (CPU, memory)

## Ongoing Monitoring

- [ ] Scheduled security audit (daily or weekly via cron)
- [ ] Version check scheduled (weekly)
- [ ] Skill integrity check (detect modified skills)
- [ ] Cost/usage monitoring (detect runaway processes)
