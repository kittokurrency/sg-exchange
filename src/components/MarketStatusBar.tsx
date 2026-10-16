import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, Zap, Activity } from 'lucide-react';

interface MarketStatusBarProps {
  lastUpdated: string;
  source: string;
  isBackendConnected: boolean;
  onOpenBackendModal: () => void;
}

export const MarketStatusBar: React.FC<MarketStatusBarProps> = ({
  lastUpdated,
  source,
  isBackendConnected,
  onOpenBackendModal
}) => {
  const [sgtTime, setSgtTime] = useState<string>('');
  const [isMarketOpen, setIsMarketOpen] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Singapore is UTC+8
      const sgOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Singapore',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatted = new Intl.DateTimeFormat('en-SG', sgOptions).format(now);
      setSgtTime(formatted);

      // Check Singapore Interbank hours (Mon-Fri 09:00 - 17:00 SGT)
      const day = now.getUTCDay(); // 0 is Sun, 6 is Sat
      const sgHour = (now.getUTCHours() + 8) % 24;
      const isOpen = day >= 1 && day <= 5 && sgHour >= 9 && sgHour < 17;
      setIsMarketOpen(isOpen);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/60 text-xs py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-slate-400">
        {/* Left: Singapore Time & Interbank Session */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 font-mono tabular-nums text-slate-300">
            <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>SGT {sgtTime || '09:00:00'} (UTC+8)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-slate-300">
              {isMarketOpen ? 'SGX / Interbank Session: Active' : 'Offshore / After-Hours Liquidity'}
            </span>
          </div>

          <span className="hidden lg:inline text-slate-600">·</span>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Monetary Authority of Singapore (MAS) S$NEER Reference</span>
          </div>
        </div>

        {/* Right: Data Feed Source & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-slate-500" />
            <span>Updated: <span className="font-mono tabular-nums text-slate-300">{lastUpdated || 'Real-time'}</span></span>
          </div>

          <span className="text-slate-700">|</span>

          <button
            onClick={onOpenBackendModal}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <Zap className={`w-3 h-3 ${isBackendConnected ? 'text-emerald-400' : 'text-slate-400 group-hover:text-amber-400'}`} />
            <span className="truncate max-w-[200px] sm:max-w-xs">{source}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
