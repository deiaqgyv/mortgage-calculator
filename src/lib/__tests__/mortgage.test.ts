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
