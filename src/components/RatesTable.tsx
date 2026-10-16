import React, { useState, useMemo } from 'react';
import { Search, Star, Download, TrendingUp, TrendingDown, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { Currency, CurrencyRegion } from '../types/currency';
import { CURRENCIES_LIST } from '../data/currencies';

interface RatesTableProps {
  rates: Record<string, number>;
  changes24h: Record<string, number>;
  high24h: Record<string, number>;
  low24h: Record<string, number>;
  onSelectCurrency: (code: string) => void;
}

export const RatesTable: React.FC<RatesTableProps> = ({
  rates,
  changes24h,
  high24h,
  low24h,
  onSelectCurrency
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [pinnedCodes, setPinnedCodes] = useState<string[]>(['MYR', 'USD', 'JPY', 'THB', 'IDR', 'EUR']);
  const [sortField, setSortField] = useState<'code' | 'rate' | 'change'>('code');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const togglePin = (code: string) => {
    setPinnedCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const regions = ['All', 'ASEAN', 'Major', 'Asia-Pacific', 'Europe', 'Americas', 'Middle East & Africa'];

  // Filtered & sorted list
  const filteredCurrencies = useMemo(() => {
    let list = CURRENCIES_LIST.filter(c => {
      const matchesSearch =
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });

    // Sort
    list.sort((a, b) => {
      // Pinned always come first if searching 'All'
      const aPinned = pinnedCodes.includes(a.code);
      const bPinned = pinnedCodes.includes(b.code);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;

      if (sortField === 'code') {
        return sortAsc ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code);
      } else if (sortField === 'rate') {
        const rateA = rates[a.code] || 0;
        const rateB = rates[b.code] || 0;
        return sortAsc ? rateA - rateB : rateB - rateA;
      } else if (sortField === 'change') {
        const chgA = changes24h[a.code] || 0;
        const chgB = changes24h[b.code] || 0;
        return sortAsc ? chgA - chgB : chgB - chgA;
      }
      return 0;
    });

    return list;
  }, [searchTerm, selectedRegion, pinnedCodes, sortField, sortAsc, rates, changes24h]);

  const handleExportCSV = () => {
    const headers = ['Currency Code', 'Currency Name', 'Region', '1 SGD to Currency', '1 Currency to SGD', '24h Change %', '24h High', '24h Low'];
    const rows = filteredCurrencies.map(c => {
      const rate = rates[c.code] || 1;
      const inv = rate > 0 ? 1 / rate : 0;
      const chg = changes24h[c.code] || 0;
      const high = high24h[c.code] || rate;
      const low = low24h[c.code] || rate;
      return [c.code, `"${c.name}"`, c.region, rate, inv, `${chg}%`, high, low].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LionRate_SG_Rates_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatRate = (rate: number, decimals: number) => {
    if (!rate) return '-';
    return rate.toFixed(decimals > 2 ? decimals : 4);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Live Global Currencies Matrix (Base: SGD)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time wholesale interbank benchmarks with 24-hour trading boundaries
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search currency, country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-rose-500 w-48 sm:w-60"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Region Filter Buttons */}
      <div className="flex items-center gap-1.5 py-3 overflow-x-auto border-b border-slate-800/60 mb-4">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedRegion === region
                ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* High-Density Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-medium">
              <th className="py-2.5 px-3 w-8"></th>
              <th 
                className="py-2.5 px-3 cursor-pointer hover:text-white"
                onClick={() => { setSortField('code'); setSortAsc(!sortAsc); }}
              >
                <div className="flex items-center gap-1">
                  <span>Currency</span>
                  {sortField === 'code' && <span>{sortAsc ? '↑' : '↓'}</span>}
                </div>
              </th>
              <th 
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                onClick={() => { setSortField('rate'); setSortAsc(!sortAsc); }}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>1 SGD = Rate</span>
                  {sortField === 'rate' && <span>{sortAsc ? '↑' : '↓'}</span>}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right hidden sm:table-cell">
                1 Unit = SGD
              </th>
              <th 
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                onClick={() => { setSortField('change'); setSortAsc(!sortAsc); }}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>24h Change</span>
                  {sortField === 'change' && <span>{sortAsc ? '↑' : '↓'}</span>}
                </div>
              </th>
              <th className="py-2.5 px-3 text-center hidden md:table-cell w-44">
                24h Range (Low - High)
              </th>
              <th className="py-2.5 px-3 text-right w-24">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredCurrencies.map((c) => {
              const rate = rates[c.code] || 0;
              const inverse = rate > 0 ? 1 / rate : 0;
              const change = changes24h[c.code] || 0;
              const isPositive = change >= 0;
              const high = high24h[c.code] || rate * 1.005;
              const low = low24h[c.code] || rate * 0.995;
              const isPinned = pinnedCodes.includes(c.code);

              // Percentage of current rate within 24h range
              const rangePct = Math.min(100, Math.max(0, ((rate - low) / (high - low || 1)) * 100));

              return (
                <tr
                  key={c.code}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Pin toggle */}
                  <td className="py-3 px-3">
                    <button
                      onClick={() => togglePin(c.code)}
                      className={`text-slate-600 hover:text-amber-400 transition-colors ${
                        isPinned ? 'text-amber-400' : ''
                      }`}
                      title={isPinned ? 'Unpin from top' : 'Pin to top'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isPinned ? 'fill-amber-400' : ''}`} />
                    </button>
                  </td>

                  {/* Currency Name & Flag */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none" role="img" aria-label={c.name}>{c.flag}</span>
                      <div>
                        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <span>{c.code}</span>
                          <span className="text-[11px] font-normal text-slate-400 hidden lg:inline">
                            · {c.symbol}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">
                          {c.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 1 SGD = Rate */}
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-100">
                    {formatRate(rate, c.decimals)}
                  </td>

                  {/* 1 Unit = SGD */}
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-400 hidden sm:table-cell">
                    S${formatRate(inverse, 4)}
                  </td>

                  {/* 24h Change */}
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-flex items-center gap-0.5 font-mono tabular-nums font-medium ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPositive ? '+' : ''}{change.toFixed(2)}%
                    </span>
                  </td>

                  {/* 24h Range Bar */}
                  <td className="py-3 px-3 hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="w-full bg-slate-800 rounded-full h-1.5 relative overflow-hidden">
                        <div
                          className="bg-rose-500 h-1.5 rounded-full"
                          style={{ width: `${rangePct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono tabular-nums">
                        <span>{low.toFixed(c.decimals > 2 ? 2 : c.decimals)}</span>
                        <span>{high.toFixed(c.decimals > 2 ? 2 : c.decimals)}</span>
                      </div>
                    </div>
                  </td>

                  {/* Quick Convert Button */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectCurrency(c.code)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-2.5 py-1 rounded border border-rose-900/40 transition-colors"
                    >
                      <span>Convert</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCurrencies.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            No currencies matching your search "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
};
