"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── types ─── */
type Platform = "mac" | "windows" | "linux-vps" | "docker" | "managed" | null;
type Experience = "beginner" | "intermediate" | "advanced" | null;
type UseCase = "personal" | "business" | "dev" | null;

interface Step {
  id: string;
  title: string;
  subtitle?: string;
}

const STEPS: Step[] = [
  { id: "welcome", title: "Let's Get You Set Up", subtitle: "Interactive OpenClaw setup guide — pick your path, get exact commands." },
  { id: "experience", title: "How Technical Are You?", subtitle: "No judgment. This helps us give the right instructions." },
  { id: "usecase", title: "What Will You Use It For?", subtitle: "This helps us recommend the right configuration." },
  { id: "platform", title: "Where Will It Run?", subtitle: "Choose your deployment platform." },
  { id: "install", title: "Installation", subtitle: "Copy-paste these commands. That's it." },
  { id: "model", title: "Connect Your AI Model", subtitle: "The brain of your agent." },
  { id: "channel", title: "Connect a Channel", subtitle: "How you'll talk to your agent." },
  { id: "identity", title: "Give It a Personality", subtitle: "The secret to a useful agent." },
  { id: "security", title: "Lock It Down", subtitle: "Don't skip this. Seriously." },
  { id: "done", title: "You're Live! 🚀", subtitle: "Your agent is running. Here's what to do next." },
];

/* ─── main component ─── */
export default function SetupWizard() {
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState<Platform>(null);
  const [experience, setExperience] = useState<Experience>(null);
  const [useCase, setUseCase] = useState<UseCase>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const current = STEPS[step];
  const canNext = () => {
    if (step === 1) return experience !== null;
    if (step === 2) return useCase !== null;
    if (step === 3) return platform !== null;
    return true;
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative group">
      <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-green-400 overflow-x-auto font-mono">
        {code}
      </pre>
      <button
        onClick={() => copy(code, id)}
        className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
      >
        {copied === id ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );

  /* ─── step content ─── */
  const renderStep = () => {
    switch (current.id) {
      case "welcome":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "🔒", stat: "135,000+", label: "exposed instances found" },
                { icon: "⏱️", stat: "~15 min", label: "to get set up properly" },
                { icon: "🛡️", stat: "10-point", label: "security checklist included" },
              ].map((s) => (
                <div key={s.label} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-xl font-bold text-emerald-400">{s.stat}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Most OpenClaw guides are either too technical, too hand-wavy, or already outdated. 
              This wizard walks you through everything step-by-step — tailored to your exact setup. 
              You'll have a working, secure OpenClaw agent in about 15 minutes.
            </p>
            <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 text-sm text-yellow-200">
              <strong>⚠️ Already running OpenClaw?</strong> Check if your instance is secure first → {" "}
              <Link href="/" className="text-emerald-400 underline hover:text-emerald-300">Free Security Audit</Link>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="grid gap-4">
            {([
              { val: "beginner" as Experience, icon: "🌱", title: "Beginner", desc: "I've used ChatGPT/Claude but never set up my own AI. I'm not really a coder." },
              { val: "intermediate" as Experience, icon: "🔧", title: "Somewhat Technical", desc: "I can use the terminal, install packages, maybe write basic scripts." },
              { val: "advanced" as Experience, icon: "⚡", title: "Developer", desc: "I'm comfortable with CLI, Docker, SSH, VPS management, Node.js." },
            ]).map((opt) => (
              <button
                key={opt.val}
                onClick={() => setExperience(opt.val)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  experience === opt.val
                    ? "border-emerald-500 bg-emerald-900/20 ring-1 ring-emerald-500"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <div className="font-semibold">{opt.title}</div>
                    <div className="text-sm text-gray-400">{opt.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case "usecase":
        return (
          <div className="grid gap-4">
            {([
              { val: "personal" as UseCase, icon: "🏠", title: "Personal Assistant", desc: "Email management, calendar, reminders, research, smart home." },
              { val: "business" as UseCase, icon: "💼", title: "Business Automation", desc: "Customer support, content creation, marketing, sales outreach." },
              { val: "dev" as UseCase, icon: "💻", title: "Development & Coding", desc: "Coding agent, CI/CD helper, code review, documentation, DevOps." },
            ]).map((opt) => (
              <button
                key={opt.val}
                onClick={() => setUseCase(opt.val)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  useCase === opt.val
                    ? "border-emerald-500 bg-emerald-900/20 ring-1 ring-emerald-500"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <div className="font-semibold">{opt.title}</div>
                    <div className="text-sm text-gray-400">{opt.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case "platform":
        return (
          <div className="space-y-4">
            {experience === "beginner" && (
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-sm text-blue-200">
                💡 <strong>Our recommendation:</strong> Start with <strong>Mac (local)</strong> if you have one, or <strong>Managed Hosting</strong> if you want the easiest path.
              </div>
            )}
            <div className="grid gap-3">
              {([
                { val: "mac" as Platform, icon: "🍎", title: "Mac (Local)", desc: "Easiest self-hosted. Runs on your machine.", diff: "Easy", cost: "$0 + API" },
                { val: "windows" as Platform, icon: "🪟", title: "Windows (WSL2)", desc: "Requires WSL2 setup first, then same as Linux.", diff: "Medium", cost: "$0 + API" },
                { val: "linux-vps" as Platform, icon: "🖥️", title: "Linux / VPS", desc: "Always-on. Great for production. DigitalOcean, Hetzner, etc.", diff: "Medium", cost: "$5-20/mo + API" },
                { val: "docker" as Platform, icon: "🐳", title: "Docker", desc: "Containerized. Maximum isolation.", diff: "Medium", cost: "$0-20/mo + API" },
                { val: "managed" as Platform, icon: "☁️", title: "Managed Hosting", desc: "Someone else handles setup. SimpleClaw, Clawctl, etc.", diff: "Easy", cost: "$20-50/mo + API" },
              ]).map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setPlatform(opt.val)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    platform === opt.val
                      ? "border-emerald-500 bg-emerald-900/20 ring-1 ring-emerald-500"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{opt.title}</div>
                      <div className="text-sm text-gray-400">{opt.desc}</div>
                    </div>
                    <div className="text-right text-xs">
                      <div className={`${opt.diff === "Easy" ? "text-emerald-400" : "text-yellow-400"}`}>{opt.diff}</div>
                      <div className="text-gray-500">{opt.cost}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "install":
        return (
          <div className="space-y-6">
            {platform === "mac" && (
              <>
                <p className="text-gray-300 text-sm">Three commands. About 5 minutes.</p>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1 font-semibold">1. Install Homebrew (skip if you have it)</div>
                    <CodeBlock code={`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`} id="brew" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1 font-semibold">2. Install Node.js + OpenClaw</div>
                    <CodeBlock code={`brew install node@22\nnpm install -g openclaw`} id="install-mac" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1 font-semibold">3. Run setup + auto-fix</div>
                    <CodeBlock code={`openclaw setup\nopenclaw doctor --fix`} id="setup-mac" />
                  </div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-300">
                  <strong>If it fails:</strong> Run <code className="text-emerald-400">xcode-select --install</code> first, then retry.
                </div>
              </>
            )}
            {platform === "windows" && (
              <>
                <p className="text-gray-300 text-sm">Windows needs WSL2 first. About 15 minutes total (includes restart).</p>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1 font-semibold">1. Install WSL2 (open PowerShell as Administrator)</div>
                    <CodeBlock code={`wsl --install`} id="wsl" />
                    <p className="text-xs text-gray-500 mt-1">Restart your computer after this completes.</p>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1 font-semibold">2. Open Ubuntu terminal, install Node.js + OpenClaw</div>
                    <CodeBlock code={`sudo apt update && sudo apt install -y build-essential curl\ncurl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -\nsudo apt-get install -y nodejs\nnpm install -g openclaw`} id="install-win" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1 font-semibold">3. Run setup + auto-fix</div>
                    <CodeBlock code={`openclaw setup\nopenclaw doctor --fix`} id="setup-win" />
                  </div>
                </div>
              </>
            )}
            {platform === "linux-vps" && (
              <>
                <p className="text-gray-300 text-sm">SSH into your server and run these commands. About 10 minutes.</p>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1 font-semibold">1. System prep + Node.js</div>
                    <CodeBlock code={`sudo apt update && sudo apt install -y build-essential curl\ncurl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -\nsudo apt-get install -y nodejs`} id="prep-linux" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1 font-semibold">2. Install OpenClaw</div>
                    <CodeBlock code={`npm install -g openclaw\nopenclaw setup`} id="install-linux" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1 font-semibold">3. Lock down gateway + start as service</div>
                    <CodeBlock code={`openclaw config set gateway.host 127.0.0.1\nopenclaw doctor --fix\nopenclaw gateway start`} id="lock-linux" />
                  </div>
                </div>
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-sm text-red-200">
                  🚨 <strong>Critical:</strong> The first command in step 3 locks your gateway to localhost. Without this, your agent is exposed to the entire internet. Don't skip it.
                </div>
              </>
            )}
            {platform === "docker" && (
              <>
                <p className="text-gray-300 text-sm">One command to run. Make sure Docker is installed.</p>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1 font-semibold">1. Pull and run</div>
                    <CodeBlock code={`docker run -d \\\n  --name openclaw \\\n  --restart unless-stopped \\\n  -v ~/.openclaw:/root/.openclaw \\\n  -p 127.0.0.1:3456:3456 \\\n  openclaw/openclaw:latest`} id="docker-run" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1 font-semibold">2. Run setup inside container</div>
                    <CodeBlock code={`docker exec -it openclaw openclaw setup\ndocker exec -it openclaw openclaw doctor --fix`} id="docker-setup" />
                  </div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 text-sm text-yellow-200">
                  ⚠️ Note the <code>127.0.0.1:</code> prefix on the port. This binds to localhost only. Never use <code>-p 3456:3456</code> without it.
                </div>
              </>
            )}
            {platform === "managed" && (
              <>
                <p className="text-gray-300 text-sm">No terminal needed. Pick a provider and sign up.</p>
                <div className="space-y-3">
                  {[
                    { name: "SimpleClaw", price: "From $15/mo", url: "simpleclaw.com", note: "Most popular. $15K+ MRR." },
                    { name: "Clawctl", price: "From $10/mo", url: "clawctl.com", note: "Developer-friendly." },
                    { name: "hostmenow", price: "From $20/mo", url: "hostmenow.ai", note: "Includes setup help." },
                  ].map((p) => (
                    <div key={p.name} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{p.name}</div>
                          <div className="text-xs text-gray-400">{p.note}</div>
                        </div>
                        <div className="text-sm text-emerald-400">{p.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">After signing up, they'll handle installation. Skip to the <strong>model connection</strong> step.</p>
              </>
            )}
          </div>
        );

      case "model":
        return (
          <div className="space-y-5">
            <p className="text-gray-300 text-sm">Your agent needs an AI model to think. We recommend starting with Claude Sonnet — best balance of quality and cost.</p>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-400 mb-1 font-semibold">1. Get an API key from Anthropic</div>
                <a href="https://console.anthropic.com/" target="_blank" rel="noopener" className="inline-block px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                  Open console.anthropic.com →
                </a>
                <p className="text-xs text-gray-500 mt-1">Sign up → API Keys → Create Key → Copy it</p>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1 font-semibold">2. Connect the model</div>
                <CodeBlock code={`openclaw models auth setup-token\n# Paste your API key when prompted\n\n# Verify it works:\nopenclaw models test`} id="model-setup" />
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="text-sm font-semibold mb-2">Model Comparison</div>
              <div className="space-y-2 text-sm">
                {[
                  { name: "Claude Sonnet 4.5", speed: "Fast", cost: "~$3/M tokens", rec: true, note: "Best starting point" },
                  { name: "Claude Opus 4.6", speed: "Slow", cost: "~$15/M tokens", rec: false, note: "Smartest, most expensive" },
                  { name: "Claude Haiku 4.5", speed: "Very Fast", cost: "~$0.25/M tokens", rec: false, note: "Cheap, good for simple tasks" },
                  { name: "GPT-4o", speed: "Fast", cost: "~$2.5/M tokens", rec: false, note: "Good alternative" },
                ].map((m) => (
                  <div key={m.name} className={`flex items-center justify-between p-2 rounded ${m.rec ? "bg-emerald-900/20 border border-emerald-800" : ""}`}>
                    <div className="flex items-center gap-2">
                      {m.rec && <span className="text-emerald-400 text-xs">★ Recommended</span>}
                      <span className={m.rec ? "text-white font-medium" : "text-gray-300"}>{m.name}</span>
                    </div>
                    <div className="text-xs text-gray-400">{m.speed} · {m.cost}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "channel":
        return (
          <div className="space-y-5">
            <p className="text-gray-300 text-sm">Channels are how you talk to your agent. Start with one — you can add more later.</p>
            <div className="space-y-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📱</span>
                  <span className="font-semibold">Telegram</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-900 text-emerald-300 rounded-full">Easiest</span>
                </div>
                <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside mb-3">
                  <li>Open Telegram, search for <code className="text-emerald-400">@BotFather</code></li>
                  <li>Send <code className="text-emerald-400">/newbot</code></li>
                  <li>Give it a name and username</li>
                  <li>Copy the API token</li>
                </ol>
                <CodeBlock code={`openclaw channels add telegram\n# Paste the token when prompted\n\n# Test it:\nopenclaw channels test telegram`} id="telegram" />
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">💬</span>
                  <span className="font-semibold">Discord</span>
                </div>
                <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside mb-3">
                  <li>Go to <a href="https://discord.com/developers/applications" target="_blank" className="text-emerald-400 underline">Discord Developer Portal</a></li>
                  <li>New Application → Bot → Reset Token → Copy</li>
                  <li>Enable Message Content Intent under Bot settings</li>
                  <li>Invite to your server with the OAuth2 URL generator</li>
                </ol>
                <CodeBlock code={`openclaw channels add discord\n# Paste the bot token when prompted`} id="discord" />
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📞</span>
                  <span className="font-semibold">WhatsApp</span>
                  <span className="text-xs px-2 py-0.5 bg-yellow-900 text-yellow-300 rounded-full">Requires QR scan</span>
                </div>
                <CodeBlock code={`openclaw channels add whatsapp\n# Scan QR code with your phone\n# Note: Session expires every ~14 days`} id="whatsapp" />
              </div>
            </div>
          </div>
        );

      case "identity":
        return (
          <div className="space-y-5">
            <p className="text-gray-300 text-sm">This is the difference between a generic chatbot and a useful assistant. Create a SOUL.md file:</p>
            <CodeBlock code={`# Create your agent's identity file
cat > ~/.openclaw/SOUL.md << 'EOF'
# Who You Are

You are Atlas, a personal AI assistant for [YOUR NAME].

## Personality
- Direct and concise — don't waste words
- Proactive — suggest next steps without being asked
- Honest — say "I don't know" rather than making things up

## What You Do
- Check my email and flag what's important
- Help me write and edit content
- Research topics I'm working on
- Manage my calendar and remind me of things

## What You Don't Do  
- Never send emails without my explicit approval
- Never make purchases or financial transactions
- Never share my personal information with anyone
EOF`} id="soul" />
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm">
              <div className="font-semibold mb-2">Pro Tips</div>
              <ul className="space-y-1 text-gray-300">
                <li>• <strong>Be specific.</strong> "Check email every 2 hours" beats "help with email."</li>
                <li>• <strong>Set boundaries.</strong> What it should NOT do matters more than what it should.</li>
                <li>• <strong>Give it a name.</strong> Silly? Maybe. But it changes how you interact with it.</li>
                <li>• <strong>Iterate.</strong> Your first SOUL.md won't be perfect. Update it as you learn what works.</li>
              </ul>
            </div>
            {useCase === "business" && (
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 text-sm text-blue-200">
                💼 For business use, add sections for: brand voice, customer interaction rules, escalation procedures, and data handling policies.
              </div>
            )}
          </div>
        );

      case "security":
        return (
          <div className="space-y-5">
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 text-sm text-red-200">
              🚨 <strong>135,000+ OpenClaw instances</strong> have been found exposed on the internet. Don't be one of them.
            </div>
            <p className="text-gray-300 text-sm">Run this quick security check. It takes 30 seconds:</p>
            <CodeBlock code={`# 1. Make sure gateway is locked to localhost
openclaw config set gateway.host 127.0.0.1

# 2. Enable authentication  
openclaw config set gateway.auth true

# 3. Check for known vulnerabilities
openclaw update status

# 4. Run full security audit
openclaw doctor --fix

# 5. Verify nothing is exposed
openclaw status --all`} id="security" />
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="font-semibold text-sm mb-3">Quick Security Checklist</div>
              <div className="space-y-2">
                {[
                  "Gateway bound to 127.0.0.1 (not 0.0.0.0)",
                  "Authentication token is set and strong",
                  "Running latest OpenClaw version",
                  "Exec permissions set to 'allowlist' not 'full'",
                  "No suspicious skills installed",
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-600 text-emerald-500 focus:ring-emerald-500" />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div className="text-center">
              <Link href="/" className="inline-block px-4 py-2 text-sm text-emerald-400 border border-emerald-700 rounded-lg hover:bg-emerald-900/30 transition-colors">
                🔍 Run Free Security Audit →
              </Link>
            </div>
          </div>
        );

      case "done":
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl">🎉</div>
            <p className="text-lg text-gray-200">Your OpenClaw agent is running. Send it a message through your channel and watch it respond.</p>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-left">
              <div className="font-semibold mb-3">What to Do Next</div>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex gap-3">
                  <span className="text-emerald-400 font-bold">1.</span>
                  <div><strong>Send your first real task</strong> — not "hello" but something useful: "Summarize the top 3 news stories about [topic]"</div>
                </div>
                <div className="flex gap-3">
                  <span className="text-emerald-400 font-bold">2.</span>
                  <div><strong>Install 2-3 skills</strong> — web search, calendar, and email are the essentials</div>
                </div>
                <div className="flex gap-3">
                  <span className="text-emerald-400 font-bold">3.</span>
                  <div><strong>Set up memory</strong> — create <code className="text-emerald-400">~/.openclaw/MEMORY.md</code> with your key context</div>
                </div>
                <div className="flex gap-3">
                  <span className="text-emerald-400 font-bold">4.</span>
                  <div><strong>Run a security audit</strong> — use our <Link href="/" className="text-emerald-400 underline">free tool</Link> or install <strong>Milo Shield</strong> for deep protection</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/" className="block p-4 bg-emerald-900/30 border border-emerald-700 rounded-xl hover:bg-emerald-900/40 transition-colors">
                <div className="text-lg mb-1">🛡️ Free Security Audit</div>
                <div className="text-sm text-gray-400">Check if your config is safe</div>
              </Link>
              <a href="https://discord.com/invite/clawd" target="_blank" rel="noopener" className="block p-4 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors">
                <div className="text-lg mb-1">💬 Join the Community</div>
                <div className="text-sm text-gray-400">Get help from other users</div>
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* header */}
      <header className="border-b border-gray-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200">
            ← Milo Shield
          </Link>
          <div className="text-xs text-gray-500">
            Step {step + 1} of {STEPS.length}
          </div>
        </div>
      </header>

      {/* progress bar */}
      <div className="w-full bg-gray-900">
        <div
          className="h-1 bg-emerald-500 transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{current.title}</h1>
            {current.subtitle && <p className="text-gray-400 text-sm mt-1">{current.subtitle}</p>}
          </div>
          {renderStep()}
        </div>
      </main>

      {/* navigation */}
      <footer className="border-t border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 text-sm rounded-lg border border-gray-700 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="px-6 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          ) : (
            <Link
              href="/"
              className="px-6 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              Run Security Audit →
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}
