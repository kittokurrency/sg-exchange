import React from 'react';
import { ArrowUpDown, RefreshCw, Server, Globe2 } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenBackendModal: () => void;
  isBackendConnected: boolean;
  backendEndpoint?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRefresh,
  isRefreshing,
  onOpenBackendModal,
  isBackendConnected
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 single-line nav links) - Zone 3 (1 primary action) */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center text-white shadow-sm shadow-rose-950/50">
              <span className="font-bold text-base tracking-tighter">S$</span>
            </div>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab('converter'); }}
              className="text-lg font-bold tracking-tight text-white hover:text-rose-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <span>LionRate SG</span>
              <span className="text-xs font-normal text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">SGD FX</span>
            </a>
          </div>

          {/* Zone 2: 4 Nav Links with clean single-line labels */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('converter')}
              className={`px-3.5 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'converter'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              Converter
            </button>

            <button
              onClick={() => setActiveTab('rates')}
              className={`px-3.5 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'rates'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              Live Rates Matrix
            </button>

            <button
              onClick={() => setActiveTab('asean')}
              className={`px-3.5 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'asean'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              ASEAN Corridors
            </button>

            <button
              onClick={() => setActiveTab('spreads')}
              className={`px-3.5 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'spreads'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              Money Changer Spreads
            </button>
          </nav>

          {/* Zone 3: Primary Action & Backend Connection Hook */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh real-time exchange rates"
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-lg transition-colors border border-slate-800"
              aria-label="Refresh rates"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-rose-400' : ''}`} />
            </button>

            <button
              onClick={onOpenBackendModal}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap shrink-0 ${
                isBackendConnected
                  ? 'border-emerald-600/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>{isBackendConnected ? 'Backend: Connected' : 'Connect Backend'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
