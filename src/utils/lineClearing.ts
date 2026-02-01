import type { Cell } from '../types/game';
import { cloneGrid, createEmptyCell } from './grid';
import { GRID_SIZE, SCORE_MAP } from '../constants/tetrominos';

// Result of line clearing operation
export type LineClearResult = {
  grid: Cell[][];
  linesCleared: number;
  score: number;
  clearedRows: number[];
  clearedCols: number[];
};

// Check which rows are complete
export function findCompleteRows(grid: Cell[][]): number[] {
  const completeRows: number[] = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    let isComplete = true;
    for (let col = 0; col < GRID_SIZE; col++) {
      if (!grid[row][col].filled) {
        isComplete = false;
        break;
      }
    }
    if (isComplete) {
      completeRows.push(row);
    }
  }

  return completeRows;
}

// Check which columns are complete
export function findCompleteCols(grid: Cell[][]): number[] {
  const completeCols: number[] = [];

  for (let col = 0; col < GRID_SIZE; col++) {
    let isComplete = true;
    for (let row = 0; row < GRID_SIZE; row++) {
      if (!grid[row][col].filled) {
        isComplete = false;
        break;
      }
    }
    if (isComplete) {
      completeCols.push(col);
    }
  }

  return completeCols;
}

// Clear the specified rows and columns
export function clearLines(grid: Cell[][]): LineClearResult {
  const newGrid = cloneGrid(grid);

  const clearedRows = findCompleteRows(newGrid);
  const clearedCols = findCompleteCols(newGrid);

  // Track which cells to clear (union of rows and columns)
  const cellsToClear: Set<string> = new Set();

  // Add all cells from complete rows
  for (const row of clearedRows) {
    for (let col = 0; col < GRID_SIZE; col++) {
      cellsToClear.add(`${row},${col}`);
    }
  }

  // Add all cells from complete columns
  for (const col of clearedCols) {
    for (let row = 0; row < GRID_SIZE; row++) {
      cellsToClear.add(`${row},${col}`);
    }
  }

  // Clear the cells
  for (const key of cellsToClear) {
    const [row, col] = key.split(',').map(Number);
    newGrid[row][col] = createEmptyCell();
  }

  // Calculate total lines cleared (rows + columns, but cells at intersections only count once)
  const linesCleared = clearedRows.length + clearedCols.length;

  // Calculate score based on lines cleared
  const score = linesCleared > 0 ? (SCORE_MAP[linesCleared] || linesCleared * 25) : 0;

  return {
    grid: newGrid,
    linesCleared,
    score,
    clearedRows,
    clearedCols,
  };
}

// Check if any lines would be cleared
export function hasLinesToClear(grid: Cell[][]): boolean {
  return findCompleteRows(grid).length > 0 || findCompleteCols(grid).length > 0;
}
