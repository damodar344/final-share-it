import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShareIT - Student Housing Platform",
  description: "Find and share student accommodations near your campus",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </NextAuthProvider>
        <Script
          src="//code.tidio.co/6qtknoim99wltuofvkwyezpyop80kzzj.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

import "./globals.css";
