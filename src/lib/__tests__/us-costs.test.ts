import { describe, expect, it } from 'vitest';
import { monthlyUsRecurringCosts, usLoanPrograms } from '../us-costs';

describe('US recurring cost model', () => {
  it('converts annual property costs and HOA to a monthly escrow-style estimate', () => {
    expect(monthlyUsRecurringCosts({ annualPropertyTax: 6000, annualHomeInsurance: 1800, annualFloodInsurance: 600, monthlyHoa: 250 })).toBe(950);
  });

  it('exposes the four supported loan program labels', () => {
    expect(Object.keys(usLoanPrograms)).toEqual(['conventional', 'fha', 'va', 'usda']);
  });
});
