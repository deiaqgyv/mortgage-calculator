import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MortgageCalculator, { type Locale } from '../../../components/mortgage-calculator';
import { localeFaq } from '../../../lib/locales';
import { isLocaleSlug, localeBySlug, mortgageCalculatorAlternates, mortgageCalculatorUrl, siteUrl, supportedLocaleSlugs } from '../../../lib/seo';

export function generateStaticParams() {
  return supportedLocaleSlugs.map((locale) => ({ locale }));
}

export function generateMetadata({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  return Promise.all([params, searchParams]).then(([{ locale }, query]) => {
    if (!isLocaleSlug(locale)) return {};
    return {
    title: `Mortgage calculator | ${localeBySlug[locale]}`,
    description: 'Estimate monthly mortgage payments, total interest, and extra payment savings with clear assumptions.',
    alternates: { canonical: mortgageCalculatorUrl(locale), languages: mortgageCalculatorAlternates() },
    robots: query.share ? { index: false, follow: true } : undefined,
  }; });
}

export default async function LocaleMortgagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const normalized = locale.toLowerCase();
  if (!isLocaleSlug(normalized)) notFound();
  const pageUrl = mortgageCalculatorUrl(normalized);
  const faq = localeFaq[localeBySlug[normalized]];
  const structuredData = [{ '@context': 'https://schema.org', '@type': ['SoftwareApplication', 'WebPage'], name: `MortgageBreezy Mortgage Calculator ${localeBySlug[normalized]}`, applicationCategory: 'FinanceApplication', operatingSystem: 'Web', isAccessibleForFree: true, inLanguage: localeBySlug[normalized], url: pageUrl }, { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) }, { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` }, { '@type': 'ListItem', position: 2, name: 'Mortgage calculator', item: pageUrl }] }, { '@context': 'https://schema.org', '@type': 'Organization', name: 'MortgageBreezy', url: siteUrl }];
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><MortgageCalculator locale={localeBySlug[normalized] as Locale} /></>;
}
