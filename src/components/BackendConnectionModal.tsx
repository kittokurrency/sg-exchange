import React, { useState, useEffect } from 'react';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, Code2, Link2, Zap, ArrowRight } from 'lucide-react';
import { exchangeRateService } from '../services/exchangeRateService';

interface BackendConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentEndpoint?: string;
}

export const BackendConnectionModal: React.FC<BackendConnectionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentEndpoint
}) => {
  const [url, setUrl] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    sampleRates?: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const existing = exchangeRateService.getCustomBackendUrl();
      setUrl(existing || '');
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!url.trim()) {
      setTestResult({
        success: false,
        message: 'Please provide an endpoint URL to test.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    const start = performance.now();

    try {
      const res = await fetch(url.trim(), {
        headers: { 'Accept': 'application/json' }
      });
      const end = performance.now();
      const latencyMs = Math.round(end - start);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const rates = data.rates || data.data?.rates || data;

      if (!rates || typeof rates !== 'object') {
        throw new Error('Valid JSON received, but missing "rates" object in response.');
      }

      const sample: Record<string, number> = {};
      const keys = Object.keys(rates).slice(0, 5);
      keys.forEach(k => {
        sample[k] = Number(rates[k]);
      });

      setTestResult({
        success: true,
        message: `Successfully connected! Found ${Object.keys(rates).length} currency rates.`,
        latencyMs,
        sampleRates: sample
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to connect';
      setTestResult({
        success: false,
        message: `Connection failed: ${errMsg}. Ensure CORS is enabled on your backend.`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    exchangeRateService.setCustomBackendUrl(url.trim());
    onSuccess();
    onClose();
  };

  const handleReset = () => {
    exchangeRateService.setCustomBackendUrl(null);
    setUrl('');
    setTestResult(null);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/40 text-rose-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Keyless Backend Connection</h3>
              <p className="text-xs text-slate-400">Plug in your custom keyless exchange rate API endpoint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="my-5 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Ready for your backend:</strong>
                As requested, the frontend is currently running with high-availability keyless public feeds. When you are ready with your backend service (Cloud Run, Node, Express, Python, or Go), simply paste your endpoint below. No API key required!
              </div>
            </div>
          </div>

          {/* Endpoint Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Custom Keyless Backend URL:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  placeholder="e.g. https://my-fx-backend.run.app/api/rates"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                {isTesting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-400" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>Test</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports any GET endpoint returning JSON with SGD base rates.
            </p>
          </div>

          {/* Test Status Feedback */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              }`}
            >
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-semibold">{testResult.message}</div>
                  {testResult.latencyMs && (
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">
                      Latency: {testResult.latencyMs}ms
                    </div>
                  )}
                  {testResult.sampleRates && (
                    <div className="mt-2 pt-2 border-t border-emerald-800/40 font-mono text-[11px]">
                      Sample: {Object.entries(testResult.sampleRates).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Expected Response Format */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Code2 className="w-3.5 h-3.5" />
              <span>Expected Response JSON Format (Standard Keyless REST):</span>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto">
{`{
  "base": "SGD",
  "rates": {
    "MYR": 3.3285,
    "USD": 0.7712,
    "JPY": 118.42,
    "EUR": 0.7145,
    "THB": 25.68,
    "IDR": 12280
  },
  "timestamp": 1740000000
}`}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-rose-400 underline transition-colors"
          >
            Reset to Public Keyless Feed
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Apply & Save</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
