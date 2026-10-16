import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MarketStatusBar } from './components/MarketStatusBar';
import { CurrencyConverter } from './components/CurrencyConverter';
import { RateChart } from './components/RateChart';
import { RatesTable } from './components/RatesTable';
import { AseanCorridorHub } from './components/AseanCorridorHub';
import { MoneyChangerVsBank } from './components/MoneyChangerVsBank';
import { RateAlertWatch } from './components/RateAlertWatch';
import { BackendConnectionModal } from './components/BackendConnectionModal';
import { exchangeRateService } from './services/exchangeRateService';
import { ExchangeRatesData } from './types/currency';
import { BASELINE_SGD_RATES, BASELINE_24H_CHANGES, CURRENCIES_LIST } from './data/currencies';
import { ArrowRight, Compass, TrendingUp, ShieldCheck, Banknote, Sparkles, Server } from 'lucide-react';

export default function App() {
  const [ratesData, setRatesData] = useState<ExchangeRatesData>({
    base: 'SGD',
    timestamp: Date.now(),
    lastUpdated: 'Loading...',
    rates: BASELINE_SGD_RATES,
    changes24h: BASELINE_24H_CHANGES,
    high24h: {},
    low24h: {},
    source: 'Initializing...',
    isBackendConnected: false
  });

  const [activeTab, setActiveTab] = useState<string>('converter');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('MYR');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState<boolean>(false);

  // Load real-time rates
  const loadRates = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const data = await exchangeRateService.fetchLatestRates();
      setRatesData(data);
    } catch (err) {
      console.error('Failed to load rates:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRates();
    // Refresh every 60 seconds
    const interval = setInterval(loadRates, 60000);
    return () => clearInterval(interval);
  }, [loadRates]);

  const handleSelectCurrency = (code: string) => {
    setSelectedCurrency(code);
    if (activeTab !== 'converter') {
      setActiveTab('converter');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Popular quick snapshot currencies
  const snapshotCurrencies = ['MYR', 'USD', 'JPY', 'EUR', 'THB', 'IDR'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={loadRates}
        isRefreshing={isRefreshing}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
        isBackendConnected={ratesData.isBackendConnected}
        backendEndpoint={ratesData.backendEndpoint}
      />

      {/* Singapore Market Status & Time Bar */}
      <MarketStatusBar
        lastUpdated={ratesData.lastUpdated}
        source={ratesData.source}
        isBackendConnected={ratesData.isBackendConnected}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
      />

      {/* Quick Corridor Snapshot Strip */}
      <section className="border-b border-slate-800/60 bg-slate-900/40 py-2.5 px-4 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400 shrink-0">
            <span className="font-semibold text-slate-300">S$1.00 SGD =</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-1">
            {snapshotCurrencies.map((code) => {
              const cur = CURRENCIES_LIST.find((c) => c.code === code);
              const rate = ratesData.rates[code] || 1;
              const chg = ratesData.changes24h[code] || 0;
              const isPos = chg >= 0;

              return (
                <button
                  key={code}
                  onClick={() => handleSelectCurrency(code)}
                  className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer group ${
                    selectedCurrency === code ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  <span className="text-sm">{cur?.flag}</span>
                  <span className="font-bold font-mono text-slate-200 group-hover:text-rose-400">
                    {code}
                  </span>
                  <span className="font-mono tabular-nums text-slate-300">
                    {rate.toFixed(rate > 100 ? (rate > 1000 ? 0 : 2) : 4)}
                  </span>
                  <span
                    className={`font-mono tabular-nums text-[11px] ${
                      isPos ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isPos ? '+' : ''}{chg.toFixed(2)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: CONVERTER (Default Hub) */}
        {activeTab === 'converter' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Currency Converter */}
            <CurrencyConverter
              rates={ratesData.rates}
              selectedCurrency={selectedCurrency}
              onSelectCurrency={setSelectedCurrency}
            />

            {/* Interactive Trend Chart */}
            <RateChart
              baseCurrency="SGD"
              targetCurrency={selectedCurrency}
              currentRate={ratesData.rates[selectedCurrency] || 3.3285}
            />

            {/* Target Rate & Savings Calculator */}
            <RateAlertWatch rates={ratesData.rates} />

            {/* Quick Preview of Rates Matrix */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-200">
                  Global Currencies Benchmark
                </h3>
                <button
                  onClick={() => setActiveTab('rates')}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
                >
                  <span>View All 25+ Currencies</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <RatesTable
                rates={ratesData.rates}
                changes24h={ratesData.changes24h}
                high24h={ratesData.high24h}
                low24h={ratesData.low24h}
                onSelectCurrency={handleSelectCurrency}
              />
            </div>
          </div>
        )}

        {/* TAB 2: LIVE RATES MATRIX */}
        {activeTab === 'rates' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <RatesTable
              rates={ratesData.rates}
              changes24h={ratesData.changes24h}
              high24h={ratesData.high24h}
              low24h={ratesData.low24h}
              onSelectCurrency={handleSelectCurrency}
            />
          </div>
        )}

        {/* TAB 3: ASEAN CORRIDORS */}
        {activeTab === 'asean' && (
          <div className="animate-in fade-in duration-200">
            <AseanCorridorHub
              rates={ratesData.rates}
              onSelectCurrency={handleSelectCurrency}
            />
          </div>
        )}

        {/* TAB 4: SPREADS & BANKS */}
        {activeTab === 'spreads' && (
          <div className="animate-in fade-in duration-200">
            <MoneyChangerVsBank rates={ratesData.rates} />
          </div>
        )}
      </main>

      {/* Backend Connection Modal */}
      <BackendConnectionModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
        onSuccess={loadRates}
        currentEndpoint={ratesData.backendEndpoint}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-rose-600 flex items-center justify-center text-white text-xs font-bold">
              S$
            </div>
            <div>
              <span className="font-semibold text-slate-300">LionRate SG</span>
              <span className="text-slate-400"> · Singapore Real-Time Foreign Exchange Intelligence</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400 text-xs">
            <span>Base: Singapore Dollar (SGD)</span>
            <span>·</span>
            <span>Time Zone: Asia/Singapore (SGT UTC+8)</span>
            <span>·</span>
            <button
              onClick={() => setIsBackendModalOpen(true)}
              className="hover:text-rose-400 transition-colors underline cursor-pointer"
            >
              Configure Backend
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-900 text-[11px] text-slate-400 leading-relaxed text-center sm:text-left">
          Exchange rates are sourced from keyless real-time interbank market feeds (Open Exchange Rates / ECB) and calibrated for Singapore interbank & retail spread models. Wholesale rates are for informational purposes. Physical money changer rates reflect competitive benchmarks at The Arcade (Raffles Place) and Mustafa Centre.
        </div>
      </footer>
    </div>
  );
}
