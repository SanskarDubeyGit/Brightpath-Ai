import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Brightpath Ai — IT Consulting & Services',
  description: 'Modern web development, mobile apps, e-commerce, ERP solutions, and system scaling for growing businesses.',
  openGraph: {
    title: 'Brightpath Ai — IT Consulting & Services',
    description: 'Building secure, scalable software for startups, local businesses, and enterprises.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col bg-white text-brand-dark">
          {children}
        </div>
      </body>
    </html>
  );
}