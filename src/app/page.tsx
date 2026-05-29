'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wifi, Battery, ShieldAlert, Swords, Search, Flame } from 'lucide-react';
import SwiperShell from '@/components/SwiperShell';
import HomeScreen from '@/components/Screens/HomeScreen';
import StatsScreen from '@/components/Screens/StatsScreen';
import LeaderboardScreen from '@/components/Screens/LeaderboardScreen';
import ProfileScreen from '@/components/Screens/ProfileScreen';
import SudokuGame from '@/components/GamePlay/SudokuGame';
import { Difficulty } from '@/utils/sudokuGenerator';

export default function Home() {
  // Global States
  const [xp, setXp] = useState<number>(240);
  const [streak, setStreak] = useState<number>(7);
  const [solvedDates, setSolvedDates] = useState<string[]>([
    '2026-05-24',
    '2026-05-25',
    '2026-05-26',
    '2026-05-27',
    '2026-05-28',
    '2026-05-29',
  ]);
  const [stats, setStats] = useState({
    averageTime: 272,
    gamesPlayed: 142,
    accuracy: 96.8,
    history: [280, 265, 290, 255, 275, 248],
  });

  // Navigation
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Game States
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'pvp-searching' | 'pvp-playing'>('menu');
  const [gameMode, setGameMode] = useState<'daily' | 'custom'>('daily');
  const [gameDifficulty, setGameDifficulty] = useState<Difficulty>('medium');
  const [showDifficultySelector, setShowDifficultySelector] = useState<boolean>(false);

  // PvP Simulated States
  const [pvpOpponent, setPvpOpponent] = useState<{
    name: string;
    xp: number;
    avatarColor: string;
    streak: number;
  } | null>(null);
  const [pvpSeconds, setPvpSeconds] = useState<number>(0);
  const [opponentProgress, setOpponentProgress] = useState<number>(0);
  const [pvpResult, setPvpResult] = useState<'won' | 'lost' | null>(null);

  // Time String for Mobile Status Bar
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    // Keep status bar time updated
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`;
  };

  // Handle Game Completion
  const handleGameComplete = (solveTime: number, mistakes: number) => {
    // 1. Add XP
    const xpGain = 100;
    setXp(prev => prev + xpGain);

    // 2. Add today's solved date if not already in
    const todayStr = '2026-05-30';
    let newSolvedDates = [...solvedDates];
    if (!solvedDates.includes(todayStr)) {
      newSolvedDates.push(todayStr);
      setSolvedDates(newSolvedDates);
      // Increment streak
      setStreak(prev => prev + 1);
    }

    // 3. Recalculate stats
    setStats(prev => {
      const newGamesPlayed = prev.gamesPlayed + 1;
      const newAverageTime = Math.floor(
        (prev.averageTime * prev.gamesPlayed + solveTime) / newGamesPlayed
      );
      const newHistory = [...prev.history.slice(1), solveTime];
      
      // Accuracy formula based on mistakes
      const mistakesPenalty = mistakes * 2;
      const gameAccuracy = Math.max(70, 100 - mistakesPenalty);
      const newAccuracy = parseFloat(
        ((prev.accuracy * prev.gamesPlayed + gameAccuracy) / newGamesPlayed).toFixed(1)
      );

      return {
        averageTime: newAverageTime,
        gamesPlayed: newGamesPlayed,
        accuracy: newAccuracy,
        history: newHistory,
      };
    });
  };

  // Launch Sudoku Game
  const handleStartGame = (mode: 'daily' | 'custom', difficulty?: Difficulty) => {
    setGameMode(mode);
    if (mode === 'daily') {
      setGameDifficulty('medium');
      setGameState('playing');
    } else {
      // Show difficulty selector modal
      setShowDifficultySelector(true);
    }
  };

  const handleSelectDifficulty = (diff: Difficulty) => {
    setGameDifficulty(diff);
    setShowDifficultySelector(false);
    setGameState('playing');
  };

  // Launch Simulated PvP Matchmaking
  const handleStartPvPSearch = () => {
    setGameState('pvp-searching');
    setPvpResult(null);

    // Matchmaking takes 4.5 seconds
    setTimeout(() => {
      const opponents = [
        { name: 'Satoshi Nakamoto', xp: 3450, avatarColor: 'bg-amber-100 text-amber-600', streak: 45 },
        { name: 'Ivan Grozny', xp: 2100, avatarColor: 'bg-rose-100 text-rose-600', streak: 12 },
        { name: 'Marat 777', xp: 1980, avatarColor: 'bg-teal-100 text-teal-600', streak: 3 },
        { name: 'Chloe Dubois', xp: 2820, avatarColor: 'bg-purple-100 text-purple-600', streak: 19 },
      ];
      const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];
      setPvpOpponent(randomOpponent);
      setOpponentProgress(0);
      setPvpSeconds(0);
      setGameState('pvp-playing');
    }, 4500);
  };

  // Handle PvP Opponent Solving logic
  useEffect(() => {
    if (gameState !== 'pvp-playing') return;

    // Opponent ticks up progress periodically
    const opponentTimer = setInterval(() => {
      setOpponentProgress(prev => {
        const increment = Math.floor(Math.random() * 8) + 4; // 4-12% solved
        const newProgress = Math.min(100, prev + increment);

        if (newProgress >= 100) {
          clearInterval(opponentTimer);
          setPvpResult('lost');
        }
        return newProgress;
      });
      setPvpSeconds(s => s + 5);
    }, 4500);

    return () => clearInterval(opponentTimer);
  }, [gameState]);

  // PvP Victory Trigger
  const handlePvPVictory = (solveTime: number) => {
    setPvpResult('won');
    // Add extra PvP XP
    setXp(prev => prev + 150);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 md:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] md:from-slate-800 md:via-slate-950 md:to-black py-4 px-2 overflow-hidden relative">
      
      {/* Decorative blurred backgrounds on desktop */}
      <div className="hidden md:block absolute -top-40 -left-40 w-96 h-96 bg-brand-blue-500 rounded-full blur-[150px] opacity-15"></div>
      <div className="hidden md:block absolute -bottom-40 -right-40 w-96 h-96 bg-brand-green-500 rounded-full blur-[150px] opacity-10"></div>

      {/* Main iPhone Shell Wrapper Frame */}
      <div className="w-full max-w-[380px] h-screen md:h-[820px] bg-white rounded-none md:rounded-[44px] md:border-[10px] md:border-slate-800 md:shadow-2xl overflow-hidden relative flex flex-col shadow-inner">
        
        {/* Dynamic Island Notch (Only on desktop frame) */}
        <div className="hidden md:flex absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-full z-40 items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ml-auto mr-4 border border-slate-700"></div>
        </div>

        {/* Mobile Phone Status Bar */}
        <div className="w-full h-11 bg-white/95 backdrop-blur-sm flex items-center justify-between px-6 z-30 select-none border-b border-slate-50 relative shrink-0">
          {/* Time Indicator */}
          <span className="text-xs font-black text-slate-800 tracking-tight">{currentTime}</span>
          
          {/* Hardware status icons */}
          <div className="flex items-center gap-1.5 text-slate-700">
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black tracking-tighter">5G</span>
            <Battery className="w-4 h-4 fill-slate-700 text-slate-500" />
          </div>
        </div>

        {/* View Switcher Container */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-slate-50">
          <AnimatePresence mode="wait">
            
            {/* 1. Main Swipe Feed Menu */}
            {gameState === 'menu' && (
              <motion.div
                key="menu-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <SwiperShell activeIndex={activeIndex} setActiveIndex={setActiveIndex}>
                  {(index) => {
                    switch (index) {
                      case 0:
                        return (
                          <HomeScreen
                            xp={xp}
                            streak={streak}
                            solvedDates={solvedDates}
                            onStartGame={handleStartGame}
                            onOpenPvP={handleStartPvPSearch}
                          />
                        );
                      case 1:
                        return <StatsScreen stats={stats} />;
                      case 2:
                        return <LeaderboardScreen userXp={xp} />;
                      case 3:
                        return <ProfileScreen xp={xp} streak={streak} solvedDates={solvedDates} />;
                      default:
                        return null;
                    }
                  }}
                </SwiperShell>
              </motion.div>
            )}

            {/* 2. Standard Playable Sudoku Overlay */}
            {gameState === 'playing' && (
              <motion.div
                key="play-view"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="w-full h-full absolute inset-0 z-30"
              >
                <SudokuGame
                  difficulty={gameDifficulty}
                  mode={gameMode}
                  onClose={() => setGameState('menu')}
                  onVictory={handleGameComplete}
                />
              </motion.div>
            )}

            {/* 3. PvP Matchmaking Searching Overlay */}
            {gameState === 'pvp-searching' && (
              <motion.div
                key="searching-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center z-30"
              >
                {/* Radar Pulse circles */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <div className="absolute w-full h-full bg-purple-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute w-28 h-28 bg-purple-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                  <div className="absolute w-16 h-16 bg-purple-500/30 rounded-full animate-ping" style={{ animationDuration: '1.5s' }}></div>
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center border-2 border-purple-400 shadow-lg shadow-purple-500/50 relative z-10">
                    <Search className="w-5 h-5 text-white animate-pulse" />
                  </div>
                </div>

                <span className="bg-purple-900 text-purple-200 border border-purple-800 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mt-8 animate-pulse-subtle">
                  PvP Арена
                </span>
                <h3 className="text-xl font-black text-white font-display mt-3">Поиск соперника...</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-[200px]">
                  Подбираем равного оппонента в Лиге Мастеров
                </p>

                <button
                  onClick={() => setGameState('menu')}
                  className="mt-12 py-3 px-6 text-xs font-black uppercase rounded-2xl btn-3d-white border border-slate-800 text-slate-400 bg-slate-900 active:bg-slate-850 cursor-pointer shadow-lg"
                >
                  ОТМЕНИТЬ ПОИСК
                </button>
              </motion.div>
            )}

            {/* 4. Simulated PvP Playing Duel Board */}
            {gameState === 'pvp-playing' && (
              <motion.div
                key="pvp-play-view"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="w-full h-full absolute inset-0 z-30 flex flex-col bg-white"
              >
                {/* Simulated Opponent Progress Header */}
                <div className="w-full bg-slate-950 px-6 py-4 flex flex-col gap-3 shrink-0 border-b border-slate-850">
                  <div className="flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-blue-500 animate-pulse"></div>
                      <span className="font-extrabold">Ты (Alex)</span>
                    </div>
                    <span className="font-black text-purple-400">ДУЭЛЬ В РЕАЛЬНОМ ВРЕМЕНИ</span>
                    {pvpOpponent && (
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-300">{pvpOpponent.name}</span>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center font-bold text-[9px] ${pvpOpponent.avatarColor}`}>
                          {pvpOpponent.name.charAt(0)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dual progress bars */}
                  <div className="flex flex-col gap-2">
                    {/* Opponent progress */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                        <span>Прогресс соперника</span>
                        <span className="text-orange-500 font-black">{opponentProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-[4500ms]"
                          style={{ width: `${opponentProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The playable game board in PvP context */}
                <div className="flex-1 overflow-hidden relative">
                  <SudokuGame
                    difficulty="medium"
                    mode="custom"
                    onClose={() => setGameState('menu')}
                    onVictory={(secs) => handlePvPVictory(secs)}
                  />

                  {/* PvP Result Overlays (Won or Lost screen overlay) */}
                  <AnimatePresence>
                    {pvpResult && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-50"
                      >
                        <div className="bg-white rounded-[40px] p-8 max-w-sm w-full border border-slate-100 shadow-2xl flex flex-col items-center relative overflow-hidden">
                          {pvpResult === 'won' ? (
                            <>
                              <div className="w-16 h-16 rounded-full bg-brand-green-100 flex items-center justify-center border-2 border-brand-green-500 text-brand-green-600 mb-4 animate-bounce">
                                <Swords className="w-9 h-9" />
                              </div>
                              <span className="text-[10px] text-brand-green-500 font-black uppercase tracking-wider">Гладиатор Арены</span>
                              <h3 className="text-2xl font-black text-slate-800 font-display mt-1">Твоя Победа!</h3>
                              <p className="text-xs text-slate-500 mt-2 max-w-[240px]">
                                Ты решил задачу быстрее соперника и доказал превосходство своего ума!
                              </p>

                              <div className="w-full my-6 bg-slate-50 rounded-3xl p-4 border border-slate-200/50 flex flex-col items-center">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">Награда за Арену</span>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                                  <span className="text-base font-black text-amber-800">+150 XP • Лига Арены</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-500 text-red-600 mb-4 animate-pulse">
                                <ShieldAlert className="w-9 h-9" />
                              </div>
                              <span className="text-[10px] text-red-500 font-black uppercase tracking-wider">Поражение в дуэли</span>
                              <h3 className="text-2xl font-black text-slate-800 font-display mt-1">Оппонент был быстрее</h3>
                              <p className="text-xs text-slate-500 mt-2 max-w-[240px]">
                                Твой соперник {pvpOpponent?.name} успел заполнить сетку первым. Попробуй ещё раз!
                              </p>

                              <div className="w-full my-6 bg-slate-50 rounded-3xl p-4 border border-slate-200/50 flex flex-col items-center">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">Сводка по дуэли</span>
                                <span className="text-xs font-extrabold text-slate-500 mt-0.5">
                                  Оппонент решил за {formatTime(pvpSeconds)}
                                </span>
                              </div>
                            </>
                          )}

                          <button
                            onClick={() => {
                              // Reset PvP stats
                              setGameState('menu');
                              setPvpOpponent(null);
                              setPvpResult(null);
                            }}
                            className="w-full py-4 text-lg font-extrabold uppercase rounded-2xl btn-3d-green tracking-wide cursor-pointer"
                          >
                            ВЕРНУТЬСЯ В МЕНЮ
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Home Button Indicator (Apple-like bottom home line) */}
        <div className="w-full h-5 bg-white/95 backdrop-blur-sm flex items-center justify-center z-30 shrink-0 select-none pb-1 relative">
          <div className="w-32 h-1 bg-slate-900/40 rounded-full"></div>
        </div>

      </div>

      {/* Modern Difficulty Selector Overlay Modal */}
      <AnimatePresence>
        {showDifficultySelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] p-6 max-w-sm w-full border border-slate-100 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h4 className="text-lg font-black text-slate-800 font-display">Выбери сложность</h4>
                <button
                  onClick={() => setShowDifficultySelector(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Закрыть
                </button>
              </div>

              <div className="flex flex-col gap-3 py-6">
                {[
                  { key: 'easy', label: 'Легкий', color: 'btn-3d-green', text: 'Для разминки ума' },
                  { key: 'medium', label: 'Средний', color: 'btn-3d-blue', text: 'Оптимальный баланс' },
                  { key: 'hard', label: 'Сложный', color: 'btn-3d-orange', text: 'Испытание для мастеров' },
                  { key: 'expert', label: 'Эксперт', color: 'btn-3d-orange bg-rose-500 border-rose-700 hover:bg-rose-600', text: 'Только для гроссмейстеров' },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => handleSelectDifficulty(item.key as Difficulty)}
                    className={`w-full py-4 rounded-2xl flex items-center justify-between px-6 transition-all text-left group cursor-pointer ${item.color}`}
                  >
                    <div>
                      <span className="text-base font-extrabold block">{item.label}</span>
                      <span className="text-[10px] text-white/80 block mt-0.5">{item.text}</span>
                    </div>
                    <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
