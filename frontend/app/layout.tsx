import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MediFlow Nexus — Healthcare Revenue Intelligence",
  description: "Dual-sided healthcare intelligence platform for clinics and startups. Optimize revenue operations and commercialize faster.",
  keywords: ["healthcare", "revenue intelligence", "clinic operations", "startup GTM", "insurance verification", "prior authorization"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="bg-glow" />
        <div className="flex h-screen overflow-hidden relative z-10">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
