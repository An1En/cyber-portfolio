import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import MatrixBackground from "@/components/MatrixBackground";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Anlen Jeban | Cybersecurity Portfolio",
  description:
    "Cybersecurity researcher, CTF player, and full-stack developer. Specializing in penetration testing, network security, and AI-powered security tools.",
  keywords: [
    "cybersecurity",
    "penetration testing",
    "CTF",
    "ethical hacking",
    "network security",
    "portfolio",
  ],
  openGraph: {
    title: "Anlen Jeban | Cybersecurity Portfolio",
    description:
      "Cybersecurity researcher, CTF player, and full-stack developer.",
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
        <div className="scanline" />
        <MatrixBackground />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
