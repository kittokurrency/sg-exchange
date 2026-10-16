import React, { useState, useId } from 'react';
import { ArrowUpDown, Copy, Check, ChevronDown, Info, Calculator, Sparkles, Building, CreditCard, Banknote } from 'lucide-react';
import { Currency, SpreadType } from '../types/currency';
import { CURRENCIES_LIST, BASE_CURRENCY, SPREAD_OPTIONS } from '../data/currencies';

interface CurrencyConverterProps {
  rates: Record<string, number>;
  selectedCurrency: string;
  onSelectCurrency: (code: string) => void;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  rates,
  selectedCurrency,
  onSelectCurrency
}) => {
  const [fromCurrency, setFromCurrency] = useState<string>('SGD');
  const [toCurrency, setToCurrency] = useState<string>(selectedCurrency || 'MYR');
  const [amount, setAmount] = useState<number>(1000);
  const [spreadType, setSpreadType] = useState<SpreadType>('interbank');
  const [copied, setCopied] = useState<boolean>(false);
  const fromSelectId = useId();
  const toSelectId = useId();

  // If parent changed selectedCurrency, update toCurrency if fromCurrency is SGD
  React.useEffect(() => {
    if (selectedCurrency && selectedCurrency !== fromCurrency) {
      setToCurrency(selectedCurrency);
    }
  }, [selectedCurrency]);

  const allCurrencies = [BASE_CURRENCY, ...CURRENCIES_LIST.filter(c => c.code !== 'SGD')];
  
  const fromObj = allCurrencies.find(c => c.code === fromCurrency) || BASE_CURRENCY;
  const toObj = allCurrencies.find(c => c.code === toCurrency) || CURRENCIES_LIST[0];

  // Calculate conversion rates
  // All rates in dataset are against 1 SGD
  const getRateAgainstSGD = (code: string) => rates[code] || 1.0;

  // Interbank rate from fromCurrency to toCurrency
  // e.g. from USD to MYR = (1 / SGD_USD) * SGD_MYR
  const fromRateSGD = getRateAgainstSGD(fromCurrency);
  const toRateSGD = getRateAgainstSGD(toCurrency);
  const interbankRate = toRateSGD / fromRateSGD;

  // Selected spread option
  const selectedSpread = SPREAD_OPTIONS.find(s => s.id === spreadType) || SPREAD_OPTIONS[0];
  const spreadMultiplier = 1 - (selectedSpread.spreadPercent / 100);
  const effectiveRate = interbankRate * spreadMultiplier;
  const convertedAmount = amount * effectiveRate;
  const midMarketAmount = amount * interbankRate;
  const spreadCostInToCurrency = midMarketAmount - convertedAmount;
  const spreadCostInSGD = spreadCostInToCurrency / toRateSGD;

  const inverseRate = effectiveRate > 0 ? 1 / effectiveRate : 0;

  // Format decimals
  const formatValue = (val: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-SG', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(val);
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    onSelectCurrency(temp === 'SGD' ? toCurrency : temp);
  };

  const quickAmounts = [100, 500, 1000, 2500, 5000, 10000];

  const handleCopy = () => {
    const text = `${formatValue(amount, fromObj.decimals)} ${fromCurrency} = ${formatValue(convertedAmount, toObj.decimals)} ${toCurrency} (Rate: 1 ${fromCurrency} = ${effectiveRate.toFixed(toObj.decimals > 2 ? toObj.decimals : 4)} ${toCurrency} via ${selectedSpread.title})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Physical note breakdown recommendation
  const calculateCashNotes = () => {
    if (!toObj.popularDenominations || toObj.popularDenominations.length === 0) return null;
    let remaining = Math.floor(convertedAmount);
    const breakdown: { denomination: number; count: number }[] = [];

    for (const denom of toObj.popularDenominations) {
      if (remaining >= denom) {
        const count = Math.floor(remaining / denom);
        remaining = remaining % denom;
        breakdown.push({ denomination: denom, count });
      }
    }
    return { breakdown, remainder: remaining };
  };

  const cashNotes = calculateCashNotes();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800/80 gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Singapore Dollar FX Converter</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time cross conversion with transparent Singapore channel spread models
          </p>
        </div>

        {/* Spread Profile Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto">
          {SPREAD_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSpreadType(opt.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                spreadType === opt.id
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {opt.id === 'interbank' && <Building className="w-3 h-3 text-emerald-400" />}
              {opt.id === 'multicard' && <CreditCard className="w-3 h-3 text-cyan-400" />}
              {opt.id === 'moneychanger' && <Banknote className="w-3 h-3 text-amber-400" />}
              {opt.id === 'retailbank' && <Building className="w-3 h-3 text-rose-400" />}
              <span>{opt.title}</span>
              {opt.spreadPercent > 0 && (
                <span className="text-[10px] text-slate-400 font-mono">+{opt.spreadPercent}%</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversion Row */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center my-6">
        {/* From Input Box */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 transition-all focus-within:border-rose-500/50">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>You Send ({fromObj.name})</span>
            <span className="font-mono">{fromObj.symbol}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="number"
                min="0"
                step="any"
                value={amount === 0 ? '' : amount}
                onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-transparent text-2xl sm:text-3xl font-semibold text-white font-mono tabular-nums focus:outline-none"
                placeholder="1000"
              />
            </div>
            {/* Currency Selector */}
            <div className="relative shrink-0">
              <select
                id={fromSelectId}
                aria-label="Source Currency"
                value={fromCurrency}
                onChange={(e) => {
                  setFromCurrency(e.target.value);
                  if (e.target.value !== 'SGD') onSelectCurrency(e.target.value);
                }}
                className="appearance-none bg-slate-900 border border-slate-700 hover:border-slate-600 text-white font-medium text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
              >
                {allCurrencies.map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                    {c.flag} {c.code} - {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="lg:col-span-1 flex justify-center py-2 lg:py-0">
          <button
            onClick={handleSwap}
            title="Swap source and target currencies"
            className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-md transition-transform active:scale-95 hover:text-white"
            aria-label="Swap currencies"
          >
            <ArrowUpDown className="w-5 h-5 text-rose-400" />
          </button>
        </div>

        {/* To Output Box */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>You Receive ({toObj.name})</span>
            <span className="font-mono">{toObj.symbol}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 overflow-hidden">
              <div className="text-2xl sm:text-3xl font-semibold text-emerald-400 font-mono tabular-nums truncate">
                {formatValue(convertedAmount, toObj.decimals > 2 ? toObj.decimals : 2)}
              </div>
            </div>
            {/* Currency Selector */}
            <div className="relative shrink-0">
              <select
                id={toSelectId}
                aria-label="Target Currency"
                value={toCurrency}
                onChange={(e) => {
                  setToCurrency(e.target.value);
                  onSelectCurrency(e.target.value);
                }}
                className="appearance-none bg-slate-900 border border-slate-700 hover:border-slate-600 text-white font-medium text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
              >
                {allCurrencies.map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                    {c.flag} {c.code} - {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Amount Pills (SG Dollars standard shortcuts) */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <span className="text-xs text-slate-400 mr-1">Quick {fromCurrency}:</span>
        {quickAmounts.map((q) => (
          <button
            key={q}
            onClick={() => setAmount(q)}
            className={`px-2.5 py-1 text-xs rounded-md border font-mono tabular-nums transition-colors ${
              amount === q
                ? 'bg-rose-950/40 border-rose-600/60 text-rose-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {fromObj.symbol}{q >= 1000 ? `${q / 1000}k` : q}
          </button>
        ))}
        <button
          onClick={handleCopy}
          className="ml-auto text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-800 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Quote'}</span>
        </button>
      </div>

      {/* Rates & Spread Breakdown Details */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-slate-400">Effective Exchange Rate</div>
            <div className="text-sm font-semibold text-white font-mono tabular-nums mt-0.5">
              1 {fromCurrency} = {effectiveRate.toFixed(toObj.decimals > 2 ? toObj.decimals : 4)} {toCurrency}
            </div>
            <div className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
              1 {toCurrency} = {inverseRate.toFixed(fromObj.decimals > 2 ? fromObj.decimals : 4)} {fromCurrency}
            </div>
          </div>

          <div>
            <div className="text-slate-400">Channel Model</div>
            <div className="text-sm font-semibold text-slate-200 mt-0.5">
              {selectedSpread.title}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 truncate">
              {selectedSpread.providers}
            </div>
          </div>

          <div>
            <div className="text-slate-400">Estimated Channel Spread</div>
            <div className="text-sm font-semibold text-amber-300 font-mono tabular-nums mt-0.5">
              {selectedSpread.spreadPercent === 0 ? '0.00% (Mid-Market)' : `~${selectedSpread.spreadPercent}% markup`}
            </div>
            <div className="text-[11px] text-slate-400 font-mono tabular-nums mt-0.5">
              {selectedSpread.spreadPercent === 0 ? (
                'Zero retail markup'
              ) : (
                `Cost: ~S$${spreadCostInSGD.toFixed(2)} (${formatValue(spreadCostInToCurrency, toObj.decimals)} ${toCurrency})`
              )}
            </div>
          </div>

          <div>
            <div className="text-slate-400">Mid-Market Benchmark</div>
            <div className="text-sm font-semibold text-slate-300 font-mono tabular-nums mt-0.5">
              1 {fromCurrency} = {interbankRate.toFixed(toObj.decimals > 2 ? toObj.decimals : 4)} {toCurrency}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Interbank baseline (MAS/Reuters)
            </div>
          </div>
        </div>

        {/* Singapore Specific Corridor Note */}
        {toObj.sgNotes && (
          <div className="pt-2 border-t border-slate-800/60 flex items-start gap-2 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span><strong className="text-slate-300">Singapore Corridor Insight:</strong> {toObj.sgNotes}</span>
          </div>
        )}
      </div>

      {/* Suggested Travel Cash Denominations (if applicable) */}
      {cashNotes && cashNotes.breakdown.length > 0 && spreadType === 'moneychanger' && (
        <div className="mt-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Banknote className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Cash Note Request ({toObj.name}):</span>
            </span>
            <span className="text-slate-400 text-[11px]">Ideal for counter teller exchange</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {cashNotes.breakdown.slice(0, 4).map((b) => (
              <div key={b.denomination} className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-slate-300 font-mono tabular-nums">
                <span className="text-amber-400 font-bold">{b.count}×</span> {toObj.symbol}{b.denomination.toLocaleString()}
              </div>
            ))}
            {cashNotes.remainder > 0 && (
              <span className="text-[11px] text-slate-400 font-mono">
                +{toObj.symbol}{cashNotes.remainder} coins/small notes
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
