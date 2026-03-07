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
  // Title: Fokus pada 'High-End Experience' & 'Flawless execution'
  // Psikologi: Menyerang keinginan calon pengantin untuk terlihat 'Sempurna' di mata tamu.
  title: "Vittya | Pionir Digital Wedding Experience yang Berkelas & Presisi",
  
  // Description: Fokus pada 'Social Status' & 'Zero Failure'
  // Psikologi: Menghilangkan kecemasan akan momen yang berantakan (Fear of Embarrassment).
  description: "Jangan biarkan hari besar Anda menjadi biasa. Vittya menyempurnakan setiap detail pernikahan melalui teknologi cerdas, memastikan tamu merasa spesial dan Anda tetap memegang kendali penuh.",
  
  keywords: [
    "premium wedding invitation",
    "undangan digital eksklusif",
    "manajemen tamu cerdas",
    "vittya wedding ecosystem",
    "pengalaman pernikahan mewah"
  ],

  openGraph: {
    // Psikologi: Fokus pada 'Standard Baru' (Trendsetter)
    title: "Vittya: Standar Baru Pernikahan Modern & Elegan",
    description: "Satu platform untuk mengelola kebahagiaan. Dari undangan AI hingga manajemen tamu yang presisi, buat setiap detik pernikahan Anda tak terlupakan.",
    url: "https://vittya-app.vercel.app",
    siteName: "Vittya Elite",
    images: [
      {
        url: "/logo-Vittya.png", 
        width: 1200,
        height: 630,
        alt: "Vittya - The New Era of Wedding",
      },
    ],
    locale: "id_ID",
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
