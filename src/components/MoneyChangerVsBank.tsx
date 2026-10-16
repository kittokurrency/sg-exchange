import React, { useState } from 'react';
import { Building2, CreditCard, Banknote, PlaneTakeoff, Info, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CURRENCIES_LIST } from '../data/currencies';

interface MoneyChangerVsBankProps {
  rates: Record<string, number>;
}

export const MoneyChangerVsBank: React.FC<MoneyChangerVsBankProps> = ({ rates }) => {
  const [testAmount, setTestAmount] = useState<number>(1000);
  const [testCurrency, setTestCurrency] = useState<string>('MYR');

  const popularTargets = ['MYR', 'JPY', 'USD', 'EUR', 'THB', 'IDR', 'AUD', 'GBP'];
  const curObj = CURRENCIES_LIST.find(c => c.code === testCurrency) || CURRENCIES_LIST[0];
  const midRate = rates[testCurrency] || 3.3285;

  // Comparison channels
  const channels = [
    {
      name: 'Interbank Benchmark (MAS S$NEER)',
      type: 'Reference',
      spread: 0.0,
      feeSGD: 0,
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      badge: 'Mid-Market Baseline',
      notes: 'Wholesale interbank rate. Not directly available for retail physical cash.',
      convenience: 'Theoretical benchmark'
    },
    {
      name: 'Multi-Currency Digital Card',
      subtext: 'YouTrip, Wise, Revolut, Trust Bank',
      type: 'Digital Card',
      spread: 0.45,
      feeSGD: testAmount * 0.0045,
      icon: CreditCard,
      iconColor: 'text-cyan-400',
      badge: 'Best for Card Taps & ATM',
      notes: 'Near zero-margin live wholesale FX. Free ATM withdrawals up to monthly caps (e.g. S$400-S$500).',
      convenience: 'Instant digital exchange via mobile app 24/7'
    },
    {
      name: 'Top Physical Money Changers',
      subtext: 'The Arcade (Raffles Place), Mustafa Centre, People’s Park',
      type: 'Physical Cash',
      spread: 0.85,
      feeSGD: testAmount * 0.0085,
      icon: Banknote,
      iconColor: 'text-amber-400',
      badge: 'Best for Physical Cash',
      notes: 'Extremely competitive physical cash margins due to intense local money changer competition in Singapore.',
      convenience: 'Mustafa open 24/7 in Little India; The Arcade open Mon-Sat business hours'
    },
    {
      name: 'Local Retail Bank Counter (OTC)',
      subtext: 'DBS, OCBC, UOB Branch Cash Counters',
      type: 'Bank Branch',
      spread: 2.50,
      feeSGD: testAmount * 0.025,
      icon: Building2,
      iconColor: 'text-rose-400',
      badge: 'High Spread',
      notes: 'Retail banks charge significant spread margins for foreign physical currency handling.',
      convenience: 'Requires queueing at physical bank branch during branch hours'
    },
    {
      name: 'Changi Airport Transit Counters',
      subtext: 'Airport Terminal Cash Counters',
      type: 'Airport',
      spread: 4.20,
      feeSGD: testAmount * 0.042,
      icon: PlaneTakeoff,
      iconColor: 'text-purple-400',
      badge: 'Most Expensive',
      notes: 'High airport concession rental drives wide spreads. Avoid exchanging large amounts at departure.',
      convenience: '24/7 before boarding at Terminal 1, 2, 3, 4'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Singapore Money Changer vs Bank Spread Matrix</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent fee and spread loss audit across Singapore's most common currency exchange channels
          </p>
        </div>

        {/* Currency & Amount interactive selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-400 px-2 font-medium">Amount:</span>
            {[500, 1000, 3000, 5000].map(amt => (
              <button
                key={amt}
                onClick={() => setTestAmount(amt)}
                className={`px-2 py-1 rounded font-mono tabular-nums transition-colors ${
                  testAmount === amt
                    ? 'bg-rose-950/60 text-rose-300 font-bold border border-rose-800/60'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                S${amt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-400 px-2 font-medium">Target:</span>
            {popularTargets.slice(0, 5).map(code => (
              <button
                key={code}
                onClick={() => setTestCurrency(code)}
                className={`px-2 py-1 rounded font-mono font-medium transition-colors ${
                  testCurrency === code
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((ch, idx) => {
          const effectiveRate = midRate * (1 - ch.spread / 100);
          const received = testAmount * effectiveRate;
          const Icon = ch.icon;

          return (
            <div
              key={idx}
              className={`bg-slate-950 border rounded-xl p-5 flex flex-col justify-between transition-all ${
                ch.spread === 0.0
                  ? 'border-emerald-800/40'
                  : ch.spread <= 0.85
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <Icon className={`w-4 h-4 ${ch.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100 text-sm">{ch.name}</h3>
                      {ch.subtext && <div className="text-[11px] text-slate-400">{ch.subtext}</div>}
                    </div>
                  </div>
                  <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded ${
                    ch.spread === 0.0
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                      : ch.spread < 1
                      ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/40'
                      : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                  }`}>
                    +{ch.spread}% Spread
                  </span>
                </div>

                <div className="mt-5 p-3 rounded-lg bg-slate-900/80 border border-slate-800/60 space-y-1">
                  <div className="text-xs text-slate-400">For S${testAmount.toLocaleString()} you receive:</div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums">
                    {curObj.symbol} {received.toLocaleString('en-SG', { maximumFractionDigits: curObj.decimals > 2 ? curObj.decimals : 2 })}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Rate: 1 SGD = {effectiveRate.toFixed(curObj.decimals > 2 ? curObj.decimals : 4)} {testCurrency}
                  </div>
                </div>

                <div className="mt-3 text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Loss to spread:</span>
                    <span className={`font-mono font-semibold ${ch.feeSGD === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {ch.feeSGD === 0 ? 'S$0.00 (Zero markup)' : `-S$${ch.feeSGD.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    {ch.notes}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{ch.badge}</span>
                <span className="text-slate-400">{ch.type}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Practical Singapore Tips Section */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-rose-400" />
          <span>Singapore Resident & Traveler FX Best Practices</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-1">
            <strong className="text-slate-100 block">1. Physical Cash (Mustafa & The Arcade)</strong>
            <p className="text-slate-400">
              For countries with heavy cash dependency (Batam/Bali IDR, street night markets in Bangkok THB), head to The Arcade at Raffles Place or Mustafa in Little India for spreads well under 1%.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-100 block">2. Digital Spending (Multi-Currency Cards)</strong>
            <p className="text-slate-400">
              For Japan (JPY), Europe (EUR), USA (USD), or Australia (AUD), use YouTrip, Wise, or Revolut for zero foreign transaction fees compared to retail credit cards (which charge ~3.25%).
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-100 block">3. Airport Emergencies Only</strong>
            <p className="text-slate-400">
              Changi Airport counters charge roughly 4% to 5% spread. Only change a token amount (e.g. S$50 for taxi fare) if strictly necessary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
