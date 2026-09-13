'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { calculateAffordability } from '../lib/affordability';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function AffordabilityCalculator() {
  const [annualGrossIncome, setAnnualGrossIncome] = useState(120000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(80000);
  const [annualRate, setAnnualRate] = useState(6.25);
  const [termYears, setTermYears] = useState(30);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(6000);
  const [annualInsurance, setAnnualInsurance] = useState(1800);
  const [monthlyHoa, setMonthlyHoa] = useState(0);
  const [frontEndPercent, setFrontEndPercent] = useState(28);
  const [backEndPercent, setBackEndPercent] = useState(36);
  const result = useMemo(() => calculateAffordability({ annualGrossIncome, monthlyDebts, downPayment, annualRate, termYears, annualPropertyTax, annualInsurance, monthlyHoa, frontEndRatio: frontEndPercent / 100, backEndRatio: backEndPercent / 100 }), [annualGrossIncome, monthlyDebts, downPayment, annualRate, termYears, annualPropertyTax, annualInsurance, monthlyHoa, frontEndPercent, backEndPercent]);
  const moneyField = (label: string, value: number, setter: (value: number) => void, help: string) => <label className="field"><span>{label}</span><div className="input-wrap"><span>$</span><input type="number" min="0" step="100" value={value} onChange={(event) => setter(Number(event.target.value))} /></div><small>{help}</small></label>;

  return <main lang="en-US">
    <header className="site-header"><Link className="brand" href="/en-us/mortgage-calculator"><img src="/icon.svg" alt="" width="32" height="32" aria-hidden="true" />mortgage<span>breezy</span></Link><nav aria-label="Primary navigation"><Link href="/en-us/mortgage-calculator">Mortgage calculator</Link><Link href="/en-us/mortgage-calculator/methodology">Methodology</Link><Link href="/en-us/mortgage-calculator/editorial-policy">Editorial policy</Link></nav></header>
    <section className="intro"><div><p className="eyebrow">United States · educational scenario</p><h1>Mortgage affordability calculator</h1><p className="lede">Estimate a home-price scenario from income, debt, recurring ownership costs and adjustable debt-to-income assumptions. This is not a lender approval or prequalification.</p></div><p className="review-note"><strong>Transparent assumptions</strong><br />The starting 28% housing and 36% total-debt ratios are editable planning inputs, not universal lending limits.</p></section>
    <section className="calculator-layout" aria-label="Mortgage affordability calculator"><form className="input-panel" onSubmit={(event) => event.preventDefault()}><div className="panel-heading"><div><p className="eyebrow">Your scenario</p><h2>Income, debts and costs</h2></div><span className="step-mark">Live estimate</span></div><div className="field-grid">
      {moneyField('Annual gross income', annualGrossIncome, setAnnualGrossIncome, 'Income before tax and deductions')}
      {moneyField('Monthly debt payments', monthlyDebts, setMonthlyDebts, 'Loans, cards and other recurring debt')}
      {moneyField('Down payment', downPayment, setDownPayment, 'Cash applied to the purchase price')}
      <label className="field"><span>Annual interest rate</span><div className="input-wrap"><input type="number" min="0" step="0.01" value={annualRate} onChange={(event) => setAnnualRate(Number(event.target.value))} /><span>%</span></div><small>Fixed-rate scenario, not a live quote</small></label>
      <label className="field"><span>Loan term</span><div className="input-wrap"><input type="number" min="1" max="50" value={termYears} onChange={(event) => setTermYears(Number(event.target.value))} /><span>years</span></div><small>Number of years used in the annuity formula</small></label>
      {moneyField('Annual property tax', annualPropertyTax, setAnnualPropertyTax, 'Enter a current local estimate')}
      {moneyField('Annual home insurance', annualInsurance, setAnnualInsurance, 'Premium estimate; flood cover is separate')}
      {moneyField('Monthly HOA', monthlyHoa, setMonthlyHoa, 'Use zero when not applicable')}
      <label className="field"><span>Housing ratio assumption</span><div className="input-wrap"><input type="number" min="0" max="100" step="0.5" value={frontEndPercent} onChange={(event) => setFrontEndPercent(Number(event.target.value))} /><span>%</span></div><small>Share of gross income available for housing</small></label>
      <label className="field"><span>Total-debt ratio assumption</span><div className="input-wrap"><input type="number" min="0" max="100" step="0.5" value={backEndPercent} onChange={(event) => setBackEndPercent(Number(event.target.value))} /><span>%</span></div><small>Share of gross income available for housing plus debt</small></label>
    </div><div className="assumption"><span className="assumption-icon">i</span><p>Change every assumption to match your own planning case. The calculation does not evaluate credit, cash reserves, lender overlays, mortgage insurance, closing costs, utilities or maintenance.</p></div></form>
      <aside className="result-panel" aria-live="polite"><div className="result-top"><p className="eyebrow">Estimated maximum home-price scenario</p><div className="hero-number">{usd.format(result.maximumHomePrice)}</div><p className="result-subtitle">Estimated loan plus down payment; not an approval or offer</p></div><div className="result-list"><div><span>Maximum loan scenario</span><strong>{usd.format(result.maximumLoanAmount)}</strong></div><div><span>Monthly housing budget</span><strong>{usd.format(result.maximumMonthlyHousingBudget)}</strong></div><div><span>Principal and interest</span><strong>{usd.format(result.maximumPrincipalAndInterest)}</strong></div><div><span>Tax, insurance and HOA</span><strong>{usd.format(result.monthlyOwnershipCosts)}</strong></div><div><span>Front-end budget</span><strong>{usd.format(result.frontEndHousingBudget)}</strong></div><div><span>Back-end budget after debts</span><strong>{usd.format(result.backEndHousingBudget)}</strong></div></div></aside>
    </section>
    <section className="methodology"><div><p className="eyebrow">How it works</p><h2>The tighter budget controls the estimate.</h2></div><div><p>The tool calculates a housing budget under both editable ratios, subtracts recurring tax, insurance and HOA costs, then reverses the fixed-rate annuity formula to estimate principal. Negative budgets are floored at zero.</p><p>Read the <Link className="inline-link" href="/en-us/mortgage-calculator/methodology">calculation methodology</Link> and <Link className="inline-link" href="/en-us/mortgage-calculator/editorial-policy">editorial policy</Link>.</p></div></section>
    <footer className="site-footer"><span>© 2026 MortgageBreezy</span><Link href="/en-us/mortgage-calculator/privacy">Privacy</Link><Link href="/en-us/mortgage-calculator/legal-notice">Legal notice</Link></footer>
  </main>;
}
