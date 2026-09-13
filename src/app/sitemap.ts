import type { MetadataRoute } from 'next';
import { mortgageCalculatorAlternates, mortgageCalculatorUrl, supportedLocaleSlugs } from '../lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = mortgageCalculatorAlternates();
  const articles = ['amortization', 'extra-payments', 'affordability', 'amortization-calculator', 'extra-payment-calculator', 'affordability-calculator', 'methodology', 'editorial-policy', 'corrections-policy', 'legal-notice', 'privacy'];
  const calculators = supportedLocaleSlugs.map((locale) => ({ url: mortgageCalculatorUrl(locale), lastModified: new Date('2026-08-25'), alternates: { languages } }));
  const content = articles.map((article) => ({ url: `${mortgageCalculatorUrl('en-us')}/${article}`, lastModified: new Date('2026-09-13') }));
  return [...calculators, ...content];
}
