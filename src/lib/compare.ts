import { calculateMortgage, type MortgageInputs, type MortgageResult } from './mortgage';

export type MortgageScenario = MortgageInputs & { name: string };
export type MortgageComparison = { name: string; result: MortgageResult };

export function compareMortgageScenarios(scenarios: MortgageScenario[]): MortgageComparison[] {
  return scenarios.map(({ name, ...inputs }) => ({ name, result: calculateMortgage(inputs) }));
}
