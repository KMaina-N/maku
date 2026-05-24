import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// ─── SERVER COMPONENT ─────────────────────────────────────────────────────────
// Full metadata powers SEO, Open Graph, and LLM crawlability.

export const metadata: Metadata = {
  title: "MAKU — Soulful Vocalist & Performer",
  description:
    "Maku (Chisomo Makunje) is a Zagreb-based singer blending soul, global rhythms, and theater arts. Listen to her collaborative music and explore her live performances.",
  keywords: [
    "MAKU",
    "Chisomo Makunje",
    "Zagreb music artist",
    "Soul singer Croatia",
    "global sounds",
    "RadioTeatar",
    "The Lady and the Dudes",
  ],
  openGraph: {
    title: "MAKU — Soulful Vocalist & Performer",
    description:
      "Zagreb-based singer blending soul, global rhythms, and theater arts.",
    type: "profile",
    url: "https://itsmaku.netlify.app", // Keep your domain or change to your actual URL
    images: [{ url: "/images/maku.jpeg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAKU — Soulful Vocalist & Performer",
    description:
      "Zagreb-based singer blending soul, global rhythms, and theater arts.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={bodoniModa.variable}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
