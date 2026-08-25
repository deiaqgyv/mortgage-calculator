import { describe, expect, it } from 'vitest';
import { albertaLandTitlesTransferFee, britishColumbiaFirstTimeBuyerRefund, britishColumbiaNewHomeRefund, britishColumbiaPropertyTransferTax, canadaJurisdictions, canadaTransactionCostKind, franceDepartmentDmtoRate, franceDepartments, franceExistingHomeTransferTax, franceNewHomeRegistrationTax, franceNewHomeTotalTax, germanGrunderwerbsteuer, germanTransferTax, manitobaLandTransferTax, newBrunswickRealPropertyTransferTax, newfoundlandDeedRegistrationFee, northwestTerritoriesLandTitleTransferFee, northwestTerritoriesMortgageRegistrationFee, novaScotiaMunicipalDeedTransferTax, novaScotiaMunicipalities, novaScotiaNonResidentDeedTransferTax, ontarioFirstTimeBuyerRefund, ontarioLandTransferTax, ontarioNonResidentSpeculationTax, princeEdwardIslandRealPropertyTransferTax, quebecImmovableTransferDuties, saskatchewanLandRegistryTransferFee, scotlandLbtt, spainAjdGeneralRate, spainAutonomousCommunities, spainItpGeneralRate, spainNewHomeTotalTax, spainNewHomeVat, spainUsedHomeItp, spainUsedHomeItpWithProfile, torontoFirstTimeBuyerRefund, torontoMunicipalLandTransferTax, torontoMunicipalNonResidentSpeculationTax, ukSdlt, walesLtt, yukonLandTitleTransferFee, yukonMortgageRegistrationFee } from '../taxes';

describe('official property tax rules', () => {
  it('calculates HMRC SDLT example for a £295,000 single property', () => expect(ukSdlt(295000)).toBe(4750));
  it('calculates Scottish LBTT at £300,000', () => expect(scotlandLbtt(300000)).toBe(4600));
  it('calculates Welsh main LTT at £350,000', () => expect(walesLtt(350000)).toBe(7500));
  it('applies official UK first-time, additional-property and non-resident options', () => {
    expect(ukSdlt(500000, { firstTimeBuyer: true })).toBe(10000);
    expect(ukSdlt(300000, { additionalProperty: true, nonUkResident: true })).toBe(26000);
    expect(scotlandLbtt(300000, true)).toBe(4000);
    expect(walesLtt(350000, true)).toBe(24950);
  });
  it('calculates Ontario transfer tax at CAD 400,000', () => expect(ontarioLandTransferTax(400000)).toBe(4475));
  it('caps official Ontario and Toronto first-time buyer refunds', () => {
    expect(ontarioFirstTimeBuyerRefund(4475, true)).toBe(4000);
    expect(torontoFirstTimeBuyerRefund(10000, true)).toBe(4475);
  });
  it('calculates Toronto municipal land transfer tax at CAD 2.5 million from April 2026', () => expect(torontoMunicipalLandTransferTax(2500000)).toBe(48975));
  it('calculates Ontario and Toronto non-resident speculation taxes', () => {
    expect(ontarioNonResidentSpeculationTax(400000, true)).toBe(100000);
    expect(torontoMunicipalNonResidentSpeculationTax(400000, true)).toBe(40000);
  });
  it('calculates official registration fees for Alberta and Newfoundland and Labrador', () => {
    expect(albertaLandTitlesTransferFee(450000)).toBe(500);
    expect(newfoundlandDeedRegistrationFee(450000)).toBe(1898);
  });
  it('calculates Yukon transfer and mortgage registration fees from the official tariff', () => {
    expect(yukonLandTitleTransferFee(450000)).toBe(610);
    expect(yukonMortgageRegistrationFee(360000)).toBe(100);
  });
  it('calculates Northwest Territories transfer and mortgage fees from the official schedule', () => {
    expect(northwestTerritoriesLandTitleTransferFee(450000)).toBe(900);
    expect(northwestTerritoriesMortgageRegistrationFee(360000)).toBe(540);
  });
  it('calculates Saskatchewan land registry transfer fees from the 2024 ISC schedule', () => {
    expect(saskatchewanLandRegistryTransferFee(500)).toBe(0);
    expect(saskatchewanLandRegistryTransferFee(450000)).toBe(1800);
  });
  it('calculates British Columbia property transfer tax at CAD 2.1 million', () => expect(britishColumbiaPropertyTransferTax(2100000)).toBeCloseTo(41000, 8));
  it('applies British Columbia first-time buyer exemption thresholds', () => {
    expect(britishColumbiaFirstTimeBuyerRefund(835000, true)).toBe(8000);
    expect(britishColumbiaFirstTimeBuyerRefund(860000, true)).toBe(0);
    expect(britishColumbiaFirstTimeBuyerRefund(900000, true)).toBe(0);
  });
  it('applies British Columbia newly built home exemption thresholds', () => {
    expect(britishColumbiaNewHomeRefund(1100000, true)).toBe(20000);
    expect(britishColumbiaNewHomeRefund(1150000, true)).toBe(0);
    expect(britishColumbiaNewHomeRefund(1200000, true)).toBe(0);
  });
  it('calculates Manitoba land transfer tax at CAD 250,000', () => expect(manitobaLandTransferTax(250000)).toBeCloseTo(2650, 8));
  it('calculates New Brunswick and PEI transfer tax from the greater of price and assessment', () => {
    expect(newBrunswickRealPropertyTransferTax(400000, 450000)).toBe(4500);
    expect(princeEdwardIslandRealPropertyTransferTax(400000, 450000)).toBe(4500);
  });
  it('calculates Quebec 2026 transfer duties at CAD 350,000', () => expect(quebecImmovableTransferDuties(350000)).toBeCloseTo(3360.5, 8));
  it('calculates Nova Scotia non-resident PDTT at the official 10% rate', () => expect(novaScotiaNonResidentDeedTransferTax(400000, 450000, 0.5)).toBe(22500));
  it('uses every municipality and the official Halifax 1.5% rate', () => {
    expect(novaScotiaMunicipalities).toHaveLength(49);
    expect(novaScotiaMunicipalDeedTransferTax(400000, 0.015)).toBe(6000);
  });
  it('uses the official German state rate', () => expect(germanTransferTax(400000, 'Bayern')).toBeCloseTo(14000, 8));
  it('applies the German statutory relationship exemption', () => expect(germanTransferTax(400000, 'Bayern', true)).toBe(0));
  it('separates French existing-home transfer tax from new-home VAT', () => {
    expect(franceExistingHomeTransferTax(300000, 0.05)).toBeCloseTo(18955.5, 1);
    expect(spainNewHomeVat(300000)).toBe(30000);
  });
  it('applies the French first-time main-residence relief to the temporary increase', () => {
    expect(franceExistingHomeTransferTax(300000, 0.05, true)).toBeCloseTo(17419.95, 1);
  });
  it('adds reduced French new-home registration tax to VAT', () => {
    expect(franceNewHomeRegistrationTax(300000)).toBeCloseTo(2145, 8);
    expect(franceNewHomeTotalTax(300000)).toBeCloseTo(62145, 8);
  });
  it('contains an official DMTO rate for every French department entry', () => {
    expect(Object.keys(franceDepartmentDmtoRate)).toHaveLength(franceDepartments.length);
    expect(franceDepartmentDmtoRate['Ain']).toBe(0.05);
    expect(franceDepartmentDmtoRate['Indre']).toBe(0.038);
    expect(franceDepartmentDmtoRate['Guadeloupe']).toBe(0.045);
  });
  it('contains an official 2026 general ITP rate for every Spanish community entry', () => {
    expect(Object.keys(spainItpGeneralRate)).toHaveLength(spainAutonomousCommunities.length);
    expect(spainItpGeneralRate['Comunidad de Madrid']).toBe(0.06);
    expect(spainItpGeneralRate['País Vasco']).toBe(0.04);
  });
  it('calculates official Spanish progressive ITP bands', () => {
    expect(spainUsedHomeItp(700000, 'Cataluña')).toBeCloseTo(71000, 8);
    expect(spainUsedHomeItp(500000, 'Extremadura')).toBeCloseTo(42800, 8);
  });
  it('applies encoded Spanish buyer-profile reliefs', () => {
    expect(spainUsedHomeItpWithProfile(250000, 'Illes Balears', { firstHome: true, habitualResidence: true })).toBeCloseTo(10000, 8);
    expect(spainUsedHomeItpWithProfile(150000, 'Extremadura', { habitualResidence: true, under35: true })).toBeCloseTo(5250, 8);
    expect(spainUsedHomeItpWithProfile(180000, 'Cantabria', { habitualResidence: true, disabled: true })).toBeCloseTo(7200, 8);
  });
  it('adds Spanish new-home AJD to IVA', () => {
    expect(spainAjdGeneralRate['Comunidad de Madrid']).toBe(0.0075);
    expect(spainNewHomeTotalTax(300000, 'Comunidad de Madrid')).toBe(32250);
  });
  it('has every supported Canadian jurisdiction in the official source registry', () => expect(canadaJurisdictions).toHaveLength(13));
  it('separates Canadian transfer taxes, registration fees, and manual-verification jurisdictions', () => {
    expect(canadaTransactionCostKind('ON')).toBe('land-transfer-tax');
    expect(canadaTransactionCostKind('SK')).toBe('registration-fees');
    expect(canadaTransactionCostKind('YT')).toBe('registration-fees');
    expect(canadaTransactionCostKind('NT')).toBe('registration-fees');
    expect(canadaTransactionCostKind('NU')).toBe('manual-verification-required');
  });
  it('has all 16 German states and 18 Spanish autonomous communities', () => {
    expect(Object.keys(germanGrunderwerbsteuer)).toHaveLength(16);
    expect(spainAutonomousCommunities).toHaveLength(19);
    expect(franceDepartments.length).toBeGreaterThan(100);
  });
});
