import type { Cell as CellType, CurrentPiece } from '../types/game';
import { Cell } from './Cell';
import { GRID_SIZE } from '../constants/tetrominos';
import { canPlacePiece } from '../utils/collision';

type GridProps = {
  grid: CellType[][];
  currentPiece: CurrentPiece | null;
  rotationAngle: number;
  isRotating: boolean;
};

export function Grid({ grid, currentPiece, rotationAngle, isRotating }: GridProps) {
  // Build a map of which cells are occupied by the current piece
  const currentPieceCells = new Set<string>();
  let isValidPlacement = false;

  if (currentPiece) {
    const shape = currentPiece.tetromino.shapes[currentPiece.rotation];
    isValidPlacement = canPlacePiece(grid, currentPiece);

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const gridRow = currentPiece.position.row + row;
          const gridCol = currentPiece.position.col + col;

          if (gridRow >= 0 && gridRow < GRID_SIZE && gridCol >= 0 && gridCol < GRID_SIZE) {
            const key = `${gridRow},${gridCol}`;
            currentPieceCells.add(key);
          }
        }
      }
    }
  }

  return (
    <div
      className="relative transition-transform"
      style={{
        transform: `rotate(${rotationAngle}deg)`,
        transitionDuration: isRotating ? '300ms' : '0ms',
        transitionTimingFunction: 'ease-out',
      }}
    >
      <div
        className="grid gap-0.5 bg-gray-900 p-1 rounded"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          width: '400px',
          height: '400px',
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const key = `${rowIndex},${colIndex}`;
            const isCurrentPieceCell = currentPieceCells.has(key);

            return (
              <Cell
                key={key}
                cell={cell}
                isCurrentPiece={isCurrentPieceCell}
                isValidPlacement={isValidPlacement}
                currentPieceColor={isCurrentPieceCell ? currentPiece?.tetromino.color : undefined}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
