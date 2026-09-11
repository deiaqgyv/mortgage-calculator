import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GoogleAnalytics } from '@/components/google-analytics';
import { isLocaleSlug, localeBySlug, supportedLocaleSlugs } from '@/lib/seo';

import '../globals.css';
import '../brand.css';
import '../faq.css';
import '../stage2.css';
import '../article.css';

export const metadata: Metadata = {
  title: 'Mortgage calculator | Clear monthly payment estimates',
  description: 'Estimate mortgage payments, total interest, and the impact of extra payments with clear assumptions.',
};

export function generateStaticParams() {
  return supportedLocaleSlugs.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  const normalized = locale.toLowerCase();
  if (!isLocaleSlug(normalized)) notFound();

  return <html lang={localeBySlug[normalized]}><body>{children}<GoogleAnalytics /></body></html>;
}
