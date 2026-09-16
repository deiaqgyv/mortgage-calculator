import { describe, expect, it } from 'vitest';
import { calculateMortgage, monthlyPayment, paymentForFrequency, periodicRate, ukSdltEstimate, usPmiEstimate } from '../mortgage';

describe('mortgage calculations', () => {
  it('calculates a zero-interest loan evenly', () => {
    expect(monthlyPayment(120000, 0, 10)).toBe(1000);
  });

  it('builds a schedule that reaches zero', () => {
    const result = calculateMortgage({ loanAmount: 300000, annualRate: 6, termYears: 30, extraMonthly: 0 });
    expect(result.monthlyPayment).toBeCloseTo(1798.65, 1);
    expect(result.schedule.at(-1)?.balance).toBe(0);
    expect(result.schedule.length).toBe(360);
  });

  it('reports savings from extra payments', () => {
    const result = calculateMortgage({ loanAmount: 300000, annualRate: 6, termYears: 30, extraMonthly: 300 });
    expect(result.interestSaved).toBeGreaterThan(0);
    expect(result.monthsSaved).toBeGreaterThan(0);
  });

  it('applies a one-time lump sum on the selected period', () => {
    const monthly = calculateMortgage({ loanAmount: 300000, annualRate: 6, termYears: 30, extraMonthly: 0 });
    const lump = calculateMortgage({ loanAmount: 300000, annualRate: 6, termYears: 30, extraMonthly: 0, extraLumpSum: 20000, extraLumpPeriod: 1 });
    expect(lump.schedule[0]?.extraPayment).toBeCloseTo(20000, 8);
    expect(lump.interestSaved).toBeGreaterThan(0);
    expect(lump.totalInterest).toBeLessThan(monthly.totalInterest);
  });

  it('applies an annual extra payment once per year', () => {
    const result = calculateMortgage({ loanAmount: 300000, annualRate: 6, termYears: 30, extraMonthly: 0, extraAnnual: 5000 });
    const annualRows = result.schedule.filter((row) => row.extraPayment > 0);
    expect(annualRows[0]?.period).toBe(12);
    expect(annualRows[0]?.extraPayment).toBeCloseTo(5000, 8);
    expect(annualRows[1]?.period).toBe(24);
    expect(result.interestSaved).toBeGreaterThan(0);
  });

  it('limits recurring extra payments to a start and end period', () => {
    const result = calculateMortgage({ loanAmount: 300000, annualRate: 6, termYears: 30, extraMonthly: 300, extraStartPeriod: 13, extraEndPeriod: 24 });
    expect(result.schedule[11]?.extraPayment).toBe(0);
    expect(result.schedule[12]?.extraPayment).toBeCloseTo(300, 8);
    expect(result.schedule[23]?.extraPayment).toBeCloseTo(300, 8);
    expect(result.schedule[24]?.extraPayment).toBe(0);
  });

  it('reports the actual interest-only payment', () => {
    const result = calculateMortgage({ loanAmount: 360000, annualRate: 7, termYears: 30, extraMonthly: 0, repaymentType: 'interest-only' });
    expect(result.monthlyPayment).toBeCloseTo(2100, 8);
    expect(result.paymentPerPeriod).toBeCloseTo(2100, 8);
    expect(result.schedule[0]?.principal).toBe(0);
    expect(result.schedule.at(-1)?.balance).toBe(360000);
  });

  it('converts interest-only payments to a monthly equivalent', () => {
    const result = calculateMortgage({ country: 'CA', loanAmount: 300000, annualRate: 6, termYears: 25, extraMonthly: 0, repaymentType: 'interest-only', paymentFrequency: 'biweekly' });
    expect(result.monthlyPayment).toBeCloseTo(result.paymentPerPeriod * 26 / 12, 8);
  });

  it('uses Canadian semi-annual compounding for periodic rates', () => {
    expect(periodicRate(6, 'CA')).toBeCloseTo(Math.pow(1.03, 1 / 6) - 1, 10);
    expect(paymentForFrequency(300000, 6, 25, 'CA')).toBeCloseTo(1919.42, 0);
  });

  it('supports Canadian accelerated biweekly payments', () => {
    expect(paymentForFrequency(300000, 6, 25, 'CA', 'accelerated-biweekly')).toBeCloseTo(monthlyPayment(300000, 6, 25, 'CA') / 2, 8);
  });

  it('estimates US PMI only above 80 percent LTV', () => {
    expect(usPmiEstimate(400000, 320000)).toBe(0);
    expect(usPmiEstimate(400000, 360000)).toBeCloseTo(225, 8);
  });

  it('calculates UK SDLT using marginal bands', () => {
    expect(ukSdltEstimate(295000)).toBe(4750);
  });

  it('reports balance at the end of a fixed period', () => {
    const result = calculateMortgage({ loanAmount: 300000, annualRate: 4, termYears: 25, extraMonthly: 0, fixedPeriodYears: 5 });
    expect(result.balanceAtFixedPeriodEnd).toBeGreaterThan(0);
    expect(result.balanceAtFixedPeriodEnd).toBeLessThan(300000);
  });
});
