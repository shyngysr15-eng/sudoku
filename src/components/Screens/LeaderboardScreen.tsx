'use client';

import React, { useState } from 'react';
import { Trophy, Medal, User, Crown, Flame } from 'lucide-react';

interface LeaderboardScreenProps {
  userXp: number;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  isCurrentUser?: boolean;
  avatarColor: string;
  streak: number;
}

export default function LeaderboardScreen({ userXp }: LeaderboardScreenProps) {
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'alltime'>('daily');

  // Hardcoded leaderboard users
  const baseUsers: Omit<LeaderboardUser, 'rank'>[] = [
    { name: 'Sophia Martinez', xp: 2900, avatarColor: 'bg-emerald-100 text-emerald-600', streak: 42 },
    { name: 'Marcus Aurelius', xp: 2750, avatarColor: 'bg-amber-100 text-amber-600', streak: 28 },
    { name: 'Liam Chen', xp: 2600, avatarColor: 'bg-blue-100 text-blue-600', streak: 19 },
    { name: 'Alex Miller', xp: userXp, isCurrentUser: true, avatarColor: 'bg-brand-blue-100 text-brand-blue-600', streak: 7 },
    { name: 'Elena Petrova', xp: 2150, avatarColor: 'bg-rose-100 text-rose-600', streak: 12 },
    { name: 'Yuki Sato', xp: 1950, avatarColor: 'bg-indigo-100 text-indigo-600', streak: 3 },
    { name: 'Chloe Dubois', xp: 1800, avatarColor: 'bg-purple-100 text-purple-600', streak: 15 },
    { name: 'Hans Schmidt', xp: 1650, avatarColor: 'bg-teal-100 text-teal-600', streak: 8 },
  ];

  // Adjust scores depending on the filter for interactive feel
  const multiplier = filter === 'weekly' ? 4 : filter === 'alltime' ? 12 : 1;

  const users: LeaderboardUser[] = baseUsers
    .map(u => ({
      ...u,
      xp: u.isCurrentUser ? userXp : Math.floor(u.xp * multiplier),
    }))
    .sort((a, b) => b.xp - a.xp)
    .map((u, idx) => ({
      ...u,
      rank: idx + 1,
    }));

  const currentUser = users.find(u => u.isCurrentUser);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar pb-32 select-none relative">
      {/* Sticky Header */}
      <div className="flex flex-col gap-3 px-6 pt-6 pb-3 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-500">
            <Trophy className="w-5 h-5 fill-yellow-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800 font-display">Лидерборд</h2>
        </div>

        {/* Tab Filters */}
        <div className="bg-slate-100 p-1 rounded-2xl flex border border-slate-200">
          {(['daily', 'weekly', 'alltime'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-xs font-black uppercase rounded-xl transition-all cursor-pointer
                ${filter === f 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {f === 'daily' ? 'Сегодня' : f === 'weekly' ? 'Неделя' : 'Всё время'}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="px-5 pt-4 flex flex-col gap-2.5">
        {users.map(user => {
          const isTop3 = user.rank <= 3;
          const isSelf = user.isCurrentUser;

          return (
            <div
              key={user.name}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300
                ${isSelf 
                  ? 'bg-brand-blue-100/50 border-brand-blue-300 shadow-md shadow-blue-50/50 scale-[1.01]' 
                  : 'bg-white border-slate-200'
                }`}
            >
              {/* Left Column: Rank & Profile */}
              <div className="flex items-center gap-3">
                {/* Rank indicator */}
                <div className="w-7 flex items-center justify-center font-black font-display">
                  {user.rank === 1 ? (
                    <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-bounce-subtle" />
                  ) : user.rank === 2 ? (
                    <Medal className="w-5 h-5 text-slate-400 fill-slate-100" />
                  ) : user.rank === 3 ? (
                    <Medal className="w-5 h-5 text-amber-600 fill-amber-100" />
                  ) : (
                    <span className="text-sm text-slate-400">#{user.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${user.avatarColor} border border-black/5`}>
                  {user.isCurrentUser ? <User className="w-5 h-5" /> : user.name.charAt(0)}
                </div>

                {/* Name */}
                <div className="flex flex-col">
                  <span className={`text-sm font-extrabold tracking-tight ${isSelf ? 'text-brand-blue-600' : 'text-slate-700'}`}>
                    {user.name} {isSelf && ' (Ты)'}
                  </span>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span className="text-[10px] text-slate-400 font-bold">{user.streak} дн. страйк</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Score */}
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-black ${isSelf ? 'text-brand-blue-600' : 'text-slate-800'}`}>
                  {user.xp.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400">XP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating locked current user card at the bottom */}
      {currentUser && currentUser.rank > 3 && (
        <div className="absolute bottom-20 left-4 right-4 bg-white/95 backdrop-blur-md border-2 border-brand-blue-500 rounded-3xl p-4 shadow-xl flex items-center justify-between z-20 transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <span className="w-7 text-center text-sm font-black text-brand-blue-600 font-display">#{currentUser.rank}</span>
            <div className="w-9 h-9 rounded-xl bg-brand-blue-100 text-brand-blue-600 flex items-center justify-center border border-brand-blue-200">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 font-display">Alex Miller (Ты)</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Мастер Судоку</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-brand-blue-100 px-3 py-1 rounded-full border border-brand-blue-200">
            <span className="text-xs font-black text-brand-blue-600 tracking-tight">{currentUser.xp} XP</span>
          </div>
        </div>
      )}
    </div>
  );
}
