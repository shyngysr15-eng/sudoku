'use client';

import React from 'react';
import { Flame, Star, Trophy, Swords, Settings, Award } from 'lucide-react';
import { Difficulty } from '@/utils/sudokuGenerator';

interface HomeScreenProps {
  xp: number;
  streak: number;
  solvedDates: string[];
  onStartGame: (mode: 'daily' | 'custom', difficulty?: Difficulty) => void;
  onOpenPvP: () => void;
}

export default function HomeScreen({ xp, streak, solvedDates, onStartGame, onOpenPvP }: HomeScreenProps) {
  // Calendar: Last 14 days
  const today = new Date('2026-05-30'); // Simulated today matching metadata year
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (13 - i));
    return d;
  });

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar pb-24 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-brand-purple-100 flex items-center justify-center border-2 border-purple-300 shadow-sm animate-pulse-subtle">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Судоку Академия</h2>
            <p className="text-sm font-extrabold text-slate-700">Лига Мастеров</p>
          </div>
        </div>

        {/* XP Counter Pill */}
        <div className="flex items-center gap-1.5 bg-brand-yellow-100 border-2 border-yellow-400 rounded-full px-3 py-1 shadow-sm">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs font-black text-amber-800 tracking-tight">{xp} XP</span>
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-5">
        {/* Streak & Calendar Bento */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 font-display">Твой Страйк</h3>
                <p className="text-xs text-slate-500">Решай каждый день!</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1 bg-brand-orange-100 px-3.5 py-1.5 rounded-2xl border border-orange-200">
              <span className="text-xl font-black text-orange-600 font-display">{streak}</span>
              <span className="text-xs font-black text-orange-600 uppercase">Дней</span>
            </div>
          </div>

          {/* 14 Days Activity Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 pt-2">
            {last14Days.slice(7).map((date, idx) => {
              const key = formatDateKey(date);
              const isSolved = solvedDates.includes(key);
              const isToday = key === '2026-05-30';
              const dayName = daysOfWeek[date.getDay()];

              return (
                <div key={key} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-400 font-bold">{dayName}</span>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-300 border-2
                      ${isSolved 
                        ? 'bg-brand-green-100 border-brand-green-500 text-brand-green-600 scale-105 shadow-md shadow-green-100' 
                        : isToday 
                          ? 'bg-white border-brand-orange-500 text-brand-orange-500 border-dashed animate-pulse-subtle scale-105' 
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}
                  >
                    {isSolved ? (
                      <Flame className="w-4 h-4 fill-brand-green-500 text-brand-green-500" />
                    ) : isToday ? (
                      '🔥'
                    ) : (
                      date.getDate()
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Stats Visualizer (Strava Style) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-3">
          <h3 className="text-sm font-black text-slate-800 font-display">Активность за неделю</h3>
          
          <div className="flex items-end justify-between h-20 px-2 pt-4">
            {last14Days.slice(7).map((date, idx) => {
              const key = formatDateKey(date);
              const isSolved = solvedDates.includes(key);
              const barHeight = isSolved ? 'h-full' : 'h-4';
              const bgClass = isSolved 
                ? 'bg-gradient-to-t from-brand-green-500 to-green-400' 
                : 'bg-slate-100';

              return (
                <div key={key} className="flex flex-col items-center gap-1.5 h-full justify-end flex-1">
                  <div className={`w-3.5 rounded-full transition-all duration-500 ${bgClass} ${barHeight} relative`}>
                    {isSolved && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] bg-brand-green-500 text-white rounded px-1 scale-75">
                        100
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{daysOfWeek[date.getDay()]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Daily Challenge CTA Button */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4 relative overflow-hidden">
          {/* Decorative Background Blob */}
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-brand-green-100 rounded-full blur-2xl opacity-60"></div>
          
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="bg-brand-green-100 text-brand-green-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                Сегодняшнее событие
              </span>
              <h3 className="text-xl font-extrabold text-slate-800 font-display mt-1">Daily Challenge</h3>
              <p className="text-xs text-slate-500 mt-0.5">Реши сегодняшнее судоку и заработай +100 XP!</p>
            </div>
            <div className="text-3xl">🧩</div>
          </div>

          <button
            onClick={() => onStartGame('daily')}
            className="w-full py-4 text-lg font-extrabold uppercase rounded-2xl btn-3d-green tracking-wide relative z-10 cursor-pointer shadow-lg shadow-green-100"
          >
            ИГРАТЬ СЕЙЧАС
          </button>
        </div>

        {/* Secondary Buttons (Bento Dual Cards) */}
        <div className="grid grid-cols-2 gap-4">
          {/* PvP Arena Card */}
          <button
            onClick={onOpenPvP}
            className="bg-white hover:bg-slate-50 active:scale-95 transition-all text-left rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4 cursor-pointer bento-card group"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 transition-colors group-hover:bg-purple-200">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 font-display">PvP Арена</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Дуэли 1 на 1 онлайн</p>
            </div>
          </button>

          {/* Custom Practice Card */}
          <button
            onClick={() => onStartGame('custom')}
            className="bg-white hover:bg-slate-50 active:scale-95 transition-all text-left rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4 cursor-pointer bento-card group"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-200">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 font-display">Тренировка</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Выбор сложности</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
