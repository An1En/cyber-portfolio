import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import MatrixBackground from "@/components/MatrixBackground";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";

export const metadata: Metadata = {
  title: "Anlen Jeban (AN1EN) — The Cyber Dossier | Offensive Red Team & Security Research",
  description:
    "Adversarial security codex by Anlen Jeban (AN1EN). Active Directory Red Team Specialist (AD-RTS), Certified Red Team Analyst (CRTA), CTF player. Proving ground writeups and offensive cyber research.",
  keywords: [
    "Anlen Jeban",
    "AN1EN",
    "cybersecurity",
    "Active Directory",
    "Red Team",
    "AD-RTS",
    "ESC1",
    "Hack The Box",
    "penetration testing",
    "Death Note",
    "Cyber Dossier",
    "CTF",
  ],
  openGraph: {
    title: "Anlen Jeban (AN1EN) — The Cyber Dossier",
    description:
      "Offensive security research, interactive target inscription, and proving ground writeups by Anlen Jeban.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-1FGFPH4EP5"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-1FGFPH4EP5');
        `}
      </Script>
      <body className="crt">
        <Preloader />
        <div className="noise-overlay" />
        <div className="scanline" />
        <MatrixBackground />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
