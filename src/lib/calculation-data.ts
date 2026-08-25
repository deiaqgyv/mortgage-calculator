import type { CountryCode } from './mortgage';

export type CalculationData = {
  version: string;
  effectiveFrom: string;
  reviewedAt: string;
  applicability: string;
  formula: string;
  rounding: string;
  included: string;
  excluded: string;
};

export const calculationDataByCountry: Record<CountryCode, CalculationData> = {
  US: {
    version: 'US-2026.08', effectiveFrom: '2026-08-25', reviewedAt: '2026-08-25',
    applicability: 'Fixed-rate illustrative loans; property tax, insurance, flood cover and HOA are user-entered.',
    formula: 'Monthly nominal-rate amortization; PMI estimate only when LTV exceeds 80%.',
    rounding: 'Calculations retain precision; displayed currency is rounded to whole dollars.',
    included: 'Principal, interest, optional extra payments, user-entered recurring costs and illustrative PMI.',
    excluded: 'Lender pricing, closing costs, program-specific MIP or funding fees, and prepayment penalties.',
  },
  GB: {
    version: 'GB-2026.08', effectiveFrom: '2025-04-01', reviewedAt: '2026-08-25',
    applicability: 'Repayment or interest-only illustrations for England, Northern Ireland, Scotland and Wales.',
    formula: 'Monthly nominal-rate amortization with SDLT, LBTT or LTT calculated separately.',
    rounding: 'Calculations retain precision; displayed currency is rounded to whole pounds.',
    included: 'Principal, interest, optional extra payments and the selected transaction-tax estimate.',
    excluded: 'Lender fees, insurance, conveyancing, valuation, broker fees and early-repayment charges.',
  },
  CA: {
    version: 'CA-2026.08', effectiveFrom: '2026-01-01', reviewedAt: '2026-08-25',
    applicability: 'Canadian quoted rates with supported provincial transfer-tax or land-registry fee rules.',
    formula: 'Semi-annual compounding conversion to the selected payment frequency.',
    rounding: 'Calculations retain precision; displayed currency is rounded to whole Canadian dollars.',
    included: 'Principal, interest, optional extra payments and supported provincial tax or registration-fee estimates.',
    excluded: 'Mortgage default insurance premiums, lender fees, local fees without stable formulas and Nunavut registration costs.',
  },
  DE: {
    version: 'DE-2026.08', effectiveFrom: '2025-01-01', reviewedAt: '2026-08-25',
    applicability: 'Fixed-rate annuity illustrations with the selected Bundesland transfer-tax rate.',
    formula: 'Monthly nominal-rate annuity amortization and balance at the end of the selected fixed period.',
    rounding: 'Calculations retain precision; displayed currency is rounded to whole euros.',
    included: 'Principal, interest, optional extra payments and Grunderwerbsteuer estimate.',
    excluded: 'Notary, land-register, broker, lender and refinancing costs.',
  },
  FR: {
    version: 'FR-2026.08', effectiveFrom: '2026-06-01', reviewedAt: '2026-08-25',
    applicability: 'Existing and new-home illustrations using the selected département and buyer inputs.',
    formula: 'Monthly nominal-rate amortization; DMTO for existing homes and VAT plus registration tax for new homes.',
    rounding: 'Calculations retain precision; displayed currency is rounded to whole euros.',
    included: 'Principal, interest, optional extra payments and encoded transfer-tax estimate.',
    excluded: 'Notary disbursements, lender fees, insurance and eligibility conditions not captured by the inputs.',
  },
  ES: {
    version: 'ES-2026.08', effectiveFrom: '2026-03-20', reviewedAt: '2026-08-25',
    applicability: 'Existing and new-home illustrations using the selected autonomous community and buyer profile.',
    formula: 'Monthly nominal-rate amortization; ITP for existing homes and IVA plus AJD for new homes.',
    rounding: 'Calculations retain precision; displayed currency is rounded to whole euros.',
    included: 'Principal, interest, optional extra payments and encoded regional property-tax estimate.',
    excluded: 'Notary, registry, gestoría, lender fees and relief eligibility not represented by the inputs.',
  },
};

export function calculationDataForCountry(country: CountryCode): CalculationData {
  return calculationDataByCountry[country];
}
