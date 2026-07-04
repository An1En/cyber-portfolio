# SHADOW AI — Cybersecurity Portfolio & Pentesting Assistant

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06b6d4)
![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-ff6b35)

> AI-powered cybersecurity assistant with Matrix-themed portfolio, real-time pentesting chat, and automated report generation.

![Preview](./public/preview.png)

---

## Features

### 🛡️ SHADOW AI Chatbot
- Real-time AI assistant for penetration testing guidance
- Generates exploits, reverse shells, and scanning commands
- Remembers full session context
- **Auto-generates professional pentest reports** from conversation data
- Extracts target IP, tools used, vulnerabilities, and commands from session

### 👨‍💻 Portfolio
- Matrix rain animated background
- CRT scanline & glitch effects
- Glassmorphism hacker UI
- Projects, skills, certifications, and Medium writeups

### 📝 Report & Writeup Generator
- Live markdown editor with preview
- Pentest report templates
- Download as `.md` or export from chat session

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, Custom CSS animations |
| Animation | Framer Motion |
| AI API | OpenRouter (GPT-4o-mini) |
| Deployment | Vercel |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites
- Node.js 18+
- OpenRouter API key ([get free key](https://openrouter.ai/keys))

### Installation

```bash
# Clone the repository
git clone https://github.com/An1En/cyber-portfolio.git
cd cyber-portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your OpenRouter API key

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | API key from [OpenRouter](https://openrouter.ai/keys) |

> **Security:** `.env.local` is in `.gitignore` — your API key will never be committed.

---

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/An1En/cyber-portfolio)

1. Push to GitHub
2. Import repo on [Vercel](https://vercel.com/new)
3. Add `OPENROUTER_API_KEY` environment variable
4. Deploy — auto-deploys on every push

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Portfolio homepage |
| `/chatbot` | SHADOW AI pentesting assistant |
| `/writeup` | Report & writeup generator |

---

## Author

**Anlen Jeban** — [GitHub](https://github.com/An1En) · [LinkedIn](https://linkedin.com/in/an1en) · [Medium](https://medium.com/@anlenjeban7)

---

## License

MIT
