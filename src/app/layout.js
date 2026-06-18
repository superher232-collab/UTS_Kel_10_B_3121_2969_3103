import { Roboto_Mono, Mochiy_Pop_One } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const mochiyPopOne = Mochiy_Pop_One({
  variable: "--font-mochiy",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "PrimeLog - Fleet Command System",
  description:
    "PrimeLog adalah platform terpadu yang dirancang untuk memantau, mengelola, dan mengoptimalkan operasional armada kapal secara real-time di seluruh dunia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${robotoMono.variable} ${mochiyPopOne.variable}`}>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
