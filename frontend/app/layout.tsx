import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="en" className="dark">
      <body className={`${jakarta.variable} font-sans antialiased bg-[#000000] text-white`}>
        {children}
      </body>
    </html>
  );
}
