// Cell state in the grid
export type Cell = {
  filled: boolean;
  color: string | null;
  pieceId: number | null; // Unique ID for each placed piece (for gravity grouping)
};

// Position on the grid
export type Position = {
  row: number;
  col: number;
};

// Tetromino shape as a 2D array of booleans
export type TetrominoShape = boolean[][];

// Tetromino definition with all rotation variants
export type Tetromino = {
  name: string;
  color: string;
  shapes: TetrominoShape[]; // 4 rotation variants (0, 90, 180, 270)
};

// Current piece being placed
export type CurrentPiece = {
  tetromino: Tetromino;
  rotation: number; // 0-3 index into shapes array
  position: Position; // Top-left corner of bounding box
};

// Rotation direction for the board
export type RotationDirection = 'clockwise' | 'counterclockwise';

// Animation state
export type AnimationState = {
  isRotating: boolean;
  isFalling: boolean;
  isClearing: boolean;
  rotationAngle: number; // Current visual rotation (0, 90, 180, 270)
};

// Main game state
export type GameState = {
  grid: Cell[][];
  currentPiece: CurrentPiece | null;
  nextPieceId: number; // Counter for unique piece IDs
  score: number;
  linesCleared: number;
  isGameOver: boolean;
  animation: AnimationState;
};

// Game actions for the reducer
export type GameAction =
  | { type: 'MOVE_PIECE'; direction: 'up' | 'down' | 'left' | 'right' }
  | { type: 'ROTATE_PIECE' }
  | { type: 'PLACE_PIECE' }
  | { type: 'PLACE_AND_SPAWN' } // Places piece, clears lines, spawns new piece atomically
  | { type: 'ROTATE_BOARD'; direction: RotationDirection }
  | { type: 'APPLY_GRAVITY' }
  | { type: 'CLEAR_LINES' }
  | { type: 'SPAWN_PIECE' }
  | { type: 'SET_GAME_OVER' }
  | { type: 'RESTART' }
  | { type: 'START_ANIMATION'; animationType: 'rotating' | 'falling' | 'clearing' }
  | { type: 'END_ANIMATION'; animationType: 'rotating' | 'falling' | 'clearing' }
  | { type: 'SET_ROTATION_ANGLE'; angle: number };

// Scoring thresholds
export type ScoreMap = {
  [key: number]: number;
};
