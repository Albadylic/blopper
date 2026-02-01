import type { CurrentPiece } from '../types/game';

type PiecePreviewProps = {
  currentPiece: CurrentPiece | null;
};

export function PiecePreview({ currentPiece }: PiecePreviewProps) {
  if (!currentPiece) {
    return (
      <div className="bg-gray-800 p-4 rounded">
        <h3 className="text-sm text-gray-400 mb-2">Current Piece</h3>
        <div className="w-20 h-20 bg-gray-900 rounded flex items-center justify-center">
          <span className="text-gray-600">-</span>
        </div>
      </div>
    );
  }

  const shape = currentPiece.tetromino.shapes[currentPiece.rotation];
  const color = currentPiece.tetromino.color;

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="text-sm text-gray-400 mb-2">Current Piece</h3>
      <div className="bg-gray-900 p-2 rounded">
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${shape[0].length}, 16px)`,
            gridTemplateRows: `repeat(${shape.length}, 16px)`,
          }}
        >
          {shape.map((row, rowIndex) =>
            row.map((filled, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="rounded-sm"
                style={{
                  backgroundColor: filled ? color : 'transparent',
                  border: filled ? '1px solid rgba(255,255,255,0.3)' : 'none',
                }}
              />
            ))
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {currentPiece.tetromino.name}-piece
      </p>
    </div>
  );
}
