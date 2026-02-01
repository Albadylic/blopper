import type { Cell as CellType, CurrentPiece, Position } from '../types/game';
import { Cell } from './Cell';
import { GRID_SIZE } from '../constants/tetrominos';

type GridProps = {
  grid: CellType[][];
  currentPiece: CurrentPiece | null;
  ghostPosition: Position | null;
};

export function Grid({ grid, currentPiece, ghostPosition }: GridProps) {
  // Build a map of which cells show the ghost piece (drop preview)
  const ghostCells = new Set<string>();

  if (currentPiece && ghostPosition) {
    const shape = currentPiece.tetromino.shapes[currentPiece.rotation];

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const gridRow = ghostPosition.row + row;
          const gridCol = ghostPosition.col + col;

          if (gridRow >= 0 && gridRow < GRID_SIZE && gridCol >= 0 && gridCol < GRID_SIZE) {
            const key = `${gridRow},${gridCol}`;
            ghostCells.add(key);
          }
        }
      }
    }
  }

  return (
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
          const isGhostCell = ghostCells.has(key);

          return (
            <Cell
              key={key}
              cell={cell}
              isCurrentPiece={isGhostCell}
              isValidPlacement={true}
              currentPieceColor={isGhostCell ? currentPiece?.tetromino.color : undefined}
              isGhost={isGhostCell}
            />
          );
        })
      )}
    </div>
  );
}
