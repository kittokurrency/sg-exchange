import { ExchangeRatesData, ChartDataPoint } from '../types/currency';
import { BASELINE_SGD_RATES, BASELINE_24H_CHANGES } from '../data/currencies';

const BACKEND_STORAGE_KEY = 'lionrate_custom_backend_url';
const RATES_CACHE_KEY = 'lionrate_cached_data';

export class ExchangeRateService {
  private static instance: ExchangeRateService;
  private customBackendUrl: string | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(BACKEND_STORAGE_KEY);
      this.customBackendUrl = stored || null;
    }
  }

  public static getInstance(): ExchangeRateService {
    if (!ExchangeRateService.instance) {
      ExchangeRateService.instance = new ExchangeRateService();
    }
    return ExchangeRateService.instance;
  }

  public getCustomBackendUrl(): string | null {
    return this.customBackendUrl;
  }

  public setCustomBackendUrl(url: string | null): void {
    this.customBackendUrl = url && url.trim().length > 0 ? url.trim() : null;
    if (typeof window !== 'undefined') {
      if (this.customBackendUrl) {
        localStorage.setItem(BACKEND_STORAGE_KEY, this.customBackendUrl);
      } else {
        localStorage.removeItem(BACKEND_STORAGE_KEY);
      }
    }
  }

  /**
   * Fetches latest SGD rates.
   * Priority:
   * 1. User's keyless backend endpoint if configured
   * 2. Keyless Public Open Exchange Rate Feed (https://open.er-api.com/v6/latest/SGD)
   * 3. Keyless Frankfurter Feed (https://api.frankfurter.app/latest?from=SGD)
   * 4. Reliable baseline fallback
   */
  public async fetchLatestRates(): Promise<ExchangeRatesData> {
    // 1. Try Custom Keyless Backend if user supplied one
    if (this.customBackendUrl) {
      try {
        const response = await fetch(this.customBackendUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Support various standard JSON formats
          const rates = data.rates || data.data?.rates || data;
          if (rates && typeof rates === 'object') {
            const transformedRates: Record<string, number> = { SGD: 1.0 };
            Object.entries(rates).forEach(([k, v]) => {
              if (typeof v === 'number') {
                transformedRates[k.toUpperCase()] = v;
              } else if (typeof v === 'string' && !isNaN(parseFloat(v))) {
                transformedRates[k.toUpperCase()] = parseFloat(v);
              }
            });

            const result: ExchangeRatesData = {
              base: 'SGD',
              timestamp: data.time_last_update_unix ? data.time_last_update_unix * 1000 : Date.now(),
              lastUpdated: new Date().toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              rates: transformedRates,
              changes24h: this.calculateChanges(transformedRates),
              high24h: this.calculateHighs(transformedRates),
              low24h: this.calculateLows(transformedRates),
              source: `Custom Keyless Backend (${new URL(this.customBackendUrl).hostname})`,
              isBackendConnected: true,
              backendEndpoint: this.customBackendUrl
            };

            this.cacheData(result);
            return result;
          }
        }
      } catch (err) {
        console.warn('Custom backend request failed, falling back to public feed:', err);
      }
    }

    // 2. Try Keyless Public Open Exchange Rate Feed (Open.er-api)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch('https://open.er-api.com/v6/latest/SGD', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.result === 'success' && json.rates) {
          const rates = { ...BASELINE_SGD_RATES, ...json.rates, SGD: 1.0 };
          const result: ExchangeRatesData = {
            base: 'SGD',
            timestamp: json.time_last_update_unix ? json.time_last_update_unix * 1000 : Date.now(),
            lastUpdated: new Date().toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            rates,
            changes24h: this.calculateChanges(rates),
            high24h: this.calculateHighs(rates),
            low24h: this.calculateLows(rates),
            source: 'Live Keyless Interbank Feed (open.er-api)',
            isBackendConnected: false
          };

          this.cacheData(result);
          return result;
        }
      }
    } catch {
      // Proceed to fallback
    }

    // 3. Try Frankfurter secondary open endpoint
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=SGD');
      if (res.ok) {
        const json = await res.json();
        if (json.rates) {
          const rates = { ...BASELINE_SGD_RATES, ...json.rates, SGD: 1.0 };
          const result: ExchangeRatesData = {
            base: 'SGD',
            timestamp: Date.now(),
            lastUpdated: new Date().toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            rates,
            changes24h: this.calculateChanges(rates),
            high24h: this.calculateHighs(rates),
            low24h: this.calculateLows(rates),
            source: 'Frankfurter ECB Keyless Feed',
            isBackendConnected: false
          };

          this.cacheData(result);
          return result;
        }
      }
    } catch {
      // Fallback
    }

    // 4. Return cached or reliable baseline dataset
    const cached = this.getCachedData();
    if (cached) {
      return cached;
    }

    return {
      base: 'SGD',
      timestamp: Date.now(),
      lastUpdated: new Date().toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      rates: BASELINE_SGD_RATES,
      changes24h: BASELINE_24H_CHANGES,
      high24h: this.calculateHighs(BASELINE_SGD_RATES),
      low24h: this.calculateLows(BASELINE_SGD_RATES),
      source: 'Singapore Benchmark Benchmark (Offline Ready)',
      isBackendConnected: false
    };
  }

  private calculateChanges(rates: Record<string, number>): Record<string, number> {
    const changes: Record<string, number> = {};
    for (const [code, rate] of Object.entries(rates)) {
      if (BASELINE_24H_CHANGES[code] !== undefined) {
        changes[code] = BASELINE_24H_CHANGES[code];
      } else {
        // Deterministic pseudo-random variation based on code
        const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const pseudoChange = ((hash % 100) - 48) / 100;
        changes[code] = Number(pseudoChange.toFixed(2));
      }
    }
    return changes;
  }

  private calculateHighs(rates: Record<string, number>): Record<string, number> {
    const highs: Record<string, number> = {};
    for (const [code, rate] of Object.entries(rates)) {
      const change = BASELINE_24H_CHANGES[code] || 0.15;
      const margin = Math.abs(change) * 0.015 + 0.003;
      highs[code] = Number((rate * (1 + margin)).toFixed(rate > 100 ? 1 : 4));
    }
    return highs;
  }

  private calculateLows(rates: Record<string, number>): Record<string, number> {
    const lows: Record<string, number> = {};
    for (const [code, rate] of Object.entries(rates)) {
      const change = BASELINE_24H_CHANGES[code] || 0.15;
      const margin = Math.abs(change) * 0.015 + 0.003;
      lows[code] = Number((rate * (1 - margin)).toFixed(rate > 100 ? 1 : 4));
    }
    return lows;
  }

  private cacheData(data: ExchangeRatesData): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(data));
      } catch {
        // quota exceeded or private mode
      }
    }
  }

  private getCachedData(): ExchangeRatesData | null {
    if (typeof window !== 'undefined') {
      try {
        const str = localStorage.getItem(RATES_CACHE_KEY);
        if (str) {
          return JSON.parse(str);
        }
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Generates realistic historical rates for Singapore Dollar vs Target Currency
   * for 1D, 1W, 1M, 3M, 1Y, 5Y.
   */
  public getHistoricalData(
    targetCurrency: string,
    currentRate: number,
    timeframe: '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'
  ): ChartDataPoint[] {
    const points: ChartDataPoint[] = [];
    const now = Date.now();
    let count = 24;
    let stepMs = 3600 * 1000; // 1 hour for 1D

    switch (timeframe) {
      case '1D':
        count = 24;
        stepMs = 3600 * 1000;
        break;
      case '1W':
        count = 14;
        stepMs = 12 * 3600 * 1000;
        break;
      case '1M':
        count = 30;
        stepMs = 24 * 3600 * 1000;
        break;
      case '3M':
        count = 30;
        stepMs = 3 * 24 * 3600 * 1000;
        break;
      case '1Y':
        count = 24;
        stepMs = 15 * 24 * 3600 * 1000;
        break;
      case '5Y':
        count = 30;
        stepMs = 60 * 24 * 3600 * 1000;
        break;
    }

    // Seeded random walk that ends exactly at currentRate
    const volatilityMap: Record<string, number> = {
      MYR: 0.008,
      USD: 0.005,
      JPY: 0.015,
      EUR: 0.006,
      THB: 0.009,
      IDR: 0.012,
      GBP: 0.008
    };

    const volatility = volatilityMap[targetCurrency] || 0.007;
    const values: number[] = [currentRate];

    // Build backwards
    let val = currentRate;
    for (let i = 1; i < count; i++) {
      const shiftPercent = (Math.sin(i * 0.7) * 0.5 + (Math.random() - 0.5) * 0.8) * volatility;
      val = val * (1 - shiftPercent);
      values.unshift(val);
    }

    for (let i = 0; i < count; i++) {
      const timestamp = now - (count - 1 - i) * stepMs;
      const d = new Date(timestamp);
      let dateLabel = '';

      if (timeframe === '1D') {
        dateLabel = d.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: false });
      } else if (timeframe === '1W' || timeframe === '1M') {
        dateLabel = d.toLocaleDateString('en-SG', { month: 'short', day: 'numeric' });
      } else {
        dateLabel = d.toLocaleDateString('en-SG', { month: 'short', year: '2-digit' });
      }

      const precision = currentRate > 100 ? (currentRate > 1000 ? 0 : 2) : 4;
      points.push({
        date: dateLabel,
        rate: Number(values[i].toFixed(precision)),
        timestamp
      });
    }

    return points;
  }
}

export const exchangeRateService = ExchangeRateService.getInstance();
