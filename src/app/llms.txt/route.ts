import { siteUrl, supportedLocaleSlugs } from '../../lib/seo';

export function GET() {
  const primary = `${siteUrl}/en-us/mortgage-calculator/`;
  const localeLinks = supportedLocaleSlugs.map((locale) => `- [Mortgage calculator - ${locale}](${siteUrl}/${locale}/mortgage-calculator/): Localized mortgage payment, amortization and transaction-cost estimate.`).join('\n');
  const body = `# MortgageBreezy

> MortgageBreezy is a free, browser-based mortgage calculator for the United States, United Kingdom, Canada, Germany, France and Spain. It explains payment assumptions, amortization, extra-payment effects and supported local transaction-cost estimates.

## Primary calculator
- [Mortgage calculator](${primary}): Calculate principal and interest, see the amortization schedule, compare a monthly extra payment and export your estimate.

## Localized calculators
${localeLinks}

## Guides and worked examples
- [Amortization calculator](${primary}amortization-calculator/): Interactive full payment schedule with principal, interest and balance by period.
- [Extra payment calculator](${primary}extra-payment-calculator/): Interactive comparison of base payments and additional monthly principal.
- [Mortgage amortization](${primary}amortization/): How scheduled payments split into principal and interest, with an explicit 30-year worked example.
- [Extra mortgage payments](${primary}extra-payments/): How additional principal can reduce interest and payoff time, including method and lender-policy limits.
- [Mortgage affordability checklist](${primary}affordability/): Costs to consider beyond a loan payment and what the site does not assess.
- [Calculation methodology](${primary}methodology/): Rate conventions, data versions, primary sources and calculation limits.
- [Editorial and calculation review policy](${primary}editorial-policy/): Publisher responsibility, review steps and the current professional-review boundary.
- [Corrections policy](${primary}corrections-policy/): How calculation and source errors are reported, verified and corrected.

## Key facts and limits
- All results are educational estimates, not loan offers, tax opinions, legal advice or financial advice.
- Calculations run in the browser; share links encode the selected inputs in the URL.
- Country and transaction-cost rules show their effective date and review date in the calculator.
- Content is published by MortgageBreezy as an organization. The site does not currently claim review by a licensed mortgage, legal, tax or financial professional.
- Guides were last reviewed on 2026-09-13. Local-rule records display their own effective and review dates.
- Verify current rates, eligibility and fees with a lender and relevant local authority before relying on an estimate.

## Citation guidance
- Cite a country calculator together with its visible inputs, assumptions, exclusions and data date.
- Do not present a calculator result as a quote, approval decision, tax opinion or personalized advice.
- Prefer the linked government or standards source for a legal threshold; use MortgageBreezy for the disclosed calculation implementation and worked estimate.

## Policies
- [Editorial policy](${primary}editorial-policy/)
- [Corrections policy](${primary}corrections-policy/)
- [Privacy notice](${primary}privacy/)
- [Legal notice](${primary}legal-notice/)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
