import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import MatrixBackground from "@/components/MatrixBackground";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";

export const metadata: Metadata = {
  title: "Anlen Jeban (AN1EN) — The Cyber Dossier | Write the name. Root the host.",
  description:
    "Active Directory attack chains, CTF casefiles, and offensive tooling by Anlen Jeban (AN1EN). Active Directory Red Team Specialist (AD-RTS), Certified Red Team Analyst (CRTA). Rule 0: only retired or authorized targets are inscribed.",
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
    title: "Anlen Jeban (AN1EN) — Write the name. Root the host.",
    description:
      "Active Directory attack chains, CTF casefiles, and offensive tooling by Anlen Jeban (AN1EN).",
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
