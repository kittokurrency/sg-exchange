import React, { useState } from 'react';
import { ArrowRight, Fuel, ShoppingBag, Utensils, Plane, Palmtree, Sparkles, Compass } from 'lucide-react';

interface AseanCorridorHubProps {
  rates: Record<string, number>;
  onSelectCurrency: (code: string) => void;
}

export const AseanCorridorHub: React.FC<AseanCorridorHubProps> = ({
  rates,
  onSelectCurrency
}) => {
  const [myrAmount, setMyrAmount] = useState<number>(500); // S$500 JB weekend trip
  const [jpyAmount, setJpyAmount] = useState<number>(2000); // S$2,000 Japan holiday
  const [thbAmount, setThbAmount] = useState<number>(800); // S$800 BKK getaway
  const [idrAmount, setIdrAmount] = useState<number>(300); // S$300 Batam trip

  const sgdToMyr = rates['MYR'] || 3.3285;
  const sgdToJpy = rates['JPY'] || 118.42;
  const sgdToThb = rates['THB'] || 25.68;
  const sgdToIdr = rates['IDR'] || 12280.0;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-rose-500" />
              <span>Singapore Regional Corridors & Travel Wallets</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Optimized purchasing power breakdowns for Causeway trips, Japan holidays, and ASEAN getaways
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            S$NEER Regional Trade Corridor Benchmark
          </div>
        </div>
      </div>

      {/* Grid of Corridors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Corridor 1: SGD to MYR Causeway Special */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🇲🇾</span>
                <div>
                  <h3 className="font-bold text-white text-base">Causeway & JB Corridor (SGD / MYR)</h3>
                  <div className="text-xs text-slate-400">Singapore - Johor Bahru Cross-Border</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                  1 SGD = {sgdToMyr.toFixed(4)} MYR
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  1 MYR = S${(1 / sgdToMyr).toFixed(4)}
                </div>
              </div>
            </div>

            {/* Interactive S$ Slider */}
            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>Weekend Budget in Johor Bahru:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  S${myrAmount} = RM{(myrAmount * sgdToMyr).toLocaleString('en-SG', { maximumFractionDigits: 1 })}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={myrAmount}
                onChange={(e) => setMyrAmount(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>S$100 (Day trip)</span>
                <span>S$500 (Shopping & Dining)</span>
                <span>S$3,000 (Remittance)</span>
              </div>
            </div>

            {/* Purchasing Power Comparison */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="text-slate-400 font-medium">Real-World Causeway Purchasing Power:</div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/60 flex items-start gap-2">
                  <Fuel className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-200">RON97 Petrol (JB)</div>
                    <div className="text-[11px] text-slate-400">~RM3.47 / L (~S$1.04)</div>
                    <div className="text-[10px] text-emerald-400">vs S$2.85/L in Singapore</div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/60 flex items-start gap-2">
                  <Utensils className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-200">Seafood Feast (JB)</div>
                    <div className="text-[11px] text-slate-400">~RM180 (~S$54.00)</div>
                    <div className="text-[10px] text-emerald-400">vs ~S$160 in East Coast</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/60 flex justify-between items-center">
            <span className="text-[11px] text-slate-400">Over S$2B annual retail cross-border flow</span>
            <button
              onClick={() => onSelectCurrency('MYR')}
              className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>Convert in Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Corridor 2: SGD to JPY Japan Travel Hub */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🇯🇵</span>
                <div>
                  <h3 className="font-bold text-white text-base">Japan Holiday Corridor (SGD / JPY)</h3>
                  <div className="text-xs text-slate-400">Singapore - Tokyo / Osaka Vacation Wallet</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                  1 SGD = {sgdToJpy.toFixed(2)} JPY
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  10,000 JPY = S${(10000 / sgdToJpy).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Interactive S$ Slider */}
            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>Japan Trip Holiday Fund:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  S${jpyAmount} = ¥{Math.round(jpyAmount * sgdToJpy).toLocaleString('en-SG')}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="8000"
                step="100"
                value={jpyAmount}
                onChange={(e) => setJpyAmount(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>S$500</span>
                <span>S$2,000 (Solo Explorer)</span>
                <span>S$8,000 (Family 10-day)</span>
              </div>
            </div>

            {/* Purchasing Power */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="text-slate-400 font-medium">Tokyo & Kyoto Consumer Benchmark:</div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/60 flex items-start gap-2">
                  <Utensils className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-200">Michelin Ramen (Tokyo)</div>
                    <div className="text-[11px] text-slate-400">~¥1,100 (~S$9.28)</div>
                    <div className="text-[10px] text-emerald-400">Exceptional value for SGD</div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/60 flex items-start gap-2">
                  <Plane className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-200">Shinkansen Tokyo-Kyoto</div>
                    <div className="text-[11px] text-slate-400">~¥14,000 (~S$118)</div>
                    <div className="text-[10px] text-slate-400">Bullet train transit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/60 flex justify-between items-center">
            <span className="text-[11px] text-slate-400">Multi-currency card (YouTrip/Wise) favorite</span>
            <button
              onClick={() => onSelectCurrency('JPY')}
              className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>Convert in Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Corridor 3: SGD to THB (Bangkok & Thai Getaways) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🇹🇭</span>
                <div>
                  <h3 className="font-bold text-white text-base">Bangkok & Phuket Travel (SGD / THB)</h3>
                  <div className="text-xs text-slate-400">Night markets, dining, and spa retreats</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                  1 SGD = {sgdToThb.toFixed(2)} THB
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  1,000 THB = S${(1000 / sgdToThb).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>Thailand Travel Cash:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  S${thbAmount} = ฿{Math.round(thbAmount * sgdToThb).toLocaleString('en-SG')}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="50"
                value={thbAmount}
                onChange={(e) => setThbAmount(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>S$200</span>
                <span>S$800 (Weekend Bangkok)</span>
                <span>S$3,000 (Luxury Villa)</span>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Street Pad Thai / Tom Yum (Bangkok):</span>
                <span className="font-mono tabular-nums font-medium">~60-80 THB (~S$2.30 - S$3.10)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">2-Hour Traditional Thai Massage:</span>
                <span className="font-mono tabular-nums font-medium">~500-700 THB (~S$19.50 - S$27.00)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/60 flex justify-between items-center">
            <span className="text-[11px] text-slate-400">High cash utilization for street stalls</span>
            <button
              onClick={() => onSelectCurrency('THB')}
              className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>Convert in Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Corridor 4: SGD to IDR (Batam, Bintan, Bali) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🇮🇩</span>
                <div>
                  <h3 className="font-bold text-white text-base">Indonesia Island Breaks (SGD / IDR)</h3>
                  <div className="text-xs text-slate-400">45-min ferry to Batam & Bintan resorts, Bali</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                  1 SGD = {Math.round(sgdToIdr).toLocaleString('en-SG')} IDR
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  1 Million IDR = S${(1000000 / sgdToIdr).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>Rupiah Millionaire Calculator:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  S${idrAmount} = Rp {Math.round(idrAmount * sgdToIdr).toLocaleString('en-SG')}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={idrAmount}
                onChange={(e) => setIdrAmount(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>S$100 (Rp 1.2M)</span>
                <span>S$500 (Rp 6.1M)</span>
                <span>S$2,000 (Rp 24.5M)</span>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Batam Seafood Dinner (4 pax):</span>
                <span className="font-mono tabular-nums font-medium">~Rp 500,000 (~S$40.70)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bintan 90-min Aromatherapy Spa:</span>
                <span className="font-mono tabular-nums font-medium">~Rp 350,000 (~S$28.50)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/60 flex justify-between items-center">
            <span className="text-[11px] text-slate-400">Carry 50k & 100k notes for convenience</span>
            <button
              onClick={() => onSelectCurrency('IDR')}
              className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>Convert in Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
