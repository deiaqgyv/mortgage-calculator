import { describe, expect, it } from 'vitest';
import { calculateCanadaAffordability, cmhcPremiumEstimate, qualifyingAnnualRate } from '../canada-costs';

describe('CMHC premium estimate', () => {
  it('does not require insurance at or below 80% LTV', () => {
    const result = cmhcPremiumEstimate(400000, 500000, 25);
    expect(result.required).toBe(false);
    expect(result.premium).toBe(0);
  });

  it('uses the published 90% homeowner premium', () => {
    const result = cmhcPremiumEstimate(450000, 500000, 25);
    expect(result.available).toBe(true);
    expect(result.rate).toBeCloseTo(0.031, 8);
    expect(result.premium).toBeCloseTo(13950, 8);
  });

  it('adds the 0.20% surcharge beyond 25 years', () => {
    const result = cmhcPremiumEstimate(450000, 500000, 30);
    expect(result.rate).toBeCloseTo(0.033, 8);
  });

  it('does not invent a premium above 95% LTV', () => {
    const result = cmhcPremiumEstimate(480000, 500000, 25);
    expect(result.available).toBe(false);
    expect(result.premium).toBe(0);
  });

  it('does not invent a premium above the published home-price cap', () => {
    const result = cmhcPremiumEstimate(1_200_000, 1_600_000, 25);
    expect(result.available).toBe(false);
    expect(result.premium).toBe(0);
  });
});

describe('Canadian GDS and TDS illustration', () => {
  it('uses the greater of contract plus 2% or 5.25% as the qualifying rate', () => {
    expect(qualifyingAnnualRate(6.25)).toBeCloseTo(8.25, 8);
    expect(qualifyingAnnualRate(3)).toBeCloseTo(5.25, 8);
  });

  it('includes half of condo fees and stressed principal and interest in GDS', () => {
    const result = calculateCanadaAffordability({
      annualGrossIncome: 120000,
      monthlyDebts: 400,
      purchasePrice: 500000,
      downPayment: 50000,
      annualRate: 5,
      termYears: 25,
      annualPropertyTax: 4800,
      monthlyHeating: 150,
      monthlyCondoFees: 400,
      addPremiumToLoan: true,
    });
    expect(result.insurance.premium).toBeGreaterThan(0);
    expect(result.insuredLoan).toBeGreaterThan(result.baseLoan);
    expect(result.gds).toBeGreaterThan(0);
    expect(result.tds).toBeGreaterThan(result.gds);
    expect(result.gdsLimit).toBe(0.39);
    expect(result.tdsLimit).toBe(0.44);
  });
});
