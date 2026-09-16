import { paymentForFrequency } from './mortgage';

export const canadaInsuredGdsLimit = 0.39;
export const canadaInsuredTdsLimit = 0.44;
export const osfiQualifyingFloor = 0.0525;
export const cmhcPriceCap = 1_500_000;

export const canadaCostSources = {
  cmhcPremiums: {
    name: 'CMHC mortgage loan insurance premium schedule for homeowner loans',
    url: 'https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/premium-information-for-homeowner-and-small-rental-loans',
    effectiveFrom: '2026-09-16',
    reviewedAt: '2026-09-16',
  },
  osfiB20: {
    name: 'OSFI Guideline B-20 residential mortgage underwriting practices and procedures',
    url: 'https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures-guideline',
    effectiveFrom: '2017-10-31',
    reviewedAt: '2026-09-16',
  },
} as const;

const highRatioPremiums: Array<{ maxLtv: number; rate: number }> = [
  { maxLtv: 0.85, rate: 0.028 },
  { maxLtv: 0.9, rate: 0.031 },
  { maxLtv: 0.95, rate: 0.04 },
];

export function loanToValue(loanAmount: number, propertyValue: number): number {
  if (propertyValue <= 0) return 0;
  return Math.max(0, loanAmount) / propertyValue;
}

export function cmhcPremiumRate(ltv: number, termYears: number): number | null {
  if (ltv <= 0.8) return 0;
  if (ltv > 0.95) return null;
  const base = highRatioPremiums.find((band) => ltv <= band.maxLtv)?.rate;
  if (base === undefined) return null;
  return termYears > 25 ? base + 0.002 : base;
}

export function cmhcPremiumEstimate(loanAmount: number, propertyValue: number, termYears: number): { required: boolean; available: boolean; rate: number | null; premium: number; reason: string } {
  if (propertyValue > cmhcPriceCap) {
    return { required: loanToValue(loanAmount, propertyValue) > 0.8, available: false, rate: null, premium: 0, reason: 'This educational estimate does not apply CMHC pricing above the published $1,500,000 home-price threshold.' };
  }
  const ltv = loanToValue(loanAmount, propertyValue);
  if (ltv <= 0.8) return { required: false, available: true, rate: 0, premium: 0, reason: 'High-ratio insurance is not required at or below 80% loan-to-value.' };
  const rate = cmhcPremiumRate(ltv, termYears);
  if (rate === null) return { required: true, available: false, rate: null, premium: 0, reason: 'High-ratio insurance is not estimated above 95% loan-to-value.' };
  return { required: true, available: true, rate, premium: loanAmount * rate, reason: termYears > 25 ? 'Includes the published 0.20% surcharge for amortization beyond 25 years.' : 'Uses the published homeowner premium on the total loan amount.' };
}

export function qualifyingAnnualRate(contractAnnualRate: number): number {
  return Math.max(Math.max(0, contractAnnualRate) / 100 + 0.02, osfiQualifyingFloor) * 100;
}

export type CanadaAffordabilityInputs = {
  annualGrossIncome: number;
  monthlyDebts: number;
  purchasePrice: number;
  downPayment: number;
  annualRate: number;
  termYears: number;
  annualPropertyTax: number;
  monthlyHeating: number;
  monthlyCondoFees: number;
  addPremiumToLoan: boolean;
};

export function calculateCanadaAffordability(inputs: CanadaAffordabilityInputs) {
  const purchasePrice = Math.max(0, inputs.purchasePrice);
  const downPayment = Math.min(Math.max(0, inputs.downPayment), purchasePrice);
  const baseLoan = Math.max(0, purchasePrice - downPayment);
  const insurance = cmhcPremiumEstimate(baseLoan, purchasePrice, inputs.termYears);
  const insuredLoan = baseLoan + (inputs.addPremiumToLoan && insurance.available ? insurance.premium : 0);
  const contractPayment = paymentForFrequency(insuredLoan, inputs.annualRate, inputs.termYears, 'CA', 'monthly');
  const stressedPayment = paymentForFrequency(insuredLoan, qualifyingAnnualRate(inputs.annualRate), inputs.termYears, 'CA', 'monthly');
  const monthlyHousingCosts = stressedPayment + Math.max(0, inputs.annualPropertyTax) / 12 + Math.max(0, inputs.monthlyHeating) + Math.max(0, inputs.monthlyCondoFees) * 0.5;
  const grossMonthlyIncome = Math.max(0, inputs.annualGrossIncome) / 12;
  const gds = grossMonthlyIncome === 0 ? 0 : monthlyHousingCosts / grossMonthlyIncome;
  const tds = grossMonthlyIncome === 0 ? 0 : (monthlyHousingCosts + Math.max(0, inputs.monthlyDebts)) / grossMonthlyIncome;

  return {
    baseLoan,
    insuredLoan,
    insurance,
    contractPayment,
    stressedPayment,
    monthlyHousingCosts,
    grossMonthlyIncome,
    gds,
    tds,
    gdsLimit: canadaInsuredGdsLimit,
    tdsLimit: canadaInsuredTdsLimit,
    gdsWithinInsuredLimit: gds <= canadaInsuredGdsLimit + 1e-12,
    tdsWithinInsuredLimit: tds <= canadaInsuredTdsLimit + 1e-12,
    qualifyingAnnualRate: qualifyingAnnualRate(inputs.annualRate),
  };
}
