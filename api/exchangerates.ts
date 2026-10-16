import { Request, Response, Router } from 'express';

const router = Router();

// Fallback baseline SGD rates in case MAS API key is not yet set or during network/gateway maintenance
const BASELINE_RATES: Record<string, number> = {
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

/**
 * Normalizes MAS Statistical Bulletin Non-610 exchange rate records into 1 SGD = X Foreign Currency
 * 
 * In MAS reporting convention:
 * - Direct pairs (e.g. usd_sgd, eur_sgd, gbp_sgd) are reported as SGD per 1 unit of foreign currency.
 *   => 1 SGD = 1 / rate
 * - Pairs ending with _100 (e.g. myr_sgd_100, jpy_sgd_100, thb_sgd_100) are reported as SGD per 100 units of foreign currency.
 *   => 1 SGD = 100 / rate
 */
function normalizeMasRates(record: Record<string, any>): Record<string, number> {
  const normalized: Record<string, number> = { SGD: 1.0 };

  const directPairs: Record<string, string> = {
    USD: 'usd_sgd',
    EUR: 'eur_sgd',
    GBP: 'gbp_sgd',
    AUD: 'aud_sgd',
    CAD: 'cad_sgd',
    CHF: 'chf_sgd',
    NZD: 'nzd_sgd'
  };

  const hundredPairs: Record<string, string> = {
    MYR: 'myr_sgd_100',
    JPY: 'jpy_sgd_100',
    CNY: 'cny_sgd_100',
    HKD: 'hkd_sgd_100',
    THB: 'thb_sgd_100',
    IDR: 'idr_sgd_100',
    INR: 'inr_sgd_100',
    KRW: 'krw_sgd_100',
    TWD: 'twd_sgd_100',
    PHP: 'php_sgd_100',
    VND: 'vnd_sgd_100',
    AED: 'aed_sgd_100',
    SAR: 'sar_sgd_100',
    SEK: 'sek_sgd_100',
    NOK: 'nok_sgd_100',
    ZAR: 'zar_sgd_100'
  };

  // Parse direct 1-to-1 pairs
  for (const [currencyCode, fieldKey] of Object.entries(directPairs)) {
    const val = parseFloat(record[fieldKey]);
    if (!isNaN(val) && val > 0) {
      normalized[currencyCode] = Number((1 / val).toFixed(4));
    }
  }

  // Parse per-100 pairs
  for (const [currencyCode, fieldKey] of Object.entries(hundredPairs)) {
    const val = parseFloat(record[fieldKey]);
    if (!isNaN(val) && val > 0) {
      const perUnitSGD = val / 100;
      const rateAgainstSGD = 1 / perUnitSGD;
      normalized[currencyCode] = Number(rateAgainstSGD.toFixed(rateAgainstSGD > 100 ? 2 : 4));
    }
  }

  // Also parse any generic properties if MAS returns direct uppercase keys
  for (const [key, val] of Object.entries(record)) {
    const upper = key.toUpperCase();
    if (upper.length === 3 && typeof val === 'number') {
      normalized[upper] = val;
    }
  }

  return { ...BASELINE_RATES, ...normalized };
}

router.get('/', async (req: Request, res: Response) => {
  const masKeyId = process.env.MAS_KEY_ID || process.env.MAS_API_KEY_ID || '';
  const requestedDate = (req.query.end_of_day as string) || '';

  // Check if API key is provided
  if (!masKeyId || masKeyId.trim() === '') {
    return res.status(200).json({
      success: false,
      masConfigured: false,
      message: 'MAS_KEY_ID is not configured in environment variables. Set MAS_KEY_ID to pull live data from the MAS API Gateway.',
      base: 'SGD',
      source: 'Monetary Authority of Singapore (Benchmark Baseline)',
      timestamp: Date.now(),
      date: requestedDate || new Date().toISOString().split('T')[0],
      rates: BASELINE_RATES
    });
  }

  try {
    const masUrl = new URL(
      'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610ora/exchange_rates_end_of_period_daily/views/exchange_rates_end_of_period_daily'
    );

    if (requestedDate) {
      masUrl.searchParams.append('end_of_day', requestedDate);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(masUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'KeyId': masKeyId.trim()
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        success: false,
        masConfigured: true,
        message: `MAS API returned HTTP ${response.status}: ${response.statusText}`,
        error: errorText,
        base: 'SGD',
        source: 'Fallback Baseline (MAS Gateway Error)',
        rates: BASELINE_RATES
      });
    }

    const masData = await response.json();
    const records = masData.result?.records || masData.records || (Array.isArray(masData) ? masData : []);

    if (!records || records.length === 0) {
      return res.status(200).json({
        success: true,
        masConfigured: true,
        message: `MAS API returned no records for query (date: ${requestedDate || 'latest'}).`,
        base: 'SGD',
        source: 'MAS Baseline (No records for selected date)',
        timestamp: Date.now(),
        rates: BASELINE_RATES,
        rawResult: masData
      });
    }

    // Get the most recent record
    const latestRecord = records[records.length - 1];
    const normalizedRates = normalizeMasRates(latestRecord);

    return res.status(200).json({
      success: true,
      masConfigured: true,
      source: 'Monetary Authority of Singapore (MAS Live API)',
      base: 'SGD',
      end_of_day: latestRecord.end_of_day || requestedDate || new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      rates: normalizedRates,
      masRecord: latestRecord
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown network error';
    return res.status(500).json({
      success: false,
      masConfigured: true,
      message: `Failed to fetch from MAS API: ${errorMsg}`,
      base: 'SGD',
      source: 'Fallback Baseline (Network Timeout / Failure)',
      rates: BASELINE_RATES
    });
  }
});

export default router;
