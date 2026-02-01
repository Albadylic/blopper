import { useReducer, useCallback } from 'react';
import type { GameState, GameAction, RotationDirection } from '../types/game';
import { createEmptyGrid, cloneGrid } from '../utils/grid';
import { getRandomTetromino, GRID_SIZE } from '../constants/tetrominos';
import { calculateDropRow, getStartingStagingColumn, canDropAnywhere } from '../utils/collision';
import { rotateGrid } from '../utils/rotation';
import { applyGravityFully } from '../utils/gravity';
import { clearLines, hasLinesToClear } from '../utils/lineClearing';

// Initial game state
function createInitialState(): GameState {
  const tetromino = getRandomTetromino();
  const grid = createEmptyGrid();
  const stagingColumn = getStartingStagingColumn(tetromino, 0);

  return {
    grid,
    currentPiece: {
      tetromino,
      rotation: 0,
      stagingColumn,
    },
    nextPieceId: 1,
    score: 0,
    linesCleared: 0,
    isGameOver: false,
    animation: {
      isRotating: false,
      isFalling: false,
      isClearing: false,
      rotationAngle: 0,
    },
  };
}

// Check if game is over (no valid drop position for current piece in any rotation)
function checkGameOver(grid: Cell[][], tetromino: typeof TETROMINOS[0]): boolean {
  // Check all 4 rotations of the piece to see if any can be dropped
  for (let rotation = 0; rotation < 4; rotation++) {
    if (canDropAnywhere(grid, tetromino, rotation)) {
      return false;
    }
  }

  // Try clockwise board rotation
  const clockwiseGrid = applyGravityFully(rotateGrid(grid, 'clockwise'));
  for (let rotation = 0; rotation < 4; rotation++) {
    if (canDropAnywhere(clockwiseGrid, tetromino, rotation)) {
      return false;
    }
  }

  // Try counter-clockwise board rotation
  const counterClockwiseGrid = applyGravityFully(rotateGrid(grid, 'counterclockwise'));
  for (let rotation = 0; rotation < 4; rotation++) {
    if (canDropAnywhere(counterClockwiseGrid, tetromino, rotation)) {
      return false;
    }
  }

  return true; // No valid placements anywhere
}

// Import Cell type for checkGameOver
import type { Cell } from '../types/game';
import { TETROMINOS } from '../constants/tetrominos';

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MOVE_PIECE': {
      if (!state.currentPiece) {
        return state;
      }

      const { direction } = action;
      const shape = state.currentPiece.tetromino.shapes[state.currentPiece.rotation];
      const shapeWidth = shape[0].length;
      let newColumn = state.currentPiece.stagingColumn;

      if (direction === 'left') {
        newColumn -= 1;
      } else if (direction === 'right') {
        newColumn += 1;
      }

      // Check if new column is within bounds
      if (newColumn < 0 || newColumn + shapeWidth > GRID_SIZE) {
        return state; // Out of bounds
      }

      return {
        ...state,
        currentPiece: {
          ...state.currentPiece,
          stagingColumn: newColumn,
        },
      };
    }

    case 'ROTATE_PIECE': {
      if (!state.currentPiece) {
        return state;
      }

      const newRotation = (state.currentPiece.rotation + 1) % 4;
      const newShape = state.currentPiece.tetromino.shapes[newRotation];
      const newShapeWidth = newShape[0].length;

      // Adjust staging column if rotation would push piece out of bounds
      let newColumn = state.currentPiece.stagingColumn;
      if (newColumn + newShapeWidth > GRID_SIZE) {
        newColumn = GRID_SIZE - newShapeWidth;
      }

      return {
        ...state,
        currentPiece: {
          ...state.currentPiece,
          rotation: newRotation,
          stagingColumn: newColumn,
        },
      };
    }

    case 'DROP_PIECE': {
      if (!state.currentPiece) {
        return state;
      }

      const shape = state.currentPiece.tetromino.shapes[state.currentPiece.rotation];
      const { stagingColumn, tetromino } = state.currentPiece;

      // Calculate where piece will land
      const dropRow = calculateDropRow(state.grid, shape, stagingColumn);

      if (dropRow === null) {
        return state; // Can't drop here
      }

      // Place the piece on the grid
      let newGrid = cloneGrid(state.grid);

      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const gridRow = dropRow + row;
            const gridCol = stagingColumn + col;
            newGrid[gridRow][gridCol] = {
              filled: true,
              color: tetromino.color,
              pieceId: state.nextPieceId,
            };
          }
        }
      }

      // Clear lines if any
      let addedScore = 0;
      let addedLines = 0;
      if (hasLinesToClear(newGrid)) {
        const result = clearLines(newGrid);
        newGrid = applyGravityFully(result.grid);
        addedScore = result.score;
        addedLines = result.linesCleared;
      }

      // Spawn new piece
      const newTetromino = getRandomTetromino();
      const newStagingColumn = getStartingStagingColumn(newTetromino, 0);

      // Check for game over
      const isOver = checkGameOver(newGrid, newTetromino);
      if (isOver) {
        return {
          ...state,
          grid: newGrid,
          currentPiece: null,
          nextPieceId: state.nextPieceId + 1,
          score: state.score + addedScore,
          linesCleared: state.linesCleared + addedLines,
          isGameOver: true,
        };
      }

      return {
        ...state,
        grid: newGrid,
        currentPiece: {
          tetromino: newTetromino,
          rotation: 0,
          stagingColumn: newStagingColumn,
        },
        nextPieceId: state.nextPieceId + 1,
        score: state.score + addedScore,
        linesCleared: state.linesCleared + addedLines,
      };
    }

    case 'ROTATE_BOARD': {
      const { direction } = action;
      const rotatedGrid = rotateGrid(state.grid, direction);

      return {
        ...state,
        grid: rotatedGrid,
      };
    }

    case 'APPLY_GRAVITY': {
      const newGrid = applyGravityFully(state.grid);
      return {
        ...state,
        grid: newGrid,
      };
    }

    case 'CLEAR_LINES': {
      const result = clearLines(state.grid);

      if (result.linesCleared === 0) {
        return state;
      }

      // Apply gravity after clearing
      const gridAfterGravity = applyGravityFully(result.grid);

      return {
        ...state,
        grid: gridAfterGravity,
        score: state.score + result.score,
        linesCleared: state.linesCleared + result.linesCleared,
      };
    }

    case 'SPAWN_PIECE': {
      const tetromino = getRandomTetromino();
      const stagingColumn = getStartingStagingColumn(tetromino, 0);

      // Check for game over
      const isOver = checkGameOver(state.grid, tetromino);
      if (isOver) {
        return {
          ...state,
          currentPiece: null,
          isGameOver: true,
        };
      }

      return {
        ...state,
        currentPiece: {
          tetromino,
          rotation: 0,
          stagingColumn,
        },
      };
    }

    case 'SET_GAME_OVER': {
      return {
        ...state,
        isGameOver: true,
      };
    }

    case 'RESTART': {
      return createInitialState();
    }

    default:
      return state;
  }
}

// Custom hook for game state
export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  // Movement actions
  const movePiece = useCallback((direction: 'left' | 'right') => {
    dispatch({ type: 'MOVE_PIECE', direction });
  }, []);

  const rotatePiece = useCallback(() => {
    dispatch({ type: 'ROTATE_PIECE' });
  }, []);

  const dropPiece = useCallback(() => {
    dispatch({ type: 'DROP_PIECE' });
  }, []);

  // Board actions
  const rotateBoard = useCallback((direction: RotationDirection) => {
    dispatch({ type: 'ROTATE_BOARD', direction });
  }, []);

  const applyGravity = useCallback(() => {
    dispatch({ type: 'APPLY_GRAVITY' });
  }, []);

  const clearLinesAction = useCallback(() => {
    dispatch({ type: 'CLEAR_LINES' });
  }, []);

  const spawnPiece = useCallback(() => {
    dispatch({ type: 'SPAWN_PIECE' });
  }, []);

  // Game control
  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  return {
    state,
    movePiece,
    rotatePiece,
    dropPiece,
    rotateBoard,
    applyGravity,
    clearLines: clearLinesAction,
    spawnPiece,
    restart,
  };
}
