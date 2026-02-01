import type { Cell as CellType } from '../types/game';

type CellProps = {
  cell: CellType;
  isCurrentPiece?: boolean;
  isValidPlacement?: boolean;
  currentPieceColor?: string;
  isGhost?: boolean;
};

export function Cell({ cell, isCurrentPiece, isValidPlacement, currentPieceColor, isGhost }: CellProps) {
  let backgroundColor = 'transparent';
  let borderColor = 'rgba(255, 255, 255, 0.1)';
  let boxShadow = 'none';
  let opacity = 1;

  if (isCurrentPiece && currentPieceColor) {
    backgroundColor = currentPieceColor;
    borderColor = 'rgba(255, 255, 255, 0.3)';
    // Ghost pieces are semi-transparent
    if (isGhost) {
      opacity = 0.4;
      boxShadow = `0 0 4px ${currentPieceColor}`;
    } else if (isValidPlacement) {
      boxShadow = `0 0 8px ${currentPieceColor}`;
    } else {
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
        opacity,
      }}
    />
  );
}
