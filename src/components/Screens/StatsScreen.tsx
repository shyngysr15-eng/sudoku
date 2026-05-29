'use client';

import React from 'react';
import { Clock, CheckCircle2, Target, BarChart2, Edit3, User } from 'lucide-react';

interface StatsScreenProps {
  stats: {
    averageTime: number;
    gamesPlayed: number;
    accuracy: number;
    history: number[];
  };
  onEditProfile?: () => void;
}

export default function StatsScreen({ stats, onEditProfile }: StatsScreenProps) {
  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}м ${remainingSecs}с`;
  };

  // SVG Chart values
  const chartHeight = 100;
  const chartWidth = 320;
  const padding = 20;

  // History data
  const historyData = stats.history.length > 0 ? stats.history : [280, 260, 290, 250, 270, 240];
  const maxVal = Math.max(...historyData) + 20;
  const minVal = Math.min(...historyData) - 20;
  const valueRange = maxVal - minVal;

  // Generate SVG coordinates for line chart
  const points = historyData.map((val, idx) => {
    const x = padding + (idx * (chartWidth - 2 * padding)) / (historyData.length - 1);
    // Invert Y because SVG coordinates start from top
    const y = chartHeight - padding - ((val - minVal) / valueRange) * (chartHeight - 2 * padding);
    return { x, y, value: val };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // For filling gradient underneath
  const fillD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z` 
    : '';

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar pb-24 select-none">
      {/* Sticky Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
        <h2 className="text-xl font-black text-slate-800 font-display">Твоя Статистика</h2>
        <button
          onClick={onEditProfile}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-xs font-bold border border-slate-200 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Профиль</span>
        </button>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-5">
        {/* Profile Card (Alex Miller Style) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue-100 rounded-full blur-2xl opacity-40"></div>
          
          {/* Avatar Container */}
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-brand-blue-100 border-2 border-brand-blue-500 flex items-center justify-center overflow-hidden shadow-inner">
              <User className="w-10 h-10 text-brand-blue-500" />
            </div>
            {/* Level Badge Overlay */}
            <div className="absolute -bottom-1 -right-1 bg-brand-blue-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full border border-white">
              LVL 4
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Супермозг</span>
            <h3 className="text-lg font-black text-slate-800 font-display leading-tight">Alex Miller</h3>
            <p className="text-xs text-slate-500 mt-0.5">В клубе с сентября 2025</p>
          </div>
        </div>

        {/* Bento Grid Metrics (Chess.com meets Strava style) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Solve Speed Card */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between min-h-32">
            <div className="w-9 h-9 rounded-2xl bg-brand-blue-100 flex items-center justify-center text-brand-blue-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Ср. Скорость</span>
              <h4 className="text-xl font-black text-slate-800 font-display mt-0.5">
                {formatTime(stats.averageTime)}
              </h4>
            </div>
          </div>

          {/* Solved Count Card */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between min-h-32">
            <div className="w-9 h-9 rounded-2xl bg-brand-green-100 flex items-center justify-center text-brand-green-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Решено задач</span>
              <h4 className="text-xl font-black text-slate-800 font-display mt-0.5">
                {stats.gamesPlayed} судоку
              </h4>
            </div>
          </div>

          {/* Accuracy Card (Full Width) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm col-span-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-orange-100 flex items-center justify-center text-brand-orange-500">
                <Target className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800 font-display">Точность Решений</h4>
                <p className="text-xs text-slate-500">Минимум штрафов за ошибки</p>
              </div>
            </div>
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Custom SVG gauge circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#f1f5f9"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="var(--color-brand-orange-500)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="163.3"
                  strokeDashoffset={163.3 - (163.3 * stats.accuracy) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-xs font-black text-slate-800 tracking-tighter">
                {stats.accuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Performance Timeline Graph Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <BarChart2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 font-display">Прогресс по времени</h3>
              <p className="text-xs text-slate-500">Динамика последних {historyData.length} игр</p>
            </div>
          </div>

          {/* SVG Graph rendering */}
          <div className="w-full overflow-hidden flex justify-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full max-w-[340px] h-32"
            >
              <defs>
                {/* Under-line fill gradient */}
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-brand-blue-500)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-brand-blue-500)" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3" />
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />

              {/* Area under the line */}
              {fillD && <path d={fillD} fill="url(#chartGradient)" />}

              {/* Stroke line path */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="var(--color-brand-blue-500)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Dots at value coordinates */}
              {points.map((p, idx) => (
                <g key={idx} className="group">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="white"
                    stroke="var(--color-brand-blue-500)"
                    strokeWidth="2.5"
                  />
                  {/* Tooltip for value */}
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    fill="#1e293b"
                    fontSize="8"
                    fontWeight="bold"
                    className="opacity-100 transition-opacity"
                  >
                    {Math.floor(p.value / 60)}м
                  </text>
                </g>
              ))}
            </svg>
          </div>
          
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Ранее</span>
            <span className="text-xs font-semibold text-slate-500">Уверенное улучшение скорости! ⚡</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Свежие</span>
          </div>
        </div>
      </div>
    </div>
  );
}
