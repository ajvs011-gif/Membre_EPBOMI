import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Source_Serif_4, Work_Sans } from 'next/font/google';

const policeSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--police-serif',
  display: 'swap',
});

const policeSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--police-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EPBOMI - Gestion des membres',
  description: "Application de gestion des membres de l'EPBOMI",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${policeSerif.variable} ${policeSans.variable}`}>
      <body className="min-h-screen bg-papier font-sans text-encre antialiased">
        {children}
      </body>
    </html>
  );
}
