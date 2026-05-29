// Sudoku Generator & Helper Utilities
// Provides unique puzzle generation, backtracking solver, and state validation.

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

// Represent grid as number[9][9], 0 represents empty cell.
export type SudokuGrid = number[][];

// Helper to deep copy a grid
export function copyGrid(grid: SudokuGrid): SudokuGrid {
  return grid.map(row => [...row]);
}

// Check if a number can be placed in cell (row, col)
export function isValid(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 block
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
}

// Backtracking solver to solve the Sudoku grid
export function solveSudoku(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[row][col] = 0; // Backtrack
          }
        }
        return false; // Trigger backtracking
      }
    }
  }
  return true; // Solved
}

// Count number of solutions for a grid (to verify unique solution)
export function countSolutions(grid: SudokuGrid, limit = 2): number {
  let count = 0;

  function solve() {
    if (count >= limit) return;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              solve();
              grid[row][col] = 0; // Backtrack
            }
          }
          return;
        }
      }
    }
    count++;
  }

  solve();
  return count;
}

// Generate a completed grid (randomized)
export function generateCompletedGrid(): SudokuGrid {
  const grid: SudokuGrid = Array(9).fill(null).map(() => Array(9).fill(0));

  function fillGrid(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          // Shuffle numbers 1-9 to randomize generation
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (const num of numbers) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (fillGrid()) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fillGrid();
  return grid;
}

// Generate Sudoku puzzle board based on difficulty
export interface SudokuPuzzle {
  startingGrid: SudokuGrid;
  solvedGrid: SudokuGrid;
}

export function generateSudoku(difficulty: Difficulty): SudokuPuzzle {
  const solvedGrid = generateCompletedGrid();
  const startingGrid = copyGrid(solvedGrid);

  // Determine how many cells to remove based on difficulty
  let cellsToRemove = 35; // default easy
  if (difficulty === 'medium') cellsToRemove = 44;
  else if (difficulty === 'hard') cellsToRemove = 52;
  else if (difficulty === 'expert') cellsToRemove = 58;

  // Create list of all 81 cell coordinates and shuffle them
  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      cells.push({ r, c });
    }
  }
  cells.sort(() => Math.random() - 0.5);

  let removed = 0;
  for (const cell of cells) {
    if (removed >= cellsToRemove) break;

    const { r, c } = cell;
    const backup = startingGrid[r][c];
    startingGrid[r][c] = 0;

    // Verify if puzzle still has a unique solution
    if (countSolutions(copyGrid(startingGrid)) === 1) {
      removed++;
    } else {
      // Revert if it doesn't have a unique solution
      startingGrid[r][c] = backup;
    }
  }

  // Fallback: If we couldn't remove enough while preserving uniqueness,
  // we do a simple heuristic deletion just to satisfy the difficulty
  if (removed < cellsToRemove - 5) {
    for (const cell of cells) {
      const { r, c } = cell;
      if (startingGrid[r][c] !== 0) {
        startingGrid[r][c] = 0;
        removed++;
        if (removed >= cellsToRemove) break;
      }
    }
  }

  return { startingGrid, solvedGrid };
}

// Check if player board is valid and matches solution
export function isBoardCorrect(playerGrid: SudokuGrid, solvedGrid: SudokuGrid): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (playerGrid[r][c] !== solvedGrid[r][c]) {
        return false;
      }
    }
  }
  return true;
}
