import type { AmortizationRow, MortgageInputs } from './mortgage';

const csvCell = (value: string | number): string => {
  const text = String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return /[",\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
};

export function amortizationCsv(rows: AmortizationRow[]): string {
  const header = ['Period', 'Payment', 'Principal', 'Interest', 'Extra payment', 'Mortgage insurance', 'Balance'];
  const body = rows.map((row) => [row.period, row.payment, row.principal, row.interest, row.extraPayment, row.mortgageInsurance, row.balance].map(csvCell).join(','));
  return [header.map(csvCell).join(','), ...body].join('\n');
}

export function encodeMortgageShare(inputs: MortgageInputs): string {
  return btoa(encodeURIComponent(JSON.stringify(inputs)));
}

export function decodeMortgageShare(value: string): MortgageInputs | null {
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(atob(value)));
    if (!parsed || typeof parsed !== 'object' || !('loanAmount' in parsed) || !('annualRate' in parsed) || !('termYears' in parsed)) return null;
    return parsed as MortgageInputs;
  } catch { return null; }
}
