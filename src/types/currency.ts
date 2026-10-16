export type CurrencyRegion = 'ASEAN' | 'Major' | 'Asia-Pacific' | 'Europe' | 'Americas' | 'Middle East & Africa';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string; // ISO 2-letter country code or flag emoji
  region: CurrencyRegion;
  popularWithSGD: boolean;
  decimals: number;
  popularDenominations?: number[];
  sgNotes?: string;
}

export type SpreadType = 'interbank' | 'multicard' | 'moneychanger' | 'retailbank';

export interface SpreadOption {
  id: SpreadType;
  title: string;
  spreadPercent: number; // e.g. 0.0, 0.45, 0.85, 2.5
  description: string;
  recommendedFor: string;
  providers: string;
}

export interface ExchangeRatesData {
  base: string; // 'SGD'
  timestamp: number;
  lastUpdated: string;
  rates: Record<string, number>;
  changes24h: Record<string, number>;
  high24h: Record<string, number>;
  low24h: Record<string, number>;
  source: string;
  isBackendConnected: boolean;
  backendEndpoint?: string;
}

export interface ChartDataPoint {
  date: string;
  rate: number;
  timestamp: number;
}

export interface ConversionResult {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  effectiveRate: number;
  interbankRate: number;
  spreadCost: number;
  spreadPercent: number;
  spreadType: SpreadType;
  inverseRate: number;
}

export interface QuickConversionTarget {
  code: string;
  label: string;
  flag: string;
  symbol: string;
}
