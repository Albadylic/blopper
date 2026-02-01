import { useEffect, useCallback } from 'react';
import type { RotationDirection } from '../types/game';

type KeyboardActions = {
  movePiece: (direction: 'up' | 'down' | 'left' | 'right') => void;
  rotatePiece: () => void;
  restart: () => void;
  isAnimating: boolean;
  isGameOver: boolean;
  onBoardRotate: (direction: RotationDirection) => void;
  onPiecePlaced: () => void;
};

export function useKeyboardControls({
  movePiece,
  rotatePiece,
  restart,
  isAnimating,
  isGameOver,
  onBoardRotate,
  onPiecePlaced,
}: KeyboardActions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Prevent default for game keys
    const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyR', 'KeyQ', 'KeyE', 'Space'];
    if (gameKeys.includes(event.code)) {
      event.preventDefault();
    }

    // Handle restart separately - works even during game over
    if (event.code === 'KeyN' && isGameOver) {
      restart();
      return;
    }

    // Don't process other keys during animation or game over
    if (isAnimating || isGameOver) {
      return;
    }

    switch (event.code) {
      // Movement
      case 'ArrowUp':
        movePiece('up');
        break;
      case 'ArrowDown':
        movePiece('down');
        break;
      case 'ArrowLeft':
        movePiece('left');
        break;
      case 'ArrowRight':
        movePiece('right');
        break;

      // Piece rotation
      case 'KeyR':
        rotatePiece();
        break;

      // Board rotation
      case 'KeyQ':
        onBoardRotate('counterclockwise');
        break;
      case 'KeyE':
        onBoardRotate('clockwise');
        break;

      // Place piece
      case 'Space':
        onPiecePlaced();
        break;
    }
  }, [movePiece, rotatePiece, restart, isAnimating, isGameOver, onBoardRotate, onPiecePlaced]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
