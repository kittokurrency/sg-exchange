import { Currency, SpreadOption } from '../types/currency';

export const BASE_CURRENCY: Currency = {
  code: 'SGD',
  name: 'Singapore Dollar',
  symbol: 'S$',
  flag: '🇸🇬',
  region: 'ASEAN',
  popularWithSGD: true,
  decimals: 2,
  popularDenominations: [1000, 100, 50, 10, 5, 2],
  sgNotes: 'Primary home currency managed under MAS S$NEER monetary basket framework.'
};

export const CURRENCIES_LIST: Currency[] = [
  // ASEAN & Regional Corridors (Singapore's closest travel and economic partners)
  {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    flag: '🇲🇾',
    region: 'ASEAN',
    popularWithSGD: true,
    decimals: 4,
    popularDenominations: [100, 50, 20, 10, 5, 1],
    sgNotes: 'Heaviest cross-border volume via Causeway & Tuas. High demand for weekend travel and JB shopping.'
  },
  {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    flag: '🇮🇩',
    region: 'ASEAN',
    popularWithSGD: true,
    decimals: 0,
    popularDenominations: [100000, 50000, 20000, 10000, 5000, 2000],
    sgNotes: 'Frequent corridor for Batam & Bintan getaways, Bali tourism, and bilateral trade.'
  },
  {
    code: 'THB',
    name: 'Thai Baht',
    symbol: '฿',
    flag: '🇹🇭',
    region: 'ASEAN',
    popularWithSGD: true,
    decimals: 2,
    popularDenominations: [1000, 500, 100, 50, 20],
    sgNotes: 'Popular leisure destination for Singaporeans (Bangkok, Phuket, Chiang Mai).'
  },
  {
    code: 'PHP',
    name: 'Philippine Peso',
    symbol: '₱',
    flag: '🇵🇭',
    region: 'ASEAN',
    popularWithSGD: true,
    decimals: 2,
    popularDenominations: [1000, 500, 200, 100, 50, 20],
    sgNotes: 'Key corridor for domestic worker remittances and Southeast Asian travel.'
  },
  {
    code: 'VND',
    name: 'Vietnamese Dong',
    symbol: '₫',
    flag: '🇻🇳',
    region: 'ASEAN',
    popularWithSGD: true,
    decimals: 0,
    popularDenominations: [500000, 200000, 100000, 50000, 20000, 10000],
    sgNotes: 'Rapidly expanding commercial & vacation hub (Danang, Ho Chi Minh, Hanoi).'
  },

  // Major Global Currencies
  {
    code: 'USD',
    name: 'United States Dollar',
    symbol: '$',
    flag: '🇺🇸',
    region: 'Major',
    popularWithSGD: true,
    decimals: 4,
    popularDenominations: [100, 50, 20, 10, 5, 1],
    sgNotes: 'Primary benchmark currency for global commodity trades, US equities, and FX reserves.'
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    flag: '🇯🇵',
    region: 'Asia-Pacific',
    popularWithSGD: true,
    decimals: 2,
    popularDenominations: [10000, 5000, 2000, 1000],
    sgNotes: 'Huge favorite for Singapore holidaymakers; highly tracked by local money changers.'
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    region: 'Europe',
    popularWithSGD: true,
    decimals: 4,
    popularDenominations: [200, 100, 50, 20, 10, 5],
    sgNotes: 'Key benchmark for European business commerce, luxury imports, and EU vacations.'
  },
  {
    code: 'GBP',
    name: 'British Pound Sterling',
    symbol: '£',
    flag: '🇬🇧',
    region: 'Europe',
    popularWithSGD: true,
    decimals: 4,
    popularDenominations: [50, 20, 10, 5],
    sgNotes: 'Popular for overseas Singapore university students and UK commercial links.'
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    flag: '🇦🇺',
    region: 'Asia-Pacific',
    popularWithSGD: true,
    decimals: 4,
    popularDenominations: [100, 50, 20, 10, 5],
    sgNotes: 'Heavy student exchange, property investment, and holiday route for Singapore residents.'
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan (RMB)',
    symbol: '¥',
    flag: '🇨🇳',
    region: 'Asia-Pacific',
    popularWithSGD: true,
    decimals: 4,
    popularDenominations: [100, 50, 20, 10, 5, 1],
    sgNotes: 'Major trading partner with Singapore. Significant bilateral business clearing.'
  },
  {
    code: 'HKD',
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
    flag: '🇭🇰',
    region: 'Asia-Pacific',
    popularWithSGD: true,
    decimals: 4,
    popularDenominations: [1000, 500, 100, 50, 20],
    sgNotes: 'Pegged to USD. Twin Asian financial center corridor.'
  },
  {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    flag: '🇰🇷',
    region: 'Asia-Pacific',
    popularWithSGD: true,
    decimals: 0,
    popularDenominations: [50000, 10000, 5000, 1000],
    sgNotes: 'Top travel destination and K-culture consumer goods import.'
  },
  {
    code: 'TWD',
    name: 'New Taiwan Dollar',
    symbol: 'NT$',
    flag: '🇹🇼',
    region: 'Asia-Pacific',
    popularWithSGD: true,
    decimals: 2,
    popularDenominations: [1000, 500, 100],
    sgNotes: 'Beloved culinary travel and electronics corridor.'
  },
  {
    code: 'NZD',
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
    flag: '🇳🇿',
    region: 'Asia-Pacific',
    popularWithSGD: false,
    decimals: 4,
    popularDenominations: [100, 50, 20, 10, 5],
    sgNotes: 'Scenic road-trip destination for Singapore travelers.'
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    flag: '🇨🇦',
    region: 'Americas',
    popularWithSGD: false,
    decimals: 4,
    popularDenominations: [100, 50, 20, 10, 5],
    sgNotes: 'Education and North American trade corridor.'
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    flag: '🇨🇭',
    region: 'Europe',
    popularWithSGD: false,
    decimals: 4,
    popularDenominations: [1000, 200, 100, 50, 20, 10],
    sgNotes: 'Global safe haven asset and luxury horology import currency.'
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    region: 'Asia-Pacific',
    popularWithSGD: true,
    decimals: 2,
    popularDenominations: [500, 200, 100, 50, 20, 10],
    sgNotes: 'High volume remittance and strong tech corridor with Singapore.'
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED',
    flag: '🇦🇪',
    region: 'Middle East & Africa',
    popularWithSGD: true,
    decimals: 4,
    popularDenominations: [1000, 500, 200, 100, 50, 20, 10, 5],
    sgNotes: 'Middle East aviation transit (Dubai) and financial hub.'
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: 'SAR',
    flag: '🇸🇦',
    region: 'Middle East & Africa',
    popularWithSGD: false,
    decimals: 4,
    popularDenominations: [500, 100, 50, 20, 10, 5],
    sgNotes: 'Key for Hajj & Umrah pilgrimages from Singapore.'
  },
  {
    code: 'SEK',
    name: 'Swedish Krona',
    symbol: 'kr',
    flag: '🇸🇪',
    region: 'Europe',
    popularWithSGD: false,
    decimals: 4,
    popularDenominations: [500, 200, 100, 50, 20],
    sgNotes: 'Nordic business and innovation corridor.'
  },
  {
    code: 'NOK',
    name: 'Norwegian Krone',
    symbol: 'kr',
    flag: '🇳🇴',
    region: 'Europe',
    popularWithSGD: false,
    decimals: 4,
    popularDenominations: [1000, 500, 200, 100, 50],
    sgNotes: 'Maritime and offshore oil/gas trade.'
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    flag: '🇿🇦',
    region: 'Middle East & Africa',
    popularWithSGD: false,
    decimals: 2,
    popularDenominations: [200, 100, 50, 20, 10],
    sgNotes: 'African commodity and safari tourism.'
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    flag: '🇧🇷',
    region: 'Americas',
    popularWithSGD: false,
    decimals: 2,
    popularDenominations: [100, 50, 20, 10, 5, 2],
    sgNotes: 'Latin American trade and agriculture imports.'
  },
  {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: '$',
    flag: '🇲🇽',
    region: 'Americas',
    popularWithSGD: false,
    decimals: 2,
    popularDenominations: [500, 200, 100, 50, 20],
    sgNotes: 'Emerging market manufacturing corridor.'
  }
];

export const SPREAD_OPTIONS: SpreadOption[] = [
  {
    id: 'interbank',
    title: 'Interbank Mid-Market',
    spreadPercent: 0.0,
    description: 'Wholesale institutional FX rate quoted by MAS / Reuters without retail markup.',
    recommendedFor: 'Financial analysis & institutional benchmark',
    providers: 'MAS Reference, Bloomberg, SGX FX'
  },
  {
    id: 'multicard',
    title: 'Multi-Currency Card',
    spreadPercent: 0.45,
    description: 'Low-spread real-time rates typically offered by digital multi-currency travel cards.',
    recommendedFor: 'Overseas card tap & digital spending',
    providers: 'YouTrip, Wise, Revolut, Trust Bank'
  },
  {
    id: 'moneychanger',
    title: 'Physical Money Changer',
    spreadPercent: 0.85,
    description: 'Competitive cash note exchange at Singapore hotspots like The Arcade or Mustafa.',
    recommendedFor: 'Physical travel cash notes & foreign holiday currency',
    providers: 'The Arcade (Raffles Place), Mustafa Centre, People\'s Park'
  },
  {
    id: 'retailbank',
    title: 'Local Retail Bank OTC',
    spreadPercent: 2.50,
    description: 'Standard over-the-counter cash exchange or non-preferential wire transfer rate.',
    recommendedFor: 'Branch teller counter cash pickup',
    providers: 'DBS, OCBC, UOB branch tellers'
  }
];

// Baseline real-world benchmark rates against 1 SGD
export const BASELINE_SGD_RATES: Record<string, number> = {
  SGD: 1.0,
  MYR: 3.3285,
  USD: 0.7712,
  EUR: 0.7145,
  JPY: 118.42,
  GBP: 0.6034,
  AUD: 1.1892,
  CNY: 5.5640,
  HKD: 6.0125,
  IDR: 12280.0,
  THB: 25.68,
  PHP: 44.35,
  VND: 19650.0,
  KRW: 1068.5,
  TWD: 24.85,
  NZD: 1.2840,
  CAD: 1.0585,
  CHF: 0.6720,
  INR: 66.42,
  AED: 2.8320,
  SAR: 2.8940,
  SEK: 7.9850,
  NOK: 8.2410,
  ZAR: 13.820,
  BRL: 4.4120,
  MXN: 15.650
};

// 24h percentage baseline shifts for realistic financial visualization
export const BASELINE_24H_CHANGES: Record<string, number> = {
  MYR: 0.18,
  USD: -0.12,
  EUR: 0.08,
  JPY: -0.45,
  GBP: 0.22,
  AUD: -0.31,
  CNY: 0.05,
  HKD: -0.11,
  IDR: 0.35,
  THB: -0.15,
  PHP: 0.12,
  VND: 0.04,
  KRW: 0.28,
  TWD: -0.09,
  NZD: -0.22,
  CAD: 0.14,
  CHF: -0.08,
  INR: 0.15,
  AED: -0.12,
  SAR: -0.11,
  SEK: 0.42,
  NOK: 0.38,
  ZAR: -0.65,
  BRL: -0.41,
  MXN: 0.25
};
