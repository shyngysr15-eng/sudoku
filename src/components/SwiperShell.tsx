'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BarChart2, Trophy, User } from 'lucide-react';

interface SwiperShellProps {
  children: (activeIndex: number) => React.ReactNode;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const SCREENS = [
  { name: 'Главная', icon: <Home className="w-5.5 h-5.5" /> },
  { name: 'Статистика', icon: <BarChart2 className="w-5.5 h-5.5" /> },
  { name: 'Лидерборд', icon: <Trophy className="w-5.5 h-5.5" /> },
  { name: 'Профиль', icon: <User className="w-5.5 h-5.5" /> },
];

export default function SwiperShell({ children, activeIndex, setActiveIndex }: SwiperShellProps) {
  const [direction, setDirection] = useState<number>(1); // 1 = moving down (next), -1 = moving up (prev)
  const isTransitioning = useRef<boolean>(false);

  // Transition handler
  const transitionTo = (newIndex: number, customDir?: number) => {
    if (isTransitioning.current) return;
    if (newIndex === activeIndex) return;

    isTransitioning.current = true;
    
    // Determine scroll direction if not provided
    const dir = customDir !== undefined 
      ? customDir 
      : newIndex > activeIndex ? 1 : -1;
      
    setDirection(dir);
    setActiveIndex(newIndex);

    setTimeout(() => {
      isTransitioning.current = false;
    }, 450); // cooldown matches animation duration
  };

  // Drag handler for Framer Motion
  const handleDragEnd = (event: any, info: any) => {
    const threshold = 60;
    const velocityThreshold = 200;
    const offsetY = info.offset.y;
    const velocityY = info.velocity.y;

    if (offsetY < -threshold || velocityY < -velocityThreshold) {
      // Swipe up -> Next screen
      const nextIndex = (activeIndex + 1) % SCREENS.length;
      transitionTo(nextIndex, 1);
    } else if (offsetY > threshold || velocityY > velocityThreshold) {
      // Swipe down -> Prev screen
      const prevIndex = (activeIndex - 1 + SCREENS.length) % SCREENS.length;
      transitionTo(prevIndex, -1);
    }
  };

  // Wheel scroll handler (for desktop mice) with debounce/throttle
  useEffect(() => {
    let lastWheelTime = 0;
    
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime < 800) return; // 800ms cooldown

      const deltaY = e.deltaY;
      const threshold = 15;

      if (deltaY > threshold) {
        // Scroll down -> Next screen
        lastWheelTime = now;
        const nextIndex = (activeIndex + 1) % SCREENS.length;
        transitionTo(nextIndex, 1);
      } else if (deltaY < -threshold) {
        // Scroll up -> Prev screen
        lastWheelTime = now;
        const prevIndex = (activeIndex - 1 + SCREENS.length) % SCREENS.length;
        transitionTo(prevIndex, -1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeIndex]);

  // Framer Motion sliding animations
  const slideVariants = {
    initial: (dir: number) => ({
      y: dir > 0 ? '100%' : '-100%',
      opacity: 0.9,
    }),
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        y: { type: 'spring', stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      y: dir > 0 ? '-100%' : '100%',
      opacity: 0.9,
      transition: {
        y: { type: 'spring', stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 relative overflow-hidden select-none">
      
      {/* Active Screen Area with Snapping Slides */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="w-full h-full cursor-grab active:cursor-grabbing absolute inset-0 z-0"
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              {children(activeIndex)}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Glassmorphic Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-lg border-t border-slate-100 flex items-center justify-around px-4 z-20 pb-4">
        {SCREENS.map((screen, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={screen.name}
              onClick={() => {
                const dir = idx > activeIndex ? 1 : -1;
                transitionTo(idx, dir);
              }}
              className="flex flex-col items-center justify-center flex-1 h-full py-2 relative focus:outline-none cursor-pointer"
            >
              {/* Animated active background bubble */}
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-brand-blue-100/50 rounded-2xl mx-2 my-1 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div className={`transition-colors duration-200 ${isActive ? 'text-brand-blue-600 scale-105' : 'text-slate-400'}`}>
                {screen.icon}
              </div>

              {/* Label */}
              <span className={`text-[10px] font-black uppercase mt-1 tracking-tight transition-colors duration-200 ${isActive ? 'text-brand-blue-600 font-extrabold' : 'text-slate-400'}`}>
                {screen.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
