import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MediFlow Nexus - Healthcare Revenue Intelligence",
  description: "Enterprise healthcare intelligence platform. Optimize revenue operations, predict denials, and accelerate startup commercialization.",
  keywords: ["healthcare", "revenue intelligence", "clinic operations", "startup GTM", "insurance verification"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={`${jakarta.variable} ${playfair.variable} font-sans antialiased bg-white text-black`}>
        {children}
      </body>
    </html>
  );
}
