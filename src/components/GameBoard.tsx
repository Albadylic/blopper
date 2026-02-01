import { useCallback } from 'react';
import type { RotationDirection } from '../types/game';
import { useGameState } from '../hooks/useGameState';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useAnimations } from '../hooks/useAnimations';
import { Grid } from './Grid';
import { PiecePreview } from './PiecePreview';
import { ScoreDisplay } from './ScoreDisplay';
import { Controls } from './Controls';
import { GameOver } from './GameOver';

export function GameBoard() {
  const {
    state,
    movePiece,
    rotatePiece,
    placeAndSpawn,
    rotateBoard,
    applyGravity,
    clearLines,
    startAnimation,
    endAnimation,
    restart,
  } = useGameState();

  const { runAnimationSequence } = useAnimations({ startAnimation, endAnimation });

  const isAnimating = state.animation.isRotating || state.animation.isFalling || state.animation.isClearing;

  // Handle board rotation with animation sequence
  const handleBoardRotate = useCallback((direction: RotationDirection) => {
    if (isAnimating) return;

    runAnimationSequence([
      {
        type: 'rotating',
        beforeStart: () => rotateBoard(direction),
      },
      {
        type: 'falling',
        beforeStart: () => applyGravity(),
        afterComplete: () => clearLines(),
      },
    ]);
  }, [isAnimating, rotateBoard, applyGravity, clearLines, runAnimationSequence]);

  // Handle piece placement - simple and atomic
  const handlePiecePlaced = useCallback(() => {
    if (isAnimating || !state.currentPiece) return;
    placeAndSpawn();
  }, [isAnimating, state.currentPiece, placeAndSpawn]);

  // Keyboard controls
  useKeyboardControls({
    movePiece,
    rotatePiece,
    restart,
    isAnimating,
    isGameOver: state.isGameOver,
    onBoardRotate: handleBoardRotate,
    onPiecePlaced: handlePiecePlaced,
  });

  return (
    <div className="flex gap-6">
      {/* Main game grid */}
      <div className="relative">
        <Grid
          grid={state.grid}
          currentPiece={state.currentPiece}
          rotationAngle={state.animation.rotationAngle}
          isRotating={state.animation.isRotating}
        />

        {/* Game over overlay */}
        {state.isGameOver && (
          <GameOver
            score={state.score}
            linesCleared={state.linesCleared}
            onRestart={restart}
          />
        )}
      </div>

      {/* Side panel */}
      <div className="flex flex-col gap-4 w-48">
        <PiecePreview currentPiece={state.currentPiece} />
        <ScoreDisplay score={state.score} linesCleared={state.linesCleared} />
        <Controls />
      </div>
    </div>
  );
}
