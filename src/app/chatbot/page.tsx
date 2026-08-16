"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Terminal,
  Send,
  Trash2,
  Shield,
  AlertTriangle,
  Loader2,
  Sparkles,
  FileText,
  Flag,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

const quickActions = [
  { label: "Nmap Scan Guide", query: "Show me a complete Nmap scanning methodology for web pentesting" },
  { label: "Reverse Shell", query: "Give me a PHP reverse shell and explain how to set up a listener" },
  { label: "IDOR Testing", query: "Explain IDOR vulnerability with testing methodology and example" },
  { label: "Privilege Escalation", query: "Show me Linux privilege escalation techniques with examples" },
  { label: "Generate Report", query: "Generate a penetration testing report template" },
  { label: "OWASP Top 10", query: "Explain the OWASP Top 10 vulnerabilities" },
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "system",
      content: `[SHADOW v2.0] AI Cybersecurity Assistant loaded.
Type your query or use quick actions below.
${"=".repeat(40)}`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    if (!sessionActive) setSessionActive(true);
    setShowQuickActions(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const history = [...messages, userMsg].filter((m) => m.role !== "system");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message.content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error connecting to AI service. Please make sure OPENROUTER_API_KEY is set in your environment variables.\n\n**Setup:**\n1. Copy \`.env.example\` to \`.env.local\`\n2. Get a free API key from [OpenRouter](https://openrouter.ai/)\n3. Restart the dev server\n\nThe chatbot works with fallback responses for common queries even without API key.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "0",
        role: "system",
        content: `[SHADOW v2.0] Session cleared. Ready for new query.`,
        timestamp: Date.now(),
      },
    ]);
    setShowQuickActions(true);
    setSessionActive(false);
    sessionStartRef.current = Date.now();
  };

  // Extract tools used from assistant messages
  const extractTools = (): string[] => {
    const toolPatterns = [
      "nmap", "burp", "metasploit", "gobuster", "gobuster", "dirb",
      "hydra", "john", "hashcat", "sqlmap", "nikto", "wpscan",
      "netcat", "nc", "linpeas", "winpeas", "pspy", "curl", "wget",
      "python", "php", "bash", "chisel", "ligolo", "proxychains",
    ];
    const found = new Set<string>();
    for (const msg of messages) {
      const lower = msg.content.toLowerCase();
      for (const tool of toolPatterns) {
        if (lower.includes(tool)) found.add(tool);
      }
    }
    return Array.from(found).sort();
  };

  // Extract target info from user messages
  const extractTarget = (): string => {
    for (const msg of messages) {
      if (msg.role === "user") {
        const ipMatch = msg.content.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
        if (ipMatch) return ipMatch[0];
        const domainMatch = msg.content.match(/\b([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}\b/i);
        if (domainMatch) return domainMatch[0];
      }
    }
    return "N/A";
  };

  // Extract findings from conversation
  const extractFindings = (): string[] => {
    const vulnKeywords = [
      "idor", "xss", "sqli", "sql injection", "rce", "file upload",
      "path traversal", "lfi", "rfi", "ssrf", "csrf", "privilege escalation",
      "buffer overflow", "deserialization", "open redirect", "auth bypass",
      "broken access", "sensitive data", "misconfiguration",
    ];
    const found = new Set<string>();
    for (const msg of messages) {
      const lower = msg.content.toLowerCase();
      for (const vuln of vulnKeywords) {
        if (lower.includes(vuln)) found.add(vuln);
      }
    }
    return Array.from(found).sort();
  };

  const generateWriteup = () => {
    const now = new Date();
    const duration = Math.round((now.getTime() - sessionStartRef.current) / 60000);
    const tools = extractTools();
    const findings = extractFindings();
    const target = extractTarget();
    const qaPairs = messages.filter((m) => m.role !== "system");

    const questions = qaPairs
      .filter((m) => m.role === "user")
      .map((m, i) => `### Q${i + 1}: ${m.content}\n*Asked: ${new Date(m.timestamp).toLocaleString()}*`);
    const answers = qaPairs
      .filter((m) => m.role === "assistant")
      .map((m, i) => `### A${i + 1}:\n${m.content}`);

    const chatLog = messages
      .filter((m) => m.role !== "system")
      .map((m) => {
        const ts = new Date(m.timestamp).toLocaleString();
        const prefix = m.role === "user" ? "**an1en@query**" : "**shadow@response**";
        return `${prefix} [${ts}]\n${m.content}\n---\n`;
      })
      .join("\n");

    const writeup = `# Penetration Testing Report

**Target:** ${target}
**Date:** ${now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
**Author:** Anlen Jeban (an1en)
**Session Duration:** ${duration} minutes
**Total Interactions:** ${qaPairs.length}
**Classification:** Confidential

---

## 1. Executive Summary

A penetration testing engagement was conducted against the target ${target === "N/A" ? "(specified during session)" : target}. 
The assessment identified **${findings.length} vulnerability class${findings.length !== 1 ? "es" : ""}** including **${tools.length} different tools/techniques** employed during enumeration and exploitation.

**Findings Overview:** ${findings.length > 0 ? findings.map((f) => f.toUpperCase()).join(", ") : "Refer to session log for detailed findings."}
**Tools Used:** ${tools.length > 0 ? tools.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(", ") : "N/A"}

---

## 2. Scope & Methodology

### 2.1 Scope
| Item | Details |
|------|---------|
| Target(s) | ${target} |
| Assessment Type | External/Internal Penetration Test |
| Methodology | PTES / OWASP Testing Guide |

### 2.2 Methodology
1. **Reconnaissance** — Passive & active information gathering
2. **Scanning & Enumeration** — Port scanning, service detection, directory bruteforce
3. **Exploitation** — Vulnerability identification & proof of concept
4. **Privilege Escalation** — Post-exploitation & lateral movement
5. **Reporting** — Findings compilation & remediation

---

## 3. Findings & Analysis

${findings.length > 0
  ? findings.map((f, i) => `### Finding ${i + 1}: ${f.toUpperCase().replace(/_/g, " ")}\n\n**Severity:** [TBD]\n**Location:** ${target}\n**Description:** This vulnerability was identified during the assessment. Refer to the conversation log for exploitation steps and proof of concept.\n\n**Remediation:**\n- Apply security patches and updates\n- Implement input validation and output encoding\n- Follow least privilege principles\n- Conduct regular security assessments\n`).join("\n---\n\n")
  : "No specific vulnerability classes were automatically extracted. Refer to the full conversation log for detailed findings."}

---

## 4. Tools & Commands Used

${tools.length > 0
  ? `| Tool | Purpose |\n|------|---------|\n${tools.map((t) => `| ${t.charAt(0).toUpperCase() + t.slice(1)} | Refer to conversation log |`).join("\n")}`
  : "Specific tools were mentioned during the session. Refer to the conversation log."}

---

## 5. Key Commands Executed

\`\`\`
[Commands extracted from session conversation — see Q&A log below]
\`\`\`

---

## 6. Session Q&A Log

${questions.map((q, i) => `${q}\n\n${answers[i] || "*No response recorded*"}\n\n---\n`).join("\n")}

---

## 7. Full Conversation Log

${chatLog}

---

## 8. Recommendations

1. Address all identified vulnerabilities based on severity
2. Implement secure coding practices (OWASP ASVS)
3. Regular vulnerability scanning and patch management
4. Security awareness training for development teams
5. Conduct periodic penetration tests

---

## 9. Timeline

| Time | Event |
|------|-------|
| ${new Date(sessionStartRef.current).toLocaleTimeString()} | Session started |
| ${now.toLocaleTimeString()} | Assessment concluded |

---

*Report generated by SHADOW AI Assistant*
*© ${now.getFullYear()} Anlen Jeban*
*Generated: ${now.toLocaleString()}*
`;

    // Download as .md (writeup)
    const blob = new Blob([writeup], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pentest-report-${target !== "N/A" ? target : now.toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isSessionEmpty = messages.filter((m) => m.role !== "system").length === 0;

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-[#00ff41]" size={24} />
              <div>
                <h1 className="text-lg font-bold text-white">SHADOW AI — CYBERSECURITY PENTESTING ASSISTANT</h1>
                <p className="text-xs text-gray-500 font-mono">
                  <span className={`${sessionActive ? "text-[#00ff41]" : "text-gray-500"}`}>●</span>{" "}
                  {sessionActive ? "Session Active" : loading ? "Processing..." : "Ready"}
                  {sessionActive && ` • ${messages.filter((m) => m.role !== "system").length} messages`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!isSessionEmpty && (
                <button
                  onClick={generateWriteup}
                  className="hacker-btn text-xs flex items-center gap-1 px-3 py-2 border-[#00ffcc] text-[#00ffcc] hover:bg-[#00ffcc] hover:text-black"
                  title="Generate writeup from all session data"
                >
                  <FileText size={14} />
                  <span className="hidden md:inline">End Session → Writeup</span>
                </button>
              )}
              <button
                onClick={clearChat}
                className="hacker-btn text-xs flex items-center gap-1 px-3 py-2"
                title="Clear chat"
              >
                <Trash2 size={14} />
                <span className="hidden md:inline">Clear</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="terminal-box mb-4">
          <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500 border-b border-[#00ff41]/20">
            <span className="w-3 h-3 rounded-full bg-[#ff0033]" />
            <span className="w-3 h-3 rounded-full bg-[#ffcc00]" />
            <span className="w-3 h-3 rounded-full bg-[#00ff41]" />
            <span className="ml-2">~/shadow_ai.sh — interactive session</span>
            {sessionActive && (
              <span className="ml-auto text-[#00ff41] text-[10px]">
                <span className="animate-pulse">●</span> recording
              </span>
            )}
          </div>

          <div className="h-[50vh] md:h-[55vh] overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`font-mono text-sm ${
                  msg.role === "system"
                    ? "text-gray-500"
                    : msg.role === "user"
                    ? "chat-user"
                    : "chat-assistant"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {msg.role === "user" ? (
                    <>
                      <Send size={12} className="text-[#00ffcc]" />
                      <span className="text-[#00ffcc] font-bold">an1en@query:~$</span>
                    </>
                  ) : msg.role === "assistant" ? (
                    <>
                      <Terminal size={12} className="text-[#00ff41]" />
                      <span className="text-[#00ff41] font-bold">shadow@response:~$</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={12} />
                      <span className="text-gray-500">system@init:~$</span>
                    </>
                  )}
                </div>

                {msg.role === "system" || msg.role === "user" ? (
                  <div className="whitespace-pre-wrap pl-5">{msg.content}</div>
                ) : (
                  <div className="pl-5 chat-markdown prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-[#00ff41] font-mono text-sm"
              >
                <Loader2 size={14} className="animate-spin" />
                <span>shadow@think:~$ Generating response...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 font-mono">
              <Sparkles size={14} className="text-[#00ff41]" />
              <span>Quick Actions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.query)}
                  className="skill-badge text-xs cursor-pointer hover:bg-[#00ff41]/10 transition-all"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Session status — shows when active */}
        {sessionActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 glass p-3 flex items-center gap-3"
          >
            <Flag size={16} className="text-[#00ff41]" />
            <span className="text-xs text-gray-400 font-mono flex-1">
              Session recording all data. When done, click <span className="text-[#00ffcc]">End Session → Writeup</span> to generate a professional report with everything discussed.
            </span>
          </motion.div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="an1en@shadow:~$ type your command..."
            className="hacker-input flex-1 text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="hacker-btn px-4 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
