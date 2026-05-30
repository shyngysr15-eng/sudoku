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

// 8-Bit Pixel Boy Avatar SVG Component (Scaled up & Chunky)
const PixelAvatar = () => (
  <svg viewBox="0 0 16 16" className="w-14 h-14 select-none border-[3px] border-[#433F38] rounded-xl shadow-[3px_3px_0px_0px_rgba(67,63,56,0.15)] bg-[#F4EAE1]">
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

// 8-Bit Pixel Gold Star SVG Component (High Contrast)
const PixelGoldStar = ({ size = 18 }: { size?: number }) => (
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
const PixelGrayStar = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 9 9" width={size} height={size} className="select-none opacity-30" style={{ imageRendering: 'pixelated' }}>
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

// 8-Bit Saturated Monochrome Trophy Cup SVG Icon (Dark Green)
const PixelMonochromeTrophy = () => (
  <svg viewBox="0 0 16 16" className="w-8 h-8 select-none" style={{ imageRendering: 'pixelated' }}>
    <rect x="3" y="2" width="10" height="1" fill="#19540E" />
    <rect x="2" y="3" width="12" height="1" fill="#19540E" />
    
    {/* Body Cup */}
    <rect x="2" y="4" width="12" height="3" fill="#19540E" />
    <rect x="3" y="7" width="10" height="1" fill="#19540E" />
    <rect x="4" y="8" width="8" height="1" fill="#19540E" />
    <rect x="5" y="9" width="6" height="1" fill="#19540E" />
    
    {/* Handle Left */}
    <rect x="0" y="4" width="2" height="3" fill="#19540E" />
    {/* Handle Right */}
    <rect x="14" y="4" width="2" height="3" fill="#19540E" />
    
    {/* Stand */}
    <rect x="7" y="10" width="2" height="3" fill="#19540E" />
    <rect x="4" y="13" width="8" height="2" fill="#19540E" />
  </svg>
);

// 8-Bit Saturated Monochrome Avatars SVG Icon (Dark Red)
const PixelMonochromeAvatars = () => (
  <svg viewBox="0 0 16 16" className="w-8 h-8 select-none" style={{ imageRendering: 'pixelated' }}>
    {/* Left Avatar */}
    <rect x="1" y="6" width="6" height="5" fill="#7A0C1E" />
    <rect x="2" y="4" width="4" height="2" fill="#7A0C1E" />
    <rect x="2" y="3" width="4" height="1" fill="#7A0C1E" />
    {/* Right Avatar */}
    <rect x="8" y="5" width="6" height="6" fill="#7A0C1E" />
    <rect x="9" y="3" width="4" height="2" fill="#7A0C1E" />
    <rect x="9" y="2" width="4" height="1" fill="#7A0C1E" />
  </svg>
);

// 8-Bit Saturated Monochrome Gear SVG Icon (Dark Blue)
const PixelMonochromeGear = () => (
  <svg viewBox="0 0 16 16" className="w-8 h-8 select-none" style={{ imageRendering: 'pixelated' }}>
    {/* Outer teeth */}
    <rect x="7" y="1" width="2" height="14" fill="#0D2E63" />
    <rect x="1" y="7" width="14" height="2" fill="#0D2E63" />
    
    {/* Core body */}
    <rect x="4" y="4" width="8" height="8" fill="#0D2E63" />
    <rect x="3" y="5" width="10" height="6" fill="#0D2E63" />
    <rect x="5" y="3" width="6" height="10" fill="#0D2E63" />
    
    {/* Hollow center */}
    <rect x="6" y="6" width="4" height="4" fill="#6B96D3" />
  </svg>
);

export default function HomeScreen({ xp, streak, solvedDates, onStartGame, onOpenPvP }: HomeScreenProps) {
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
    { label: 'WEEK 1', bg: 'bg-[#C1E7D7]', star: true }, // saturated soft green
    { label: 'WEEK 2', bg: 'bg-[#D3EBBF]', star: true }, // saturated pale green
    { label: 'WEEK 3', bg: 'bg-[#FFF0B3]', star: true }, // saturated butter yellow
    { label: 'WEEK 4', bg: 'bg-[#FAD0B6]', star: true }, // saturated orange/coral
    { label: 'WEEK 5', bg: 'bg-[#E5E5F0]', star: false }, // saturated soft lavender/gray
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#EFEFDE] overflow-y-auto no-scrollbar px-6 pt-8 pb-20 font-pixel select-none text-[#433F38] text-[12px] justify-between">
      
      {/* 1. Header Section */}
      <div className="flex items-center justify-between pb-4 shrink-0">
        {/* User profile */}
        <div className="flex items-center gap-3.5">
          <PixelAvatar />
          <span className="text-[13px] font-black tracking-tight uppercase">PixelSolver</span>
        </div>

        {/* XP Indicators */}
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] text-[#2E7D32] font-black uppercase">XP</span>
          <span className="text-[13px] font-black">{xp}</span>
          <PixelGoldStar size={20} />
        </div>
      </div>

      {/* 2. Middle Bento Panels (Highly Saturated & Chunky 3D borders) */}
      <div className="grid grid-cols-3 gap-4 shrink-0 my-1">
        
        {/* Calendar Bento Box (2/3 width) */}
        <div className="col-span-2 bg-[#FFFDF9] rounded-3xl border-[4px] border-[#433F38] p-4 shadow-[6px_6px_0px_0px_rgba(67,63,56,0.2)] flex flex-col gap-2.5">
          {/* Header Month picker */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black hover:scale-105 active:scale-95 cursor-pointer">&lt;</span>
            <span className="text-[10px] font-black uppercase tracking-tight text-center">MAY 2025</span>
            <span className="text-[11px] font-black hover:scale-105 active:scale-95 cursor-pointer">&gt;</span>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-0.5 text-center text-[7px] font-bold text-slate-400">
            {weekdays.map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Calendar Day grid */}
          <div className="grid grid-cols-7 gap-y-1.5 gap-x-0.5">
            {calendarData.map((item, idx) => (
              <div
                key={idx}
                className={`aspect-square w-full rounded-lg border-2 border-[#E6E4DC] flex flex-col items-center justify-center relative p-1
                  ${item.inactive 
                    ? 'bg-[#E6E4DC]/20 opacity-30 border-dashed' 
                    : 'bg-[#FFFDF9]'
                  }`}
              >
                <span className={`text-[7px] font-black leading-none ${item.inactive ? 'text-slate-400' : 'text-[#433F38]'}`}>
                  {item.day}
                </span>
                
                {/* Solved star */}
                {item.solved && (
                  <div className="absolute bottom-[2px] transform scale-[0.8] flex items-center justify-center">
                    <PixelGoldStar size={10} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Streaks (1/3 width) */}
        <div className="bg-[#FFFDF9] rounded-3xl border-[4px] border-[#433F38] p-4 shadow-[6px_6px_0px_0px_rgba(67,63,56,0.2)] flex flex-col gap-3">
          <h3 className="text-[8px] font-black text-center tracking-tight leading-tight">WEEKLY<br/>STREAKS</h3>
          
          <div className="flex flex-col gap-2 flex-1 justify-around">
            {weeklyStreaks.map((week, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between px-2.5 py-2.5 rounded-xl border-[3px] border-[#433F38] shadow-[3px_3px_0px_0px_rgba(67,63,56,0.15)] ${week.bg}`}
              >
                <span className="text-[7.5px] font-black tracking-tight">{week.label}</span>
                {week.star ? <PixelGoldStar size={10} /> : <PixelGrayStar size={10} />}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Bottom Puzzle-Piece Button Section (Layered Deep 3D Blocks) */}
      <div className="flex flex-col gap-2 shrink-0 relative mt-2 pb-6">
        
        {/* Row 1: Daily Challenge Button (3D Layered Base) */}
        <div className="w-full relative h-[86px] overflow-visible">
          
          {/* Static Dark 3D Shadow Base */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <svg viewBox="0 0 340 76" className="w-full h-full">
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
                fill="#19540E"
                stroke="#433F38"
                strokeWidth="4"
                strokeLinejoin="miter"
                transform="translate(0, 8)"
              />
            </svg>
          </div>

          {/* Active Translating Button Face */}
          <motion.button
            onClick={() => onStartGame('daily')}
            initial={{ y: 0 }}
            whileHover={{ y: 3 }}
            whileTap={{ y: 7 }}
            className="w-full h-full absolute top-0 left-0 cursor-pointer group focus:outline-none"
          >
            <svg viewBox="0 0 340 76" className="w-full h-full">
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
                fill="#4E9F3D"
                stroke="#433F38"
                strokeWidth="4"
                strokeLinejoin="miter"
              />
            </svg>

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-between px-8 text-white z-10 -translate-y-0.5">
              <span className="text-[12px] font-black tracking-widest uppercase font-pixel drop-shadow-[2.5px_2.5px_0px_rgba(25,84,14,0.8)]">
                Daily Challenge
              </span>
              <PixelMonochromeTrophy />
            </div>
          </motion.button>
        </div>

        {/* Row 2: Multiplayer & Custom locking row */}
        <div className="w-full grid grid-cols-2 gap-2 h-[86px] overflow-visible mt-[-2px]">
          
          {/* Multiplayer Button (Top socket, Right protrusion) */}
          <div className="w-full relative h-[86px] overflow-visible">
            
            {/* Static Dark 3D Shadow Base */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <svg viewBox="0 0 170 76" className="w-full h-full">
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
                  fill="#7A0C1E"
                  stroke="#433F38"
                  strokeWidth="4"
                  strokeLinejoin="miter"
                  transform="translate(0, 8)"
                />
              </svg>
            </div>

            {/* Active Button Face */}
            <motion.button
              onClick={onOpenPvP}
              initial={{ y: 0 }}
              whileHover={{ y: 3 }}
              whileTap={{ y: 7 }}
              className="w-full h-full absolute top-0 left-0 cursor-pointer group focus:outline-none"
            >
              <svg viewBox="0 0 170 76" className="w-full h-full">
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
                  fill="#D83A56"
                  stroke="#433F38"
                  strokeWidth="4"
                  strokeLinejoin="miter"
                />
              </svg>

              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center justify-between px-6 text-white z-10 translate-y-1.5">
                <span className="text-[9.5px] font-black tracking-widest uppercase font-pixel drop-shadow-[2.5px_2.5px_0px_rgba(122,12,30,0.8)]">
                  Multiplayer
                </span>
                <PixelMonochromeAvatars />
              </div>
            </motion.button>
          </div>

          {/* Custom Practice Button (Top socket, Left socket) */}
          <div className="w-full relative h-[86px] overflow-visible">
            
            {/* Static Dark 3D Shadow Base */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <svg viewBox="0 0 170 76" className="w-full h-full">
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
                  fill="#0D2E63"
                  stroke="#433F38"
                  strokeWidth="4"
                  strokeLinejoin="miter"
                  transform="translate(0, 8)"
                />
              </svg>
            </div>

            {/* Active Button Face */}
            <motion.button
              onClick={() => onStartGame('custom')}
              initial={{ y: 0 }}
              whileHover={{ y: 3 }}
              whileTap={{ y: 7 }}
              className="w-full h-full absolute top-0 left-0 cursor-pointer group focus:outline-none"
            >
              <svg viewBox="0 0 170 76" className="w-full h-full">
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
                  fill="#2A6FDB"
                  stroke="#433F38"
                  strokeWidth="4"
                  strokeLinejoin="miter"
                />
              </svg>

              {/* Content overlay */}
              <div className="absolute inset-0 flex items-center justify-between px-6 text-white z-10 translate-y-1.5">
                <span className="text-[9.5px] font-black tracking-widest uppercase font-pixel drop-shadow-[2.5px_2.5px_0px_rgba(13,46,99,0.8)]">
                  Custom
                </span>
                <PixelMonochromeGear />
              </div>
            </motion.button>
          </div>

        </div>

      </div>

    </div>
  );
}
