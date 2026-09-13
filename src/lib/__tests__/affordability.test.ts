import { describe, expect, it } from 'vitest';
import { calculateAffordability } from '../affordability';

const base = { annualGrossIncome: 120000, monthlyDebts: 500, downPayment: 80000, annualRate: 6, termYears: 30, annualPropertyTax: 6000, annualInsurance: 1800, monthlyHoa: 100, frontEndRatio: 0.28, backEndRatio: 0.36 };

describe('calculateAffordability', () => {
  it('uses the tighter of front-end and back-end budgets', () => {
    const result = calculateAffordability(base);
    expect(result.frontEndHousingBudget).toBeCloseTo(2800, 8);
    expect(result.backEndHousingBudget).toBe(3100);
    expect(result.maximumMonthlyHousingBudget).toBeCloseTo(2800, 8);
    expect(result.monthlyOwnershipCosts).toBe(750);
    expect(result.maximumHomePrice).toBeGreaterThan(result.maximumLoanAmount);
  });

  it('handles a zero interest rate', () => {
    const result = calculateAffordability({ ...base, annualRate: 0 });
    expect(result.maximumLoanAmount).toBe(result.maximumPrincipalAndInterest * 360);
  });

  it('never returns a negative borrowing budget', () => {
    const result = calculateAffordability({ ...base, monthlyDebts: 10000 });
    expect(result.maximumPrincipalAndInterest).toBe(0);
    expect(result.maximumLoanAmount).toBe(0);
    expect(result.maximumHomePrice).toBe(base.downPayment);
  });
});
