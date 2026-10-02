import type { MetadataRoute } from 'next';
import { mortgageCalculatorAlternates, mortgageCalculatorUrl, supportedLocaleSlugs } from '../lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = mortgageCalculatorAlternates();
  const articles = ['amortization', 'extra-payments', 'affordability', 'amortization-calculator', 'extra-payment-calculator', 'affordability-calculator', 'methodology', 'editorial-policy', 'corrections-policy', 'legal-notice', 'privacy'];
  const reviewed = new Date('2026-10-02');
  const calculators = supportedLocaleSlugs.map((locale) => ({ url: mortgageCalculatorUrl(locale), lastModified: reviewed, alternates: { languages } }));
  const content = [
    ...articles.map((article) => ({ url: `${mortgageCalculatorUrl('en-us')}/${article}`, lastModified: reviewed })),
    { url: `${mortgageCalculatorUrl('en-gb')}/overpayment-calculator`, lastModified: reviewed },
    { url: `${mortgageCalculatorUrl('en-gb')}/interest-only-calculator`, lastModified: reviewed },
    { url: `${mortgageCalculatorUrl('en-ca')}/accelerated-biweekly-calculator`, lastModified: reviewed },
    { url: `${mortgageCalculatorUrl('en-ca')}/gds-tds-calculator`, lastModified: reviewed },
  ];
  return [...calculators, ...content];
}
