import { describe, expect, it } from 'vitest';
import { compareMortgageScenarios } from '../compare';

describe('mortgage scenario comparison', () => {
  it('compares base and extra-payment scenarios', () => {
    const rows = compareMortgageScenarios([
      { name: 'Base', loanAmount: 300000, annualRate: 5, termYears: 25, extraMonthly: 0 },
      { name: 'Extra', loanAmount: 300000, annualRate: 5, termYears: 25, extraMonthly: 300 },
    ]);
    expect(rows).toHaveLength(2);
    expect(rows[1].result.totalInterest).toBeLessThan(rows[0].result.totalInterest);
    expect(rows[1].result.payoffMonths).toBeLessThan(rows[0].result.payoffMonths);
  });
});
