import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { localeBySlug, siteUrl } from '../../../../lib/seo';
import { taxSources } from '../../../../lib/taxes';

const publishedDate = '2026-08-25';
const reviewedDate = '2026-09-12';

const articles = {
  amortization: { title: 'Mortgage amortization schedule with extra payments', description: 'Learn how a mortgage amortization schedule splits principal and interest and how extra payments change the remaining balance and payoff date.', body: ['An amortization schedule lists every planned payment. Each row shows the opening balance, interest for that period, principal repaid, any extra principal and the remaining balance. It is the clearest way to understand why a loan with the same monthly payment can have a very different interest cost when its term or rate changes.', 'For a fixed-rate repayment mortgage, interest is calculated from the balance at the start of a payment period. Early in the term, that balance is larger, so more of each scheduled payment goes to interest. As principal falls, the interest portion generally falls and the principal portion rises. The final payment is adjusted so the balance does not become negative.', 'Use the calculator schedule as an illustrative cash-flow model. Actual lender schedules can differ because of daily interest, payment dates, escrow, product fees, rate changes or contractual rounding.'] },
  'extra-payments': { title: 'Mortgage extra payment calculator guide', description: 'See how extra monthly mortgage payments can reduce total interest and shorten your payoff time, subject to lender overpayment rules.', body: ['An extra mortgage payment is money applied directly to the outstanding principal after the scheduled payment. Reducing the balance earlier means later interest is calculated on a smaller amount. The calculator compares the same loan with and without a recurring monthly extra payment so the interest and time difference remains visible.', 'The effect is not guaranteed to match a lender statement. Some loans restrict overpayments, apply an annual limit, require a particular payment instruction or charge an early-repayment fee. An interest-only loan also has a principal balance due at the end of its term unless separate repayments are made.', 'Before paying extra, review your loan agreement and compare the expected interest saving with any fee, the value of maintaining emergency savings and other higher-cost debt.'] },
  affordability: { title: 'Mortgage affordability checklist', description: 'Mortgage affordability means testing the full housing budget, not only the principal-and-interest payment.', body: ['A mortgage payment estimate is only one part of affordability. A usable home-buying budget separates loan repayment from ownership costs and one-time transaction costs. The calculator deliberately keeps these categories separate so a property tax or transfer-tax estimate is not mistaken for interest owed to a lender.', 'Budget for recurring costs such as property tax, home insurance, flood cover where relevant, association or condominium charges, maintenance, utilities and a reserve for unexpected repairs. Also plan for the down payment, tax, legal or notary work, valuations, inspections, registration and lender fees where they apply.', 'This tool does not assess income, credit history, debt-to-income rules, stress tests or loan eligibility. Obtain a current lender quote and local professional advice before making a purchase decision.'] },
  methodology: { title: 'Mortgage calculation methodology', description: 'MortgageBreezy calculates fixed-rate payment illustrations and shows the applicable data version, rate convention and limits.', body: ['MortgageBreezy calculates a fixed-rate payment illustration from the loan amount, nominal annual rate, term, repayment type, payment frequency and optional extra principal. A repayment loan uses a standard amortization formula; with a zero rate, principal is divided evenly across the payment periods. Canada converts quoted rates using semi-annual compounding before calculating the selected payment frequency.', 'Every calculation retains precision internally and rounds currency only for display. The result page states the relevant calculation-data version, effective date, review date, included costs and exclusions. Transfer-tax and registration estimates are separate from the loan payment because they are generally transaction costs rather than recurring interest.', 'The calculator is not a lender underwriting system. It does not model variable-rate resets, lender-specific product pricing, all insurance premiums, daily-interest conventions, early-repayment penalties or every local registration fee. Confirm the current rule with the lender and the relevant public authority.'] },
  'editorial-policy': { title: 'Editorial and calculation review policy', description: 'How MortgageBreezy writes, sources, reviews and corrects mortgage calculator guidance without overstating professional credentials.', body: ['MortgageBreezy separates calculation logic, local-rule data and general educational guidance. Calculator rules are tied to a version, effective date, review date, applicability statement and source where an official source is available. If a dependable formula is unavailable, the calculator asks for user input or labels the estimate as unavailable instead of inventing a rate.', 'MortgageBreezy does not currently claim that its content is reviewed by a licensed mortgage adviser, lender, accountant, lawyer or tax professional. An organization byline identifies the publisher, not a professional endorsement. A named reviewer and Person structured data will be added only when a real reviewer has agreed to public identification and their relevant experience can be verified.', 'Reviews check formulas against worked examples and boundary cases, compare local-rule data with the linked primary source, and verify that limitations are visible near the result. This process reduces avoidable errors but cannot replace a current lender quote, loan agreement or advice for an individual transaction.'] },
  'corrections-policy': { title: 'Corrections policy', description: 'How to report a MortgageBreezy calculation, source or content error and how material corrections are documented.', body: ['Report a suspected calculation, source or content error to support@mortgagebreezy.com. Include the calculator country, the inputs used, the displayed result, the result you expected and a link to any relevant official rule. Do not include account numbers, application documents or other personal financial information.', 'Reports are checked against the current calculation version, automated tests and linked primary sources. A material confirmed error is corrected in the source code, covered by a regression test where practical, and reflected in the page review date or calculation-data version. Minor spelling and presentation fixes may not receive a separate correction notice.', 'Mortgage rates, taxes, fees and eligibility rules change over time. A difference caused by a newer lender term or government rule is treated as a data update rather than proof that every earlier estimate was incorrect. Users should rely on current documents from the lender and relevant authority for a real transaction.'] },
  'legal-notice': { title: 'Legal notice', description: 'Legal information and disclaimer for the MortgageBreezy calculator.', body: ['MortgageBreezy provides educational estimates only. Nothing on this site is a loan offer, tax opinion, legal advice, financial advice or a recommendation to buy, sell or borrow.', 'Rates, tax rules, fees and eligibility can change. Confirm the current terms with your lender and the relevant authority, notary, conveyancer or qualified adviser before relying on an estimate.'] },
  privacy: { title: 'Privacy notice', description: 'How MortgageBreezy processes calculator inputs, share links and basic technical data.', body: ['Calculator inputs are processed in your browser to produce an estimate. MortgageBreezy does not require an account and the calculator does not ask for your name, address, income, bank details or other financial identity information.', 'When you create a share link, the selected loan amount, rate, term and related calculator settings are encoded in the URL. Anyone who receives that URL can read those values, so do not share a link containing inputs you consider private.', 'Our hosting provider may process standard technical logs needed to deliver and protect the site, such as the requested page, request time, IP address, browser information and error data. Retention and access are governed by the hosting provider and applicable law.', 'MortgageBreezy does not currently use advertising cookies or sell calculator inputs. If analytics, advertising or other optional tracking is introduced, this notice and any required consent controls will be updated before that tracking is enabled.', 'You can clear calculator values by resetting the form, removing the share parameters from the URL or closing the page. This notice was published and reviewed on 25 August 2026.'] },
} as const;
type ArticleSlug = keyof typeof articles;
function isArticleSlug(value: string): value is ArticleSlug { return value in articles; }
export function generateStaticParams() { return Object.keys(articles).map((article) => ({ locale: 'en-us', article })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; article: string }> }): Promise<Metadata> {
  const { locale, article } = await params;
  if (locale !== 'en-us' || !isArticleSlug(article)) return {};
  return { title: `${articles[article].title} | MortgageBreezy`, description: articles[article].description, alternates: { canonical: `${siteUrl}/${locale}/mortgage-calculator/${article}` } };
}
export default async function ArticlePage({ params }: { params: Promise<{ locale: string; article: string }> }) {
  const { locale, article } = await params;
  if (locale !== 'en-us' || !isArticleSlug(article)) notFound();
  const page = articles[article];
  const localeRoot = `/${locale}/mortgage-calculator`;
  const pageUrl = `${siteUrl}/${locale}/mortgage-calculator/${article}`;
  const officialSources = [taxSources.ukSdlt, taxSources.ontarioLtt, taxSources.germanyGrunderwerbsteuer, taxSources.franceDmto, taxSources.spainPropertyTaxes];
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.description,
    inLanguage: localeBySlug[locale],
    datePublished: publishedDate,
    dateModified: reviewedDate,
    mainEntityOfPage: pageUrl,
    author: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'MortgageBreezy', url: siteUrl },
    publisher: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'MortgageBreezy', url: siteUrl },
    isBasedOn: article === 'methodology' ? officialSources.map((source) => source.url) : undefined,
  };

  return <main className="article-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <header className="site-header">
      <Link className="brand" href={localeRoot}><img src="/icon.svg" alt="" width="32" height="32" aria-hidden="true" />mortgage<span>breezy</span></Link>
      <nav aria-label="Primary navigation"><Link href={localeRoot}>Calculator</Link><Link href={`${localeRoot}/methodology`}>Methodology</Link><Link href={`${localeRoot}/editorial-policy`}>Editorial policy</Link></nav>
    </header>
    <article>
      <p className="eyebrow">{localeBySlug[locale]} · guide</p>
      <h1>{page.title}</h1>
      <p className="article-summary"><strong>Short answer:</strong> {page.description}</p>
      {page.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {article === 'methodology' && <section className="article-sources"><h2>Primary sources used for local-rule data</h2><ul>{officialSources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name}</a> — effective {source.effectiveFrom}; reviewed {source.reviewedAt}.</li>)}</ul></section>}
      <section className="article-sources"><h2>Editorial responsibility</h2><p>MortgageBreezy publishes these educational materials as an organization. It does not currently claim review by a licensed financial professional. Read the <Link href={`${localeRoot}/editorial-policy`}>editorial and calculation review policy</Link> or <Link href={`${localeRoot}/corrections-policy`}>report a correction</Link>.</p></section>
      <p className="article-meta">Published: {publishedDate} · Last reviewed: {reviewedDate}</p>
      <p><Link className="primary-button" href={localeRoot}>Open calculator</Link></p>
    </article>
    <footer className="site-footer"><span>© 2026 MortgageBreezy</span><Link href={`${localeRoot}/privacy`}>Privacy</Link><Link href={`${localeRoot}/editorial-policy`}>Editorial policy</Link><Link href={`${localeRoot}/legal-notice`}>Legal notice</Link></footer>
  </main>;
}
