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

// Check if a piece can be placed at the given position
export function canPlacePiece(
  grid: Cell[][],
  piece: CurrentPiece
): boolean {
  const shape = piece.tetromino.shapes[piece.rotation];
  return !checkCollision(grid, shape, piece.position);
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

// Get the ghost piece position (furthest down the piece can go while still being valid)
// In this game, ghost shows where piece would be placed (no automatic drop)
export function getGhostPosition(
  grid: Cell[][],
  piece: CurrentPiece
): Position | null {
  // In Rotatetris, the ghost is just the current position if valid
  if (canPlacePiece(grid, piece)) {
    return piece.position;
  }
  return null;
}

// Find the first valid position for a piece (used when spawning)
export function findValidPosition(
  grid: Cell[][],
  tetromino: Tetromino,
  rotation: number = 0
): Position | null {
  const shape = tetromino.shapes[rotation];
  const shapeHeight = shape.length;
  const shapeWidth = shape[0].length;

  // Start from center-top and work outward
  const startCol = Math.floor((GRID_SIZE - shapeWidth) / 2);

  // Try center first, then spiral outward
  for (let row = 0; row <= GRID_SIZE - shapeHeight; row++) {
    for (let colOffset = 0; colOffset < GRID_SIZE; colOffset++) {
      // Alternate left and right from center
      const cols = colOffset === 0
        ? [startCol]
        : [startCol - colOffset, startCol + colOffset];

      for (const col of cols) {
        if (col >= 0 && col <= GRID_SIZE - shapeWidth) {
          if (!checkCollision(grid, shape, { row, col })) {
            return { row, col };
          }
        }
      }
    }
  }
  return null; // No valid position
}
