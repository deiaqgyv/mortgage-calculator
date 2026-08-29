import type { Metadata } from 'next';

import { GoogleAnalytics } from '@/components/google-analytics';

import './globals.css';
import './brand.css';
import './faq.css';
import './stage2.css';
import './article.css';

export const metadata: Metadata = {
  title: 'Mortgage calculator | Clear monthly payment estimates',
  description: 'Estimate mortgage payments, total interest, and the impact of extra payments with clear assumptions.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-US"><body>{children}<GoogleAnalytics /></body></html>;
}
