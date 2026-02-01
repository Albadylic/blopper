import { useCallback, useMemo } from 'react';
import type { RotationDirection } from '../types/game';
import { useGameState } from '../hooks/useGameState';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { Grid } from './Grid';
import { PieceStagingArea } from './PieceStagingArea';
import { ScoreDisplay } from './ScoreDisplay';
import { Controls } from './Controls';
import { GameOver } from './GameOver';
import { getGhostPosition } from '../utils/collision';

export function GameBoard() {
  const {
    state,
    movePiece,
    rotatePiece,
    dropPiece,
    rotateBoard,
    applyGravity,
    clearLines,
    restart,
  } = useGameState();

  // Calculate ghost position (where piece will land)
  const ghostPosition = useMemo(() => {
    if (!state.currentPiece) return null;
    return getGhostPosition(state.grid, state.currentPiece);
  }, [state.grid, state.currentPiece]);

  // Handle board rotation - rotate data, apply gravity, clear lines
  const handleBoardRotate = useCallback((direction: RotationDirection) => {
    rotateBoard(direction);
    applyGravity();
    clearLines();
  }, [rotateBoard, applyGravity, clearLines]);

  // Keyboard controls
  useKeyboardControls({
    movePiece,
    rotatePiece,
    dropPiece,
    restart,
    isGameOver: state.isGameOver,
    onBoardRotate: handleBoardRotate,
  });

  return (
    <div className="flex gap-6">
      {/* Main game area */}
      <div className="relative flex flex-col">
        {/* Staging area above the grid */}
        <PieceStagingArea currentPiece={state.currentPiece} />

        {/* Main game grid */}
        <Grid
          grid={state.grid}
          currentPiece={state.currentPiece}
          ghostPosition={ghostPosition}
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
        <ScoreDisplay score={state.score} linesCleared={state.linesCleared} />
        <Controls />
      </div>
    </div>
  );
}
