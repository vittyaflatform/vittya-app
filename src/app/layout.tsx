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
  // Title: Fokus pada 'Authority' dan 'All-in-One Solution'
  title: "Vittya | The Next-Gen Digital Invitation & Wedding Management",
  
  // Description: Menonjolkan Trust (No. 1) dan Efisiensi
  description: "Platform undangan digital #1 dengan sistem Cinema-Style Seating dan AI Storyteller. Solusi modern, elegan, dan terpercaya untuk manajemen tamu pernikahan yang sempurna.",
  
  keywords: [
    "digital invitation", 
    "undangan digital premium", 
    "wedding seating chart", 
    "cinema seating wedding", 
    "AI wedding planner", 
    "manajemen tamu pernikahan",
    "vittya"
  ],

  // Open Graph: Visual Trust saat di-share
  openGraph: {
    title: "Vittya | Professional Wedding Management Platform",
    description: "Nikmati kemudahan mengatur tamu dan membuat cerita cinta unik dengan teknologi AI terbaru.",
    url: "https://vittya-app.vercel.app",
    siteName: "Vittya Platform",
    images: [
      {
        url: "/logo-Vittya.png", 
        width: 1200,
        height: 630,
        alt: "Vittya - Professional Wedding Experience",
      },
    ],
    locale: "id_ID", // Tetap id_ID untuk target pasar utama lo, tapi title sudah Universal.
    type: "website",
  },

  // Twitter Card: Biar tampilan di X/Twitter makin cakep
  twitter: {
    card: "summary_large_image",
    title: "Vittya | Modern Wedding Experience",
    description: "The most advanced digital invitation platform with Cinema Seating & AI.",
    images: ["/logo-Vittya.png"],
  },

  // Icons: Membangun trust lewat branding yang konsisten
  icons: {
    icon: "/logo-Vittya.png",
    shortcut: "/logo-Vittya.png",
    apple: "/logo-Vittya.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
