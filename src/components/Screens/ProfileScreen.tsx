'use client';

import React from 'react';
import { Flame, Star, Award, Zap, Shield, Sparkles, UserCheck, ShieldAlert } from 'lucide-react';

interface ProfileScreenProps {
  xp: number;
  streak: number;
  solvedDates: string[];
}

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  unlocked: boolean;
  color: string;
}

export default function ProfileScreen({ xp, streak, solvedDates }: ProfileScreenProps) {
  // Level progression
  const level = Math.floor(xp / 500) + 1;
  const currentLevelXp = xp % 500;
  const xpNeededForNextLevel = 500;
  const progressPercent = (currentLevelXp / xpNeededForNextLevel) * 100;

  // GitHub contribution grid: Last 18 weeks (about 4.5 months)
  const today = new Date('2026-05-30');
  const totalDays = 7 * 15; // 15 weeks
  const contributionDays = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (totalDays - 1 - i));
    return d;
  });

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Achievements
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Гроза Времени',
      desc: 'Реши судоку менее чем за 5 минут.',
      icon: <Zap className="w-5.5 h-5.5" />,
      unlocked: true,
      color: 'bg-amber-100 text-amber-500 border-amber-300',
    },
    {
      id: '2',
      title: 'Преданный Адепт',
      desc: 'Набери 7-дневный страйк.',
      icon: <Flame className="w-5.5 h-5.5" />,
      unlocked: streak >= 7,
      color: 'bg-orange-100 text-orange-500 border-orange-300',
    },
    {
      id: '3',
      title: 'Чистый Разум',
      desc: 'Реши сложную задачу без ошибок.',
      icon: <Shield className="w-5.5 h-5.5" />,
      unlocked: false,
      color: 'bg-emerald-100 text-emerald-500 border-emerald-300',
    },
    {
      id: '4',
      title: 'Дуэлянт Арены',
      desc: 'Выиграй 5 матчей в PvP-режиме.',
      icon: <UserCheck className="w-5.5 h-5.5" />,
      unlocked: false,
      color: 'bg-purple-100 text-purple-500 border-purple-300',
    },
    {
      id: '5',
      title: 'Абсолютный Гений',
      desc: 'Собери 1000 XP в тренировках.',
      icon: <Sparkles className="w-5.5 h-5.5" />,
      unlocked: xp >= 1000,
      color: 'bg-yellow-100 text-yellow-500 border-yellow-300',
    },
    {
      id: '6',
      title: 'Мастер Экстрима',
      desc: 'Реши экспертное судоку.',
      icon: <ShieldAlert className="w-5.5 h-5.5" />,
      unlocked: false,
      color: 'bg-rose-100 text-rose-500 border-rose-300',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar pb-24 select-none">
      {/* Sticky Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
        <h2 className="text-xl font-black text-slate-800 font-display">Твой Профиль</h2>
        <div className="flex items-center gap-1 bg-brand-purple-100 border border-purple-200 px-3 py-1 rounded-full">
          <Award className="w-4 h-4 text-purple-600" />
          <span className="text-[10px] font-black text-purple-700 uppercase">Лига Золота</span>
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-5">
        {/* XP Progression Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Уровень в игре</span>
              <h3 className="text-2xl font-black text-slate-800 font-display mt-0.5">Уровень {level}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow-100 border-2 border-brand-yellow-500 flex items-center justify-center font-black text-yellow-600 text-xl font-display shadow-sm shadow-yellow-100 animate-pulse-subtle">
              {level}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-black text-slate-500">
              <span>{currentLevelXp} / {xpNeededForNextLevel} XP</span>
              <span>До ур. {level + 1}</span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 relative">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-1000 shadow-inner"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* GitHub Style Contribution Calendar Grid */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 font-display">Календарь Тренировок</h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">6 Месяцев</span>
          </div>

          {/* Grid Container */}
          <div className="flex flex-col gap-2 bg-slate-50 rounded-2xl p-4 border border-slate-100 overflow-x-auto no-scrollbar">
            <div className="grid grid-flow-col grid-rows-7 gap-1 w-full min-w-[280px]">
              {contributionDays.map((date, idx) => {
                const key = formatDateKey(date);
                const isSolved = solvedDates.includes(key);
                // Grid color classes
                const colorClass = isSolved
                  ? 'bg-brand-green-500 hover:scale-110 shadow-sm'
                  : 'bg-slate-200 hover:bg-slate-300';

                return (
                  <div
                    key={key}
                    title={`${key}: ${isSolved ? 'Решено судоку' : 'Нет активности'}`}
                    className={`w-3 h-3 rounded-sm transition-all duration-300 cursor-pointer ${colorClass}`}
                  ></div>
                );
              })}
            </div>
            <div className="flex justify-between items-center text-[8px] text-slate-400 font-bold uppercase mt-1 px-1">
              <span>Менее активно</span>
              <div className="flex gap-1 items-center">
                <div className="w-2.5 h-2.5 bg-slate-200 rounded-sm"></div>
                <div className="w-2.5 h-2.5 bg-brand-green-500 rounded-sm"></div>
                <span>Более активно</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Bento Section */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-500">
              <Star className="w-4.5 h-4.5 fill-yellow-500" />
            </div>
            <h3 className="text-sm font-black text-slate-800 font-display">Трофеи и Ачивки</h3>
          </div>

          {/* Badges Bento Grid (Aesthetic layout based on Ref Image 2) */}
          <div className="grid grid-cols-2 gap-4">
            {achievements.map(ach => {
              return (
                <div
                  key={ach.id}
                  className={`flex flex-col items-center text-center p-4 rounded-3xl border transition-all duration-300 bento-card relative overflow-hidden
                    ${ach.unlocked 
                      ? `${ach.color} border-2 hover:-translate-y-0.5` 
                      : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                    }`}
                >
                  {/* Badge Icon bubble */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center border-2 mb-3 shadow-md
                      ${ach.unlocked 
                        ? 'bg-white border-white/60 animate-bounce-subtle' 
                        : 'bg-slate-200 border-slate-300 text-slate-400'
                      }`}
                  >
                    {ach.icon}
                  </div>

                  <h4 className="text-xs font-black tracking-tight font-display">{ach.title}</h4>
                  <p className="text-[9px] mt-1 leading-tight text-slate-500 font-medium max-w-[110px] mx-auto">
                    {ach.desc}
                  </p>

                  {/* Lock Indicator */}
                  {!ach.unlocked && (
                    <div className="absolute top-2 right-2 text-[9px] font-black tracking-tighter bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-md uppercase">
                      🔒
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
