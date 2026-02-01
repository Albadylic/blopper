import type { Cell } from '../types/game';
import { cloneGrid, createEmptyCell } from './grid';
import { GRID_SIZE } from '../constants/tetrominos';

// Represents a group of cells that belong to the same piece
type PieceGroup = {
  pieceId: number;
  cells: Array<{ row: number; col: number; cell: Cell }>;
};

// Group cells by their piece ID
function groupCellsByPiece(grid: Cell[][]): PieceGroup[] {
  const groups: Map<number, PieceGroup> = new Map();

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = grid[row][col];
      if (cell.filled && cell.pieceId !== null) {
        if (!groups.has(cell.pieceId)) {
          groups.set(cell.pieceId, { pieceId: cell.pieceId, cells: [] });
        }
        groups.get(cell.pieceId)!.cells.push({ row, col, cell: { ...cell } });
      }
    }
  }

  return Array.from(groups.values());
}

// Calculate how far a piece can fall
function calculateDropDistance(
  grid: Cell[][],
  piece: PieceGroup
): number {
  let maxDrop = GRID_SIZE; // Maximum possible drop

  // For each cell in the piece, calculate how far it can drop
  for (const { row, col } of piece.cells) {
    let dropDistance = 0;

    // Look at cells below this one
    for (let r = row + 1; r < GRID_SIZE; r++) {
      const cellBelow = grid[r][col];

      // If the cell below is filled by a different piece, stop
      if (cellBelow.filled && cellBelow.pieceId !== piece.pieceId) {
        break;
      }

      // If the cell below is part of this piece, skip it
      if (cellBelow.pieceId === piece.pieceId) {
        continue;
      }

      dropDistance++;
    }

    // The piece can only drop as far as its most constrained cell
    maxDrop = Math.min(maxDrop, dropDistance);
  }

  return maxDrop;
}

// Apply gravity to make pieces fall as complete units
// Returns the new grid after gravity is applied
export function applyGravity(grid: Cell[][]): { grid: Cell[][]; didMove: boolean } {
  const newGrid = cloneGrid(grid);
  let didMove = false;

  // Get all pieces
  const pieces = groupCellsByPiece(newGrid);

  // Sort pieces by their lowest row (bottom-to-top processing)
  // This ensures we process lower pieces first so they don't block upper pieces
  pieces.sort((a, b) => {
    const aLowestRow = Math.max(...a.cells.map(c => c.row));
    const bLowestRow = Math.max(...b.cells.map(c => c.row));
    return bLowestRow - aLowestRow; // Descending order (bottom first)
  });

  // Process each piece
  for (const piece of pieces) {
    const dropDistance = calculateDropDistance(newGrid, piece);

    if (dropDistance > 0) {
      didMove = true;

      // Clear old positions (sort by row descending to avoid overwriting)
      const sortedCells = [...piece.cells].sort((a, b) => b.row - a.row);
      for (const { row, col } of sortedCells) {
        newGrid[row][col] = createEmptyCell();
      }

      // Set new positions
      for (const { row, col, cell } of sortedCells) {
        newGrid[row + dropDistance][col] = cell;
      }

      // Update the piece's cell positions for subsequent calculations
      for (const cellInfo of piece.cells) {
        cellInfo.row += dropDistance;
      }
    }
  }

  return { grid: newGrid, didMove };
}

// Apply gravity repeatedly until nothing moves (for full settling)
export function applyGravityFully(grid: Cell[][]): Cell[][] {
  let currentGrid = grid;
  let didMove = true;

  while (didMove) {
    const result = applyGravity(currentGrid);
    currentGrid = result.grid;
    didMove = result.didMove;
  }

  return currentGrid;
}
