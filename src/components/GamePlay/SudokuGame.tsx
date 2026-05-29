'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, PenTool, Eraser, Lightbulb, Play, AlertTriangle, CheckCircle, Award, Star } from 'lucide-react';
import { generateSudoku, copyGrid, SudokuGrid, isBoardCorrect } from '@/utils/sudokuGenerator';
import { getLogicalHint, HintStep } from '@/utils/sudokuSolver';
import confetti from 'canvas-confetti';

interface SudokuGameProps {
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  mode: 'daily' | 'custom';
  onClose: () => void;
  onVictory: (solveTime: number, mistakes: number) => void;
}

export default function SudokuGame({ difficulty, mode, onClose, onVictory }: SudokuGameProps) {
  // Grids
  const [startingGrid, setStartingGrid] = useState<SudokuGrid>([]);
  const [solvedGrid, setSolvedGrid] = useState<SudokuGrid>([]);
  const [playerGrid, setPlayerGrid] = useState<SudokuGrid>([]);
  const [notesGrid, setNotesGrid] = useState<number[][][]>(() => 
    Array(9).fill(null).map(() => Array(9).fill(null).map(() => []))
  );

  // States
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [mistakes, setMistakes] = useState<number>(0);
  const [maxMistakes] = useState<number>(3);
  const [notesMode, setNotesMode] = useState<boolean>(false);
  const [undoStack, setUndoStack] = useState<{ grid: SudokuGrid; notes: number[][][] }[]>([]);
  const [hint, setHint] = useState<HintStep | null>(null);
  const [seconds, setSeconds] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false); // Lost due to mistakes
  const [victory, setVictory] = useState<boolean>(false); // Won!

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Game
  useEffect(() => {
    const { startingGrid: start, solvedGrid: solved } = generateSudoku(difficulty);
    setStartingGrid(start);
    setSolvedGrid(solved);
    setPlayerGrid(copyGrid(start));
    
    // Select first empty cell automatically
    let selected = false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (start[r][c] === 0) {
          setSelectedCell({ r, c });
          selected = true;
          break;
        }
      }
      if (selected) break;
    }

    // Start timer
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [difficulty]);

  // Format time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`;
  };

  // Push to Undo Stack
  const pushToUndo = (currentGrid: SudokuGrid, currentNotes: number[][][]) => {
    setUndoStack(prev => [
      ...prev,
      {
        grid: copyGrid(currentGrid),
        notes: currentNotes.map(row => row.map(cell => [...cell])),
      },
    ]);
  };

  // Undo Action
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setPlayerGrid(previous.grid);
    setNotesGrid(previous.notes);
    setUndoStack(prev => prev.slice(0, -1));
    setHint(null);
  };

  // Erase Action
  const handleErase = () => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    if (startingGrid[r][c] !== 0) return; // Cannot erase starting cells

    pushToUndo(playerGrid, notesGrid);

    const newGrid = copyGrid(playerGrid);
    newGrid[r][c] = 0;
    
    const newNotes = notesGrid.map(row => row.map(cell => [...cell]));
    newNotes[r][c] = []; // Clear notes too

    setPlayerGrid(newGrid);
    setNotesGrid(newNotes);
    setHint(null);
  };

  // Handle number input (1-9)
  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    
    // Cannot edit starting cells
    if (startingGrid[r][c] !== 0) return;

    pushToUndo(playerGrid, notesGrid);

    if (notesMode) {
      // Toggle note candidate
      const newNotes = notesGrid.map((row, rIdx) => 
        row.map((cell, cIdx) => {
          if (rIdx === r && cIdx === c) {
            if (cell.includes(num)) {
              return cell.filter(n => n !== num);
            } else {
              return [...cell, num].sort((a, b) => a - b);
            }
          }
          return [...cell];
        })
      );
      
      // Clear cell value if notes are updated
      const newGrid = copyGrid(playerGrid);
      newGrid[r][c] = 0;

      setNotesGrid(newNotes);
      setPlayerGrid(newGrid);
      setHint(null);
    } else {
      // Pen Mode (Enter Value)
      const newGrid = copyGrid(playerGrid);
      newGrid[r][c] = num;

      // Clear notes in that cell
      const newNotes = notesGrid.map(row => row.map(cell => [...cell]));
      newNotes[r][c] = [];

      // Check if correct
      let currentMistakes = mistakes;
      const isCorrect = solvedGrid[r][c] === num;
      if (!isCorrect) {
        // Increment mistakes
        currentMistakes = mistakes + 1;
        setMistakes(currentMistakes);
        if (currentMistakes >= maxMistakes) {
          // Game Over (Lost)
          setGameOver(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }

      setPlayerGrid(newGrid);
      setNotesGrid(newNotes);
      setHint(null);

      // Check if board complete and correct
      const isComplete = newGrid.every((row, ri) => 
        row.every((val, ci) => val === solvedGrid[ri][ci])
      );

      if (isComplete && currentMistakes < maxMistakes) {
        // Victory!
        setVictory(true);
        if (timerRef.current) clearInterval(timerRef.current);
        // Trigger confetti explosion!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  };

  // Get Logical Hint
  const handleRequestHint = () => {
    const logicalHint = getLogicalHint(playerGrid, solvedGrid);
    if (logicalHint) {
      setHint(logicalHint);
      setSelectedCell({ r: logicalHint.row, c: logicalHint.col });
    }
  };

  // Apply active Hint
  const handleApplyHint = () => {
    if (!hint) return;
    const { row: r, col: c, value: num } = hint;

    pushToUndo(playerGrid, notesGrid);

    const newGrid = copyGrid(playerGrid);
    newGrid[r][c] = num;

    const newNotes = notesGrid.map(row => row.map(cell => [...cell]));
    newNotes[r][c] = [];

    setPlayerGrid(newGrid);
    setNotesGrid(newNotes);
    setHint(null);

    // Check if victory
    const isComplete = newGrid.every((row, ri) => 
      row.every((val, ci) => val === solvedGrid[ri][ci])
    );

    if (isComplete) {
      setVictory(true);
      if (timerRef.current) clearInterval(timerRef.current);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  // Setup keyboard input listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || victory) return;
      if (!selectedCell) return;

      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        handleNumberInput(num);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
      } else if (e.key === 'n' || e.key === 'N') {
        setNotesMode(prev => !prev);
      } else if (e.key === 'ArrowUp' && selectedCell.r > 0) {
        setSelectedCell(prev => prev ? { r: prev.r - 1, c: prev.c } : null);
      } else if (e.key === 'ArrowDown' && selectedCell.r < 8) {
        setSelectedCell(prev => prev ? { r: prev.r + 1, c: prev.c } : null);
      } else if (e.key === 'ArrowLeft' && selectedCell.c > 0) {
        setSelectedCell(prev => prev ? { r: prev.r, c: prev.c - 1 } : null);
      } else if (e.key === 'ArrowRight' && selectedCell.c < 8) {
        setSelectedCell(prev => prev ? { r: prev.r, c: prev.c + 1 } : null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, notesMode, playerGrid, notesGrid, gameOver, victory]);

  // Restart game helper
  const handleRestart = () => {
    const { startingGrid: start, solvedGrid: solved } = generateSudoku(difficulty);
    setStartingGrid(start);
    setSolvedGrid(solved);
    setPlayerGrid(copyGrid(start));
    setNotesGrid(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
    setMistakes(0);
    setUndoStack([]);
    setHint(null);
    setSeconds(0);
    setGameOver(false);
    setVictory(false);

    // Select first empty
    let selected = false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (start[r][c] === 0) {
          setSelectedCell({ r, c });
          selected = true;
          break;
        }
      }
      if (selected) break;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative select-none">
      
      {/* Game Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100 sticky top-0 bg-white z-10">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors border border-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            {mode === 'daily' ? 'Ежедневный челлендж' : `Быстрая тренировка (${difficulty})`}
          </span>
          <div className="text-base font-black text-slate-800 tracking-tight font-display">
            {formatTime(seconds)}
          </div>
        </div>

        {/* Mistakes Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
          <span className="text-xs font-bold text-red-500 uppercase tracking-tighter">Ошибки:</span>
          <span className="text-xs font-black text-red-600 tracking-tight font-display">{mistakes}/{maxMistakes}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4 overflow-y-auto no-scrollbar">
        
        {/* Playable 9x9 Sudoku Grid */}
        <div className="w-full max-w-[340px] bg-slate-900 rounded-3xl p-1 shadow-2xl overflow-hidden border border-slate-900 relative">
          <div className="grid grid-cols-9 gap-[1px]">
            {playerGrid.map((row, rIdx) => 
              row.map((cellValue, cIdx) => {
                const isSelected = selectedCell?.r === rIdx && selectedCell?.c === cIdx;
                const isStarting = startingGrid[rIdx]?.[cIdx] !== 0;
                
                // Highlight calculations
                const isSameBox = selectedCell 
                  ? (Math.floor(selectedCell.r / 3) === Math.floor(rIdx / 3) && 
                     Math.floor(selectedCell.c / 3) === Math.floor(cIdx / 3))
                  : false;
                const isSameLine = selectedCell 
                  ? (selectedCell.r === rIdx || selectedCell.c === cIdx)
                  : false;
                
                const isSameValue = selectedCell && playerGrid[selectedCell.r][selectedCell.c] !== 0
                  ? playerGrid[selectedCell.r][selectedCell.c] === cellValue
                  : false;

                const isIncorrect = cellValue !== 0 && solvedGrid[rIdx]?.[cIdx] !== cellValue;

                // Hint Highlights
                const isHintCell = hint?.highlightCells.some(hc => hc.r === rIdx && hc.c === cIdx);
                const isHintGroup = hint?.highlightGroup === 'row' && hint?.groupIndex === rIdx
                  || hint?.highlightGroup === 'col' && hint?.groupIndex === cIdx
                  || hint?.highlightGroup === 'block' && hint?.groupIndex === (Math.floor(rIdx / 3) * 3 + Math.floor(cIdx / 3));

                // Borders between 3x3 blocks
                const borderRight = (cIdx === 2 || cIdx === 5) ? 'border-r-2 border-slate-800' : '';
                const borderBottom = (rIdx === 2 || rIdx === 5) ? 'border-b-2 border-slate-800' : '';

                // Background colors
                let bgClass = 'bg-white';
                if (isSelected) {
                  bgClass = 'bg-brand-blue-100/80';
                } else if (isIncorrect) {
                  bgClass = 'bg-red-100/70';
                } else if (isHintCell) {
                  bgClass = 'bg-brand-yellow-100/90 animate-pulse';
                } else if (isSameValue) {
                  bgClass = 'bg-brand-blue-100/40';
                } else if (isSameLine || isSameBox) {
                  bgClass = 'bg-slate-50/90';
                } else if (isHintGroup) {
                  bgClass = 'bg-brand-yellow-100/20';
                }

                // Text colors
                let textClass = isStarting ? 'text-slate-800 font-extrabold font-display' : 'text-brand-blue-600 font-semibold';
                if (isIncorrect) {
                  textClass = 'text-brand-coral-500 font-black';
                }

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => setSelectedCell({ r: rIdx, c: cIdx })}
                    className={`aspect-square w-full flex items-center justify-center relative text-base md:text-lg transition-all duration-150 cursor-pointer ${bgClass} ${borderRight} ${borderBottom}`}
                  >
                    {cellValue !== 0 ? (
                      <span className={textClass}>{cellValue}</span>
                    ) : (
                      // Render Pencil notes
                      <div className="grid grid-cols-3 gap-0.5 w-full h-full p-1 text-[8px] leading-none text-slate-400 font-bold">
                        {Array.from({ length: 9 }, (_, i) => i + 1).map(num => {
                          const hasNote = notesGrid[rIdx]?.[cIdx]?.includes(num);
                          return (
                            <div key={num} className="flex items-center justify-center">
                              {hasNote ? num : ''}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Input & Control Tools Bar */}
        <div className="w-full max-w-[340px] flex items-center justify-around gap-2 bg-slate-50 rounded-3xl p-3 border border-slate-200/80 shadow-inner">
          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 disabled:opacity-40 transition-all border border-slate-200 cursor-pointer shadow-sm"
            title="Отменить действие"
          >
            <RotateCcw className="w-4.5 h-4.5 text-slate-600" />
            <span className="text-[8px] font-black uppercase mt-1 text-slate-400">Назад</span>
          </button>

          {/* Erase Button */}
          <button
            onClick={handleErase}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 transition-all border border-slate-200 cursor-pointer shadow-sm"
            title="Очистить ячейку"
          >
            <Eraser className="w-4.5 h-4.5 text-slate-600" />
            <span className="text-[8px] font-black uppercase mt-1 text-slate-400">Стереть</span>
          </button>

          {/* Notes Toggle Button */}
          <button
            onClick={() => setNotesMode(prev => !prev)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl active:scale-95 transition-all border cursor-pointer shadow-sm relative
              ${notesMode 
                ? 'bg-brand-blue-500 border-brand-blue-600 text-white shadow-brand-blue-100' 
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
            title="Переключить карандашные заметки"
          >
            <PenTool className="w-4.5 h-4.5" />
            <span className={`text-[8px] font-black uppercase mt-1 ${notesMode ? 'text-blue-100' : 'text-slate-400'}`}>Заметки</span>
            {/* Notes Status Dot */}
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white flex items-center justify-center text-[7px] font-black text-white ${notesMode ? 'bg-orange-500 animate-bounce' : 'bg-slate-400'}`}>
              {notesMode ? 'ON' : '9'}
            </div>
          </button>

          {/* Smart Hint Button */}
          <button
            onClick={handleRequestHint}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 transition-all border border-slate-200 cursor-pointer shadow-sm"
            title="Запросить умную подсказку"
          >
            <Lightbulb className="w-4.5 h-4.5 text-brand-yellow-500 fill-amber-100" />
            <span className="text-[8px] font-black uppercase mt-1 text-slate-400">Помощь</span>
          </button>
        </div>

        {/* Soft Number Pad */}
        <div className="w-full max-w-[340px] grid grid-cols-9 gap-1.5 pt-1">
          {Array.from({ length: 9 }, (_, i) => i + 1).map(num => {
            return (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                className="aspect-square w-full rounded-2xl text-lg font-black bg-slate-100 border-b-4 border-slate-300 text-slate-700 active:border-b-0 active:translate-y-[4px] active:bg-slate-200 transition-all font-display cursor-pointer"
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Logical Smart Explainer Hint Panel Overlay */}
      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-brand-yellow-500 rounded-t-[32px] p-5 shadow-2xl z-30"
          >
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5.5 h-5.5 text-brand-yellow-500 fill-amber-100" />
                <h4 className="text-sm font-black text-slate-800 font-display">
                  Умный Помощник: {hint.technique}
                </h4>
              </div>
              <button
                onClick={() => setHint(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Закрыть
              </button>
            </div>
            
            <p className="text-xs leading-relaxed text-slate-600 font-medium" dangerouslySetInnerHTML={{ __html: hint.explanation }} />

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleApplyHint}
                className="flex-1 py-3 text-xs font-black uppercase text-white bg-brand-yellow-500 border-b-4 border-yellow-700 active:border-b-0 active:translate-y-[4px] rounded-xl cursor-pointer"
              >
                Вставить правильную цифру ({hint.value})
              </button>
              <button
                onClick={() => setHint(null)}
                className="py-3 px-4 text-xs font-black uppercase text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Понятно
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Victory Celebration Overlay Screen (Full Screen Slide Up) */}
      <AnimatePresence>
        {victory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-50 overflow-y-auto"
          >
            <div className="bg-white rounded-[40px] p-8 max-w-sm w-full border border-slate-100 shadow-2xl flex flex-col items-center relative overflow-hidden">
              {/* Star Background elements */}
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-brand-green-100 rounded-full blur-2xl opacity-40"></div>
              
              <div className="w-16 h-16 rounded-full bg-brand-green-100 flex items-center justify-center border-2 border-brand-green-500 text-brand-green-600 mb-4 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>

              <span className="text-[10px] text-brand-green-500 font-black uppercase tracking-wider">Победа!</span>
              <h3 className="text-2xl font-black text-slate-800 font-display mt-1">Отличная тренировка!</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-[240px]">
                Ты успешно решил это судоку и заслужил максимальное уважение Лиги!
              </p>

              {/* Bento Reward Metrics */}
              <div className="grid grid-cols-2 gap-3 w-full my-6 bg-slate-50 rounded-3xl p-4 border border-slate-200/50">
                <div className="flex flex-col items-center p-2">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Время</span>
                  <span className="text-base font-black text-slate-700 font-display mt-0.5">{formatTime(seconds)}</span>
                </div>
                <div className="flex flex-col items-center p-2 border-l border-slate-200">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Ошибки</span>
                  <span className="text-base font-black text-slate-700 font-display mt-0.5">{mistakes}</span>
                </div>
                <div className="flex flex-col items-center p-2 border-t border-slate-200 col-span-2">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Награда</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-base font-black text-amber-800">+100 XP</span>
                  </div>
                </div>
              </div>

              {/* Duolingo button */}
              <button
                onClick={() => {
                  onVictory(seconds, mistakes);
                  onClose();
                }}
                className="w-full py-4 text-lg font-extrabold uppercase rounded-2xl btn-3d-green tracking-wide cursor-pointer"
              >
                ПРОДОЛЖИТЬ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over due to Mistakes overlay screen */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-50"
          >
            <div className="bg-white rounded-[40px] p-8 max-w-sm w-full border border-slate-100 shadow-2xl flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-500 text-red-600 mb-4 animate-pulse">
                <AlertTriangle className="w-9 h-9" />
              </div>

              <span className="text-[10px] text-red-500 font-black uppercase tracking-wider">Попытки исчерпаны</span>
              <h3 className="text-2xl font-black text-slate-800 font-display mt-1">Ошибок слишком много</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-[240px]">
                Ты совершил {mistakes} ошибки. Но не расстраивайся, каждая ошибка — это ценный опыт!
              </p>

              <div className="flex gap-3 w-full mt-6">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-4 text-sm font-extrabold uppercase rounded-2xl btn-3d-blue tracking-wide cursor-pointer"
                >
                  ЕЩЕ РАЗ
                </button>
                <button
                  onClick={onClose}
                  className="py-4 px-6 text-sm font-extrabold uppercase rounded-2xl btn-3d-white tracking-wide cursor-pointer"
                >
                  ВЫЙТИ
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
