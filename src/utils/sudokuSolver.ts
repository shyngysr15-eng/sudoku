// Sudoku Logical Solver & Hint Explainer
// Implements algorithms to find Naked Singles, Hidden Singles, and explain them to the user.

import { SudokuGrid, isValid } from './sudokuGenerator';

export interface HintStep {
  row: number;
  col: number;
  value: number;
  technique: string;
  explanation: string;
  highlightCells: { r: number; c: number }[]; // cells to highlight
  highlightGroup?: 'row' | 'col' | 'block'; // group to highlight
  groupIndex?: number;
}

// Get all possible candidates (1-9) for a cell in the given grid
export function getCandidates(grid: SudokuGrid, row: number, col: number): number[] {
  if (grid[row][col] !== 0) return [];
  const candidates: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValid(grid, row, col, num)) {
      candidates.push(num);
    }
  }
  return candidates;
}

// Find a logical hint step
export function getLogicalHint(playerGrid: SudokuGrid, solvedGrid: SudokuGrid): HintStep | null {
  // Step 1: Look for Naked Singles (Sole Candidate)
  // An empty cell has exactly one candidate remaining
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (playerGrid[r][c] === 0) {
        const candidates = getCandidates(playerGrid, r, c);
        if (candidates.length === 1) {
          const val = candidates[0];
          // Find which numbers are already in the row, col, block that eliminate options
          const rowNums = new Set(playerGrid[r].filter(n => n > 0));
          const colNums = new Set(playerGrid.map(row => row[c]).filter(n => n > 0));
          
          const startRow = r - (r % 3);
          const startCol = c - (c % 3);
          const blockNums = new Set<number>();
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              const cellVal = playerGrid[startRow + i][startCol + j];
              if (cellVal > 0) blockNums.add(cellVal);
            }
          }

          const allUsed = Array.from(new Set([...rowNums, ...colNums, ...blockNums])).sort((a, b) => a - b);
          
          return {
            row: r,
            col: c,
            value: val,
            technique: 'Naked Single (Одиночка)',
            explanation: `В ячейке на строке ${r + 1}, колонке ${c + 1} может стоять только цифра **${val}**. Все остальные цифры (${allUsed.join(', ')}) уже заняты в этой строке, столбце или квадрате 3x3.`,
            highlightCells: [{ r, c }],
          };
        }
      }
    }
  }

  // Step 2: Look for Hidden Singles in Rows
  // A number can only go into one cell in a row
  for (let r = 0; r < 9; r++) {
    for (let num = 1; num <= 9; num++) {
      // Check if number already in row
      if (playerGrid[r].includes(num)) continue;

      const possibleCols: number[] = [];
      for (let c = 0; c < 9; c++) {
        if (playerGrid[r][c] === 0 && isValid(playerGrid, r, c, num)) {
          possibleCols.push(c);
        }
      }

      if (possibleCols.length === 1) {
        const c = possibleCols[0];
        return {
          row: r,
          col: c,
          value: num,
          technique: 'Hidden Single in Row (Скрытая одиночка в строке)',
          explanation: `В строке ${r + 1} цифра **${num}** может стоять только в столбце ${c + 1}. Во всех остальных пустых ячейках этой строки цифра ${num} исключена другими строками или квадратами.`,
          highlightCells: [{ r, c }],
          highlightGroup: 'row',
          groupIndex: r,
        };
      }
    }
  }

  // Step 3: Look for Hidden Singles in Columns
  for (let c = 0; c < 9; c++) {
    for (let num = 1; num <= 9; num++) {
      // Check if number already in col
      const colValues = playerGrid.map(row => row[c]);
      if (colValues.includes(num)) continue;

      const possibleRows: number[] = [];
      for (let r = 0; r < 9; r++) {
        if (playerGrid[r][c] === 0 && isValid(playerGrid, r, c, num)) {
          possibleRows.push(r);
        }
      }

      if (possibleRows.length === 1) {
        const r = possibleRows[0];
        return {
          row: r,
          col: c,
          value: num,
          technique: 'Hidden Single in Column (Скрытая одиночка в столбце)',
          explanation: `В столбце ${c + 1} цифра **${num}** может стоять только в строке ${r + 1}. Во всех остальных пустых ячейках этого столбца цифра ${num} исключена другими столбцами или квадратами.`,
          highlightCells: [{ r, c }],
          highlightGroup: 'col',
          groupIndex: c,
        };
      }
    }
  }

  // Step 4: Look for Hidden Singles in 3x3 Blocks
  for (let b = 0; b < 9; b++) {
    const startRow = Math.floor(b / 3) * 3;
    const startCol = (b % 3) * 3;

    // Check if number already in block
    const blockValues: number[] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        blockValues.push(playerGrid[startRow + i][startCol + j]);
      }
    }

    for (let num = 1; num <= 9; num++) {
      if (blockValues.includes(num)) continue;

      const possibleCells: { r: number; c: number }[] = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const r = startRow + i;
          const c = startCol + j;
          if (playerGrid[r][c] === 0 && isValid(playerGrid, r, c, num)) {
            possibleCells.push({ r, c });
          }
        }
      }

      if (possibleCells.length === 1) {
        const { r, c } = possibleCells[0];
        return {
          row: r,
          col: c,
          value: num,
          technique: 'Hidden Single in Block (Скрытая одиночка в блоке)',
          explanation: `В квадрате 3x3 №${b + 1} цифра **${num}** может стоять только в одной ячейке (строка ${r + 1}, колонка ${c + 1}). В остальных ячейках этого квадрата цифра ${num} исключена другими линиями.`,
          highlightCells: [{ r, c }],
          highlightGroup: 'block',
          groupIndex: b,
        };
      }
    }
  }

  // Step 5: Fallback Hint (Easiest solver cell)
  // If no simple single techniques work, find the first empty cell and supply its solution value
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (playerGrid[r][c] === 0) {
        const solvedVal = solvedGrid[r][c];
        return {
          row: r,
          col: c,
          value: solvedVal,
          technique: 'Базовая подсказка (Анализ сетки)',
          explanation: `Давайте обратим внимание на ячейку на строке ${r + 1}, колонке ${c + 1}. Согласно решению задачи, здесь должна стоять цифра **${solvedVal}**.`,
          highlightCells: [{ r, c }],
        };
      }
    }
  }

  return null;
}
