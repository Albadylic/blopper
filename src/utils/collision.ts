import type { Cell, CurrentPiece, TetrominoShape, Position, Tetromino } from '../types/game';
import { isInBounds } from './grid';
import { GRID_SIZE } from '../constants/tetrominos';

// Check if a piece at a given position collides with filled cells or goes out of bounds
export function checkCollision(
  grid: Cell[][],
  shape: TetrominoShape,
  position: Position
): boolean {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const gridRow = position.row + row;
        const gridCol = position.col + col;

        // Check bounds
        if (!isInBounds(gridRow, gridCol)) {
          return true; // Collision with boundary
        }

        // Check if cell is already filled
        if (grid[gridRow][gridCol].filled) {
          return true; // Collision with existing piece
        }
      }
    }
  }
  return false; // No collision
}

// Check if a piece can be dropped at its staging column
export function canDropPiece(
  grid: Cell[][],
  piece: CurrentPiece
): boolean {
  const shape = piece.tetromino.shapes[piece.rotation];
  return calculateDropRow(grid, shape, piece.stagingColumn) !== null;
}

// Check if there's any valid position for a piece on the grid
export function hasValidPlacement(
  grid: Cell[][],
  tetromino: Tetromino
): boolean {
  // Try all 4 rotations
  for (let rotation = 0; rotation < 4; rotation++) {
    const shape = tetromino.shapes[rotation];
    const shapeHeight = shape.length;
    const shapeWidth = shape[0].length;

    // Try all positions
    for (let row = 0; row <= GRID_SIZE - shapeHeight; row++) {
      for (let col = 0; col <= GRID_SIZE - shapeWidth; col++) {
        if (!checkCollision(grid, shape, { row, col })) {
          return true; // Found a valid position
        }
      }
    }
  }
  return false; // No valid position found
}

// Calculate the row where a piece will land when dropped from a column
// Returns the row position, or null if the column is blocked
export function calculateDropRow(
  grid: Cell[][],
  shape: TetrominoShape,
  column: number
): number | null {
  const shapeHeight = shape.length;
  const shapeWidth = shape[0].length;

  // Check if piece fits within column bounds
  if (column < 0 || column + shapeWidth > GRID_SIZE) {
    return null;
  }

  // Start from the top and find the first row where collision occurs
  // Then place piece one row above that
  for (let row = 0; row <= GRID_SIZE - shapeHeight; row++) {
    if (checkCollision(grid, shape, { row, col: column })) {
      // Collision at this row, so piece lands at row - 1
      if (row === 0) {
        return null; // Can't place piece, column is full
      }
      return row - 1;
    }
  }

  // No collision found, piece lands at bottom
  return GRID_SIZE - shapeHeight;
}

// Get the ghost piece position (where piece will land when dropped)
export function getGhostPosition(
  grid: Cell[][],
  piece: CurrentPiece
): Position | null {
  const shape = piece.tetromino.shapes[piece.rotation];
  const dropRow = calculateDropRow(grid, shape, piece.stagingColumn);

  if (dropRow === null) {
    return null;
  }

  return { row: dropRow, col: piece.stagingColumn };
}

// Find the starting staging column for a piece (centered)
export function getStartingStagingColumn(
  tetromino: Tetromino,
  rotation: number = 0
): number {
  const shape = tetromino.shapes[rotation];
  const shapeWidth = shape[0].length;
  return Math.floor((GRID_SIZE - shapeWidth) / 2);
}

// Check if any column allows dropping the piece
export function canDropAnywhere(
  grid: Cell[][],
  tetromino: Tetromino,
  rotation: number = 0
): boolean {
  const shape = tetromino.shapes[rotation];
  const shapeWidth = shape[0].length;

  for (let col = 0; col <= GRID_SIZE - shapeWidth; col++) {
    if (calculateDropRow(grid, shape, col) !== null) {
      return true;
    }
  }
  return false;
}
