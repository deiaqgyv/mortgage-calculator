export type TaxSource = { name: string; url: string; effectiveFrom: string; reviewedAt: string };

export const taxSources = {
  ukSdlt: { name: 'HMRC SDLT residential rates', url: 'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates', effectiveFrom: '2025-04-01', reviewedAt: '2026-08-25' },
  scotlandLbtt: { name: 'Scottish Budget 2026-27 LBTT rates', url: 'https://www.gov.scot/publications/scottish-budget-2026-2027/pages/4/', effectiveFrom: '2026-04-01', reviewedAt: '2026-08-25' },
  walesLtt: { name: 'Welsh Revenue Authority LTT rates', url: 'https://www.gov.wales/land-transaction-tax-rates-and-bands', effectiveFrom: '2024-12-11', reviewedAt: '2026-08-25' },
  ontarioLtt: { name: 'Ontario Land Transfer Tax', url: 'https://www.ontario.ca/document/land-transfer-tax/calculating-land-transfer-tax', effectiveFrom: '2017-01-01', reviewedAt: '2026-08-25' },
  albertaLandTitlesFees: { name: 'Alberta Land Titles and Surveys Common Document Fee Schedule', url: 'https://www.alberta.ca/system/files/sartr-land-titles-and-surveys-common-documents-fee-schedule.pdf', effectiveFrom: '2024-10-20', reviewedAt: '2026-08-25' },
  newfoundlandDeedsFees: { name: 'Newfoundland and Labrador Registration of Deeds Prescribed Fees', url: 'https://www.gov.nl.ca/gs/files/forms-files-fees-deed.pdf', effectiveFrom: '2007-05-01', reviewedAt: '2026-08-25' },
  torontoMltt: { name: 'City of Toronto Municipal Land Transfer Tax', url: 'https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rates-and-fees/', effectiveFrom: '2026-04-01', reviewedAt: '2026-08-25' },
  ontarioNrst: { name: 'Ontario Non-Resident Speculation Tax', url: 'https://www.ontario.ca/document/land-transfer-tax/non-resident-speculation-tax', effectiveFrom: '2022-10-25', reviewedAt: '2026-08-25' },
  torontoMnrst: { name: 'Toronto Municipal Non-Resident Speculation Tax', url: 'https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rates-and-fees/', effectiveFrom: '2025-01-01', reviewedAt: '2026-08-25' },
  quebecDuties: { name: 'Government of Quebec immovable transfer duties', url: 'https://www.quebec.ca/gouvernement/gestion-municipale/finances-fiscalite-municipales/fiscalite/droits-mutations-immobilieres', effectiveFrom: '2026-01-01', reviewedAt: '2026-08-25' },
  newBrunswickRPTT: { name: 'New Brunswick Real Property Transfer Tax Act', url: 'https://laws.gnb.ca/en/document/cs/R-2.1', effectiveFrom: '2016-04-01', reviewedAt: '2026-08-25' },
  peiRPTT: { name: 'Prince Edward Island Real Property Transfer Tax', url: 'https://www.princeedwardisland.ca/en/information/finance-and-affordability/real-property-transfer-tax-introduction', effectiveFrom: '2026-04-08', reviewedAt: '2026-08-25' },
  novaScotiaMunicipalDTT: { name: 'Nova Scotia Municipal Deed Transfer Tax Rates', url: 'https://novascotia.ca/sns/pdf/ans-property-dtt-rates.pdf', effectiveFrom: '2026-04-01', reviewedAt: '2026-08-25' },
  novaScotiaNonResidentDTT: { name: 'Nova Scotia Non-resident Provincial Deed Transfer Tax', url: 'https://www.novascotia.ca/non-resident-provincial-deed-transfer-tax', effectiveFrom: '2025-04-01', reviewedAt: '2026-08-25' },
  saskatchewanLandRegistryFees: { name: 'Saskatchewan ISC land registry fees', url: 'https://www.isc.ca/SignedInHome/Fees/Pages/default.aspx', effectiveFrom: '2022-07-15', reviewedAt: '2026-08-25' },
  yukonLandTitlesFees: { name: 'Yukon Land Titles fees', url: 'https://yukon.ca/en/find-out-land-titles-fees', effectiveFrom: '2025-04-28', reviewedAt: '2026-08-25' },
  northwestTerritoriesLandTitlesFees: { name: 'Northwest Territories Land Titles fee schedule', url: 'https://www.justice.gov.nt.ca/en/land-titles/', effectiveFrom: '2022-01-01', reviewedAt: '2026-08-25' },
  germanyGrunderwerbsteuer: { name: 'German Federal Ministry of Finance, tax rates by state', url: 'https://www.bundesfinanzministerium.de/Content/DE/Downloads/Broschueren-Bestellservice/steuern-von-a-z.pdf', effectiveFrom: '2025-01-01', reviewedAt: '2026-08-25' },
  franceDmto: { name: 'French tax administration, registration duties', url: 'https://www.impots.gouv.fr/droits-denregistrement', effectiveFrom: '2026-06-01', reviewedAt: '2026-08-25' },
  spainPropertyTaxes: { name: 'Spanish government property purchase taxes', url: 'https://administracion.gob.es/pag_Home/va/Tu-espacio-europeo/derechos-obligaciones/ciudadanos/residencia/compraventa-bienes-inmuebles/impuestos', effectiveFrom: '2026-03-20', reviewedAt: '2026-08-25' },
} satisfies Record<string, TaxSource>;

export const canadaJurisdictions = [
  { code: 'BC', name: 'British Columbia', status: 'implemented', url: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/74_88' },
  { code: 'AB', name: 'Alberta', status: 'registration-fee-not-land-transfer-tax', url: 'https://www.alberta.ca/land-titles-fees' },
  { code: 'SK', name: 'Saskatchewan', status: 'registration-fee-not-land-transfer-tax', url: 'https://www.saskatchewan.ca/Government/news-and-media/2026/april/22/saskatchewan-introduces-legislation-to-amend-the-information-services-corporation-act' },
  { code: 'MB', name: 'Manitoba', status: 'implemented', url: 'https://www.gov.mb.ca/finance/other/print%2Clandtransfertax.html' },
  { code: 'ON', name: 'Ontario', status: 'implemented', url: 'https://www.ontario.ca/document/land-transfer-tax/calculating-land-transfer-tax' },
  { code: 'QC', name: 'Quebec', status: 'implemented', url: 'https://www.quebec.ca/gouvernement/gestion-municipale/finances-fiscalite-municipales/fiscalite/droits-mutations-immobilieres' },
  { code: 'NB', name: 'New Brunswick', status: 'implemented', url: 'https://laws.gnb.ca/en/document/cs/R-2.1' },
  { code: 'NS', name: 'Nova Scotia', status: 'implemented', url: 'https://novascotia.ca/sns/pdf/ans-property-dtt-rates.pdf' },
  { code: 'PE', name: 'Prince Edward Island', status: 'implemented', url: 'https://www.princeedwardisland.ca/en/information/finance-and-affordability/real-property-transfer-tax-introduction' },
  { code: 'NL', name: 'Newfoundland and Labrador', status: 'registration-fee-not-land-transfer-tax', url: 'https://www.gov.nl.ca/gs/registries/deeds/deed-reg/' },
  { code: 'YT', name: 'Yukon', status: 'registration-fee-not-land-transfer-tax', url: 'https://yukon.ca/en/land-titles' },
  { code: 'NT', name: 'Northwest Territories', status: 'registration-fee-not-land-transfer-tax', url: 'https://www.justice.gov.nt.ca/en/land-titles/' },
  { code: 'NU', name: 'Nunavut', status: 'manual-verification-required', url: 'https://www.gov.nu.ca/justice' },
] as const;

export type CanadaTransactionCostKind = 'land-transfer-tax' | 'registration-fees' | 'manual-verification-required';

export function canadaTransactionCostKind(code: string): CanadaTransactionCostKind {
  const jurisdiction = canadaJurisdictions.find((item) => item.code === code);
  if (jurisdiction?.status === 'registration-fee-not-land-transfer-tax') return 'registration-fees';
  if (jurisdiction?.status === 'manual-verification-required') return 'manual-verification-required';
  return 'land-transfer-tax';
}

export const novaScotiaMunicipalities = [
  ['Municipality of the County of Annapolis', 0.015], ['Town of Annapolis Royal', 0.015], ['Town of Middleton', 0.015], ['Municipality of the County of Antigonish', 0.01], ['Town of Antigonish', 0.015], ['Cape Breton Regional Municipality', 0.015], ['Municipality of Colchester', 0.015], ['Town of Stewiacke', 0.01], ['Town of Truro', 0.015], ['Municipality of the County of Cumberland', 0.015], ['Town of Amherst', 0.015], ['Town of Oxford', 0.015], ['Municipality of the District of Clare', 0.01], ['Municipality of the District of Digby', 0.01], ['Town of Digby', 0.015], ['Municipality of the District of Guysborough', 0.01], ['Municipality of the District of St. Mary’s', 0.0125], ['Town of Mulgrave', 0.015], ['Halifax Regional Municipality', 0.015], ['Municipality of the District of Hants East', 0.015], ['West Hants Regional Municipality', 0.015], ['Municipality of the County of Inverness', 0.015], ['Town of Port Hawkesbury', 0.015], ['Municipality of the County of Kings', 0.015], ['Town of Berwick', 0.0125], ['Town of Kentville', 0.015], ['Town of Wolfville', 0.015], ['Municipality of the District of Chester', 0.015], ['Municipality of the District of Lunenburg', 0.0125], ['Town of Bridgewater', 0.015], ['Town of Lunenburg', 0.015], ['Town of Mahone Bay', 0.015], ['Municipality of the County of Pictou', 0.01], ['Town of New Glasgow', 0.01], ['Town of Pictou', 0.01], ['Town of Stellarton', 0.01], ['Town of Trenton', 0.01], ['Town of Westville', 0.01], ['Region of Queens Municipality', 0.015], ['Municipality of the County of Richmond', 0.015], ['Municipality of the District of Barrington', 0.015], ['Municipality of the District of Shelburne', 0.015], ['Town of Clark’s Harbour', 0.01], ['Town of Lockeport', 0.015], ['Town of Shelburne', 0.015], ['Municipality of the County of Victoria', 0.015], ['Municipality of the District of Argyle', 0.01], ['Municipality of the District of Yarmouth', 0.01], ['Town of Yarmouth', 0.01],
] as const;

export const franceDepartments = ['Ain', 'Aisne', 'Allier', 'Alpes-de-Haute-Provence', 'Hautes-Alpes', 'Alpes-Maritimes', 'Ardèche', 'Ardennes', 'Ariège', 'Aube', 'Aude', 'Aveyron', 'Bouches-du-Rhône', 'Calvados', 'Cantal', 'Charente', 'Charente-Maritime', 'Cher', 'Corrèze', 'Corse-du-Sud', 'Haute-Corse', 'Côte-d’Or', 'Côtes-d’Armor', 'Creuse', 'Dordogne', 'Doubs', 'Drôme', 'Eure', 'Eure-et-Loir', 'Finistère', 'Gard', 'Haute-Garonne', 'Gers', 'Gironde', 'Hérault', 'Ille-et-Vilaine', 'Indre', 'Indre-et-Loire', 'Isère', 'Jura', 'Landes', 'Loir-et-Cher', 'Loire', 'Haute-Loire', 'Loire-Atlantique', 'Loiret', 'Lot', 'Lot-et-Garonne', 'Lozère', 'Maine-et-Loire', 'Manche', 'Marne', 'Haute-Marne', 'Mayenne', 'Meurthe-et-Moselle', 'Meuse', 'Morbihan', 'Moselle', 'Nièvre', 'Nord', 'Oise', 'Orne', 'Pas-de-Calais', 'Puy-de-Dôme', 'Pyrénées-Atlantiques', 'Hautes-Pyrénées', 'Pyrénées-Orientales', 'Bas-Rhin', 'Haut-Rhin', 'Rhône', 'Haute-Saône', 'Saône-et-Loire', 'Sarthe', 'Savoie', 'Haute-Savoie', 'Paris', 'Seine-Maritime', 'Seine-et-Marne', 'Yvelines', 'Deux-Sèvres', 'Somme', 'Tarn', 'Tarn-et-Garonne', 'Var', 'Vaucluse', 'Vendée', 'Vienne', 'Haute-Vienne', 'Vosges', 'Yonne', 'Territoire de Belfort', 'Essonne', 'Hauts-de-Seine', 'Seine-Saint-Denis', 'Val-de-Marne', 'Val-d’Oise', 'Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte'] as const;

export const franceDepartmentDmtoRate: Record<string, number> = Object.fromEntries(franceDepartments.map((department) => [department, 0.05]));
for (const department of ['Hautes-Alpes', 'Alpes-Maritimes', 'Ardèche', 'Charente', 'Drôme', 'Lozère', 'Oise', 'Saône-et-Loire', 'Guadeloupe', 'Mayotte']) franceDepartmentDmtoRate[department] = 0.045;
franceDepartmentDmtoRate['Indre'] = 0.038;

export const spainAutonomousCommunities = ['Andalucía', 'Aragón', 'Asturias', 'Illes Balears', 'Canarias', 'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Cataluña', 'Comunitat Valenciana', 'Extremadura', 'Galicia', 'Comunidad de Madrid', 'Región de Murcia', 'Navarra', 'País Vasco', 'La Rioja', 'Ceuta', 'Melilla'] as const;
export const spainItpGeneralRate: Record<string, number> = {
  'Andalucía': 0.07, Aragón: 0.08, Asturias: 0.08, 'Illes Balears': 0.08, Canarias: 0.065, Cantabria: 0.09, 'Castilla-La Mancha': 0.09, 'Castilla y León': 0.08, Cataluña: 0.10, 'Comunitat Valenciana': 0.09, Extremadura: 0.08, Galicia: 0.08, 'Comunidad de Madrid': 0.06, 'Región de Murcia': 0.08, Navarra: 0.06, 'País Vasco': 0.04, 'La Rioja': 0.07, Ceuta: 0.06, Melilla: 0.06,
};
export const spainAjdGeneralRate: Record<string, number> = {
  'Andalucía': 0.012, Aragón: 0.015, Asturias: 0.012, 'Illes Balears': 0.015, Canarias: 0.0075, Cantabria: 0.015, 'Castilla-La Mancha': 0.015, 'Castilla y León': 0.015, Cataluña: 0.015, 'Comunitat Valenciana': 0.015, Extremadura: 0.015, Galicia: 0.015, 'Comunidad de Madrid': 0.0075, 'Región de Murcia': 0.015, Navarra: 0.005, 'País Vasco': 0.005, 'La Rioja': 0.015, Ceuta: 0.005, Melilla: 0.005,
};
export const spainItpBands: Record<string, readonly Band[]> = {
  Cataluña: [[600000, 0.10], [900000, 0.11], [1500000, 0.12], [Infinity, 0.13]],
  'Illes Balears': [[400000, 0.08], [600000, 0.09], [1000000, 0.10], [2000000, 0.12], [Infinity, 0.13]],
  Extremadura: [[360000, 0.08], [600000, 0.10], [Infinity, 0.11]],
  'Comunitat Valenciana': [[1000000, 0.09], [Infinity, 0.11]],
  'Castilla y León': [[250000, 0.08], [Infinity, 0.10]],
};
export type SpainBuyerProfile = { habitualResidence?: boolean; firstHome?: boolean; under35?: boolean; disabled?: boolean; largeFamily?: boolean; protectedHousing?: boolean };
export const spainReducedItpRules: Record<string, string> = {
  Andalucía: '7% general; reduced rates depend on habitual residence and buyer profile',
  Aragón: 'reduced rates depend on habitual residence and family profile',
  Asturias: '3% for certain protected-housing resales',
  Cantabria: '7% habitual residence under €200,000; 4% for specified family/disability profiles',
  'Castilla-La Mancha': 'reduced rates depend on habitual residence and protected-housing status',
  'Castilla y León': '4% for specified large-family, disability, youth or protected-housing cases',
  Cataluña: '5% for certain large-family habitual residences; 7% protected housing',
  'Comunitat Valenciana': 'reduced rates for first habitual residence, youth, disability and protected housing',
  Extremadura: '6% habitual residence up to €150,000; 3.5% for specified youth/disability cases',
  Galicia: '7% habitual residence under specified wealth/value limits',
  'Comunidad de Madrid': '4% for specified large-family habitual residence',
  'Región de Murcia': '5% large-family habitual residence; 3% for specified conditions',
  'Illes Balears': '4% first habitual residence under the official value threshold',
};

type Band = readonly [limit: number, rate: number];
function marginalTax(value: number, bands: readonly Band[]): number {
  let previous = 0; let total = 0;
  for (const [limit, rate] of bands) { const slice = Math.max(0, Math.min(value, limit) - previous); total += slice * rate; previous = limit; if (value <= limit) break; }
  return Math.max(0, total);
}

export function ukSdlt(value: number, options: { firstTimeBuyer?: boolean; additionalProperty?: boolean; nonUkResident?: boolean } = {}): number {
  const { firstTimeBuyer = false, additionalProperty = false, nonUkResident = false } = options;
  if (firstTimeBuyer && value > 500000) return ukSdlt(value, { additionalProperty, nonUkResident });
  const bands: readonly Band[] = firstTimeBuyer ? [[300000, 0], [500000, 0.05], [Infinity, 0.05]] : [[125000, 0], [250000, 0.02], [925000, 0.05], [1500000, 0.1], [Infinity, 0.12]];
  const surcharge = (additionalProperty ? 0.05 : 0) + (nonUkResident ? 0.02 : 0);
  return marginalTax(value, bands.map(([limit, rate]) => [limit, rate + surcharge] as const));
}

export function scotlandLbtt(value: number, firstTimeBuyer = false, additionalProperty = false): number {
  const bands: readonly Band[] = firstTimeBuyer ? [[175000, 0], [250000, 0.02], [325000, 0.05], [750000, 0.1], [Infinity, 0.12]] : [[145000, 0], [250000, 0.02], [325000, 0.05], [750000, 0.1], [Infinity, 0.12]];
  const surcharge = additionalProperty ? 0.08 : 0;
  return marginalTax(value, bands.map(([limit, rate]) => [limit, rate + surcharge] as const));
}

export function walesLtt(value: number, additionalProperty = false): number {
  const bands: readonly Band[] = additionalProperty ? [[180000, 0.05], [250000, 0.085], [400000, 0.1], [750000, 0.125], [1500000, 0.15], [Infinity, 0.17]] : [[225000, 0], [400000, 0.06], [750000, 0.075], [1500000, 0.1], [Infinity, 0.12]];
  return marginalTax(value, bands);
}

export function ontarioLandTransferTax(value: number, singleFamilyResidence = true): number {
  const bands: readonly Band[] = [[55000, 0.005], [250000, 0.01], [400000, 0.015], [singleFamilyResidence ? 2000000 : Infinity, 0.02], [Infinity, 0.025]];
  return marginalTax(value, bands);
}
export function albertaLandTitlesTransferFee(value: number): number { return 50 + Math.ceil(Math.max(0, value) / 5000) * 5; }
export function newfoundlandDeedRegistrationFee(value: number): number { return 100 + Math.ceil(Math.max(0, value - 500) / 100) * 0.4; }
export function yukonLandTitleTransferFee(value: number): number {
  const declared = Math.max(0, value);
  const base = declared < 100000 ? 50 : declared < 500000 ? 150 : declared < 3000000 ? 350 : declared < 10000000 ? 550 : 750;
  return base + 20 + Math.ceil(Math.max(0, declared - 10000) / 10000) * 10;
}
export function yukonMortgageRegistrationFee(value: number): number { const amount = Math.max(0, value); return amount < 100000 ? 50 : amount < 500000 ? 100 : amount < 1000000 ? 200 : amount < 5000000 ? 400 : amount < 10000000 ? 600 : amount < 20000000 ? 800 : 1000; }
export function northwestTerritoriesLandTitleTransferFee(value: number): number { const declared = Math.max(0, value); return declared <= 1000000 ? Math.max(100, Math.ceil(declared / 1000) * 2) : 2000 + Math.ceil((declared - 1000000) / 1000) * 1.5; }
export function northwestTerritoriesMortgageRegistrationFee(value: number): number { return Math.max(80, Math.ceil(Math.max(0, value) / 1000) * 1.5); }
export function saskatchewanLandRegistryTransferFee(value: number): number { const declared = Math.max(0, value); return declared <= 500 ? 0 : declared <= 6300 ? 25 : declared * 0.004; }
export function torontoMunicipalLandTransferTax(value: number, singleFamilyResidence = true): number {
  const bands: readonly Band[] = singleFamilyResidence ? [[55000, 0.005], [250000, 0.01], [400000, 0.015], [2000000, 0.02], [3000000, 0.025], [4000000, 0.044], [5000000, 0.0545], [10000000, 0.065], [20000000, 0.0755], [Infinity, 0.086]] : [[55000, 0.005], [250000, 0.01], [400000, 0.015], [Infinity, 0.02]];
  return marginalTax(value, bands);
}
export function ontarioNonResidentSpeculationTax(value: number, nonResident = false): number { return nonResident ? value * 0.25 : 0; }
export function torontoMunicipalNonResidentSpeculationTax(value: number, nonResident = false): number { return nonResident ? value * 0.1 : 0; }
export function ontarioFirstTimeBuyerRefund(tax: number, eligible = false): number { return eligible ? Math.min(Math.max(0, tax), 4000) : 0; }
export function torontoFirstTimeBuyerRefund(tax: number, eligible = false): number { return eligible ? Math.min(Math.max(0, tax), 4475) : 0; }

export function britishColumbiaPropertyTransferTax(value: number): number { return marginalTax(value, [[200000, 0.01], [2000000, 0.02], [Infinity, 0.03]]); }
export function britishColumbiaFirstTimeBuyerRefund(value: number, eligible = false): number {
  if (!eligible || value > 860000) return 0;
  const baseRefund = Math.min(britishColumbiaPropertyTransferTax(value), 8000);
  return value <= 835000 ? baseRefund : baseRefund * ((860000 - value) / 25000);
}
export function britishColumbiaNewHomeRefund(value: number, eligible = false): number {
  if (!eligible || value > 1150000) return 0;
  const tax = britishColumbiaPropertyTransferTax(value);
  return value <= 1100000 ? tax : tax * ((1150000 - value) / 50000);
}
export function manitobaLandTransferTax(value: number): number { return marginalTax(value, [[30000, 0], [90000, 0.005], [150000, 0.01], [200000, 0.015], [Infinity, 0.02]]); }
export function quebecImmovableTransferDuties(value: number, municipalHighRate = 0.015): number { return marginalTax(value, [[62900, 0.005], [315000, 0.01], [500000, municipalHighRate], [Infinity, municipalHighRate]]); }
export function newBrunswickRealPropertyTransferTax(value: number, assessedValue = value): number { return Math.max(value, assessedValue) * 0.01; }
export function princeEdwardIslandRealPropertyTransferTax(value: number, assessedValue = value): number { return Math.max(value, assessedValue) * 0.01; }
export function novaScotiaNonResidentDeedTransferTax(value: number, assessedValue = value, ownershipInterest = 1): number { return Math.max(value, assessedValue) * ownershipInterest * 0.1; }
export function novaScotiaMunicipalDeedTransferTax(value: number, rate: number, assessedValue = value): number { return Math.max(value, assessedValue) * rate; }

export const germanGrunderwerbsteuer: Record<string, number> = { 'Baden-Württemberg': 0.05, Bayern: 0.035, Berlin: 0.06, Brandenburg: 0.065, Bremen: 0.05, Hamburg: 0.045, Hessen: 0.06, 'Mecklenburg-Vorpommern': 0.05, Niedersachsen: 0.05, 'Nordrhein-Westfalen': 0.065, 'Rheinland-Pfalz': 0.05, Saarland: 0.065, Sachsen: 0.035, 'Sachsen-Anhalt': 0.05, 'Schleswig-Holstein': 0.065, Thüringen: 0.065 };
export function germanTransferTax(value: number, state: string, exemptRelationship = false): number { return exemptRelationship ? 0 : value * (germanGrunderwerbsteuer[state] ?? 0.05); }

export function franceExistingHomeTransferTax(value: number, departmentRate = 0.05, firstTimeBuyer = false): number {
  const applicableDepartmentRate = firstTimeBuyer && departmentRate >= 0.05 ? departmentRate - 0.005 : departmentRate;
  return value * (applicableDepartmentRate + applicableDepartmentRate * 0.0237 + 0.012);
}
export function franceNewHomeVat(value: number, reducedRate = false): number { return value * (reducedRate ? 0.055 : 0.2); }
export function franceNewHomeRegistrationTax(value: number): number { return value * 0.00715; }
export function franceNewHomeTotalTax(value: number, reducedVat = false): number { return franceNewHomeVat(value, reducedVat) + franceNewHomeRegistrationTax(value); }

export function spainNewHomeVat(value: number, protectedHousing = false): number { return value * (protectedHousing ? 0.04 : 0.1); }
export function spainNewHomeTotalTax(value: number, community: string, protectedHousing = false): number { return spainNewHomeVat(value, protectedHousing) + value * (spainAjdGeneralRate[community] ?? 0.015); }
export function spainUsedHomeTransferTax(value: number, regionalRate: number): number { return value * regionalRate; }
export function spainUsedHomeItp(value: number, community: string): number { return marginalTax(value, spainItpBands[community] ?? [[Infinity, spainItpGeneralRate[community] ?? 0.06]]); }
export function spainUsedHomeItpWithProfile(value: number, community: string, profile: SpainBuyerProfile): number {
  if (community === 'Illes Balears' && profile.firstHome && profile.habitualResidence && value <= 270151.2) return value * 0.04;
  if (community === 'Extremadura' && profile.habitualResidence && value <= 150000 && profile.under35) return value * 0.035;
  if (community === 'Extremadura' && profile.habitualResidence && value <= 150000) return value * 0.06;
  if (community === 'Cantabria' && profile.habitualResidence && (profile.largeFamily || profile.disabled)) return value * 0.04;
  if (community === 'Cantabria' && profile.habitualResidence && value < 200000) return value * 0.07;
  if (community === 'Castilla y León' && profile.habitualResidence && (profile.largeFamily || profile.disabled || profile.under35 || profile.protectedHousing)) return value * 0.04;
  if (community === 'Cataluña' && profile.habitualResidence && profile.largeFamily) return value * 0.05;
  if (community === 'Cataluña' && profile.protectedHousing) return value * 0.07;
  if (community === 'Galicia' && profile.habitualResidence && value <= 240000) return value * 0.07;
  if (community === 'Comunidad de Madrid' && profile.habitualResidence && profile.largeFamily) return value * 0.04;
  if (community === 'Región de Murcia' && profile.habitualResidence && profile.largeFamily) return value * 0.05;
  return spainUsedHomeItp(value, community);
}
