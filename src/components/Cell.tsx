import type { Cell as CellType } from '../types/game';

type CellProps = {
  cell: CellType;
  isCurrentPiece?: boolean;
  isValidPlacement?: boolean;
  currentPieceColor?: string;
};

export function Cell({ cell, isCurrentPiece, isValidPlacement, currentPieceColor }: CellProps) {
  let backgroundColor = 'transparent';
  let borderColor = 'rgba(255, 255, 255, 0.1)';
  let boxShadow = 'none';

  if (isCurrentPiece && currentPieceColor) {
    backgroundColor = currentPieceColor;
    borderColor = 'rgba(255, 255, 255, 0.3)';
    // Add glow effect for valid placement
    if (isValidPlacement) {
      boxShadow = `0 0 8px ${currentPieceColor}`;
    } else {
      // Show red tint for invalid placement
      backgroundColor = '#ff4444';
    }
  } else if (cell.filled && cell.color) {
    backgroundColor = cell.color;
    borderColor = 'rgba(255, 255, 255, 0.3)';
  }

  return (
    <div
      className="aspect-square border transition-all duration-150"
      style={{
        backgroundColor,
        borderColor,
        boxShadow,
      }}
    />
  );
}
