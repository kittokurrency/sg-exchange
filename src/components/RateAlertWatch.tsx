import React, { useState } from 'react';
import { Target, Bell, ArrowRight, CheckCircle2, DollarSign } from 'lucide-react';

interface RateAlertWatchProps {
  rates: Record<string, number>;
}

export const RateAlertWatch: React.FC<RateAlertWatchProps> = ({ rates }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('MYR');
  const [targetRate, setTargetRate] = useState<number>(3.40);
  const [budgetSgd, setBudgetSgd] = useState<number>(2000);
  const [alertSet, setAlertSet] = useState<boolean>(false);

  const currentRate = rates[selectedCurrency] || 3.3285;
  const diff = targetRate - currentRate;
  const diffPercent = (diff / currentRate) * 100;

  const currentYield = budgetSgd * currentRate;
  const targetYield = budgetSgd * targetRate;
  const extraYield = targetYield - currentYield;

  const handleSetAlert = () => {
    setAlertSet(true);
    setTimeout(() => setAlertSet(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-rose-500" />
          <h3 className="font-bold text-white text-base">Rate Target & Potential Savings Calculator</h3>
        </div>
        <span className="text-xs text-slate-400">Singapore Travel & Remittance Planning</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        {/* Currency selection */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Target Currency:</label>
          <select
            value={selectedCurrency}
            onChange={(e) => {
              const code = e.target.value;
              setSelectedCurrency(code);
              const r = rates[code] || 1;
              setTargetRate(Number((r * 1.03).toFixed(r > 100 ? 1 : 4)));
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
          >
            <option value="MYR">🇲🇾 MYR - Malaysian Ringgit</option>
            <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
            <option value="THB">🇹🇭 THB - Thai Baht</option>
            <option value="IDR">🇮🇩 IDR - Indonesian Rupiah</option>
            <option value="USD">🇺🇸 USD - US Dollar</option>
            <option value="EUR">🇪🇺 EUR - Euro</option>
            <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
            <option value="CNY">🇨🇳 CNY - Chinese Yuan</option>
          </select>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Current Rate: 1 SGD = {currentRate.toFixed(currentRate > 100 ? 2 : 4)} {selectedCurrency}
          </div>
        </div>

        {/* Target rate input */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Target Exchange Rate:</label>
          <input
            type="number"
            step="any"
            value={targetRate}
            onChange={(e) => setTargetRate(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
          />
          <div className={`text-[11px] font-mono mt-1 ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {diff >= 0 ? `+${diff.toFixed(4)} (+${diffPercent.toFixed(1)}%) above current` : `${diff.toFixed(4)} (${diffPercent.toFixed(1)}%) below current`}
          </div>
        </div>

        {/* Planned exchange budget */}
        <div>
          <label className="block text-xs text-slate-400 mb-1">Planned Budget (SGD):</label>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-mono">S$</span>
            <input
              type="number"
              step="100"
              value={budgetSgd}
              onChange={(e) => setBudgetSgd(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Standard travel or remittance sum
          </div>
        </div>
      </div>

      {/* Outcome preview */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400">At your target rate of {targetRate}:</div>
          <div className="text-lg font-bold text-white font-mono tabular-nums mt-0.5">
            Receive: {targetYield.toLocaleString('en-SG', { maximumFractionDigits: selectedCurrency === 'IDR' ? 0 : 2 })} {selectedCurrency}
          </div>
          <div className="text-xs text-emerald-400 font-mono mt-0.5">
            {extraYield > 0
              ? `Bonus foreign currency: +${extraYield.toLocaleString('en-SG', { maximumFractionDigits: selectedCurrency === 'IDR' ? 0 : 2 })} ${selectedCurrency} (worth ~S$${(extraYield / targetRate).toFixed(2)})`
              : 'Target rate is lower than current market rate'}
          </div>
        </div>

        <button
          onClick={handleSetAlert}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          {alertSet ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">Rate Watched!</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4 text-rose-400" />
              <span>Watch This Target</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
