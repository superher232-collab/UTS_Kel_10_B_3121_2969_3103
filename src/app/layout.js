import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "PRIMELOG — Sistem Manajemen Armada",
  description:
    "Platform terpadu untuk pemantauan armada real-time, manajemen kargo, dan analitik operasional maritim.",
  openGraph: {
    title: "PRIMELOG — Sistem Manajemen Armada",
    description:
      "Pemantauan armada maritim real-time, manajemen kargo, dan analitik operasional.",
    type: "website",
    siteName: "PRIMELOG",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PRIMELOG",
    description:
      "Platform manajemen armada maritim terpadu untuk pemantauan real-time, manajemen kargo, dan optimasi logistik.",
    url: "https://primelog.vercel.app",
  };
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
