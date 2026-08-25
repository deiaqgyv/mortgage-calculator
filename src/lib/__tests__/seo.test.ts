import { describe, expect, it } from 'vitest';
import { isLocaleSlug, localeBySlug, mortgageCalculatorAlternates, mortgageCalculatorUrl, supportedLocaleSlugs } from '../seo';

describe('SEO locale configuration', () => {
  it('uses supported route slugs and their canonical hreflang codes', () => {
    expect(supportedLocaleSlugs).toHaveLength(7);
    expect(localeBySlug['fr-ca']).toBe('fr-CA');
    expect(isLocaleSlug('de-de')).toBe(true);
    expect(isLocaleSlug('en')).toBe(false);
  });

  it('creates complete reciprocal alternates for every calculator page', () => {
    const alternates = mortgageCalculatorAlternates();
    expect(alternates['en-US']).toBe(mortgageCalculatorUrl('en-us'));
    expect(alternates['fr-CA']).toBe(mortgageCalculatorUrl('fr-ca'));
    expect(alternates['x-default']).toMatch(/\/$/);
  });
});
