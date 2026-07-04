import type { Metadata } from "next";
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
      <body className="crt">
        <div className="scanline" />
        <MatrixBackground />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
