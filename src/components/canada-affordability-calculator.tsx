'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { calculateCanadaAffordability, canadaCostSources } from '../lib/canada-costs';

const cad = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
const pct = new Intl.NumberFormat('en-CA', { style: 'percent', maximumFractionDigits: 1 });

export default function CanadaAffordabilityCalculator() {
  const [annualGrossIncome, setAnnualGrossIncome] = useState(120000);
  const [monthlyDebts, setMonthlyDebts] = useState(400);
  const [purchasePrice, setPurchasePrice] = useState(550000);
  const [downPayment, setDownPayment] = useState(55000);
  const [annualRate, setAnnualRate] = useState(5.25);
  const [termYears, setTermYears] = useState(25);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(4800);
  const [monthlyHeating, setMonthlyHeating] = useState(150);
  const [monthlyCondoFees, setMonthlyCondoFees] = useState(0);
  const [addPremiumToLoan, setAddPremiumToLoan] = useState(true);
  const result = useMemo(() => calculateCanadaAffordability({
    annualGrossIncome, monthlyDebts, purchasePrice, downPayment, annualRate, termYears, annualPropertyTax, monthlyHeating, monthlyCondoFees, addPremiumToLoan,
  }), [annualGrossIncome, monthlyDebts, purchasePrice, downPayment, annualRate, termYears, annualPropertyTax, monthlyHeating, monthlyCondoFees, addPremiumToLoan]);
  const moneyField = (label: string, value: number, setter: (value: number) => void, help: string) => <label className="field"><span>{label}</span><div className="input-wrap"><span>$</span><input type="number" min="0" step="100" value={value} onChange={(event) => setter(Number(event.target.value))} /></div><small>{help}</small></label>;

  return <main lang="en-CA">
    <header className="site-header"><Link className="brand" href="/en-ca/mortgage-calculator"><img src="/icon.svg" alt="" width="32" height="32" aria-hidden="true" />mortgage<span>breezy</span></Link><nav aria-label="Primary navigation"><Link href="/en-ca/mortgage-calculator">Calculator</Link><Link href="/en-us/mortgage-calculator/methodology" hrefLang="en-US">Methodology (English)</Link></nav></header>
    <section className="intro"><div><p className="eyebrow">Canada · educational scenario</p><h1>Canadian GDS, TDS and CMHC calculator</h1><p className="lede">Estimate Gross Debt Service, Total Debt Service and a high-ratio CMHC premium for a Canadian purchase scenario. This is not a lender approval, insurer decision or stress-test result for a named borrower.</p></div><p className="review-note"><strong>Insured-mortgage planning limits</strong><br />The default 39% GDS and 44% TDS markers are the insured-mortgage limits described in OSFI B-20. Uninsured lender overlays can differ.</p></section>
    <section className="calculator-layout" aria-label="Canadian GDS TDS and CMHC calculator"><form className="input-panel" onSubmit={(event) => event.preventDefault()}><div className="panel-heading"><div><p className="eyebrow">Your scenario</p><h2>Income, purchase and housing costs</h2></div><span className="step-mark">Live estimate</span></div><div className="field-grid">
      {moneyField('Annual gross income', annualGrossIncome, setAnnualGrossIncome, 'Household income before tax')}
      {moneyField('Monthly other debts', monthlyDebts, setMonthlyDebts, 'Loans, cards and other recurring debt')}
      {moneyField('Purchase price', purchasePrice, setPurchasePrice, 'Contract price used for LTV')}
      {moneyField('Down payment', downPayment, setDownPayment, 'Cash applied to the purchase price')}
      <label className="field"><span>Contract interest rate</span><div className="input-wrap"><input type="number" min="0" step="0.01" value={annualRate} onChange={(event) => setAnnualRate(Number(event.target.value))} /><span>%</span></div><small>Quoted annual rate, compounded semi-annually</small></label>
      <label className="field"><span>Amortization</span><div className="input-wrap"><input type="number" min="1" max="30" value={termYears} onChange={(event) => setTermYears(Number(event.target.value))} /><span>years</span></div><small>Beyond 25 years adds the published 0.20% CMHC surcharge</small></label>
      {moneyField('Annual property tax', annualPropertyTax, setAnnualPropertyTax, 'Enter a current local estimate')}
      {moneyField('Monthly heating', monthlyHeating, setMonthlyHeating, 'Included in GDS as a housing cost')}
      {moneyField('Monthly condo / strata fees', monthlyCondoFees, setMonthlyCondoFees, 'GDS uses 50% of this amount')}
      <label className="check-row"><input type="checkbox" checked={addPremiumToLoan} onChange={(event) => setAddPremiumToLoan(event.target.checked)} /><span>Add the CMHC premium to the loan amount</span></label>
    </div><div className="assumption"><span className="assumption-icon">i</span><p>GDS uses the qualifying rate of the greater of the contract rate plus 2 percentage points or 5.25%. Provincial sales tax on premiums, energy-efficient refunds, non-traditional down payments and insurer overlays are not modelled.</p></div></form>
      <aside className="result-panel" aria-live="polite"><div className="result-top"><p className="eyebrow">Stressed GDS / TDS illustration</p><div className="hero-number">{pct.format(result.gds)} / {pct.format(result.tds)}</div><p className="result-subtitle">{result.gdsWithinInsuredLimit && result.tdsWithinInsuredLimit ? 'Within the 39% / 44% insured markers' : 'Outside the 39% / 44% insured markers'} · not an approval</p></div><div className="result-list">
        <div><span>Base loan</span><strong>{cad.format(result.baseLoan)}</strong></div>
        <div><span>CMHC premium</span><strong>{result.insurance.available ? cad.format(result.insurance.premium) : 'Not estimated'}</strong></div>
        <div><span>Loan if premium added</span><strong>{cad.format(result.insuredLoan)}</strong></div>
        <div><span>Contract monthly P&amp;I</span><strong>{cad.format(result.contractPayment)}</strong></div>
        <div><span>Qualifying-rate P&amp;I</span><strong>{cad.format(result.stressedPayment)}</strong></div>
        <div><span>Qualifying annual rate</span><strong>{result.qualifyingAnnualRate.toFixed(2)}%</strong></div>
        <div><span>GDS housing costs</span><strong>{cad.format(result.monthlyHousingCosts)}</strong></div>
      </div><p className="field-note">{result.insurance.reason}</p></aside>
    </section>
    <section className="methodology"><div><p className="eyebrow">How it works</p><h2>GDS, TDS and CMHC stay separate from a lender quote.</h2></div><div>
      <p>Gross Debt Service is qualifying-rate principal and interest plus property tax, heating and half of condo fees, divided by gross monthly income. Total Debt Service adds other debt payments. The 39% and 44% markers are the insured-mortgage limits described by OSFI, not a promise that an uninsured lender will use the same caps.</p>
      <p>The premium uses the published CMHC homeowner schedule on the total loan amount. It does not price Sagen, Canada Guaranty, provincial sales tax, portability credits or eligibility for a 30-year insured amortization.</p>
      <p>Sources: <a className="inline-link" href={canadaCostSources.cmhcPremiums.url} target="_blank" rel="noreferrer">{canadaCostSources.cmhcPremiums.name}</a> · reviewed {canadaCostSources.cmhcPremiums.reviewedAt}. <a className="inline-link" href={canadaCostSources.osfiB20.url} target="_blank" rel="noreferrer">{canadaCostSources.osfiB20.name}</a> · reviewed {canadaCostSources.osfiB20.reviewedAt}.</p>
      <p>Read the <Link className="inline-link" href="/en-us/mortgage-calculator/methodology" hrefLang="en-US">calculation methodology (English)</Link>.</p>
    </div></section>
    <footer className="site-footer"><span>© 2026 MortgageBreezy</span><Link href="/en-us/mortgage-calculator/privacy" hrefLang="en-US">Privacy (English)</Link><Link href="/en-us/mortgage-calculator/legal-notice" hrefLang="en-US">Legal notice (English)</Link></footer>
  </main>;
}
