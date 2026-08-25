import type { Metadata } from 'next';
import './globals.css';
import './stage2.css';
import './article.css';

export const metadata: Metadata = {
  title: 'Mortgage calculator | Clear monthly payment estimates',
  description: 'Estimate mortgage payments, total interest, and the impact of extra payments with clear assumptions.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-US"><body>{children}</body></html>;
}
