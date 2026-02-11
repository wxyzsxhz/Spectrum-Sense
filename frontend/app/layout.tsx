import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Baloo 2 font
const baloo2 = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kids",
});

export const metadata: Metadata = {
  title: "ASD Risk Analysis System",
  description: "Early ASD detection and child profile management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen bg-[#d0e9fc] font-kids">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
      </body>
    </html>
  );
}
