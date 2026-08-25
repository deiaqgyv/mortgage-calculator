import MortgageCalculator from '../components/mortgage-calculator';
import type { Metadata } from 'next';
import { mortgageCalculatorAlternates, mortgageCalculatorUrl } from '../lib/seo';

export const metadata: Metadata = {
  alternates: {
    canonical: mortgageCalculatorUrl('en-us'),
    languages: mortgageCalculatorAlternates(),
  },
};

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ['WebApplication', 'WebPage'],
    name: 'MortgageBreezy Mortgage Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    inLanguage: 'en-US',
    url: mortgageCalculatorUrl('en-us'),
    isAccessibleForFree: true,
    description: 'Estimate mortgage payments, total interest, and the impact of extra payments.',
  };

  const organizationData = { '@context': 'https://schema.org', '@type': 'Organization', name: 'MortgageBreezy', url: mortgageCalculatorUrl('en-us') };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([structuredData, organizationData]) }} /><MortgageCalculator /></>;
}
