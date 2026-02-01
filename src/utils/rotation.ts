import type { Cell, RotationDirection } from '../types/game';
import { createEmptyCell } from './grid';
import { GRID_SIZE } from '../constants/tetrominos';

// Rotate the grid 90 degrees
// Clockwise:     (row, col) → (col, GRID_SIZE - 1 - row)
// Counter-clock: (row, col) → (GRID_SIZE - 1 - col, row)
export function rotateGrid(
  grid: Cell[][],
  direction: RotationDirection
): Cell[][] {
  const newGrid: Cell[][] = [];

  // Initialize new grid
  for (let row = 0; row < GRID_SIZE; row++) {
    newGrid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      newGrid[row][col] = createEmptyCell();
    }
  }

  // Transform each cell
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      let newRow: number;
      let newCol: number;

      if (direction === 'clockwise') {
        // (row, col) → (col, GRID_SIZE - 1 - row)
        newRow = col;
        newCol = GRID_SIZE - 1 - row;
      } else {
        // (row, col) → (GRID_SIZE - 1 - col, row)
        newRow = GRID_SIZE - 1 - col;
        newCol = row;
      }

      newGrid[newRow][newCol] = { ...grid[row][col] };
    }
  }

  return newGrid;
}

// Calculate the visual rotation angle after a board rotation
export function calculateRotationAngle(
  currentAngle: number,
  direction: RotationDirection
): number {
  if (direction === 'clockwise') {
    return (currentAngle + 90) % 360;
  } else {
    return (currentAngle - 90 + 360) % 360;
  }
}
