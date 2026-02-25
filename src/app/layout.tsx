import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atelier Motors",
  description: "Shop Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${cormorantGaramond.variable} bg-[#0A0A0A] text-[#F5F5F5] font-sans antialiased`}
      >
        <div className="flex min-h-screen">
          {/* Fixed sidebar */}
          <Sidebar />

          {/* Main content area — offset by sidebar width */}
          <main className="ml-60 flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
