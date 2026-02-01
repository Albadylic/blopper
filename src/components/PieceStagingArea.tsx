import type { CurrentPiece } from '../types/game';

type PieceStagingAreaProps = {
  currentPiece: CurrentPiece | null;
};

// Fixed height to accommodate tallest piece (I-piece vertical = 4 rows)
const MAX_PIECE_HEIGHT = 4;
const CELL_SIZE = 38; // Slightly less than 40 to account for gaps
const GAP = 2;
const STAGING_HEIGHT = MAX_PIECE_HEIGHT * (CELL_SIZE + GAP) + 8;

export function PieceStagingArea({ currentPiece }: PieceStagingAreaProps) {
  // Always render the container to maintain fixed height
  return (
    <div
      className="relative"
      style={{
        width: '400px',
        height: `${STAGING_HEIGHT}px`,
      }}
    >
      {currentPiece && (
        <PieceRenderer currentPiece={currentPiece} />
      )}
    </div>
  );
}

function PieceRenderer({ currentPiece }: { currentPiece: CurrentPiece }) {
  const shape = currentPiece.tetromino.shapes[currentPiece.rotation];
  const shapeHeight = shape.length;
  const shapeWidth = shape[0].length;

  // Position piece at bottom of staging area
  const topOffset = (MAX_PIECE_HEIGHT - shapeHeight) * (CELL_SIZE + GAP);

  return (
    <div
      className="absolute"
      style={{
        left: `${currentPiece.stagingColumn * (CELL_SIZE + GAP) + 4}px`,
        top: `${topOffset + 4}px`,
      }}
    >
      <div
        className="grid gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${shapeWidth}, 1fr)`,
          gridTemplateRows: `repeat(${shapeHeight}, 1fr)`,
        }}
      >
        {shape.map((row, rowIndex) =>
          row.map((filled, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="aspect-square border transition-all duration-150"
              style={{
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`,
                backgroundColor: filled ? currentPiece.tetromino.color : 'transparent',
                borderColor: filled ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                boxShadow: filled ? `0 0 8px ${currentPiece.tetromino.color}` : 'none',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
