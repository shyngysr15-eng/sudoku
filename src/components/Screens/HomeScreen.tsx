'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Difficulty } from '@/utils/sudokuGenerator';

interface HomeScreenProps {
  xp: number;
  streak: number;
  solvedDates: string[];
  onStartGame: (mode: 'daily' | 'custom', difficulty?: Difficulty) => void;
  onOpenPvP: () => void;
}

// 8-Bit Pixel Boy Avatar SVG Component
const PixelAvatar = () => (
  <svg viewBox="0 0 16 16" className="w-12 h-12 select-none" style={{ imageRendering: 'pixelated' }}>
    {/* Avatar Outer Border & Background */}
    <rect width="16" height="16" fill="#F4EAE1" rx="2" />
    <rect x="0" y="0" width="16" height="16" fill="none" stroke="#433F38" strokeWidth="1" />
    
    {/* Hair */}
    <rect x="4" y="2" width="8" height="1" fill="#4B3220" />
    <rect x="3" y="3" width="10" height="1" fill="#4B3220" />
    <rect x="2" y="4" width="12" height="3" fill="#4B3220" />
    <rect x="2" y="7" width="2" height="3" fill="#4B3220" />
    <rect x="12" y="7" width="2" height="3" fill="#4B3220" />
    <rect x="4" y="3" width="4" height="1" fill="#65452E" /> {/* Hair Highlight */}
    <rect x="3" y="4" width="3" height="1" fill="#65452E" />

    {/* Face Skin */}
    <rect x="4" y="5" width="8" height="6" fill="#FAD1A7" />
    <rect x="3" y="7" width="1" height="2" fill="#FAD1A7" />
    <rect x="12" y="7" width="1" height="2" fill="#FAD1A7" />
    
    {/* Eyes */}
    <rect x="5" y="7" width="1" height="2" fill="#433F38" />
    <rect x="10" y="7" width="1" height="2" fill="#433F38" />
    
    {/* Blush */}
    <rect x="4" y="9" width="1" height="1" fill="#EFA2A2" />
    <rect x="11" y="9" width="1" height="1" fill="#EFA2A2" />
    
    {/* Mouth */}
    <rect x="7" y="9" width="2" height="1" fill="#433F38" />
    
    {/* Shirt */}
    <rect x="4" y="11" width="8" height="4" fill="#68A864" />
    <rect x="3" y="12" width="10" height="3" fill="#68A864" />
    <rect x="6" y="11" width="4" height="1" fill="#FAD1A7" /> {/* Neck */}
    
    {/* Shirt Collar Outline */}
    <rect x="5" y="12" width="6" height="1" fill="#4D864A" />
  </svg>
);

// 8-Bit Pixel Gold Star SVG Component
const PixelGoldStar = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 9 9" width={size} height={size} className="select-none" style={{ imageRendering: 'pixelated' }}>
    {/* Outline */}
    <rect x="4" y="0" width="1" height="1" fill="#433F38" />
    
    <rect x="3" y="1" width="1" height="1" fill="#433F38" />
    <rect x="4" y="1" width="1" height="1" fill="#FFC800" />
    <rect x="5" y="1" width="1" height="1" fill="#433F38" />
    
    <rect x="2" y="2" width="1" height="1" fill="#433F38" />
    <rect x="3" y="2" width="3" height="1" fill="#FFC800" />
    <rect x="6" y="2" width="1" height="1" fill="#433F38" />
    
    <rect x="0" y="3" width="1" height="1" fill="#433F38" />
    <rect x="1" y="3" width="7" height="1" fill="#FFC800" />
    <rect x="8" y="3" width="1" height="1" fill="#433F38" />
    
    <rect x="1" y="4" width="7" height="1" fill="#FFC800" />
    <rect x="0" y="4" width="1" height="1" fill="#433F38" />
    <rect x="8" y="4" width="1" height="1" fill="#433F38" />
    
    {/* Inner Orange Shadow */}
    <rect x="2" y="4" width="5" height="1" fill="#E69500" />
    
    <rect x="1" y="5" width="1" height="1" fill="#433F38" />
    <rect x="2" y="5" width="5" height="1" fill="#FFC800" />
    <rect x="7" y="5" width="1" height="1" fill="#433F38" />
    <rect x="2" y="5" width="1" height="1" fill="#E69500" />
    <rect x="6" y="5" width="1" height="1" fill="#E69500" />
    
    <rect x="2" y="6" width="1" height="1" fill="#433F38" />
    <rect x="3" y="6" width="3" height="1" fill="#FFC800" />
    <rect x="6" y="6" width="1" height="1" fill="#433F38" />
    <rect x="3" y="6" width="1" height="1" fill="#E69500" />
    
    <rect x="1" y="7" width="1" height="1" fill="#433F38" />
    <rect x="2" y="7" width="1" height="1" fill="#FFC800" />
    <rect x="3" y="7" width="1" height="1" fill="#433F38" />
    <rect x="5" y="7" width="1" height="1" fill="#433F38" />
    <rect x="6" y="7" width="1" height="1" fill="#FFC800" />
    <rect x="7" y="7" width="1" height="1" fill="#433F38" />
    
    <rect x="1" y="8" width="2" height="1" fill="#433F38" />
    <rect x="6" y="8" width="2" height="1" fill="#433F38" />
  </svg>
);

// 8-Bit Pixel Gray Star SVG Component
const PixelGrayStar = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 9 9" width={size} height={size} className="select-none opacity-40" style={{ imageRendering: 'pixelated' }}>
    {/* Outline */}
    <rect x="4" y="0" width="1" height="1" fill="#433F38" />
    
    <rect x="3" y="1" width="1" height="1" fill="#433F38" />
    <rect x="4" y="1" width="1" height="1" fill="#9CA3AF" />
    <rect x="5" y="1" width="1" height="1" fill="#433F38" />
    
    <rect x="2" y="2" width="1" height="1" fill="#433F38" />
    <rect x="3" y="2" width="3" height="1" fill="#9CA3AF" />
    <rect x="6" y="2" width="1" height="1" fill="#433F38" />
    
    <rect x="0" y="3" width="1" height="1" fill="#433F38" />
    <rect x="1" y="3" width="7" height="1" fill="#9CA3AF" />
    <rect x="8" y="3" width="1" height="1" fill="#433F38" />
    
    <rect x="1" y="4" width="7" height="1" fill="#9CA3AF" />
    <rect x="0" y="4" width="1" height="1" fill="#433F38" />
    <rect x="8" y="4" width="1" height="1" fill="#433F38" />
    
    {/* Inner Gray Shadow */}
    <rect x="2" y="4" width="5" height="1" fill="#6B7280" />
    
    <rect x="1" y="5" width="1" height="1" fill="#433F38" />
    <rect x="2" y="5" width="5" height="1" fill="#9CA3AF" />
    <rect x="7" y="5" width="1" height="1" fill="#433F38" />
    <rect x="2" y="5" width="1" height="1" fill="#6B7280" />
    <rect x="6" y="5" width="1" height="1" fill="#6B7280" />
    
    <rect x="2" y="6" width="1" height="1" fill="#433F38" />
    <rect x="3" y="6" width="3" height="1" fill="#9CA3AF" />
    <rect x="6" y="6" width="1" height="1" fill="#433F38" />
    <rect x="3" y="6" width="1" height="1" fill="#6B7280" />
    
    <rect x="1" y="7" width="1" height="1" fill="#433F38" />
    <rect x="2" y="7" width="1" height="1" fill="#9CA3AF" />
    <rect x="3" y="7" width="1" height="1" fill="#433F38" />
    <rect x="5" y="7" width="1" height="1" fill="#433F38" />
    <rect x="6" y="7" width="1" height="1" fill="#9CA3AF" />
    <rect x="7" y="7" width="1" height="1" fill="#433F38" />
    
    <rect x="1" y="8" width="2" height="1" fill="#433F38" />
    <rect x="6" y="8" width="2" height="1" fill="#433F38" />
  </svg>
);

// 8-Bit Pixel Trophy Cup SVG Icon
const PixelTrophy = () => (
  <svg viewBox="0 0 16 16" className="w-8 h-8 select-none" style={{ imageRendering: 'pixelated' }}>
    <rect x="3" y="2" width="10" height="1" fill="#433F38" />
    <rect x="2" y="3" width="12" height="1" fill="#433F38" />
    
    {/* Body Cup */}
    <rect x="2" y="4" width="12" height="3" fill="#FFC800" />
    <rect x="3" y="7" width="10" height="1" fill="#FFC800" />
    <rect x="4" y="8" width="8" height="1" fill="#FFC800" />
    <rect x="5" y="9" width="6" height="1" fill="#FFC800" />
    
    {/* Cup Shadow */}
    <rect x="8" y="4" width="4" height="3" fill="#E69500" />
    <rect x="8" y="7" width="5" height="1" fill="#E69500" />
    <rect x="8" y="8" width="4" height="1" fill="#E69500" />
    <rect x="8" y="9" width="3" height="1" fill="#E69500" />
    
    {/* Handle Left */}
    <rect x="0" y="4" width="2" height="3" fill="#433F38" />
    <rect x="1" y="4" width="1" height="3" fill="#FFC800" />
    
    {/* Handle Right */}
    <rect x="14" y="4" width="2" height="3" fill="#433F38" />
    <rect x="14" y="4" width="1" height="3" fill="#E69500" />
    
    {/* Stand */}
    <rect x="7" y="10" width="2" height="3" fill="#FFC800" />
    <rect x="8" y="10" width="1" height="3" fill="#E69500" />
    <rect x="4" y="13" width="8" height="2" fill="#433F38" />
    
    {/* Outer border details */}
    <rect x="2" y="4" width="1" height="3" fill="#433F38" />
    <rect x="13" y="4" width="1" height="3" fill="#433F38" />
    <rect x="3" y="7" width="1" height="1" fill="#433F38" />
    <rect x="12" y="7" width="1" height="1" fill="#433F38" />
    <rect x="4" y="8" width="1" height="1" fill="#433F38" />
    <rect x="11" y="8" width="1" height="1" fill="#433F38" />
    <rect x="5" y="9" width="1" height="1" fill="#433F38" />
    <rect x="10" y="9" width="1" height="1" fill="#433F38" />
    <rect x="6" y="10" width="1" height="3" fill="#433F38" />
    <rect x="9" y="10" width="1" height="3" fill="#433F38" />
  </svg>
);

// 8-Bit Pixel Avatars SVG Icon for Multiplayer
const PixelDoubleAvatars = () => (
  <svg viewBox="0 0 16 16" className="w-8 h-8 select-none opacity-90" style={{ imageRendering: 'pixelated' }}>
    {/* Left Avatar */}
    <rect x="1" y="6" width="6" height="5" fill="#EC8282" />
    <rect x="2" y="4" width="4" height="2" fill="#FAD1A7" />
    <rect x="2" y="3" width="4" height="1" fill="#4B3220" />
    {/* Right Avatar */}
    <rect x="8" y="5" width="6" height="6" fill="#8CB4E1" />
    <rect x="9" y="3" width="4" height="2" fill="#FAD1A7" />
    <rect x="9" y="2" width="4" height="1" fill="#4B3220" />
    
    {/* Outlines */}
    <rect x="1" y="6" width="6" height="5" fill="none" stroke="#433F38" strokeWidth="1" />
    <rect x="8" y="5" width="6" height="6" fill="none" stroke="#433F38" strokeWidth="1" />
  </svg>
);

// 8-Bit Pixel Gear Settings SVG Icon
const PixelGear = () => (
  <svg viewBox="0 0 16 16" className="w-8 h-8 select-none opacity-90" style={{ imageRendering: 'pixelated' }}>
    {/* Outer teeth */}
    <rect x="7" y="1" width="2" height="14" fill="#433F38" />
    <rect x="1" y="7" width="14" height="2" fill="#433F38" />
    
    {/* Core Round body */}
    <rect x="4" y="4" width="8" height="8" fill="#8892B0" />
    <rect x="3" y="5" width="10" height="6" fill="#8892B0" />
    <rect x="5" y="3" width="6" height="10" fill="#8892B0" />
    
    {/* Shadow details */}
    <rect x="8" y="4" width="4" height="8" fill="#6B7280" />
    <rect x="8" y="5" width="5" height="6" fill="#6B7280" />
    <rect x="8" y="3" width="3" height="10" fill="#6B7280" />
    
    {/* Hollow center */}
    <rect x="6" y="6" width="4" height="4" fill="#F5F5F0" />
    <rect x="6" y="6" width="4" height="4" fill="none" stroke="#433F38" strokeWidth="1" />
  </svg>
);

export default function HomeScreen({ xp, streak, solvedDates, onStartGame, onOpenPvP }: HomeScreenProps) {
  // Calendar Matrix Config matching image_1.png
  // May 2025 starts on Thursday (index 3)
  // Weeks of May 2025:
  // Week 1: 28, 29, 30 (April, inactive) | 1, 2, 3 (Active) | 4 (Incomplete)
  // Week 2: 5, 6 (Active) | 7 (Incomplete) | 8, 9, 10 (Active) | 11 (Incomplete)
  // Week 3: 12, 13 (Active) | 14 (Incomplete) | 15 (Active) | 16 (Incomplete) | 17 (Active) | 18 (Incomplete)
  // Week 4: 19, 20 (Active) | 21 (Incomplete) | 22, 23, 24 (Active) | 25 (Incomplete)
  // Week 5: 26, 27, 28, 29, 30 (Active) | 31 (Incomplete) | 1 (June, inactive)
  
  const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  const calendarData = [
    // Week 1
    { day: 28, inactive: true }, { day: 29, inactive: true }, { day: 30, inactive: true },
    { day: 1, active: true, solved: true }, { day: 2, active: true, solved: true }, { day: 3, active: true, solved: true }, { day: 4, active: true },
    // Week 2
    { day: 5, active: true, solved: true }, { day: 6, active: true, solved: true }, { day: 7, active: true },
    { day: 8, active: true, solved: true }, { day: 9, active: true, solved: true }, { day: 10, active: true, solved: true }, { day: 11, active: true },
    // Week 3
    { day: 12, active: true, solved: true }, { day: 13, active: true, solved: true }, { day: 14, active: true },
    { day: 15, active: true, solved: true }, { day: 16, active: true }, { day: 17, active: true, solved: true }, { day: 18, active: true },
    // Week 4
    { day: 19, active: true, solved: true }, { day: 20, active: true, solved: true }, { day: 21, active: true },
    { day: 22, active: true, solved: true }, { day: 23, active: true, solved: true }, { day: 24, active: true, solved: true }, { day: 25, active: true },
    // Week 5
    { day: 26, active: true, solved: true }, { day: 27, active: true, solved: true }, { day: 28, active: true, solved: true },
    { day: 29, active: true, solved: true }, { day: 30, active: true, solved: true }, { day: 31, active: true }, { day: 1, inactive: true }
  ];

  const weeklyStreaks = [
    { label: 'WEEK 1', bg: 'bg-[#D2EDE1]', star: true }, // soft pastel mint green
    { label: 'WEEK 2', bg: 'bg-[#E2F0D9]', star: true }, // soft pastel pale green
    { label: 'WEEK 3', bg: 'bg-[#FFF2CC]', star: true }, // soft pastel butter yellow
    { label: 'WEEK 4', bg: 'bg-[#FCE4D6]', star: true }, // soft pastel coral/orange
    { label: 'WEEK 5', bg: 'bg-[#EDEDF5]', star: false }, // soft pastel gray/lavender
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#F5F5F0] overflow-y-auto no-scrollbar pb-24 font-pixel select-none text-[#433F38] text-[10px]">
      
      {/* 1. Header Section */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2 shrink-0 select-none">
        {/* User profile */}
        <div className="flex items-center gap-3">
          <PixelAvatar />
          <span className="text-[11px] font-bold tracking-tight uppercase">PixelSolver</span>
        </div>

        {/* XP indicators */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#60B544] font-black uppercase">XP</span>
          <span className="text-[11px] font-black">{xp}</span>
          <PixelGoldStar size={16} />
        </div>
      </div>

      {/* 2. Middle Bento Panels */}
      <div className="px-5 pt-3 grid grid-cols-3 gap-3.5 shrink-0">
        
        {/* Calendar Bento Box (2/3 width) */}
        <div className="col-span-2 bg-[#FFFDF9] rounded-2xl border-[3px] border-[#433F38] p-3 shadow-[4px_4px_0px_0px_rgba(67,63,56,0.15)] flex flex-col gap-2">
          {/* Header Month picker */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[9px] font-black hover:scale-105 active:scale-95 cursor-pointer">&lt;</span>
            <span className="text-[8px] font-black uppercase tracking-tight text-center">MAY 2025</span>
            <span className="text-[9px] font-black hover:scale-105 active:scale-95 cursor-pointer">&gt;</span>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-0.5 text-center text-[5.5px] font-bold text-slate-400">
            {weekdays.map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Calendar Day grid */}
          <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
            {calendarData.map((item, idx) => (
              <div
                key={idx}
                className={`aspect-square w-full rounded-md border border-[#E6E4DC] flex flex-col items-center justify-center relative p-0.5
                  ${item.inactive 
                    ? 'bg-[#E6E4DC]/20 opacity-30 border-dashed' 
                    : 'bg-[#FFFDF9]'
                  }`}
              >
                <span className={`text-[6px] font-bold leading-none ${item.inactive ? 'text-slate-400' : 'text-[#433F38]'}`}>
                  {item.day}
                </span>
                
                {/* Solved star */}
                {item.solved && (
                  <div className="absolute bottom-[1px] transform scale-[0.7] flex items-center justify-center">
                    <PixelGoldStar size={8} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Streaks (1/3 width) */}
        <div className="bg-[#FFFDF9] rounded-2xl border-[3px] border-[#433F38] p-3 shadow-[4px_4px_0px_0px_rgba(67,63,56,0.15)] flex flex-col gap-2">
          <h3 className="text-[6.5px] font-black text-center tracking-tight leading-tight">WEEKLY<br/>STREAKS</h3>
          
          <div className="flex flex-col gap-1.5 flex-1 justify-around">
            {weeklyStreaks.map((week, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between px-2 py-1.5 rounded-lg border-2 border-[#433F38] shadow-[2px_2px_0px_0px_rgba(67,63,56,0.1)] ${week.bg}`}
              >
                <span className="text-[5.5px] font-black tracking-tight">{week.label}</span>
                {week.star ? <PixelGoldStar size={8} /> : <PixelGrayStar size={8} />}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Bottom Puzzle-Piece Button Section */}
      <div className="px-5 pt-6 flex flex-col gap-1.5 shrink-0 relative pb-4">
        
        {/* Row 1: Daily Challenge Button (Protrusions pointing down) */}
        <div className="w-full relative h-[78px] overflow-visible">
          <motion.button
            onClick={() => onStartGame('daily')}
            whileHover={{ y: 3 }}
            whileTap={{ y: 6 }}
            className="w-full h-full relative cursor-pointer group focus:outline-none"
          >
            {/* Custom SVG Interlocking shape */}
            <svg viewBox="0 0 340 76" className="w-full h-full drop-shadow-[4px_4px_0px_rgba(67,63,56,0.15)]">
              {/* Protrusion tabs at bottom-left-center and bottom-right-center */}
              <path
                d="
                  M 4 4 
                  H 336 
                  V 56 
                  H 252 
                  c -2 0 -3 2 -3 4 
                  v 2 
                  c 0 4 -2 6 -6 6 
                  h -12 
                  c -4 0 -6 -2 -6 -6 
                  v -2 
                  c 0 -2 -1 -4 -3 -4 
                  H 116 
                  c -2 0 -3 2 -3 4 
                  v 2 
                  c 0 4 -2 6 -6 6 
                  h -12 
                  c -4 0 -6 -2 -6 -6 
                  v -2 
                  c 0 -2 -1 -4 -3 -4 
                  H 4 
                  Z
                "
                fill="#8ECA88"
                stroke="#433F38"
                strokeWidth="3.5"
                strokeLinejoin="miter"
              />
              {/* Highlight inner bottom 3D edge */}
              <path
                d="M 6 54 H 78 M 114 54 H 222 M 248 54 H 334"
                stroke="#62A45C"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
            </svg>

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-between px-8 text-white z-10 -translate-y-1">
              <span className="text-[10px] font-black tracking-widest uppercase font-pixel drop-shadow-[2px_2px_0px_rgba(67,63,56,0.5)]">
                Daily Challenge
              </span>
              <PixelTrophy />
            </div>
          </motion.button>
        </div>

        {/* Row 2: Multiplayer & Custom locking row */}
        <div className="w-full grid grid-cols-2 gap-1.5 h-[78px] overflow-visible mt-[-8px]">
          
          {/* Multiplayer Button (Top socket, Right protrusion) */}
          <div className="w-full relative h-[78px] overflow-visible">
            <motion.button
              onClick={onOpenPvP}
              whileHover={{ y: 3 }}
              whileTap={{ y: 6 }}
              className="w-full h-full relative cursor-pointer group focus:outline-none"
            >
              {/* Custom SVG Interlocking shape */}
              <svg viewBox="0 0 170 76" className="w-full h-full drop-shadow-[4px_4px_0px_rgba(67,63,56,0.15)]">
                {/* Top socket at top-left-center + Right protrusion at right-center */}
                <path
                  d="
                    M 4 20 
                    H 70 
                    c 2 0 3 -2 3 -4 
                    v -2 
                    c 0 -4 2 -6 6 -6 
                    h 12 
                    c 4 0 6 2 6 6 
                    v 2 
                    c 0 2 1 4 3 4 
                    h 66 
                    v 16 
                    c 0 2 2 3 4 3 
                    h 2 
                    c 4 0 6 2 6 6 
                    v 12 
                    c 0 4 -2 6 -6 6 
                    h -2 
                    c -2 0 -4 1 -4 3 
                    v 10 
                    H 4 
                    Z
                  "
                  fill="#EC8282"
                  stroke="#433F38"
                  strokeWidth="3.5"
                  strokeLinejoin="miter"
                />
                {/* Shadow detail edge */}
                <path
                  d="M 6 70 H 164"
                  stroke="#BC4E4E"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                />
              </svg>

              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center justify-between px-6 text-white z-10 translate-y-2">
                <span className="text-[8px] font-black tracking-widest uppercase font-pixel drop-shadow-[2px_2px_0px_rgba(67,63,56,0.5)]">
                  Multiplayer
                </span>
                <PixelDoubleAvatars />
              </div>
            </motion.button>
          </div>

          {/* Custom Practice Button (Top socket, Left socket) */}
          <div className="w-full relative h-[78px] overflow-visible">
            <motion.button
              onClick={() => onStartGame('custom')}
              whileHover={{ y: 3 }}
              whileTap={{ y: 6 }}
              className="w-full h-full relative cursor-pointer group focus:outline-none"
            >
              {/* Custom SVG Interlocking shape */}
              <svg viewBox="0 0 170 76" className="w-full h-full drop-shadow-[4px_4px_0px_rgba(67,63,56,0.15)]">
                {/* Top socket at top-right-center + Left socket at left-center */}
                <path
                  d="
                    M 4 20 
                    H 62 
                    c 2 0 3 -2 3 -4 
                    v -2 
                    c 0 -4 2 -6 6 -6 
                    h 12 
                    c 4 0 6 2 6 6 
                    v 2 
                    c 0 2 1 4 3 4 
                    h 74 
                    v 52 
                    H 20 
                    c -2 0 -4 -1 -4 -3 
                    v -10 
                    c 0 -4 -2 -6 -6 -6 
                    h -2 
                    c -4 0 -6 2 -6 6 
                    v 10 
                    c 0 2 -2 3 -4 3 
                    H 4 
                    Z
                  "
                  fill="#6B96D3"
                  stroke="#433F38"
                  strokeWidth="3.5"
                  strokeLinejoin="miter"
                />
                {/* Shadow detail edge */}
                <path
                  d="M 6 70 H 164"
                  stroke="#456FA6"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                />
              </svg>

              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center justify-between px-6 text-white z-10 translate-y-2">
                <span className="text-[8px] font-black tracking-widest uppercase font-pixel drop-shadow-[2px_2px_0px_rgba(67,63,56,0.5)]">
                  Custom
                </span>
                <PixelGear />
              </div>
            </motion.button>
          </div>

        </div>

      </div>

    </div>
  );
}
