import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, Maximize2, BarChart2 } from 'lucide-react';
import { ChartDataPoint } from '../types/currency';
import { exchangeRateService } from '../services/exchangeRateService';
import { CURRENCIES_LIST } from '../data/currencies';

interface RateChartProps {
  baseCurrency: string;
  targetCurrency: string;
  currentRate: number;
}

export const RateChart: React.FC<RateChartProps> = ({
  baseCurrency = 'SGD',
  targetCurrency = 'MYR',
  currentRate = 3.3285
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'>('1M');
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  const targetObj = CURRENCIES_LIST.find(c => c.code === targetCurrency);
  const targetName = targetObj ? targetObj.name : targetCurrency;

  // Generate or fetch history data
  const data = useMemo(() => {
    return exchangeRateService.getHistoricalData(targetCurrency, currentRate, timeframe);
  }, [targetCurrency, currentRate, timeframe]);

  // Chart statistics
  const stats = useMemo(() => {
    if (!data.length) return { min: 0, max: 0, avg: 0, change: 0, changePercent: 0 };
    const rates = data.map(d => d.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const sum = rates.reduce((a, b) => a + b, 0);
    const avg = sum / rates.length;
    const first = rates[0];
    const last = rates[rates.length - 1];
    const change = last - first;
    const changePercent = (change / first) * 100;

    return { min, max, avg, change, changePercent };
  }, [data]);

  const isPositive = stats.change >= 0;

  // SVG Coordinates calculation
  const width = 800;
  const height = 260;
  const paddingX = 20;
  const paddingTop = 25;
  const paddingBottom = 30;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingX * 2;

  const minVal = stats.min * 0.998;
  const maxVal = stats.max * 1.002;
  const valRange = maxVal - minVal || 1;

  const points = useMemo(() => {
    return data.map((d, index) => {
      const x = paddingX + (index / (data.length - 1)) * chartWidth;
      const y = paddingTop + (1 - (d.rate - minVal) / valRange) * chartHeight;
      return { x, y, data: d };
    });
  }, [data, minVal, valRange, chartWidth, chartHeight]);

  const pathD = useMemo(() => {
    if (!points.length) return '';
    return points.reduce((acc, curr, idx) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      // Smooth cubic bezier or straight line
      const prev = points[idx - 1];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpX2 = cpX1;
      return `${acc} C ${cpX1} ${prev.y}, ${cpX2} ${curr.y}, ${curr.x} ${curr.y}`;
    }, '');
  }, [points]);

  const areaD = useMemo(() => {
    if (!points.length) return '';
    const bottomY = height - paddingBottom;
    return `${pathD} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
  }, [pathD, points, height, paddingBottom]);

  const activeDisplayRate = hoveredPoint ? hoveredPoint.rate : currentRate;
  const activeDisplayDate = hoveredPoint ? hoveredPoint.date : 'Current Live Session';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-300">
              {baseCurrency} / {targetCurrency} Exchange Rate Trend
            </span>
            <span className="text-xs text-slate-400">· {targetName}</span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {activeDisplayRate.toFixed(activeDisplayRate > 100 ? (activeDisplayRate > 1000 ? 0 : 2) : 4)}
            </span>
            <span className={`text-xs font-mono tabular-nums flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isPositive ? '+' : ''}{stats.changePercent.toFixed(2)}% ({stats.change > 0 ? '+' : ''}{stats.change.toFixed(4)})
            </span>
            <span className="text-xs text-slate-400 font-mono">
              [{activeDisplayDate}]
            </span>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
          {(['1D', '1W', '1M', '3M', '1Y', '5Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setTimeframe(tf);
                setHoveredPoint(null);
              }}
              className={`px-2.5 py-1 text-xs font-mono tabular-nums rounded-md transition-colors ${
                timeframe === tf
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SVG Chart Container */}
      <div className="relative mt-4 h-64 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible select-none"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={width - paddingX}
            y2={paddingTop}
            stroke="#1e293b"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingTop + chartHeight / 2}
            x2={width - paddingX}
            y2={paddingTop + chartHeight / 2}
            stroke="#1e293b"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={height - paddingBottom}
            x2={width - paddingX}
            y2={height - paddingBottom}
            stroke="#1e293b"
            strokeWidth="1"
          />

          {/* Shaded Area */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Line Chart */}
          <path
            d={pathD}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover Crosshair and Dot */}
          {points.map((pt, idx) => (
            <g key={idx}>
              {/* Invisible wide hit target for hover */}
              <rect
                x={pt.x - chartWidth / (points.length * 2)}
                y={0}
                width={chartWidth / points.length}
                height={height}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredPoint(pt.data)}
              />

              {hoveredPoint?.timestamp === pt.data.timestamp && (
                <>
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={height - paddingBottom}
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#f43f5e"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Bottom Period High/Low/Avg Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 mt-2 text-xs">
        <div>
          <span className="text-slate-400">Period Low:</span>
          <div className="text-slate-200 font-mono tabular-nums font-semibold mt-0.5">
            {stats.min.toFixed(stats.min > 100 ? (stats.min > 1000 ? 0 : 2) : 4)}
          </div>
        </div>
        <div>
          <span className="text-slate-400">Period High:</span>
          <div className="text-slate-200 font-mono tabular-nums font-semibold mt-0.5">
            {stats.max.toFixed(stats.max > 100 ? (stats.max > 1000 ? 0 : 2) : 4)}
          </div>
        </div>
        <div>
          <span className="text-slate-400">Period Average:</span>
          <div className="text-slate-200 font-mono tabular-nums font-semibold mt-0.5">
            {stats.avg.toFixed(stats.avg > 100 ? (stats.avg > 1000 ? 0 : 2) : 4)}
          </div>
        </div>
        <div>
          <span className="text-slate-400">Net Period Shift:</span>
          <div className={`font-mono tabular-nums font-semibold mt-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? '+' : ''}{stats.changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};
