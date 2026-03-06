import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GlobalIntelligence from '@/components/GlobalIntelligence';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'WAR DASH',
  description: 'Real-time geopolitical aggregator.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-display bg-black text-white antialiased overflow-hidden`}>
        {children}
        <GlobalIntelligence />
      </body>
    </html>
  );
}
