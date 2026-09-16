export type CountryCode = 'US' | 'GB' | 'CA' | 'DE' | 'FR' | 'ES';
export type PaymentFrequency = 'monthly' | 'semi-monthly' | 'biweekly' | 'weekly' | 'accelerated-biweekly' | 'accelerated-weekly';
export type RepaymentType = 'repayment' | 'interest-only';

export type MortgageInputs = {
  country?: CountryCode;
  loanAmount: number;
  annualRate: number;
  termYears: number;
  extraMonthly: number;
  extraAnnual?: number;
  extraLumpSum?: number;
  extraLumpPeriod?: number;
  extraStartPeriod?: number;
  extraEndPeriod?: number;
  paymentFrequency?: PaymentFrequency;
  repaymentType?: RepaymentType;
  annualMortgageInsurance?: number;
  propertyValue?: number;
  fixedPeriodYears?: number;
};

export type AmortizationRow = { period: number; payment: number; principal: number; interest: number; extraPayment: number; mortgageInsurance: number; balance: number };
export type MortgageResult = { monthlyPayment: number; paymentPerPeriod: number; totalInterest: number; totalPaid: number; totalMortgageInsurance: number; payoffMonths: number; interestSaved: number; monthsSaved: number; balanceAtFixedPeriodEnd?: number; schedule: AmortizationRow[] };

export function periodicRate(annualRate: number, country: CountryCode = 'US', frequency: PaymentFrequency = 'monthly'): number {
  const paymentsPerYear = frequency === 'semi-monthly' ? 24 : frequency === 'biweekly' || frequency === 'accelerated-biweekly' ? 26 : frequency === 'weekly' || frequency === 'accelerated-weekly' ? 52 : 12;
  const nominal = annualRate / 100;
  if (country === 'CA') return Math.pow(1 + nominal / 2, 2 / paymentsPerYear) - 1;
  return nominal / paymentsPerYear;
}

export function monthlyPayment(loanAmount: number, annualRate: number, termYears: number, country: CountryCode = 'US'): number { return paymentForFrequency(loanAmount, annualRate, termYears, country, 'monthly'); }

export function paymentForFrequency(loanAmount: number, annualRate: number, termYears: number, country: CountryCode = 'US', frequency: PaymentFrequency = 'monthly'): number {
  const paymentsPerYear = frequency === 'semi-monthly' ? 24 : frequency === 'biweekly' || frequency === 'accelerated-biweekly' ? 26 : frequency === 'weekly' || frequency === 'accelerated-weekly' ? 52 : 12;
  const periods = Math.max(1, Math.round(termYears * paymentsPerYear));
  const rate = periodicRate(annualRate, country, frequency);
  if (rate === 0) return loanAmount / periods;
  const factor = Math.pow(1 + rate, periods);
  const standard = loanAmount * ((rate * factor) / (factor - 1));
  if (frequency === 'accelerated-biweekly') return monthlyPayment(loanAmount, annualRate, termYears, country) / 2;
  if (frequency === 'accelerated-weekly') return monthlyPayment(loanAmount, annualRate, termYears, country) / 4;
  return standard;
}

export function usPmiEstimate(propertyValue: number, loanAmount: number, annualPmiRate = 0.75): number { return propertyValue > 0 && loanAmount / propertyValue > 0.8 ? loanAmount * (annualPmiRate / 100) / 12 : 0; }

export function ukSdltEstimate(propertyValue: number, firstTimeBuyer = false, additionalProperty = false): number {
  const bands = firstTimeBuyer && propertyValue <= 500000 ? [[300000, 0], [200000, 0.05], [Infinity, 0.05]] : [[125000, 0], [125000, 0.02], [675000, 0.05], [575000, 0.1], [Infinity, 0.12]];
  const surcharge = additionalProperty ? 0.05 : 0;
  let remaining = Math.max(0, propertyValue); let tax = 0;
  for (const [band, rate] of bands) { const amount = Math.min(remaining, band); tax += amount * (rate + surcharge); remaining -= amount; if (remaining <= 0) break; }
  return tax;
}

function extraPrincipalForPeriod(inputs: MortgageInputs, period: number, paymentsPerYear: number): number {
  const start = Math.max(1, inputs.extraStartPeriod ?? 1);
  const end = inputs.extraEndPeriod && inputs.extraEndPeriod > 0 ? inputs.extraEndPeriod : Number.POSITIVE_INFINITY;
  let extra = 0;
  if (period >= start && period <= end) extra += Math.max(0, inputs.extraMonthly) * 12 / paymentsPerYear;
  if ((inputs.extraAnnual ?? 0) > 0 && period % paymentsPerYear === 0) extra += Math.max(0, inputs.extraAnnual ?? 0);
  if ((inputs.extraLumpSum ?? 0) > 0 && period === Math.max(1, Math.round(inputs.extraLumpPeriod ?? 1))) extra += Math.max(0, inputs.extraLumpSum ?? 0);
  return extra;
}

function buildSchedule(inputs: MortgageInputs): MortgageResult {
  const country = inputs.country ?? 'US'; const frequency = inputs.paymentFrequency ?? 'monthly';
  const paymentsPerYear = frequency === 'semi-monthly' ? 24 : frequency === 'biweekly' || frequency === 'accelerated-biweekly' ? 26 : frequency === 'weekly' || frequency === 'accelerated-weekly' ? 52 : 12;
  const repaymentPeriodPayment = paymentForFrequency(inputs.loanAmount, inputs.annualRate, inputs.termYears, country, frequency); const baseMonthly = monthlyPayment(inputs.loanAmount, inputs.annualRate, inputs.termYears, country); const rate = periodicRate(inputs.annualRate, country, frequency);
  const maxPeriods = Math.max(1, Math.round(inputs.termYears * paymentsPerYear)); const interestOnly = inputs.repaymentType === 'interest-only';
  const periodPayment = interestOnly ? inputs.loanAmount * rate : repaymentPeriodPayment;
  const displayedMonthlyPayment = interestOnly ? periodPayment * paymentsPerYear / 12 : baseMonthly;
  let balance = inputs.loanAmount; let totalInterest = 0; let totalPaid = 0; let totalMortgageInsurance = 0; const schedule: AmortizationRow[] = [];
  for (let period = 1; period <= maxPeriods && balance > 0.005; period += 1) {
    const interest = balance * rate; const scheduled = interestOnly ? interest : Math.min(periodPayment, balance + interest); const extraPayment = Math.min(extraPrincipalForPeriod(inputs, period, paymentsPerYear), Math.max(0, balance + interest - scheduled)); const principal = interestOnly ? 0 : Math.min(balance, scheduled - interest); const mortgageInsurance = inputs.annualMortgageInsurance ? inputs.annualMortgageInsurance / paymentsPerYear : 0;
    balance = Math.max(0, balance - principal - extraPayment); const payment = scheduled + extraPayment; totalInterest += interest; totalPaid += payment + mortgageInsurance; totalMortgageInsurance += mortgageInsurance; schedule.push({ period, payment, principal, interest, extraPayment, mortgageInsurance, balance });
  }
  const fixedPeriod = inputs.fixedPeriodYears ? Math.round(inputs.fixedPeriodYears * paymentsPerYear) : undefined;
  return { monthlyPayment: displayedMonthlyPayment, paymentPerPeriod: periodPayment, totalInterest, totalPaid, totalMortgageInsurance, payoffMonths: Math.ceil(schedule.length * 12 / paymentsPerYear), interestSaved: 0, monthsSaved: 0, balanceAtFixedPeriodEnd: fixedPeriod ? schedule[Math.min(fixedPeriod, schedule.length) - 1]?.balance : undefined, schedule };
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResult {
  const repaymentType = inputs.repaymentType ?? 'repayment';
  const base = buildSchedule({ ...inputs, repaymentType, extraMonthly: 0, extraAnnual: 0, extraLumpSum: 0 });
  const withExtra = buildSchedule({ ...inputs, repaymentType });
  return { ...withExtra, interestSaved: Math.max(0, base.totalInterest - withExtra.totalInterest), monthsSaved: Math.max(0, base.payoffMonths - withExtra.payoffMonths) };
}
