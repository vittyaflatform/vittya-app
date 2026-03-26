import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vittya | Pionir Digital Wedding Experience",
  description: "Vittya menyempurnakan setiap detail pernikahan melalui teknologi cerdas.",
  icons: { icon: "/logo-Vittya.png", apple: "/logo-Vittya.png" },
};

export default function RootLayout({
  children,
  modal, // Slot ini harus sama dengan nama folder @modal
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-emerald-100`}>
        {/* Halaman utama */}
        {children}

        {/* Slot Modal/Overlay */}
        {modal}
      </body>
    </html>
  );
}