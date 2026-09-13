export type AffordabilityInputs = {
  annualGrossIncome: number;
  monthlyDebts: number;
  downPayment: number;
  annualRate: number;
  termYears: number;
  annualPropertyTax: number;
  annualInsurance: number;
  monthlyHoa: number;
  frontEndRatio: number;
  backEndRatio: number;
};

export function calculateAffordability(inputs: AffordabilityInputs) {
  const grossMonthlyIncome = Math.max(0, inputs.annualGrossIncome) / 12;
  const frontEndHousingBudget = grossMonthlyIncome * Math.max(0, inputs.frontEndRatio);
  const backEndHousingBudget = grossMonthlyIncome * Math.max(0, inputs.backEndRatio) - Math.max(0, inputs.monthlyDebts);
  const maximumMonthlyHousingBudget = Math.max(0, Math.min(frontEndHousingBudget, backEndHousingBudget));
  const monthlyOwnershipCosts = Math.max(0, inputs.annualPropertyTax) / 12 + Math.max(0, inputs.annualInsurance) / 12 + Math.max(0, inputs.monthlyHoa);
  const maximumPrincipalAndInterest = Math.max(0, maximumMonthlyHousingBudget - monthlyOwnershipCosts);
  const periods = Math.max(0, inputs.termYears) * 12;
  const monthlyRate = Math.max(0, inputs.annualRate) / 100 / 12;
  const maximumLoanAmount = periods === 0 ? 0 : monthlyRate === 0
    ? maximumPrincipalAndInterest * periods
    : maximumPrincipalAndInterest * (1 - Math.pow(1 + monthlyRate, -periods)) / monthlyRate;

  return {
    grossMonthlyIncome,
    frontEndHousingBudget,
    backEndHousingBudget: Math.max(0, backEndHousingBudget),
    maximumMonthlyHousingBudget,
    monthlyOwnershipCosts,
    maximumPrincipalAndInterest,
    maximumLoanAmount,
    maximumHomePrice: maximumLoanAmount + Math.max(0, inputs.downPayment),
  };
}
