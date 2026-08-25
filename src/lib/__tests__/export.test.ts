import { describe, expect, it } from 'vitest';
import { amortizationCsv, decodeMortgageShare, encodeMortgageShare } from '../export';
import { calculateMortgage } from '../mortgage';

describe('mortgage export and sharing', () => {
  it('exports the complete schedule and protects spreadsheet formula prefixes', () => {
    const csv = amortizationCsv([{ period: 1, payment: 100, principal: 60, interest: 40, extraPayment: 0, mortgageInsurance: 0, balance: 940 }]);
    expect(csv).toContain('Period,Payment,Principal');
    expect(csv).toContain('1,100,60,40');
  });

  it('round-trips share-safe mortgage inputs without personal data', () => {
    const inputs = { country: 'CA' as const, loanAmount: 300000, annualRate: 5, termYears: 25, extraMonthly: 100 };
    expect(decodeMortgageShare(encodeMortgageShare(inputs))).toEqual(inputs);
    expect(decodeMortgageShare('invalid')).toBeNull();
  });

  it('exports the full amortization schedule for every supported country', () => {
    const countries = ['US', 'GB', 'CA', 'DE', 'FR', 'ES'] as const;
    for (const country of countries) {
      const inputs = { country, loanAmount: 300000, annualRate: 5, termYears: 25, extraMonthly: 100 };
      const encoded = encodeMortgageShare(inputs);
      expect(decodeMortgageShare(encoded)?.country).toBe(country);
      const schedule = calculateMortgage(inputs).schedule;
      expect(amortizationCsv(schedule)).toContain(`${schedule.length},`);
    }
  });
});
