export const supportedLocaleSlugs = ['en-us', 'en-gb', 'en-ca', 'fr-ca', 'de-de', 'fr-fr', 'es-es'] as const;

export type LocaleSlug = (typeof supportedLocaleSlugs)[number];

export const localeBySlug = {
  'en-us': 'en-US',
  'en-gb': 'en-GB',
  'en-ca': 'en-CA',
  'fr-ca': 'fr-CA',
  'de-de': 'de-DE',
  'fr-fr': 'fr-FR',
  'es-es': 'es-ES',
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mortgagebreezy.com').replace(/\/$/, '');

export function isLocaleSlug(value: string): value is LocaleSlug {
  return supportedLocaleSlugs.includes(value as LocaleSlug);
}

export function mortgageCalculatorUrl(locale: LocaleSlug): string {
  return `${siteUrl}/${locale}/mortgage-calculator`;
}

export function mortgageCalculatorAlternates(): Record<string, string> {
  return {
    ...Object.fromEntries(supportedLocaleSlugs.map((locale) => [localeBySlug[locale], mortgageCalculatorUrl(locale)])),
    'x-default': `${siteUrl}/`,
  };
}
