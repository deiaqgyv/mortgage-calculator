export type UsLoanProgram = 'conventional' | 'fha' | 'va' | 'usda';

export type UsRecurringCosts = {
  annualPropertyTax: number;
  annualHomeInsurance: number;
  monthlyHoa: number;
  annualFloodInsurance: number;
};

export const usLoanPrograms: Record<UsLoanProgram, { label: string; mortgageInsuranceLabel: string; note: string }> = {
  conventional: { label: 'Conventional', mortgageInsuranceLabel: 'PMI', note: 'PMI is lender- and credit-profile-dependent.' },
  fha: { label: 'FHA', mortgageInsuranceLabel: 'FHA MIP', note: 'FHA upfront and annual MIP require loan-specific eligibility inputs.' },
  va: { label: 'VA', mortgageInsuranceLabel: 'VA funding fee', note: 'VA funding fee depends on service, down payment, and prior use.' },
  usda: { label: 'USDA', mortgageInsuranceLabel: 'USDA guarantee fee', note: 'USDA fees depend on the applicable program year.' },
};

export const usPropertyTaxSource = {
  name: 'User-entered local property tax estimate',
  url: 'https://www.census.gov/programs-surveys/acs/data.html',
  reviewedAt: '2026-08-25',
} as const;

export function monthlyUsRecurringCosts(costs: UsRecurringCosts): number {
  return Math.max(0, costs.annualPropertyTax) / 12 + Math.max(0, costs.annualHomeInsurance) / 12 + Math.max(0, costs.annualFloodInsurance) / 12 + Math.max(0, costs.monthlyHoa);
}
