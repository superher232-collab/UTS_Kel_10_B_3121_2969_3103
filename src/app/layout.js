import { Roboto_Mono, Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "PRIMELOG — Fleet Command System",
  description:
    "PRIMELOG is an integrated platform for real-time fleet monitoring, cargo management, and operational analytics. Track vessels, optimize logistics, and manage your maritime fleet from one command center.",
  openGraph: {
    title: "PRIMELOG — Fleet Command System",
    description:
      "Real-time maritime fleet monitoring, cargo management, and operational analytics platform.",
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
      "Integrated maritime fleet command system for real-time monitoring, cargo management, and logistics optimization.",
    url: "https://primelog.vercel.app",
  };
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
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
