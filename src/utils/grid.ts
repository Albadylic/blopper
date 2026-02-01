import type { Cell } from '../types/game';
import { GRID_SIZE } from '../constants/tetrominos';

// Create an empty cell
export function createEmptyCell(): Cell {
  return {
    filled: false,
    color: null,
    pieceId: null,
  };
}

// Create an empty grid
export function createEmptyGrid(): Cell[][] {
  const grid: Cell[][] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = createEmptyCell();
    }
  }
  return grid;
}

// Deep clone a grid
export function cloneGrid(grid: Cell[][]): Cell[][] {
  return grid.map(row => row.map(cell => ({ ...cell })));
}

// Check if a position is within grid bounds
export function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;
}
