import { describe, expect, it } from 'vitest';
import { calculationDataByCountry, calculationDataForCountry } from '../calculation-data';

describe('calculation data governance', () => {
  it('registers an auditable data version for every supported country', () => {
    expect(Object.keys(calculationDataByCountry).sort()).toEqual(['CA', 'DE', 'ES', 'FR', 'GB', 'US']);
    for (const country of Object.keys(calculationDataByCountry) as Array<keyof typeof calculationDataByCountry>) {
      const data = calculationDataForCountry(country);
      expect(data.version).toMatch(/^[A-Z]{2}-\d{4}\.\d{2}$/);
      expect(data.effectiveFrom).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(data.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(data.applicability).not.toHaveLength(0);
      expect(data.included).not.toHaveLength(0);
      expect(data.excluded).not.toHaveLength(0);
    }
  });
});
