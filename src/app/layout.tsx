import type { Metadata, Viewport } from "next";
import { DM_Mono, Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/chrome/Header";
import Footer from "@/components/chrome/Footer";
import Cursor from "@/components/chrome/Cursor";
import ScrollProgress from "@/components/chrome/ScrollProgress";
import PageTransition from "@/components/chrome/PageTransition";
import Reveals from "@/components/chrome/Reveals";
import Toaster from "@/components/chrome/Toaster";

const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vicky Nayak — Creative Developer",
  description: "Portfolio of Vicky Nayak — developer exploring creative frontend, AI-powered applications, and digital experiences.",
};

export const viewport: Viewport = {
  themeColor: "#faf7f1",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        <ScrollProgress />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Reveals />
        <PageTransition />
        <Cursor />
        <Toaster />
      </body>
    </html>
  );
}
