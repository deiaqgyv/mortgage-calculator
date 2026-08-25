# SEO foundation

## Indexable information architecture

```text
/
/{locale}/mortgage-calculator/
/{locale}/mortgage-calculator/amortization/
/{locale}/mortgage-calculator/extra-payments/
/{locale}/mortgage-calculator/affordability/
/{locale}/mortgage-calculator/methodology/
/{locale}/mortgage-calculator/legal-notice/
```

Initial locales: `en-US`, `en-GB`, `en-CA`, `fr-CA`, `de-DE`, `fr-FR`, `es-ES`.

Production canonical host: `https://mortgagebreezy.com`. Deployments may override this via `NEXT_PUBLIC_SITE_URL`; the value must use HTTPS and omit a trailing slash.

Country pages are separate products when the calculation model differs. They must not be treated as translated duplicates. Each canonical page has self-reference, a complete hreflang return set only for equivalent intent, and `x-default` pointing to the locale selector.

## Phase 1 SEO requirements

- Server-rendered title, description, H1, method summary, and visible assumptions.
- Self-referencing canonical URL.
- `lang` on the document and locale-specific currency/date formatting.
- `WebApplication`, `WebPage`, `BreadcrumbList`, and `Organization` JSON-LD where factual.
- FAQ content may be visible, but FAQPage is not treated as a guaranteed rich-result feature.
- Share pages are `noindex,follow` and canonicalize to the main calculator.
- No generated result URLs in the sitemap.
- Every country page links to methodology, legal notice, related calculators, and its equivalent locale pages.

## Content quality gate

Every indexed page must state the formula, rate convention, rounding policy, source review date, included costs, excluded costs, and that the result is an estimate rather than an offer or advice.
