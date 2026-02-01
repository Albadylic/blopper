import { useEffect, useCallback } from 'react';
import type { RotationDirection } from '../types/game';

type KeyboardActions = {
  movePiece: (direction: 'left' | 'right') => void;
  rotatePiece: () => void;
  dropPiece: () => void;
  restart: () => void;
  isGameOver: boolean;
  onBoardRotate: (direction: RotationDirection) => void;
};

export function useKeyboardControls({
  movePiece,
  rotatePiece,
  dropPiece,
  restart,
  isGameOver,
  onBoardRotate,
}: KeyboardActions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Prevent default for game keys
    const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyQ', 'KeyE', 'Space'];
    if (gameKeys.includes(event.code)) {
      event.preventDefault();
    }

    // Handle restart separately - works even during game over
    if (event.code === 'KeyN' && isGameOver) {
      restart();
      return;
    }

    // Don't process other keys during game over
    if (isGameOver) {
      return;
    }

    switch (event.code) {
      // Horizontal movement only
      case 'ArrowLeft':
        movePiece('left');
        break;
      case 'ArrowRight':
        movePiece('right');
        break;

      // Piece rotation (ArrowUp)
      case 'ArrowUp':
        rotatePiece();
        break;

      // Drop piece (ArrowDown or Space)
      case 'ArrowDown':
      case 'Space':
        dropPiece();
        break;

      // Board rotation
      case 'KeyQ':
        onBoardRotate('counterclockwise');
        break;
      case 'KeyE':
        onBoardRotate('clockwise');
        break;
    }
  }, [movePiece, rotatePiece, dropPiece, restart, isGameOver, onBoardRotate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
