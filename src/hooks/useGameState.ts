import { useReducer, useCallback } from 'react';
import type { GameState, GameAction, CurrentPiece, RotationDirection } from '../types/game';
import { createEmptyGrid, cloneGrid } from '../utils/grid';
import { getRandomTetromino } from '../constants/tetrominos';
import { canPlacePiece, findValidPosition, hasValidPlacement, checkCollision } from '../utils/collision';
import { rotateGrid, calculateRotationAngle } from '../utils/rotation';
import { applyGravityFully } from '../utils/gravity';
import { clearLines, hasLinesToClear } from '../utils/lineClearing';

// Initial game state
function createInitialState(): GameState {
  const tetromino = getRandomTetromino();
  const grid = createEmptyGrid();
  const position = findValidPosition(grid, tetromino, 0);

  return {
    grid,
    currentPiece: position ? {
      tetromino,
      rotation: 0,
      position,
    } : null,
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

// Check if game is over (no valid placement for current piece)
function checkGameOver(grid: Cell[][], tetromino: typeof TETROMINOS[0]): boolean {
  // First check if there's any valid placement on current grid
  if (hasValidPlacement(grid, tetromino)) {
    return false;
  }

  // Try clockwise rotation
  const clockwiseGrid = applyGravityFully(rotateGrid(grid, 'clockwise'));
  if (hasValidPlacement(clockwiseGrid, tetromino)) {
    return false;
  }

  // Try counter-clockwise rotation
  const counterClockwiseGrid = applyGravityFully(rotateGrid(grid, 'counterclockwise'));
  if (hasValidPlacement(counterClockwiseGrid, tetromino)) {
    return false;
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
      if (!state.currentPiece || state.animation.isRotating || state.animation.isFalling) {
        return state;
      }

      const { direction } = action;
      const newPosition = { ...state.currentPiece.position };

      switch (direction) {
        case 'up':
          newPosition.row -= 1;
          break;
        case 'down':
          newPosition.row += 1;
          break;
        case 'left':
          newPosition.col -= 1;
          break;
        case 'right':
          newPosition.col += 1;
          break;
      }

      // Check if new position is valid
      const newPiece: CurrentPiece = {
        ...state.currentPiece,
        position: newPosition,
      };

      if (canPlacePiece(state.grid, newPiece)) {
        return {
          ...state,
          currentPiece: newPiece,
        };
      }

      return state; // Invalid move, no change
    }

    case 'ROTATE_PIECE': {
      if (!state.currentPiece || state.animation.isRotating || state.animation.isFalling) {
        return state;
      }

      const newRotation = (state.currentPiece.rotation + 1) % 4;
      const newShape = state.currentPiece.tetromino.shapes[newRotation];

      // Try to place the rotated piece at the current position
      let newPosition = state.currentPiece.position;

      // Check if it fits at current position
      if (checkCollision(state.grid, newShape, newPosition)) {
        // Try to find a nearby valid position (wall kick)
        const offsets = [
          { row: 0, col: 1 },
          { row: 0, col: -1 },
          { row: -1, col: 0 },
          { row: 1, col: 0 },
          { row: 0, col: 2 },
          { row: 0, col: -2 },
        ];

        let found = false;
        for (const offset of offsets) {
          const testPos = {
            row: state.currentPiece.position.row + offset.row,
            col: state.currentPiece.position.col + offset.col,
          };
          if (!checkCollision(state.grid, newShape, testPos)) {
            newPosition = testPos;
            found = true;
            break;
          }
        }

        if (!found) {
          return state; // Can't rotate
        }
      }

      return {
        ...state,
        currentPiece: {
          ...state.currentPiece,
          rotation: newRotation,
          position: newPosition,
        },
      };
    }

    case 'PLACE_PIECE': {
      if (!state.currentPiece || state.animation.isRotating || state.animation.isFalling) {
        return state;
      }

      // Verify piece can be placed
      if (!canPlacePiece(state.grid, state.currentPiece)) {
        return state;
      }

      // Place the piece on the grid
      const newGrid = cloneGrid(state.grid);
      const shape = state.currentPiece.tetromino.shapes[state.currentPiece.rotation];
      const { position, tetromino } = state.currentPiece;

      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const gridRow = position.row + row;
            const gridCol = position.col + col;
            newGrid[gridRow][gridCol] = {
              filled: true,
              color: tetromino.color,
              pieceId: state.nextPieceId,
            };
          }
        }
      }

      return {
        ...state,
        grid: newGrid,
        currentPiece: null,
        nextPieceId: state.nextPieceId + 1,
      };
    }

    case 'PLACE_AND_SPAWN': {
      if (!state.currentPiece || state.animation.isRotating || state.animation.isFalling) {
        return state;
      }

      // Verify piece can be placed
      if (!canPlacePiece(state.grid, state.currentPiece)) {
        return state;
      }

      // Place the piece on the grid
      let newGrid = cloneGrid(state.grid);
      const shape = state.currentPiece.tetromino.shapes[state.currentPiece.rotation];
      const { position, tetromino } = state.currentPiece;

      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const gridRow = position.row + row;
            const gridCol = position.col + col;
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
      const newPosition = findValidPosition(newGrid, newTetromino, 0);

      // Check for game over
      if (!newPosition) {
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
      }

      return {
        ...state,
        grid: newGrid,
        currentPiece: newPosition ? {
          tetromino: newTetromino,
          rotation: 0,
          position: newPosition,
        } : null,
        nextPieceId: state.nextPieceId + 1,
        score: state.score + addedScore,
        linesCleared: state.linesCleared + addedLines,
      };
    }

    case 'ROTATE_BOARD': {
      if (state.animation.isRotating || state.animation.isFalling) {
        return state;
      }

      const { direction } = action;
      const rotatedGrid = rotateGrid(state.grid, direction);
      const newAngle = calculateRotationAngle(state.animation.rotationAngle, direction);

      return {
        ...state,
        grid: rotatedGrid,
        animation: {
          ...state.animation,
          rotationAngle: newAngle,
        },
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
      const position = findValidPosition(state.grid, tetromino, 0);

      // Check for game over
      if (!position) {
        const isOver = checkGameOver(state.grid, tetromino);
        if (isOver) {
          return {
            ...state,
            currentPiece: null,
            isGameOver: true,
          };
        }
      }

      return {
        ...state,
        currentPiece: position ? {
          tetromino,
          rotation: 0,
          position,
        } : null,
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

    case 'START_ANIMATION': {
      const { animationType } = action;
      return {
        ...state,
        animation: {
          ...state.animation,
          isRotating: animationType === 'rotating' ? true : state.animation.isRotating,
          isFalling: animationType === 'falling' ? true : state.animation.isFalling,
          isClearing: animationType === 'clearing' ? true : state.animation.isClearing,
        },
      };
    }

    case 'END_ANIMATION': {
      const { animationType } = action;
      return {
        ...state,
        animation: {
          ...state.animation,
          isRotating: animationType === 'rotating' ? false : state.animation.isRotating,
          isFalling: animationType === 'falling' ? false : state.animation.isFalling,
          isClearing: animationType === 'clearing' ? false : state.animation.isClearing,
        },
      };
    }

    case 'SET_ROTATION_ANGLE': {
      return {
        ...state,
        animation: {
          ...state.animation,
          rotationAngle: action.angle,
        },
      };
    }

    default:
      return state;
  }
}

// Custom hook for game state
export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  // Movement actions
  const movePiece = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    dispatch({ type: 'MOVE_PIECE', direction });
  }, []);

  const rotatePiece = useCallback(() => {
    dispatch({ type: 'ROTATE_PIECE' });
  }, []);

  const placePiece = useCallback(() => {
    dispatch({ type: 'PLACE_PIECE' });
  }, []);

  const placeAndSpawn = useCallback(() => {
    dispatch({ type: 'PLACE_AND_SPAWN' });
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

  // Animation actions
  const startAnimation = useCallback((animationType: 'rotating' | 'falling' | 'clearing') => {
    dispatch({ type: 'START_ANIMATION', animationType });
  }, []);

  const endAnimation = useCallback((animationType: 'rotating' | 'falling' | 'clearing') => {
    dispatch({ type: 'END_ANIMATION', animationType });
  }, []);

  // Game control
  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  return {
    state,
    movePiece,
    rotatePiece,
    placePiece,
    placeAndSpawn,
    rotateBoard,
    applyGravity,
    clearLines: clearLinesAction,
    spawnPiece,
    startAnimation,
    endAnimation,
    restart,
  };
}
